define(function (require) {
    return {
        create: function(gridname,params){
        var config = {
            layout: {
                name: 'poplayout',
                padding: 4,
                panels: [
                    { type: 'main', minSize: 300 }
                ]
            }
        };

        config['form'] = {
                        name   : 'gridparamform',
                        header: 'Grid Parameters',
                        show : {
                                toolbar: true,
                                header: true,
                                footer: false
                        },
                        toolbar: {
                            items: [
                                { id: 'bt1', type: 'button', caption: 'Change Params', icon: 'fa fa-users' }
                            ],
                            onClick: function (event) {
                                if (event.target == 'bt1'){

                                    delete w2ui.gridparamform.record[""];
                                    NH.taskparams[gridname] = w2ui.gridparamform.record;
                                    console.log(NH.taskparams[gridname]);
                                    w2ui.gridparamform.toolbar.right = 'Params Updated';
                                    w2ui.gridparamform.toolbar.refresh();

                                }
                            }
                        },
                        fields: [],
                        record: {}
        }

        $(function () {
            // initialization in memory
           fields = params.split(',');

           fields.forEach(function(prm){
           config.form.fields.push({field: prm, type: 'text', html: { caption: prm, attr: 'style="width: 300px"' }});
           });

            if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
            if (w2ui.gridparamform) { w2ui.gridparamform.destroy(); }
            $().w2layout(config.layout);
            $().w2form(config.form);
        });

            w2popup.open({
                title   : ' ',
                width   : 600,
                height  : 800,
                showMax : true,
                body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
                onOpen  : function (event) {
                    event.onComplete = function () {
                        $('#w2ui-popup #main').w2render('poplayout');
                        w2ui.poplayout.content('main', w2ui.gridparamform);

                        var record = {};
                        var querystring = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : '';
                        var searchparams = querystring.split('&') ? querystring.split('&') : [];

                        searchparams.forEach(function(p){
                                var keyval = p.split('=');
                                record[keyval[0]] = keyval[1];

                        });
                        if (! NH.taskparams[gridname]) {
                                w2ui.gridparamform.record = record;
                        } else {
                                w2ui.gridparamform.record = NH.taskparams[gridname];
                        }

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

