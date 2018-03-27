define(function (require) {
        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');
        var WFTC = require('../../client/workflow/taskconfig');
        var WFRC = require('../../client/workflow/routeconfig');
        var WFS = require('../../client/workflow/wfcontrols');
        var LISTFLOWS = require('../../client/workflow/listflows');
        var selectedTask = {};
        var selectedId = '';
        var workflowitems = [];

        var wfInitData = {
                          operators: {
                                start: {
                                  top: 20,
                                  left: 20,
                                  properties: {
                                    objecttype: 'startnode',
				    class: 'flowchart-start-operator',
                                    runbookid: '',
                                    runbookname: '',
                                    title: 'Start',
                                    inputs: {},
                                    outputs: {
                                      output_1: {
                                        label: 'Begin',
                                      }
                                    }
                                  }
                                },
                                end: {
                                  top: 20,
                                  left: 1000,
                                  properties: {
                                    objecttype: 'endnode',
				    class: 'flowchart-end-operator',
                                    runbookid: '',
                                    runbookname: '',
                                    title: 'Stop',
                                    inputs: {
                                      input_1: {
                                        label: 'End',
                                      },
                                    },
                                    outputs: {}
                                  }
                                },
                              },
                              links: {
                              }
        };

    return {
        workflowadmin: {
                name: 'workflowadmin',
                header: 'Work Flow Admin',
                url: 'app/server/main.php',
                postData: '',
                show: {
                    header         : true,
                    toolbar     : true,
                    footer        : true
                },
                onRender: function(event){
                event.onComplete = function(){

                            // Apply the plugin on a standard, empty div...
                            var $flowchart = $('#workflow_1');
                            $flowchart.flowchart({
                              data: wfInitData,
                              linkVerticalDecal: 1,
                              multipleLinksOnInput: true,
                              multipleLinksOnOutput: true,
                              linkWidth: 2,
                              onOperatorSelect: function(operatorId) {
                                //TODO:  On clicking an operator, bring up for to update/modify operator
                                var taskId = $flowchart.flowchart('getOperatorTitle', operatorId);
                                //var operatorData = $flowchart.flowchart('getData');
                                var operatorData = $flowchart.flowchart('getOperatorData',operatorId)
                                selectedId = operatorId;
                                selectedTask = operatorData;
                                return true;
                              },
                              onOperatorDelete: function(operatorId) {

                                selectedTask = {};
                                return true;
                              },
                              onLinkSelect: function(linkId) {
                                //TODO:  On clicking an operator, bring up for to update/modify Link data
                                return true;
                              },

                            });


                }
                },
                toolbar: {
                        name: 'wftoolbar',
                        items: [
                               { type: 'html',  id: 'workflowname',
                                        html: function (item) {
                                            var html =
                                              '<div style="padding: 3px 10px;">'+
                                              ' Workflow Name:'+
                                              '    <input size="15" '+
                                              'onchange="var el = w2ui.workflowadmin.toolbar.set(\'workflowname\', { value: this.value });" '+
                                              '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="'+ (item.value || '') + '"/>'+
                                              '</div>';
                                            return html;
                                        }
                                },
                                { id: 'loadworkflow', type: 'button', caption: 'Load WF', icon: 'fa fa-sitemap'},
                                { id: 'controls', type: 'button', caption: 'Controls', icon: 'fa fa-clock-o' },
                                { id: 'break1', type: 'break'},
                                { id: 'createtask', type: 'button', caption: 'Add Task', icon: 'fa fa-plus-square-o' },
                                { id: 'configtask', type: 'button', caption: 'Config Task', icon: 'fa fa-wrench' },
                                { id: 'break2', type: 'break'},

                                { id: 'createroute', type: 'button', group: 2, caption: 'Add RT', icon: 'fa fa-code-fork' },
                                { id: 'configroute', type: 'button', group: 2, caption: 'Config RT', icon: 'fa fa-wrench' },
                                { id: 'break3', type: 'break'},
                                { id: 'eraseobject', type: 'button', caption: 'Erase Object', icon: 'fa fa-eraser' },
                                { id: 'break4', type: 'break'},
                                { id: 'deleteworkflow', type: 'button', caption: 'Delete WF', icon: 'fa fa-trash-o' },
                                { id: 'break5', type: 'break'},
                                { id: 'clear', type: 'button', caption: 'Reset', icon: 'fa fa-file-o' },
                                { id: 'save', type: 'button', caption: 'Save', icon: 'fa fa-floppy-o' },
                        ],
                        onClick: function (event) {
                                if (event.target == 'clear') {
                                        var $flowchart = $('#workflow_1');
                                        $flowchart.flowchart('setData',wfInitData);
                                }
                                else if (event.target == 'save') {

                                        //check for name, no name, throw message
                                        var workflowname = w2ui.workflowadmin.toolbar.get('workflowname').value;
                                        var workflowdata = $('#workflow_1').flowchart('getData');

                                        if (typeof workflowname === 'undefined' || workflowname.trim().length === 0) {
                                                MESSAGES.noworkflowname();
                                        } else {

                                        workflowdata = JSON.stringify(workflowdata);
                                        workflowname = workflowname.trim();
                                        wfparams = {
                                                workflowname: workflowname,
                                                workflowdata: workflowdata
                                        }
                                            w2confirm('Saving workflow '+workflowname+', are you sure?')
                                            .yes(function () {
                                                        UTILS.ajaxPost('save','workflows',wfparams,function(data){
                                                        if (data.status === 'success') {
                                                        MESSAGES.workflowsaved(workflowname);
                                                        } else {
                                                        MESSAGES.workflownotsaved(workflowname, data.message);
                                                        }
                                                        });
                                            })
                                            .no(function () {
                                                        w2popup.close();
                                                        MESSAGES.workflownotsaved(workflowname,'You chose not to save the workflow');
                                            });
                                        }

                                }
                                else if (event.target == 'createtask') {
                                        var operatorNames = Object.getOwnPropertyNames($('#workflow_1').flowchart('getData').operators);
                                        var re = /task/;
                                        var highestNumber = 0;
                                        operatorNames.forEach(function(name){
                                                if (re.test(name) === true){
                                                        num = parseInt(name.replace('task',''));
                                                        if (num > highestNumber) {
                                                                highestNumber = num;
                                                        }
                                                }
                                        });
                                        var nextTask = highestNumber + 1;
                                      var operatorId = 'task' + nextTask;
                                      var operatorData = {
                                        top: 60,
                                        left: 500,
                                        properties: {
                                          objecttype: 'task',
				          class: 'flowchart-task-operator',
                                          runbookid: '',
                                          runbookname: '',
                                          title: 'Task ' + nextTask,
                                          inputs: {
                                            input_1: {
                                              label: 'In',
                                            }
                                          },
                                          outputs: {
                                            output_1: {
                                              label: 'Out',
                                            }
                                          }
                                        }
                                      };


                                      var $flowchart = $('#workflow_1');

                                      $flowchart.flowchart('createOperator', operatorId, operatorData);

                                }
                                else if (event.target == 'createroute') {
                                        var operatorNames = Object.getOwnPropertyNames($('#workflow_1').flowchart('getData').operators);
                                        var re = /route/;
                                        var highestNumber = 0;
                                        operatorNames.forEach(function(name){
                                                if (re.test(name) === true){
                                                        num = parseInt(name.replace('route',''));
                                                        if (num > highestNumber) {
                                                                highestNumber = num;
                                                        }
                                                }
                                        });

                                        var nextRoute = highestNumber + 1;
                                        var operatorId = 'route' + nextRoute;

                                      var operatorData = {
                                        top: 60,
                                        left: 500,
                                        properties: {
                                          objecttype: 'route',
				          class: 'flowchart-route-operator',
                                          title: 'Route ' + nextRoute,
                                          inputs: {
                                            input_1: {
                                              label: 'In',
                                              conntype: 'input'
                                            }
                                          },
                                          outputs: {
                                            output_1: {
                                              label: 'Out 1',
                                              conntype: 'output',
                                              parameter: 'paramname',
                                              comparison: 'LIKE',
                                              value: 'somevalue'
                                            },
                                            output_2: {
                                                label: 'Out 2',
                                                conntype: 'output',
                                                parameter: 'paramname',
                                                comparison: 'LIKE',
                                                value: 'somevalue'
                                            }
                                          }
                                        }
                                      };

                                      var $flowchart = $('#workflow_1');
                                      $flowchart.flowchart('createOperator', operatorId, operatorData);
                                }
                                else if (event.target == 'configtask') {
                                        var selId = $('#workflow_1').flowchart('getSelectedOperatorId');
                                        var operatorData = $('#workflow_1').flowchart('getOperatorData',selId);

                                        if (operatorData.properties.objecttype !== 'task') {
                                        MESSAGES.notatask();
                                        } else {
                                        var workflowname = w2ui.workflowadmin.toolbar.get('workflowname').value;
                                                if (typeof workflowname !== 'undefined') {
                                                        WFTC.launch(selId,workflowname);
                                                } else {
                                                        MESSAGES.noworkflowname();
                                                }
                                        }
                                }
                                else if (event.target == 'configroute') {
                                        var selId = $('#workflow_1').flowchart('getSelectedOperatorId');
                                        var operatorData = $('#workflow_1').flowchart('getOperatorData',selId);

                                        if (operatorData.properties.objecttype !== 'route') {
                                        MESSAGES.notaroute();
                                        } else {
                                                var workflowname = w2ui.workflowadmin.toolbar.get('workflowname').value;
                                                if (typeof workflowname !== 'undefined') {
                                                WFRC.launch(selId,workflowname);
                                                } else {
                                                MESSAGES.noworkflowname();
                                                }
                                        }
                                }
                                else if (event.target === 'controls') {

                                        var workflowname = w2ui.workflowadmin.toolbar.get('workflowname').value;

                                        if (typeof workflowname == 'undefined') {
                                        MESSAGES.needwfname();
                                        } else {
                                         WFS.launch(workflowname);
                                        }

                                }
                                else if (event.target == 'deleteworkflow') {

                                    var workflowname = w2ui.workflowadmin.toolbar.get('workflowname').value;

                                    wfparams = { workflowname: workflowname};


                                    w2confirm('Deleting workflow '+workflowname+', are you sure?')
                                    .yes(function () {
                                                        UTILS.ajaxPost('delete','workflows',wfparams,function(data){
                                                        if (data.status === 'success') {
                                                        MESSAGES.workflowdeleted(workflowname);
                                                        w2ui.workflowadmin.toolbar.set('workflowname',{value:''});
                                                        $('#workflow_1').flowchart('setData',wfInitData);
                                                        } else {
                                                        MESSAGES.workflownotdeleted(workflowname,data.message);
                                                        }
                                                        });
                                                })
                                    .no(function () {
                                                w2popup.close();
                                                MESSAGES.workflownotdeleted(workflowname, 'You chose not to delete '+workflowname);
                                        });



                                }

                                else if (event.target == 'eraseobject') {
                                        var $flowchart = $('#workflow_1');
                                        var linkOrTaskRouter = '';
                                        var title='';

                                        if ($flowchart.flowchart('getSelectedLinkId') !== null) {
                                        linkOrTaskRouter = 'link';
                                        } else {
                                        linkOrTaskRouter = 'taskroute';
                                        }

                                        if (linkOrTaskRouter === 'taskroute') {
                                        title = typeof selectedTask.properties.title != 'undefined' ? selectedTask.properties.title : '';
                                                if (title === 'Start' || title === 'Stop') {
                                                MESSAGES.nodeletestartend();

                                                } else {
                                                $flowchart.flowchart('deleteSelected');
                                                }
                                        } else {

                                        $flowchart.flowchart('deleteSelected');
                                        }

                                } else if (event.target === 'loadworkflow') {
                                        LISTFLOWS.launch();
                                } else {
                                        console.log('Something is not right');
                                }
                        }
                },
                fields: [
                ],
                formHTML: '<div id="chart_container" style="height:1500px; width: 100%;">' +
                        '<div style="height:100%; width: 100%;" class="flowchart-example-container flowchart-container" id="workflow_1"></div>'+
                '</div>',
        },
        init: function(){
                $().w2form(this.workflowadmin);
        }
    };
});

