define(function (require) {
        var TASKS = require('../../client/tasks/tasksubmenu');
    return {
        buildsidebar: function(userobj){
                var sidebarobj = w2ui.sidebar;
                var allmenu = { id: 'gettingstarted', text: 'Getting Started', group: true};
                var allmenunodes =  [ { id: 'intro', text: 'Introduction', img: 'infoicon' }
                                ];
                var adminmenu =  { id: 'admin', text: 'Admin', img: 'icon-folder', group: true };
                var adminmenunodes = [
                                       { id: 'adminwizard', text: 'Admin Wizard', img:'wizardicon' },
                                       { id: 'taskadmin', text: 'Task Admin', img: 'taskadminicon' },
                                       { id: 'users', text: 'User Admin', img: 'usericon' },
                                       { id: 'groups', text: 'Group Admin', img: 'usergroupicon' },
                                       { id: 'runbookadmin', text: 'Runbook Admin', img: 'booksicon' },
                                       { id: 'connectadmin', text: 'Connect Admin', img: 'connectionicon' },
                                       { id: 'workflowadmin', text: 'Workflow Admin', img: 'workflowicon' },
                                     ];
                var reportmenu = { id: 'reports', text: 'Intel Center', group: true };
                var reportmenunodes =  [
                                {id: 'taskreports', text: 'Tasks', img: 'viewsicon'},
                                {id: 'workflowreports', text: 'Workflows', img: 'viewsicon'}
                ];

                var adminusersettingsmenu = { id: 'usersettings', text: 'Settings', group: true, nodes: [
                                        { id: 'settings', text: 'Server Settings', img: 'settingsicon' },
                                        { id: 'helpabout', text: 'About', img: 'infoicon' },
                                        { id: 'logout', text: 'Logout', img: 'logouticon' }
                                        ], group: true, expanded: false };


                var usersettingsmenu = { id: 'usersettings', text: 'Settings', group: true, nodes: [
                                        { id: 'helpabout', text: 'About', img: 'infoicon' },
                                        { id: 'logout', text: 'Logout', img: 'logouticon' }
                                        ], group: true, expanded: false };


                //Add intro and getting started stuff
                sidebarobj.add(allmenu);
                sidebarobj.add('gettingstarted', allmenunodes);

                if (userobj.username === 'admin') {

                        sidebarobj.add(adminmenu);
                        sidebarobj.add('admin',adminmenunodes);
                        sidebarobj.add(reportmenu);
                        sidebarobj.add('reports',reportmenunodes);
                        sidebarobj.add(adminusersettingsmenu);
                        sidebarobj.refresh();
                } else {

                        sidebarobj.add(usersettingsmenu);
                        sidebarobj.refresh();
                }
        }
    };
});

