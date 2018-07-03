<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class UserGroup {

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

	public function UserGroupOperation($action, $params, $con){


		if ($action == 'save') {
			$this->CreateUpdate($params, $con);
		} else if ($action == 'get') {
			$this->Read($params, $con);
		} else if ($action == 'getuseringroup') {
			$this->ReadInGroup($params, $con);
		} else if ($action == 'delete') {
			$this->Delete($params, $con);
		}

	}

	private function CreateUpdate($params, $con) {

		$this->l->varErrorLog("UserGroupCreateUpdate: New Params are");
		$this->l->varErrorLog($params);

		$groupid = $params['group'];
		$userlist = $params['users'];

                $delsql = "delete from user_groups where groupid = ?";
                $delstmt = $con->prepare($delsql);
                $delstmt->bind_param('s', $groupid);
                $delstmt->execute();

		$this->l->varErrorLog("UserGroupCreateUpdate DB Error: ");
		$this->l->varErrorLog($delstmt->affected_rows);
		$this->l->varErrorLog($con->error);
		
		foreach ($userlist as $user) {
		$username = $user['username'];
		
		$sql = "insert into user_groups (groupid, username) values (?, ?)";
		$stmt = $con->prepare($sql);
		$stmt->bind_param('ss', $groupid, $username);
		$stmt->execute();
		
		$this->l->varErrorLog("UserGroupCreateUpdate DB Error: ");
		$this->l->varErrorLog($stmt->affected_rows);
		$this->l->varErrorLog($con->error);
		}
	}

	private function Read($params, $con) {

		$this->l->varErrorLog("UserGroupRead: New Params are");
		$this->l->varErrorLog($params);

		$sql = '';

		if ($params['lookingfor'] === 'selected') {
		$groupid = $params['group'];
                $sql = "select username from users where username in (select username from user_groups where groupid = '$groupid')";
		} else if ($params['lookingfor'] === 'available') {
		$groupid = $params['group'];
                $sql = "select username from users where username not in (select username from user_groups where groupid = '$groupid')";
		} 

		$this->l->varErrorLog("UserGroupRead SQL is ");
		$this->l->varErrorLog($sql);
                $response = $con->query($sql);

                $this->l->varErrorLog("UserGroupRead DB Error: ");
                $this->l->varErrorLog($con->error);

		$records = array();
		$rows = array();
		$recid = 1;

                while ($obj = $response->fetch_assoc())
                        {
				$obj['recid'] = $recid;
                                $rows[] = $obj;
				$recid = $recid + 1;
                        }

		$this->l->varErrorLog("Returning:");
		$records['total'] = count($rows);	
		$records['records'] = $rows;
		$records['status'] = 'success';
		$jrows = json_encode($records);
		$this->l->varErrorLog($jrows);
		header('Content-Type: application/json');
		echo $jrows;

	}
	
	private function ReadInGroup($params, $con) {

	$probs = $params;
        $this->l->varErrorLog("UserGroupReadInGroup: New Params are");
        $this->l->varErrorLog($probs);

	foreach ($probs as $prob) {
		if ($prob['lookingfor'] === 'useringroup') {

                $groupid = $prob['problemusergroup'];
                $username = $prob['usertocheck'];
                $sql = "select 1 as INOROUT from user_groups where username = '$username' and groupid = '$groupid'";

                $result = $con->query($sql);
                $row = $result->fetch_assoc();
		$this->l->varErrorLog("UserGroupReadInGroup: ROW IS");
		$this->l->varErrorLog($row);
		
                $inOrOut = $row['INOROUT'];
                if ($inOrOut == 1) {
                //header('Content-Type: application/json');
                //echo '{"status":"success","msg":"'.$username.'" is in the group and can work this problem"}';
                } else {
                header('Content-Type: application/json');
                echo '{"status":"error","msg":"One or more of the problems you selected is not affiliated with a group you are in.  Please select only problems that are in your group."}';
                return;
                }

                }
	}


	}

	private function Delete($params, $con) {

                $this->l->varErrorLog("UserGroupDelete PARAMS ARE: ");
                $this->l->varErrorLog($params);
		$groupid = $params[0]['groupid'];
		$username = $params[0]['username'];
		$bindme = '';
		$sql = '';
		if (isset($groupid)) {
                $sql = "delete from user_groups where groupid = ?";
		$bindme = $groupid;
		} else if (isset($username)) {
                $sql = "delete from user_groups where username = ?";
		$bindme = $username;
		}
                $stmt = $con->prepare($sql);
                $stmt->bind_param('s', $bindme);
                $stmt->execute();

                $this->l->varErrorLog("GroupDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);
	}

}
