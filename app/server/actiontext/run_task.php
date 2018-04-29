<?php

require_once("libs/NocHeroTask.php");
require_once(__DIR__."/../admin/Settings.php");

class RunTask
{
    public function run($args)
    {

        date_default_timezone_set('UTC');
        $nochero = new NocHeroTask();
        $s = new Settings();
        $settings = $s->getSettings();
        $con = $args['con'];


        $nochero->log("... Starting nochero runtask");

        if (!$args) {
            $params = $_POST["params"];
            $taskdata = $_POST["taskdata"];
        } else {
            $params = $args["params"];
            $taskdata = $args["taskdata"];
        }

        // Parse the params and taskdata to setup initial logging.
        if (!$taskdata)
            $nochero->LogTaskEnd("Error", $output, "Invalid task specified.", $taskdata, $con);

        $filetorun = $taskdata['actionfilename'];
        $language = $taskdata['actionlanguage'];

        try {
            if (!$filetorun) {
                $nochero->LogTaskStart(-1, $taskdata, $con);
                $nochero->LogTaskEnd("Error", $output, "No task code specified to run.", $taskdata, $con);
             }

            else if (!$language) {
                $nochero->LogTaskStart(-1, $taskdata, $con);
                $nochero->LogTaskEnd("Error", $output, "No programming language defined for task task code.", $taskdata, $con);
             }

            // Process the task.
            else {
                // Pass in params as standard options to be parsed.
                $paramString = '';
                foreach ($params as $k => $v)

                    if (is_array($v)) {
                        $v = json_encode($v);
                        $paramString .= " --$k='$v'";
                    } else {
                        $paramString .= " --$k=\"$v\"";
                    }

                if ($language == "php")
                    $cmd = "/usr/bin/env php ".$filetorun;
                else if ($language == "perl")
                    $cmd = "/usr/bin/env perl ".$filetorun;
                else if ($language == "python")
                    $cmd = "/usr/bin/env python ".$filetorun;
                else if ($language == "shell")
                    $cmd = "/usr/bin/env bash ".$filetorun;
                else if ($language == "other")
                    $cmd = __DIR__.'/'.$filetorun;
                $cmd .= $paramString;

                // Use proc_open to run the command, closing it afterwards.
                $desc = array(
                            0 => array("pipe", "r"),
                            1 => array("pipe", "w"),
                            2 => array("pipe", "w")
                        );
                $starttime = microtime(true);
                $startdate = date("Y-m-d H:i:s", round($starttime));
                $taskdata['taskstarttime'] = $startdate;
                $taskdata['taskstate'] = 'before';

                $taskserial = $this->CreateTaskSerial();
                $taskdata['taskserial'] = $taskserial;

                $process = proc_open($cmd, $desc, $pipes, dirname(__FILE__), null);
                $proc_information = proc_get_status($process);
                $pid = $proc_information['pid'];

                $nochero->LogTaskStart($pid, $taskdata, $con);

                // Read the stderr and stdout file descriptors directly.
                $stdout = stream_get_contents($pipes[1]);
                $stderr = stream_get_contents($pipes[2]);
                fclose($pipes[1]);
                fclose($pipes[2]);
                $exit = proc_close($process);

                $stoptime = microtime(true);
                $stopdate = date("Y-m-d H:i:s", round($stoptime));

                $totaltime = $stoptime - $starttime;
                if ($totaltime < 0) {
                $taskdata['tasktime'] = 0.000;
                $exit = '999';
                } else {
                $taskdata['tasktime'] = $totaltime;
                }

                if ($exit === 0)
                    $nochero->log("\n\nsuccess, exit is $exit\n");
                else
                $nochero->log("\n\nfailure, exit is $exit\n");
                $nochero->log("output is ".json_encode($stdout)."\nerror is ".json_encode($stderr)."\n\n");

                $taskdata['taskstate'] = 'after';
                $nochero->LogTaskEnd($exit, $stdout, $stderr, $taskdata, $con);

                echo $taskserial."\n";
                echo $stdout;


            }

        } catch (Exception $e) {
            $nochero->LogTaskEnd("Error", '', $e->getMessage(), $taskdata, $con);
        }
    }

        private function CreateTaskSerial(){

                $possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                $taskserial = '';

                for ($i = 0; $i < 15; $i++) {
                        $taskserial .= $possibleChars[rand(0, strlen($possibleChars)-1)];
                }

                return $taskserial;

        }
}

// If we have posted to this script, run the task.
if ($_POST) {
    $r = new RunTask();
    $output = $r->run(null);
    echo $output;
}

