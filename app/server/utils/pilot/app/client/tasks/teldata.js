define(function (require) {
    return {
        getresults: function(runbookid, taskname, callback){

                var url = 'app/server/main.php';

                // Default filter is one day
                var oneDayAgo = new Date()
                oneDayAgo.setDate(oneDayAgo.getDate() - 1)
                var datestr = oneDayAgo.getFullYear() + '-' + (oneDayAgo.getMonth() + 1) + '-' + oneDayAgo.getDate()

                postData = {
                                cmd: 'get',
                                table: 'task_logs',
                                params: {
                                        filter: datestr,
                                        runbookid: runbookid,
                                        taskname: taskname,
                                        gettype: 'tel'
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
        recordtaskrun: function(params, callback) {

                var url = 'app/server/main.php';

                postData = {
                                cmd: 'save',
                                table: 'task_logs',
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

