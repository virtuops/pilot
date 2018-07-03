define(function (require) {
        var REPDATA = require('../reporting/repdata');

    return {
        create: function(taskparams){

                var taskdetails = {
                        name   : 'taskdetails',
                        header : 'Task Details',
                        show : {
                                header: true,
                                footer: true
                        },
                        onRender: function(event){
                                event.onComplete = function() {
                                        REPDATA.getresults('taskdetails', taskparams, function(data){
                                                w2ui['taskdetails'].records = data.records;
                                                w2ui['taskdetails'].sort('taskstarttime','desc');
                                                w2ui['taskdetails'].refresh();
                                        });
                                }
                        },
                        columns: [
                        { field: 'recid', caption: 'RecID', size: '140px', hidden: true, sortable: true },
                        { field: 'taskname', caption: 'Task Name', size: '20%', hidden: false, sortable: true, info: true },
                        { field: 'username', caption: 'User Name', size: '140px', hidden: false, sortable: true },
                        { field: 'actionfilename', caption: 'File Name', size: '140px', hidden: false, sortable: true },
                        { field: 'taskstarttime', caption: 'Start Time', size: '140px', hidden: false, sortable: true },
                        { field: 'tasktime', caption: 'Exec Time (secs)', size: '140px', hidden: false, sortable: true },
                        { field: 'taskpid', caption: 'PID', size: '140px', hidden: true, sortable: true },
                        { field: 'taskoutput', caption: 'Task Output', size: '140px', hidden: true, sortable: true },
                        { field: 'taskmetadata', caption: 'Task Metadata', size: '140px', hidden: true, sortable: true },
                        { field: 'taskstatus', caption: 'Status', size: '140px', hidden: false, sortable: true },
                        { field: 'taskexit', caption: 'Result', size: '140px', hidden: false, sortable: true}
                        ],
                        sortData: [
                                { field: 'taskstarttime', direction: 'desc' },
                        ],
                        records: []

                };

                return taskdetails;
        }
    };
});
