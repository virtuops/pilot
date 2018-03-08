<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class RunbookGroup {

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

	public function RunbookGroupOperation($action, $params, $con){


		if ($action == 'save') {
			$this->CreateUpdate($params, $con);
		} else if ($action == 'get') {
			$this->Read($params, $con);
		} else if ($action == 'delete') {
			$this->Delete($params, $con);
		}

	}

	private function CreateUpdate($params, $con) {

		$this->l->varErrorLog("RunbookGroupCreateUpdate: New Params are");
		$this->l->varErrorLog($params);

		$runbookid = $params['runbook'];
		$grouplist = $params['groups'];

                $delsql = "delete from group_runbooks where runbookid = ?";
                $delstmt = $con->prepare($delsql);
                $delstmt->bind_param('s', $runbookid);
                $delstmt->execute();

		$this->l->varErrorLog("RunbookGroupCreateUpdate DB Error: ");
		$this->l->varErrorLog($delstmt->affected_rows);
		$this->l->varErrorLog($con->error);
		
		foreach ($grouplist as $group) {
		$groupid = $group['groupid'];
		
		$sql = "insert into group_runbooks (runbookid, groupid) values (?, ?)";
		$stmt = $con->prepare($sql);
		$stmt->bind_param('ss', $runbookid, $groupid);
		$stmt->execute();
		
		$this->l->varErrorLog("UserGroupCreateUpdate DB Error: ");
		$this->l->varErrorLog($stmt->affected_rows);
		$this->l->varErrorLog($con->error);
		}
	}

	private function Read($params, $con) {

		$sql = '';
		$runbookid = $params['runbook'];

		if ($params['lookingfor'] === 'selected') {
                $sql = "select groupname, groupid from groups where groupid in (select groupid from group_runbooks where runbookid = '$runbookid')";
		} else if ($params['lookingfor'] === 'available') {
                $sql = "select groupname, groupid from groups where groupid not in (select groupid from group_runbooks where runbookid = '$runbookid')";
		}

		$this->l->varErrorLog("RunbookGroupRead SQL is ");
		$this->l->varErrorLog($sql);
                $response = $con->query($sql);

                $this->l->varErrorLog("RunbookGroupRead DB Error: ");
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

                $this->l->varErrorLog("RunbookGroupDelete PARAMS ARE: ");
                $this->l->varErrorLog($params);
		$runbookid = $params[0]['runbookid'];
		$groupid = $params[0]['groupid'];
		$bindme = '';
		$sql = '';
		if (isset($groupid)) {
                $sql = "delete from group_runbooks where groupid = ?";
		$bindme = $groupid;
		} else if (isset($runbookid)) {
                $sql = "delete from group_runbooks where runbookid = ?";
		$bindme = $runbookid;
		}
                $stmt = $con->prepare($sql);
                $stmt->bind_param('s', $bindme);
                $stmt->execute();

                $this->l->varErrorLog("GroupDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);
	}

}
