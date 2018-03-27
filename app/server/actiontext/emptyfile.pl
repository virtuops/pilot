#
#
#  Empties a file.   USE WITH CAUTION.  TEST THIS IN DEVELOPMENT FIRST
#
#

use strict;
use warnings;
use JSON;
use Getopt::Long;

my $filename='';
my %output;

GetOptions(
        "filename=s" => \$filename,
        );

open (FILEDATA,"+> $filename") || die "{\"status\":\"Cannot open or write to ".$filename."\"}\n";

$output{'status'} = 'emptied';
$output{'filename'} = $filename;
my $json = encode_json(\%output);
print $json;

close (FILEDATA);
