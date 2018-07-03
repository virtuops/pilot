#
#
#  Writes data to a file for later use, one line at a time.
#
#

use strict;
use warnings;
use JSON;
use Getopt::Long;

my $filename='';
my $data='';
my %output;

GetOptions(
        "filename=s" => \$filename,
        "data=s" => \$data
        );

open (FILEDATA,"+>> $filename") || die "{\"status\":\"Cannot open or write to ".$filename."\"}\n";

print FILEDATA "$data\n";

$output{'status'} = 'saved';
my $json = encode_json(\%output);
print $json;
close (FILEDATA);