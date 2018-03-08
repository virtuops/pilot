define(function (require) {
        require('../utils/math');
    return {
        ajaxPost: function(cmd, table, params, callback) {
          var url = 'app/server/main.php';
          postData = { table: table, params: params, cmd: cmd };

          $.ajax({ type: 'POST', url: url, data: postData })
            .done(function(data) {
              callback(data)
            })
            .fail(function(err) {
            })
        },

        getRecordFromRecid: function(recid, grid) {
          if (!recid || recid == 0) {
            return null;
          }

          for (i = 0; i < grid.records.length; i++) {
            record = grid.records[i];
            if (record.recid == recid)
              return record;
          }

          return null;
        },
        getnextrecid: function(records){
                var currecord = 0;
                for (i = 0; i < records.length; i++) {
                        if (currecord < records[i].recid) {
                                currecord = records[i].recid;
                        }
                        if (i === records.length - 1) {
                                newrecid = currecord + 1;
                                return newrecid;
                        }
                }

        },
        getmonthbeginend: function(month){
                var days = [];
                var date = new Date();
                var first;
                var last;
                var formatfirst;
                var formatlast;

                if (month == 'thismonth') {
                first = new Date(date.getFullYear(), date.getMonth(), 1);
                last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                }
                if (month == 'lastmonth') {
                var first = new Date(date.getFullYear(), (date.getMonth() - 1 + 12) % 12, 1);
                var last = new Date(date.getFullYear(), date.getMonth(), 0);
                }

                formatfirst = new Date(first).toISOString().slice(0, 19).replace('T', ' ');
                first = formatfirst.split(' ')[0];
                formatlast = new Date(last).toISOString().slice(0, 19).replace('T', ' ');
                last = formatlast.split(' ')[0];

                days.push(first, last);
                return days;
        },
        getunique: function(inputArray) {
                var outputArray = [];
                for (var i = 0; i < inputArray.length; i++)
                {
                        if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
                        {
                                outputArray.push(inputArray[i]);
                        }
                }
                return outputArray;

        },
        getuniqueproblems: function(inputArray) {
                var flags = {};
                var outputArray = [];
                var serialsArray = [];

                for (i=0; i < inputArray.length; i++ ) {
                        if (!flags[inputArray[i].problemserial]) {
                                flags[inputArray[i].problemserial] = true;
                                outputArray.push(inputArray[i]);
                        }

                }

                return outputArray;
        },
        getuniqueprobmenu: function(inputArray) {
                var flags = {};
                var outputArray = [];
                var serialsArray = [];

                for (i=0; i < inputArray.length; i++ ) {
                        if (!flags[inputArray[i].id]) {
                                flags[inputArray[i].id] = true;
                                outputArray.push(inputArray[i]);
                        }

                }

                return outputArray;
        },
        checkuserexists: function(username, userrecords) {
                var usercheck = username;
                var currentusers = userrecords;
                for(var i = 0; i < currentusers.length; i++) {
                        if (currentusers[i].username == usercheck) {
                        return "exists";
                        }
                }
                return "user does not exist";
        },
        gettaskserial: function() {
                var taskserial = "";
                var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var text = '';

                for( var i=0; i < 15; i++ ) {
                text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
                }
                var serialtime = (new Date).getTime();
                taskserial = text + '' + serialtime;
                return taskserial;
        },
        getpropvalue: function(searchstring, object){
                var propval;
                propval = object[searchstring];
                return propval;
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

                x = 1;
                rows.forEach(function(element){
                        newrow = {};
                        var vals = element.split(fs);

                        newrow['recid'] = x;

                        for (i=0; i < fieldlen; i++) {
                        var field = fields[i];
                        newrow[field] = vals[i];
                        }

                        records.push(newrow);
                        x = x + 1;
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
        getauth: function(cookiename) {
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
        validatesession: function(params, callback){
                url = "app/server/main.php";
                postData = {
                        cmd: params.action,
                        table: params.table,
                        params: params.params
                        }

                $.post(url,
                postData,
                function( data ) {
                        callback(data);
                });
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
        getmysqldate: function(){
                var longdate = new Date();
                //var tzoffset = longdate.getTimezoneOffset() * 60000;
                var localdate = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ');
                return localdate;
        },
        getmysqlserverdate: function(params, callback){
                url = "app/server/main.php";
                postData = {
                        cmd: params.action,
                        table: params.table,
                        params: params.params
                        }

                $.post(url,
                postData,
                function( data ) {
                        callback(data);
                });
        },
        userperms: function(username, callback) {
                var url = 'app/server/main.php';

                postData = {
                                cmd: 'checkperms',
                                table: 'users',
                                params: {
                                        username: username
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

