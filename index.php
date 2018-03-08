<?php
include("security.php");

?>
<!DOCTYPE html>
<html>
<head>
    <title>NOC HERO&trade; Pilot</title>
    <script src="libs/jquery/jquery-3.1.1.min.js" type="text/javascript"></script>
    <script src="libs/w2ui/w2ui-1.5.rc1.min.js" type="text/javascript"></script>
    <script src="libs/visjs/vis.min.js" type="text/javascript"></script>
    <script src="libs/justgage/raphael-2.1.4.min.js" type="text/javascript"></script>
    <script src="libs/justgage/justgage.js" type="text/javascript"></script>
    <script src="libs/chartist/chartist.min.js" type="text/javascript"></script>
    <script src="libs/jquery/jquery-ui.min.js" type="text/javascript"></script>
    <script src="libs/jquery/jquery.panzoom-master/dist/jquery.panzoom.min.js" type="text/javascript"></script>
    <script src="libs/jquery/jquery-mousewheel-master/jquery.mousewheel.min.js" type="text/javascript"></script>
    <script src="libs/jquery/jquery.flowchart.js" type="text/javascript"></script>
    <script data-main="libs/main" src="libs/require/require.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="libs/css/mkadvantage.css" />
    <link rel="stylesheet" type="text/css" href="libs/css/login.css" />
    <link rel="stylesheet" type="text/css" href="libs/css/jquery.flowchart.css">
    <link rel="stylesheet" type="text/css" href="libs/css/custom.css" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
<div id="layout" style="width: 100%; position: fixed; padding:0; margin:0; top:0; left:0; width: 100%; height: 100%;"></div>
<div style="height: 20px;"></div>

<div id="taskbottomform" style="width: 750px; visibility: hidden">
</div>


<div id="taskreportingform" style="width: 750px; visibility: hidden">
</div>

<div id="workflowreportingform" style="width: 750px; visibility: hidden">
</div>

<div id="groupbottomform" style="width: 750px; visibility: hidden;">
</div>

<div id="runbookbottomform" style="width: 750px; visibility: hidden;">
</div>

<script type="text/javascript">

        var NH = {
                problems: [],
                taskparams: {}
        };

            var enableNums = function(category, position){
                if (category === 1 && position < 7) {
                        document.getElementById('minutesnumber').disabled = true;
                } else {
                        document.getElementById('minutesnumber').disabled = false;
                }
                if (category === 2 && position < 7) {
                        document.getElementById('hoursnumber').disabled = true;
                } else {
                        document.getElementById('hoursnumber').disabled = false;
                }
                if (category === 3 && position < 6) {
                        document.getElementById('daysnumber').disabled = true;
                } else {
                        document.getElementById('daysnumber').disabled = false;
                }
                if (category === 4 && position < 5) {
                        document.getElementById('monthsnumber').disabled = true;
                } else {
                        document.getElementById('monthsnumber').disabled = false;
                }
                if (category === 5 && position < 3) {
                        document.getElementById('weekdaysnumber').disabled = true;
                } else {
                        document.getElementById('weekdaysnumber').disabled = false;
                }
        };


 $(function(){
      $("#taskreportingform").load("html/taskreportingform.html");
      $("#workflowreportingform").load("html/workflowreportingform.html");
      $("#runbookbottomform").load("html/runbookbottomform.html");
      $("#groupbottomform").load("html/groupbottomform.html");
      $("#taskbottomform").load("html/taskbottomform.html");
    });

</script>
</body>
</html>

