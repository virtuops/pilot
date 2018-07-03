define(function (require) {
    var LOGIN = require('../../client/admin/login');
    var MESSAGES = require('../../client/messages/messages');
    require('../../client/mainview/layout');
    var BUILDMENU = require('../sidemenu/buildmenu');
    var UTILS = require('../../client/utils/misc');

    return {
        sidebar: {
                name       : 'sidebar',
                topHTML    : '<div id="nocherologo"><img id="nocheroicon" src="html/images/1.1.png"></img><div id="nocherotext">VirtuOps<sup><span style="font-size: 10px;">&reg;</span></sup> Pilot</div></div>',
                onRender: function(event) {
                        sessionid = LOGIN.getsessionid('PHPSESSID');

                        LOGIN.getuserdata(sessionid, function(results){
                                var userobj = {
                                        username: '',
                                        runbooks: []
                                }
                                results.records.forEach(function(element){
                                        userobj.username = element.username;
                                        var idname = element.runbookid+'|'+element.runbookname;
                                        userobj.runbooks.push(idname);
                                });
                                var uniquerunbooks = UTILS.getunique(userobj.runbooks);
                                userobj.runbooks = uniquerunbooks;
                                BUILDMENU.buildsidebar(userobj);
                        });

                },
                onClick: function (event) {
                    //var sidebar = this;
                    switch (event.target) {
                        case 'taskadmin':
                            w2ui.layoutmain.content('main',w2ui.layout7030);
                            w2ui.layout7030.content('right',w2ui.tasktopgrid);
                            w2ui.layout7030.content('main',w2ui.taskbottomform);
                            setTimeout(function(){w2ui.taskbottomform.refresh();}, 400);
                            break;
                        case 'workflowadmin':
                            w2ui.layoutmain.content('main',w2ui.layoutsingle);
                            w2ui.layoutsingle.content('main',w2ui.workflowadmin);
                            break;
                        case 'helpabout':
                            MESSAGES.helpabout();
                            break;
                        case 'runbookadmin':
                            w2ui.layoutmain.content('main',w2ui.layout2080);
                            w2ui.layout2080.content('top',w2ui.runbooktopgrid);
                            w2ui.layout2080.content('main',w2ui.runbookbottomform);
                                setTimeout(function(){
                                w2ui.rbfavailabletasks.render($('#rbfavailabletasks')[0]);
                                w2ui.rbfselectedtasks.render($('#rbfselectedtasks')[0])
                                w2ui.rbfavailablegroups.render($('#rbfavailablegroups')[0]);
                                w2ui.rbfselectedgroups.render($('#rbfselectedgroups')[0])
                                w2ui.runbookbottomform.refresh();
                                },1500);
                                w2ui.runbookbottomform.tabs.on('click',function(event) {
                                        if (event.target === 'tab2') {
                                        w2ui.rbfavailabletasks.refresh();
                                        w2ui.rbfselectedtasks.refresh();

                                        } else if (event.target === 'tab3') {
                                        w2ui.rbfavailablegroups.refresh();
                                        w2ui.rbfselectedgroups.refresh();
                                        }
                                });
                            break;
                        case 'intro':
                            w2ui.layoutmain.content('main',w2ui.layoutsingle);
                            w2ui.layoutsingle.load('main','html/docs/intro.php');
                            break;
                        case 'documentation':
                            w2ui.layoutmain.content('main',w2ui.layoutsingle);
                            w2ui.layoutsingle.load('main','html/docs/docmain.html');
                            break;
                        case 'users':
                            w2ui.layoutmain.content('main',w2ui.layout2080);
                            w2ui.layout2080.content('top',w2ui.usertopgrid);
                            w2ui.layout2080.content('main',w2ui.userbottomform);
                            break;
                        case 'groups':
                            w2ui.layoutmain.content('main',w2ui.layout2080);
                            w2ui.layout2080.content('top',w2ui.grouptopgrid);
                            setTimeout(function() { w2ui.grouptopgrid.refresh() }, 50)
                            w2ui.layout2080.content('main',w2ui.groupbottomform);
                            setTimeout(function(){
                                //wait for groupbottomform to come up.
                                w2ui.gbfavailablemembers.render($('#gbfavailablemembers')[0]);
                                w2ui.gbfavailablemembers.refresh();
                                w2ui.gbfselectedmembers.render($('#gbfselectedmembers')[0])
                                w2ui.gbfselectedmembers.refresh();}, 1500
                                );
                            break;
                        case 'settings':
                            w2ui.layoutmain.content('main',w2ui.layoutsingle);
                            w2ui.layoutsingle.content('main',w2ui.settingsbottomform);
                            break;
                        case 'adminwizard':
                            w2ui.layoutmain.content('main',w2ui.layoutsingle);
                            w2ui.layoutsingle.content('main',w2ui.adminwizard);
                            break;
                        case 'taskreports':
                            w2ui.layoutmain.content('main',w2ui.layoutsingle);
                            w2ui.layoutsingle.content('main',w2ui.taskreportingform);
                            break;
                        case 'workflowreports':
                            w2ui.layoutmain.content('main',w2ui.layoutsingle);
                            w2ui.layoutsingle.content('main',w2ui.workflowreportingform);
                            break;
                        case 'logout':
                            window.location = 'logout.php'
                            break
                        case 'intro':
                            break;
                        case 'documentation':
                            break;
                        case 'tutorial':
                            break;
                        case 'tasklogs':
                            break;
                        case 'workflowlogs':
                            break;
                        case 'changelogs':
                            break;
                        }
                },

        },
        init: function(){
                w2ui.layoutmain.content('left', $().w2sidebar(this.sidebar));
        }
    };
});

