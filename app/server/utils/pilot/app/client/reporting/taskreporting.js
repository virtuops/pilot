define(function (require) {
    var UTILS = require('../../client/utils/misc');
    var REPDATA = require('../reporting/repdata');
    var MESSAGES = require('../../client/messages/messages');
    var TASKDETAILS = require('../reporting/taskdetails');

    var licPostData = {
                      json: 'true'
                      }

    return {
        taskreportingform: {
                name: 'taskreportingform',
                header: 'Intelligence Center',
                url: 'app/server/main.php',
                method: 'POST',
                show: {
                    header         : true,
                    toolbar        : true,
                    footer        : true
                },
                onRender: function(event) {

                },
                tabs: [
                        { id: 'tab1', caption: 'Task Stats' },
                        { id: 'tab2', caption: 'Task Details' },
                 ],
                toolbar: {
                },
                fields: [
                ],
                record: {}
        },
        init: function(){
                $('#taskreportingform').w2form(this.taskreportingform);
                w2ui.taskreportingform.tabs.on('click',function(event){
                        event.onComplete = function(){
                                if (event.target === 'tab1') {
                                $("#taskslast24hours").html('');
                                $("#taskslast7days").html('');
                                $("#taskslast30days").html('');
                                $("#tasks30dayavg").html('');
                                $("#tasks30daymin").html('');
                                $("#tasks30daymax").html('');
                                $("#tasksfailedlast24hours").html('');
                                $("#tasksfailed7days").html('');
                                $("#tasksfailed30days").html('');
                                $("#tasksfailed30avg").html('');
                                $("#tasksfailed30min").html('');
                                $("#tasksfailed30max").html('');
                                $("#taskslast24hoursavgruntime").html('');
                                $("#tasks7daysavgruntime").html('');
                                $("#tasks15daysavgruntime").html('');
                                $("#tasks30daysavgruntime").html('');

                                var taskslast24hoursparams = {};
                                var taskslast7daysparams = {};
                                var taskslast30daysparams = {};
                                var tasks30dayavgparams = {};
                                var tasks30dayminparams = {};
                                var tasks30daymaxparams = {};
                                var tasksfailedlast24hoursparams = {};
                                var tasksfailed7daysparams = {};
                                var tasksfailed30daysparams = {};
                                var tasksfailed30dayavgparams = {};
                                var tasksfailed30dayminparams = {};
                                var tasksfailed30daymaxparams = {};
                                var taskslast24hoursavgruntimeparams = {};
                                var tasks7daysavgruntimeparams = {};
                                var tasks15daysavgruntimeparams = {};
                                var tasks30daysavgruntimeparams = {};

                                var authtasksday = 20000;
                                var authtasks7day = 140000;
                                var authtasks15day = 300000;
                                var authtasks30day = 600000;

                                //todo, for the max on tasks last24hours, grab the number of tasks from license file
                                REPDATA.getresults('taskslast24hours', taskslast24hoursparams, function(data){
                                 $("#taskslast24hours").html('');
                                var taskslast24hours = new JustGage({
                                        id: "taskslast24hours",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasksday,
                                        label: "tasks",
                                        title: "Last 24 Hours"
                                        });
                                });

                                REPDATA.getresults('taskslast7days', taskslast7daysparams, function(data){
                                 $("#taskslast7days").html('');
                                var taskslast24hours = new JustGage({
                                        id: "taskslast7days",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasks7day,
                                        label: "tasks",
                                        title: "Last 7 Days"
                                        });
                                });

                                REPDATA.getresults('taskslast30days', taskslast30daysparams, function(data){
                                 $("#taskslast30days").html('');
                                var taskslast24hours = new JustGage({
                                        id: "taskslast30days",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasks30day,
                                        label: "tasks",
                                        title: "Last 30 Days"
                                        });
                                });

                                REPDATA.getresults('tasks30dayavg', tasks30dayavgparams, function(data){
                                 $("#tasks30dayavg").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasks30dayavg",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasksday,
                                        label: "task avg",
                                        title: "Daily Avg (last 30)"
                                        });
                                });


                                REPDATA.getresults('tasksfailed24hours', tasksfailedlast24hoursparams, function(data){
                                 $("#tasksfailedlast24hours").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasksfailedlast24hours",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasksday,
                                        label: "failures",
                                        title: "Last 24 Hours"
                                        });
                                });

                                REPDATA.getresults('tasksfailed7days', taskslast7daysparams, function(data){
                                 $("#tasksfailed7days").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasksfailed7days",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasks7day,
                                        label: "failures",
                                        title: "Last 7 Days"
                                        });
                                });

                                REPDATA.getresults('tasksfailed30days', taskslast30daysparams, function(data){
                                 $("#tasksfailed30days").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasksfailed30days",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasks30day,
                                        label: "failures",
                                        title: "Last 30 Days"
                                        });
                                });

                                REPDATA.getresults('tasksfailed30dayavg', tasksfailed30dayavgparams, function(data){
                                 $("#tasksfailed30dayavg").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasksfailed30dayavg",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: authtasksday,
                                        label: "failures",
                                        title: "Daily Avg (last 30)"
                                        });
                                });


                                REPDATA.getresults('taskslast24hoursavgruntime', taskslast24hoursavgruntimeparams, function(data){
                                 $("#taskslast24hoursavgruntime").html('');
                                var taskslast24hours = new JustGage({
                                        id: "taskslast24hoursavgruntime",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 24 Hours"
                                        });
                                });

                                REPDATA.getresults('task7daysavgruntime', tasks7daysavgruntimeparams, function(data){
                                 $("#tasks7daysavgruntime").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasks7daysavgruntime",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 7 Days"
                                        });
                                });

                                REPDATA.getresults('task30daysavgruntime', tasks30daysavgruntimeparams, function(data){
                                 $("#tasks30daysavgruntime").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasks30daysavgruntime",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 30 Days"
                                        });
                                });

                                REPDATA.getresults('task15daysavgruntime', tasks15daysavgruntimeparams, function(data){
                                 $("#tasks15daysavgruntime").html('');
                                var taskslast24hours = new JustGage({
                                        id: "tasks15daysavgruntime",
                                        value: data.records[0].NUMTASKS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 15 Days"
                                        });
                                });

                                REPDATA.getresults('daybydaytasks',{},function(data){
                                        var labels = [];
                                        var series = [];
                                        data.forEach(function(datapoint){
                                                labels.push(datapoint.TASKDATE);
                                                series.push(datapoint.NUMTASKS);
                                        });
                                        new Chartist.Bar('.daybydaytasks', {
                                          labels: labels,
                                          series: [
                                                series
                                          ]
                                        }, {
                                          fullWidth: true,
                                          chartPadding: {
                                            right: 40
                                          }
                                        });

                                });

                                REPDATA.getresults('daybydayfails',{},function(data){
                                        var labels = [];
                                        var series = [];
                                        data.forEach(function(datapoint){
                                                labels.push(datapoint.TASKDATE);
                                                series.push(datapoint.NUMTASKS);
                                        });
                                        new Chartist.Line('.daybydayfails', {
                                          labels: labels,
                                          series: [
                                                series
                                          ]
                                        }, {
                                          fullWidth: true,
                                          low: 0,
                                          showArea: true,
                                          chartPadding: {
                                            right: 40
                                          }
                                        });

                                });

                                REPDATA.getresults('daybydayavg',{},function(data){
                                        var labels = [];
                                        var series = [];
                                        data.forEach(function(datapoint){
                                                labels.push(datapoint.TASKDATE);
                                                series.push(datapoint.NUMTASKS);
                                        });
                                        new Chartist.Line('.daybydayavg', {
                                          labels: labels,
                                          series: [
                                                series
                                          ]
                                        }, {
                                          fullWidth: true,
                                          low: 0,
                                          showArea: true,
                                          chartPadding: {
                                            right: 40
                                          }
                                        });

                                });



                                }

                                if (event.target === 'tab2') {
                                        $('input[name=taskname]').w2field('text');
                                        $('input[name=username]').w2field('text');
                                        $('input[name=taskstarttime]').w2field('datetime', { format: 'yyyy-mm-dd|h24:mm:ss' });
                                        $('input[name=taskendtime]').w2field('datetime', { format: 'yyyy-mm-dd|h24:mm:ss' });
                                        $('input[name=taskmetadata]').w2field('text');

                                        var gettaskreports = function(){
                                                var taskparams = {
                                                        name: document.getElementsByName('taskname')[0].value,
                                                        start: document.getElementsByName('taskstarttime')[0].value,
                                                        end: document.getElementsByName('taskendtime')[0].value,
                                                        taskmeta: document.getElementsByName('taskmetadata')[0].value,
                                                        username: document.getElementsByName('username')[0].value
                                                }

                                                REPDATA.getresults('totaltasks', taskparams, function(data){
                                                $("#totaltasks").html('');
                                                        var ttasks = new JustGage({
                                                        id: "totaltasks",
                                                        value: data.records[0].totaltasks,
                                                        min: 0,
                                                        max: 1000,
                                                        label: "executions",
                                                        title: "# Times Run"
                                                        });

                                                });

                                                if (typeof w2ui.taskdetails === 'object') {
                                                        w2ui.taskdetails.destroy();
                                                        var taskdetailgrid = TASKDETAILS.create(taskparams);
                                                        $().w2grid(taskdetailgrid);
                                                        $('#taskreport').html('');
                                                        $('#taskreport').w2render('taskdetails');
                                                } else {
                                                        var taskdetailgrid = TASKDETAILS.create(taskparams);
                                                        $().w2grid(taskdetailgrid);
                                                        $('#taskreport').html('');
                                                        $('#taskreport').w2render('taskdetails');
                                                }

                                        }

                                        document.getElementById('taskreports').removeEventListener('click',gettaskreports,false);
                                        document.getElementById('taskreports').addEventListener('click',gettaskreports,false);
                                }
                        }
                });

        }
    };

});
