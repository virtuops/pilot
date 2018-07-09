#
# Performs a REST API query to an endpoint.
#

use strict;
use warnings;
use JSON;
use Getopt::Long;
use Data::Dumper;

my %output;

my ($method,$header1,$header2,$header3,$databinary,$arrayname,$curlpath,$user,$url,$password,$data,$cmdoutput,$status);


GetOptions(
        "method=s" => \$method,
        "curlpath=s" => \$curlpath,
        "user:s" => \$user,
        "url=s" => \$url,
        "password:s" => \$password,
        "data:s" => \$data,
        "databinary:s" => \$databinary,
        "header1:s" => \$header1,
        "header2:s" => \$header2,
        "header3:s" => \$header3,
        "arrayname:s" => \$arrayname,
        "cmdoutput:s" => \$cmdoutput
        );
        
        

if (defined($cmdoutput)){
open (FILEDATA,"+> $cmdoutput");
}
#my $createcmd = $curlpath." -s -X ".$method." -H 'Content-Type: application/json' -d '".$data."' -u '".$user.":".$password."' https://".$domain."/api/now/table/".$table." 2>&1";

my $createcmd = $curlpath." -s -X ".$method;
my $postdata;

if (defined($header1)){
$createcmd .= " -H ".$header1." ";
}

if (defined($header2)){
$createcmd .= " -H ".$header2." ";
}

if (defined($header3)){
$createcmd .= " -H ".$header3." ";
}

if (defined($user) && defined($password) && length($user) > 0 && length($password) > 0) {
$createcmd .= " -u '".$user.":".$password."'";
} elsif (defined($user) && length($user) > 0) {
$createcmd .= " -u '".$user."'";
}

if (defined($data)) {
 
     $createcmd .= " -d '".$data."' ";
     
} elsif (defined($databinary)) {
    $createcmd .= " --data-binary '".$databinary."' ";
    
}

$createcmd .= " '".$url."' ";

my $createrequest = `$createcmd`;
my $meta = $arrayname."_meta";
$output{"$arrayname"} = decode_json($createrequest);


if (defined($cmdoutput)){
print FILEDATA $createrequest;
}

if (length($createrequest) > 0) {
        $status = "Created";
        $output{"$meta"}{"count"} = 1;
} else {
        $status = "Problem Creating Entry";
}

$output{'status'} = $status;


my $json = encode_json(\%output);
print $json;

if (defined($cmdoutput)){
close(FILEDATA);
}
