<?php

Class Log {

	private $globalconf;

	public function varErrorLog($object=null)
        {
                $this->globalconf = parse_ini_file(__DIR__."/../config.ini");
                $log = $this->globalconf['logfile'];
                ob_start();
                var_dump( $object );
                $date = date(DATE_RFC2822);
                $contents = ob_get_contents();
                ob_end_clean();
                error_log("$date $contents",3,$log);        // log contents of the result of var_dump( $object )
        }


}

