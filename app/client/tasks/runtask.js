define(function (require) {
    return {
	getresults: function(filetorun, params, taskdata, callback){

		var url = 'app/server/actiontext/run_task.php'

		postData = {
				params: params,
				taskdata: taskdata
			}

		$.post(
			url,
			postData,
			function(data){
				callback(data);
			}

		);


	}
    };
});
