<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class WorkFlowSchedule {

        private $globalconf;
        private $con;
        private $l;
        private $s;

        public function __construct()
        {
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();

        }

        public function WorkFlowScheduleOperation($action, $params, $con){

                if ($action == 'save') {
                        $this->CreateUpdate($params, $con);
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                } else if ($action == 'returncron') {
                        $cron = $this->GetCron($params, $con);
                        return $cron;
                } else if ($action == 'delete') {
                        $this->Delete($params, $con);
                }
        }

        private function CreateUpdate($params, $con) {

                $this->l->varErrorLog("WorkFlowCreateUpdate: New Params are");
                $this->l->varErrorLog($params);

                $workflowname = $params['workflowname'];
                $workflowschedule = $params['workflowschedule'];
                $workflowstate = $params['workflowstate'];
                $workflowstatus = $params['workflowstatus'];


                $sql = "update workflows set workflowschedule = ?, workflowstate = ?, workflowstatus = ? where workflowname = ?";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('ssss', $workflowschedule, $workflowstate, $workflowstatus, $workflowname);
                $stmt->execute();

                $this->l->varErrorLog("WorkFlowCreateUpdate DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);
                if (! $stmt->error && ! $con->error) {
                        $this->ReturnData('success',"Schedule for $workflowname saved.");
                } else {
                        $this->ReturnData('fail',"$workflowname schedule NOT saved and cron not updated, problem with executing command.  Please review main.log or web server error log or try saving again. ". $stmt->error. " ".$con->error);
                }



        }

        private function GetCron($params=null, $con) {

                $this->l->varErrorLog("WorkFlowScheduleRead PARAMS ");
                $this->l->varErrorLog($params);

                $sql = '';
                $sql = "select workflowname, workflowschedule, workflowstate, workflowstatus from workflows where workflowstatus = 'scheduled'";
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
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;

                return $records;


        }

	private function Read($params, $con) {
                $this->l->varErrorLog("WorkFlowScheduleRead PARAMS ");
                $this->l->varErrorLog($params);

		$wfname = $params['workflowname'];

                $sql = '';
                $sql = "select workflowname, workflowschedule, workflowstate, workflowstatus from workflows where workflowname = '$wfname'";
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
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;

                return $records;
	}

        private function Delete($params, $con)
        {
                //To delete a workflow, select the workflow, click schedule, click reset and then save the workflow
                //You can also just disable the schedule by unchecking "enable"

        }

        private function ReturnData($status, $msg){

                        header('Content-Type: application/json');
                        echo '{"status": "'.$status.'","message":"'.$msg.'"}';

                        if ($status === 'error') {
                                exit();
                        }

        }

}

