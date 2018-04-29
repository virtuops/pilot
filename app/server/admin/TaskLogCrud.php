<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class TaskLog {

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

        public function TaskLogOperation($action, $params, $con){


                if ($action == 'save') {
                        $this->CreateUpdate($params, $con);
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                } else if ($action == 'delete') {
                        $this->Delete($params, $con);
                }

        }


        private function CreateUpdate($params, $con) {


                $taskname = isset($params->taskname) ? $params->taskname : (isset($params['taskname']) ? $params['taskname'] : '');
                $problems = isset($params->problems) ? $params->problems : (isset($params['problems']) ? $params['problems'] : '');
                $taskpid = isset($params->taskpid) ? $params->taskpid : (isset($params['taskpid']) ? $params['taskpid'] : '');
                $taskoutput = isset($params->taskoutput) ? $params->taskoutput : (isset($params['taskoutput']) ? $params['taskoutput'] : '');
                $taskstate = isset($params->taskstate) ? $params->taskstate : (isset($params['taskstate']) ? $params['taskstate'] : '');
                $taskserial = isset($params->taskserial) ? $params->taskserial : (isset($params['taskserial']) ? $params['taskserial'] : '');
                $runbookid = isset($params->runbookid) ? $params->runbookid : (isset($params['runbookid']) ? $params['runbookid'] : '');
                $results = isset($params->results) ? $params->results : (isset($params['results']) ? $params['results'] : '');
                $prms = isset($params->params) ? $params->params : (isset($params['params']) ? $params['params'] : '');
                $runbookid = isset($params->runbookid) ? $params->runbookid : (isset($params['runbookid']) ? $params['runbookid'] : '');
                $username = isset($params->username) ? $params->username : (isset($params['username']) ? $params['username'] : '');
                $actionfilename = isset($params->actionfilename) ? $params->actionfilename : (isset($params['actionfilename']) ? $params['actionfilename'] : '');
                $taskstarttime = isset($params->taskstarttime) ? $params->taskstarttime : (isset($params['taskstarttime']) ? $params['taskstarttime'] : '');
                $tasktime = isset($params->tasktime) ? $params->tasktime : (isset($params['tasktime']) ? $params['tasktime'] : 0.0);
                $taskstatus = isset($params->taskstatus) ? $params->taskstatus : (isset($params['taskstatus']) ? $params['taskstatus'] : '');
                $taskexit = isset($params->taskexit) ? $params->taskexit : (isset($params['taskexit']) ? $params['taskexit'] : '');
                $taskerror = isset($params->taskerror) ? $params->taskerror : (isset($params['taskerror']) ? $params['taskerror'] : '');
                $taskmetadata = isset($params->taskmetadata) ? $params->taskmetadata : (isset($params['taskmetadata']) ? $params['taskmetadata'] : '');
                $taskmetadata = json_encode($taskmetadata);



                $taskid = 0;
                if ($taskstate === 'before') {
                        $sql = "insert into task_logs (taskname, runbookid, username, actionfilename, taskstarttime, tasktime, taskserial, taskstatus, taskpid, taskmetadata) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        $stmt = $con->prepare($sql);
                        $stmt->bind_param('ssssssssis', $taskname, $runbookid, $username, $actionfilename, $taskstarttime, $tasktime,$taskserial,$taskstatus, $taskpid, $taskmetadata);

                        $stmt->execute();
                        $insertid = $con->insert_id;
                        $this->l->varErrorLog($stmt->error);
                        $this->l->varErrorLog($stmt->affected_rows);
                        $this->l->varErrorLog($con->error);
                } else if ($taskstate === 'after') {
                        $sql = "UPDATE task_logs SET taskexit=?, taskoutput=?, taskerror=?, tasktime=?, taskstatus=? where taskserial=?";
                        $stmt = $con->prepare($sql);
                        $stmt->bind_param('ssssss', $taskexit, $taskoutput, $taskerror, $tasktime, $taskstatus, $taskserial);
                        $stmt->execute();
                        $this->l->varErrorLog($stmt->error);
                        $this->l->varErrorLog($stmt->affected_rows);
                        $this->l->varErrorLog($con->error);
                }
        }

        private function GetTaskId($taskserial, $con){

                $sql = "select id from task_logs where taskserial='$taskserial'";
                $response = $con->query($sql);

                $this->l->varErrorLog("TaskLogRead GetTaskId DB Error: ");
                $this->l->varErrorLog($con->error);

                $taskid = '';
                while ($row = $response->fetch_row())
                        {
                                $taskid = $row[0];
                        }

                return $taskid;
        }

        public function ReadPid($taskserial, $con) {

                $taskpid = '';
                $sql = "select taskpid from task_logs where taskserial = '$taskserial'";
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $taskpid = $obj['taskpid'];
                        }
                return $taskpid;
        }

        private function Read($params=null, $con) {

                if (is_array($params) && sizeof($params) == 1)
                        $params = $params[0];

                $sql = '';
                $taskname = isset($params->taskname) ? $params->taskname : (isset($params['taskname']) ? $params['taskname'] : 'empty');
                $runbookid = isset($params->runbookid) ? $params->runbookid : (isset($params['runbookid']) ? $params['runbookid'] : 'empty');
                $runbooks = isset($params->runbooks) ? $params->runbooks : (isset($params['runbooks']) ? $params['runbooks'] : 'empty');
                $username = isset($params->username) ? $params->username : (isset($params['username']) ? $params['username'] : 'empty');
                $actionfilename = isset($params->actionfilename) ? $params->actionfilename : (isset($params['actionfilename']) ? $params['actionfilename'] : 'empty');
                $taskstarttime = isset($params->starttime) ? $params->starttime : (isset($params['starttime']) ? $params['starttime'] : 'empty');
                $taskendtime = isset($params->endtime) ? $params->endtime : (isset($params['endtime']) ? $params['endtime'] : 'empty');
                $tasktime = isset($params->tasktime) ? $params->tasktime : (isset($params['tasktime']) ? $params['tasktime'] : 'empty');
                $taskstatus = isset($params->taskstatus) ? $params->taskstatus : (isset($params['taskstatus']) ? $params['taskstatus'] : 'empty');
                $taskexit = isset($params->taskexit) ? $params->taskexit : (isset($params['taskexit']) ? $params['taskexit'] : 'empty');
                $gettype = isset($params->gettype) ? $params->gettype : (isset($params['gettype']) ? $params['gettype'] : 'empty');
                $filter = isset($params->filter) ? $params->filter : (isset($params['filter']) ? $params['filter'] : '');
                $andfilter = '';
                if ($filter)
                        $andfilter = " and taskstarttime >= '$filter'";

                $sql = "select * from task_logs";
                if ($gettype == 'tel') {
                        $sql = "select tl.*,ta.datatype,ta.jprop,ta.fieldseparator,ta.recordseparator from task_logs tl join tasks ta on tl.taskname = ta.taskname where runbookid ='$runbookid' and ta.taskname = '$taskname' $andfilter";
                }
                else if ($gettype == 'runbook_mttr'){

                        $numrbs = count($runbooks);
                        $count = 0;
                        $rblist = '(';
                        foreach ($runbooks as $rb) {
                                $rblist .= "'".$rb['id']."'";
                                $count=$count + 1;
                                if($count < $numrbs) {
                                        $rblist .= ',';
                                } else {

                                        $rblist .= ')';
                                }
                        }

                        $sql = "select * from task_logs where runbookid in $rblist AND taskstarttime >= '$taskstarttime' AND taskstarttime < '$taskendtime'";
                } else if ($gettype == 'task_timeline') {

                        $numtasks = count($taskname);
                        $count = 0;
                        $tlist = '(';
                        foreach ($taskname as $t) {
                                $tlist .= "'".$t['id']."'";
                                $count=$count + 1;
                                if($count < $numtasks) {
                                        $tlist .= ',';
                                } else {

                                        $tlist .= ')';
                                }
                        }

                        $sql = "select * from task_logs where taskname in $tlist AND taskstarttime >= '$taskstarttime' AND taskstarttime < '$taskendtime'";

                }

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
                if ($filter)
                        $records['filter'] = $filter;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;

        }

        private function Delete($params, $con) {

                $taskname = $params[0]->taskname;
                $sql = "delete from tasks where  taskname = ?";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('s', $taskname);
                $stmt->execute();

        }

}


