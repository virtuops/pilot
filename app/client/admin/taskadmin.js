define(function (require) {
  var DATA = require('../admin/data')
  var UTILS = require('../../client/utils/misc')
  var MESSAGES = require('../../client/messages/messages');


  var refreshTaskGrid = function(callback) {
    UTILS.ajaxPost('get', 'tasks', '', function(response) {
      w2ui.tasktopgrid.records = response.records
      w2ui.tasktopgrid.refresh()

      if (callback) callback()
    })
  }

  return {
    tasktopgrid: {
      name: 'tasktopgrid',
      header: 'Task List',
      show: {
        header : true,
        toolbar : true,
        footer  : true,
        toolbarColumns: false
      },
      toolbar: {
        items: [
          { type: 'break' },
          { type: 'button', id: 'remove', caption: 'Remove Task', img: 'removeicon' }
        ],
        onClick: function(event) {
          if (event.target == 'w2ui-reload') {
            refreshTaskGrid(function() {
              $('#tb_tasktopgrid_toolbar_item_w2ui-reload').w2tag(
                'Grid Reloaded...', { hideOnClick: true, position: 'top' })
            })
          } else if (event.target == 'remove') {
            w2confirm('Are you sure you wish to remove this action/task?')
            .yes(function() {
              // Send all the selected tasks in a list to the server.

              var recids = w2ui.tasktopgrid.getSelection()
              var tasknames = recids.map(function(x) { 
                return UTILS.getRecordFromRecid(x, w2ui.tasktopgrid).taskname
              })
              tasknames = "('" + tasknames.join("','") + "')"


	      UTILS.ajaxPost('delete','task_runbooks',[ {taskname: tasknames} ], function(data){
		});
      
              UTILS.ajaxPost('delete', 'tasks', [ { taskname: tasknames } ], function(response) { 
                w2ui.tasktopgrid.records = response.records
                w2ui.tasktopgrid.refresh()
                w2ui.tasktopgrid.selectNone()
		MESSAGES.taskdeleted();
              })
            })
          }
        }
      },
      columns: [
        { field: 'recid', caption: 'RecID', size: '140px', hidden: true, sortable: true },
        { field: 'actionfilename', caption: 'File Name', size: '80px', sortable: true, hidden: true },
        { field: 'actionlanguage', caption: 'Programming Language', size: '80px', sortable: true, hidden: true },
        { field: 'urlparams', caption: 'URL Params', size: '80px', sortable: true, hidden: true },
        { field: 'actiontext', caption: 'Action Text', size: '80px', sortable: true, hidden: true },
        { field: 'taskname', caption: 'Name', size: '20%', sortable: true },
        { field: 'taskdescription', caption: 'Description', size: '50%', sortable: true, hidden: true },
      ],
      onRender: function(event) {
        event.onComplete = function() { 
		refreshTaskGrid() 
	    }
      },
      onClick: function(event) {
        var grid = this;
        event.onComplete = function () {
          var sel = this.getSelection();
          if (sel.length == 1) {
            w2ui.taskbottomform.recid  = sel[0];
            w2ui.taskbottomform.record = $.extend(true, {}, grid.get(sel[0]));
	    taskdescr.setValue(w2ui.taskbottomform.record.taskdescription,-1);
	    actiontext.setValue(w2ui.taskbottomform.record.actiontext,-1);
	    taskdescr.resize();
            actiontext.resize();

            w2ui.taskbottomform.refresh();
          } else {
            w2ui.taskbottomform.clear();
          }
        }
      }
    },
    taskbottomform: {
      name: 'taskbottomform',
      header: 'Task Config',
      url: 'app/server/main.php',
      method: 'POST',
      show: {
        header         : true,
        toolbar        : true,
        footer        : true
      },
      tabs: [
        { id: 'tab1', caption: 'General' },
        { id: 'tab2', caption: 'Action Wrapper' }
      ],
      toolbar: {
        items: [
          { id: 'clear', type: 'button', caption: 'Reset', img: 'reseticon' },
          { id: 'save', type: 'button', caption: 'Save', img: 'saveicon' }
        ],
        onClick: function (event) {
          if (event.target == 'clear') w2ui.taskbottomform.clear();
          if (event.target == 'save') { 
            var record = w2ui.taskbottomform.record
	    var td = taskdescr.getValue();
	    var at = actiontext.getValue();
		record.taskdescription = td;
		record.actiontext = at;
		
            // The corresponding part of the record for dropdowns should be objects, but check just in case.
            if (record.tasktype instanceof Object)
                record.tasktype = record.tasktype.text
            if (record.actionlanguage instanceof Object)
                record.actionlanguage = record.actionlanguage.text

	    var UTILS = require('../../client/utils/misc')
	    UTILS.ajaxPost('save', 'tasks', record, function(response) { 
                if ($.type(response) === 'string' && response.startsWith("LINTERROR:")) {
                  var checker = record.actionlanguage == 'php' ? " using 'php -l'" : (record.actionlanguage == 'perl' ? " using 'perl -cw'" : '')
                  w2confirm({ width: 600, height: 400, title: 'Confirmation', msg: 'Action Code failed syntax check' + checker + '. Do you wish to save anyways?<br><br>' + response.split('LINTERROR:')[1] })
                    .yes(function() {
                      var newrecord = record
                      newrecord.saveoptions = 'force'

		      UTILS.ajaxPost('save', 'tasks', newrecord, function(response) {
		        w2ui.tasktopgrid.records = response.records;
		        w2ui.tasktopgrid.refresh();
                      })
                    })
                    .no(function() {
                      // Could use javascript here to focus the action code text area (error highlight?)
                    })
                } else {
		  MESSAGES.tasksaved();
		  w2ui.tasktopgrid.records = response.records;
		  w2ui.tasktopgrid.refresh();
                }
	    })
          }
        }
      },
      onRender: function(event){
		event.onComplete = function(){
                taskdescr.setValue('');
                actiontext.setValue('');
		}
      },
      fields: [
        { name: 'recid', type: 'text', html: { caption: 'ID', attr: 'size="10" readonly' }},
        { name: 'actionfilename', type: 'text', required: false, html: { caption: 'File Name', attr: 'size="80" maxlength="80"' } },
        { name: 'actionlanguage',  type: 'list', required: false, options: { items: [ 'shell', 'perl', 'php', 'python', 'other' ] }, html: { caption: 'Prog. Language', attr: 'size="40" maxlength="40"' }},
        { name:'urlparams', type: 'text', required: false, html: { caption: 'URL Params', attr: 'size="80" maxlength="80"' } },
        //{ name: 'actiontext', type: 'textarea', required: false, html: { caption: 'Script', attr: 'rows="50" cols="150"' } },
        { name: 'taskname', type: 'text', required: false, html: { caption: 'Name', attr: 'size="40" maxlength="40"' }},
        //{ name: 'taskdescription', type: 'textarea', required: false, html: { caption: 'Description', attr: 'rows="50" cols="150"' }}
      ],
      records: [
      ]
    },
    init: function(){
      $().w2grid(this.tasktopgrid);
      $('#taskbottomform').w2form(this.taskbottomform);
    }
  };
});
