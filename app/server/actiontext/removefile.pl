#
#
# Using a SQL query as input, this action needs to output a single row of data that will be stored in "output".
#

use strict;
use warnings;
use Data::Dumper;
use JSON;
use Getopt::Long;

my %output;
my @data;
my $count;
my ($status,$dirname,$filename);

GetOptions(
                "dirname:s" => \$dirname,
                "filename=s" => \$filename
                
        );


$status = unlink "$dirname/$filename";

$output{'status'} = $status;


my $json = encode_json(\%output);
print $json;