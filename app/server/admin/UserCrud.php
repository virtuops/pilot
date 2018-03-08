<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class User {

        private $globalconf;
	private $con;
	private $l;
	private $s;

	public function __construct() 
	{
                $this->l = new Log();

	}

	public function UserOperation($action, $params, $con){


		if ($action == 'save') {
			$this->CreateUpdate($params, $con);
		} else if ($action == 'get') {
			$this->Read($params, $con);
		} else if ($action == 'delete') {
			$this->Delete($params, $con);
		} else if ($action == 'checkperms') {
			$this->CheckPerms($params, $con);
		}

	}

	private function CreateUpdate($params, $con) {

		$this->l->varErrorLog("UserCreateUpdate: New Params are");
		$this->l->varErrorLog($params);

		$username = $params['username'];
		$firstname = $params['firstname'];
		$lastname = $params['lastname'];
		$email = $params['email'];
		$authmethod = $params['authmethod']['text'];
		$password = $authmethod != 'LDAP' ? password_hash($params['newpassword'], PASSWORD_DEFAULT) : '';
                $locked = $params['locked'];

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


	private function Read($params=null, $con) {

                //$this->l->varErrorLog("UserRead PARAMS ");
                //$this->l->varErrorLog($params);

		$sql = '';
		if (! $params) {
                $sql = "select * from users";
		} else {

			$getdetails = isset($params['getdetails']) ? $params['getdetails'] : '';
			$fetchusers = isset($params['fetchuser']) ? $params['fetchuser'] : '';
			$singleuser = isset($params['singleuser']) ? $params['singleuser'] : '';
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
		$jrows = json_encode($records);
		header('Content-Type: application/json');
		echo $jrows;

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

		$username = isset($params[0]->username) ? $params[0]->username : (isset($params[0]['username']) ? $params[0]['username'] : 'empty');
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

		$params=array();
                $this->Read($params, $con);
	}
}
