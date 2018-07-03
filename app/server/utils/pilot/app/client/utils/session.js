define(function (require) {
	require('../utils/math');
	var UTILS = require('../utils/misc');
    return {
	validate: function(){
		//first check if there is a session id
		//second, check if the id matches the db id

		var sid = UTILS.getsessionid('PHPSESSID');
		if (sid.length < 1) {
			window.location = "logout.php";
		} else {
			params = {
					action: 'get',
					table: 'users',
					params: {
						sessionid: sid,
						fetchuser: 'true'
					}
				}
			UTILS.validatesession(params, function(data){
				if (data.records.length === 0) {
					window.location = "logout.php";
				}
			});
		}
        },
	init: function(){
		setInterval(this.validate, 5000);
	}
	
    };
});
