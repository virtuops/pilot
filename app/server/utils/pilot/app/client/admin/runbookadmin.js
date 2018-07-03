define(function (require) {
  var DATA = require('../admin/data');
  var MESSAGES = require('../../client/messages/messages');
  var UTILS = require('../../client/utils/misc');

  var refreshRunbookGrid = function(callback) {
    UTILS.ajaxPost('get', 'runbooks', '', function(response) {
      w2ui.runbooktopgrid.records = response.records
      w2ui.runbooktopgrid.refresh()

      if (callback) callback()
    })
  }

  return {
    runbooktopgrid: {
      name: 'runbooktopgrid',
      header: 'Runbook List',
      show: {
        header : true,
        toolbar : true,
        footer  : true,
        toolbarColumns: false
      },
      columns: [
        { field: 'recid', caption: 'RecID', size: '100px', sortable: true, hidden: true },
        { field: 'runbookid', caption: 'Runbook ID', size: '100px', sortable: true, hidden: false },
        { field: 'runbookname', caption: 'Runbook Name', size: '100px', sortable: true, hidden: false },
        { field: 'runbookdescription', caption: 'Description', size: '60%', sortable: true }
      ],
      toolbar: {
        items: [
          { type: 'break' },
          { type: 'button', id: 'remove', caption: 'Remove Runbook', icon: 'fa fa-trash' }
        ],
        onClick: function(event) {
          if (event.target == 'w2ui-reload') {
            refreshRunbookGrid(function() {
              $('#tb_runbooktopgrid_toolbar_item_w2ui-reload').w2tag(
                'Grid Reloaded...', { hideOnClick: true, position: 'top' })
            })
          } else if (event.target == 'remove') {
            w2confirm('Are you sure you wish to remove this runbook?')
            .yes(function() {
              // Send all the selected runbook ids in a list to the server.
              var recids = w2ui.runbooktopgrid.getSelection()
              var runbookids = recids.map(function(x) {
                return UTILS.getRecordFromRecid(x, w2ui.runbooktopgrid).runbookid
              })
              runbookids = "('" + runbookids.join("','") + "')"

              UTILS.ajaxPost('delete', 'runbooks', [ { runbookid: runbookids } ], function(response) {
                w2ui.runbooktopgrid.records = response.records
                w2ui.runbooktopgrid.refresh()
                w2ui.runbooktopgrid.selectNone()
                MESSAGES.runbookdeleted();
              })
            })
          }
        }
      },
      onRender: function(event) {
        event.onComplete = function() { refreshRunbookGrid() }
      },
      onClick: function(event) {
        var grid = this;
        event.onComplete = function () {
          var sel = this.getSelection();
          if (sel.length == 1) {
            w2ui.runbookbottomform.recid  = sel[0];
            w2ui.runbookbottomform.record = $.extend(true, {}, grid.get(sel[0]));
            w2ui.runbookbottomform.refresh();
            setTimeout(function() {
              var availGroupPostData = {
                cmd: 'get',
                table: 'group_runbooks',
                params: {
                  runbook: w2ui.runbookbottomform.record.runbookid,
                  lookingfor: 'available'
                }
              };
              var selGroupPostData = {
                cmd: 'get',
                table: 'group_runbooks',
                params: {
                  runbook: w2ui.runbookbottomform.record.runbookid,
                  lookingfor: 'selected'
                }
              };
              var availTaskPostData = {
                cmd: 'get',
                table: 'task_runbooks',
                params: {
                  runbook: w2ui.runbookbottomform.record.runbookid,
                  lookingfor: 'available'
                }
              };
              var selTaskPostData = {
                cmd: 'get',
                table: 'task_runbooks',
                params: {
                  runbook: w2ui.runbookbottomform.record.runbookid,
                  lookingfor: 'selected'
                }
              };

              //DATA.cruddata(w2ui.rbfavailablegroups, availGroupPostData);
              DATA.cruddata(availGroupPostData, function(data){
                w2ui.rbfavailablegroups.records = data.records;
                w2ui.rbfavailablegroups.refresh();
              });
              //DATA.cruddata(w2ui.rbfselectedgroups, selGroupPostData);
              DATA.cruddata(selGroupPostData, function(data){
                w2ui.rbfselectedgroups.records = data.records;
                w2ui.rbfselectedgroups.refresh();
              });
              //DATA.cruddata(w2ui.rbfavailabletasks, availTaskPostData);
              DATA.cruddata(availTaskPostData, function(data){
                w2ui.rbfavailabletasks.records = data.records;
                w2ui.rbfavailabletasks.refresh();
              });
              //DATA.cruddata(w2ui.rbfselectedtasks, selTaskPostData);
              DATA.cruddata(selTaskPostData, function(data){
                w2ui.rbfselectedtasks.records = data.records;
                w2ui.rbfselectedtasks.refresh();
              });
            }, 1000);
          } else {
            w2ui.runbookbottomform.clear();
          }
        }
      }
    },

    rbfavailablegroups: {
      name: 'rbfavailablegroups',
      header: 'Available Groups',
      records: [],
      msgNotJSON: 'Did not return JSON',
      show: { header: true },
      columns: [
        { field: 'recid', caption: 'ID', size: '80px', sortable: true, attr: 'align=center' },
        { field: 'groupid', caption: 'Group ID', size: '45%', sortable: true },
        { field: 'groupname', caption: 'Group Name', size: '45%', sortable: true }
      ],
      onClick: function (event) {
        var grid = this;
        setTimeout(function () {
          w2ui['rbfselectedgroups'].add( $.extend({}, grid.get(event.recid), { selected : false, recid: UTILS.getnextrecid(w2ui.rbfselectedgroups.records) }) );
          grid.selectNone();
          grid.remove(event.recid);
        }, 150);
      }
    },

    rbfselectedgroups: {
      name: 'rbfselectedgroups',
      header: 'Selected Groups',
      records: [],
      msgNotJSON: 'Did not return JSON',
      show: { header: true },
      columns: [
        { field: 'recid', caption: 'ID', size: '80px', sortable: true, attr: 'align=center' },
        { field: 'groupid', caption: 'Group ID', size: '45%', sortable: true },
        { field: 'groupname', caption: 'Group Name', size: '45%', sortable: true }
      ],
      onClick: function (event) {
        var grid = this;
        // need timer for nicer visual effect that record was selected
        setTimeout(function () {
          w2ui['rbfavailablegroups'].add( $.extend({}, grid.get(event.recid), { selected : false, recid: UTILS.getnextrecid(w2ui.rbfavailablegroups.records) }) );
          grid.selectNone();
          grid.remove(event.recid);
        }, 150);
      }
    },

    rbfavailabletasks: {
      name: 'rbfavailabletasks',
      header: 'Available Tasks',
      records: [],
      msgNotJSON: 'Did not return JSON',
      show: { header: true },
      columns: [
        { field: 'recid', caption: 'ID', size: '80px', sortable: true, attr: 'align=center' },
        { field: 'taskname', caption: 'Task Name', size: '70%', sortable: true }
      ],
      onClick: function (event) {
        var grid = this;
        // need timer for nicer visual effect that record was selected
        setTimeout(function () {
          w2ui['rbfselectedtasks'].add( $.extend({}, grid.get(event.recid), { selected : false, recid: UTILS.getnextrecid(w2ui.rbfselectedtasks.records) }) );
          grid.selectNone();
          grid.remove(event.recid);
        }, 150);
      }
    },

    rbfselectedtasks: {
      name: 'rbfselectedtasks',
      header: 'Selected Tasks',
      records: [],
      msgNotJSON: 'Did not return JSON',
      show: {
        header: true,
        lineNumbers: true
      },
      reorderRows: true,
      columns: [
        { field: 'recid', caption: 'ID', size: '80px', sortable: true, attr: 'align=center' },
        { field: 'taskorder', caption: 'Order', hidden: true, size: '80px', sortable: true, attr: 'align=center' },
        { field: 'taskname', caption: 'Task Name (to reorder, select the # column and drag task up or down)', size: '70%', sortable: true }
      ],
      sortData: [ { field: 'taskorder', direction: 'asc' } ],
      onClick: function (event) {
        var grid = this;
        // need timer for nicer visual effect that record was selected
        setTimeout(function () {
          w2ui['rbfavailabletasks'].add( $.extend({}, grid.get(event.recid), { selected : false, recid: UTILS.getnextrecid(w2ui.rbfavailabletasks.records) }) );
          grid.selectNone();
          grid.remove(event.recid);
        }, 150);
      }
    },

    runbookbottomform: {
      name: 'runbookbottomform',
      header: 'Runbook Config',
      url: 'app/server/main.php',
      method: 'POST',
      show: {
        header         : true,
        toolbar        : true,
        footer        : true
      },
      tabs: [
        { id: 'tab1', caption: 'Config' },
        { id: 'tab2', caption: 'Tasks'},
        { id: 'tab3', caption: 'Groups' }
      ],
      onRender: function(event){
        event.onComplete = function(){
          $('input#rbfrunbookid').on({
            keydown: function(e) {
              if (e.which === 32)
                return false;
            },
            change: function() {
              this.value = this.value.replace(/\s/g, "");
            }
          });
        }
      },
      onSubmit: function(event){
        setTimeout(function(){w2ui.runbooktopgrid.reload();},2000);
      },
      toolbar: {
        items: [
          { id: 'new', type: 'button', caption: 'New', icon: 'fa fa-file-text-o' },
          { id: 'clear', type: 'button', caption: 'Reset', icon: 'fa fa-file-o' },
          { id: 'save', type: 'button', caption: 'Save', icon: 'fa fa-floppy-o' }
        ],
        onClick: function (event) {
          if (event.target == 'clear') {
            w2ui.runbookbottomform.record.runbookid='<adduniqueid>';
            w2ui.runbookbottomform.record.runbookname='<Add a name>';
            w2ui.runbookbottomform.record.runbookdescription='<Add a description>';
            w2ui.rbfselectedtasks.records = [];
            w2ui.rbfselectedgroups.records = [];
            w2ui.rbfselectedtasks.refresh();
            w2ui.rbfselectedgroups.refresh();
          } else if (event.target == 'new') {
            w2ui.runbookbottomform.record.runbookid='<adduniqueid>';
            w2ui.runbookbottomform.record.runbookname='<Add a name>';
            w2ui.runbookbottomform.record.runbookdescription='<Add a description>';
            w2ui.rbfselectedtasks.records = [];
            w2ui.rbfselectedgroups.records = [];
            w2ui.rbfselectedtasks.refresh();
            w2ui.rbfselectedgroups.refresh();
            var taskPostData = {
              cmd: 'get',
              table:'tasks',
              params: {}
            }
            var groupPostData = {
              cmd: 'get',
              table:'groups',
              params: {}
            }
            DATA.cruddata(taskPostData, function(data){
              w2ui.rbfavailabletasks.records = data.records;
              w2ui.rbfavailabletasks.refresh();
            });
            DATA.cruddata(groupPostData, function(data){
              w2ui.rbfavailablegroups.records = data.records;
              w2ui.rbfavailablegroups.refresh();
            });
            w2ui.runbookbottomform.refresh();
          } else if (event.target == 'save') {
            if (w2ui.runbookbottomform.record.runbookid === '<adduniqueid>' || w2ui.runbookbottomform.record.runbookname === '<Add a name>') {
              MESSAGES.rbfnameiderror();
            } else if (w2ui.rbfselectedgroups.records.length === 0 || w2ui.rbfselectedtasks.records.length === 0) {
              MESSAGES.rbftaskgrouperror();

            } else {
              var runbookPostData= {
                cmd: 'save',
                table:'runbooks',
                params: w2ui.runbookbottomform.record
              }

              //DATA.cruddata(w2ui.runbooktopgrid, runbookPostData);
              DATA.cruddata(runbookPostData, function(data){
                //w2ui.runbooktopgrid.records = data.records;
                //w2ui.runbooktopgrid.refresh();
              });

              setTimeout(function(){
                w2ui.runbooktopgrid.reload();
              },1000);

              selGroupPostData = {
                cmd: 'save',
                table: 'group_runbooks',
                params: {
                  runbook: w2ui.runbookbottomform.record.runbookid,
                  groups: w2ui.rbfselectedgroups.records
                }
              };
              //DATA.cruddata(w2ui.rbfselectedgroups,selGroupPostData);
              DATA.cruddata(selGroupPostData, function(data){
                //w2ui.rbfselectedgroups.records = data.records;
                w2ui.rbfselectedgroups.refresh();
              });


              selTaskPostData = {
                cmd: 'save',
                table: 'task_runbooks',
                params: {
                  runbook: w2ui.runbookbottomform.record.runbookid,
                  tasks: w2ui.rbfselectedtasks.records
                }
              };
              DATA.cruddata(selTaskPostData, function(data){
                //w2ui.rbfselectedtasks.records = data.records;
                //w2ui.rbfselectedtasks.refresh();
              });

              MESSAGES.runbooksaved();
              refreshRunbookGrid()
            }
          }
        }
      },
      fields: [
        { name: 'recid', type: 'text', html: { caption: 'ID', attr: 'size="10" readonly' }},
        { name: 'runbookid', type: 'text', required: true, html: { caption: 'Runbook ID', attr: 'size="40" maxlength="40"' }},
        { name: 'runbookname', type: 'text', required: true, html: { caption: 'Runbook Name', attr: 'size="40" maxlength="40"' }},
        {name: 'runbookdescription', disabled: false, type: 'textarea', required: false, html: { caption: 'Description', attr: 'rows="10" cols="150"' }}
      ]
    },
    init: function(){
      $().w2grid(this.runbooktopgrid);

      $('#runbookbottomform').w2form(this.runbookbottomform);
      $('#rbfavailablegroups').w2grid(this.rbfavailablegroups);
      $('#rbfselectedgroups').w2grid(this.rbfselectedgroups);
      $('#rbfavailabletasks').w2grid(this.rbfavailabletasks);
      $('#rbfselectedtasks').w2grid(this.rbfselectedtasks);
    }
  };
});

