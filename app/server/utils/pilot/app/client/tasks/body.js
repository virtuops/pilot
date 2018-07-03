define(function (require) {
    return {
	getbody: function(taskname, callback){
		var url = 'app/server/main.php';

		postData = {
				cmd: 'get',
				table: 'tasks',
				params: {taskname: taskname}
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
