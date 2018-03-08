define(function (require) {

        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');

    return {
        launch: function(selId,workflowname){
        operatorData = $('#workflow_1').flowchart('getOperatorData',selId);

        var objectname = operatorData.properties.title ? operatorData.properties.title : '';
        var taskname = typeof operatorData.properties.task !== 'undefined' ? operatorData.properties.task['taskname'] : '';
        var runbookid = typeof operatorData.properties.task !== 'undefined' ? operatorData.properties.task['runbookid'] : '';
        var runbookname = typeof operatorData.properties.task !== 'undefined' ? operatorData.properties.task['runbookname'] : '';
        var parameters = typeof operatorData.properties.task !== 'undefined' ? operatorData.properties.task['parameters']  : '';

        var config = {
    layout: {
        name: 'poplayout',
        padding: 4,
        panels: [
            { type: 'top', size: '45%' },
            { type: 'main', size: '55%' }
        ]
    },
    tasksideform: {
      name: 'tasksideform',
      header: 'Action Description',
      url: 'app/server/main.php',
      method: 'POST',
      show: {
        header         : true,
        toolbar        : true,
        footer        : true
      },
      tabs: [
        { id: 'tab1', caption: 'Description' }
      ],
      onRender: function(event) {

        var taskname = w2ui.taskconfigform.record.taskname.id;
        var task_params = { taskname: taskname };

        UTILS.ajaxPost('get','tasks',task_params, function(data) {
		if (data.total > 0) {
                w2ui.tasksideform.record.taskdescription =  data.records[0].taskdescription.replace(/\\/g, '');
		} else {

                w2ui.tasksideform.record.taskdescription = '';
		}
                w2ui.tasksideform.refresh();
        });

      },
      fields: [
        { name: 'taskdescription', type: 'textarea', required: false, html: { caption: 'Description', attr: 'rows="50" cols="150"' } }
      ],
      formHTML:
        '<div class="w2ui-page page-0">'+
                '<div class="w2ui-field">'+
                        '<label>Description</label>'+
                        '<div>'+
                        '<textarea name="taskdescription" type="text" style="width: 100%; height: 400px; resize: none"></textarea>'+
                        '</div>'+
                '</div>'+
        '</div>'
    },
    form: {
        header: 'Task and Params',
        name: 'taskconfigform',
        fields: [
                { field: 'objectname', type: 'text'},
                { field: 'runbookname', type: 'list', options: { items: [] }},
                { field: 'taskname', type: 'list', options: { items: [] }},
                { field: 'parameters', type: 'text'},
        ],
        onRender: function(event){
                    rbtask_params = {"runbook":runbookid,
                                        "lookingfor":"selected"};
                    UTILS.ajaxPost('get','task_runbooks',rbtask_params, function(data) {
                    var tasknames = [];
                    data.records.forEach(function(task){
                                tasknames.push(task.taskname);
                    });
                     w2ui.taskconfigform.fields[2].options.items = tasknames;
                     w2ui.taskconfigform.refresh();
                    });
        },
        onChange: function(event){
                    console.log(event);
                        if (event.target === 'runbookname') {

                                    var runbookid = event.value_new.id;
                                    rbtask_params = {"runbook":runbookid,
                                                        "lookingfor":"selected"};
                                    UTILS.ajaxPost('get','task_runbooks',rbtask_params, function(data) {
                                    var tasknames = [];
                                    data.records.forEach(function(task){
                                                tasknames.push(task.taskname);
                                    });
                                     w2ui.taskconfigform.fields[2].options.items = tasknames;
                                     w2ui.taskconfigform.refresh();
                                    });

                        } else if (event.target === 'taskname') {

                                var taskname = event.value_new.id;
                                var task_params = { taskname: taskname };

                                UTILS.ajaxPost('get','tasks',task_params, function(data) {
                                        w2ui.tasksideform.record.urlparams = data.records[0].urlparams;
                                        w2ui.tasksideform.record.actiontext = data.records[0].actiontext;
                                        w2ui.tasksideform.record.actionfilename = data.records[0].actionfilename;
                                        w2ui.tasksideform.record.taskdescription = data.records[0].taskdescription.replace(/\\/g, '');
                                        w2ui.tasksideform.record.actionlanguage = data.records[0].actionlanguage;
                                        w2ui.tasksideform.refresh();
                                });
                        }
        },
        toolbar: {
            items: [
                { id: 'reset', type: 'button', caption: 'Reset', img: 'fa fa-file-o' },
                { id: 'save', type: 'button', caption: 'Save', img: 'fa fa-floppy-o' }
            ],
            onClick: function (event) {
                if (event.target == 'reset') w2ui.taskconfigform.clear();
                if (event.target == 'save') {
                //Need to update the JSON for the operatorData
                        var operatorId = $('#workflow_1').flowchart('getSelectedOperatorId');
                        operatorData.properties.title = w2ui.taskconfigform.record.objectname;
                        operatorData.properties.task = {};
                        operatorData.properties.task['taskname'] = w2ui.taskconfigform.record.taskname.text;
                        operatorData.properties.task['parameters'] = w2ui.taskconfigform.record.parameters;
                        operatorData.properties.task['runbookname'] = w2ui.taskconfigform.record.runbookname.text;
                        operatorData.properties.task['runbookid'] = w2ui.taskconfigform.record.runbookname.id;

                        //clear out initial inputs and outputs;


                            w2confirm('About to update task...are you sure?')
                                    .yes(function () {
                                                        $('#workflow_1').flowchart('setOperatorData',operatorId, operatorData);
                                                        var workflowdata = $('#workflow_1').flowchart('getData');
                                                        workflowdata = JSON.stringify(workflowdata);
                                                        workflowname = workflowname.trim();
                                                        wfparams = {
                                                                workflowname: workflowname,
                                                                workflowdata: workflowdata
                                                        };
                                                        UTILS.ajaxPost('save','workflows',wfparams,function(data){
                                                        });

                                                        MESSAGES.wftaskchanged();
                                                })
                                    .no(function () {
                                                w2popup.close();
                                                MESSAGES.wftasknotchanged();
                                        });


                }
            }
        },
        formHTML: '<div class="w2ui-page page-0">' +
                '<div class="w2ui-field">'+
                        '<label>Label:</label>'+
                        '<div>'+
                        '<input name="objectname" type="text" maxlength="300" size="60" />'+
                        '</div>'+
                '</div>'+
                '<div class="w2ui-field">'+
                        '<label>Runbook:</label>'+
                        '<div>'+
                        '<input name="runbookname" type="text" maxlength="300" size="60" />'+
                        '</div>'+
                '</div>'+
                '<div class="w2ui-field">'+
                        '<label>Task Name:</label>'+
                        '<div>'+
                        '<input name="taskname" type="text" maxlength="300" size="60" />'+
                        '</div>'+
                '</div>'+
                '<div class="w2ui-field">'+
                        '<label>Task Params:</label>'+
                        '<div>'+
                        '<textarea name="parameters" type="text" rows="20" cols="180"></textarea>'+
                        '</div>'+
                '</div>'+
                '</div>',
        record: {
                objectname: objectname,
                runbookname: {id: runbookid, text: runbookname},
                taskname: {id: taskname, text: taskname},
                parameters: parameters
        }
    }
};


        $(function () {
            // initialization in memory
            var rbparams = {};
            UTILS.ajaxPost('get','runbooks',rbparams,function(data){
                var runbooknames = [];
                data.records.forEach(function(runbook) {

                        runbooknames.push({id: runbook.runbookid, text:runbook.runbookname});
                                                if (data.total == runbooknames.length){
                                                        config.form.fields[1].options.items = runbooknames;
                                                        showConfig();
                                                }
                });


            if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
            if (w2ui.taskconfigform) { w2ui.taskconfigform.destroy(); }
            if (w2ui.tasksideform) { w2ui.tasksideform.destroy(); }
            $().w2layout(config.layout);
            $().w2form(config.form);
            $().w2form(config.tasksideform);
            });

        });

                        var showConfig = function(){
            w2popup.open({
                title   : ' ',
                width   : 1350,
                height  : 900,
                showMax : true,
                body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
                onOpen  : function (event) {
                    event.onComplete = function () {
                        $('#w2ui-popup #main').w2render('poplayout');
                        w2ui.poplayout.content('main', w2ui.taskconfigform);
                        w2ui.poplayout.content('top', w2ui.tasksideform);
                    }
                },
                onToggle: function (event) {
                    event.onComplete = function () {
                        w2ui.poplayout.resize();
                    }
                }
            });
                        }

        }
    };
});

