<?php

require_once __DIR__.'/../utils/Log.php';

Class ForEach {

        private $l;

        public function __construct()
        {
                $this->l = new Log();

        }

        public function ProcessRoute ($workflow, $taskout, $current_op, $outputid, $param, $compare, $value) {

                $workflow = json_decode($workflow);

                /*
                * Get the $taskout array and the next set of tasks underneath
                *
                */
                /*
                foreach (taskout_Array as $k=>$v) {
                        do all tasks and continue on
                }
                */
        }

	
}

?>
