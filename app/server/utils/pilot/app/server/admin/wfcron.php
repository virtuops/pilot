<?php

require_once __DIR__.'/WorkFlowExecute.php';
require_once __DIR__.'/WFScheduleCrud.php';

/*
*
* Every minute, this runs
* 1)  Gets the current time
* 2)  Gets all of the scheduled workflows
* 3)  If it is time, run the workflow
*
*/
$settings = parse_ini_file(__DIR__.'/../config.ini');
$dbhost = $settings['dbhost'];
$dbuser = $settings['dbuser'];
$dbpass = $settings['dbpass'];
$dbname = $settings['dbname'];
$dbport = $settings['dbport'];

$con = new mysqli($dbhost, $dbuser, $dbpass, $dbname, $dbport);
$wf = new WorkFlowExecute();
$wfs = new WorkFlowSchedule();


$user = $argv[1];
$password = $argv[2];
$time = date("Y-m-d H:i:s");


$params = array(
        "wfuser" => $user,
        "wfpassword" => $password,
        );


function parse_crontab($time, $crontab) {

          $time=explode(' ', date('i G j n w', strtotime($time)));
          $crontab=explode(' ', $crontab);
          foreach ($crontab as $k=>&$v)
                  {
		$time[$k]=intval($time[$k]);
                   $v=explode(',', $v);
                   foreach ($v as &$v1)
                           {$v1=preg_replace(array('/^\*$/', '/^\d+$/', '/^(\d+)\-(\d+)$/', '/^\*\/(\d+)$/'),
                                             array('true', $time[$k].'===\0', '(\1<='.$time[$k].' and '.$time[$k].'<=\2)', $time[$k].'%\1===0'),
                                             $v1
                                            );
                           }
                   $v='('.implode(' or ', $v).')';
                  }

          $crontab=implode(' and ', $crontab);
          return eval('return '.$crontab.';');
}

$wfsresults = $wfs->WorkFlowScheduleOperation('returncron',$params, $con);
$schedrecords = $wfsresults['records'];

foreach ($schedrecords as $result) {

	$wfschedule = $result['workflowschedule'];
	$wfname = $result['workflowname'];
	$params['wfname'] = $wfname;
	$params['workflowname'] = $wfname;

	print "\nSCHED is $wfschedule and NAME is $wfname\n";

	$timetofire = parse_crontab($time, $wfschedule);

	print "\nTIME TO FIRE IS $timetofire\n";
	if ($timetofire) {

	$wf->WorkFlowExecuteOperation('start',$params,$con);

	}

}

$con->close();
