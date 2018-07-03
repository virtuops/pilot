#
#
# Run a command on a remote device using SSH
#

use strict;
use warnings;
use Data::Dumper;
use JSON;
use Net::SSH2;
use Getopt::Long;

my %output;
my @data;
my ($status,$user,$password,$arrayname,$sshcmd,$host,$port,$cmdoutput);

GetOptions(
                "user=s" => \$user,
                "password=s" => \$password,
                "sshcmd:s" => \$sshcmd,
                "host=s" => \$host,
                "arrayname:s" => \$arrayname,
                "port=i" => \$port,
                "cmdoutput:s" => \$cmdoutput
        );

if (defined($cmdoutput)) {
open (FILEDATA,"+> $cmdoutput") or $status = "Unable to open file.";

}

if (!defined($port)){
    $port = 22;
}

$status = 'OK';
my $ssh2 = Net::SSH2->new();
$ssh2->connect($host,$port) or $status =  "Unable to connect Host";
$ssh2->auth_password($user,$password) or $status = "Unable to login";

my $chan = $ssh2->channel();
$chan->blocking(0);
$chan->exec($sshcmd);


if (defined($cmdoutput)){
while(<$chan>) {
print FILEDATA;
}
close (FILEDATA);
}

#
# Since SSH commands can be almost anything, their output can also be almost
# anything.  Users will have to configure their output to reflect JSON if they want to store
# info in wfv.
#

if (defined($arrayname)){
#my $meta = $arrayname."_meta";
#$output{"$arrayname"} = \@data;
#$output{"$meta"}{"count"} = $count;
}

$output{'status'} = $status;
my $json = encode_json(\%output);
print $json;

