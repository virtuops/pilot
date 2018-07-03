#
#
# Query Tabular Data Stream data sources (MSSQL, Netcool Object Server, Sybase, etc).
# Freetds must be installed for this to work.  Your freetds.conf file also needs to be
# updated with server connection information.  Visit www.freetds.org for more detail.
#
#

=begin REMOVE THIS WHEN YOU HAVE DBD::Sybase installed, then save it
use strict;
use warnings;
use Data::Dumper;
use JSON;
use DBI;
use DBD::Sybase;
use Getopt::Long;

my %output;
my ($status,$user,$password,$server,$database,$query,$queryoutput,$arrayname);

GetOptions(
                "user=s" => \$user,
                "password=s" => \$password,
                "database:s" => \$database,
                "query=s" => \$query,
                "queryoutput:s" => \$queryoutput,
                "arrayname=s" => \$arrayname,
                "server=s" => \$server,
        );


open (FILEDATA,"+> $queryoutput") || die "Cannot open file.";

my $dsn = "dbi:Sybase:server=$server";

# Connect to the database
my $dbh = DBI->connect($dsn, $user, $password, { AutoCommit => 0 }) || die "Failed to connect!";

my $sth = $dbh->prepare($query);
$sth->execute();

my @data;
my $count = 0;
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
$data =~ s/\\u0000//g;
print FILEDATA ($data);

my $json = encode_json(\%output);
$json =~ s/\\u0000//g;
print $json;
close (FILEDATA);
=end
