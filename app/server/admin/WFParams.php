<?php

require_once __DIR__.'/../utils/Log.php';

Class WFParams {

        private $l;
        private $levels = 0;
        private $searchloop = array();
        private $searchother = array();

        public function __construct()
        {
                $this->l = new Log();
        }

        public function GetIfElseParams($param, $wfv) {

                $s = explode('|',$param);
                $this->TraverseData($s, $wfv);
                $param = $this->CleanParams($this->lookingfor);
                return $param;

        }

        public function GetTaskParams($params, $wfv){

                preg_match_all('/[%](.*)[%]/U',$params,$matches);

                $searcharray = $matches[0];
                $replacearray = $matches[1];
                $x = 0;

                foreach ($replacearray as $search) {
                        $s = explode('|', $search);
                        $this->TraverseData($s, $wfv);
                        $search = '/[%]'.$search.'[%]/';
                        $search = str_replace('|','[|]',$search);
                        $params = preg_replace($search, $this->lookingfor, $params);
                        $x++;
                }

                $params = $this->CleanParams($params);
                return $params;

        }

        private function TraverseData($map, $val){
                $searchval;
                $prop = array_shift($map);
                if (is_object($val)) {
                        $searchval = $val->{$prop};
                } else if (is_array($val)) {
                        $searchval = $val[$prop];
                }
                if (count($map) > 0) {
                $this->TraverseData($map, $searchval);
                } else {
                $this->lookingfor = $searchval;
                }

        }

        private function CleanParams($params) {

                if (strlen($params) == 0) {
                $params = '{}';
                return $params;
                } else {
                $params = str_replace("'", "\u0027", $params);
                return $params;
                }

        }

}
?>

