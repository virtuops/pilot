#
# Sends secure email using SMTPS.  Must have Net::SMTPS loaded and accessible to the web server user
# Form requires recipient,subject,body and message fields.  The message field will catch errors
# 
#

use strict;
use warnings;
use JSON;
use Getopt::Long;
use Net::SMTPS;

my ($smtpserver, $smtpport, $smtpuser, $smtppassword, $recipient,$subject,$body);

my $debugerr;
my $debugout;
my %output;

GetOptions(
        "smtpserver=s" => \$smtpserver,
        "smtpport=s" => \$smtpport,
        "smtpuser=s" => \$smtpuser,
        "smtppassword=s" => \$smtppassword,
        "recipient=s" => \$recipient,
		"subject=s" => \$subject,
		"body=s" => \$body
		);

if (! $recipient || ! $subject || ! $body)
{
  $output{'status'} = "You need a recipient, subject and body";
  
} 

#my $smtpserver = 'smtp.gmail.com';
#my $smtpport = 587;
#my $smtpuser   = '<<<<USER THAT CAN LOG INTO SMTP SERVER>>>>>';
#my $smtppassword = '<<<<USER PASSWORD>>>>>';

my $smtp = Net::SMTPS->new($smtpserver, Port=>$smtpport, doSSL => 'starttls', Timeout => 10, Debug => 0);

die "Could not connect to server!\n" unless $smtp;

$smtp->auth($smtpuser, $smtppassword);
$smtp->mail('support@virtuops.com');
$smtp->to($recipient);
$smtp->data();
$smtp->datasend("Subject: $subject");
$smtp->datasend("\n");
$smtp->datasend("$body");
$smtp->datasend("\n");
$smtp->dataend();
my @msgs = $smtp->message();
$smtp->quit;


foreach my $msg (@msgs) {
        if ($msg =~ /OK/) {
                $output{'status'} = "Message Sent";
        } else {
				$output{'status'} = "FAILURE:  Message Not Sent";
		}
}

my $json = encode_json(\%output);
print $json;
