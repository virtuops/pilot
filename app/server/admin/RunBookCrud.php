<?php

require_once 'Settings.php';
require_once __DIR__.'/../utils/Log.php';

Class Runbook {

        private $globalconf;
        private $con;
        private $l;
        private $s;

        public function __construct()
        {
                $this->s = new Settings();
                $this->l = new Log();
                $settings = $this->s->getSettings();

//                $this->l->varErrorLog("DB Settings $host $username $password $dbname $port");
               // $con = new mysqli($host, $username, $password, $dbname, $port);


        }

        public function RunbookOperation($action, $params, $con){


                if ($action == 'save') {
                        $this->CreateUpdate($params, $con);
                } else if ($action == 'get') {
                        $this->Read($params, $con);
                } else if ($action == 'delete') {
                        $this->Delete($params, $con);
                }

        }

        private function CreateUpdate($params, $con) {

                $this->l->varErrorLog("RunbookCreateUpdate: New Params are");
                $this->l->varErrorLog($params);

                $runbookname = $params['runbookname'];
                $runbookid = $params['runbookid'];
                $runbookdescription = $params['runbookdescription'];

                $sql = "replace into runbooks (runbookid, runbookname, runbookdescription) values (?, ?, ?)";

                $stmt = $con->prepare($sql);

                $stmt->bind_param('sss', $runbookid, $runbookname, $runbookdescription);
                $stmt->execute();

                $this->l->varErrorLog("RunbookCreateUpdate DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

        }

        private function Read($params, $con) {


                $runbookid = 'empty';
                if ($params == 'empty') {
                $runbookid = 'empty';
                } else {
                $runbookid = isset($params->runbookid) ? $params->runbookid : (isset($params['runbookid']) ? $params['runbookid'] : 'empty');
                }

                $sql = '';
                $this->l->varErrorLog("Runbook Id is  ");
                $this->l->varErrorLog($runbookid);
                if ($runbookid != 'empty') {
                $sql = "select * from runbooks where runbookid = '$runbookid'";
                } else {
                $sql = "select * from runbooks";
                }

                $this->l->varErrorLog("Runbook SQL is  ");
                $this->l->varErrorLog($sql);

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

                $this->l->varErrorLog("Returning:");
                $records['total'] = count($rows);
                $records['records'] = $rows;
                $jrows = json_encode($records);
                $this->l->varErrorLog($jrows);
                header('Content-Type: application/json');
                echo $jrows;

        }

        private function Delete($params, $con) {

                $this->l->varErrorLog("RunbookDelete PARAMS FOR DELETE....: ");
                $this->l->varErrorLog($params);

                $runbookid = isset($params[0]->runbookid) ? $params[0]->runbookid : (isset($params[0]['runbookid']) ? $params[0]['runbookid'] : 'empty');
                if (strpos($runbookid, '(') !== false) {
                        $sql = "delete from runbooks where runbookid in $runbookid";
                        $stmt = $con->prepare($sql);
                } else {
                        $sql = "delete from runbooks where runbookid = ?";
                        $stmt = $con->prepare($sql);
                        $stmt->bind_param('s', $runbookid);
                }
                $this->l->varErrorLog("Executing statement $sql");
                $stmt->execute();

                $this->l->varErrorLog("RunbookDelete DB Error: ");
                $this->l->varErrorLog($stmt->affected_rows);
                $this->l->varErrorLog($con->error);

                // Return the current records so the grid doesn't have to make a new call.
		$params='empty';
                $this->Read($params, $con);
        }
}

