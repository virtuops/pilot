<?php

require_once __DIR__.'/Login.php';

class WorkFlowsInterface
{
    /**
     * Test api for firing off tasks on the server.
     *
     * @url POST index.php/workflow_run
     */
    public static function workflowRun()
    {
        $string = file_get_contents('php://input');
        $array = json_decode($string, true);
        Login::authenticateThenCall('Workflows', 'workflowRun', $array);
    }

}
