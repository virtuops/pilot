define(function (require) {
    require('../../client/admin/data');
    var UTILS = require('../../client/utils/misc');
    var RUNTASK = require('../tasks/runtask');
    var TELDATA = require('../tasks/teldata');

    var sessionid = UTILS.getsessionid('PHPSESSID');

    return {
        create: function(name, menuid, taskdata){
		var runbookname = menuid.split('_')[0];
		var formname = name;
		formname = formname.replace(/ /g,'');
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

                if (taskdata.userparams.length > 0) {

                }


                var runtask = {
                                id:'runtask',
                                type: 'button',
                                caption: 'Run Task',
                                img: 'fa fa-refresh'
                                };

		buttons.push(runtask);
		
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
				buttoncases[b[0]].taskname = b[2];
				buttoncases[b[0]].action = function(args){
				}
				
			}

		});
		
		var buttonfuncs = function(event){
			if (event.target === 'clear') {
				w2ui[formname].clear(); 
			} else if (event.target === 'runtask') {
                                filetorun = taskdata.actionfilename;
                		var problems = UTILS.getunique(NH.problems);
                                var t0 = performance.now();
                                var longdate = new Date();
                                //var date = longdate.valueOf()/1000;
                                var date = new Date(longdate).toISOString().slice(0, 19).replace('T', ' ');
                                var taskserial = UTILS.gettaskserial();
                                taskdata['taskserial'] = taskserial;
                                UTILS.getusername(sessionid, function(data) {
                                        username = data.records[0].username;
                                        UTILS.ajaxPost('get','user_working_problems',{"username":username},function(data){
                                                problems = data.records;

                                                var beforeparams = {
                                                                taskstate: 'before',
                                                                taskname: taskdata.taskname,
                                                                runbookname: taskdata.runbookid,
                                                                username: username,
                                                                actionfilename: taskdata.actionfilename,
                                                                taskstarttime: date,
                                                                taskserial: taskserial,
                                                                tasktime: -1,
                                                                taskstatus: 'RUNNING',
                                                                problems: problems
                                               }


                                               TELDATA.recordtaskrun(beforeparams, function(data){
                                               });

                                                beforerecid = w2ui[menuid+'_tel'].records.length;
                                                beforerecid = beforerecid + 1;
                                                beforeparams['recid'] = beforerecid;
                                                w2ui[menuid+'_tel'].add(beforeparams, true);
                                                w2ui[menuid+'_tel'].refresh();

                                        });
                                });


				
				RUNTASK.getresults(filetorun, w2ui[formname].record, taskdata, function(data){

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
						values = data.split(fs) ? data.split(fs) : [{}];
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
                                        var t1 = performance.now();
                                        var tasktime = t1 - t0;
                                        tasktime = tasktime / 1000;
                                        var afterparams = {
                                                taskstate: 'after',
                                                results: results,
                                                params: params,
                                                taskserial: taskserial,
                                                tasktime: tasktime,
                                                taskstatus: 'FINISHED',
                                        }
                                        TELDATA.recordtaskrun(afterparams, function(data){
                                                w2ui[menuid+'_tel'].refresh();
                                        });

					
				});
				
			}else {
				//buttoncases[event.target].action(buttoncases[event.target]);
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
						
                                if (fieldobj.paramfield.trim() == "false") {
                                        //fieldobj.html.attr += " readonly";
                                        if (fieldobj.type === "text") {
                                        formHTMLdivs += '<div class="w2ui-field"><label>'+fieldobj.html.caption+'</label><div><input name="'+fieldobj.field+'" type="text" '+fieldobj.html.attr+' readonly /></div></div>';
                                        } else {

                                        formHTMLdivs += '<div class="w2ui-field"><label>'+fieldobj.html.caption+'</label><div><'+fieldobj.type+' name="'+fieldobj.field+'" type="text" '+fieldobj.html.attr+' readonly></'+fieldobj.type+'></div></div>';
                                        }
                                } else {
                                        if (fieldobj.type === "text") {
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
