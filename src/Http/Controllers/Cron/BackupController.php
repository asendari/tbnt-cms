<?php

namespace Tbnt\Cms\Http\Controllers\Cron;

use Exception;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Utils\BackupUtils;

class BackupController extends BaseController
{
    /**
     * Backup DB each 15 minutes, hour, day, week
     *
     * @return void
     * @throws Exception
     */
    public function backup()
    {
        BackupUtils::backupTimeframes();
    }
}
