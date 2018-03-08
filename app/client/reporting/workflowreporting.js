define(function (require) {
    var UTILS = require('../../client/utils/misc');
    var REPDATA = require('../reporting/repdata');
    var MESSAGES = require('../../client/messages/messages');
    var WORKFLOWDETAILS = require('../reporting/workflowdetails');

    return {
        workflowreportingform: {
                name: 'workflowreportingform',
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
                        { id: 'tab1', caption: 'Workflow Stats' },
                        { id: 'tab2', caption: 'Workflow Details' },
                 ],
                toolbar: {
                },
                fields: [
                ],
                record: {}
        },
        init: function(){
                $('#workflowreportingform').w2form(this.workflowreportingform);
                w2ui.workflowreportingform.tabs.on('click',function(event){
                        event.onComplete = function(){
                                if (event.target === 'tab1') {
                                $("#workflowslast24hours").html('');
                                $("#workflowslast7days").html('');
                                $("#workflowslast30days").html('');
                                $("#workflows30dayavg").html('');
                                $("#workflows30daymin").html('');
                                $("#workflows30daymax").html('');
                                $("#workflowslast24hoursavgruntime").html('');
                                $("#workflows7daysavgruntime").html('');
                                $("#workflows15daysavgruntime").html('');
                                $("#workflows30daysavgruntime").html('');

                                var workflowslast24hoursparams = {};
                                var workflowslast7daysparams = {};
                                var workflowslast30daysparams = {};
                                var workflows30dayavgparams = {};
                                var workflows30dayminparams = {};
                                var workflows30daymaxparams = {};
                                var workflowslast24hoursavgruntimeparams = {};
                                var workflows7daysavgruntimeparams = {};
                                var workflows15daysavgruntimeparams = {};
                                var workflows30daysavgruntimeparams = {};

                                //todo, for the max on workflows last24hours, grab the number of workflows from license file
                                REPDATA.getresults('workflowslast24hours', workflowslast24hoursparams, function(data){
                                 $("#workflowslast24hours").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflowslast24hours",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 1000,
                                        label: "workflows",
                                        title: "Last 24 Hours"
                                        });
                                });

                                REPDATA.getresults('workflowslast7days', workflowslast7daysparams, function(data){
                                 $("#workflowslast7days").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflowslast7days",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 7000,
                                        label: "workflows",
                                        title: "Last 7 Days"
                                        });
                                });

                                REPDATA.getresults('workflowslast30days', workflowslast30daysparams, function(data){
                                 $("#workflowslast30days").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflowslast30days",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 30000,
                                        label: "workflows",
                                        title: "Last 30 Days"
                                        });
                                });

                                REPDATA.getresults('workflows30dayavg', workflows30dayavgparams, function(data){
                                 $("#workflows30dayavg").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflows30dayavg",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 1000,
                                        label: "workflow avg",
                                        title: "Daily Avg (last 30)"
                                        });
                                });


                                REPDATA.getresults('workflowslast24hoursavgruntime', workflowslast24hoursavgruntimeparams, function(data){
                                 $("#workflowslast24hoursavgruntime").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflowslast24hoursavgruntime",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 24 Hours"
                                        });
                                });

                                REPDATA.getresults('workflow7daysavgruntime', workflows7daysavgruntimeparams, function(data){
                                 $("#workflows7daysavgruntime").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflows7daysavgruntime",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 7 Days"
                                        });
                                });

                                REPDATA.getresults('workflow30daysavgruntime', workflows30daysavgruntimeparams, function(data){
                                 $("#workflows30daysavgruntime").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflows30daysavgruntime",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 30 Days"
                                        });
                                });

                                REPDATA.getresults('workflow15daysavgruntime', workflows15daysavgruntimeparams, function(data){
                                 $("#workflows15daysavgruntime").html('');
                                var workflowslast24hours = new JustGage({
                                        id: "workflows15daysavgruntime",
                                        value: data.records[0].NUMFLOWS,
                                        min: 0,
                                        max: 120,
                                        label: "avg runtime",
                                        title: "Last 15 Days"
                                        });
                                });

                                REPDATA.getresults('daybydayworkflows',{},function(data){
                                        var labels = [];
                                        var series = [];
                                        data.forEach(function(datapoint){
                                                labels.push(datapoint.WFDATE);
                                                series.push(datapoint.NUMFLOWS);
                                        });
                                        new Chartist.Bar('.daybydayworkflows', {
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

                                REPDATA.getresults('daybydayavgworkflows',{},function(data){
                                        var labels = [];
                                        var series = [];
                                        data.forEach(function(datapoint){
                                                labels.push(datapoint.WFDATE);
                                                series.push(datapoint.NUMFLOWS);
                                        });
                                        new Chartist.Line('.daybydayavgworkflows', {
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
                                        $('input[name=workflowname]').w2field('text');
                                        $('input[name=username]').w2field('text');
                                        $('input[name=workflowstarttime]').w2field('datetime', { format: 'yyyy-mm-dd|h24:mm:ss' });
                                        $('input[name=workflowendtime]').w2field('datetime', { format: 'yyyy-mm-dd|h24:mm:ss' });
                                        $('input[name=workflowmetadata]').w2field('text');

                                        var getworkflowreports = function(){
                                                var workflowparams = {
                                                        name: document.getElementsByName('workflowname')[0].value,
                                                        start: document.getElementsByName('workflowstarttime')[0].value,
                                                        end: document.getElementsByName('workflowendtime')[0].value,
                                                        wfmeta: document.getElementsByName('workflowmetadata')[0].value,
                                                        username: document.getElementsByName('username')[0].value
                                                }

                                                REPDATA.getresults('totalworkflows', workflowparams, function(data){
                                                $("#totalworkflows").html('');
                                                        var tworkflows = new JustGage({
                                                        id: "totalworkflows",
                                                        value: data.records[0].totalworkflows,
                                                        min: 0,
                                                        max: 1000,
                                                        label: "executions",
                                                        title: "# Times Run"
                                                        });

                                                });

                                                if (typeof w2ui.workflowdetails === 'object') {
                                                        w2ui.workflowdetails.destroy();
                                                        var workflowdetailgrid = WORKFLOWDETAILS.create(workflowparams);
                                                        $().w2grid(workflowdetailgrid);
                                                        $('#workflowreport').html('');
                                                        $('#workflowreport').w2render('workflowdetails');
                                                } else {
                                                        var workflowdetailgrid = WORKFLOWDETAILS.create(workflowparams);
                                                        $().w2grid(workflowdetailgrid);
                                                        $('#workflowreport').html('');
                                                        $('#workflowreport').w2render('workflowdetails');
                                                }

                                        }

                                        document.getElementById('workflowreports').removeEventListener('click',getworkflowreports,false);
                                        document.getElementById('workflowreports').addEventListener('click',getworkflowreports,false);
                                }
                        }
                });

        }
    };

});

