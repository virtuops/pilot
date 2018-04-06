#
# Performs a REST API query to an endpoint.
#

use strict;
use warnings;
use JSON;
use Getopt::Long;
use Data::Dumper;

my %output;

my ($method,$header1,$header2,$header3,$curlpath,$user,$url,$password,$data,$cmdoutput,$status);


GetOptions(
        "method=s" => \$method,
        "curlpath=s" => \$curlpath,
        "user:s" => \$user,
        "url=s" => \$url,
        "password:s" => \$password,
        "data:s" => \$data,
        "header1:s" => \$header1,
        "header2:s" => \$header2,
        "header3:s" => \$header3,
        "cmdoutput:s" => \$cmdoutput
        );

#open (FILEDATA,"+> $cmdoutput");

#my $createcmd = $curlpath." -s -X ".$method." -H 'Content-Type: application/json' -d '".$data."' -u '".$user.":".$password."' https://".$domain."/api/now/table/".$table." 2>&1";

my $createcmd = $curlpath." -s -X ".$method;

if (defined($header1)){
$createcmd .= " -H ".$header1." ";
}

if (defined($header2)){
$createcmd .= " -H ".$header2." ";
}

if (defined($header3)){
$createcmd .= " -H ".$header3." ";
}

if (defined($user) && defined($password)) {
$createcmd .= " -u '".$user.":".$password."'";
} elsif (defined($user)) {
$createcmd .= " -u '".$user."'";
}

if (defined($data)) {
$createcmd .= " -d '".$data."'";
}

$createcmd .= "'".$url."'";

my $createrequest = `$createcmd`;

print FILEDATA $createrequest;

if (length($createrequest) > 0) {
        $status = "Created";
} else {
        $status = "Problem Creating Entry";
}

$output{'status'} = $status;

my $json = encode_json(\%output);
print $json;

