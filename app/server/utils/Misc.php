<?php

require_once __DIR__.'/../admin/Settings.php';
require_once 'Log.php';

Class Misc {

        private $globalconf;
	private $l;
	private $s;

	public function __construct() 
	{
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();

	}

	public function MiscOperation($action, $params, $con){


		if ($action == 'getdatetime') {
			$this->GetDateTime($con);
		}

	}

	private function GetDateTime($con) {

                //$this->l->varErrorLog("UserRead PARAMS ");
                //$this->l->varErrorLog($params);

                $sql = "select NOW() as mytime";

                $response = $con->query($sql);

		$records = array();
		$rows = array();

                while ($obj = $response->fetch_assoc())
                        {
                                $rows[] = $obj;
                        }

		$records['total'] = count($rows);	
		$records['records'] = $rows;
		$jrows = json_encode($records);
		header('Content-Type: application/json');
		echo $jrows;

	}

}
