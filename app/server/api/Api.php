<?php

// Imports for the logging library, preserve order of these calls.
require_once __DIR__.'/lib/psr-log/Psr/Log/LogLevel.php';
require_once __DIR__.'/lib/psr-log/Psr/Log/LoggerTrait.php';
require_once __DIR__.'/lib/psr-log/Psr/Log/InvalidArgumentException.php';
require_once __DIR__.'/lib/psr-log/Psr/Log/LoggerInterface.php';
require_once __DIR__.'/lib/psr-log/Psr/Log/LoggerAwareInterface.php';
require_once __DIR__.'/lib/psr-log/Psr/Log/LoggerAwareTrait.php';
require_once __DIR__.'/lib/psr-log/Psr/Log/AbstractLogger.php';
require_once __DIR__.'/lib/psr-log/Psr/Log/NullLogger.php';
require_once __DIR__.'/lib/klogger/src/Logger.php';

require_once __DIR__.'/../admin/Settings.php';

class Api
{
    public static function logDebug($message)
    {
        $logger = new Katzgrau\KLogger\Logger(__DIR__.'/logs');
        $logger->debug($message);
    }

    public static function logInfo($message)
    {
        $logger = new Katzgrau\KLogger\Logger(__DIR__.'/logs');
        $logger->info($message);
    }

    public static function logError($message)
    {
        $logger = new Katzgrau\KLogger\Logger(__DIR__.'/logs');
        $logger->error($message);
    }

    public function sendArray($array)
    {
        $message = json_encode(array_merge(array("Success" => 1), $array));
        print $message."\n";

        if (!is_string($message)) $message = json_encode($message);
        Api::logInfo(substr($message, 0, 130).(strlen($message) > 130 ? " ....... (truncated)" : "")); // truncate messages
        //Api::logInfo("$message");
    }

    public function sendMsg($status, $message)
    {
        print json_encode(array("Success" => 1, "$status" => $message))."\n";

        if (!is_string($message)) $message = json_encode($message);
        Api::logInfo("$status: ".substr($message, 0, 130).(strlen($message) > 130 ? " ....... (truncated)" : "")); // truncate messages
        //Api::logInfo("$status: $message");
    }

    public static function sendError($message)
    {
        print json_encode(array("Success" => 0, "Message" => $message))."\n";
        Api::logError("Error: $message");
    }

    public static function getMysqlCon()
    {
        $s = new Settings();
        $settings = $s->getSettings();
        $host = $settings['dbhost'];
        $username = $settings['dbuser'];
        $password = $settings['dbpass'];
        $dbname = $settings['dbname'];
        $port = $settings['dbport'];

        $con = new mysqli($host, $username, $password, $dbname, $port);
        return $con;
    }

    // Retrieve the parameter from the GET/POST array. Optional required keyword to
    // make sure it exists if needed.

    public static function getParam($name, $array, $required = true)
    {
        $val = '';


        if (array_key_exists($name, $array))
            $val = $array[$name];

        if (!$val && $required) {
            Api::sendError("No $name specified.");
            exit();
        }

        return $val;
    }
}


