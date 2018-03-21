<?php

require_once __DIR__.'/../utils/Log.php';
require_once 'Settings.php';

Class Upload {

        private $globalconf;
        private $l;
        private $con;
        private $s;


        public function __construct()
        {
                $this->l = new Log();
                $this->globalconf = parse_ini_file(__DIR__.'/../config.ini');
                $this->s = new Settings();
                $settings = $this->s->getSettings();
                $host = $settings['dbhost'];
                $username = $settings['dbuser'];
                $password = $settings['dbpass'];
                $dbname = $settings['dbname'];
                $port = $settings['dbport'];

//              $this->l->varErrorLog("DB Settings $host $username $password $dbname $port");
                //$con = new mysqli($host, $username, $password, $dbname, $port);

                //if ($con->connect_errno) {
                //$this->l->varErrorLog("Connect failed: ", $con->connect_error);
                //} else {
 //             $this->l->varErrorLog("Got DB Con");
                //}


        }

        public function UploadOperation($action, $params, $con){

                if ($action == 'uploadaction') {
                        $this->UploadAction($params, $con);
                } else if ($action == 'uploadtextfile') {
                        $this->UploadTextFile($params, $con);
                }

        }

        private function ReturnData($status, $msg){

                        header('Content-Type: application/json');
                        echo '{"status": "'.$status.'","message":"'.$msg.'"}';

                        if ($status === 'error') {
                                exit();
                        }

        }

        private function UploadAction($params, $con){

                //$json = isset($params->json) ? $params->json : (isset($params['json']) ? $params['json'] : '');
                $this->l->varErrorLog("UploadAction Params ");
                $this->l->varErrorLog($params);
                $zipfiles = $params->actionpackage;
                $tmpdir = $this->globalconf['basedir'].'/tmp';

                $this->l->varErrorLog($this->globalconf);
                $numfiles = 0;

                //START UNPACKING....

                foreach ($zipfiles as $zipfile) {

                $name = $zipfile->name;
                $tmpfile = $tmpdir.'/'.$name;
                $content = base64_decode($zipfile->content);
                $bytes = file_put_contents($tmpfile, $content);
                $this->l->varErrorLog("BYTES ".$bytes);

                        if ($bytes > 0) {
                        $this->l->varErrorLog("IN BYTES");
                        $createPackage = $this->UnZipFile($tmpfile, $name, $con);
                        if ($createPackage == 'Success') {
                                $this->l->varErrorLog("CREATE PACKAGE: ".$createPackage);
                                $numfiles = $numfiles + 1;
                                } else {
                                $this->l->varErrorLog('{"status":"error","message":"'.$createPackage.'"}');
                                $message = $createPackage;
                                $this->ReturnData('error',$message);
                                }
                        } else {
                        $this->l->varErrorLog('{"status":"error","message":"'.$name.'" did not load, please make sure that your basedir is set in settings, which should be the directory into which you installed VirtuOps™."}');
                        $message = "$name did not load, please make sure that your basedir is set in settings, which should be the directory into which you installed VirtuOps™.";
                        $this->ReturnData('error',$message);
                        }

                } //END UNPACK FOREACH

                if ($numfiles == count($zipfiles)) {
                        $this->l->varErrorLog('{"status":"success","message":"Num files '.$numfiles.'= zip files '.count($zipfiles).'"}');
                        $this->ReturnData('success','Packages Loaded');

                } else {
                        $message = "Your files did not load properly.  If you are uploading packages you obtained for the VirtuOps website, please send the package to support@virtuops.com with any error messages you see.";

                        $this->l->varErrorLog('{"status": "error", "message": "Your files did not load properly.  If you are uploading packages you obtained for the VirtuOps website, please send the package to support@virtuops.com with any error messages you see." }');
                        $this->ReturnData('error',$message);

                }

        }

        private function UploadTextFile($params, $con){

                //$json = isset($params->json) ? $params->json : (isset($params['json']) ? $params['json'] : '');
                $this->l->varErrorLog("UploadTextFile Params ");
                $this->l->varErrorLog($params);

                $textfiles = $params->textfilename;
                $tmpdir = $this->globalconf['basedir'].'/tmp/files';
                //$tmpdir = '/var/www/html/nochero/tmp';

                $this->l->varErrorLog($this->globalconf);

                foreach ($textfiles as $textfile) {
                $name = $textfile->name;
                $tmpfile = $tmpdir.'/'.$name;
                $content = base64_decode($textfile->content);
                $bytes = file_put_contents($tmpfile, $content);
                if ($bytes > 0 ) {
                        $message = 'File uploaded';
                        $this->ReturnData('success',$message);

                } else {
                        $message = 'File upload failed';
                        $this->ReturnData('error',$message);

                }

                }

        }

        private function AddAction($actionfile,$filename,$con){

                $copyAction = copy($actionfile, $this->globalconf['basedir'].'/app/server/actiontext/'.$filename);
                return $copyAction;


        }

        private function UnZipFile($zipfile, $name, $con) {

                //TODO, need to specify unzip location in settings at install time and add tmp dir in build

                $unzip = $this->globalconf['unzip'];
                $tmpdir = $this->globalconf['basedir'].'/tmp';
                $longdirparts = explode('_', $name);
                $zipname = end($longdirparts);
                $dirparts = explode('.', $zipname);
                $targetdir = $dirparts[0];


                //UNPACK THE FILE INTO TMP DIR.  SHOULD CREATE A DIR UNDER <ROOT>/tmp/$targetdir with all contents
                `$unzip -o -d $tmpdir $zipfile`;


                if (file_exists($tmpdir.'/'.$targetdir)) {

                        if (file_exists($tmpdir.'/'.$targetdir.'/ActionParams.json')){
                                $actionparams = file_get_contents($tmpdir.'/'.$targetdir.'/ActionParams.json');
                                $actionparams = json_decode($actionparams);
                                $modulesComply = $this->CheckModules($actionparams);
                                if ($modulesComply === true) {
                                        $addAction = $this->AddAction($tmpdir.'/'.$targetdir.'/'.$actionparams->actioncodefile, $actionparams->actioncodefile,$con);
                                        if ($addAction) {
                                                $taskFields = $tmpdir.'/'.$targetdir.'/outputfields.txt';
                                                $addTaskParams = $this->AddTaskParams($actionparams, $taskFields, $tmpdir.'/'.$targetdir, $con);
                                                if ($addTaskParams) {

                                                } else {//Something wrong with mysql insert/update of task table

                                                $message = "Could not add Task Fields or params for the task.  If you got this from the VirtuOps Action Library, please send an email to support@virtuops.com and attach the package zip file.";
                                                $this->l->varErrorLog('{"status":"error","message":"Could not add Task Fields or params for the task.  If you got this from the VirtuOps Action Library, please send an email to support@virtuops.com and attach the package zip file."}');
                                                $this->ReturnData('error',$message);

                                                }

                                        } else {//Something wrong with copy
                                                $message = "Could not copy the action script.  Please make sure that your ".$tmpdir."/".$targetdir."/".$actionparams->actioncodefile." and your ".$this->globalconf['basedir']."/app/server/actiontext directory exists and are writable by the user that is running your web server.";
                                                $this->l->varErrorLog('{"status":"error","message":"Could not copy the action script.  Please make sure that your "'.$tmpdir.'"/"'.$targetdir.'"/"'.$actionparams->actioncodefile.'" and your "'.$this->globalconf['basedir'].'"/app/server/actiontext directory exists and are writable by the user that is running your web server."}');
                                                $this->ReturnData('error',$message);

                                        }


                                } else { //perldoc failed
                                        $this->ReturnData('error',$modulesComply);
                                }



                        } else {  //ActionParams.json is missing or corrupt

                        $message = "ActionParams.json is missing.  Package install failed.";
                        $this->l->varErrorLog('{"status":"error","message":"ActionParams.json is missing.  Package install failed."}');
                        $this->ReturnData('error',$message);
                        //exit();

                        }



                } else { //UNZIP FAILED

                        $message = "Unzip operation failed";
                        $this->l->varErrorLog('{"status":"error","message":"Unzip operation failed"}');
                        $this->ReturnData('error',$message);
                        //exit();

                }
                return "Success";

        }

        private function CheckModules($actionparams){

        $modules = $actionparams->libs;
        $language = $actionparams->actionlanguage;

                if (count($modules) == 0) {
                        return true;
                } else {
                        if ($language == 'perl') {
                                $modulesGood = false;
                                $modnum = 1;
                                foreach ($modules as $mod) {
                                        //TODO, add perldoc full path to settings and install
                                        $modprop = "module".$modnum;
                                        $modname = $mod->{$modprop};
                                        $perldoc = $this->globalconf['perldoc'];
                                        $isMod = `$perldoc -l $modname 2>&1`;
                                        $isMod = preg_replace('/[\r\n]+/','', $isMod);
                                        $this->l->varErrorLog("MOD");
                                        $this->l->varErrorLog($isMod);

                                        if ($isMod == 'No documentation found for "'.$modname.'".') {
                                                $message = "$modname is not loaded.  Please use CPAN or yum to install this PERL module, then try to upload again.";
                                                return $message;
                                        } else {
                                                $modulesGood = true;
                                        }
                                        $modnum = $modnum + 1;

                                } //END foreach through modules

                                return $modulesGood;

                        } //END language = perl
                }


        }

        private function AddTaskParams($taskparams, $fields, $targetdir, $con) {

                $this->l->varErrorLog('Task params: ');
                $this->l->varErrorLog($taskparams);

                $actioncode = file_get_contents($targetdir.'/'.$taskparams->actioncodefile);

                $taskname=$taskparams->taskname;
                $urlparams=$taskparams->urlparams;
                $userparams = '';
                $actiontext = $actioncode;
                $actionlanguage=$taskparams->actionlanguage;
                $actionfilename=$taskparams->actionfilename;
                $outputfields = file_get_contents($fields);
                $outputactions = '';
                $taskdescription=$taskparams->taskdescription;
                $tasktype=$taskparams->tasktype;
                $datatype=$taskparams->datatype;
                $jprop = '';
                $fieldseparator=$taskparams->fieldseparator;
                $recordseparator=$taskparams->recordseparator;
                $iframesrc = '';
                $htmlcode = '';
                $instructions = '';

                $sql = "replace into tasks (taskname, urlparams, userparams, actiontext, actionlanguage, actionfilename, outputfields, outputactions, taskdescription, tasktype, datatype, jprop, fieldseparator, recordseparator, iframesrc, htmlcode, instructions) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                $this->l->varErrorLog("\nExecuting sql $sql\n");

                $this->l->varErrorLog("\nExecuting sql $sql\n");
                $stmt = $con->prepare($sql);

                $stmt->bind_param('sssssssssssssssss', $taskname, $urlparams, $userparams, $actiontext, $actionlanguage, $actionfilename, $outputfields, $outputactions, $taskdescription, $tasktype,$datatype, $jprop, $fieldseparator, $recordseparator, $iframesrc, $htmlcode, $instructions);
                $stmt->execute();

                $this->l->varErrorLog("Upload DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

                if ($con->error) {
                        return false;
                } else {
                        return true;
                }


        }

}

