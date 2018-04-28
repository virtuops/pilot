define(function (require) {
        var UTILS = require('../../client/utils/misc');
        var MESSAGES = require('../../client/messages/messages');
        var WFTC = require('../../client/workflow/taskconfig');
        var WFRCIE = require('../../client/workflow/routeconfig-ifelse');
        var WFRCWL = require('../../client/workflow/routeconfig-whileloop');
        var WFRCCONTINUE = require('../../client/workflow/routeconfig-continue');
        var WFRCBREAK = require('../../client/workflow/routeconfig-break');
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
                                return true;
                              },
			      onOperatorCreate: function(operatorId, operatorData, fullElement){


				fullElement.operator[0].addEventListener('dblclick',function(){
				if (operatorId !== 'start' && operatorId !== 'end') {

                                selectedId = operatorId;
                                selectedTask = operatorData;

				var workflowname = w2ui.workflowadmin.toolbar.get('workflowname').value;
				 if (typeof workflowname !== 'undefined') {
				    if (selectedId.substring(0,4) == 'task') {
                                    WFTC.launch(selectedId,workflowname);
				    } else if (selectedId.substring(0,5) == 'route') {
					if (selectedId.substring(6,13) == 'if-else') {
                                    	WFRCIE.launch(selectedId,workflowname);
					} else if (selectedId.substring(6,11) == 'while') {
                                    	WFRCWL.launch(selectedId,workflowname);
					} else if (selectedId.substring(6,14) == 'continue') {
                                    	WFRCCONTINUE.launch(selectedId,workflowname);
					} else if (selectedId.substring(6,11) == 'break') {
                                    	WFRCBREAK.launch(selectedId,workflowname);
					}
				    }
                                 } else {
                                    MESSAGES.noworkflowname();
                                 }


				}

				},false);

				return true;
			      },
                              onOperatorDelete: function(operatorId) {

                                selectedTask = {};
                                return true;
                              },
                              onLinkSelect: function(linkId) {
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
                                { id: 'loadworkflow', type: 'button', caption: 'Load WF', img: 'workflowicon'},
                                { id: 'controls', type: 'button', caption: 'Controls', img: 'controlsicon' },
                                { id: 'break1', type: 'break'},
                                { id: 'createtask', type: 'button', caption: 'Tasks', img: 'addicon' },
                                { id: 'break2', type: 'break'},
                                //{ id: 'createroute', type: 'button', group: 2, caption: 'Add RT', img: 'routeicon' },
				{ id: 'route', type: 'menu', caption: 'Routes', img: 'routeicon', selected: 'id1',
					items: [{ text: 'if-else', img: 'routeicon'},
                			{ text: 'while', img: 'routeicon'},
                			{ text: 'do-while', img: 'routeicon'},
                			{ text: 'foreach', img: 'routeicon'},
                			{ text: 'break', img: 'routeicon'},
                			{ text: 'continue', img: 'routeicon'},
					] 
				},
                                { id: 'break4', type: 'break'},
                                { id: 'eraseobject', type: 'button', caption: 'Erase Object', img: 'cancelicon' },
                                { id: 'break5', type: 'break'},
                                { id: 'deleteworkflow', type: 'button', caption: 'Delete WF', img: 'removeicon' },
                                { id: 'break6', type: 'break'},
                                { id: 'clear', type: 'button', caption: 'Reset', img: 'reseticon' },
                                { id: 'save', type: 'button', caption: 'Save', img: 'saveicon' },
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
				else if (event.target == 'route:break') {
                                        var operatorNames = Object.getOwnPropertyNames($('#workflow_1').flowchart('getData').operators);
                                        var re = /route:break/;
                                        var highestNumber = 0;
                                        operatorNames.forEach(function(name){
                                                if (re.test(name) === true){
                                                        num = parseInt(name.replace('route:break',''));
                                                        if (num > highestNumber) {
                                                                highestNumber = num;
                                                        }
                                                }
                                        });

                                        var nextRoute = highestNumber + 1;
                                        var operatorId = 'route:break' + nextRoute;
                                      var operatorData = {
                                        top: 60,
                                        left: 500,
                                        properties: {
                                          objecttype: 'route:break',
				          class: 'flowchart-route-operator-break',
                                          title: 'Break',
                                          inputs: {
                                            input_1: {
                                              label: 'In',
                                              conntype: 'input'
                                            }
                                          },
                                          outputs: {
                                            output_1: {
                                              label: 'Out',
                                              conntype: 'output',
                                            }
                                          }
                                        }
                                      };

                                      var $flowchart = $('#workflow_1');
                                      $flowchart.flowchart('createOperator', operatorId, operatorData);


				} 
				else if (event.target == 'route:continue') {
                                        var operatorNames = Object.getOwnPropertyNames($('#workflow_1').flowchart('getData').operators);
                                        var re = /route:continue/;
                                        var highestNumber = 0;
                                        operatorNames.forEach(function(name){
                                                if (re.test(name) === true){
                                                        num = parseInt(name.replace('route:continue',''));
                                                        if (num > highestNumber) {
                                                                highestNumber = num;
                                                        }
                                                }
                                        });

                                        var nextRoute = highestNumber + 1;
                                        var operatorId = 'route:continue' + nextRoute;
                                      var operatorData = {
                                        top: 60,
                                        left: 500,
                                        properties: {
                                          objecttype: 'route:continue',
				          class: 'flowchart-route-operator-continue',
                                          title: 'Continue',
                                          inputs: {
                                            input_1: {
                                              label: 'In',
                                              conntype: 'input'
                                            }
                                          },
                                          outputs: {
                                            output_1: {
                                              label: 'Out',
                                              conntype: 'output',
                                            }
                                          }
                                        }
                                      };

                                      var $flowchart = $('#workflow_1');
                                      $flowchart.flowchart('createOperator', operatorId, operatorData);

				}
                                else if (event.target == 'route:if-else') {
                                        var operatorNames = Object.getOwnPropertyNames($('#workflow_1').flowchart('getData').operators);
                                        var re = /route:if-else/;
                                        var highestNumber = 0;
                                        operatorNames.forEach(function(name){
                                                if (re.test(name) === true){
                                                        num = parseInt(name.replace('route:if-else',''));
                                                        if (num > highestNumber) {
                                                                highestNumber = num;
                                                        }
                                                }
                                        });

                                        var nextRoute = highestNumber + 1;
                                        var operatorId = 'route:if-else' + nextRoute;
                                      var operatorData = {
                                        top: 60,
                                        left: 500,
                                        properties: {
                                          objecttype: 'route:if-else',
				          class: 'flowchart-route-operator',
                                          title: 'If Else',
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
				else if (event.target === 'route:while') {
                                        var operatorNames = Object.getOwnPropertyNames($('#workflow_1').flowchart('getData').operators);
                                        var re = /route:while/;
                                        var highestNumber = 0;
                                        operatorNames.forEach(function(name){
                                                if (re.test(name) === true){
                                                        num = parseInt(name.replace('route:while',''));
                                                        if (num > highestNumber) {
                                                                highestNumber = num;
                                                        }
                                                }
                                        });

                                        var nextRoute = highestNumber + 1;
                                        var operatorId = 'route:while' + nextRoute;

                                      var operatorData = {
                                        top: 60,
                                        left: 500,
                                        properties: {
                                          objecttype: 'route:while',
				          class: 'flowchart-route-operator',
                                          title: 'While',
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
                                            }
                                          }
                                        }
                                      };

                                      var $flowchart = $('#workflow_1');
                                      $flowchart.flowchart('createOperator', operatorId, operatorData);

				} 
				else if (event.target === 'route:do-while') {



				}
				else if (event.target === 'route:for') {


				}
				else if (event.target === 'route:foreach') {

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
					var selId = $flowchart.flowchart('getSelectedOperatorId');
					var targetData = $flowchart.flowchart('getOperatorData',selId);
                                        var linkOrTaskRouter = '';
                                        var title=targetData.title;
                                        var objtype=targetData.objecttype;
					

                                        if ($flowchart.flowchart('getSelectedLinkId') !== null) {
                                        linkOrTaskRouter = 'link';
                                        } else {
                                        linkOrTaskRouter = 'taskroute';
                                        }

                                        if (linkOrTaskRouter === 'taskroute') {
                                                if (objtype === 'startnode' || objtype === 'endnode') {
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
                                        //console.log('Something is not right');
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

