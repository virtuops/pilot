<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class WorkFlow {

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

        public function WorkFlowOperation($action, $params, $con){
                if ($action == 'save') {
                        $this->CreateUpdate($params, $con);
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                } else if ($action == 'delete') {
                        $this->Delete($params, $con);
                }
        }

        private function CreateUpdate($params, $con) {

                $this->l->varErrorLog("WorkFlowCreateUpdate: New Params are");
                $this->l->varErrorLog($params);

                $workflowname = $params['workflowname'];
                $workflowdata = $params['workflowdata'];

                $getsched = "select workflowschedule, workflowstatus from workflows where workflowname=?";
                $schedbind = '';
                $wfsched = '';
                $statbind = '';
                $wfstatus = '';
                $schedstmt = $con->prepare($getsched);
                $schedstmt->bind_param('s', $workflowname);
                $schedstmt->execute();
                $schedstmt->bind_result($schedbind, $statbind);

                while ($schedstmt->fetch()) {
                        $wfsched = $schedbind;
                        $wfstatus = $statbind;
                }

                $this->l->varErrorLog('Schedule is '.$wfsched.' and status is '.$wfstatus);

                $sql = '';

                if (strlen($wfsched) === 0 || strlen($wfstatus) === 0) {
                $this->l->varErrorLog('Adding a schedule of * * * * *');
                $wfsched = '* * * * *';
                $wfstatus = 'enabled';
                $sql = "insert into workflows (workflowname, workflowdata, workflowschedule, workflowstatus) values (?, ?, ?,?) ON DUPLICATE KEY UPDATE workflowdata=values(workflowdata), workflowschedule='$wfsched', workflowstatus='$wfstatus'";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('ssss', $workflowname, $workflowdata, $wfsched, $wfstatus);
                $stmt->execute();
                } else {
                $sql = "insert into workflows (workflowname, workflowdata) values (?, ?) ON DUPLICATE KEY UPDATE workflowdata=values(workflowdata)";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('ss', $workflowname, $workflowdata);
                $stmt->execute();
                }

                $this->l->varErrorLog("WorkFlowCreateUpdate DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

                if (! $stmt->error && ! $con->error) {

                        $this->ReturnData('success',"$workflowname saved.");
                } else {
                        $this->ReturnData('fail',"$workflowname NOT saved, problem with executing command.  Please review main.log or web server error log or try saving again.");
                }

        }


        private function Read($params=null, $con) {

                //$this->l->varErrorLog("WorkFlowRead PARAMS ");
                //$this->l->varErrorLog($params);

                $sql = '';
                $sql = "select * from workflows";
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

        }

        private function Delete($params, $con)
        {
                $this->l->varErrorLog("WorkFlowDelete Params ");
                $this->l->varErrorLog($params);

                $workflowname = $params['workflowname'];
                $sql = "delete from workflows where workflowname = ?";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('s', $workflowname);
                $this->l->varErrorLog("Executing statement $sql");
                $stmt->execute();

                $this->l->varErrorLog("WorkFlowDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);
                if (! $stmt->error && ! $con->error) {

                        $this->ReturnData('success',"$workflowname deleted.");
                } else {
                        $this->ReturnData('fail',"$workflowname NOT deleted, problem with executing command.  Please review main.log or web server error log or try deleting again.");
                }


        }

        private function ReturnData($status, $msg){

                        header('Content-Type: application/json');
                        echo '{"status": "'.$status.'","message":"'.$msg.'"}';

                        if ($status === 'error') {
                                exit();
                        }

        }

}

