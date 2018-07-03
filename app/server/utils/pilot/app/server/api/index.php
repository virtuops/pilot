<?php
require __DIR__ . '/lib/RestServer/RestServer.php';
require __DIR__ . '/../utils/Log.php';
require 'TasksInterface.php';
require 'WorkFlowsInterface.php';

$server = new \Jacwright\RestServer\RestServer('debug');
$server->addClass('TasksInterface');
$server->addClass('WorkFlowsInterface');
$server->handle();
