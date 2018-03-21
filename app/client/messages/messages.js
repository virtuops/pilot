define(function (require) {
    return {
        noadmindelete: function() {
                w2popup.open({
                        title     : 'Delete User Error',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You cannot delete the admin user</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        needwfname: function() {
                w2popup.open({
                        title     : 'Need a workflowname',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>The workflow name cannot be blank.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        workflowdeleted: function(workflowname) {
                w2popup.open({
                        title     : 'Workflow '+workflowname+' deleted',
                        body      : '<div class="w2ui-centered" style="color: black;"><b>Workflow deleted.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        workflowsaved: function(workflowname) {
                w2popup.open({
                        title     : 'Workflow '+workflowname+' saved',
                        body      : '<div class="w2ui-centered" style="color: black;"><b>Workflow saved.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        workflownotdeleted: function(workflowname,msg) {
                w2popup.open({
                        title     : 'Workflow '+workflowname+' NOT deleted',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>Workflow NOT deleted.  '+msg+'.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        workflownotsaved: function(workflowname,msg) {
                w2popup.open({
                        title     : 'Workflow '+workflowname+' NOT saved',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>Workflow NOT saved.  '+msg+'</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        noworkflowname: function() {
                w2popup.open({
                        title     : 'No Workflow Name',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>Please give the workflow a name.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        noproblemowner: function() {
                w2popup.open({
                        title     : 'No Problem Owner',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>The Problem Must have a Problem Owner</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        noproblemusergroup: function() {
                w2popup.open({
                        title     : 'No Problem User Group',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>The problem must have a usergroup.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },


        noproblemactivity30: function() {
                w2popup.open({
                        title     : 'No Problem Activity 30 min.',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>There has been no work on your problems for the last 30 minutes. Setting problems to "Stop Working."</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        routechanged: function() {
                w2popup.open({
                        title     : 'Router Changed.',
                        body      : '<div class="w2ui-centered" style="color: green;"><b>The Router has been updated.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        wftaskchanged: function() {
                w2popup.open({
                        title     : 'Task Changed',
                        body      : '<div class="w2ui-centered" style="color: green;"><b>The Task has been updated.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        routenotchanged: function() {
                w2popup.open({
                        title     : 'Router Not Changed.',
                        body      : '<div class="w2ui-centered" style="color: black;"><b>The Router was NOT updated.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        wftasknotchanged: function() {
                w2popup.open({
                        title     : 'Task Not Changed',
                        body      : '<div class="w2ui-centered" style="color: black;"><b>The Task was NOT updated.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        notinusergroup: function(msg) {
                w2popup.open({
                        title     : 'Not in User Group',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>'+msg+'</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        problemhasend: function() {
                w2popup.open({
                        title     : 'Working Finished Problem',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You cannot work the selected problems because they have been resolved.  Please Un-Resolve the problems first.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        refreshtasks: function() {
                w2popup.open({
                        title     : 'No Associated Task',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>There is no associated task for this menu item.  Your administrator probably deleted this task.  Please refresh your browser to update your menu.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        helpabout: function() {
                w2popup.open({
                        title     : 'About VirtuOps™ Pilot',
                        body      : '<div class="w2ui-centered" style="color: black;"><b>Linux Version 2.1.1, February 2017.</b><br>Copyright 2017 MKAdvantage, Inc. All rights reserved.</div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },


        noproblemselected: function(){
                w2popup.open({
                        title     : 'No Problem Selected',
                        body      : '<div class="w2ui-centered"><p style="color: red;"><b>You must choose a problem to work before starting on tasks.</b></p><br><p>Click on the button below to go to problem list.</p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2ui.sidebar.click(\'problemlist\');w2popup.close()">Go to Problems</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : false,
                        onOpen    : function (event) { },
                        onClose   : function (event) {w2ui.sidebar.click('problemlist')},
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        nothingdeleted: function(){
                w2popup.open({
                        title     : 'Nothing deleted',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Nothing was deleted.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        fileuploadsucceeded: function(){
                w2popup.open({
                        title     : 'Files Successfully Uploaded',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Files Uploaded Successfully!  Please navigate to Task Admin to modify your task and action code or go to Runbook Admin to add your new task to a runbook.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        fileuploadfailed: function(){
                w2popup.open({
                        title     : 'File Upload Failed',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>File Upload Failed.  If you are trying to upload a file/package you got from VirtuOps, please send the file to support@virtuops.com with any error messages you see.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        settingssaved: function(){
                w2popup.open({
                        title     : 'Settings Saved',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Saved Settings.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        runbooksaved: function(){
                w2popup.open({
                        title     : 'Runbook Saved',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Saved Runbook.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        runbookdeleted: function(){
                w2popup.open({
                        title     : 'Runbooks Deleted',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Deleted Runbook(s).</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        tasksaved: function(){
                w2popup.open({
                        title     : 'Task Saved',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Saved Task.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        taskdeleted: function(){
                w2popup.open({
                        title     : 'Tasks Deleted',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Deleted Task(s).</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        usersaved: function(){
                w2popup.open({
                        title     : 'User Saved',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Saved User.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        userdeleted: function(){
                w2popup.open({
                        title     : 'User Deleted',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Deleted User.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        groupsaved: function(){
                w2popup.open({
                        title     : 'Group Saved',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Saved Group.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        groupdeleted: function(){
                w2popup.open({
                        title     : 'Groups Deleted',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Successfully Deleted Group(s).</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        settingsnotsaved: function(){
                w2popup.open({
                        title     : 'Settings Not Saved',
                        body      : '<div class="w2ui-centered"><p style="color: red;"><b>Your settings were not saved.  Please check your settings and try to save again.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        deletedrecords: function(records){
                w2popup.open({
                        title     : 'Records Deleted Successfully',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Deleted '+records+' records</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        problemcreated: function(){
                w2popup.open({
                        title     : 'Problem Created',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Problem Created.</b></p><p>WARNING:  Hitting save again on this page will create a new problem.  If you do not want to duplicate this problem, choose a different template or update the fields in this form.</p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        problemsresolved: function(){
                w2popup.open({
                        title     : 'Problems Resolved',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Problems Resolved.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
               })
        },

        mustBeOwner: function(action) {
                w2popup.open({
                        title     : 'Cannot Perform Owner Action',
                        body      : '<div class="w2ui-centered"><p style="color: red;"><b>You must be the problem owner or an admin user to ' + action + '.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        releaseOwner: function() {
                w2popup.open({
                        title     : 'Cannot Release Ownership',
                        body      : '<div class="w2ui-centered"><p style="color: red;"><b>You cannot release another owner\'s ownership of this problem.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        ownerExists: function(){
                w2popup.open({
                        title     : 'Cannot Take Ownership',
                        body      : '<div class="w2ui-centered"><p style="color: red;"><b>You cannot take ownership of a problem which already has an owner.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },


        problemsunresolved: function(){
                w2popup.open({
                        title     : 'Problems Un-Resolved',
                        body      : '<div class="w2ui-centered"><p style="color: green;"><b>Problems Un-Resolved.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },


        toomanyproblems: function(){
                w2popup.open({
                        title     : 'Please Select One',
                        body      : '<div class="w2ui-centered"><p style="color: red;"><b>Please choose only one problem.</b></p></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        noproblemtemplate: function(){
                w2popup.open({
                        title     : 'No Problem Template',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You must choose a problem template.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        nomembersselected: function(){

                w2popup.open({
                        title     : 'No Members Selected',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You need to select at least one member for this group.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });


        },
        groupidnameerror: function(){
                        w2popup.open({
                        title     : 'Group ID Name Error',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You need a unique ID and a Name for this Group.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        rbftaskgrouperror: function(){
                w2popup.open({
                        title     : 'Runbook Group Task Error',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>Your runbook needs at least one task selected and one group selected.<br>Please go back and make sure you have at least one task and one group selected.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });

        },
        rbfnameiderror: function(){
                w2popup.open({
                        title     : 'Runbook Name ID Error',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You need to put in a unique RunbookID and Runbook Name.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        passwordblank: function() {
                w2popup.open({
                        title     : 'Password Blank',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>Password cannot be blank for new user.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        passwordmismatch: function() {
                w2popup.open({
                        title     : 'Password Mismatch',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>Your passwords do not match.  Please retype your password and confirmation.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        noconfigstartend: function() {
                w2popup.open({
                        title     : 'Cannot Change Start or End',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You cannot modify start or end.  Please choose a different task.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        notatask: function() {
                w2popup.open({
                        title     : 'Not A Task',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>The selected item is not a task.  Please choose a task.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        notaroute: function() {
                w2popup.open({
                        title     : 'Not A Router',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>The selected item is not a route.  Please choose a route.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        needworkflowname: function() {
                w2popup.open({
                        title     : 'Need Workflow Name',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>To configure a task or route, you need to specify a workflow name first.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

        nodeletestartend: function() {
                w2popup.open({
                        title     : 'Cannot Delete Start or End',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>You cannot delete start or end.  Please choose a task, route or link.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },
        notendtask: function() {
                w2popup.open({
                        title     : 'This is not the End Task',
                        body      : '<div class="w2ui-centered" style="color: red;"><b>Please highlight the end task to configure it.</b></div>',
                        buttons   : '<button class="w2ui-btn" onclick="w2popup.close();">Close</button>',
                        width     : 500,
                        height    : 300,
                        overflow  : 'hidden',
                        color     : '#333',
                        speed     : '0.3',
                        opacity   : '0.8',
                        modal     : true,
                        showClose : true,
                        showMax   : true,
                        onOpen    : function (event) { },
                        onClose   : function (event) { },
                        onMax     : function (event) { },
                        onMin     : function (event) { },
                        onKeydown : function (event) { }
                });
        },

    };
});

