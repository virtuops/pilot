<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class WorkFlowExecute {

        private $globalconf;
	private $con;
        private $l;
        private $s;
        private $wfdata;
        private $wfname;
        private $wfuser;
        private $wfpassword;
        private $wfv;
        private $wfmeta;
        private $taskmeta;
        private $wfserial;
        private $wfstarttime;
        private $wfstoptime;

        public function __construct()
        {
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();
                $this->wfstarttime = microtime(true);

        }

        public function WorkFlowExecuteOperation($action, $params, $con){


		$this->con = $con;
                if ($action == 'start') {
                        $this->Start($params, $con);
                } else if ($action == 'stop') {
                        $this->wfname = $params['wfname'];
                        $this->Stop($this->wfname, $con);
                } else if ($action == 'pause') {
                        $this->Pause($params, $con);
                } else if ($action == 'resume') {
                        $this->Resume($params, $con);
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                }


        }

        private function Start($params, $con) {
                date_default_timezone_set('UTC');
                $this->wfuser = $params['wfuser'];
                $this->wfpassword = $params['wfpassword'];
                $this->wfname = $params['wfname'];
                $this->wfv = isset($params['wfv']) ? $params['wfv'] : array();
                $this->wfmeta = isset($params['wfmeta']) ? $params['wfmeta'] : '';
                $this->wfmeta = json_encode($this->wfmeta);
                $this->taskmeta = isset($params['taskmeta']) ? $params['taskmeta'] : '';
                $this->wfserial = $this->WFSerial();
                $wfstart = date('Y-m-d H:i:s');
                $this->WFRecord($this->wfserial,$this->wfname,$this->wfuser,$wfstart,'null',$this->wfmeta,'null','start',$con);

                $this->l->varErrorLog('WF Start params are ');
                $this->l->varErrorLog($this->wfuser);
                $this->l->varErrorLog($this->wfpassword);
                $this->l->varErrorLog($this->wfname);
                $this->l->varErrorLog($this->wfv);
                $this->l->varErrorLog($this->wfmeta);
                $this->l->varErrorLog($this->taskmeta);

                //$this->UpdateTracker($this->wfname,'Start','start');
                $this->wfdata = $this->GetWFData($params, $con);

                $workflow = json_decode($this->wfdata);

                /*
                * Record the workflow name and start time, then get the links
                * For each link, get the end point
                *    1)  If end point is a task, run the task and save the task results
                *    2)  If the end point is a route, take the results from the task it was linked to and eval results
                *        and execute the next task.
                */

                $this->SetStateRunning($this->wfname, $con);


                foreach ($workflow->links as $linkid=>$link) {

                        $next = array();
                        foreach($link as $key=>$value) {
                                if ($key === 'fromOperator' && $value==='start') {
                                        array_push($next, $link->toOperator);
                                }
                        }

                $this->EvalOperators($next);

                }
                $status = "success";
                $msg = 'Started Workflow '.$this->wfname;
                $this->ReturnData($status, $msg);

        }

        private function SetStateRunning ($wfname, $con) {

        $sql = "update workflows set workflowstate = 'running' where workflowname = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param('s', $wfname);
        $stmt->execute();

        }

        private function SetStateStopped ($wfname, $con) {
        date_default_timezone_set('UTC');
        $sql = "update workflows set workflowstate = 'stopped' where workflowname = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param('s', $wfname);
        $stmt->execute();
        $wfstop = date('Y-m-d H:i:s');
        $this->wfstoptime = microtime(true);
        $wftime = $this->wfstoptime - $this->wfstarttime;

        $this->l->varErrorLog("START WORKFLOW TIME IS $this->wfstarttime");
        $this->l->varErrorLog("STOP WORKFLOW TIME IS $this->wfstoptime");
        $this->l->varErrorLog("TOTAL WORKFLOW TIME IS $wftime");
        $this->WFRecord($this->wfserial,$wfname,'null','null',$wfstop,'null',$wftime,'stop',$con);
        }

        private function GetState ($wfname, $con) {

        $sql = "select workflowstate from workflows where workflowname = ?";
        $wfs = '';
        $stmt = $con->prepare($sql);
        $stmt->bind_param('s', $wfname);
        $stmt->execute();
        $stmt->bind_result($wfs);
        $workflowstate = '';

                while ($stmt->fetch())
                {
                $workflowstate = $wfs;
                }

        $this->l->varErrorLog('GETTING WFSTATE '.$workflowstate);
        return $workflowstate;
        }


        private function EvalOperators($operators){
                $workflow = json_decode($this->wfdata);
                //need a foreach of links from start to task operators
          foreach ($workflow->links as $key=>$link) {
                if ($link->fromOperator === 'start') {
                        foreach ($operators as $op){
                                if ($link->toOperator === $op) {
                                        $this->RunTask($op);
                                } else if (preg_match('/route/', $op) === 1){
                                        //Need to consider this...when would we have a Start node, then a route?  There is no output after start.
                                        //Do nothing....what is there to eval????
                                }
                        }
                }

          }
        }

        private function RunTask($op){
                $settings = $this->s->getSettings();
                $curl = $settings['curl'];
		$con = $this->con;
                $weburl = $settings['weburl'];
                $workflow = json_decode($this->wfdata);
                $wfuser = $this->wfuser;
                $wfname = $this->wfname;
                $wfv = $this->wfv;
                $taskmetadata = $this->taskmeta;
                $wfpassword = $this->wfpassword;
                $taskname = $workflow->operators->{$op}->properties->task->taskname;
                $runbookid = $workflow->operators->{$op}->properties->task->runbookid;
                $objecttype = $workflow->operators->{$op}->properties->task->taskname;
                $wfstate = $this->GetState($wfname, $con);
                $to_op = '';
                $from_conn_id = '';
                $from_op = $op;
                //$problems = array();
                //$problems = $this->p->ProblemLogOperation('getids',$wfname);
                $parray = '';
                $pcount = 1;

                $params = $this->GetParams($workflow->operators->{$op}->properties->task->parameters, $wfv);
                $taskmeta = json_encode($taskmetadata);
                $this->l->varErrorLog("TASK META IS NOW $taskmeta");

                if ($wfstate === 'running') {
                $runtask = $curl.' -s -X POST -H "Content-Type: application/json" -u "'.$wfuser.':'.$wfpassword.'" -d\'{"runbook":"'.$runbookid.'","username":"'.$wfuser.'","taskname":"'.$taskname.'","taskmetadata":'.$taskmeta.',"params":'.$params.'}\' '.$weburl.'/app/server/api/index.php/task_run 2>&1';

                $this->l->varErrorLog('WORKFLOWEXECUTE FIRING '.$runtask);
                $taskoutput = `$runtask`;
                $tout_array = preg_split("/\n+/",$taskoutput);
                $taskserial = $tout_array[count($tout_array)-2];

                $this->WFTaskRecord($taskserial, $this->wfserial, $con);

                foreach ($workflow->links as $key=>$val) {
                        if ($val->fromOperator === $op) {
                                $from_conn_id = $val->fromConnector;
                                $to_op = $val->toOperator;
                                $this->l->varErrorLog('TASKOUT IS....');
                                $this->l->varErrorLog($taskoutput);
                                $taskoutvars = preg_split("/\n+/",$taskoutput);
                                $toutput = end($taskoutvars);
                                $this->l->varErrorLog('TASKOUT OUTPUT IS ....');
                                $this->l->varErrorLog($toutput);
                                $this->GetNextOperator($from_op, $from_conn_id, $to_op, $toutput);
                        }
                }

                } else {
                        $this->l->varErrorLog("$wfname is not running");
                        exit();
                }

        }

        private function EvalRoute($op, $output=null){
                $workflow = json_decode($this->wfdata);
                //print "Evaluating Route ".$workflow->operators->{$op}->properties->title." with output ".$output."\n";
                $taskout = json_decode($output);
                $outputs = $workflow->operators->{$op}->properties->outputs;
                $getnext = 0;
                $next_arr = array();
                $nexthop = new \stdClass;

                foreach ($outputs as $key=>$value) {
                        $comp_param = $value->parameter;
                        $comp_compare = $value->comparison;
                        $comp_value = $value->value;
                        $outputid = $key;

                        //print "Process route is sending $op, $key, $comp_param, $comp_compare, $comp_value\n";
                        $getnext = $this->ProcessRoute ($taskout, $op, $key, $comp_param, $comp_compare, $comp_value);
                        //print "Get next is ".$getnext."\n";
                        if ($getnext === 1) {
                        $nexthop->fromop = $op;
                        $nexthop->fromconnid = $key;
                        foreach ($workflow->links as $key=>$val) {
                                if ($val->fromOperator === $op && $val->fromConnector === $outputid) {
                                        $nexthop->toop = $val->toOperator;
                                }
                        }
                        array_push($next_arr, $nexthop);
                        }
                }

                foreach ($next_arr as $gn) {
                        $from_op = $gn->fromop;
                        $from_conn_id = $gn->fromconnid;
                        $to_op = $gn->toop;
                        $this->GetNextOperator($from_op, $from_conn_id, $to_op, $taskout);
                }
        }

        private function ProcessRoute ($taskout, $current_op, $outputid, $param, $compare, $value) {
                $workflow = json_decode($this->wfdata);

                foreach ($workflow->links as $key=>$link) {
                        if ($current_op === $link->fromOperator && $link->fromConnector === $outputid) {
                                $getnext = 0;
                        if ($compare === '=') {
                               if ($taskout->{$param} === $value) {
                               $getnext = 1;
                               }
                        } else if ($compare === '>') {
                                if ($taskout->{$param} > $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<') {
                                if ($taskout->{$param} < $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '>=') {
                                if ($taskout->{$param} >= $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<=') {
                                if ($taskout->{$param} <= $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<>') {
                                if ($taskout->{$param} !== $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === 'LIKE') {
                                $search = ".*".$taskout->{$param}.".*";
                                if (preg_match("/$value/", $search) === 1) {
                                $getnext = 1;
                                }
                        } else if ($compare === 'NOT LIKE') {
                                $search = ".*".$taskout->{$param}.".*";
                                if (preg_match("/$value/", $search) !== 1) {
                                $getnext = 1;
                                }
                        }
                        return $getnext;
                }
         }
        }

        private function GetParams($params, $wfv){

                $this->l->varErrorLog("PARAMS....");
                $this->l->varErrorLog($params);
                $this->l->varErrorLog("WFV....");
                $this->l->varErrorLog($wfv);

                $p_array = json_decode($params, true);

                foreach ($wfv as $key=>$value) {

                $params = str_replace("$key","$value","$params",$replcount);

                }

                if (strlen($params) == 0) {
                $params = '{}';
                }

                $params = str_replace("'", "\u0027", $params);

                $this->l->varErrorLog("JSON REPL IS ....");
                $this->l->varErrorLog("$params");
                return $params;

        }

        private function Stop($wfname) {
                $wfname = $this->wfname;
                $status = "success";
                $msg = "$wfname has stopped.";
                //$this->UpdateTracker($this->wfname,'Stop','end');
                $this->SetStateStopped($wfname, $this->con);
                $this->ReturnData($status, $msg);
        }

        function GetNextOperator($from_op, $from_conn_id, $to_op, $output=null){
                $workflow = json_decode($this->wfdata);
                $wfname = $this->wfname;

                        //left off here, this seems to make sense.  Need to keep it from getting too stupid with all the loops.
                foreach ($workflow->links as $key=>$link) {
                        if ($link->fromOperator === $from_op && $link->fromConnector = $from_conn_id && $link->toOperator == $to_op) {
                                $next_op = $to_op;
                                if (preg_match('/task/', $next_op) === 1) {
                                        $this->RunTask($next_op);
                                } else if (preg_match('/route/', $next_op) === 1){
                                        $this->EvalRoute($next_op, $output);
                                } else if (preg_match('/end/', $next_op) === 1) {
                                        $this->Stop($wfname, $this->con);
                                }
                        }
                }
        }



                private function GetWFData($params=null, $con) {

                $wfname = $params['wfname'];

                $sql = '';
                $sql = "select workflowdata from workflows where workflowname = '$wfname' and workflowstatus in ('enabled','scheduled')";
                $response = $con->query($sql);

                $records = array();
                $rows = array();
                $recid = 1;

                while ($obj = $response->fetch_assoc())
                        {
                                $obj['recid'] = $recid;
                                $rows[] = $obj;
                                $recid = $recid + 1;
                        }

                $records['total'] = count($rows);
                $records['records'] = $rows;

                return $records['records'][0]['workflowdata'];


        }

        private function WFSerial() {

                $possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                $workflowserial = '';

                for ($i = 0; $i < 15; $i++) {
                        $workflowserial .= $possibleChars[rand(0, strlen($possibleChars)-1)];
                }

                return $workflowserial;


        }

        private function ReturnData($status, $msg){
                        header('Content-Type: application/json');
                        echo '{"status": "'.$status.'","message":"'.$msg.'"}';
                        if ($status === 'error') {
                                exit();
                        }
        }

        private function WFRecord($wfserial,$wfname,$username,$wfstart,$wfend,$wfmeta,$wftime,$function,$con) {

        if ($function == 'start') {
        $sql = "INSERT INTO workflowhist (wfserial, workflowname, username, wfstart, wfmetadata) values (?,?,?,?,?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param('sssss', $wfserial,$wfname,$username,$wfstart,$wfmeta);
        $stmt->execute();

        }

        if ($function == 'stop') {
        $sql = "UPDATE workflowhist SET wfend = ?, wftime = ? where wfserial = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param('sss', $wfend, $wftime, $wfserial);
        $stmt->execute();
        }

        }

        private function WFTaskRecord($taskserial, $wfserial, $con){

        $sql = "INSERT INTO wf_tasks (wfserial, taskserial) values (?,?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param('ss', $wfserial,$taskserial);
        $stmt->execute();


        }

}

