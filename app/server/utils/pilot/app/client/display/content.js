define(function (require) {
    var TaskAdmin = require('../admin/taskadmin');
    var AdminWizard = require('../admin/adminwizard');
    var SettingsAdmin = require('../admin/settingsadmin');
    var RunbookAdmin = require('../admin/runbookadmin');
    var UserAdmin = require('../admin/useradmin');
    var WorkFlowAdmin = require('../admin/workflowadmin');
    var GroupAdmin = require('../admin/groupadmin');
    var TaskReporting = require('../reporting/taskreporting');
    var WorkflowReporting = require('../reporting/workflowreporting');

        return {
            init: function(){
                TaskAdmin.init();
                AdminWizard.init();
                SettingsAdmin.init();
                RunbookAdmin.init();
                UserAdmin.init();
                WorkFlowAdmin.init();
                GroupAdmin.init();
                TaskReporting.init();
                WorkflowReporting.init();
            }
        };

});
