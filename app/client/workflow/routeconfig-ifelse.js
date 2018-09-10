define(function (require) {

        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');

    return {
        launch: function(selId, workflowname){
        operatorData = $('#workflow_1').flowchart('getOperatorData', selId);
        var curTitle = operatorData.properties.title;


        var routerecords = [];
        var inputs = operatorData.properties.inputs;
        var outputs = operatorData.properties.outputs;
        var id = 1;

        for (var inprop in inputs) {

                rr = {recid: id, label: inputs[inprop].label, conntype: inputs[inprop].conntype}
                routerecords.push(rr);
                id = id + 1;
        }

        for (var outprop in outputs) {
                rr = {
                        recid: id,
                        label: outputs[outprop].label,
                        conntype: outputs[outprop].conntype,
                        parameter: outputs[outprop].parameter,
                        comparison: outputs[outprop].comparison,
                        value: outputs[outprop].value
                        }
                routerecords.push(rr);
                id = id + 1;
        }

        var config = {
    layout: {
        name: 'poplayout',
        padding: 4,
        panels: [
            { type: 'left', size: '55%', resizable: true, minSize: 300 },
            { type: 'main', minSize: 300 }
        ]
    },
    grid: {
        name: 'routeconfiggrid',
        show: {
            toolbar            : true,
            toolbarDelete    : false,
	    toolbarSearch    : false,
            toolbarColumns   : false,
	    toolbarReload    : false
        },
        toolbar: {
                items: [
		{  type: 'button',  id: 'addoutput',  caption: 'New', img: 'addicon' },
		{  type: 'button',  id: 'removeoutput',  caption: 'Delete', img: 'removeicon' },
                { type: 'html',  id: 'routename', html: function (item) {
                    var html =
                      '<div style="padding: 3px 10px;">'+
                      ' Router Name: '+
                      '    <input size="10" onchange="var el = w2ui.routeconfiggrid.toolbar.set(\'routename\', { value: this.value });" '+
                      '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="'+ (item.value || operatorData.properties.title ) + '"/>'+
                      '</div>';
                    return html;
                }
            }

                ],
		onClick: function(event) {
			if (event.target === 'addoutput') {
				recid = UTILS.getnextrecid(w2ui['routeconfiggrid'].records);
				newrec = { "recid":recid,
					   "label":"NewLabel",
					   "conntype":"output",
					   "parameter":"param",
					   "comparison":"=",
					   "value":"value"
					}

				w2ui['routeconfiggrid'].add(newrec);
				w2ui['routeconfigform'].record = newrec;

			} else if (event.target === 'removeoutput') {
				w2ui['routeconfigform'].clear();
				selArray = w2ui['routeconfiggrid'].get(w2ui['routeconfiggrid'].getSelection())
				selArray.forEach(function(selection){
					if (selection.conntype === 'output') {
					w2ui['routeconfiggrid'].remove(selection.recid);
					} else {
					w2alert('You cannot delete the input');
					}
				});
			}
		}

        },
        onRender: function(event){
                event.onComplete = function(){

                        w2ui.routeconfiggrid.records = routerecords;
                        w2ui.routeconfiggrid.refresh();

                }
        },
        columns: [
            { field: 'label', caption: 'Label', size: '20%', sortable: true, searchable: true },
            { field: 'operatorid', caption: 'OperatorId', size: '150px', hidden: true, sortable: true, searchable: true },
            { field: 'conntype', caption: 'Conn Type', size: '50px', sortable: true, searchable: true },
            { field: 'parameter', caption: 'Param', size: '20%', sortable: true, searchable: true },
            { field: 'comparison', caption: 'Comparison', size: '60px' },
            { field: 'value', caption: 'Value', size: '50%' }
        ],
        records: routerecords,
        onClick: function(event) {
            var grid = this;
            var form = w2ui.routeconfigform;
            event.onComplete = function () {
                var sel = grid.getSelection();
                if (sel.length == 1) {
			
		    var selrecord = grid.get(sel[0]);
		    if (selrecord.conntype === 'input') {
		    form.lock('No modification to input',false);
		    form.refresh();
		    } else {
		    form.unlock();
                    form.recid  = sel[0];
                    form.record = $.extend(true, {}, selrecord);
                    form.refresh();
		    }
                } else {
                    form.clear();
                }
            }
        }
    },
    form: {
        header: 'Configure Route',
        name: 'routeconfigform',
	onRender: function(event){
	},
        fields: [
            { name: 'recid', type: 'text', html: { caption: 'ID', attr: 'size="10" readonly' } },
            { name: 'label', type: 'text', required: false, html: { caption: 'Label', attr: 'size="40" maxlength="40"' } },
            { name: 'conntype', type: 'text', required: false, html: { caption: 'Conn Type', attr: 'size="40" readonly' } },
            { name: 'parameter', type: 'text', required: false, html: { caption: 'Parameter', attr: 'size="40"' } },
            { name: 'comparison', type: 'list', options:{items:['=','>','<','>=','<=','<>','LIKE','NOT LIKE']}, html: { caption: 'Comparison', attr: 'size="30"' } },
            { name: 'value', type: 'text', html: { caption: 'Value', attr: 'size="40"' } }
        ],
        actions: {
            "Reset": function () {
                this.clear();
            },
            "Save": function(){
                        // Save what's in the form
                        var errors = this.validate();
                        if (errors.length > 0) return;
                        var formrecvals = {};
                        for (var prop in this.record) {
                                if (typeof this.record[prop] === 'object') {
                                        formrecvals[prop] = this.record[prop].text;
                                } else {
                                        formrecvals[prop] = this.record[prop];
                                }
                        }
                        if (this.recid == 0) {
                            formrecvals['recid'] = w2ui.routeconfiggrid.records.length + 1;
                            //w2ui.routeconfiggrid.add($.extend(true, { recid: w2ui.routeconfiggrid.records.length + 1 }, formrecvals));
                            w2ui.routeconfiggrid.add(formrecvals);
                            w2ui.routeconfiggrid.selectNone();
                            this.clear();
                        } else {
                            w2ui.routeconfiggrid.set(this.recid, formrecvals);
                            w2ui.routeconfiggrid.selectNone();
                            this.clear();
                        }

                        //Need to update the JSON for the operatorData
                        var routes = w2ui['routeconfiggrid'].records;
                        var outId = 1;
                        operatorData.properties.title = w2ui.routeconfiggrid.toolbar.get('routename').value;

                        //clear out initial inputs and outputs;

                        //create new inputs and outputs based on the new config
                       	newoutputs = {}; 
                        routes.forEach(function(route){
                                if (route.conntype === 'output') {
                                        var outputx = 'output_'+outId;
                                        newoutputs[outputx] = {};
                                        newoutputs[outputx].conntype = 'output';
                                        newoutputs[outputx].label = route.label;
                                        newoutputs[outputx].parameter = route.parameter;
                                        newoutputs[outputx].comparison = route.comparison;
                                        newoutputs[outputx].value = route.value;
                                        outId = outId + 1;
                                } 

                        });

			operatorData.properties.outputs = newoutputs;

                            w2confirm('About to update route...are you sure?')
                                    .yes(function () {
					 if (typeof operatorData.properties.outputs['output_1'] === 'undefined') {
					 w2alert('You need at least one output');
					 } else {
                                         operatorData.properties.title = typeof w2ui.routeconfiggrid.toolbar.get('routename').value !== 'undefined' ? w2ui.routeconfiggrid.toolbar.get('routename').value : curTitle;
                                         $('#workflow_1').flowchart('setOperatorData',selId, operatorData);
                                         var workflowdata = $('#workflow_1').flowchart('getData');
                                         workflowdata = JSON.stringify(workflowdata);
                                         workflowname = workflowname.trim();
                                         wfparams = {
                                                 workflowname: workflowname,
                                                 workflowdata: workflowdata
                                         };
					 
                                         UTILS.ajaxPost('save','workflows',wfparams,function(data){
						if (data.status === 'success') {
						w2alert('Route Changes Saved');
						} else {
						w2alert('Route Changes NOT SAVED!  Try saving again');
						}
                                         });

					 }
                                    })
                                    .no(function () {
						w2alert('No Changes Made');
                                        });

            },
	    "Exit": function() {
			w2popup.close();
	    }
        }
    }
};


        $(function () {
            // initialization in memory
           if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
           if (w2ui.routeconfiggrid) { w2ui.routeconfiggrid.destroy(); }
           if (w2ui.routeconfigform) { w2ui.routeconfigform.destroy(); }
           $().w2layout(config.layout);
           $().w2grid(config.grid);
           $().w2form(config.form);
        });

            w2popup.open({
                title   : ' ',
                width   : 1200,
                height  : 600,
                showMax : true,
                body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
                onOpen  : function (event) {
                    event.onComplete = function () {
                        $('#w2ui-popup #main').w2render('poplayout');
                        w2ui.poplayout.content('left', w2ui.routeconfiggrid);
                        w2ui.poplayout.content('main', w2ui.routeconfigform);
                    }
                },
                onToggle: function (event) {
                    event.onComplete = function () {
                        w2ui.poplayout.resize();
                    }
                }
            });

        }
    };
});

