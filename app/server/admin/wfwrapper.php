<?php

require_once 'WorkFlowExecute.php';

$wf = new WorkFlowExecute();

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

$wf->WorkFlowExecuteOperation('start',$params);
