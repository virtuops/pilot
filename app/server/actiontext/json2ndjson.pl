#
#
# Takes Regular JSON Array and converts it to NDJSON
#

use strict;
use warnings;
use Data::Dumper;
use JSON;
use Getopt::Long;

my %output;
my ($status,$infile,$outfile,$jsonarray,$arrayname,$beforeline, $afterline);

GetOptions(
                "infile=s" => \$infile,
                "outfile=s" => \$outfile,
                "arrayname:s" => \$arrayname,
                "jsonarray:s" => \$jsonarray,
                "beforeline:s" => \$beforeline,
                "afterline:s" => \$afterline
        );

open (my $in,"<","$infile") || die '{"status":"Unable to open in file."}';
open (OUTFILE,"+> $outfile") || die '{"status":"Unable to open out file."}';


local $/;
my @targetarray;
my $jsoninput = <$in>;

my $jvar = decode_json($jsoninput);


if (defined($jsonarray)){
@targetarray = @{$jvar->{$jsonarray}};
} else {
@targetarray = @{$jvar};
}

foreach my $target (@targetarray) {
print OUTFILE $beforeline."\n" if defined $beforeline;
print OUTFILE encode_json($target);
print OUTFILE "\n";
print OUTFILE $afterline."\n" if defined $afterline;

}

$output{'jsonarray'} = $jsonarray;
$output{'beforeline'} = $beforeline;

my $json = encode_json(\%output);
print $json;
close (OUTFILE);