<?php

namespace Tbnt\Cms\Observers;

use Tbnt\Cms\Model\PostType;

class PostTypeObserver extends BaseObserverUuid
{
    /**
     * Handle the "deleting" event.
     *
     * @param PostType $post_type
     * @return void
     */
    public function deleting(PostType $post_type)
    {
        $post_type->posts->each(function ($p) {
            $p->delete();
        });

        $post_type->post_type_items->each(function ($p) {
            $p->delete();
        });

        $post_type->trans->each(function ($p) {
            $p->delete();
        });
    }
}
