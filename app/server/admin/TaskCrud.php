<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class Task {

        private $globalconf;
        private $con;
        private $l;
        private $s;

        public function __construct()
        {
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();
                $host = $settings['dbhost'];
                $username = $settings['dbuser'];
                $password = $settings['dbpass'];
                $dbname = $settings['dbname'];
                $port = $settings['dbport'];

//                $this->l->varErrorLog("DB Settings $host $username $password $dbname $port");
//                $con = new mysqli($host, $username, $password, $dbname, $port);


        }

        public function TaskOperation($action, $params, $con)
        {
                if ($action == 'save') {
                        $this->CreateUpdate($params, $con);
                } else if ($action == 'wftaskupdate') {
                        $this->WFUpdate($params, $con);
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                } else if ($action == 'delete') {
                        $this->Delete($params, $con);
                }
        }

        private function CreateUpdate($params, $con)
        {
                $this->l->varErrorLog("TaskCreateUpdate: New Params are");

                $taskname = $params['taskname'];
                $urlparams = isset($params['urlparams']) ? $params['urlparams'] : '';
                $userparams = $params['userparams'] ? $params['userparams'] : '';

                $actiontext = ($params['actiontext'] ? $params['actiontext'] : '');
                $actionlanguage = ($params['actionlanguage'] ? $params['actionlanguage'] : '');
                $actionfilename = $params['actionfilename'] ? $params['actionfilename'] : '';
                $taskdescription = $params['taskdescription'] ? $params['taskdescription'] : '';
                $datatype = 'JSON';
                $jprop = $params['jprop'] ? $params['jprop'] : '';
                $fieldseparator = $params['fieldseparator'] ? $params['fieldseparator'] : '';
                $recordseparator = $params['recordseparator'] ? $params['recordseparator'] : '';
                $outputfields = $params['outputfields'] ? $params['outputfields'] : '';
                $outputactions = $params['outputactions'] ? $params['outputactions'] : '';
                $saveoptions = isset($params['saveoptions']) ? $params['saveoptions'] : '';

                // Perform syntax checking first, if error then we skip saving the task.
                if ($saveoptions != 'force') {
                    $actionfilenamefile = __DIR__.'/../actiontext/'.$actionfilename;
                    file_put_contents($actionfilenamefile, $actiontext);
                    chmod($actionfilenamefile, 0775);

                    // Check if the actiontext syntax checks out.
                    $err = $this->lintFile($actionfilenamefile, $actionlanguage);
                    if ($err) {
                            echo "LINTERROR:$err";
                            return;
                    }
                }


                $sql = "replace into tasks (taskname, urlparams, userparams, actiontext, actionlanguage, actionfilename, outputfields, outputactions, taskdescription, datatype, jprop, fieldseparator, recordseparator) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                $this->l->varErrorLog("\nExecuting sql $sql\n");
                $stmt = $con->prepare($sql);

                $stmt->bind_param('sssssssssssss', $taskname, $urlparams, $userparams, $actiontext, $actionlanguage, $actionfilename, $outputfields, $outputactions, $taskdescription,$datatype, $jprop, $fieldseparator, $recordseparator);
                $stmt->execute();

                $this->l->varErrorLog("TaskCreateUpdate DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

                // Return the current grid output so we can refresh the event list.
		$params = array();
                $this->Read($params, $con);
        }

        private function WFUpdate($params, $con) {

                $this->l->varErrorLog("WFUpdate Params are ");
                $this->l->varErrorLog($params);

                $taskname = $params['taskname'];
                $urlparams = $params['urlparams'] ? $params['urlparams'] : '';
                $actionlanguage = $params['actionlanguage'] ? $params['actionlanguage'] : '';
                $actionfilename = $params['actionfilename'] ? $params['actionfilename'] : '';
                $actiontext = $params['actiontext'] ? $params['actiontext'] : '';
                $taskdescription = $params['taskdescription'] ? $params['taskdescription'] : '';

                $sql = "update tasks set urlparams = ?, actiontext = ?, taskdescription = ? where taskname = ?";

                $stmt = $con->prepare($sql);

                $stmt->bind_param('ssss', $urlparams, $actiontext, $taskdescription, $taskname);
                $stmt->execute();

                if ($saveoptions != 'force') {
                                $this->l->varErrorLog("WFUpdate Writing new file ");
                                $actionfilenamefile = __DIR__.'/../actiontext/'.$actionfilename;
                                file_put_contents($actionfilenamefile, $actiontext);
                                chmod($actionfilename, 0775);

                                // Check if the actiontext syntax checks out.
                                $err = $this->lintFile($actionfilenamefile, $actionlanguage);
                                if ($err) {
                                        echo "LINTERROR:$err";
                                        return;
                                }
                }

                $this->l->varErrorLog("WFUpdate DB Error: ");
                $this->l->varErrorLog($stmt->error);
                $this->l->varErrorLog($con->error);
        }

        private function lintFile($filename, $language) {
                $cmd = '';
                if ($language == 'php')
                    $cmd = "php -l $filename";
                else if ($language == 'perl')
                    $cmd = "perl -cw $filename";

                // Use proc_open to record stderr.
                $desc = array(
                            0 => array("pipe", "r"),
                            1 => array("pipe", "w"),
                            2 => array("pipe", "w")
                        );
                $process = proc_open($cmd, $desc, $pipes, dirname(__FILE__), null);
                $stdout = stream_get_contents($pipes[1]);
                $stderr = stream_get_contents($pipes[2]);
                fclose($pipes[1]);
                fclose($pipes[2]);

                $exit = proc_close($process);
                $this->l->varErrorLog("\n\ntask status of $language lint on file $filename\noutput is ".json_encode($stdout)."\nerr is ".json_encode($stderr)."\nexit is $exit\n\n");

                if ($exit === 0)
                    return false;
                else
                    return $stderr;
        }

        private function Read($params, $con) {

                //$this->l->varErrorLog("TaskRead DB PARAMS: ");
                //$this->l->varErrorLog($params);

                $sql = '';
                $taskname = isset($params->taskname) ? $params->taskname : (isset($params['taskname']) ? $params['taskname'] : 'empty');

                if ($taskname === 'empty') {
                $sql = "select * from tasks";
                } else {
                $sql = "select * from tasks where taskname = '$taskname'";
                }

                $response = $con->query($sql);

                //$this->l->varErrorLog("TaskRead DB Error: ");
                //$this->l->varErrorLog($con->error);

                $records = array();
                $rows = array();
                $recid = 1;

                while ($obj = $response->fetch_assoc())
                        {
                                $obj['recid'] = $recid;
                                $rows[] = $obj;
                                $recid = $recid + 1;
                        }

                //$this->l->varErrorLog("Returning:");
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                //$this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;

        }

        private function Delete($params, $con)
        {
                $this->l->varErrorLog("Task Delete Params");
                $this->l->varErrorLog($params);

                $taskname = $params[0]->taskname ? $params[0]->taskname : ($params[0]['taskname'] ? $params[0]['taskname'] : 'empty');
                if (strpos($taskname, '(') !== false) {
                        $sql = "delete from tasks where taskname in $taskname";
                        $stmt = $con->prepare($sql);
                } else {
                        $sql = "delete from tasks where taskname = ?";
                        $stmt = $con->prepare($sql);
                        $stmt->bind_param('s', $taskname);
                }
                $this->l->varErrorLog("Executing statement $sql");
                $stmt->execute();

                $this->l->varErrorLog("TaskDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

		$params = array();
                $this->Read($params, $con);
        }
}


