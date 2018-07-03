define(function (require) {
    var DATA = require('../../client/admin/data');
    var UTILS = require('../../client/utils/misc');
    var RUNTASK = require('../tasks/runtask');
    var TELDATA = require('../tasks/teldata');
    var sessionid = UTILS.getsessionid('PHPSESSID');


    return {
        create: function(name, menuid, taskdata){
		var runbookname = menuid.split('_')[0];
		var gridname = name;
		gridname = gridname.replace(/ /g,'');
		var gridheader = taskdata.taskname;
		var gc = taskdata.outputfields.split(/\n/);
		var oa = taskdata.outputactions.split(/\n/);

		var gridcolumns = [];
		var gridrecords = [];
		var gcnames = [];
		var buttons = [];
		var buttoncases = {};
                //var queryargs = {};
		var queryhtml = '';
		var qhtmldivs = '';
                var gridparams = {};
                var querystring = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : 'empty';

                if (taskdata.urlparams.length > 0) {

		//populate param pulldown

                var parray = taskdata.urlparams.split(',');
                var searchparams = querystring.split('&') ? querystring.split('&') : [];
		var sp = {};
		searchparams.forEach(function(p){
			var keyval = p.split('=');
			sp[keyval[0]] = keyval[1];
		});
			
		
			parray.forEach(function(param){
				 
				 if (sp.hasOwnProperty(param)) {
				 var searchprm = sp[param];	 
				 gridparams[param] = searchprm;
				 qhtmldivs += '<div><label>'+param+'</label><div style="display: inline-block; padding: 6px;"><input name = "gridparams" id="'+param+'" type = "text" maxlength="100" size = "60" value = "'+searchprm+'" /></div></div>';	
				} else {
				 gridparams[param] = 'null';
				 qhtmldivs += '<div><label>'+param+'</label><div style="display: inline-block; padding: 6px;"><input name = "gridparams" id="'+param+'" type = "text" maxlength="100" size = "60" /></div></div>';	

				}

			});

                }

		var queryhtml = '<div style="padding: 10px; line-height: 1.5">'+qhtmldivs+'</div>';


                var runtask = {
                                id:'runtask',
                                type: 'button',
                                caption: 'Run Task',
                                img: 'fa fa-refresh'
                                };

                buttons.push(runtask);

		var queryparmbutton = { type: 'drop',  
					id: 'params', 
					text: 'Params', 
					img: 'fa fa-folder-open',
                			html: queryhtml 
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
		
		var buttonfuncs = function(event){
			if (event.target === 'clear') {
				w2ui[gridname].clear(); 
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

				RUNTASK.getresults(filetorun, gridparams, taskdata, function(data){
					
					var records
					if (taskdata.datatype === 'JSON') {
						jprop = taskdata.jprop;
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
				
			} else if (event.target === 'params') {
				var gpels = document.getElementsByName('gridparams');
				var qhtmldivs = '';
				if (gpels.length > 0) {
				gpels.forEach(function(element){
					gridparams[element.id] = element.value;		
				 	qhtmldivs += '<div><label>'+element.id+'</label><div style="display: inline-block; padding: 6px;"><input name = "gridparams" id="'+element.id+'" type = "text" maxlength="100" size = "60" value = "'+element.value+'" /></div></div>';	
				});
				var queryhtml = '<div style="padding: 10px; line-height: 1.5">'+qhtmldivs+'</div>';
				w2ui[gridname].toolbar.items[5].html = queryhtml;
				}
				
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
