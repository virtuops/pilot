define(function (require) {

        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');

    return {
        launch: function(selId, workflowname){
        operatorData = $('#workflow_1').flowchart('getOperatorData', selId);
        var curTitle = operatorData.properties.title;


        var routerecords = [];
        var inputs = operatorData.properties.inputs;
        var outputs = operatorData.properties.outputs;
        var id = 1;

        for (var inprop in inputs) {

                rr = {recid: id, label: inputs[inprop].label, conntype: inputs[inprop].conntype}
                routerecords.push(rr);
                id = id + 1;
        }

        for (var outprop in outputs) {
                rr = {
                        recid: id,
                        label: outputs[outprop].label,
                        conntype: outputs[outprop].conntype,
                        parameter: outputs[outprop].parameter,
                        comparison: outputs[outprop].comparison,
                        value: outputs[outprop].value
                        }
                routerecords.push(rr);
                id = id + 1;
        }

        var config = {
    layout: {
        name: 'poplayout',
        padding: 4,
        panels: [
            { type: 'left', size: '55%', resizable: true, minSize: 300 },
            { type: 'main', minSize: 300 }
        ]
    },
    grid: {
        name: 'routeconfiggrid',
        show: {
            toolbar            : true,
            toolbarDelete    : true
        },
        toolbar: {
                items: [
                { type: 'html',  id: 'routename', html: function (item) {
                    var html =
                      '<div style="padding: 3px 10px;">'+
                      ' Router Name: '+
                      '    <input size="10" onchange="var el = w2ui.routeconfiggrid.toolbar.set(\'routename\', { value: this.value });" '+
                      '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="'+ (item.value || operatorData.properties.title ) + '"/>'+
                      '</div>';
                    return html;
                }
            }

                ]

        },
        onRender: function(event){
                event.onComplete = function(){

                        w2ui.routeconfiggrid.records = routerecords;
                        w2ui.routeconfiggrid.refresh();

                }
        },
        columns: [
            { field: 'label', caption: 'Label', size: '20%', sortable: true, searchable: true },
            { field: 'operatorid', caption: 'OperatorId', size: '150px', hidden: true, sortable: true, searchable: true },
            { field: 'conntype', caption: 'Conn Type', size: '50px', sortable: true, searchable: true },
            { field: 'parameter', caption: 'Param', size: '20%', sortable: true, searchable: true },
            { field: 'comparison', caption: 'Comparison', size: '60px' },
            { field: 'value', caption: 'Value', size: '50%' }
        ],
        records: routerecords,
        onClick: function(event) {
            var grid = this;
            var form = w2ui.routeconfigform;
            event.onComplete = function () {
                var sel = grid.getSelection();
                if (sel.length == 1) {
                    form.recid  = sel[0];
                    form.record = $.extend(true, {}, grid.get(sel[0]));
                    form.refresh();
                } else {
                    form.clear();
                }
            }
        }
    },
    form: {
        header: 'Configure Route',
        name: 'routeconfigform',
        fields: [
            { name: 'recid', type: 'text', html: { caption: 'ID', attr: 'size="10" readonly' } },
            { name: 'label', type: 'text', required: false, html: { caption: 'Label', attr: 'size="40" maxlength="40"' } },
            { name: 'conntype', type: 'list', options:{items:['input','output']}, required: false, html: { caption: 'Conn Type', attr: 'size="40"' } },
            { name: 'parameter', type: 'text', required: false, html: { caption: 'Parameter', attr: 'size="40"' } },
            { name: 'comparison', type: 'list', options:{items:['=','>','<','>=','<=','<>','LIKE','NOT LIKE']}, html: { caption: 'Comparison', attr: 'size="30"' } },
            { name: 'value', type: 'text', html: { caption: 'Value', attr: 'size="40"' } }
        ],
        actions: {
            "Reset": function () {
                this.clear();
            },
            "Add/Update": function () {
                var errors = this.validate();
                if (errors.length > 0) return;
                var formrecvals = {};
                for (var prop in this.record) {
                        if (typeof this.record[prop] === 'object') {
                                formrecvals[prop] = this.record[prop].text;
                        } else {
                                formrecvals[prop] = this.record[prop];
                        }
                }
                if (this.recid == 0) {
                    formrecvals['recid'] = w2ui.routeconfiggrid.records.length + 1;
                    //w2ui.routeconfiggrid.add($.extend(true, { recid: w2ui.routeconfiggrid.records.length + 1 }, formrecvals));
                    w2ui.routeconfiggrid.add(formrecvals);
                    w2ui.routeconfiggrid.selectNone();
                    this.clear();
                } else {
                    w2ui.routeconfiggrid.set(this.recid, formrecvals);
                    w2ui.routeconfiggrid.selectNone();
                    this.clear();
                }
            },
            "Save and Exit": function(){
                        // Save what's in the form
                        var errors = this.validate();
                        if (errors.length > 0) return;
                        var formrecvals = {};
                        for (var prop in this.record) {
                                if (typeof this.record[prop] === 'object') {
                                        formrecvals[prop] = this.record[prop].text;
                                } else {
                                        formrecvals[prop] = this.record[prop];
                                }
                        }
                        if (this.recid == 0) {
                            formrecvals['recid'] = w2ui.routeconfiggrid.records.length + 1;
                            //w2ui.routeconfiggrid.add($.extend(true, { recid: w2ui.routeconfiggrid.records.length + 1 }, formrecvals));
                            w2ui.routeconfiggrid.add(formrecvals);
                            w2ui.routeconfiggrid.selectNone();
                            this.clear();
                        } else {
                            w2ui.routeconfiggrid.set(this.recid, formrecvals);
                            w2ui.routeconfiggrid.selectNone();
                            this.clear();
                        }

                        //Need to update the JSON for the operatorData
                        var routes = w2ui.routeconfiggrid.records;
                        var inId = 1;
                        var outId = 1;
                        operatorData.properties.title = w2ui.routeconfiggrid.toolbar.get('routename').value;


                        //clear out initial inputs and outputs;


                        //create new inputs and outputs based on the new config
                        routes.forEach(function(route){
                                if (route.conntype === 'input') {
                                        var inputx = 'input_'+inId;
                                        operatorData.properties.inputs[inputx] = {};
                                        operatorData.properties.inputs[inputx].conntype = 'input';
                                        operatorData.properties.inputs[inputx].label = route.label;
                                        inId = inId + 1;

                                } else if (route.conntype === 'output') {
                                        var outputx = 'output_'+outId;
                                        operatorData.properties.outputs[outputx] = {};
                                        operatorData.properties.outputs[outputx].conntype = 'output';
                                        operatorData.properties.outputs[outputx].label = route.label;
                                        operatorData.properties.outputs[outputx].parameter = route.parameter;
                                        operatorData.properties.outputs[outputx].comparison = route.comparison;
                                        operatorData.properties.outputs[outputx].value = route.value;
                                        outId = outId + 1;
                                }

                        });

                            w2confirm('About to update route...are you sure?')
                                    .yes(function () {
                                                        operatorData.properties.title = typeof w2ui.routeconfiggrid.toolbar.get('routename').value !== 'undefined' ? w2ui.routeconfiggrid.toolbar.get('routename').value : curTitle;
                                                        $('#workflow_1').flowchart('setOperatorData',selId, operatorData);
                                                        var workflowdata = $('#workflow_1').flowchart('getData');
                                                        workflowdata = JSON.stringify(workflowdata);
                                                        workflowname = workflowname.trim();
                                                        wfparams = {
                                                                workflowname: workflowname,
                                                                workflowdata: workflowdata
                                                        };
                                                        UTILS.ajaxPost('save','workflows',wfparams,function(data){
                                                        });
                                                        MESSAGES.routechanged();
                                                })
                                    .no(function () {
                                                w2popup.close();
                                                MESSAGES.routenotchanged();
                                        });

            }
        }
    }
};


        $(function () {
            // initialization in memory
           if (w2ui.poplayout) { w2ui.poplayout.destroy(); }
           if (w2ui.routeconfiggrid) { w2ui.routeconfiggrid.destroy(); }
           if (w2ui.routeconfigform) { w2ui.routeconfigform.destroy(); }
           $().w2layout(config.layout);
           $().w2grid(config.grid);
           $().w2form(config.form);
        });

            w2popup.open({
                title   : ' ',
                width   : 1200,
                height  : 600,
                showMax : true,
                body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
                onOpen  : function (event) {
                    event.onComplete = function () {
                        $('#w2ui-popup #main').w2render('poplayout');
                        w2ui.poplayout.content('left', w2ui.routeconfiggrid);
                        w2ui.poplayout.content('main', w2ui.routeconfigform);
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

