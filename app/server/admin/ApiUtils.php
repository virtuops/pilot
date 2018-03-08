<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class ApiUtils {

        private $globalconf;
        private $l;
        private $s;

        public function __construct()
        {
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();
        }

        public function ApiUtilsOperation($action, $params, $con){


                if ($action == 'save') {
                        $this->CreateUpdate($params, $con);
                } else if ($action == 'setproblemworking') {
                        $this->SetProblemWorking($params, $con);
                } else if ($action == 'getuser') {
                        $user = $this->ReadUser($params, $con);
                        return $user[0];
                } else if ($action == 'getrunbook') {
                        $runbook = $this->ReadRunbook($params, $con);
                        return $runbook[0];
                } else if ($action == 'getproblemusergroup') {
                        $problemusergroup = $this->ReadProblemUserGroup($params, $con);
                        return $problemusergroup[0];
                } else if ($action == 'gettask') {
                        $task = $this->ReadTasks($params, $con);
                        return $task[0];
                } else if ($action == 'getproblem') {
                        $problem = $this->ReadProblems($params, $con);
                        return $problem[0];
                } else if ($action == 'delete') {
                        $this->Delete($params, $con);
                } else if ($action == 'checkperms') {
                        $this->CheckPerms($params, $con);
                }

        }

        private function CreateUpdate($params, $con) {

                $this->l->varErrorLog("UserCreateUpdate: New Params are");
                $this->l->varErrorLog($params);

                $username = $params->username;
                $firstname = $params->firstname;
                $lastname = $params->lastname;
                $email = $params->email;
                $authmethod = $params->authmethod->text;
                $password = $authmethod != 'LDAP' ? password_hash($params->newpassword, PASSWORD_DEFAULT) : '';
                $locked = $params->locked;

                $sql = "";
                if (strlen($password) === 0) {
                $sql = "insert into users (username, firstname, lastname, email, authmethod) values (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE firstname=values(firstname), lastname=values(lastname), email=values(email), authmethod=values(authmethod)";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('sssss', $username, $firstname, $lastname, $email, $authmethod);
                $stmt->execute();
                } else {
                $sql = "insert into users (username, firstname, lastname, email, authmethod, password) values (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE firstname=values(firstname), lastname=values(lastname), email=values(email), authmethod=values(authmethod), password=values(password)";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('ssssss', $username, $firstname, $lastname, $email, $authmethod, $password);
                $stmt->execute();

                }

                $this->l->varErrorLog("UserCreateUpdate DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

        }

        private function SetProblemWorking($params, $con) {

                $this->l->varErrorLog("SetProblemWorking: New Params are");
                $this->l->varErrorLog($params);

                $username = $params['username'];
                $problemserial = $params['problemserial'];

                $delsql = "delete from user_working_problems where username=? and problemserial=?";
                $stmt = $con->prepare($delsql);
                $stmt->bind_param('si', $username, $problemserial);
                $stmt->execute();

                $this->l->varErrorLog("SetProblemWorking DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($this->stmt->error);
                $this->l->varErrorLog($con->error);

                $insql = "insert into user_working_problems (username, problemserial) values (?, ?)";
                $stmt = $con->prepare($insql);
                $stmt->bind_param('si', $username, $problemserial);
                $stmt->execute();

                $this->l->varErrorLog("SetProblemWorking DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($this->stmt->error);
                $this->l->varErrorLog($con->error);

        }



        private function ReadUser($params=null, $con) {

                $this->l->varErrorLog("UserRead PARAMS ");
                $this->l->varErrorLog($params);

                $sql = '';
                if (! $params) {
                $sql = "select * from users";
                } else {

                        $getdetails = isset($params['getdetails']) ? $params['getdetails'] : '';
                        $fetchusers = isset($params['fetchuser']) ? $params['fetchuser'] : '';
                        $singleuser = isset($params['singleuser']) ? $params['singleuser'] : 'false';
                        if ($getdetails == 'yes'){
                                $sessionid = $params['sessionid'];
                                $sql = "select u.username, g.groupid, r.runbookid, rb.runbookname from users u left join user_groups g on u.username = g.username left join group_runbooks r on g.groupid = r.groupid left join runbooks rb on rb.runbookid = r.runbookid where u.sessionid = '$sessionid'";
                        }
                        else if ($singleuser === 'true') {
                                $username = $params['username'];
                                $sql = "select * from users where username = '$username'";
                        }
                        else if ($fetchusers === 'true') {
                                $sessionid = $params['sessionid'];
                                $sql = "select * from users where sessionid = '$sessionid'";

                        }
                        else {
                                $sql = "select * from users";
                        }

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
                return $records['records'];
        }

        private function ReadRunbook($params=null, $con) {

                $this->l->varErrorLog("ReadRunbook PARAMS ");
                $this->l->varErrorLog($params);
                $sql = '';
                if (! $params) {
                $sql = "select * from runbooks";
                } else {

                        $getdetails = isset($params['getdetails']) ? $params['getdetails'] : '';
                        $fetchusers = isset($params['fetchuser']) ? $params['fetchuser'] : '';
                        $singlerunbook = isset($params['singlerunbook']) ? $params['singlerunbook'] : 'false';
                        if ($singlerunbook === 'true') {
                                $runbookid = $params['runbookid'];
                                $sql = "select * from runbooks where runbookid = '$runbookid'";
                        }
                        else {
                                $sql = "select * from runbooks";
                        }
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
                return $records['records'];
        }

        private function ReadProblemUserGroup($params=null, $con) {

                $this->l->varErrorLog("ReadProblemUserGroup PARAMS ");
                $this->l->varErrorLog($params);
                $sql = '';
                if (! $params) {
                $sql = "select * from user_groups";
                } else {

                        $singleusergroup = isset($params['singleusergroup']) ? $params['singleusergroup'] : 'false';
                        $username = isset($params['usergroup']) ? $params['usergroup'] : 'false';
                        $groupid = isset($params['groupid']) ? $params['groupid'] : 'false';
                        if ($singlerunbook === 'true') {
                                $sql = "select * from user_groups where groupid = '$groupid' and username='$username'";
                        }
                        else {
                                $sql = "select * from user_groups";
                        }
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
                return $records['records'];
        }


        private function ReadTasks($params=null, $con) {

                $this->l->varErrorLog("ReadTasks PARAMS ");
                $this->l->varErrorLog($params);

                $sql = '';
                if (! $params) {
                $sql = "select * from tasks";
                } else {

                        $singletask = isset($params['singletask']) ? $params['singletask'] : 'false';

                        if ($singletask === 'true') {
                                $taskname = $params['taskname'];
                                $sql = "select * from tasks where taskname = '$taskname'";
                        }
                        else {
                                $sql = "select * from tasks";
                        }

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
                return $records['records'];

        }

        private function ReadProblems($params=null, $con) {

                $this->l->varErrorLog("ReadProblems PARAMS ");
                $this->l->varErrorLog($params);

                $sql = '';
                if (! $params) {
                $sql = "select * from problems";
                } else {

                        $singleproblem = isset($params['singleproblem']) ? $params['singleproblem'] : 'false';
                        $problemserial = isset($params['problemserial']) ? $params['problemserial'] : '';

                        if ($singleproblem === 'true') {
                                $problemserial = $params['problemserial'];
                                $sql = "select * from problem_logs where problemserial = $problemserial";
                        }
                        else {
                                $sql = "select * from problem_logs";
                        }

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
                return $records['records'];

        }


        private function CheckPerms($params, $con){

                $username = $params['username'];
                $sql = "select u.username, ug.groupid, gp.permission  from users u left join user_groups ug on u.username = ug.username left join group_perms gp on ug.groupid = gp.groupid where u.username = '$username' AND gp.value = 1";

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
                $this->l->varErrorLog("UserDelete Params ");
                $this->l->varErrorLog($params);

                $username = $params[0]->username ? $params[0]->username : ($params[0]['username'] ? $params[0]['username'] : 'empty');
                if (strpos($username, '(') !== false) {
                        $sql = "delete from users where username in $username";
                        $stmt = $con->prepare($sql);
                } else {
                        $sql = "delete from users where username = ?";
                        $stmt = $con->prepare($sql);
                        $stmt->bind_param('s', $username);
                }
                $this->l->varErrorLog("Executing statement $sql");
                $stmt->execute();

                $this->l->varErrorLog("UserDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

                $this->Read($con);
        }
}

