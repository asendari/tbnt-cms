<?php

namespace Tbnt\Cms\Observers;

use Tbnt\Cms\Model\File;

class FileObserver extends BaseObserverUuid
{
    /**
     * Handle the "deleted" event.
     *
     * @param File $file
     * @return void
     */
    public function deleted(File $file)
    {
        media()->delete($file->filename);
    }
}
