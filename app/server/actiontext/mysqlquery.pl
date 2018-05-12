#
#
# Using a SQL query as input, this action needs to output a single row of data that will be stored in "output".
#

use strict;
use warnings;
use Data::Dumper;
use JSON;
use DBI;
use DBD::mysql;
use Getopt::Long;

my %output;
my ($status,$user,$password,$arrayname,$database,$query,$host,$port,$queryoutput);

GetOptions(
                "user=s" => \$user,
                "password=s" => \$password,
                "database:s" => \$database,
                "host=s" => \$host,
                "arrayname:s" => \$arrayname,
                "query=s" => \$query,
                "port:s" => \$port,
                "queryoutput:s" => \$queryoutput
        );

open (FILEDATA,"+> $queryoutput") || die "Cannot open file.";

my $dbh = DBI->connect("DBI:mysql:database=$database;host=$host;port=$port","$user","$password");

my $sth = $dbh->prepare($query);
$sth->execute();

my @data;
my $count=0;
if ($sth->errstr()) {
        $output{'status'} = $sth->errstr();
} else {
        $output{'status'} = 'OK';
        while(my $ref = $sth->fetchrow_hashref)
        {
        push (@data, $ref);
        $count++;
        }
}

$dbh->disconnect;

my $meta = $arrayname."_meta";
$output{"$arrayname"} = \@data;
$output{"$meta"}{"count"} = $count;
my $data = encode_json(\@data);
print FILEDATA ($data);

my $json = encode_json(\%output);
print $json;
close (FILEDATA);