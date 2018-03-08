define(function (require) {
    var DATA = require('../../client/admin/data');
    var UTILS = require('../../client/utils/misc');
    var TASKFORM = require('../tasks/form');
    var TASKGRID = require('../tasks/grid');
    var MESSAGES  = require('../messages/messages');
    var TASKEVENTLIST = require('../tasks/tel');
    var TASKBODY = require('../tasks/body');
    var TELDATA = require('../tasks/teldata');

    var sessionid = UTILS.getsessionid('PHPSESSID');
    var username = '';
    UTILS.getusername(sessionid, function(data) {
        username = data.records[0].username;

    });

    return {
        buildtask: function(menuid, taskname, runbookid){
                var params = {
                                cmd: 'get',
                                table: 'tasks',
                                params:  {
                                }
                };

                DATA.cruddata(params, function(results){
                        results.records.forEach(function(taskdata){
                                taskdata.runbookid = runbookid;
                                ttype = taskdata.tasktype;
                                if (taskdata.taskname === taskname) {
                                        var newtel = TASKEVENTLIST.create(menuid,taskdata);
                                        //$().w2grid(newtel);

                                        if (taskdata.tasktype === 'Form') {
                                                var newform = TASKFORM.create(menuid,taskdata);
                                                $().w2form(newform);
                                        } else if (taskdata.tasktype === 'Grid') {
                                                var newgrid = TASKGRID.create(menuid,taskdata);
                                                $().w2grid(newgrid);
                                        } else if (taskdata.tasktype === 'IFrame') {
                                                //TASKIFRAME.create(menuid,taskdata);
                                        } else if (taskdata.tasktype === 'HTML') {
                                                //TASKHTML.create(menuid,taskdata);
                                        } else if (taskdata.tasktype === 'Instructions') {
                                                //TASKHTML.create(menuid,taskdata);
                                        }

                                }
                        });
                });
        },
        setclick: function() {
            w2ui.sidebar.on('click', function (event) {
                var isTask = event.target.search("_");
                if (isTask > 0) {
                  if (typeof w2ui[event.target] === 'object') {
                        var tel = event.target+'_tel';
                        w2ui.layoutmain.content('main',w2ui.layout2080);
                        w2ui.layout2080.content('top',w2ui[tel]);
                        w2ui.layout2080.content('main',w2ui[event.target]);

                          // Load the page but prompt a warning about selecting a problem.
                        //if (isTask > 0 && problems.length === 0)
                         // MESSAGES.noproblemselected();
                  } else {
                  //Note...only runbooks and runbook tasks can have underscores.

                  var runbookid = event.target.split('_')[0];
                  TASKBODY.getbody(event.node.text, function(body){
                        var taskdata = body.records[0];
                        var ttype;
                        if (typeof taskdata !== "undefined"){
                        ttype = taskdata.tasktype
                        } else {
                        ttype = '';
                                if (isTask > 0) {
                                MESSAGES.refreshtasks();
                                }
                        }
                        if (ttype === 'IFrame') {
                        var tel = event.target+'_tel';
                        w2ui.layoutmain.content('main',w2ui.layout2080);
                        w2ui.layout2080.content('top',w2ui[tel]);
                        w2ui.layout2080.content('main',body.records[0].iframepath);
                        }
                        if (ttype === 'Instructions') {
                        var tel = event.target+'_tel';
                        w2ui.layoutmain.content('main',w2ui.layout2080);
                        w2ui.layout2080.content('top',w2ui[tel]);

                        var instructions = '<div style="margin: 40px;"><textarea class="instructions" rows="40" cols="120" readonly>'+body.records[0].instructions+'</textarea></div>';
                        w2ui.layout2080.content('main',instructions);
                        }
                        if (ttype === 'HTML') {
                        var tel = event.target+'_tel';
                        w2ui.layoutmain.content('main',w2ui.layout2080);
                        w2ui.layout2080.content('top',w2ui[tel]);
                        w2ui.layout2080.content('main',body.records[0].htmlcode);
                       }
                  })
            }
            }
          })
        }
    };
})

