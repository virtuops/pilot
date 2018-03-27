define(function (require) {
        var TASKS = require('../../client/tasks/tasksubmenu');
    return {
        buildsidebar: function(userobj){
                var sidebarobj = w2ui.sidebar;
                var allmenu = { id: 'gettingstarted', text: 'Getting Started', img: 'infoicon', group: true};
                var allmenunodes =  [ { id: 'intro', text: 'Introduction' }
                                ];
                var adminmenu =  { id: 'admin', text: 'Admin', img: 'icon-folder', group: true };
                var adminmenunodes = [
                                       { id: 'adminwizard', text: 'Admin Wizard', img:'wizardicon' },
                                       { id: 'taskadmin', text: 'Task Admin', img: 'taskadminicon' },
                                       { id: 'users', text: 'User Admin', img: 'usericon' },
                                       { id: 'groups', text: 'Group Admin', img: 'usergroupicon' },
                                       { id: 'runbookadmin', text: 'Runbook Admin', img: 'booksicon' },
                                       { id: 'workflowadmin', text: 'Workflow Admin', img: 'workflowicon' },
                                     ];
                var reportmenu = { id: 'reports', text: 'Intel Center', group: true };
                var reportmenunodes =  [
                                {id: 'taskreports', text: 'Tasks', img: 'viewsicon'},
                                {id: 'workflowreports', text: 'Workflows', img: 'viewsicon'}
                ];

                var runbooks = { id: 'runbooks', text: 'Runbooks', group: true };
                var runbooknodes = [];

                var adminusersettingsmenu = { id: 'usersettings', text: 'Settings', group: true, nodes: [
                                        { id: 'settings', text: 'Server Settings', img: 'settingsicon' },
                                        { id: 'helpabout', text: 'About', img: 'infoicon' },
                                        { id: 'logout', text: 'Logout', img: 'logouticon' }
                                        ], group: true, expanded: false };


                var usersettingsmenu = { id: 'usersettings', text: 'Settings', group: true, nodes: [
                                        { id: 'helpabout', text: 'About', img: 'infoicon' },
                                        { id: 'logout', text: 'Logout', img: 'logouticon' }
                                        ], group: true, expanded: false };

                userobj.runbooks.forEach(function(element){
                        idname = element.split('|');
                        if (idname[1] !== 'null' && idname[1] !== 'NULL' && idname[1] !== null){
                        runbooknodes.push({id: idname[0], text: idname[1] });
                        }
                });

                //Add intro and getting started stuff
                sidebarobj.add(allmenu);
                sidebarobj.add('gettingstarted', allmenunodes);

                if (userobj.username === 'admin') {

                        if (runbooknodes.length > 0) {
                        sidebarobj.add(runbooks);
                        sidebarobj.add('runbooks',runbooknodes);
                        sidebarobj.refresh();
                        TASKS.addsubmenutasks(runbooknodes);
                        }

                        sidebarobj.add(adminmenu);
                        sidebarobj.add('admin',adminmenunodes);
                        sidebarobj.add(reportmenu);
                        sidebarobj.add('reports',reportmenunodes);
                        sidebarobj.add(adminusersettingsmenu);
                        sidebarobj.refresh();
                } else {


                        if (runbooknodes.length > 0) {
                        sidebarobj.add(runbooks);
                        sidebarobj.add('runbooks',runbooknodes);
                        sidebarobj.refresh();
                        TASKS.addsubmenutasks(runbooknodes);
                        }

                        sidebarobj.add(usersettingsmenu);
                        sidebarobj.refresh();
                }
        }
    };
});

