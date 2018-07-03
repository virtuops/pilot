define(function (require) {
    return {
	getresults: function(cmd, params, callback){

		var url = 'app/server/main.php';
	
		postData = {
				cmd: cmd,
				table: 'reports',
				params: params
			};
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
