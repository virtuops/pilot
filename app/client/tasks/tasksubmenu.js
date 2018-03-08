define(function (require) {
    var TASKCODE = require('../tasks/taskcode');
    var DATA = require('../../client/admin/data');
    require('../../client/utils/misc');

    return {
        addsubmenutasks: function(runbooknodes){

		var count = 1;
		numrunbooknodes = runbooknodes.length;
		runbooknodes.forEach(function(element) {
			
			var params = {
					cmd: 'get',
					table: 'task_runbooks',
					params:  {
						lookingfor: 'selected',
						runbook: element.id
					}
			};
		
			DATA.cruddata(params, function(results){
				//var numresults = results.records.length;

				results.records.forEach(function(task){
				var menuid = element.id+'_'+task.recid;
				w2ui.sidebar.add(element.id, {id: menuid, text: task.taskname});
				TASKCODE.buildtask(menuid, task.taskname, element.id);
				});
			});	

			if (count < numrunbooknodes) {
			count = count+1;
			} else {
			TASKCODE.setclick();
			}
		
		});

	}
    };
});
