<?php

require_once __DIR__.'/../admin/Settings.php';
require_once __DIR__.'/../utils/Log.php';
require_once __DIR__.'/../utils/License.php';

Class LoadBalance {

        private $globalconf;
	private $con;
	private $l;
	private $s;

	public function __construct() 
	{
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();
                $host = $settings['dbhost'];
                $username = $settings['dbuser'];
                $password = $settings['dbpass'];
                $dbname = $settings['dbname'];
                $port = $settings['dbport'];

                //$this->l->varErrorLog("DB Settings $host $username $password $dbname $port");
                $this->con = new mysqli($host, $username, $password, $dbname, $port);

                if ($this->con->connect_errno) {
                $this->l->varErrorLog("Connect failed: ", $this->con->connect_error);
                } else {
                //$this->l->varErrorLog("Got DB Con");
                }

	}

	public function LBOperation($action, $params){

		if ($action == 'getactive') {
			$active = $this->GetActive($params);
			return $active;
		} else if ($action == 'setnextactive') {
			$this->SetNextActive($params);
		} else if ($action == 'gethealth') {
			$health = $this->GetHealth($params);
			return $health;
		} else if ($action == 'sethealth') {
			$this->SetHealth($params);
		}

	}
	private function GetActive($params=null) {

	}
	private function SetNextActive($params=null) {

	}
	private function GetHealth($params=null){

	}
	private function SetHealth($params=null) 
	{
		
	}
}
