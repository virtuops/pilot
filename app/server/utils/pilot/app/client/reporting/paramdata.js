define(function (require) {
    return {
	getparams: function(paramtype, callback){

		var url = 'app/server/main.php';
	
		postData = {
				cmd: 'get',
				table: 'reporting_params',
				params: {
					paramtype: paramtype
				}
				
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
