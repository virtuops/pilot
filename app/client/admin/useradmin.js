define(function (require) {
  var MESSAGES = require('../../client/messages/messages');
  var UTILS = require('../../client/utils/misc');
  var DATA = require('../admin/data.js');
  
  var disablePassword = function(isLDAP) {
    newpass = document.getElementById('newpassword')
    confirmpass = document.getElementById('confirmpassword')
  
    newpass.disabled = isLDAP
    confirmpass.disabled = isLDAP
  
    if (isLDAP) {
      newpass.value = ''
      confirmpass.value = ''
      w2ui.userbottomform.record.password = ''
    }
  }
  
  var authMethod_change = function(control) {
    var isLDAP = control.value == 'LDAP'
    disablePassword(isLDAP)
  }

  var refreshUserGrid = function(callback) {
    UTILS.ajaxPost('get', 'users', '', function(response) {
      w2ui.usertopgrid.records = response.records
      w2ui.usertopgrid.refresh()

      if (callback) callback()
    })
  }

  return {
    usertopgrid: {
      name: 'usertopgrid',
      header: 'User List',
      show: {
        header : true,
        toolbar : true,
        footer  : true,
        toolbarColumns: false
      },
      columns: [
        { field: 'recid', caption: 'RecID', size: '140px', hidden: true, sortable: true },
        { field: 'username', caption: 'User Name', size: '25%', sortable: true, hidden: false },
        { field: 'firstname', caption: 'First Name', size: '15%', sortable: true, hidden: false },
        { field: 'lastname', caption: 'Last Name', size: '15%', sortable: true, hidden: false },
        { field: 'authmethod', caption: 'Auth Method', size: '15%', sortable: true, hidden: false },
        { field: 'password', caption: 'Password', size: '15%', render: 'password', sortable: true, hidden: false },
        { field: 'email', caption: 'Email', size: '25%', sortable: true, hidden: false },
      ],
      toolbar: {
        items: [
          { type: 'break' },
          { type: 'button', id: 'remove', caption: 'Remove User', icon: 'fa fa-trash' }
        ],
        onClick: function(event) {
          if (event.target == 'w2ui-reload') {
            refreshUserGrid(function() {
              $('#tb_usertopgrid_toolbar_item_w2ui-reload').w2tag(
                'Grid Reloaded...', { hideOnClick: true, position: 'top' })
            })
          } else if (event.target == 'remove') {
            w2confirm('Are you sure you wish to remove this user?')
            .yes(function() {
              // Send all the selected user ids in a list to the server.
              var recids = w2ui.usertopgrid.getSelection()

              // Check for admin user.
              for (var i = 0; i < recids.length; i++)
	        if (UTILS.getRecordFromRecid(recids[i], w2ui.usertopgrid).username === 'admin') {
		  MESSAGES.noadmindelete()
                  return
                }

              var usernames = recids.map(function(x) { 
                return UTILS.getRecordFromRecid(x, w2ui.usertopgrid).username
              })
              usernames = "('" + usernames.join("','") + "')"
      
              UTILS.ajaxPost('delete', 'users', [ { username: usernames } ], function(response) { 
                w2ui.usertopgrid.records = response.records
                w2ui.usertopgrid.refresh()
                w2ui.usertopgrid.selectNone()
              })
            })
          }
        }
      },
      onRender: function(event) {
        event.onComplete = function() { refreshUserGrid() }
      },
      onClick: function(event) {
        var grid = this;
        event.onComplete = function () {
          var sel = this.getSelection();
          if (sel.length == 1) {
            w2ui.userbottomform.recid  = sel[0];
            w2ui.userbottomform.record = $.extend(true, {}, grid.get(sel[0]));
            w2ui.userbottomform.refresh();
      
            var isLDAP = document.getElementById('authmethod').value == 'LDAP'
            disablePassword(isLDAP)
          } else {
            w2ui.userbottomform.clear();
          }
        }
      }
    },
    userbottomform: {
      name: 'userbottomform',
      header: 'User Config',
      url: 'app/server/main.php',
      method: 'POST',
      show: {
        header: true,
        toolbar: true,
        footer: true
      },
      onSave: function(event){
        if (event.status === 'success') {
          refreshUserGrid()
        }
      },
      toolbar: {
        items: [
          { id: 'clear', type: 'button', caption: 'Reset', icon: 'fa fa-file-o' },
          { id: 'save', type: 'button', caption: 'Save', icon: 'fa fa-floppy-o' }
        ],
        onClick: function (event) {
          if (event.target == 'clear') w2ui.userbottomform.clear();
          if (event.target == 'save') { 
		  var npw = w2ui.userbottomform.record.newpassword ? w2ui.userbottomform.record.newpassword : '';
		  var cpw = w2ui.userbottomform.record.confirmpassword ? w2ui.userbottomform.record.confirmpassword : '';
		  var isLDAP = document.getElementById('authmethod').value == 'LDAP'
		
		  if (!isLDAP && npw !== cpw) {
			MESSAGES.passwordmismatch();
		  } else {
		  UTILS.ajaxPost('save', 'users', w2ui.userbottomform.record, function(response) {
				MESSAGES.usersaved();
		  })
		  }
                }
          }
      },
      fields: [
        { name: 'recid', type: 'text' },
        { name: 'username', type: 'text', required: true },
        { name: 'firstname', type: 'text', required: true },
        { name: 'lastname', type: 'text', required: true },
        { name: 'authmethod', type: 'list', options: { items: ['Local', 'LDAP'] }, required: true },
        { name: 'email', type: 'text', required: false },
        { name: 'locked', type: 'checkbox', required: false },
        { name: 'newpassword', type: 'password', required: false },
        { name: 'confirmpassword', type: 'password', required: false },
      ],
      records: [
      ],
      formHTML: '<div>' +
      '  <div style="padding:3px;font-weight:bold;color:#777">User Details</div>' +
      '    <div class="w2ui-group" style="height:240px">' +
      '      <div class="w2ui-field">' +
      '        <label>Record ID: </label>' +
      '        <div><input name="recid" type="text" readonly maxlength="10"></div>' +
      '      </div>' +
      '      <div class="w2ui-field">' +
      '        <label>Username: </label>' +
      '        <div><input name="username" type="text" width="200px" maxlength="80"></div>' +
      '      </div>' +
      '      <div class="w2ui-field">' +
      '        <label>First Name: </label>' +
      '        <div><input name="firstname" type="text" width="200px" maxlength="80"></div>' +
      '      </div>' +
      '      <div class="w2ui-field">' +
      '        <label>Last Name: </label>' +
      '        <div><input name="lastname" type="text" width="200px" maxlenggth="80"></div>' +
      '      </div>' +
      '      <div class="w2ui-field">' +
      '        <label>Auth Method: </label>' +
      '        <div><input name="authmethod" type="list" width="200px" onchange="authMethod_change(this)"></div>' +
      '      </div>' +
      '      <div class="w2ui-field">' +
      '        <label>Email Address: </label>' +
      '        <div><input name="email" type="text" width="200px" maxlength="80"></div>' +
      '      </div>' +
      '      <div class="w2ui-field">' +
      '        <label>Deactivated: </label>' +
      '        <div><input name="locked" type="checkbox"></div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div style="padding:3px;font-weight:bold;color:#777">Change Password</div>' +
      '    <div class="w2ui-group" style="height:90px">' +
      '      <div class="w2ui-field">' +
      '        <label>New Password: </label>' +
      '        <div><input name="newpassword" type="password" width="200px"></div>' +
      '      </div>' +
      '      <div class="w2ui-field">' +
      '        <label>Confirm Password: </label>' +
      '        <div><input name="confirmpassword" type="password" width="200px"></div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
      },
    init: function(){
      $().w2grid(this.usertopgrid);
      $().w2form(this.userbottomform);
    }
  };
});
