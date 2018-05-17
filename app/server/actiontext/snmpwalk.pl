# ============================================================================
# This script has been adapted from the attribution below
# To use this with commander, your tool arguments need to look like this
#

# $Id: snmpwalk.pl,v 2.5 2005/07/20 13:53:07 dtown Rel $

# Copyright (c) 2000-2005 David M. Town <dtown@cpan.org>
# All rights reserved.

# This program is free software; you may redistribute it and/or modify it
# under the same terms as Perl itself.

# ============================================================================

use Net::SNMP v5.1.0 qw(:snmp DEBUG_ALL);
use JSON;
use Getopt::Long;

my ($hostname,$cmdoutput,$community,$port,$version,$baseoid,$arrayname);

GetOptions(
        "hostname=s" => \$hostname,
        "community=s" => \$community,
        "baseoid=s" => \$baseoid,
        "arrayname:s" => \$arrayname,
        "cmdoutput:s" => \$cmdoutput,
        "port:s" => \$port,
        "version:s" => \$version
        );



use strict;
use vars qw($SCRIPT $VERSION);

$SCRIPT  = 'snmpwalk';
$VERSION = '2.3.0';

my @outarray;
my %output;

if (defined($cmdoutput)){
open (FILEDATA,"+> $cmdoutput");
}

# Create the SNMP session
my ($s, $e) = Net::SNMP->session(
   -hostname => $hostname,
   -community    =>  $community,
   -port    =>  $port,
   -version => $version || 'snmpv2c'
);

# Was the session created?
if (!defined($s)) {
   _exit($e);
}

# Perform repeated get-next-requests or get-bulk-requests (SNMPv2c)
# until the last returned OBJECT IDENTIFIER is no longer a child of
# OBJECT IDENTIFIER passed in on the command line.

my @args = (
   -varbindlist    => [$baseoid]
);

if ($s->version == SNMP_VERSION_1) {

   my $oid;

   while (defined($s->get_next_request(@args))) {
        my %outrecord;
      $oid = ($s->var_bind_names())[0];

      if (!oid_base_match($baseoid, $oid)) { last; }
      #printf(
      #    "%s = %s: %s\n", $oid,
      #    snmp_type_ntop($s->var_bind_types()->{$oid}),
      #    $s->var_bind_list()->{$oid},
      #);

        $outrecord{"$oid"} = snmp_type_ntop($s->var_bind_types()->{$oid}) .' '. $s->var_bind_list()->{$oid};
        push @outarray, \%outrecord;

      @args = (-varbindlist => [$oid]);
   }

} else {

   push(@args, -maxrepetitions => 25);


   outer: while (defined($s->get_bulk_request(@args))) {

      my @oids = oid_lex_sort(keys(%{$s->var_bind_list()}));

      foreach (@oids) {
        my %outrecord;

         if (!oid_base_match($baseoid, $_)) { last outer; }
         #printf(
         #   "%s = %s: %s\n", $_,
         #   snmp_type_ntop($s->var_bind_types()->{$_}),
         #   $s->var_bind_list()->{$_},
         #);

        $outrecord{"$_"} = snmp_type_ntop($s->var_bind_types()->{$_}) .' '. $s->var_bind_list()->{$_};
        push @outarray, \%outrecord;
         # Make sure we have not hit the end of the MIB
         if ($s->var_bind_list()->{$_} eq 'endOfMibView') { last outer; }
      }

      # Get the last OBJECT IDENTIFIER in the returned list
      @args = (-maxrepetitions => 25, -varbindlist => [pop(@oids)]);
   }

}

# Let the user know about any errors
if ($s->error() ne '') {
   _exit($s->error());
}


# Close the session
$s->close();

my $meta = $arrayname."_meta";
$output{"$arrayname"} = \@outarray;

my $json = encode_json(\%output);
print $json;

if (defined($cmdoutput)){
print FILEDATA ($json);
close (FILEDATA);
}

exit 0;


sub _exit
{
        my %outrecord;
        my @outarray;
        $outrecord{'oid'} = 'ERROR';
        $outrecord{'value'} = shift @_;
        push @outarray, \%outrecord;
        my $outresult = encode_json(\@outarray);
        print $outresult;
   exit 1;
}


# ============================================================================

