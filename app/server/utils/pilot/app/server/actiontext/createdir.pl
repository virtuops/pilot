#
#
# Makes a directory
#

use strict;
use warnings;
use Data::Dumper;
use JSON;
use File::Path qw(make_path);
use Getopt::Long;


my %output;
my ($status,$dirname);

GetOptions(
                "dirname=s" => \$dirname
        );

my @created = make_path($dirname);

$output{'createdir'} = \@created;

my $json = encode_json(\%output);
print $json;
