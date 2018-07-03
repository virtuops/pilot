define(function() {
    return {
    createupdate: function(action,table,params) {
                url = "app/server/main.php";
                postData = {
                        action: action,
                        table: table,
                        params: params
                        }

                $.post(url,
                postData,
                function( data ) {
                });
    },
    read: function (action, table, params){
                url = "app/server/main.php";
                postData = {
                        action: action,
                        table: table,
                        params: ''
                        }

                $.post(url,
                postData,
                function( data ) {
                        setgriddata(data);
                });


    },
    setgriddata: function(data){
                newdata = JSON.parse(data);

                w2ui.tasktopgrid.records=newdata;
    },
    deldata: function(action, table, params){
                url = "app/server/main.php";
                postData = {
                        action: action,
                        table: table,
                        params: params
                        }

                $.post(url,
                postData,
                function( data ) {
                });
     }
    }

})
