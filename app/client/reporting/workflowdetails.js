define(function (require) {
        var REPDATA = require('../reporting/repdata');

    return {
        create: function(workflowparams){

                var workflowdetails = {
                        name   : 'workflowdetails',
                        header : 'Workflow Details',
                        show : {
                                header: true,
                                footer: true
                        },
                        onRender: function(event){
                                event.onComplete = function() {
                                        REPDATA.getresults('workflowdetails', workflowparams, function(data){
                                                w2ui['workflowdetails'].records = data.records;
                                                w2ui['workflowdetails'].sort('wfstart','desc');
                                                w2ui['workflowdetails'].refresh();
                                        });
                                }
                        },
                        columns: [
                        { field: 'recid', caption: 'RecID', size: '140px', hidden: true, sortable: true },
                        { field: 'workflowname', caption: 'Task Name', size: '20%', hidden: false, sortable: true, info: true },
                        { field: 'wfstart', caption: 'Start Time', size: '140px', hidden: false, sortable: true },
                        { field: 'wfstart', caption: 'Start Time', size: '140px', hidden: false, sortable: true },
                        { field: 'wftime', caption: 'Exec Time (secs)', size: '140px', hidden: false, sortable: true },
                        { field: 'wfmetadata', caption: 'Workflow Metadata', size: '140px', hidden: true, sortable: true },
                        ],
                        sortData: [
                                { field: 'wfstart', direction: 'desc' },
                        ],
                        records: []

                };

                return workflowdetails;
        }
    };
});

