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
my ($status,$cmd,$lscmd,$dirname,$match,$unmatch,$lspath,$lsargs,$arrayname);

GetOptions(
                "dirname=s" => \$dirname,
                "match:s" => \$match,
                "unmatch:s" => \$unmatch,
                "lspath=s" => \$lspath,
                "lsargs:s" => \$lsargs,
                "arrayname=s" => \$arrayname
        );

$cmd = "$lspath ";

if (defined($lsargs)){
        $cmd .= " $lsargs $dirname";
} else {
        $cmd .= " -1 $dirname";
}

if (defined($match)) {
        $cmd .= " | grep '$match' ";
}

if (defined($unmatch)){
        $cmd .= " | grep -v '$unmatch' ";
}

print $cmd."\n";
@data = `$cmd`;

$count = scalar(@data);

$_ =~ s/\n//g for @data;


my $meta = $arrayname."_meta";
$output{"$arrayname"} = \@data;
$output{"$meta"}{"count"} = $count;

my $json = encode_json(\%output);
print $json;