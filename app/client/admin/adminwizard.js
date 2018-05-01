define(function (require) {
        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');
    return {
        adminwizard: {
                name: 'adminwizard',
                header: 'Admin Wizard',
                url: 'app/server/main.php',
                postData: '',
                show: {
                    header         : true,
                    toolbar     : true,
                    footer        : true
                },
                toolbar: {
                        items: [
                                { id: 'clear', type: 'button', caption: 'Reset', img: 'reseticon' },
                                { id: 'submit', type: 'button', caption: 'Submit', img: 'clouduploadicon' }
                        ],
                        onClick: function (event) {
                                if (event.target == 'clear') w2ui.adminwizard.clear();
                                if (event.target == 'submit') {
                                        var actionpackage = w2ui.adminwizard.record.actionpackage ? w2ui.adminwizard.record.actionpackage : [];
                                        var textfilename = w2ui.adminwizard.record.textfilename ? w2ui.adminwizard.record.textfilename : [];
                                        apparam = {actionpackage: actionpackage};
                                        textfileparam = {textfilename: textfilename};

                                        if (actionpackage.length > 0) {
                                                postData = {
                                                        cmd: 'uploadaction',
                                                        table: 'actionpackage',
                                                        params: apparam
                                                }
                                                w2ui.adminwizard.save(postData, function(data){
                                                        if (data.status == 'success') {
                                                                MESSAGES.fileuploadsucceeded();
                                                        } else {
                                                                MESSAGES.fileuploadfailed();
                                                        }
                                                });
                                        }


                                        if (textfilename.length > 0) {
                                                postData = {
                                                        cmd: 'uploadtextfile',
                                                        table: 'textfile',
                                                        params: textfileparam
                                                }
                                                w2ui.adminwizard.save(postData, function(data){
                                                        if (data.status == 'success') {
                                                                MESSAGES.fileuploadsucceeded();
                                                        } else {
                                                                MESSAGES.fileuploadfailed();
                                                        }
                                                });
                                        }


                                }
                        }
                },
                fields: [
                  { name: 'actionpackage', type: 'file', options:{hint:"Click to add zip packages"}, required: false },
                  { name: 'textfilename', type: 'file', options:{hint:"Click to add files"}, required: false }
                ],
                formHTML: '<div>' +
                '  <div style="padding:3px;font-weight:bold;color:#777">Admin Wizard</div>' +
                '    <div class="w2ui-group" style="height:400px">' +
                '      <div class="instructions2"><p>To add a new action/task library, drag and drop a zip package here.  The package must contain a perl script for the action code, a JSON file with parameters, and a description.txt file.  Go to <webroot_pilot>/tmp/files and take a look at the directory structure to get an idea of how these are built.  Once you drag a zip file into the input area below,  hit submit in the top left of the tool bar.  This will automatically create a new action and task with all configurations loaded.<br><br>If you do not have a prerequisite loaded on your machine, it will prompt you to load that prerequisite.  We recommend you run <webroot_pilot>/install/loadmodules.sh if you are missing pre-requisites.</p></div>' +
                '      <div class="w2ui-field">' +
                '        <label>Task/Action Package: </label>' +
                '        <div><input name="actionpackage" type="text" maxlength="300" size="90"/></div>' +
                '      </div>' +
                '      <div class="instructions2"><p>If you want to use a file in a task or workflow, you can use the field below for easy upload.  It will automatically put the file in the tmp/files directory of your nochero implementation.  It will be saved with the correct owner and permissions.</p></div>' +
                '      <div class="w2ui-field">' +
                '        <label>File: </label>' +
                '        <div><input name="textfilename" type="text" maxlength="300" size="90"/></div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>',
        },
        init: function(){
                $().w2form(this.adminwizard);
        }
    };
});

