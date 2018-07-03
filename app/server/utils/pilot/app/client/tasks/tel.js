define(function(require) {
  var TELDATA = require('../tasks/teldata')
  var UTILS = require('../../client/utils/misc')
  var TASKFORM = require('../tasks/form')
  var TASKGRID = require('../tasks/grid')

  return {
    create: function(menuid, taskdata) {
        var taskeventlist = {
          name: menuid + '_tel',

          header: 'Task Event List',

          show: {
            header: true,
            toolbar: true,
            footer: true,
            toolbarColumns: false
          },

          toolbar: {
            items: [
                { type: 'break' },
                { type: 'html',  id: 'datefilter',
                   html: function (item) {
                       var html =
                         '<div style="padding: 3px 10px;">' +
                         ' Filter:' +
                         '    <input id="datefilterinput" type="us-date" style="width:80px" />' +
                         '</div>';
                       return html;
                   }
                },
            ],

            onClick: function(event) {
              if (event.target === 'w2ui-reload') {
                TELDATA.getresults(taskdata.runbookid, taskdata.taskname, function(teldata) {
                  console.log('TELDATA is ...');
                  console.log(teldata);
                  w2ui[menuid+'_tel'].records = teldata.records;
                  w2ui[menuid+'_tel'].sort('taskstarttime','desc');
                  w2ui[menuid+'_tel'].refresh();
                });
              } else if (event.target === 'problemmenu') {

              }
            }

          },

          onClick: function(event) {
            var record = UTILS.getRecordFromRecid(event.recid, this)
            var data = record.taskoutput

            // Retrieve the grid or form based on the selected sidebar item
            var nodeId = w2ui.sidebar.selected

            if (taskdata.tasktype == 'Form') {
              var form = w2ui[nodeId]

              if (taskdata.datatype === 'JSON') {
                form.record = JSON.parse(data)
              } else if (taskdata.datatype === 'Text') {
                var fs = new RegExp(taskdata.fieldseparator)
                var values = data.split(fs)

                var count = 0
                form.fields.forEach(function(element) {
                  currentfield = form.fields[count].field
                  form.record[currentfield] = values[count]
                  count++
                })
              }

            form.refresh()

            } else {
              var grid = w2ui[nodeId]
              var columns = grid.columns.map(function(x) { return x.field })

              if (record.datatype === 'JSON')
                grid.records = UTILS.getgridrecords(taskdata.jprop, columns, JSON.parse(data));
              else if (record.datatype === 'Text') {
                var fs = new RegExp(taskdata.fieldseparator);
                var rs = new RegExp(taskdata.recordseparator);
                var records = UTILS.getgridtextrecords(fs, rs, columns, data)
                grid.records = records
              }

              grid.refresh()
            }
          },
          onRefresh: function(event) {
            event.onComplete = function() {
              // Set the date field in the taskbar with default value of one day ago.
              var oneDayAgo = new Date()
              oneDayAgo.setDate(oneDayAgo.getDate() - 1)
              var datestr = oneDayAgo.getFullYear() + '-' + (oneDayAgo.getMonth() + 1) + '-' + oneDayAgo.getDate()

              $('input[type=us-date]').w2field('date', { format: 'yyyy-m-d' });
              $('#datefilterinput').val(datestr)

              // On change, we update the grid with the new date as filter.
              $('#datefilterinput').change(function() {
                var date = $('#datefilterinput').val()

                UTILS.ajaxPost('get', 'task_logs', [ { filter: date, runbookid: taskdata.runbookid, taskname: taskdata.taskname, gettype: 'tel' } ], function(response) {
                  w2ui[menuid+'_tel'].records = response.records
                  w2ui[menuid+'_tel'].sort('taskstarttime', 'desc')
                  w2ui[menuid+'_tel'].refresh()

                  if (response.filter)
                    $('#datefilterinput').val(response.filter)
                })
              })
            }
          },
          onRender: function(event) {
            event.onComplete = function() {
              TELDATA.getresults(taskdata.runbookid, taskdata.taskname, function(teldata) {
                w2ui[menuid+'_tel'].records = teldata.records;
                w2ui[menuid+'_tel'].sort('taskstarttime', 'desc');
                w2ui[menuid+'_tel'].refresh();

                if (teldata.filter)
                  $('#datefilterinput').val(teldata.filter)
              });
            }
          },
          columns: [
            { field: 'recid', caption: 'RecID', size: '140px', hidden: true, sortable: true },
            { field: 'taskname', caption: 'Task Name', size: '20%', hidden: false, sortable: true },
            { field: 'username', caption: 'User Name', size: '140px', hidden: false, sortable: true },
            { field: 'actionfilename', caption: 'File Name', size: '140px', hidden: false, sortable: true },
            { field: 'taskstarttime', caption: 'Start Time', size: '140px', hidden: false, sortable: true },
            { field: 'tasktime', caption: 'Exec Time (secs)', size: '140px', hidden: false, sortable: true },
            { field: 'taskpid', caption: 'PID', size: '140px', hidden: true, sortable: true },
            { field: 'taskoutput', caption: 'Task Output', size: '140px', hidden: true, sortable: true },
            { field: 'taskstatus', caption: 'Status', size: '140px', hidden: true, sortable: true },
          ],
          sortData: [ { field: 'taskstarttime', direction: 'desc' }, ],
          records: []
        };

        $().w2grid(taskeventlist);
    }
  }
});

