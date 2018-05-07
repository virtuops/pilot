#
# Using a SQL query as input, this action needs to output a single row of data that will be stored in "output".
#

use strict;
use warnings;
use Data::Dumper;
use JSON;
use DBI;
use DBD::DB2;
use Getopt::Long;

my %output;
my ($status,$user,$password,$database,$query,$host,$port,$queryoutput,$arrayname,$db2home,$db2lib,$ldlibrarypath);

GetOptions(
                "user=s" => \$user,
                "password=s" => \$password,
                "database:s" => \$database,
                "host=s" => \$host,
                "query=s" => \$query,
                "port:s" => \$port,
                "queryoutput:s" => \$queryoutput,
                "arrayname=s" => \$arrayname,
                "db2home=s" => \$db2home,
                "db2lib=s" => \$db2lib,
                "ldlibrarypath=s" => \$ldlibrarypath,
        );

$ENV{'DB2LIB'} = $db2lib;
$ENV{'DB2_HOME'} = $db2home;
$ENV{'LD_LIBRARY_PATH'} = $ldlibrarypath;


open (FILEDATA,"+> $queryoutput") || die "Cannot open file.";

my $dsn = "DATABASE=$database; HOSTNAME=$host; PORT=$port; PROTOCOL=TCPIP; UID=$user; PWD=$password;";

print "$dsn\n";
my $dbh = DBI->connect("dbi:DB2:$dsn", $user, $password) || die "Connection failed with error: $DBI::errstr";

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

$output{"$arrayname"} = \@data;
my $data = encode_json(\@data);
print FILEDATA ($data);

my $json = encode_json(\%output);
print $json;
close (FILEDATA);