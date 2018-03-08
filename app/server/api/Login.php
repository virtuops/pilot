<?php

require_once __DIR__.'/../admin/ApiUtils.php';
require_once __DIR__.'/../utils/Log.php';
require_once __DIR__.'/Workflows.php';
require_once __DIR__.'/Tasks.php';

class Login
{
    public static function authenticateThenCall($class, $method, $args)
    {
        $a = new ApiUtils();
        $l = new Log();

        $l->varErrorLog('Auth Login');

        if (!isset($_SERVER['PHP_AUTH_USER'])) {
            header('WWW-Authenticate: Basic realm="NOCHero"');
            header('HTTP/1.0 401 Unauthorized');
            echo 'These resources are protected with HTTP Basic Authentication.';
            exit;
        }


        // Validate the user exists in our db.
        $username = $_SERVER['PHP_AUTH_USER'];
        $pw = $_SERVER['PHP_AUTH_PW'];

	$settings = parse_ini_file('../config.ini');
	$dbhost = $settings['dbhost'];
	$dbuser = $settings['dbuser'];
	$dbpass = $settings['dbpass'];
	$dbname = $settings['dbname'];
	$dbport = $settings['dbport'];

	$con = new mysqli($dbhost, $dbuser, $dbpass, $dbname, $dbport);

        $params = array("singleuser"=>"true", "username"=>"$username");

        $user = $a->ApiUtilsOperation('getuser',$params, $con);

        if (!$user || !password_verify($pw, $user['password'])) {
            header('WWW-Authenticate: Basic realm="NOCHero"');
            header('HTTP/1.0 401 Unauthorized');
            echo "Unable to login as '$username'.";
            exit;
        }

        // Call the static method and handle any errors.
        $args['_user'] = $username;
        $args['con'] = $con;

        if (!forward_static_call(array($class, $method), $args)) {
            Api::logError("Error calling $class::$method with args:\n".json_encode($args));
            Api::sendError("Error calling $class::$method.");
            exit;
        }

	$con->close();

    }
}

