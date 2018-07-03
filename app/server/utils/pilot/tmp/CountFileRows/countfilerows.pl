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
my %output;

GetOptions(
        "filename=s" => \$filename
        );

open (FILEDATA,"$filename") || die "{\"status\":\"Cannot open or write to ".$filename."\"}\n";

for (<FILEDATA>) {
$output{'status'} = "$.";
}

my $json = encode_json(\%output);
print $json;
close (FILEDATA);
