<?php

require_once 'WorkFlowExecute.php';
require_once 'Settings.php';

$wf = new WorkFlowExecute();
$s = new Settings();

$settings = $s->getSettings();
$host = $settings['dbhost'];
$username = $settings['dbuser'];
$password = $settings['dbpass'];
$dbname = $settings['dbname'];
$port = $settings['dbport'];

$con = new mysqli($host, $username, $password, $dbname, $port);

$user = $argv[1];
$password = $argv[2];
$wfname = $argv[3];
$wfv = $argv[4];
$taskmeta = $argv[5];
$wfmeta = $argv[6];

$wfv_arr = array();
$taskmeta_arr = array();
$wfmeta_arr = array();

if (strlen($wfv) > 0) {
        $wfv_arr = json_decode($wfv);
}
if (strlen($taskmeta) > 0) {
        $taskmeta_arr = json_decode($taskmeta);
}
if (strlen($wfv) > 0) {
        $wfmeta_arr = json_decode($wfmeta);
}

$params = array(
        "wfuser" => $user,
        "wfpassword" => $password,
        "workflowname" => $wfname,
        "wfname" => $wfname,
        "wfv" => $wfv_arr,
        "taskmeta" => $taskmeta_arr,
        "wfmeta" => $wfmeta_arr
        );

$wf->WorkFlowExecuteOperation('start',$params, $con);

$con->close();

