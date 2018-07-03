<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class ReportingParams {

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

	public function ReportingParamOperation($action, $params, $con){

		if ($action == 'get') {
			$this->Read($params, $con);
		}

	}

	private function Read($params=null, $con) {

                $this->l->varErrorLog("ReportParam PARAMS ");
                $this->l->varErrorLog($params);

		$sql = '';
		if (! $params) {
                $this->l->varErrorLog("NO PARAM TYPE SPECIFIED");
		} else {

			if ($params['paramtype'] === 'users') {
				$sql = "select username from users";
			}
			if ($params['paramtype'] === 'tasks') {
				$sql = "select taskname from tasks";
			}
			if ($params['paramtype'] === 'runbooks') {
				$sql = "select runbookname, runbookid from runbooks";
			}
						
		}

                $response = $con->query($sql);

                $this->l->varErrorLog("ReportParamRead DB Error: ");
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

}
