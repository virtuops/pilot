<?php

date_default_timezone_set('UTC');
$settings = parse_ini_file('app/server/config.ini');
$host = $settings['dbhost'];
$username = $settings['dbuser'];
$password = $settings['dbpass'];
$dbname = $settings['dbname'];
$port = $settings['dbport'];
$con = new mysqli($host, $username, $password, $dbname, $port);


function debug($data) {
    if (is_array($data))
        $out = "<script>console.log('PHP: ".implode(',', $data)."');</script>";
    else
        $out = "<script>console.log('PHP: ".$data."');</script>";
    echo $out;
}

$valid = 'valid';
$term = 1;
$today = 0;

if ($valid !== 'valid') {
$message = "You do not have a valid license.  Please purchase or renew your license at https://secure.virtuops.com/commanderlicense.";
//debug("Login Error - $message");

    echo '
        <!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
    <title>VirtuOps&reg; Pilot Invalid License</title>
        <link rel="stylesheet" href="libs/css/login.css">
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  </head>

  <body>
    <div class="wrapper">
        <div class="container">
                <h2>'.$message.'</h2>

        </div>

</div>
  </body>
</html>
        ';
    exit();
} else if ($today > $term)  {

        $message = "Your License Term has expired.  Please visit https://secure.virtuops.com/licensing and see how you can purchase a new license. ";
        //debug("Login Error - $message");

            echo '
                <!DOCTYPE html>
        <html >
          <head>
            <meta charset="UTF-8">
            <title>VirtuOps<sup><span style="font-size: 10px;">&reg;</span></sup> Pilot License Expired</title>
                <link rel="stylesheet" href="libs/css/login.css">
                <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
          </head>

          <body>
            <div class="wrapper">
                <div class="container">
                        <h2>'.$message.'</h2>

                </div>

        </div>
          </body>
        </html>
                ';
            exit();

} else {
//Main program starts, license term is good and license is valid.

function loginError($message, $userinfo=null, $con=null) {
    // Increase the LoginCount stat if the user has previously failed a login in the last 5 minutes.
    if ($userinfo) {
        //debug($userinfo);
        $lastLogin = new DateTime($userinfo['LastFailedLogin']);
        $interval = $lastLogin->diff(new DateTime());
        $totalMinutes = $interval->days * 24 * 60 + $interval->h * 60 + $interval->i;

        // We make the user wait 5 minutes after the initial failed login if they proceeded to fail to login
        // 5 times.
        $newLoginCount = $totalMinutes > 5 ? 1 : ($userinfo['LoginCount'] + 1);
        $newLastFailedLogin = $totalMinutes > 5 ? new DateTime() : $lastLogin;

        $stmt = mysqli_prepare($con, "UPDATE users SET LoginCount=?, LastFailedLogin=? WHERE username = ?");
        mysqli_stmt_bind_param($stmt, 'iss', $newLoginCount, $newLastFailedLogin->format('Y-m-d H:i:s'), $userinfo['username']);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
    //debug("Login Error - $message");

    echo '
        <!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
    <title>VirtuOps&reg; Pilot Login</title>
        <link rel="stylesheet" href="libs/css/login.css">
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  </head>

  <body>
    <div class="wrapper">
        <div class="container">
                <h2>'.$message.'</h2>

        </div>

</div>
  </body>
</html>
        ';
    header("Refresh: 3");
    exit();
}

session_start();

/*add new users here */
//$user["admin"] = "admin";

if (!isset($_SESSION['logged_in'])) {
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (empty($_POST['username']) || empty($_POST['password']))
            loginError('Your username/password is wrong!');

         else {

                $settings = parse_ini_file('app/server/config.ini');

                $myusername = mysqli_real_escape_string($con,$_POST['username']);
                $mypassword = mysqli_real_escape_string($con,$_POST['password']);

                // Grab the username and use PHP's password_verify to check the password.
                $sql = "SELECT * FROM users WHERE username = '$myusername'";
                $result = mysqli_query($con, $sql);
                $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
                //debug($row);

                $lastLogin = new DateTime($row['LastFailedLogin']);
                $interval = $lastLogin->diff(new DateTime());
                $totalMinutes = $interval->days * 24 * 60 + $interval->h * 60 + $interval->i;

                if ($row && $row['locked'] == 1)
                    loginError('Your account has been locked. Please contact your administrator for assistance.');
                else if ($row && $row['LoginCount'] >= 5 && $totalMinutes <= 5)
                    loginError('Too many incorrect login attempts. Please wait 5 minutes to login again.');
                // Check if the user has LDAP specified.
                else if ($row && $row['authmethod'] == 'LDAP') {
                    $sql = "SELECT host,port,organization FROM auth_servers WHERE type = 'ldap'";
                    $result = mysqli_query($con, $sql);
                    $ldaprow = mysqli_fetch_array($result, MYSQLI_ASSOC);

                    if (!$ldaprow)
                        loginError('Your username/password is wrong!', $row, $con);
                    else
                        $ldapname = 'ldap://'.$ldaprow['host'].':'.$ldaprow['port'];
                        //debug("testing connection to $ldapname");

                        $ldap = ldap_connect($ldapname);
                        if (!$ldap)
                            loginError('Your username/password is wrong!', $row, $con);
                        ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);

                        $dn = 'uid='.$myusername.',ou='.$ldaprow['organization'];
                        //debug("testing dn $dn with pass $mypassword");
                        $ldapbind = ldap_bind($ldap, $dn, $mypassword);
                        if (!$ldapbind) {
                            //debug("LDAP bind ($ldapname) failed");
                            loginError('Your username/password is wrong!', $row, $con);
                        }
                }
                // Wrong password or row doesn't exist.
                else if (!$row || !password_verify($mypassword, $row['password']))
                    loginError('Your username/password is wrong!', $row, $con);

                $_SESSION['logged_in'] = true;
                $_SESSION['user'] = $_POST['username'];

                /*
                * Here we are going to associate the changing session id to a username.
                * This will allow the application to use a session id to determine what a user gets access to
                * or does not get access to
                */
                $sessionid = $_COOKIE['PHPSESSID'];
                $sessionsql = "UPDATE users set sessionid = '$sessionid' WHERE username = '$myusername'";
                $result = mysqli_query($con,$sessionsql);

                //Need a temp spot for the password locally so we don't force the user to insert it all the time
		//for workflow runs
                setcookie("NHauth", $_POST['password']);
         }
    }
    else
    {
        $msg = '
        <!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
    <title>VirtuOps&reg; Pilot Login</title>
        <link rel="stylesheet" href="libs/css/login.css">
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  </head>

  <body>
    <div class="wrapper">
        <div class="container">
                <h1>VirtuOps<sup><span style="font-size: 10px;">&reg;</span></sup> Pilot</h1>

                <form name="form1" method="post" action="" class="form">
                        <input id="username" name="username" type="text" placeholder="Username" autofocus>
                        <input id="password" name="password" type="password" placeholder="Password">
                        <input id="action" name="action" type="hidden" value="login" placeholder="login">
                        <input id="table" name="table" type="hidden" value="users" placeholder="users">
                        <button type="submit" name="Submit">Login</button>
                </form>
        </div>

	<!--
        <ul class="bg-bubbles">
                <li>Forms</li>
                <li>IFrames</li>
                <li>Lists</li>
                <li>Graphs</li>
                <li>Menus</li>
                <li>Tools</li>
                <li>And More...</li>
        </ul>
	-->
</div>
  </body>
</html>';

        exit($msg);
    }
}

} //program end

?>

