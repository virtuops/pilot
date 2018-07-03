define(function (require) {
  var DATA = require('../admin/data');
  var MESSAGES = require('../../client/messages/messages');
  var UTILS = require('../../client/utils/misc');

  var refreshGroupGrid = function() {
    UTILS.ajaxPost('get', 'groups', '', function(response) {
      w2ui.grouptopgrid.records = response.records
      w2ui.grouptopgrid.refresh()
    })
  }

  return {
    grouptopgrid: {
      name: 'grouptopgrid',
      header: 'Group List',
      show: { 
        header: true, 
        toolbar: true, 
        footer: true,
        toolbarColumns: false
      },
      columns: [
        { field: 'recid', caption: 'RecID', size: '140px', hidden: true, sortable: true },
        { field: 'groupid', caption: 'Group ID', size: '25%', sortable: true, hidden: false },
        { field: 'groupname', caption: 'Group Name', size: '25%', sortable: true, hidden: false }
      ],
      toolbar: {
        items: [
          { type: 'break' },
          { type: 'button', id: 'remove', disabled: true, caption: 'Remove Group', icon: 'fa fa-trash' }
        ],
        onClick: function(event) {
          if (event.target == 'w2ui-reload') {
            refreshGroupGrid(function() {
              $('#tb_grouptopgrid_toolbar_item_w2ui-reload').w2tag(
                'Grid Reloaded...', { hideOnClick: true, position: 'top' })
            })
          } else if (event.target == 'remove') {
            w2confirm('Are you sure you wish to remove this group?')
            .yes(function() {
              var UTILS = require('../../client/utils/misc')
              var recids = w2ui.grouptopgrid.getSelection()
              var groupids = recids.map(function(x) { 
                return UTILS.getRecordFromRecid(x, w2ui.grouptopgrid).groupid
              })
              groupids = "('" + groupids.join("','") + "')"
      
              UTILS.ajaxPost('delete', 'groups', [ { groupid: groupids } ], function(response) { 
                w2ui.grouptopgrid.records = response.records
                w2ui.grouptopgrid.refresh()
                w2ui.grouptopgrid.selectNone()
		MESSAGES.groupdeleted();
              })
            })
          }
        }
      },
      onRender: function(event) {
        event.onComplete = function() { refreshGroupGrid() }
      },
      onSelect: function(event) {
        // Only enable the remove button if a group is selected.
        this.toolbar.enable('remove')

        // Code from onClick()
        var grid = this;
          event.onComplete = function () {
          var sel = this.getSelection();
            if (sel.length == 1) {
            w2ui.groupbottomform.recid  = sel[0];
            w2ui.groupbottomform.record = $.extend(true, {}, grid.get(sel[0]));
            
            var getPerms = {
              cmd: 'get_perms',
              table: 'groups',
              params: {
                groupid: w2ui.groupbottomform.record.groupid
              }
            };
            DATA.cruddata(getPerms, function(data) {
              data.records.forEach(function(perm) {
                var checked;
                if (perm.value === '0' || perm.value === 0) {
                  checked = false;	
                } else {
                  checked = true;
                }
                w2ui.groupbottomform.record[perm.permission] = checked;
              });
              w2ui.groupbottomform.refresh();
            });
            
            //give the form enough time to fill in
            setTimeout(function() {
              var availPostData = {
                cmd: 'get',
                table: 'user_groups',
                params: {
                  group: w2ui.groupbottomform.record.groupid,
                  lookingfor: 'available'
                }
              };
              var selPostData = {
                cmd: 'get',
                table: 'user_groups',
                params: {
                  group: w2ui.groupbottomform.record.groupid,
                  lookingfor: 'selected'
                }
              };
              //DATA.cruddata(w2ui.gbfavailablemembers, availPostData);
              DATA.cruddata(availPostData, function(data){
                w2ui.gbfavailablemembers.records = data.records;
                w2ui.gbfavailablemembers.refresh();
              });
              //DATA.cruddata(w2ui.gbfselectedmembers, selPostData);
              DATA.cruddata(selPostData, function(data){
                w2ui.gbfselectedmembers.records = data.records;
                w2ui.gbfselectedmembers.refresh();
              });
            }, 1000);
          } else {
            w2ui.groupbottomform.clear();
          }
        }
      },
      onUnselect: function(event) {
        // The item still appears in getSelection so check if it's the only one there before disabling the remove button.
        var sel = this.getSelection()
        if (!sel || sel.length == 0
            || (sel.length == 1 && sel[0] == event.recid))
          this.toolbar.disable('remove')
        else
          this.toolbar.enable('remove')
      },
    },
    gbfavailablemembers: {
      name: 'gbfavailablemembers',
      header: 'Available',
      records: [],
      msgNotJSON: 'Did not return JSON',
      show: { header: true },
      columns: [                
        { field: 'recid', caption: 'ID', size: '80px', sortable: true, attr: 'align=center' },
        { field: 'username', caption: 'User Name', size: '70%', sortable: true }
      ],
      onClick: function (event) {
        var grid = this;
        // need timer for nicer visual effect that record was selected
        setTimeout(function () {
          w2ui['gbfselectedmembers'].add( $.extend({}, grid.get(event.recid), { selected : false, recid: UTILS.getnextrecid(w2ui.gbfselectedmembers.records) }) );
          grid.selectNone();
          grid.remove(event.recid);
        }, 150);
      }
    },
    gbfselectedmembers: {
      name: 'gbfselectedmembers',
      header: 'Selected',
      records: [],
      msgNotJSON: 'Did not return JSON',
      show: { header: true },
      columns: [                
        { field: 'recid', caption: 'ID', size: '80px', sortable: true, attr: 'align=center' },
        { field: 'username', caption: 'User Name', size: '70%', sortable: true }
      ],
      onClick: function (event) {
        var grid = this;
        // need timer for nicer visual effect that record was selected
        setTimeout(function () {
          w2ui['gbfavailablemembers'].add( $.extend({}, grid.get(event.recid), { selected : false, recid: UTILS.getnextrecid(w2ui.gbfavailablemembers.records) }) );
          grid.selectNone();
          grid.remove(event.recid);
        }, 150);
      }
    },
    groupbottomform: {
      name: 'groupbottomform',
      header: 'Group Config',
      url: 'app/server/main.php',
      method: 'POST',
      show: {
        header: true,
        toolbar: true,
        footer: true
      },
      toolbar: {
        items: [
          { id: 'new', type: 'button', caption: 'New', icon: 'fa fa-file-text-o' },
          { id: 'clear', type: 'button', caption: 'Reset', icon: 'fa fa-file-o' },
          { id: 'save', type: 'button', caption: 'Save', icon: 'fa fa-floppy-o' }
        ],
        onClick: function (event) {
          if (event.target == 'clear') {
            w2ui.groupbottomform.record.groupid='<adduniqueid>';
            w2ui.groupbottomform.record.groupname='<Add a name>';
            w2ui.gbfselectedmembers.records = [];
            w2ui.gbfselectedmembers.refresh();
            w2ui.groupbottomform.refresh();
          }
          if (event.target == 'new') {
            w2ui.groupbottomform.record.groupid='<adduniqueid>';
            w2ui.groupbottomform.record.groupname='<Add a name>';
            w2ui.gbfselectedmembers.records = [];
            w2ui.gbfselectedmembers.refresh();
            var groupPostData= {
              cmd: 'get',
              table:'users'
            }
            DATA.cruddata(groupPostData, function(data){
              w2ui.gbfavailablemembers.records = data.records;
              w2ui.gbfavailablemembers.refresh();
            });
            w2ui.groupbottomform.refresh();
          }
          if (event.target == 'save') { 
            if (w2ui.gbfselectedmembers.records.length === 0) {
              MESSAGES.nomembersselected();
            } else if (w2ui.groupbottomform.record.groupid === '<adduniqueid>' || w2ui.groupbottomform.record.groupname === '<Add a name>') {
              MESSAGES.groupidnameerror();
            } else {
              var groupPostData= {
                cmd: 'save',
                table:'groups',
                params: w2ui.groupbottomform.record
              }

              DATA.cruddata(groupPostData, function(data) {
                w2ui.grouptopgrid.records = data.records;
                w2ui.grouptopgrid.reload();	
              });
        
              selPostData = {
                cmd: 'save',
                table: 'user_groups',
                params: {
                  group: w2ui.groupbottomform.record.groupid,
                  users: w2ui.gbfselectedmembers.records
                }
              };
              //DATA.cruddata(w2ui.gbfselectedmembers,selPostData);
              DATA.cruddata(selPostData, function(data){ 
                w2ui.gbfselectedmembers.reload();
		MESSAGES.groupsaved();
              });
            }
          }
        }
      },
      fields: [
        { name: 'recid', type: 'text', html: { caption: 'Record ID', attr: 'size="10" readonly' }},
        { name: 'groupid', type: 'text', required: true, html: { caption: 'Group ID', attr: 'size="80" maxlength="80"' } },
        { name: 'groupname', type: 'text', required: true, html: { caption: 'Group Name', attr: 'size="80" maxlength="80"' } }
      ]
    },
    init: function() {
      $().w2grid(this.grouptopgrid);
      $('#groupbottomform').w2form(this.groupbottomform);
      $('#gbfavailablemembers').w2grid(this.gbfavailablemembers);
      $('#gbfselectedmembers').w2grid(this.gbfselectedmembers);
    }
  };
});
