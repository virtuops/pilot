<?php

require_once __DIR__.'/../admin/TaskCrud.php';
require_once __DIR__.'/../admin/ReportingParams.php';
require_once __DIR__.'/../admin/Reports.php';
require_once __DIR__.'/../admin/Upload.php';
require_once __DIR__.'/../admin/TaskLogCrud.php';
require_once __DIR__.'/../admin/RunBookCrud.php';
require_once __DIR__.'/../admin/UserCrud.php';
require_once __DIR__.'/../admin/GroupCrud.php';
require_once __DIR__.'/../admin/WorkFlowCrud.php';
require_once __DIR__.'/../admin/WFScheduleCrud.php';
require_once __DIR__.'/../admin/WorkFlowExecute.php';
require_once __DIR__.'/../admin/UserGroupCrud.php';
require_once __DIR__.'/../admin/RunbookTaskCrud.php';
require_once __DIR__.'/../admin/RunbookGroupCrud.php';
require_once 'Misc.php';
require_once __DIR__.'/../admin/Settings.php';
require_once 'Log.php';

Class Crud {

        private $globalconf;

        public function CrudOperation($action, $table, $params, $con){


                $t = new Task();
                $tl = new TaskLog();
                $r = new Runbook();
                $rp = new ReportingParams();
                $reps = new Reports();
                $rt = new RunbookTask();
                $rg = new RunbookGroup();
                $u = new User();
                $ug = new UserGroup();
                $g = new Group();
                $s = new Settings();
                $wf = new WorkFlow();
                $wfe = new WorkFlowExecute();
                $wfs = new WorkFlowSchedule();
                $misc = new Misc();
                $l = new Log();
                $up = new Upload();

                if ($table == 'tasks') {
                        $l->varErrorLog('In CrudOperation, tasks');
                        $t->TaskOperation($action, $params, $con);
                } else if ($table == 'reporting_params') {
                        $l->varErrorLog('In CrudOperation, reporting_params');
                        $rp->ReportingParamOperation($action, $params, $con);
                } else if ($table == 'lbs') {
                        $l->varErrorLog('In CrudOperation, load_balance');
                        $lb->LoadBalanceOperation($action, $params, $con);
                } else if ($table == 'workflows') {
                        $l->varErrorLog('In CrudOperation, workflows');
                        $wf->WorkFlowOperation($action, $params, $con);
                } else if ($table == 'workflowschedule') {
                        $l->varErrorLog('In CrudOperation, workflowschedule');
                        $wfs->WorkFlowScheduleOperation($action, $params, $con);
                } else if ($table == 'workflowexecute') {
                        $l->varErrorLog('In CrudOperation, workflowexecute');
                        $wfe->WorkFlowExecuteOperation($action, $params, $con);
                } else if ($table == 'actionpackage' || $table == 'textfile' || $table=='licensefile') {
                        $l->varErrorLog('In CrudOperation, upload');
                        $up->UploadOperation($action, $params, $con);
                } else if ($table == 'reports') {
                        $l->varErrorLog('In CrudOperation, reports');
                        $reps->ReportsOperation($action, $params, $con);
                } else if ($table == 'task_logs') {
                        $l->varErrorLog('In CrudOperation, task_logs');
                        $tl->TaskLogOperation($action, $params, $con);
                } else if ($table == 'runbooks') {
                        $l->varErrorLog('In CrudOperation, runbooks');
                        $r->RunbookOperation($action, $params, $con);
                } else if ($table == 'settings') {
                        $l->varErrorLog('In CrudOperation, settings');
                        $s->SettingsOperation($action, $params, $con);
                } else if ($table == 'users') {
                        //$l->varErrorLog('In CrudOperation, users');
                        $u->UserOperation($action, $params, $con);
                } else if ($table == 'groups') {
                        $l->varErrorLog('In CrudOperation, groups');
                        $g->GroupOperation($action, $params, $con);
                } else if ($table == 'user_groups') {
                        $l->varErrorLog('In CrudOperation, user_groups');
                        $ug->UserGroupOperation($action, $params, $con);
                } else if ($table == 'task_runbooks') {
                        $l->varErrorLog('In CrudOperation, task_runbooks');
                        $rt->RunbookTaskOperation($action, $params, $con);
                } else if ($table == 'group_runbooks') {
                        $l->varErrorLog('In CrudOperation, group_runbooks');
                        $rg->RunbookGroupOperation($action, $params, $con);
                } else if ($table == 'misc') {
                        $l->varErrorLog('In CrudOperation, misc');
                        $misc->MiscOperation($action, $params, $con);
                }

        }
}

