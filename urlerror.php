<?php
session_start();
unset($_SESSION['logged_in']);
$_SESSION = array();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

$error = <<<EOT
<!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
    <title>NOC HERO™ Pilot Login</title>
        <link rel="stylesheet" href="libs/css/login.css">
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  </head>

  <body>
    <div class="wrapper">
        <div class="container">
                <h1>The license you are using is not for this url.  Please check your license or call VirtuOps Support.</h1>

        </div>

</div>
  </body>
</html>
EOT;
echo $error;
//header ("Refresh: 1; index.php");
?>
