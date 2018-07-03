#
# Ping a single device, bring back alive
# Uses TCP Ping by default
#

use strict;
use warnings;
use Net::Ping;
use Getopt::Long;
use JSON;

my $host='';
my %output;
GetOptions("host=s" => \$host);


my $p = Net::Ping->new();
if ($p->ping($host)) {
$output{'host'} = $host;
$output{'status'} = 'alive';
} else {
$output{'host'} = $host;
$output{'status'} = 'unreachable';
}
$p->close();

my $result = encode_json(\%output);

print $result;
