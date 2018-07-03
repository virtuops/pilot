<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class RunbookTask {

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

	public function RunbookTaskOperation($action, $params, $con){


		if ($action == 'save') {
			$this->CreateUpdate($params, $con);
		} else if ($action == 'get') {
			$this->Read($params, $con);
		} else if ($action == 'delete') {
			$this->Delete($params, $con);
		}

	}

	private function CreateUpdate($params, $con) {

		$this->l->varErrorLog("RunbookTaskCreateUpdate: New Params are");
		$this->l->varErrorLog($params);

		$runbookid = $params['runbook'];
		$tasklist = $params['tasks'];

                $delsql = "delete from task_runbooks where runbookid = ?";
                $delstmt = $con->prepare($delsql);
                $delstmt->bind_param('s', $runbookid);
                $delstmt->execute();

		$this->l->varErrorLog("RunbookTaskCreateUpdate DB Error: ");
		$this->l->varErrorLog($delstmt->affected_rows);
		$this->l->varErrorLog($con->error);
		
		$taskorder = 1;
		foreach ($tasklist as $task) {
		$taskname = $task['taskname'];
		
		$sql = "insert into task_runbooks (taskname, runbookid, taskorder) values (?, ?, ?)";
		$stmt = $con->prepare($sql);
		$stmt->bind_param('ssi', $taskname, $runbookid, $taskorder);
		$stmt->execute();

		$taskorder = $taskorder + 1;
		
		$this->l->varErrorLog("RunbookTaskCreateUpdate DB Error: ");
		$this->l->varErrorLog($stmt->affected_rows);
		$this->l->varErrorLog($con->error);
		}
	}

	private function Read($params, $con) {


		$sql = '';

		if ($params['lookingfor'] === 'selected') {
		$runbookid = $params['runbook'];
                $sql = "select taskname, taskorder from task_runbooks where runbookid = '$runbookid' order by taskorder asc";
		} else if ($params['lookingfor'] === 'available') {
		$runbookid = $params['runbook'];
                $sql = "select taskname from tasks where taskname not in (select taskname from task_runbooks where runbookid = '$runbookid')";
		}

		$this->l->varErrorLog("RunbookTaskRead SQL is ");
		$this->l->varErrorLog($sql);
                $response = $con->query($sql);

                $this->l->varErrorLog("RunbookTaskRead DB Error: ");
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

                $this->l->varErrorLog("RunbookTaskDelete PARAMS ARE: ");
                $this->l->varErrorLog($params);
		$runbookid = $params[0]['runbookid'];
		$taskname = $params[0]['taskname'];
		$bindme = '';
		$sql = '';
		if (isset($runbookid)) {
                $sql = "delete from task_runbooks where runbookid = ?";
		$bindme = $runbookid;
		} else if (isset($taskname)) {
			if (strpos($taskname, '(') !== false) {
                        $sql = "delete from task_runbooks where taskname in $taskname";
			} else {
                	$sql = "delete from task_runbooks where taskname = ?";
			}
			$bindme = $taskname;
		}
                $stmt = $con->prepare($sql);
                $stmt->bind_param('s', $bindme);
                $stmt->execute();

		if (! $con->error) {

                header('Content-Type: application/json');
                echo $jrows;

		}

                $this->l->varErrorLog("RunbookTaskDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);
	}

}
