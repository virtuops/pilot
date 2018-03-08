<?php

require_once __DIR__.'/../utils/Log.php';

Class Settings {

        private $globalconf;
        private $l;

        public function __construct()
        {
                $this->l = new Log();
                $this->globalconf = parse_ini_file(__DIR__.'/../config.ini');

        }

        public function SettingsOperation($action, $params, $con){

                if ($action == 'save') {
                        $this->CreateUpdate($params, $con);
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                }

        }

        public function getSettings($params=null){

                $json = isset($params->json) ? $params->json : (isset($params['json']) ? $params['json'] : '');

                if ($json === 'true') {
                return json_encode($this->globalconf);
                } else {
                return $this->globalconf;
                }

        }

        private function CreateUpdate($params, $con) {

                $this->l->varErrorLog("SettingsCreateUpdate: New Params are");
                $this->l->varErrorLog($params);

                $dbname = isset($params->dbname) ? $params->dbname : (isset($params['dbname']) ? $params['dbname'] : '');
                $dbhost = isset($params->dbhost) ? $params->dbhost : (isset($params['dbhost']) ? $params['dbhost'] : '');
                $dbuser = isset($params->dbuser) ? $params->dbuser : (isset($params['dbuser']) ? $params['dbuser'] : '');
                $dbpass = isset($params->dbpass) ? $params->dbpass : (isset($params['dbpass']) ? $params['dbpass'] : '');
                $dbport = isset($params->dbport) ? $params->dbport : (isset($params['dbport']) ? $params['dbport'] : '');
                $basedir = isset($params->basedir) ? $params->basedir : (isset($params['basedir']) ? $params['basedir'] : '');
                $unzip = isset($params->unzip) ? $params->unzip : (isset($params['unzip']) ? $params['unzip'] : '');
                $php = isset($params->php) ? $params->php : (isset($params['php']) ? $params['php'] : '');
                $perldoc = isset($params->perldoc) ? $params->perldoc : (isset($params['perldoc']) ? $params['perldoc'] : '');
                $curl = isset($params->curl) ? $params->curl : (isset($params['curl']) ? $params['curl'] : '');
                $weburl = isset($params->weburl) ? $params->weburl : (isset($params['weburl']) ? $params['weburl'] : '');

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
basedir = "$basedir"
unzip = "$unzip"
perldoc = "$perldoc"
php = "$php"
curl = "$curl"
weburl = "$weburl"
logfile = "/var/www/html/nochero/app/logs/main.log"
EOT;
                $confbytes = file_put_contents(__DIR__.'/../config.ini', $configfile);

                // Save the ldap info to the db.
                $ldaphost = isset($params->ldaphost) ? $params->ldaphost : (isset($params['ldaphost']) ? $params['ldaphost'] : '');
                $ldapport = isset($params->ldapport) ? $params->ldapport : (isset($params['ldapport']) ? $params['ldapport'] : '');
                $ldapou = isset($params->ldapou) ? $params->ldapou : (isset($params['ldapou']) ? $params['ldapou'] : '');

                $con = new mysqli($dbhost, $dbuser, $dbpass, $dbname, $dbport);
                if ($con->connect_errno)
                    $this->l->varErrorLog("Connect failed: ", $con->connect_error);
                else
                    $this->l->varErrorLog("Got DB Con");

                $sql = "replace into auth_servers (host, port, organization, type) values (?, ?, ?, 'ldap')";
                $stmt = $con->prepare($sql);
                $stmt->bind_param('sis', $ldaphost, $ldapport, $ldapou);
                $stmt->execute();

                if (($confbytes > 0) && (! $this->con->connect_errno)) {
                        header('Content-Type: application/json');
                        echo '{"status":"success"}';
                } else {
                        header('Content-Type: application/json');
                        echo '{"status":"error","message":"Bytes saved for config.ini are '.$confbytes.'.  DB error is '.$this->con->connect_errno.'"}';

                }

        }

        private function Read($params, $con) {

                $this->l->varErrorLog("Getting Config:");
                //$this->globalconf = parse_ini_file(__DIR__.'/../config.ini');
                $this->l->varErrorLog("Returning Config:");

                // Retrieve the ldap info from the db.
                $con = mysqli_connect($this->globalconf['dbhost'], $this->globalconf['dbuser'], $this->globalconf['dbpass'], $this->globalconf['dbname'], $this->globalconf['dbport']);
                if ($con->connect_errno)
                    $this->l->varErrorLog("Connect failed: ", $con->connect_error);
                else
                    $this->l->varErrorLog("Got DB Con");

                $sql = "select host,port,organization from auth_servers where type = 'ldap'";
                $result = mysqli_query($con, $sql);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

                $this->globalconf['ldaphost'] = $row['host'];
                $this->globalconf['ldapport'] = $row['port'];
                $this->globalconf['ldapou'] = $row['organization'];

                $jrows = json_encode($this->globalconf);
                $this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;

        }

}

