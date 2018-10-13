<?php

require_once __DIR__.'/../../admin/TaskLogCrud.php';
require_once __DIR__.'/../../utils/Log.php';

Class PilotTask {

        private $l;
        private $s;
        private $tl;

        public function __construct()
        {
                $this->l = new Log();
                $this->tl = new TaskLog();

        }

        public function log($msg) {
          $this->l->varErrorLog($msg);
        }

        public function LogTaskStart($pid, $params, $con){

                //$params['taskstate'] = 'during';
                $params['taskpid'] = $pid;
                $params['taskstatus'] = 'RUNNING';
                $this->tl->TaskLogOperation('save',$params, $con);

        }
        public function LogTaskEnd($msg, $output, $error, $params,$con) {

                $output = str_replace(array("\n","\r"), '', $output);
                $params['taskstate'] = 'after';
                $params['taskexit'] = $msg;
                $params['taskstatus'] = 'STOPPED';
                $params['taskoutput'] = $output;
                $params['taskerror'] = $error;
                $this->tl->TaskLogOperation('save',$params,$con);

        }


}

