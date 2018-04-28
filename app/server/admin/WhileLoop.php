<?php

require_once __DIR__.'/../utils/Log.php';
require_once 'IfElse.php';

Class WhileLoop {

        private $l;
	private $ifelse;
	private $execArray;

        public function __construct()
        {
                $this->l = new Log();
		$this->ifelse = new IfElse();
		$this->execArray = array();

        }

        public function ProcessRoute ($wfv, $workflow, $taskout, $current_op, $outputid, $param, $compare, $value,$increment) {
		/* going to need to full workflow here */
		//$this->l->varErrorLog("WHAT ARE THE WORKFLOW LINKS");
		$this->l->varErrorLog($current_op);
		$this->l->varErrorLog($param);
		$this->l->varErrorLog($compare->text);
		$this->l->varErrorLog($value);
		$this->l->varErrorLog($increment);

		$compare = $compare->text;

		if ($param == 'counter') {
			$param = 0;
			$value = (int)$value;
		}
		
		if ($compare === '>') {	
		while ($param > $value) {
		$param = $param + $increment;	
		}

		} else if ($compare === '<') {

		while ($param < $value) {
		$param = $param + $increment;	
		}

		}  else if ($compare === '<=') {

                while ($param <= $value) {
                $param = $param + $increment;
		}

                }  else if ($compare === '>=') {
                while ($param >= $value) {
                $param = $param + $increment;
                }
		}

		//$this->l->varErrorLog("END OF WORKFLOW");
		/*
		foreach ($workflow->links as $linkid=>$link) {
			if ($link->fromOperator == $current_op) {
				$this->CreateWhileExecArray($link->toOperator, $workflow->links);	
			}
		}
		*/

        }

	private function CreateWhileExecArray ($op, $links) {
	
		array_push($this->execArray, $op);

		foreach ($links as $linkid=>$link) {
			if ($link->fromOperator == $op) {
			$next_op = $link->toOperator;
			unset($links->{$linkid});
			$this->CreateWhileExecArray($next_op, $links);
			}	
		}
	}
	
}
?>
