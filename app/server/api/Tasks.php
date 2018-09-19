<?php

require_once __DIR__.'/../actiontext/run_task.php';
require_once __DIR__.'/../admin/ApiUtils.php';
require_once __DIR__.'/../utils/Log.php';
require_once __DIR__.'/Api.php';

class Tasks
{
    public static function taskRun($args)
    {
        $a = new ApiUtils();
        $r = new RunTask();
	$l = new Log();
	$con = $args['con'];

        $runbookid = $args['runbook'];
        $wfname = $args['wfname'];
        $taskmetadata = $args['taskmetadata'];
        $taskname = $args['taskname'];
        $username = $args['_user'];
        $params = $args['params'];

        Api::sendError("FIRING TASK: '$taskname' IN RUNBOOK '$runbookid'");

        try {
            //$params_dec = json_decode($params);
            $params_dec = $params;
        	$l->varWFLog("PARAMS API ARE '".json_encode($params_dec)."'",$wfname);
            if (!$params_dec && $params) throw new Exception();
        } catch (Exception $e) {
            $l->varWFLog("Could not decode params.",$wfname);
            exit();
        }
        $l->varWFLog("... received task_run, params are runbook='$runbookid', taskname='$taskname', username='$username', params='".json_encode($params)."'",$wfname);

        try {
            $rbparams = array("singlerunbook"=>"true", "runbookid"=>"$runbookid");
            $runbook = $a->ApiUtilsOperation('getrunbook',$rbparams, $con);
            if (!$runbook) {
                $l->varWFLog("Runbook '$runbookid' does not exist.",$wfname);
                exit();
            }
            $tparams = array("singletask"=>"true", "taskname"=>"$taskname");
            $task = $a->ApiUtilsOperation('gettask',$tparams, $con);
            if (!$task) {
                $l->varWFLog("Task '$taskname' does not exist.",$wfname);
                exit();
            }
            //Add username and runbookid
            $task['username'] = $username;
            $task['runbookid'] = $runbookid;
            $task['taskmetadata'] = $taskmetadata;
		
            $output = $r->run(array('params' => $params_dec, 'taskdata' => $task, 'con' => $con));
            return true;
        } catch (Exception $e) {
            $l->varWFLog("Could not run task '$taskname':".$e->getMessage(),$wfname);
        }
    }
}

