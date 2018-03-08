define(function (require) {
    return {
        getsum: function(inputArray, field) {
		var val = 0;

                for (var i = 0; i < inputArray.length; i++)
                {
                                val  += inputArray[i][field];
                }
                return val;

	},
	getpropvalue: function(searchstring, object){
		
		var searchparams = searchstring.split('.');
		var propval;
		for (i = 0; i < searchparams.length; i++) {
			var param  = searchparams[i];		
			var re = /\[(\d+)\]/;
			var arrayref = param.match(re);
			if (arrayref) {
				p = param.split('[');
				idx = parseInt(arrayref[1]);
				if (i === 0) {
				propval = object[p[0]][idx];				
					if (typeof propval !== 'object' && typeof propval !== 'undefined' && typeof propval !== 'symbol' && typeof propval !== 'function') {
						return propval;
						}
				
				} else {
					propval = propval[p[0]][idx];
					if (typeof propval !== 'object' && typeof propval !== 'undefined' && typeof propval !== 'symbol' && typeof propval !== 'function') {
						return propval;
						}
				}
			} else {
				if (i === 0) {
					propval = object[param];
					if (typeof propval !== 'object' && typeof propval !== 'undefined' && typeof propval !== 'symbol' && typeof propval !== 'function') {
						return propval;
						}
				} else {
					propval = propval[param];
					if (typeof propval !== 'object' && typeof propval !== 'undefined' && typeof propval !== 'symbol' && typeof propval !== 'function') {
						return propval;
						}
				}
			}
				
		}
	},
	getgridrecords: function(jprop,fields,object){

		var records = {};

		if (jprop) {
			records = object[jprop];
		} else {
			records = object;
		}
		
		var gridrecords = [];
		var count = 1;
		
		records.forEach(function(record){
			var row = {};
			row['recid'] = count;
			fields.forEach(function(field){
				if (record.hasOwnProperty(field)){
					row[field] = record[field];		
				}
			});					
			gridrecords.push(row);
			count = count + 1;
		});
		
		return gridrecords;
		
		
		
	},
	getgridtextrecords: function(fs, rs, fields, data){
		var records = [];
		var rows = data.split(rs);
		fieldlen = fields.length;

		rows.forEach(function(element){
			newrow = {};
			var vals = element.split(fs);

			for (i=0; i < fieldlen; i++) {
			newrow['recid'] = i + 1;
			var field = fields[i];
			newrow[field] = vals[i];
			}
			
			records.push(newrow);
		});
		return records;

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
	},
	getrbnamefromtaskid: function(taskid, callback){
                var url = 'app/server/main.php';
		var rbid = taskid.split('_')[0];

                postData = {
                                cmd: 'get',
                                table: 'runbooks',
                                params: {
                                        runbookid: rbid
                                }

                        };

                $.post(
                        url,
                        postData,
                        function(data){
                                callback(data);
                        }

                );

	},
	getusername: function(sessionid, callback){

                var url = 'app/server/main.php';

                postData = {
                                cmd: 'get',
                                table: 'users',
                                params: {
					fetchuser: 'true',
                                        sessionid: sessionid
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
