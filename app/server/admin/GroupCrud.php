<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class Group {

        private $globalconf;
	private $l;
	private $s;

	public function __construct() 
	{
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();

	}

	public function GroupOperation($action, $params, $con){


		if ($action == 'save') {
			$this->CreateUpdate($params, $con);
		} else if ($action == 'get') {
			$this->Read($con);
		} else if ($action == 'get_perms') {
			$this->ReadPerms($params, $con);
		} else if ($action == 'delete') {
			$this->Delete($params, $con);
		}

	}

	private function CreateUpdate($params, $con) {

		$this->l->varErrorLog("GroupCreateUpdate: New Params are");
		$this->l->varErrorLog($params);

		$groupid = $params['groupid'];
		$groupname = $params['groupname'];

		$sql = "replace into groups (groupid, groupname) values (?, ?)";
		$stmt = $con->prepare($sql);
			
		$stmt->bind_param('ss', $groupid, $groupname);
		$stmt->execute();
		
		$this->l->varErrorLog("GroupCreateUpdate DB Error: ");
		$this->l->varErrorLog($stmt->affected_rows);
		$this->l->varErrorLog($con->error);
		
		$this->CreateUpdatePerms($params, $con);


	}

	private function CreateUpdatePerms($params, $con) {

		$this->l->varErrorLog("GroupCreateUpdate PERMS: New Params are");
		$this->l->varErrorLog($params);

                $groupid = $params['groupid'];
                $deleteproblems = isset($params['deleteproblems']) ? $params['deleteproblems'] : '';
                $resolveproblems = isset($params['resolveproblems']) ? $params['resolveproblems'] : '';
                $unresolveproblems = isset($params['unresolveproblems']) ? $params['unresolveproblems'] : '';
		$perms = array('deleteproblems' => $deleteproblems, 'resolveproblems' => $resolveproblems, 'unresolveproblems' => $unresolveproblems);

		$sql = "delete from group_perms where groupid = ?";
		$stmt = $con->prepare($sql);
		$stmt->bind_param('s', $groupid);
		$stmt->execute();

		foreach ($perms as $key=>$val) {
			if (is_bool($val)) { 
				$this->l->varErrorLog("VAL is boolean");
			}
			if ($val === '' || $val === 0 || $val === '0' || $val === false || $val === 'false') {
				$this->l->varErrorLog("FALSE: PERM IS ".$key." AND VAL is ".$val);
				$val = 0;
			} else  {
				$this->l->varErrorLog("TRUE: PERM IS ".$key." AND VAL is ".$val);
				$val = 1;
			}
			$sql = "insert into group_perms (groupid, permission, value) values (?, ?, ?)";
			$stmt = $con->prepare($sql);
			$stmt->bind_param('ssi', $groupid, $key, $val);
			$stmt->execute();
		}

		$this->Read($con);
	}

	private function Read($con) {

		$sql = "select * from groups"; 
                $response = $con->query($sql);

                $this->l->varErrorLog("GroupRead DB Error: ");
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
		$jrows = json_encode($records);
		$this->l->varErrorLog($jrows);
		header('Content-Type: application/json');
		echo $jrows;

	}

	private function ReadPerms($params, $con) {

		$groupid = $params['groupid'];
                $sql = "select * from group_perms where groupid = '$groupid'";
                $response = $con->query($sql);

                $this->l->varErrorLog("GroupRead DB Error: ");
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
                $jrows = json_encode($records);
                $this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;
	}

	private function Delete($params, $con) {
               $this->l->varErrorLog("GroupDelete GROUP DELETE PARAMS ");
                $this->l->varErrorLog($params);
               $this->l->varErrorLog("params[0] is ");

                $this->l->varErrorLog($params[0]);

		$groupid = $params[0]['groupid'];
               $this->l->varErrorLog("GroupDelete GROUP IS ");
                $this->l->varErrorLog($groupid);

		if (strpos($groupid, '(') !== false) {
			$sql = "delete from groups where groupid in $groupid";
			$stmt = $con->prepare($sql);
		} else {
                	$sql = "delete from groups where groupid = ?";
                	$stmt = $con->prepare($sql);
                	$stmt->bind_param('s', $groupid);
		}
                $this->l->varErrorLog("Executing statement $sql");
                $stmt->execute();

                $this->l->varErrorLog("GroupDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

		// Return the current groups so the grid doesn't have to make a new call.
		$this->Read($con);
	}
}
