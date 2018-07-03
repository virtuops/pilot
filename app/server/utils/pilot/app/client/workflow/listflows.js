define(function (require) {

        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');
        var workflows = [];


    return {
        launch: function(){

        var config = {
    layout: {
        name: 'poplayout',
        padding: 4,
        panels: [
            { type: 'main', minSize: 300 }
        ]
    },
    form: {
	show: {
		header: 'false'
	},
        name: 'listworkflowsform',
        fields: [
                { field: 'workflowname', type: 'list', options: { items: [] }},
        ],
        toolbar: {
            items: [
                { id: 'load', type: 'button', caption: 'Load', img: 'loadvotype' }
            ],
            onClick: function (event) {
                if (event.target == 'load') {
                        var name = w2ui.listworkflowsform.record.workflowname.text;
                        workflows.forEach(function(flow){
                                if (flow.workflowname === name) {
                                        var currentflow = JSON.parse(flow.workflowdata);
                                        $('#workflow_1').flowchart('setData',currentflow);
                                        w2ui.workflowadmin.toolbar.set('workflowname',{value: name})
                                        w2popup.close();
                                }
                        });
                }
            }
        },
        formHTML: '<div class="w2ui-page page-0">' +
                '<div class="w2ui-field">'+
                        '<label>Workflow Name:</label>'+
                        '<div>'+
                        '<input name="workflowname" type="text" maxlength="300" size="60" />'+
                        '</div>'+
                '</div>',
        record: {
        }
    }
};


        $(function () {
            // initialization in memory
            UTILS.ajaxPost('get','workflows',{}, function(data) {

            workflows = data.records;
            var workflownames = [];

            data.records.forEach(function(workflow){
                        workflownames.push(workflow.workflowname);
                        if (workflownames.length == data.total) {
                            config.form.fields[0].options.items = workflownames;
                            showFlows();
                        }
            });

            // initialization in memory

            if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
            if (w2ui.listworkflowsform) { w2ui.listworkflowsform.destroy(); }
            $().w2layout(config.layout);
            $().w2form(config.form);
            });
        });


            var showFlows = function(){
            w2popup.open({
                title   : 'Load Workflow',
                width   : 600,
                height  : 300,
                showMax : true,
                body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
                onOpen  : function (event) {
                    event.onComplete = function () {
                        $('#w2ui-popup #main').w2render('poplayout');
                        w2ui.poplayout.content('main', w2ui.listworkflowsform);
                    }
                },
                onToggle: function (event) {
                    event.onComplete = function () {
                        w2ui.poplayout.resize();
                    }
                }
            });
            };

        }
    };
});

