define(function (require) {
    var MESSAGES = require('../../client/messages/messages');
    return {
        settingsbottomform: {
                name: 'settingsbottomform',
                header: 'Global Settings',
                url: 'app/server/main.php',
                postData: {
                        table: 'settings',
                        params: ''
                },
                method: 'POST',
                show: {
                    header         : true,
                    toolbar     : true,
                    footer        : true
                },
                toolbar: {
                        items: [
                                { id: 'clear', type: 'button', caption: 'Reset', icon: 'fa fa-file-o' },
                                { id: 'save', type: 'button', caption: 'Save', icon: 'fa fa-floppy-o' }
                        ],
                        onClick: function (event) {
                                if (event.target == 'clear') w2ui.settingsbottomform.clear();
                                if (event.target == 'save') {
                                        postData = {
                                                table: 'settings',
                                                params: w2ui.settingsbottomform.record
                                        };
                                        w2ui.settingsbottomform.save(postData, function(data){
                                                if (data.status == 'success') {
                                                MESSAGES.settingssaved();
                                                } else {
                                                MESSAGES.settingsnotsaved(data.message);
                                                }
                                        });
                                }

                        }

                },
                fields: [
                  { name: 'dbname', type: 'text', required: true },
                  { name: 'dbhost', type: 'text', required: true },
                  { name: 'dbport', type: 'text', required: true },
                  { name: 'dbuser', type: 'text', required: true },
                  { name: 'basedir', type: 'text', required: true },
                  { name: 'unzip', type: 'text', required: true },
                  { name: 'curl', type: 'text', required: true },
                  { name: 'php', type: 'text', required: true },
                  { name: 'weburl', type: 'text', required: true },
                  { name: 'perldoc', type: 'text', required: true },
                  { name: 'dbpass', type: 'password', required: true },
                  { name: 'ldaphost', type: 'text', required: false },
                  { name: 'ldapport', type: 'text', required: false },
                  { name: 'ldapou', type: 'text', required: false },
                ],
                formHTML: '<div>' +
                '  <div style="padding:3px;font-weight:bold;color:#777">Database Server</div>' +
                '    <div class="w2ui-group" style="height:180px">' +
                '      <div class="w2ui-field">' +
                '        <label>DB Name: </label>' +
                '        <div><input name="dbname" type="text" maxlength="40"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>DB Host: </label>' +
                '        <div><input name="dbhost" type="text" maxlength="40"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>DB Port: </label>' +
                '        <div><input name="dbport" type="text" maxlength="40"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>DB User: </label>' +
                '        <div><input name="dbuser" type="text" maxlength="40"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>DB Pass: </label>' +
                '        <div><input name="dbpass" type="password" maxlength="40"></div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '  <div style="padding:3px;font-weight:bold;color:#777">LDAP Server</div>' +
                '    <div class="w2ui-group" style="height:120px">' +
                '      <div class="w2ui-field">' +
                '        <label>Host: </label>' +
                '        <div><input name="ldaphost" type="text" maxlength="64"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>Port: </label>' +
                '        <div><input name="ldapport" type="text" maxlength="10"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>Organization: </label>' +
                '        <div><input name="ldapou" type="text" maxlength="64"></div>' +
                '      </div>' +
                '    </div>' +
                '  <div style="padding:3px;font-weight:bold;color:#777">Environment</div>' +
                '    <div class="w2ui-group" style="height:210px">' +
                '      <div class="w2ui-field">' +
                '        <label>Base Dir: </label>' +
                '        <div><input name="basedir" type="text" maxlength="1024"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>PHP Location: </label>' +
                '        <div><input name="php" type="text" maxlength="1024"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>Web URL: </label>' +
                '        <div><input name="weburl" type="text" maxlength="1024"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>Unzip Location: </label>' +
                '        <div><input name="unzip" type="text" maxlength="1024"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>cURL Location: </label>' +
                '        <div><input name="curl" type="text" maxlength="1024"></div>' +
                '      </div>' +
                '      <div class="w2ui-field">' +
                '        <label>Perldoc Location: </label>' +
                '        <div><input name="perldoc" type="text" maxlength="1024"></div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>',
        },
        readdata: function(){
                var setdata = this.setdata;
                $.post( "app/server/main.php",
                        { cmd: "get", table: "settings", params: "" },
                        function(data){
                                setdata(data);
                });

        },
        setdata: function(data){
                w2ui.settingsbottomform.record = data;
                w2ui.settingsbottomform.refresh();
        },
        init: function(){
                $().w2form(this.settingsbottomform);
                this.readdata();
        }
    };
});

