<?php

require_once __DIR__.'/../admin/Settings.php';
require_once __DIR__.'/../utils/Log.php';
require_once __DIR__.'/Api.php';


class Workflows
{
    public static function workflowRun($args)
    {

        $l = new Log();

        $wfuser = Api::getParam("wfuser", $args);
        $wfpassword = Api::getParam("wfpassword", $args);
        $workflowname = Api::getParam("workflowname", $args);
        $wfv = Api::getParam("wfv",$args);
        $taskmeta = Api::getParam("taskmetadata",$args);
        $wfmeta = Api::getParam("wfmetadata",$args);
        $s = new Settings();
        $settings = $s->getSettings();
        $php = $settings['php'];

        $wfv = json_encode($wfv);
        $taskmeta = json_encode($taskmeta);
        $wfmeta = json_encode($wfmeta);

        try {

        $l->varWFLog("... received workflow_run, params are wfuser='$wfuser', wfpassword='$wfpassword', workflowname='$workflowname', wfv='$wfv', taskmeta='$taskmeta', wfmeta='$wfmeta'",$workflowname);
        $l->varWFLog("... running workflow workflowname='$workflowname'",$workflowname);


        $runwf = $php." ".__DIR__."/../admin/wfwrapper.php ".$wfuser." ".$wfpassword." '".$workflowname."' '".$wfv."' '".$taskmeta."' '".$wfmeta."'";
        $wfout = `$runwf`;

	echo "$wfout";
	
        return true;
        } catch (Exception $e) {
            $l->varWFLog("Could not run workflow '$workflowname':".$e->getMessage(),$workflowname);
        }
    }
}

