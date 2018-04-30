<?php

require_once __DIR__.'/../utils/Log.php';

Class IfElse {

        private $l;

        public function __construct()
        {
                $this->l = new Log();

        }

        public function ProcessRoute ($wfv, $workflow, $taskout, $current_op, $outputid, $param, $compare, $value) {
		$this->l->varErrorLog('PARAM IS...');
		$this->l->varErrorLog($param);
		$this->l->varErrorLog('VALUE IS...');
		$this->l->varErrorLog($value);

		$comp = '';

		preg_match('/[%](.*)[%]/',$param,$matches);
		
		if (isset($matches[1])) {
			$p = explode('|',$matches[1]);	
			$loopid = '';
			$targetarray = '';
			$array_key = '';
			$obj_key = '';

			$this->l->varErrorLog('COUNT OF P IS ');
			$this->l->varErrorLog(count($p));

			if (count($p) === 3) {
			$loop = $p[0];
			$targetobject = $p[1];
			$array_key = $p[2];
			$comp = $wfv->{$loop}->{$targetobject}->current_val->{$array_key};
			}
			if (count($p) === 2) {
			$loopid = $p[0];
			$obj_key = $p[1];
			$comp = $wfv->{$loop}->{$obj_key};
			}

		} else {
			$comp = $taskout->{$param};
		}
		$this->l->varErrorLog('COMP IS...');
		$this->l->varErrorLog($comp);

                foreach ($workflow->links as $key=>$link) {
                        if ($current_op === $link->fromOperator && $link->fromConnector === $outputid) {
                                $getnext = 0;
                        if ($compare === '=') {
                               if ($comp == $value) {
                               $getnext = 1;
                               }
                        } else if ($compare === '>') {
                                if ($comp > $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<') {
                                if ($comp < $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '>=') {
                                if ($comp >= $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<=') {
                                if ($comp <= $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<>') {
                                if ($comp !== $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === 'LIKE') {
                                $search = ".*".$comp.".*";
                                if (preg_match("/$value/", $search) === 1) {
                                $getnext = 1;
                                }
                        } else if ($compare === 'NOT LIKE') {
                                $search = ".*".$comp.".*";
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
