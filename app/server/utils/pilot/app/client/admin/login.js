define(function (require) {
    return {
	//we want to not only validate the session, but we want group and runbook details here as well.
	getuserdata: function(sessionid, callback){
		var url = 'app/server/main.php';
		postData = {
				cmd: 'get',
				table: 'users',
				params: {
					getdetails: 'yes',
					sessionid: sessionid
				}
			}
		
		$.post(
			url,
			postData,
			function(data){
				callback(data);		
			}

		);

	},

	getsessionid: function(cookiename) {

	    var name = cookiename + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
		    c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		    return c.substring(name.length, c.length);
		}
	    }
	    return "";
			
	}
    };
});
