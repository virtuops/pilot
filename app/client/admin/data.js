define(function (require) {
    return {
	cruddata: function(params, callback){
		var url = 'app/server/main.php';
		var cmd = params.cmd;
		var table = params.table;
		var prms = params.params;

		postData = {
				cmd: cmd,
				table: table,
				params: prms
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
