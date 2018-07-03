define(function (require) {
    var DATA = require('../../client/admin/data');
    var UTILS = require('../../client/utils/misc');
    var RUNTASK = require('../tasks/runtask');
    var TELDATA = require('../tasks/teldata');
    var BUTTON = require('../tasks/buttonpop');
    var FORMBUTTON = require('../tasks/formbutton');
    var PARAMBUTTON = require('../tasks/parambutton');
    var GRIDBUTTON = require('../tasks/gridbutton');

    var sessionid = UTILS.getsessionid('PHPSESSID');
    return {
        create: function(menuid, taskdata){
                var gridname = menuid;
                var gridheader = taskdata.taskname;
                var gc = taskdata.outputfields.split(/\n/);
                var oa = taskdata.outputactions.split(/\n/);

                var gridcolumns = [];
                var gridrecords = [];
                var gcnames = [];
                var buttons = [];
                var buttoncases = {};
                var gridparams = {};
                var parsedparams = {};
                var querystring = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : '';
                var searchparams = querystring.split('&') ? querystring.split('&') : [];
                var username = '';

                var QSJ = function() {
                        var pairs = location.search.slice(1).split('&');

                        var result = {};
                        pairs.forEach(function(pair) {
                                pair = pair.split('=');
                                result[pair[0]] = decodeURIComponent(pair[1] || '');
                        });

                        return JSON.parse(JSON.stringify(result));
                };

                UTILS.getusername(sessionid, function(data) {
                        username = data.records[0].username;
                });

                searchparams.forEach(function(p){
                        var keyval = p.split('=');
                        parsedparams[keyval[0]] = keyval[1];

                });

                taskdata['taskmetadata'] = QSJ();

                var runtask = {
                                id:'runtask',
                                type: 'button',
                                caption: 'Run Task',
                                icon: 'fa fa-refresh'
                                };

                buttons.push(runtask);

                var queryparmbutton = { type: 'button',
                                        id: 'params',
                                        text: 'Params',
                                        img: 'fa fa-folder-open'
                };
                buttons.push(queryparmbutton);


                oa.forEach(function(element){
                        if (element.startsWith('#') || element.length < 1) {
                        } else {

                                var buttonobj = {
                                id:'',
                                type: 'button',
                                caption: '',
                                img: 'fa fa-folder-open'
                                };

                                b = element.split(',');
                                buttonobj.id = b[0];
                                buttonobj.caption = b[1];
                                buttons.push(buttonobj);
                                buttoncases[b[0]] = {};
                                buttoncases[b[0]].taskname = b[2].trim();
                                buttoncases[b[0]].action = function(argobj){
                                        //var name = argobj.taskname+'_popup';
                                        var popup;
                                        if (argobj.tasktype === 'Form'){
                                        popup = FORMBUTTON.create(argobj.taskname, menuid, argobj);
                                        BUTTON.launch('Form',popup);
                                        } else if (argobj.tasktype === 'Grid') {
                                        popup = GRIDBUTTON.create(argobj.taskname, menuid, argobj);
                                        BUTTON.launch('Grid',popup);
                                        }
                                }

                        }
                });

                gc.forEach(function(element){
                        if (element.startsWith('#') || element.length < 1) {
                        } else {
                                var columnobj = {
                                field:'',
                                caption: '',
                                size:'',
                                hidden: true,
                                sortable: true,
                                resizable: true
                                };

                                cp = element.split(',');
                                columnobj.field = cp[0];
                                columnobj.caption = cp[1];
                                columnobj.size = cp[2];
                                if (cp[3] === "true") {
                                columnobj.hidden = true;
                                } else {
                                columnobj.hidden = false;
                                }
                                gcnames.push(cp[0]);
                                gridcolumns.push(columnobj);
                        }
                });

                var getgridparams = function(){
                        gridparams = '';
                        if (NH.taskparams[gridname]) {
                              gridparams = NH.taskparams[gridname];
                        } else {
                              gridparams = parsedparams;
                        }
                        return gridparams;
                }

                var buttonfuncs = function(event){
                        if (event.target === 'clear') {
                                w2ui[gridname].clear();
                        } else if (event.target === 'runtask') {
                                filetorun = taskdata.actionfilename;
                                taskdata['username'] = username;

                                RUNTASK.getresults(filetorun, getgridparams(), taskdata, function(data){

                                        data = data.split("\n")[1];
                                        var records
                                        if (taskdata.datatype === 'JSON') {
                                                jprop = taskdata.jprop ? taskdata.jprop : '';
                                                returnrecords = JSON.parse(data);
                                                records = UTILS.getgridrecords(jprop, gcnames, returnrecords);
                                                w2ui[gridname].records = records;
                                        } else if (taskdata.datatype === 'Text') {
                                                var fs = new RegExp(taskdata.fieldseparator);
                                                var rs = new RegExp(taskdata.recordseparator);
                                                records = UTILS.getgridtextrecords(fs, rs, gcnames, data);
                                                w2ui[gridname].records = records;
                                        }
                                        w2ui[gridname].refresh();

                                });

                        } else if (event.target === 'params') {
                                //TODO:  NEED TO POP UP A FORM THAT SHOWS PARAMS COMING IN
                                // FROM URL.  WHATEVER WE GET FROM URL, THAT WILL BE
                                // INITIAL VALUE OF NH.TASKPARAMS (OR SOMETHING)
                                // THEN, USER NEEDS TO BE ABLE TO CHANGE
                                // THE PARAMS AND HAVE THAT SAVED IN NH.TASKPARAMS (OR SOMETHING)
                                //  THEN, WHEN TASK EXECUTES, WE NEED TO GET NH.TASKPARAMS

                                PARAMBUTTON.create(gridname,taskdata.urlparams);

                        } else {
                                var taskname = buttoncases[event.target].taskname;
                                postData = {
                                                cmd: 'get',
                                                table: 'tasks',
                                                params: {
                                                        taskname: taskname
                                                        }
                                        };
                                DATA.cruddata(postData,function(data){
                                buttoncases[event.target].action(data.records[0]);
                                })
                        }
                }

                var grid = {
                        name   : gridname,
                        selectType: 'cell',
                        header : gridheader,
                        show : {
                                header: true,
                                toolbar: true,
                                footer: true
                        },
                        toolbar: {
                            items: buttons,
                            onClick: buttonfuncs
                        },
                        columns: gridcolumns,
                        records: gridrecords

                };

                return grid;
        }
    };
});

