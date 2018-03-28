#
#
#  Reads incoming data from the API calls, does a search on the data.  This requires that you use a workflow variable (wfv).  It will read variables.
#
#

use strict;
use warnings;
use JSON;
use Getopt::Long;

my $data='';
my $expression='';
my %output;

$output{'status'} = '';

GetOptions(
        "data=s" => \$data,
        "expression=s" => \$expression
        );

my $exp = qr/$expression/;

if ($data =~ /$exp/i) {

$output{'status'} = $1;

}

my $json = encode_json(\%output);
print $json;
