<?php

require_once __DIR__.'/../utils/Log.php';

Class IfElse {

        private $l;

        public function __construct()
        {
                $this->l = new Log();

        }

        public function ProcessRoute ($wfv, $workflow, $taskout, $current_op, $outputid, $param, $compare, $value) {
		$this->l->varErrorLog('TASKOUT IS...');
		$this->l->varErrorLog($taskout);
		$this->l->varErrorLog('PARAM IS...');
		$this->l->varErrorLog($param);
		$this->l->varErrorLog('VALUE IS...');
		$this->l->varErrorLog($value);

                foreach ($workflow->links as $key=>$link) {
                        if ($current_op === $link->fromOperator && $link->fromConnector === $outputid) {
                                $getnext = 0;
                        if ($compare === '=') {
                               if ($taskout->{$param} == $value) {
                               $getnext = 1;
                               }
                        } else if ($compare === '>') {
                                if ($taskout->{$param} > $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<') {
                                if ($taskout->{$param} < $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '>=') {
                                if ($taskout->{$param} >= $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<=') {
                                if ($taskout->{$param} <= $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<>') {
                                if ($taskout->{$param} !== $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === 'LIKE') {
                                $search = ".*".$taskout->{$param}.".*";
                                if (preg_match("/$value/", $search) === 1) {
                                $getnext = 1;
                                }
                        } else if ($compare === 'NOT LIKE') {
                                $search = ".*".$taskout->{$param}.".*";
                                if (preg_match("/$value/", $search) !== 1) {
                                $getnext = 1;
                                }
                        }
                        return $getnext;
                }
         }
        }
}

?>
