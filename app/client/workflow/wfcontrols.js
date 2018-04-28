define(function (require) {

        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');

        //TODO:  when we work on running a task, put function in place to dynamically change status

        var running = '<div id="wfstatus" style="width: 100px;"><span style="font-weight=700;">Status: </span><span style="color: green; font-weight=700;">Running</span></div>';
        var stopped = '<div id="wfstatus" style="width: 100px;"><span style="font-weight=700;">Status: </span><span style="color: red; font-weight=700;">Stopped</span></div>';

        var sessionid = UTILS.getsessionid('PHPSESSID');
        var wfuser = '';
        UTILS.getusername(sessionid, function(data){
        wfuser = data.records[0].username;
        });

        var monthconv = {
                "Jan":"1",
                "Feb":"2",
                "Mar":"3",
                "Apr":"4",
                "May":"5",
                "Jun":"6",
                "Jul":"7",
                "Aug":"8",
                "Sep":"9",
                "Oct":"10",
                "Nov":"11",
                "Dec":"12"
                };

        var convmonth = {
                "1":"Jan",
                "2":"Feb",
                "3":"Mar",
                "4":"Apr",
                "5":"May",
                "6":"Jun",
                "7":"Jul",
                "8":"Aug",
                "9":"Sep",
                "10":"Oct",
                "11":"Nov",
                "12":"Dec"
                };

        var dayconv = {
                "Sun":"0",
                "Mon":"1",
                "Tue":"2",
                "Wed":"3",
                "Thu":"4",
                "Fri":"5",
                "Sat":"6"
                };


        var convday = {
                "0":"Sun",
                "1":"Mon",
                "2":"Tue",
                "3":"Wed",
                "4":"Thu",
                "5":"Fri",
                "6":"Sat"
                };




        var m = {
                "*":"0",
                "*/2":"1",
                "1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59":"2",
                "*/5":"3",
                "*/10":"4",
                "*/15":"5",
                "*/30":"6"
        }

        var h = {
                "*":"0",
                "*/2":"1",
                "1,3,5,7,9,11,13,15,17,19,21,23":"2",
                "*/4":"3",
                "*/6":"4",
                "*/8":"5",
                "*/12":"6"
        }

        var d = {
                "*":"0",
                "1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31":"1",
                "1-31/2":"2",
                "*/5":"3",
                "*/10":"4",
                "*/15":"5"
        }

        var mn = {
                "*":"0",
                "*/2":"1",
                "1,3,5,7,9,11":"2",
                "*/3":"3",
                "*/6":"4"
        }

        var wd = {
                "*":"0",
                "1,2,3,4,5":"1",
                "0,6":"2"
        }

        var setSavedSchedule = function(schedule) {

                var sched = schedule.split(" ");
                var x = 1;
                var mpart = 0;
                var hpart = 0;
                var dpart = 0;
                var mnpart = 0;
                var wdpart = 0;

                sched.forEach(function(part){
                        if (x == 1) {
                                if (m[part]) {
                                        mpart = m[part];
                                } else {
                                        mpart = 7;
                                        var choices = part.split(',');
                                        choices.forEach(function(choice){
                                                $('#minutesnumber').w2field().set({id: choice, text: choice}, true);
                                        });
                                }
                        } else if (x == 2) {

                                if (h[part]) {
                                        hpart = h[part];
                                } else {
                                        hpart = 7;
                                        var choices = part.split(',');
                                        choices.forEach(function(choice){
                                                $('#hoursnumber').w2field().set({id: choice, text: choice}, true);
                                        });
                                }

                        } else if (x == 3) {
                                if (d[part]) {
                                        dpart = d[part];
                                } else {
                                        dpart = 6;
                                        var choices = part.split(',');
                                        choices.forEach(function(choice){
                                                $('#daysnumber').w2field().set({id: choice, text: choice}, true);
                                        });
                                }

                        } else if (x == 4) {
                                if (mn[part]) {
                                        mnpart = mn[part];
                                } else {
                                        mnpart = 5;
                                        var choices = part.split(',');
                                        choices.forEach(function(choice){
                                                $('#monthsnumber').w2field().set({id: convmonth[choice], text: convmonth[choice]}, true);
                                        });
                                }

                        } else if (x == 5) {

                                if (wd[part]) {
                                        wdpart = wd[part];
                                } else {
                                        wdpart = 3;
                                        var choices = part.split(',');
                                        choices.forEach(function(choice){
                                                $('#weekdaysnumber').w2field().set({id: convday[choice], text: convday[choice]}, true);
                                        });
                                }
                        }

                        x++;
                });

                setTimeout(function(){

                document.getElementsByName('minutes')[mpart].checked = true;
                document.getElementsByName('hours')[hpart].checked = true;
                document.getElementsByName('days')[dpart].checked = true;
                document.getElementsByName('months')[mnpart].checked = true;
                document.getElementsByName('weekdays')[wdpart].checked = true;


                if (mpart === 7) {
                        document.getElementById('minutesnumber').disabled = false;
                } else {
                        document.getElementById('minutesnumber').disabled = true;
                }

                if (hpart === 7) {
                        document.getElementById('hoursnumber').disabled = false;
                } else {
                        document.getElementById('hoursnumber').disabled = true;
                }

                if (dpart === 6) {
                        document.getElementById('daysnumber').disabled = false;
                } else {
                        document.getElementById('daysnumber').disabled = true;
                }

                if (mnpart === 5) {
                        document.getElementById('monthsnumber').disabled = false;
                } else {
                        document.getElementById('monthsnumber').disabled = true;
                }

                if (wdpart === 3) {
                        document.getElementById('weekdaysnumber').disabled = false;
                } else {
                        document.getElementById('weekdaysnumber').disabled = true;
                }

                },2500);

        }



        var minval = function(){
                var nums = $('#minutesnumber').data('selected');
                var cronval = '';

                for (i=0; i < document.getElementsByName('minutes').length; i++) {

                        var val = document.getElementsByName('minutes')[i].checked;
                        if (val === true) {
                                if (i === 0) {
                                        cronval = '*';
                                        return cronval;
                                } else if (i === 1) {
                                        cronval = '*/2';
                                        return cronval;
                                } else if (i === 2) {
                                        cronval = '1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59';
                                        return cronval;
                                } else if (i === 3) {
                                        cronval = '*/5';
                                        return cronval;
                                } else if (i === 4) {
                                        cronval = '*/10';
                                        return cronval;
                                } else if (i === 5) {
                                        cronval = '*/15';
                                        return cronval;
                                } else if (i === 6) {
                                        cronval = '*/30';
                                        return cronval;
                                } else if (i === 7) {
                                         var totalnums  = nums.length
                                         var count = 1
                                         nums.forEach(function(num){
                                             if (totalnums === 1) {
                                             cronval =  num.text;
                                             }
                                             else if (totalnums > 1 && count === totalnums) {
                                             cronval = cronval + '' +  num.text;
                                             } else {
                                                cronval = cronval + num.text + ',';
                                             }
                                             count++;
                                         });
                                        return cronval;
                                }

                        } else {
                        }
                }
        };

        var hourval = function(){
                var nums = $('#hoursnumber').data('selected');
                var cronval = '';

                for (i=0; i < document.getElementsByName('hours').length; i++) {

                        var val = document.getElementsByName('hours')[i].checked;
                        if (val === true) {
                                if (i === 0) {
                                        cronval = '*';
                                        return cronval;
                                } else if (i === 1) {
                                        cronval = '*/2';
                                        return cronval;

                                } else if (i === 2) {
                                        cronval = '1,3,5,7,9,11,13,15,17,19,21,23';
                                        return cronval;

                                } else if (i === 3) {
                                        cronval = '*/4';
                                        return cronval;

                                } else if (i === 4) {
                                        cronval = '*/6';
                                        return cronval;

                                } else if (i === 5) {
                                        cronval = '*/8';
                                        return cronval;

                                } else if (i === 6) {
                                        cronval = '*/12';
                                        return cronval;

                                } else if (i === 7) {
                                         var totalnums  = nums.length
                                         var count = 1
                                         nums.forEach(function(num){
                                             if (totalnums === 1) {
                                             cronval =  num.text;
                                             }
                                             else if (totalnums > 1 && count === totalnums) {
                                             cronval = cronval + '' +  num.text;
                                             } else {
                                                cronval = cronval + num.text + ',';
                                             }
                                             count++;
                                         });
                                        return cronval;
                                }

                        } else {
                        }

                }
        };

        var dayval = function(){
                var nums = $('#daysnumber').data('selected');
                var cronval = '';

                for (i=0; i < document.getElementsByName('days').length; i++) {

                        var val = document.getElementsByName('days')[i].checked;
                        if (val === true) {
                                if (i === 0) {
                                        cronval = '*';
                                        return cronval;
                                } else if (i === 1) {
                                        cronval = '*/2';
                                        return cronval;

                                } else if (i === 2) {
                                        cronval = '1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31';
                                        return cronval;

                                } else if (i === 3) {
                                        cronval = '*/5';
                                        return cronval;

                                } else if (i === 4) {
                                        cronval = '*/10';
                                        return cronval;

                                } else if (i === 5) {
                                        cronval = '*/15';
                                        return cronval;

                                } else if (i === 6) {
                                         var totalnums  = nums.length
                                         var count = 1
                                         nums.forEach(function(num){
                                             if (totalnums === 1) {
                                             cronval =  num.text;
                                             }
                                             else if (totalnums > 1 && count === totalnums) {
                                             cronval = cronval + '' +  num.text;
                                             } else {
                                                cronval = cronval + num.text + ',';
                                             }
                                             count++;
                                         });
                                        return cronval;
                                }

                        } else {
                        }

                }
        };

        var monthval = function(){
                var nums = $('#monthsnumber').data('selected');
                var cronval = '';

                for (i=0; i < document.getElementsByName('months').length; i++) {

                        var val = document.getElementsByName('months')[i].checked;
                        if (val === true) {
                                if (i === 0) {
                                        cronval = '*';
                                        return cronval;
                                } else if (i === 1) {
                                        cronval = '*/2';
                                        return cronval;

                                } else if (i === 2) {
                                        cronval = '1,3,5,7,9,11';
                                        return cronval;

                                } else if (i === 3) {
                                        cronval = '*/3';
                                        return cronval;

                                } else if (i === 4) {
                                        cronval = '*/6';
                                        return cronval;

                                } else if (i === 5) {
                                         var totalnums  = nums.length
                                         var count = 1
                                         nums.forEach(function(num){
                                             if (totalnums === 1) {
                                             cronval =  monthconv[num.text];
                                             }
                                             else if (totalnums > 1 && count === totalnums) {
                                             cronval = cronval + '' +  monthconv[num.text];
                                             } else {
                                                cronval = cronval + monthconv[num.text] + ',';
                                             }
                                             count++;
                                         });
                                        return cronval;
                                }
                        } else {
                        }

                }
        };


        var weekdayval = function(){
                var nums = $('#weekdaysnumber').data('selected');
                var cronval = '';

                for (i=0; i < document.getElementsByName('weekdays').length; i++) {

                        var val = document.getElementsByName('weekdays')[i].checked;
                        if (val === true) {
                                if (i === 0) {
                                        cronval = '*';
                                        return cronval;
                                } else if (i === 1) {
                                        cronval = '1,2,3,4,5';
                                        return cronval;

                                } else if (i === 2) {
                                        cronval = '0,6';
                                        return cronval;

                                } else if (i === 3) {
                                         var totalnums  = nums.length
                                         var count = 1
                                         nums.forEach(function(num){
                                             if (totalnums === 1) {
                                             cronval =  dayconv[num.text];
                                             }
                                             else if (totalnums > 1 && count === totalnums) {
                                             cronval = cronval + '' +  dayconv[num.text];
                                             } else {
                                                cronval = cronval + dayconv[num.text] + ',';
                                             }
                                             count++;
                                         });
                                        return cronval;
                                }

                        } else {
                        }

                }
        };


    return {
        launch: function(workflowname){

        var config = {
    layout: {
        name: 'poplayout',
        padding: 4,
        panels: [
            { type: 'main', minSize: 300 }
        ]
    },
    form: {
	show: {
		header: 'false'
	},
        name: 'wfcontrols',
        fields: [
                { field: 'minutes', type: 'radio'},
                { field: 'minutesnumber', type: 'enum', options: { openOnFocus: true, items: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'] }},
                { field: 'hours', type: 'radio'},
                { field: 'hoursnumber', type: 'enum', options: { openOnFocus: true, items: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'] }},
                { field: 'days', type: 'radio'},
                { field: 'daysnumber', type: 'enum', options: { openOnFocus: true, items: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'] }},
                { field: 'months', type: 'radio'},
                { field: 'monthsnumber', type: 'enum', options: { openOnFocus: true, items: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] }},
                { field: 'weekdays', type: 'radio'},
                { field: 'weekdaysnumber', type: 'enum', options: { openOnFocus: true, items: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] }}
        ],
        onRender: function(event){
                event.onComplete = function() {

                w2popup.message({
                         width   : 350,
                         height  : 170,
                         body    : '<div class="w2ui-centered">Click ok when schedule loads....</div>',
                         buttons : '<button class="w2ui-btn" onclick="w2popup.message()">Ok</button>'
                });

                var retrievedschedule = '';
                var workflowstatus = '';
                var wfsparams = {
                        workflowname: workflowname
                        };

                UTILS.ajaxPost('get','workflowschedule',wfsparams,function(data){

                        retrievedschedule = data.records[0].workflowschedule;
                        workflowstatus = data.records[0].workflowstatus;
                        //w2ui.wfcontrols.toolbar.set('save',{disabled: true});
                        if (workflowstatus == 'disabled') {
                        setSavedSchedule(retrievedschedule);
                        w2ui.wfcontrols.toolbar.set('reset',{disabled: true});
                        w2ui.wfcontrols.toolbar.set('startwf',{disabled: true});
                        w2ui.wfcontrols.toolbar.set('stopwf',{disabled: true});
                        w2ui.wfcontrols.toolbar.items[0].selected = "disabled";
                        w2ui.wfcontrols.refresh();
                        } else if (workflowstatus == 'scheduled') {

                        setSavedSchedule(retrievedschedule);
                        w2ui.wfcontrols.toolbar.items[0].selected = "scheduled";
                        w2ui.wfcontrols.refresh();
 
			} else {

                        setSavedSchedule(retrievedschedule);
                        w2ui.wfcontrols.toolbar.items[0].selected = "enabled";
                        w2ui.wfcontrols.refresh();

                        }
                });

                }


        },
        onChange: function(event) {
                //enable the save button when a change occurs anywhere on the form.
                w2ui.wfcontrols.toolbar.set('save',{disabled: false});
        },
        toolbar: {
            right: stopped,
            items: [
                { type: 'menu-radio', id: 'workflowstate', icon: 'fa fa-star',
                        text: function (item) {
                            var text = item.selected;
                            var el   = this.get('workflowstate:' + item.selected);
                            return 'State: ' + el.text;
                        },
                        selected: 'enabled',
                        items: [
                            { id: 'enabled', text: 'Enabled', icon: 'fa fa-picture' },
                            { id: 'disabled', text: 'Disabled', icon: 'fa fa-picture' },
                            { id: 'scheduled', text: 'Scheduled', icon: 'fa fa-picture' }
                        ]
                },
                { id: 'break1', type: 'break'},
                { id: 'startwf', type: 'button', caption: 'Start', img: 'fa fa-play' },
                { id: 'stopwf', type: 'button', caption: 'Stop', img: 'fa fa-stop' },
                { id: 'break2', type: 'break'},
                { id: 'spacer1', type: 'spacer'},
                { id: 'reset', type: 'button', caption: 'Reset', img: 'fa fa-file-o' },
                { id: 'save', type: 'button', disabled: true, caption: 'Save', img: 'fa fa-floppy-o' },
                { id: 'exit', type: 'button', disabled: false, caption: 'Exit', img: 'fa fa-sign-out' },
                { id: 'break2', type: 'break'},
            ],

            onClick: function (event) {
                if (event.target == 'reset') {

                        w2ui.wfcontrols.clear();
                        document.getElementsByName('minutes')[0].checked = true;
                        document.getElementsByName('hours')[0].checked = true;
                        document.getElementsByName('days')[0].checked = true;
                        document.getElementsByName('months')[0].checked = true;
                        document.getElementsByName('weekdays')[0].checked = true;
                        w2ui.wfcontrols.toolbar.set('save',{disabled: false});


                }
                else if (event.target == 'workflowstate:enabled' || event.target == 'workflowstate:scheduled') {
                        w2ui.wfcontrols.toolbar.set('reset', {disabled: false});
                        w2ui.wfcontrols.toolbar.set('startwf', {disabled: false});
                        w2ui.wfcontrols.toolbar.set('stopwf', {disabled: false});
                }
                else if (event.target == 'workflowstate:disabled') {
                        w2ui.wfcontrols.toolbar.set('reset',{disabled:true});
                        w2ui.wfcontrols.toolbar.set('startwf',{disabled: true});
                        w2ui.wfcontrols.toolbar.set('stopwf',{disabled: true});
                }
                else if (event.target == 'startwf') {
                        $('#wfstatus').html('<span style="font-weight=700;">Status: </span><span style="color: green; font-weight=700;">Running</span>');
                        wfeparams = {
                                "wfname": workflowname,
                                "wfuser": wfuser,
                                "wfpassword": UTILS.getauth('NHauth'),
                                "problem": ""
                        };

                        UTILS.ajaxPost('start','workflowexecute',wfeparams,function(data){
                                if (data.status == 'success') {
                                        $('#wfstatus').html('<span style="font-weight=700;">Status: </span><span style="color: red; font-weight=700;">Stopped</span>');
                                }
                        });

                } else if (event.target == 'stopwf') {

                        var stopping = function() {
                        w2popup.message({
                        width   : 350,
                        height  : 170,
                        body    : '<div class="w2ui-centered">Workflow stopping.</div>',
                        buttons : '<button class="w2ui-btn" onclick="w2popup.message()">Ok</button>'
                        });
                        }

                        w2confirm('You are about to stop a running workflow.  Click "Yes" to stop the workflow or "No" to let it run.')
                                .yes(function(event){

                                stopping();

                                wfeparams = {
                                "wfname": workflowname
                                };

                                UTILS.ajaxPost('stop','workflowexecute',wfeparams,function(data){
                               $('#wfstatus').html('<span style="font-weight=700;">Status: </span><span style="color: red; font-weight=700;">Stopped</span>');
                                });

                                })
                                .no(function(event){
                                        w2popup.close();
                                                                                                                                                                     })


                }
                else if (event.target == 'exit') {
                        var savestatus = w2ui.wfcontrols.toolbar.get('save').disabled;
                        if (savestatus === false) {
                                w2confirm('You have unsaved changes.  If you exit now, your changes will be lost.  Would you like to save your changes? (Yes to go back and save, No to exit).')
                                .yes(function(event){
                                        //Go back and save.

                                 })
                                 .no(function(event){
                                        w2popup.close();
                                 })
                        } else {
                                w2popup.close();
                        }
                }
                else if (event.target == 'save') {

                            w2confirm('About to update schedule...are you sure?')
                                    .yes(function () {
                                                var min = minval();
                                                var hr = hourval();
                                                var dy  = dayval();
                                                var mth  = monthval();
                                                var wdy  = weekdayval();
                                                min = typeof min !== 'undefined' ? min : '*';
                                                hr = typeof hr !== 'undefined' ? hr : '*';
                                                dy = typeof dy !== 'undefined' ? dy : '*';
                                                mth = typeof mth !== 'undefined' ? mth : '*';
                                                wdy = typeof wdy !== 'undefined' ? wdy : '*';

                                                var workflowstatus = w2ui.wfcontrols.toolbar.items[0].selected;

                                                var schedule = min +' '+ hr +' '+ dy +' '+ mth + ' ' + wdy;

                                                var wfsparams = {
                                                        workflowname: workflowname,
                                                        workflowschedule: schedule,
                                                        workflowstatus: workflowstatus,
                                                        workflowstate: 'unchanged'
                                                }

                                                        UTILS.ajaxPost('save','workflowschedule',wfsparams,function(data){
                                                        });

                                                w2ui.wfcontrols.toolbar.set('save',{disabled: true});
                                                })
                                    .no(function () {
                                                w2popup.close();
                                        });
                } else {
                        w2ui.wfcontrols.toolbar.set('save',{disabled: false});
                }
            }

        },
        formHTML:
        '<div id="wfcontrols" style="width: 1000px;">'+
            '<div class="w2ui-page page-0">'+
                '<div style="width: 310px; float: left; margin-right: 0px; margin-left: 10px;">'+
                    '<div style="padding: 3px; font-weight: bold; color: #777;">Minutes</div>'+
                    '<div class="w2ui-group" style="height: 245px;">'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Range:</label>'+
                            '<div>'+
                                '<input name="minutes" onclick="enableNums(1,0)", type="radio" />Every Minute<br>'+
                                '<input name="minutes" onclick="enableNums(1,1)", type="radio" />Even Minutes<br>'+
                                '<input name="minutes" onclick="enableNums(1,2)", type="radio" />Odd Minutes<br>'+
                                '<input name="minutes" onclick="enableNums(1,3)", type="radio" />Every 5 Minutes<br>'+
                                '<input name="minutes" onclick="enableNums(1,4)", type="radio" />Every 10 Minutes<br>'+
                                '<input name="minutes" onclick="enableNums(1,5)", type="radio" />Every 15 Minutes<br>'+
                                '<input name="minutes" onclick="enableNums(1,6)", type="radio" />Every 30 Minutes<br>'+
                                '<input name="minutes" onclick="enableNums(1,7)", type="radio" />Choose Minutes<br>'+
                            '</div>'+
                        '</div>'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Minute:</label>'+
                            '<div>'+
                                '<input id="minutesnumber" name="minutesnumber" type="text" maxlength="50" style="width: 100%">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div style="width: 310px; float: left; margin-left: 30px;">'+
                    '<div style="padding: 3px; font-weight: bold; color: #777;">Hours</div>'+
                    '<div class="w2ui-group" style="height: 245px;">'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Range:</label>'+
                            '<div>'+
                                '<input name="hours" onclick="enableNums(2,0)", type="radio" />Every Hour<br>'+
                                '<input name="hours" onclick="enableNums(2,1)", type="radio" />Even Hours<br>'+
                                '<input name="hours" onclick="enableNums(2,2)", type="radio" />Odd Hours<br>'+
                                '<input name="hours" onclick="enableNums(2,3)", type="radio" />Every 4 Hours<br>'+
                                '<input name="hours" onclick="enableNums(2,4)", type="radio" />Every 6 Hours<br>'+
                                '<input name="hours" onclick="enableNums(2,5)", type="radio" />Every 8 Hours<br>'+
                                '<input name="hours" onclick="enableNums(2,6)", type="radio" />Every 12 Hours<br>'+
                                '<input name="hours" onclick="enableNums(2,7)", type="radio" />Choose Hours<br>'+
                            '</div>'+
                        '</div>'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Hour:</label>'+
                            '<div>'+
                                '<input name="hoursnumber" type="text" maxlength="100" style="width: 100%"/>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div style="width: 310px; float: left; margin-left: 30px;">'+
                    '<div style="padding: 3px; font-weight: bold; color: #777;">Days</div>'+
                    '<div class="w2ui-group" style="height: 245px;">'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Range:</label>'+
                            '<div>'+
                                '<input name="days" onclick="enableNums(3,0)", type="radio" />Every Day<br>'+
                                '<input name="days" onclick="enableNums(3,1)", type="radio" />Even Days<br>'+
                                '<input name="days" onclick="enableNums(3,2)", type="radio" />Odd Days<br>'+
                                '<input name="days" onclick="enableNums(3,3)", type="radio" />Every 5 Days<br>'+
                                '<input name="days" onclick="enableNums(3,4)", type="radio" />Every 10 Days<br>'+
                                '<input name="days" onclick="enableNums(3,5)", type="radio" />Every Half Month<br>'+
                                '<input name="days" onclick="enableNums(3,6)", type="radio" />Choose Days<br>'+
                            '</div>'+
                        '</div>'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Days:</label>'+
                            '<div>'+
                                '<input id="daysnumber" name="daysnumber" type="text" maxlength="100" style="width: 100%"/>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+


                '<div style="width: 310px; float: left; margin-left: 10px; margin-right: 0px;">'+
                    '<div style="padding: 3px; font-weight: bold; color: #777;">Months</div>'+
                    '<div class="w2ui-group" style="height: 245px;">'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Range:</label>'+
                            '<div>'+
                                '<input name="months" onclick="enableNums(4,0)", type="radio" />Every Month<br>'+
                                '<input name="months" onclick="enableNums(4,1)", type="radio" />Even Months<br>'+
                                '<input name="months" onclick="enableNums(4,2)", type="radio" />Odd Months<br>'+
                                '<input name="months" onclick="enableNums(4,3)", type="radio" />Every 3 Months<br>'+
                                '<input name="months" onclick="enableNums(4,4)", type="radio" />Every 6 Months<br>'+
                                '<input name="months" onclick="enableNums(4,5)", type="radio" />Choose Months<br>'+
                            '</div>'+
                        '</div>'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Months:</label>'+
                            '<div>'+
                                '<input id="monthsnumber" name="monthsnumber" type="text" maxlength="100" style="width: 100%"/>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+

                '<div style="width: 310px; float: left; margin-left: 30px;">'+
                    '<div style="padding: 3px; font-weight: bold; color: #777;">Weekdays</div>'+
                    '<div class="w2ui-group" style="height: 245px;">'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Range:</label>'+
                            '<div>'+
                                '<input name="weekdays" onclick="enableNums(5,0)", type="radio" />Every Weekday<br>'+
                                '<input name="weekdays" onclick="enableNums(5,1)", type="radio" />Monday - Friday<br>'+
                                '<input name="weekdays" onclick="enableNums(5,2)", type="radio" />Weekends<br>'+
                                '<input name="weekdays" onclick="enableNums(5,3)", type="radio" />Choose Days<br>'+
                            '</div>'+
                        '</div>'+
                        '<div class="w2ui-field w2ui-span4">'+
                            '<label>Weekday:</label>'+
                            '<div>'+
                                '<input id="weekdaysnumber" name="weekdaysnumber" type="text" maxlength="100" style="width: 100%"/>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+


            '</div>'+


        '</div>',
        record: {
        }
    }
};


        $(function () {
            // initialization in memory
            if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
            if (w2ui.wfcontrols) { w2ui.wfcontrols.destroy(); }
            $().w2layout(config.layout);
            $().w2form(config.form);
        });

            w2popup.open({
                title   : 'Controls for '+workflowname,
                width   : 1050,
                height  : 900,
                showClose: false,
                showMax : true,
                body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
                onOpen  : function (event) {
                    event.onComplete = function () {
                        $('#w2ui-popup #main').w2render('poplayout');
                        w2ui.poplayout.content('main', w2ui.wfcontrols);
                    }
                },
                onToggle: function (event) {
                    event.onComplete = function () {
                        w2ui.poplayout.resize();
                    }
                }
            });

        }
    };
});


