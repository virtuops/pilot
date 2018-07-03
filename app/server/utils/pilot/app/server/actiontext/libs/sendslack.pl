#!/usr/bin/perl
# Sends a slack message
#
#

use strict;
use warnings;
use JSON;
use Getopt::Long;
use POSIX qw{strftime};

my $tail=length($ARGV[0]) > 0 ? $ARGV[0] : 'No tail specified';
my $flight=length($ARGV[1]) > 0 ? $ARGV[1] : 'No flight specified';
my $citypair=length($ARGV[2]) > 0 ? $ARGV[2] : '(no city pair)';
my $duration=int($ARGV[3]) > 0 ? strftime("\%H:\%M:\%S", gmtime($ARGV[3])) : 'over 1 hour';
my $url=length($ARGV[4]) > 0 ? $ARGV[4] : 'No Service Now URL';
my $ticketnumber=length($ARGV[5]) > 0 ? $ARGV[5] : 'Ticket Number Unknown';


#$duration = strftime("\%H:\%M:\%S", gmtime($duration));

$url = $url.'|'.$ticketnumber;

$url =~ s/&/&amp;/g;
$url =~ s/</&lt;/g;
$url =~ s/>/&gt;/g;

my %output;

my $curlpath = '/usr/bin/curl ';
my $username = 'VirtuOps Pilot';
my $emoji =  ':frowning:';
my $webhookurl = 'https://hooks.slack.com/services/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';
my $channel = 'supercoolchannel';
my $text = 'We have ascending temperature alarms with tail '.$tail.' on flight '.$flight.' between '.$citypair.'.  Flight duration was '.$duration.' long.  Tail report is available at ticket <'.$url.'>.';

my $data = 'payload={"channel":"'.$channel.'","username":"'.$username.'","text":"'.$text.'","icon_emoji":"'.$emoji.'"}';
my $createcmd = $curlpath." -s -X POST --data-urlencode '".$data."' " .$webhookurl." 2>&1";


my $createrequest = `$createcmd`;

#my $slackcmd = "/usr/bin/curl -F file=@/var/www/html/pilot/tmp/files/tail_report.csv -F channels=#supercoolchannel -F token=xoxp-49276862837-49228469587-354042894019-47cbe898edb698fdeaaa37ec3153ae2f https://mkadevelopment.slack.com/api/files.upload";

#my $slackout = `$slackcmd`;

$output{'status'} = 'report sent to Slack';

my $json = encode_json(\%output);
print $json;

