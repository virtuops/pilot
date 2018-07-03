<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class Login {

        private $globalconf;
	private $l;
	private $s;

	public function __construct() 
	{
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();

                $this->l = new Log();
		$this->globalconf = parse_ini_file(__DIR__.'/../config.ini');

	}

	public function GetPassword($action, $params){

		if ($action == 'save') {
			$this->CreateUpdate($params);
		} else if ($action == 'get') {
			$this->Read();
		}

	}

	public function getSettings(){
		return $this->globalconf;
	}

	private function CreateUpdate($params) {

		$this->l->varErrorLog("SettingsCreateUpdate: New Params are");
		$this->l->varErrorLog($params);
		
		$dbname = isset($params->dbname) ? $params->dbname : (isset($params['dbname']) ? $params['dbname'] : '');
		$dbhost = isset($params->dbhost) ? $params->dbhost : (isset($params['dbhost']) ? $params['dbhost'] : '');
		$dbuser = isset($params->dbuser) ? $params->dbuser : (isset($params['dbuser']) ? $params['dbuser'] : '');
		$dbpass = isset($params->dbpass) ? $params->dbpass : (isset($params['dbpass']) ? $params['dbpass'] : '');
		$dbport = isset($params->dbport) ? $params->dbport : (isset($params['dbport']) ? $params['dbport'] : '');
		/*
		$dbhost = $params->dbhost;
		$dbuser = $params->dbuser;
		$dbpass = $params->dbpass;
		$dbport = $params->dbport;
		*/

$configfile = <<<EOT
;
; Config File
;
; Do NOT Modify by hand
;
dbhost = "$dbhost"
dbport = "$dbport"
dbuser = "$dbuser"
dbpass = "$dbpass"
dbname = "$dbname"
logfile = "/var/www/html/nochero/app/logs/main.log"
EOT;
		file_put_contents(__DIR__.'/../config.ini', $configfile);

		

	}

	private function Read() {

		$this->l->varErrorLog("Getting Config:");
		//$this->globalconf = parse_ini_file(__DIR__.'/../config.ini');
		$this->l->varErrorLog("Returning Config:");
		$jrows = json_encode($this->globalconf);
		$this->l->varErrorLog($jrows);
		header('Content-Type: application/json');
		echo $jrows;

	}

}
