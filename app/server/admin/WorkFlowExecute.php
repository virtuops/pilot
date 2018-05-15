<?php

require_once 'Settings.php';
require_once 'IfElse.php';
require_once 'WFParams.php';
require_once __DIR__.'/../utils/Log.php';

Class WorkFlowExecute {

        private $globalconf;
        private $con;
        private $l;
        private $s;
        private $wfdata;
        private $wfname;
        private $wfuser;
        private $wfparams;
        private $wfpassword;
        private $wfv;
        private $wfmeta;
        private $taskmeta;
        private $wfserial;
        private $wfstarttime;
        private $wfstoptime;
        private $lastout;
        private $ifelse;

        public function __construct()
        {
                $this->s = new Settings();
                $this->l = new Log();
                $this->ifelse = new IfElse();
                $this->wfparams = new WFParams();
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
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                }


        }

        private function Start($params, $con) {
                date_default_timezone_set('UTC');
                $this->wfuser = $params['wfuser'];
                $this->wfpassword = $params['wfpassword'];
                $this->wfname = $params['wfname'];
                $this->wfv = isset($params['wfv']) ? $params['wfv'] : new stdClass();
                $this->wfmeta = isset($params['wfmeta']) ? $params['wfmeta'] : '';
                $this->wfmeta = json_encode($this->wfmeta);
                $this->taskmeta = isset($params['taskmeta']) ? $params['taskmeta'] : '';
                $this->wfserial = $this->WFSerial();
                $wfstart = date('Y-m-d H:i:s');
                $this->WFRecord($this->wfserial,$this->wfname,$this->wfuser,$wfstart,'null',$this->wfmeta,'null','start',$con);

                $this->wfdata = $this->GetWFData($params, $con);

                $workflow = json_decode($this->wfdata);

                $this->SetStateRunning($this->wfname, $con);

                $next = array();

                foreach ($workflow->links as $linkid=>$linkobj)  {
                        foreach($linkobj as $key=>$value) {
                                if ($key === 'fromOperator' && $value==='start') {
                                        array_push($next, $linkobj->toOperator);
                                }
                        }

                }
                $this->EvalFirstOperators($next);
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

        return $workflowstate;
        }


        private function EvalFirstOperators($operators){
              foreach ($operators as $op) {
                      if (substr($op, 0, 4) === 'task') {
                              $this->RunTask($op);
                      } else if (substr($op, 6, 5) === 'while') {
                                $this->EvalRoute('while',$op);
                      } else if (substr($op, 6, 7) === 'foreach') {
                                $this->EvalRoute('while',$op);
                      } else if (substr($op, 6, 8) === 'continue') {
                                $this->EvalRoute('continue',$op);
                      } else if (substr($op, 6, 5) === 'break') {
                                $this->EvalRoute('break',$op);
                      } else {
                              $status = "Error";
                              $msg = "Logic or Task not found";
                              $this->ReturnData($status, $msg);
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
                $parray = '';
                $pcount = 1;

                $params = $this->GetParams($workflow->operators->{$op}->properties->task->parameters, $wfv);
                $taskmeta = json_encode($taskmetadata);

                if ($wfstate === 'running') {
                $runtask = $curl.' -s -X POST -H "Content-Type: application/json" -u "'.$wfuser.':'.$wfpassword.'" -d\'{"runbook":"'.$runbookid.'","username":"'.$wfuser.'","taskname":"'.$taskname.'","taskmetadata":'.$taskmeta.',"params":'.$params.'}\' '.$weburl.'/app/server/api/index.php/task_run 2>&1';

                $this->l->varErrorLog('WORKFLOWEXECUTE FIRING '.$runtask);
                $taskoutput = `$runtask`;
                $tout_array = preg_split("/\n+/",$taskoutput);
                $taskserial = $tout_array[count($tout_array)-2];
                $toutput = end($tout_array);

                $this->lastout = $toutput;

                $this->WFTaskRecord($taskserial, $this->wfserial, $con);
                $this->AddOutputToWFV($taskname, $this->lastout);

                $nextobj = $this->GetConnIdTask($workflow->links, $op);
                $this->GetNextOperator($from_op, $nextobj[0], $nextobj[1], $toutput);

                } else {
                        $this->l->varErrorLog("$wfname is not running");
                        exit();
                }

        }

        private function AddOutputToWFV($lasttask, $lastout) {
                $wfv = $this->wfv;
                $lo_array = json_decode($lastout);
                foreach ($lo_array as $k=>$v) {
                $wfv->{$k} = $v;
                }
                $this->wfv = $wfv;
                $this->l->varErrorLog('WFV IS');
                $this->l->varErrorLog($this->wfv);
        }

        private function EvalRoute($logic, $op, $output=null){
                $workflow = json_decode($this->wfdata);
                $taskout = json_decode($output);
                $outputs = $workflow->operators->{$op}->properties->outputs;
                $getnext = 0;
                $next_arr = array();
                $nexthop = new \stdClass;

                if ($logic === 'if-else') {
                        foreach ($outputs as $key=>$value) {
                                $comp_param = $value->parameter;
                                $comp_compare = $value->comparison;
                                $comp_value = $value->value;
                                $comp_increment = $value->increment;
                                $outputid = $key;
                                $getnext = $this->ifelse->ProcessRoute($this->wfv, $workflow, $taskout, $op, $key, $comp_param, $comp_compare, $comp_value);
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
                } else if ($logic == 'while') {

                        $this->wfv->{$op}->counter = 0;
                        $this->wfv->{$op}->compare = $workflow->operators->{$op}->properties->outputs->output_1->comparison->text;
                        $this->wfv->{$op}->value = $workflow->operators->{$op}->properties->outputs->output_1->value;
                        $this->wfv->{$op}->increment = $workflow->operators->{$op}->properties->outputs->output_1->increment;

                        $nextobj = $this->GetConnIdTask($workflow->links, $op);
                        $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);

                } else if ($logic == 'foreach') {

                        $targetobject = $workflow->operators->{$op}->properties->outputs->output_1->targetobject;
                        $this->wfv->{$op}->targetobject = $targetobject;
                        $this->wfv->{$op}->{$targetobject}->current_val = current($this->wfv->{$targetobject});
                        $this->wfv->{$op}->{$targetobject}->current_key = key($this->wfv->{$targetobject});
                        $this->wfv->{$op}->{$targetobject}->length = count($this->wfv->{$targetobject});
                        $this->wfv->{$op}->{$targetobject}->incr = 1;

                        $nextobj = $this->GetConnIdTask($workflow->links, $op);
                        $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);

                } else if ($logic == 'continue') {
                        $loop = $workflow->operators->{$op}->properties->loopid;

                        if (substr($loop,6,5) == 'while') {
                                $counter = (int)$this->wfv->{$loop}->counter;
                                $compare = $this->wfv->{$loop}->compare;
                                $value = (int)$this->wfv->{$loop}->value;
                                $increment = (int)$this->wfv->{$loop}->increment;
                                if ($compare === '>') {
                                        if ($counter > $value) {
                                                $this->wfv->{$loop}->counter = $counter + $increment;
                                                $nextobj = $this->GetConnIdTask($workflow->links, $loop);
                                                $this->GetNextOperator($loop, $nextobj[0], $nextobj[1], $taskout);

                                        } else {
                                                $nextobj = $this->GetConnIdTask($workflow->links, $op);
                                                $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);
                                        }
                                } else if ($compare === '<') {
                                        if ($counter < $value) {
                                                $this->wfv->{$loop}->counter = $counter + $increment;
                                                $nextobj = $this->GetConnIdTask($workflow->links, $loop);
                                                $this->GetNextOperator($loop, $nextobj[0], $nextobj[1], $taskout);

                                        } else {
                                                $nextobj = $this->GetConnIdTask($workflow->links, $op);
                                                $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);
                                        }

                                } else if ($compare === '<=') {
                                        if ($counter <= $value) {
                                                $this->wfv->{$loop}->counter = $counter + $increment;
                                                $nextobj = $this->GetConnIdTask($workflow->links, $loop);
                                                $this->GetNextOperator($loop, $nextobj[0], $nextobj[1], $taskout);

                                        } else {
                                                $nextobj = $this->GetConnIdTask($workflow->links, $op);
                                                $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);
                                        }

                                } else if ($compare === '>=') {
                                        if ($counter >= $value) {
                                                $this->wfv->{$loop}->counter = $counter + $increment;
                                                $nextobj = $this->GetConnIdTask($workflow->links, $loop);
                                                $this->GetNextOperator($loop, $nextobj[0], $nextobj[1], $taskout);

                                        } else {
                                                $nextobj = $this->GetConnIdTask($workflow->links, $op);
                                                $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);
                                        }

                                } else if ($compare === '=') {
                                        if ($counter = $value) {
                                                $this->wfv->{$loop}->counter = $counter + $increment;
                                                $nextobj = $this->GetConnIdTask($workflow->links, $loop);
                                                $this->GetNextOperator($loop, $nextobj[0], $nextobj[1], $taskout);

                                        } else {
                                                $nextobj = $this->GetConnIdTask($workflow->links, $op);
                                                $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);
                                        }
                                }
                        } else if (substr($loop,6,7) == 'foreach') {

                                $targetobject = $this->wfv->{$loop}->targetobject;
                                $size = $this->wfv->{$loop}->{$targetobject}->length;
                                $incr = $this->wfv->{$loop}->{$targetobject}->incr;

                                if ($incr < $size) {

                                $this->wfv->{$loop}->{$targetobject}->incr = $this->wfv->{$loop}->{$targetobject}->incr + 1;
                                $this->wfv->{$loop}->{$targetobject}->current_val = next($this->wfv->{$targetobject});
                                $this->wfv->{$loop}->{$targetobject}->current_key = key($this->wfv->{$targetobject});
                                $nextobj = $this->GetConnIdTask($workflow->links, $loop);
                                $this->GetNextOperator($loop, $nextobj[0], $nextobj[1], $taskout);

                                } else {

                                //You made it to the end of the array
                                $nextobj = $this->GetConnIdTask($workflow->links, $op);
                                $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);
                                }
                        }

                } else if ($logic == 'break') {
                        $loop = $workflow->operators->{$op}->properties->loopid;
                        $nextobj = $this->GetConnIdTask($workflow->links, $op);
                        $this->GetNextOperator($op, $nextobj[0], $nextobj[1], $taskout);
                }
        }

        private function GetParams($params, $wfv){

                //$loopparams = $this->wfparams->GetLoopParams($params, $wfv) !== 'NULL' && !is_bool($this->wfparams->GetLoopParams($params, $wfv)) ? $this->wfparams->GetLoopParams($params, $wfv) : $params;

                $newparams = $this->wfparams->GetTaskParams($params, $wfv) !== 'NULL' && !is_bool($this->wfparams->GetTaskParams($params, $wfv)) ? $this->wfparams->GetTaskParams($params, $wfv) : $params;
                return $newparams;
        }


        private function Stop($wfname) {
                $wfname = $this->wfname;
                $status = "success";
                $msg = "$wfname has stopped.";
                //$this->UpdateTracker($this->wfname,'Stop','end');
                $this->SetStateStopped($wfname, $this->con);
                $this->ReturnData($status, $msg);
        }

        private function GetNextOperator($from_op, $from_conn_id, $to_op, $output=null){
                $workflow = json_decode($this->wfdata);
                $wfname = $this->wfname;

                        //left off here, this seems to make sense.  Need to keep it from getting too stupid with all the loops.
                foreach ($workflow->links as $key=>$link) {
                        if ($link->fromOperator === $from_op && $link->fromConnector = $from_conn_id && $link->toOperator == $to_op) {
                                $next_op = $to_op;
                                if (preg_match('/task/', $next_op) === 1) {
                                        $this->RunTask($next_op);
                                } else if (preg_match('/if-else/', $next_op) === 1){
                                        $this->EvalRoute('if-else', $next_op, $output);
                                } else if (preg_match('/while/', $next_op) === 1){
                                        $this->EvalRoute('while', $next_op, $output);
                                } else if (preg_match('/foreach/', $next_op) === 1){
                                        $this->EvalRoute('foreach', $next_op, $output);
                                } else if (preg_match('/continue/', $next_op) === 1){
                                        $this->EvalRoute('continue', $next_op, $output);
                                } else if (preg_match('/break/', $next_op) === 1){
                                        $this->EvalRoute('break', $next_op, $output);
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

        private function GetConnIdTask($links, $op){
               $from_conn_id='';
               $to_op='';
               foreach ($links as $key=>$val) {
                       if ($val->fromOperator === $op) {
                               $from_conn_id = $val->fromConnector;
                               $to_op = $val->toOperator;
                       }
               }
               return array($from_conn_id, $to_op);
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




