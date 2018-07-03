define(function (require) {

        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');

    return {
        launch: function(selId, workflowname){
        operatorData = $('#workflow_1').flowchart('getOperatorData', selId);
        var curTitle = operatorData.properties.title;

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
            { name: 'title', type: 'text', required: true, html: { caption: 'Title', attr: 'size="40" maxlength="40" readonly' } },
            { name: 'loopid', type: 'text', required: true, html: { caption: 'Loop ID', attr: 'size="40" maxlength="40"' } }
        ],
	onRender: function(event){
		
		event.onComplete = function(){
		this.record.title = operatorData.properties.title;
		this.record.loopid = operatorData.properties.loopid;
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

