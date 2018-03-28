#
#
# DNS FORM for NOC HERO


use strict;
use warnings;
use Net::DNS;
use Getopt::Long;
use JSON;

my $host='';
my $res;
my %output;

GetOptions("host=s" => \$host);
$res = Net::DNS::Resolver->new();
my $reply = $res->search($host);

if ($reply) {
        foreach my $rr ($reply->answer) {

        next unless $rr->type eq "A" || $rr->type eq "PTR";

                if ($rr->type eq "A") {
                my $ipaddr = $rr->address;
                $output{'host'} = $host;
                $output{'status'} = "IP: $ipaddr";
                } elsif ($rr->type eq "PTR") {
                my $name = $rr->ptrdname;
                $output{'host'} = $host;
                $output{'status'} = "Name: $name";

                }

        }
} else {
        $output{'host'} = $host;
        $output{'status'} = "QUERY FAILED!";
}

my $result = encode_json(\%output);
print $result;
