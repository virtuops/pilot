define(function (require) {

    return {
        launch: function(type, obj){
	obj.name = obj.name.replace(/ /g,'');
	var name = obj.name;
	
	var config = {
	    layout: {
		name: 'poplayout',
		padding: 4,
		panels: [
		    { type: 'main', minSize: 300 }
		]
	    }
	};

	if (type === 'Form') {
	config['form'] = obj;
	$(function () {
	    // initialization in memory
	    $().w2layout(config.layout);
	    $().w2form(config.form);
	});
	} else if (type === 'Grid') {
	config['grid'] = obj;
	$(function () {
	    // initialization in memory
	    $().w2layout(config.layout);
	    $().w2grid(config.grid);
	});
	}


    w2popup.open({
        title   : 'Popup',
        width   : 800,
        height  : 600,
        showMax : true,
        body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
        onOpen  : function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('poplayout');
                w2ui.poplayout.content('main', w2ui[name]);
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
