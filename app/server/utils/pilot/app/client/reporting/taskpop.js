define(function (require) {
	TASKLIST = require('../reporting/tasklist');
    return {
        launch: function(userparams){
	
	var config = {
	    layout: {
		name: 'poplayout',
		padding: 4,
		panels: [
		    { type: 'main', minSize: 300 }
		]
	    }
	};

	config['grid'] = TASKLIST.create(userparams);

	$(function () {
	    // initialization in memory
		if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
		if (w2ui.tasklist) { w2ui.tasklist.destroy(); }
	    $().w2layout(config.layout);
	    $().w2grid(config.grid);
	});

	    w2popup.open({
		title   : 'Tasks Executed by '+userparams.username+' for this problem',
		width   : 1000,
		height  : 600,
		showMax : true,
		body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
		onOpen  : function (event) {
		    event.onComplete = function () {
			$('#w2ui-popup #main').w2render('poplayout');
			w2ui.poplayout.content('main', w2ui.tasklist);
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
