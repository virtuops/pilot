define(function (require) {

        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');

    return {
        launch: function(selId, workflowname){
        operatorData = $('#workflow_1').flowchart('getOperatorData', selId);
        var curTitle = operatorData.properties.title;
	var loopid = selId;

        var config = {
    layout: {
        name: 'poplayout',
        padding: 4,
        panels: [
            { type: 'main', minSize: 300 }
        ]
    },
    form: {
        name: 'routeconfigform',
        fields: [
            { name: 'loopid', type: 'text', required: true, html: { caption: 'Loop ID', attr: 'size="40" readonly'  } },
            { name: 'title', type: 'text', required: true, html: { caption: 'Route Title', attr: 'size="40" maxlength="40"' } },
            { name: 'parameter', type: 'text', required: true, html: { caption: 'Parameter', attr: 'size="40" maxlength="40" value="counter" readonly' } },
            { name: 'comparison', type: 'list', required: true, options:{items:['=','>','<','>=','<=']}, html: { caption: 'Comparison', attr: 'size="40"' } },
            { name: 'value', type: 'text', required: true, html: { caption: 'Value', attr: 'size="40"' } },
            { name: 'increment', type: 'text', required: true, html: { caption: 'Increment', attr: 'size="40"' } }
        ],
	onRender: function(event){
		
		event.onComplete = function(){
		this.record.parameter = "counter";
		this.record.title = operatorData.properties.title;
		this.record.loopid = loopid;
		this.record.comparison = operatorData.properties.outputs['output_1'].comparison;
		this.record.value = operatorData.properties.outputs['output_1'].value;
		this.record.increment = operatorData.properties.outputs['output_1'].increment;
		this.refresh();
		}
	},
        actions: {
            "Reset": function () {
                this.clear();
            },
            "Save and Exit": function(){
                        // Save what's in the form
                        var errors = this.validate();
                        if (errors.length > 0) return;

			route = this.record;

                        //Need to update the JSON for the operatorData
                        var inId = 1;
                        var outId = 1;

                        //create new inputs and outputs based on the new config
			 operatorData.properties.title = route.title;
			 operatorData.properties.loopid = route.loopid;
                         var inputx = 'input_'+inId;
                         operatorData.properties.inputs[inputx] = {};
                         operatorData.properties.inputs[inputx].conntype = 'input';
                         operatorData.properties.inputs[inputx].label = 'In';
                         var outputx = 'output_'+outId;
                         operatorData.properties.outputs[outputx] = {};
                         operatorData.properties.outputs[outputx].conntype = 'output';
                         operatorData.properties.outputs[outputx].label = 'Out';
                         operatorData.properties.outputs[outputx].parameter = route.parameter;
                         operatorData.properties.outputs[outputx].comparison = route.comparison;
                         operatorData.properties.outputs[outputx].value = route.value;
                         operatorData.properties.outputs[outputx].increment = route.increment;


                            w2confirm('About to update route...are you sure?')
                                    .yes(function () {
                                                        operatorData.properties.title = typeof w2ui.routeconfigform.record.title !== 'undefined' ? w2ui.routeconfigform.record.title : 'While';
                                                        $('#workflow_1').flowchart('setOperatorData',selId, operatorData);
                                                        var workflowdata = $('#workflow_1').flowchart('getData');
                                                        workflowdata = JSON.stringify(workflowdata);
                                                        workflowname = workflowname.trim();
                                                        wfparams = {
                                                                workflowname: workflowname,
                                                                workflowdata: workflowdata
                                                        };
                                                        UTILS.ajaxPost('save','workflows',wfparams,function(data){
                                                        });
                                                        MESSAGES.routechanged();
                                                })
                                    .no(function () {
                                                w2popup.close();
                                                MESSAGES.routenotchanged();
                                        });

            }
        }
    }
};


        $(function () {
            // initialization in memory
           if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
           if (w2ui.routeconfigform) { w2ui.routeconfigform.destroy(); }
           $().w2layout(config.layout);
           $().w2form(config.form);
        });

            w2popup.open({
                title   : 'Configure While Loop',
                width   : 500,
                height  : 600,
                showMax : true,
                body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
                onOpen  : function (event) {
                    event.onComplete = function () {
                        $('#w2ui-popup #main').w2render('poplayout');
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

