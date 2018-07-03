<?php

$params = '{"infile":"\/var\/www\/html\/pilot\/tmp\/files\/latestevents.json","outfile":"\/var\/www\/html\/pilot\/tmp\/files\/elasticevents.json","beforeline":"{\"index\":{\"_index\":\"object_server_events\",\"_type\":\"events\"}}"}';

$pvar = json_decode($params);

var_dump($pvar);
