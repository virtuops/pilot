<?php
/* main controller for server side */
//ini_set("display_errors","1");

date_default_timezone_set('UTC');


require_once 'utils/Log.php';
require_once 'utils/Crud.php';
$settings = parse_ini_file('config.ini');
$host = $settings['dbhost'];
$username = $settings['dbuser'];
$password = $settings['dbpass'];
$dbname = $settings['dbname'];
$port = $settings['dbport'];

$conn = new mysqli($host, $username, $password, $dbname, $port);


$l = new Log();
$c = new Crud();


$request = array();
$action = '';
$table = '';
$params = array();

if (isset($_POST['request'])){
$request = $_POST['request'];
$request = json_decode($request);
}

$action = (isset($request->cmd) ? $request->cmd : (isset($_POST['cmd']) ? $_POST['cmd'] : 'empty'));
$table = (isset($request->table) ? $request->table : (isset($_POST['table']) ? $_POST['table'] : 'empty'));
$params = (isset($request->params) ? $request->params : (isset($_POST['params']) ? $_POST['params'] : 'empty'));


$c->CrudOperation($action, $table, $params, $conn);

if ($conn) {
$conn->close();
}

?>


