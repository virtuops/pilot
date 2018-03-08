<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class Reports {

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

        public function ReportsOperation($action, $params, $con){

                if ($action == 'taskslast24hours') {
                        $this->TASKSLAST24HOURS($params, $con);
                }
                if ($action == 'taskslast7days') {
                        $this->TASKSLAST7DAYS($params, $con);
                }
                if ($action == 'taskslast30days') {
                        $this->TASKSLAST30DAYS($params, $con);
                }
                if ($action == 'tasks30dayavg') {
                        $this->TASKS30DAYAVG($params, $con);
                }
                if ($action == 'workflowslast24hours') {
                        $this->WORKFLOWSLAST24HOURS($params, $con);
                }
                if ($action == 'workflowslast7days') {
                        $this->WORKFLOWSLAST7DAYS($params, $con);
                }
                if ($action == 'workflowslast30days') {
                        $this->WORKFLOWSLAST30DAYS($params, $con);
                }
                if ($action == 'workflows30dayavg') {
                        $this->WORKFLOWS30DAYAVG($params, $con);
                }
                if ($action == 'tasksfailed24hours') {
                        $this->TASKSFAILED24HOURS($params, $con);
                }
                if ($action == 'tasksfailed7days') {
                        $this->TASKSFAILED7DAYS($params, $con);
                }
                if ($action == 'tasksfailed30days') {
                        $this->TASKSFAILED30DAYS($params, $con);
                }
                if ($action == 'tasksfailed30dayavg') {
                        $this->TASKSFAILED30DAYAVG($params, $con);
                }
                if ($action == 'taskslast24hoursavgruntime') {
                        $this->TASKS24HOURSAVGRUNTIME($params, $con);
                }
                if ($action == 'workflowslast24hoursavgruntime') {
                        $this->WORKFLOWS24HOURSAVGRUNTIME($params, $con);
                }
                if ($action == 'task7daysavgruntime') {
                        $this->TASKS7DAYSAVGRUNTIME($params, $con);
                }
                if ($action == 'workflow7daysavgruntime') {
                        $this->WORKFLOWS7DAYSAVGRUNTIME($params, $con);
                }
                if ($action == 'task15daysavgruntime') {
                        $this->TASKS15DAYSAVGRUNTIME($params, $con);
                }
                if ($action == 'workflow15daysavgruntime') {
                        $this->WORKFLOWS15DAYSAVGRUNTIME($params, $con);
                }
                if ($action == 'task30daysavgruntime') {
                        $this->TASKS30DAYSAVGRUNTIME($params, $con);
                }
                if ($action == 'workflow30daysavgruntime') {
                        $this->WORKFLOWS30DAYSAVGRUNTIME($params, $con);
                }
                if ($action == 'daybydaytasks') {
                        $this->DAYBYDAYTASKS($params, $con);
                }
                if ($action == 'daybydayworkflows') {
                        $this->DAYBYDAYWORKFLOWS($params, $con);
                }
                if ($action == 'daybydayfails') {
                        $this->DAYBYDAYFAILS($params, $con);
                }
                if ($action == 'daybydayavg') {
                        $this->DAYBYDAYAVG($params, $con);
                }
                if ($action == 'daybydayavgworkflows') {
                        $this->DAYBYDAYAVGWORKFLOWS($params, $con);
                }
                if ($action == 'tasklist') {
                        $this->TASKLIST($params, $con);
                }
                if ($action == 'userlist') {
                        $this->USERLIST($params, $con);
                }
                if ($action == 'totaltasks') {
                        $this->TOTALTASKS($params, $con);
                }
                if ($action == 'totalworkflows') {
                        $this->TOTALWORKFLOWS($params, $con);
                }
                if ($action == 'taskdetails') {
                        $this->TASKDETAILS($params, $con);
                }
                if ($action == 'workflowdetails') {
                        $this->WORKFLOWDETAILS($params, $con);
                }

        }

        private function TASKSLAST24HOURS($params, $con) {
                $sql = 'SELECT count(*) as NUMTASKS from task_logs WHERE taskstarttime >= now() - INTERVAL 24 HOUR';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function WORKFLOWSLAST24HOURS($params, $con) {
                $sql = 'SELECT count(*) as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 24 HOUR';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function TASKSLAST7DAYS($params, $con) {
                $sql = 'SELECT count(*) as NUMTASKS from task_logs WHERE taskstarttime >= now() - INTERVAL 7 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function WORKFLOWSLAST7DAYS($params, $con) {
                $sql = 'SELECT count(*) as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 7 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function TASKSLAST30DAYS($params, $con) {
                $sql = 'SELECT count(*) as NUMTASKS from task_logs WHERE taskstarttime >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function WORKFLOWSLAST30DAYS($params, $con) {
                $sql = 'SELECT count(*) as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function TASKS30DAYAVG($params, $con) {
                $sql = 'SELECT count(*)/30 as NUMTASKS from task_logs WHERE taskstarttime >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function WORKFLOWS30DAYAVG($params, $con) {
                $sql = 'SELECT count(*)/30 as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function TASKSFAILED24HOURS($params, $con) {
                $sql = 'SELECT count(*) as NUMTASKS from task_logs WHERE taskexit <> 0 AND taskstarttime >= now() - INTERVAL 24 HOUR';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function TASKSFAILED7DAYS($params, $con) {
                $sql = 'SELECT count(*) as NUMTASKS from task_logs WHERE taskexit <> 0 AND taskstarttime >= now() - INTERVAL 7 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function TASKSFAILED30DAYS($params, $con) {
                $sql = 'SELECT count(*) as NUMTASKS from task_logs WHERE taskexit <> 0 AND taskstarttime >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }
        private function TASKSFAILED30DAYAVG($params, $con) {
                $sql = 'SELECT count(*)/30 as NUMTASKS from task_logs WHERE taskexit <> 0 AND taskstarttime >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function TASKS24HOURSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(tasktime) as NUMTASKS from task_logs WHERE taskexit = 0 AND taskstarttime >= now() - INTERVAL 24 HOUR';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function WORKFLOWS24HOURSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(wftime) as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 24 HOUR';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function TASKS7DAYSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(tasktime) as NUMTASKS from task_logs WHERE taskexit = 0 AND taskstarttime >= now() - INTERVAL 7 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function WORKFLOWS7DAYSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(wftime) as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 7 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }



        private function TASKS15DAYSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(tasktime) as NUMTASKS from task_logs WHERE taskexit = 0 AND taskstarttime >= now() - INTERVAL 15 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function WORKFLOWS15DAYSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(wftime) as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 15 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function TASKS30DAYSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(tasktime) as NUMTASKS from task_logs WHERE taskexit = 0 AND taskstarttime >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function WORKFLOWS30DAYSAVGRUNTIME($params, $con) {
                $sql = 'SELECT avg(wftime) as NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 30 DAY';
                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function DAYBYDAYTASKS($params, $con) {
                $sql = "select DATE_FORMAT(taskstarttime,'%Y-%m-%d') AS TASKDATE, count(*) AS NUMTASKS from task_logs WHERE taskstarttime >= now() - INTERVAL 30 DAY GROUP BY DAY(taskstarttime) ORDER BY taskstarttime ASC";
                $response = $con->query($sql);
                $rows = array();
                $records = array();
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $chartdata = json_encode($rows);
                header('Content-Type: application/json');
                echo $chartdata;
                $con->close();
        }

        private function DAYBYDAYWORKFLOWS($params, $con) {
                $sql = "select DATE_FORMAT(wfstart,'%Y-%m-%d') AS WFDATE, count(*) AS NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 30 DAY GROUP BY DAY(wfstart) ORDER BY wfstart ASC";
                $response = $con->query($sql);
                $rows = array();
                $records = array();
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $chartdata = json_encode($rows);
                header('Content-Type: application/json');
                echo $chartdata;
                $con->close();
        }

        private function DAYBYDAYFAILS($params, $con) {
                $sql = "select DATE_FORMAT(taskstarttime,'%Y-%m-%d') AS TASKDATE, count(*) AS NUMTASKS from task_logs WHERE taskexit <> 0 AND taskstarttime >= now() - INTERVAL 30 DAY GROUP BY DAY(taskstarttime) ORDER BY taskstarttime ASC";
                $response = $con->query($sql);
                $rows = array();
                $records = array();
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $chartdata = json_encode($rows);
                header('Content-Type: application/json');
                echo $chartdata;
                $con->close();
        }

        private function DAYBYDAYAVG($params, $con) {
                $sql = "select DATE_FORMAT(taskstarttime,'%Y-%m-%d') AS TASKDATE, avg(tasktime) AS NUMTASKS from task_logs WHERE taskexit = 0 AND taskstarttime >= now() - INTERVAL 30 DAY GROUP BY DAY(taskstarttime) ORDER BY taskstarttime ASC";
                $response = $con->query($sql);
                $rows = array();
                $records = array();
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $chartdata = json_encode($rows);
                header('Content-Type: application/json');
                echo $chartdata;
                $con->close();
        }

        private function DAYBYDAYAVGWORKFLOWS($params, $con) {
                $sql = "select DATE_FORMAT(wfstart,'%Y-%m-%d') AS WFDATE, avg(wftime) AS NUMFLOWS from workflowhist WHERE wfstart >= now() - INTERVAL 30 DAY GROUP BY DAY(wfstart) ORDER BY wfstart ASC";
                $response = $con->query($sql);
                $rows = array();
                $records = array();
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }
                $chartdata = json_encode($rows);
                header('Content-Type: application/json');
                echo $chartdata;
                $con->close();
        }

        private function TASKLIST($params, $con){

                $sql = "select taskname from tasks";
                $response = $con->query($sql);
                $rows = array();
                while ($task = $response->fetch_array(MYSQLI_NUM)) {
                $rows[] = $task[0];
                }
                $jrows = json_encode($rows);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();

        }

        private function USERLIST($params, $con){
                $sql = "select username from users";
                $response = $con->query($sql);
                $rows = array();
                while ($user = $response->fetch_array(MYSQLI_NUM)) {
                $rows[] = $user[0];
                }
                $jrows = json_encode($rows);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();
        }

        private function TASKDETAILS($params, $con) {
                $this->l->varErrorLog("TASKDETAILS PARAMS ARE");
                $this->l->varErrorLog($params);
                $name = isset($params->name) ? $params->name : (isset($params['name']) ? $params['name'] : '%');
                $username = isset($params->username) ? $params->username : (isset($params['username']) ? $params['username'] : '%');
                $taskmeta = isset($params->taskmeta) ? $params->taskmeta : (isset($params['taskmeta']) ? $params['taskmeta'] : '%');
                if ($name == '') {
                        $name = '%';
                }
                if ($username == '') {
                        $username = '%';
                }
                if ($taskmeta == '') {
                        $taskmeta = '%';
                }
                $start = isset($params->start) ? $params->start : (isset($params['start']) ? $params['start'] : '');
                $end = isset($params->end) ? $params->end : (isset($params['end']) ? $params['end'] : '');

                $sql = "select * from task_logs where taskname like '%$name%' and username like '%$username%' and taskmetadata like '%$taskmeta%' and taskstarttime >= '$start' and taskstarttime < '$end'";

                $this->l->varErrorLog("TASKDETAILS SQL IS $sql");
                $response = $con->query($sql);

                $count = 1;
                while ($obj = $response->fetch_assoc())
                        {
                                $obj['recid'] = $count;
                                $rows[] = $obj;
                                $count = $count + 1;
                        }

                $this->l->varErrorLog("Returning:");
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                $this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();

        }

        private function WORKFLOWDETAILS($params, $con) {
                $this->l->varErrorLog("WORKFLOWDETAIL PARAMS ARE");
                $this->l->varErrorLog($params);
                $name = isset($params->name) ? $params->name : (isset($params['name']) ? $params['name'] : '%');
                $username = isset($params->username) ? $params->username : (isset($params['username']) ? $params['username'] : '%');
                $wfmeta = isset($params->wfmeta) ? $params->wfmeta : (isset($params['wfmeta']) ? $params['wfmeta'] : '%');
                if ($name == '') {
                        $name = '%';
                }
                if ($wfmeta == '') {
                        $wfmeta = '%';
                }
                $start = isset($params->start) ? $params->start : (isset($params['start']) ? $params['start'] : '');
                $end = isset($params->end) ? $params->end : (isset($params['end']) ? $params['end'] : '');

                $sql = "select * from workflowhist where workflowname like '%$name%' and username like '%$username%' and wfmetadata like '%$wfmeta%' and wfstart >= '$start' and wfstart < '$end'";

                $this->l->varErrorLog("WFDETAILS SQL IS $sql");
                $response = $con->query($sql);

                $count = 1;
                while ($obj = $response->fetch_assoc())
                        {
                                $obj['recid'] = $count;
                                $rows[] = $obj;
                                $count = $count + 1;
                        }

                $this->l->varErrorLog("Returning:");
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                $this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();

        }

        private function TOTALTASKS($params, $con) {

                $name = isset($params->name) ? $params->name : (isset($params['name']) ? $params['name'] : '%');
                $username = isset($params->username) ? $params->username : (isset($params['username']) ? $params['username'] : '%');
                $taskmeta = isset($params->taskmeta) ? $params->taskmeta : (isset($params['taskmeta']) ? $params['taskmeta'] : '%');
                if ($name == '') {
                        $name = '%';
                }
                if ($username == '') {
                        $username = '%';
                }
                if ($taskmeta == '') {
                        $taskmeta = '%';
                }
                $start = isset($params->start) ? $params->start : (isset($params['start']) ? $params['start'] : '');
                $end = isset($params->end) ? $params->end : (isset($params['end']) ? $params['end'] : '');

                $sql = "select count(*) as totaltasks from task_logs where taskname like '%$name%' and username like '%$username%' and taskmetadata like '%$taskmeta%' and taskstarttime >= '$start' and taskstarttime < '$end' and tasktime > 0";

                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }

                $this->l->varErrorLog("Returning:");
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                $this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();

        }

        private function TOTALWORKFLOWS($params, $con) {

                $name = isset($params->name) ? $params->name : (isset($params['name']) ? $params['name'] : '%');
                $username = isset($params->username) ? $params->username : (isset($params['username']) ? $params['username'] : '%');
                $wfmeta = isset($params->wfmeta) ? $params->wfmeta : (isset($params['wfmeta']) ? $params['wfmeta'] : '%');
                if ($name == '') {
                        $name = '%';
                }
                if ($username == '') {
                        $username = '%';
                }
                if ($wfmeta == '') {
                        $wfmeta = '%';
                }
                $start = isset($params->start) ? $params->start : (isset($params['start']) ? $params['start'] : '');
                $end = isset($params->end) ? $params->end : (isset($params['end']) ? $params['end'] : '');

                $sql = "select count(*) as totalworkflows from workflowhist where workflowname like '%$name%' and username like '%$username%' and wfmetadata like '%$wfmeta%' and wfstart >= '$start' and wfstart < '$end' and wftime > 0";

                $response = $con->query($sql);
                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }

                $this->l->varErrorLog("Returning:");
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                $this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;
                $con->close();

        }
}

