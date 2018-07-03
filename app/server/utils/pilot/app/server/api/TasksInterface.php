<?php

require_once __DIR__.'/Login.php';

class TasksInterface
{
    /**
     * Test api for firing off tasks on the server.
     *
     * @url POST index.php/task_run
     */
    public static function taskRun()
    {
        $string = file_get_contents('php://input');
        $array = json_decode($string, true);
        Login::authenticateThenCall('Tasks', 'taskRun', $array);
    }

    /**
     * Add a history entry for incoming messages.
     *
     * @url POST index.php/task_log
     */
    public static function taskLog()
    {
        $string = file_get_contents('php://input');
        $array = json_decode($string, true);

        Login::authenticateThenCall('Tasks', 'taskLog', $array);
    }
}

