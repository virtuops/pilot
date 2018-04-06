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
my ($status,$user,$password,$database,$query,$host,$port,$querytoutput);

GetOptions(
                "user=s" => \$user,
                "password=s" => \$password,
                "database:s" => \$database,
                "host=s" => \$host,
                "query=s" => \$query,
                "port:s" => \$port,
                "queryoutput:s" => \$queryoutput
        );

open (FILEDATA,"+> $queryoutput") || die "Cannot open file.";

my $dbh = DBI->connect("DBI:mysql:database=$database;host=$host;port=$port","$user","$password");

my $sth = $dbh->prepare($query);
$sth->execute();

my @data;
if ($sth->errstr()) {
        $output{'status'} = $sth->errstr();
} else {
        $output{'status'} = 'OK';
        while(my $ref = $sth->fetchrow_hashref)
        {
        push (@data, $ref);
        }
}

my $data = encode_json(\@data);
print FILEDATA ($data);

my $json = encode_json(\%output);
print $json;
close (FILEDATA);