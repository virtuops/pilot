#
#
# Runs a generic command from the command line

use strict;
use warnings;
use Data::Dumper;
use JSON;
use Getopt::Long;


my %output;
my ($status,$taskpath,$arrayname,$arguments,$cmdoutput);

GetOptions(
                "taskpath=s" => \$taskpath,
                "arguments:s" => \$arguments,
                "arrayname:s" => \$arrayname,
                "cmdoutput:s" => \$cmdoutput
        );
        
if (length($cmdoutput) > 0){
    open (CMDOUTPUT,"+> $cmdoutput") || die "Cannot open generic task";
}

my $cmd = $taskpath;

my @args = split(',',$arguments);

foreach my $arg (@args) {
    
    $cmd .= " ".$arg." ";
}

my $cmdout = `$cmd`;

$output{"$arrayname"} = $cmdout;

if (length($cmdoutput) > 0){
    print CMDOUTPUT $cmdout;
    close(CMDOUTPUT);
}

my $json = encode_json(\%output);
print $json;
