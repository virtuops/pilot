<?php

require_once __DIR__.'/../actiontext/run_task.php';
require_once __DIR__.'/../admin/ApiUtils.php';
require_once __DIR__.'/Api.php';

class Tasks
{
    public static function taskRun($args)
    {
        $a = new ApiUtils();
        $r = new RunTask();
	$con = $args['con'];

        $runbookid = $args['runbook'];
        $taskmetadata = $args['taskmetadata'];
        $taskname = $args['taskname'];
        $username = $args['_user'];
        $params = $args['params'];

        Api::sendError("FIRING TASK: '$taskname' IN RUNBOOK '$runbookid'");

        try {
            //$params_dec = json_decode($params);
            $params_dec = $params;
        	Api::sendError("PARAMS API ARE '".json_encode($params_dec)."'");
            if (!$params_dec && $params) throw new Exception();
        } catch (Exception $e) {
            Api::sendError("Could not decode params.");
            exit();
        }
        Api::logDebug("... received task_run, params are runbook='$runbookid', taskname='$taskname', username='$username', params='".json_encode($params)."'");

        try {
            $rbparams = array("singlerunbook"=>"true", "runbookid"=>"$runbookid");
            $runbook = $a->ApiUtilsOperation('getrunbook',$rbparams, $con);
            if (!$runbook) {
                Api::sendError("Runbook '$runbookid' does not exist.");
                exit();
            }
            $tparams = array("singletask"=>"true", "taskname"=>"$taskname");
            $task = $a->ApiUtilsOperation('gettask',$tparams, $con);
            if (!$task) {
                Api::sendError("Task '$taskname' does not exist.");
                exit();
            }
            //Add username and runbookid
            $task['username'] = $username;
            $task['runbookid'] = $runbookid;
            $task['taskmetadata'] = $taskmetadata;
		
            $output = $r->run(array('params' => $params_dec, 'taskdata' => $task, 'con' => $con));
            return true;
        } catch (Exception $e) {
            Api::logError("Could not run task '$taskname':".$e->getMessage());
        }
    }
}

