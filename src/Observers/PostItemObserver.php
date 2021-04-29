<?php

namespace Tbnt\Cms\Observers;

use Tbnt\Cms\Model\PostItem;

class PostItemObserver extends BaseObserverUuid
{
    /**
     * Handle the "deleting" event.
     *
     * @param PostItem $post_item
     * @return void
     */
    public function deleting(PostItem $post_item)
    {
        $post_item->post_items->each(function ($p) {
            $p->delete();
        });

        $post_item->trans->each(function ($p) {
            $p->delete();
        });
    }
}
