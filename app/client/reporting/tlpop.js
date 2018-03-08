define(function (require) {
    return {
        launch: function(details){
	
	var config = {
	    layout: {
		name: 'poplayout',
		padding: 4,
		panels: [
		    { type: 'main', minSize: 300 }
		]
	    }
	};

	config['form'] = {};

	//TODO...need one form popup for prob start and end and another for tasks
	if (details.itemtype === 'problemstart' || details.itemtype === 'problemend') {
		config['form'] = {
			name: 'details',
		        fields : [
			    { field: 'problemnode', type: 'text', required: false, html: { caption: 'Node', attr: 'style="width: 300px" readonly' } },
			    { field: 'problemsummary', type: 'text', required: false, html: { caption: 'Summary', attr: 'style="width: 300px" readonly' } },
			    { field: 'problemseverity', type: 'text', required: false, html: { caption: 'Severity', attr: 'style="width: 300px" readonly' } },
			    { field: 'problemlocation', type: 'text', required: false, html: { caption: 'Location', attr: 'style="width: 300px" readonly' } },
			    { field: 'problemsource', type: 'text', required: false, html: { caption: 'Source', attr: 'style="width: 300px" readonly' } },
			    { field: 'problemstart', type: 'text', required: false, html: { caption: 'Start Date', attr: 'style="width: 300px" readonly' } },
			    { field: 'problemend', type: 'text', required: false, html: { caption: 'End Date', attr: 'style="width: 300px" readonly' } },
			    { field: 'problemticketnumber', type: 'text', required: false, html: { caption: 'Ticket Number', attr: 'style="width: 300px" readonly' } }
			],
			record: details.record

		};
	} else {
		config['form'] = {
			name: 'details',
		        fields : [
			    { field: 'problemnode', type: 'text', required: false, html: { caption: 'Node', attr: 'style="width: 300px" readonly' } },
			    { field: 'taskname',  type: 'text', required: false, html: { caption: 'Task Name', attr: 'style="width: 300px" readonly' } },
			    { field: 'runbookname',  type: 'text', required: false, html: { caption: 'Runbook', attr: 'style="width: 300px" readonly' } },
			    { field: 'actionfilename',  type: 'text', required: false, html: { caption: 'Action', attr: 'style="width: 300px" readonly' } },
			    { field: 'taskstarttime',  type: 'text', required: false, html: { caption: 'Start Time', attr: 'style="width: 300px" readonly' } },
			    { field: 'tasktime',  type: 'text', required: false, html: { caption: 'Task Duration', attr: 'style="width: 300px" readonly' } },
			    { field: 'taskstatus',  type: 'text', required: false, html: { caption: 'Status', attr: 'style="width: 300px" readonly' } },
			    { field: 'taskexit',  type: 'text', required: false, html: { caption: 'Exit Code', attr: 'style="width: 300px" readonly' } },
			    { field: 'username',  type: 'text', required: false, html: { caption: 'User', attr: 'style="width: 300px" readonly' } },
			],
			record: details.record
		};
	}

	$(function () {
	    // initialization in memory
		if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
		if (w2ui.details) { w2ui.details.destroy(); }
	    $().w2layout(config.layout);
	    $().w2form(config.form);
	});

	    w2popup.open({
		title   : 'Details',
		width   : 800,
		height  : 600,
		showMax : true,
		body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
		onOpen  : function (event) {
		    event.onComplete = function () {
			$('#w2ui-popup #main').w2render('poplayout');
			w2ui.poplayout.content('main', w2ui.details);
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
