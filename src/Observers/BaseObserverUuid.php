<?php

namespace Tbnt\Cms\Observers;

use Tbnt\Cms\Model\BaseModelUuid;

class BaseObserverUuid extends BaseObserver
{
    /**
     * Handle the "created" event.
     *
     * @param BaseModelUuid $model
     * @return void
     */
    public function created(BaseModelUuid $model)
    {
        $model->updateBatch();
    }
}
