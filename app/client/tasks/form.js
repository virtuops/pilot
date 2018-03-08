define(function (require) {
    var DATA = require('../../client/admin/data');
    var UTILS = require('../../client/utils/misc');
    var RUNTASK = require('../tasks/runtask');
    var TELDATA = require('../tasks/teldata');
    var BUTTON = require('../tasks/buttonpop');
    var FORMBUTTON = require('../tasks/formbutton');
    var GRIDBUTTON = require('../tasks/gridbutton');

    var sessionid = UTILS.getsessionid('PHPSESSID');
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


    return {
        create: function(menuid, taskdata){
                var formname = menuid;
                var formheader = taskdata.taskname;
                var ff = taskdata.outputfields.split(/\n/);
                var oa = taskdata.outputactions.split(/\n/);

                var formfields = [];
                var formHTML = '';
                var formHTMLdivs = '';
                var buttons = [];
                var buttoncases = {};
                var queryargs = {};
                //var actionargs = {};
                var querystring = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : 'empty';

                taskdata['taskmetadata'] = QSJ();

                if (taskdata.urlparams.length > 0 && querystring !== 'empty') {

                var parray = taskdata.urlparams.split(',');
                var searchparams = querystring.split('&');
                        searchparams.forEach(function(param){
                        var keyval = param.split('=');
                        if (parray.indexOf(keyval[0]) > -1) {
                                queryargs[keyval[0]] = keyval[1];
                        }
                        });
                }

                var runtask = {
                                id:'runtask',
                                type: 'button',
                                caption: 'Run Task',
                                icon: 'fa fa-refresh'
                        };

                buttons.push(runtask);

                oa.forEach(function(element){
                        if (element.startsWith('#') || element.length < 1) {
                        } else {

                                var buttonobj = {
                                id:'',
                                type: 'button',
                                caption: '',
                                icon: 'fa fa-folder-open'
                                };

                                b = element.split(',');
                                buttonobj.id = b[0].trim();
                                buttonobj.caption = b[1].trim();
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

                var buttonfuncs = function(event){
                        if (event.target === 'clear') {
                                w2ui[formname].clear();
                        } else if (event.target === 'runtask') {
                                filetorun = taskdata.actionfilename;
                                taskdata['username'] = username;

                                //Need to convert any list items to property->text and not property->object
                                var formrecord = w2ui[formname].record; //the original record
                                var runrecord = {};  //the new record, without objects as property values

                                for (var property in formrecord) {
                                        if (typeof formrecord[property] === 'object') {
                                                runrecord[property] = formrecord[property].text;
                                        } else {
                                                runrecord[property] = formrecord[property];
                                        }
                                }

                                //RUNTASK.getresults(filetorun, w2ui[formname].record, taskdata, function(data){
                                RUNTASK.getresults(filetorun, runrecord, taskdata, function(data){
                                        data = data.split("\n")[1];
                                        results = {};
                                        params = {};
                                        if (taskdata.datatype === 'JSON') {
                                                returnrecord = JSON.parse(data);
                                                w2ui[formname].fields.forEach(function(element){
                                                        var propval = UTILS.getpropvalue(element.field, returnrecord);
                                                        w2ui[formname].record[element.field] = propval;
                                                        paramfield = element.paramfield.trim();
                                                        if (paramfield == "true") {
                                                        params[element.html.caption.trim()] = propval;
                                                        } else {
                                                        results[element.html.caption.trim()] = propval;
                                                        }
                                                });
                                        } else if (taskdata.datatype === 'Text') {
                                                var fs = new RegExp(taskdata.fieldseparator);
                                                values = data.split(fs);
                                                count = 0;
                                                w2ui[formname].fields.forEach(function(element){
                                                        currentfield = w2ui[formname].fields[count].field;
                                                        w2ui[formname].record[currentfield] = values[count];
                                                        paramfield = element.paramfield.trim();
                                                        if (paramfield == "true") {
                                                        params[currentfield] = values[count];
                                                        } else {
                                                        results[currentfield] = values[count];
                                                        }
                                                        count=count+1;
                                                });
                                        }
                                        w2ui[formname].refresh();

                                });

                        }else {
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

                //Add the clear button
                var clearbutton = {
                                id:'clear',
                                type: 'button',
                                caption: 'Clear',
                                img: 'fa fa-folder-open'
                                };
                var spacer = {
                                id: 'btspacer',
                                type: 'spacer'
                        };

                buttons.push(spacer);
                buttons.push(clearbutton);

                ff.forEach(function(element){
                        if (element.startsWith('#') || element.length < 1) {
                        } else {
                                var fieldobj = {
                                field:'',
                                type: '',
                                require: true,
                                options: {items:[]},
                                html: {
                                        caption: '',
                                        attr: ''
                                      }
                                };

                                fp = element.split(',');
                                fieldobj.field = fp[0].trim();
                                fieldobj.type = fp[1].trim();
                                fieldobj.paramfield = fp[2].trim();
                                fieldobj.required = fp[3].trim();
                                fieldobj.html.caption = fp[4].trim();
                                fieldobj.html.attr = fp[5].trim();
                                if (fp[6]) {
                                fieldobj.options.items = fp[6].split(';');
                                }

                                if (fieldobj.paramfield.trim() == "false") {
                                        //fieldobj.html.attr += " readonly";
                                        if (fieldobj.type === "text") {
                                        formHTMLdivs += '<div class="w2ui-field"><label>'+fieldobj.html.caption+'</label><div><input name="'+fieldobj.field+'" type="text" '+fieldobj.html.attr+' readonly /></div></div>';

                                        } else {

                                        formHTMLdivs += '<div class="w2ui-field"><label>'+fieldobj.html.caption+'</label><div><'+fieldobj.type+' name="'+fieldobj.field+'" type="text" '+fieldobj.html.attr+' readonly></'+fieldobj.type+'></div></div>';
                                        }
                                } else {
                                        if (fieldobj.type === "text" || fieldobj.type === "list") {
                                        formHTMLdivs += '<div class="w2ui-field"><label>'+fieldobj.html.caption+'</label><div><input name="'+fieldobj.field+'" type="text" '+fieldobj.html.attr+'/></div></div>';
                                        } else {

                                        formHTMLdivs += '<div class="w2ui-field"><label>'+fieldobj.html.caption+'</label><div><'+fieldobj.type+' name="'+fieldobj.field+'" type="text" '+fieldobj.html.attr+'></'+fieldobj.type+'></div></div>';

                                        }

                                }
                                formfields.push(fieldobj);
                        }
                });

                formHTML = '<div>'+formHTMLdivs+'</div>';

                var form = {
                        name   : formname,
                        header : formheader,
                        fields:  formfields,
                        toolbar: {
                            items: buttons,
                            onClick: buttonfuncs
                        },
                        formHTML: formHTML
                };

                form.record = queryargs;

                return form;
        }
    };
});

