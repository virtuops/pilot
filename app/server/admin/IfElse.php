<?php

require_once __DIR__.'/../utils/Log.php';
require_once 'WFParams.php';

Class IfElse {

        private $l;
        private $wfparams;

        public function __construct()
        {
                $this->l = new Log();
                $this->wfparams = new WFParams();
        }

        public function ProcessRoute ($wfv, $workflow, $taskout, $current_op, $outputid, $param, $compare, $value) {

                $comp = '';
                $this->l->varErrorLog("PROCESSING $param, $compare, $value");

                preg_match('/[<][%][>](.*)[<][%][>]/',$param,$matches);

                if (isset($matches[1])) {

                        $newparam = $this->wfparams->GetIfElseParams($matches[1], $wfv);
                        $comp = $newparam;
                        $this->l->varErrorLog("GETIFELSE RETURNED $newparam");


                } else {
                        $comp = $taskout->{$param};
                }

                foreach ($workflow->links as $key=>$link) {
                        if ($current_op === $link->fromOperator && $link->fromConnector === $outputid) {
                                $getnext = 0;
                        if ($compare === '=') {
                               if ($comp == $value) {
                               $getnext = 1;
                               }
                        } else if ($compare === '>' &&(is_numeric($comp) && is_numeric($value))) {
                                if ($comp > $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<' &&(is_numeric($comp) && is_numeric($value))) {
                                if ($comp < $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '>=' &&(is_numeric($comp) && is_numeric($value))) {
                                if ($comp >= $value) {
                                $getnext = 1;
                                }
                        } else if ($compare === '<=' &&(is_numeric($comp) && is_numeric($value))) {
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

