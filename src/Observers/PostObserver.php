<?php

namespace Tbnt\Cms\Observers;

use Tbnt\Cms\Model\Post;

class PostObserver extends BaseObserverUuid
{
    /**
     * Handle the "deleting" event.
     *
     * @param Post $post
     * @return void
     */
    public function deleting(Post $post)
    {
        $post->posts->each(function ($p) {
            $p->update(['post_id' => null]);
        });

        $post->post_type_item_restrictions->each(function ($p) {
            $p->delete();
        });

        $post->post_items->each(function ($p) {
            $p->delete();
        });

        $post->trans->each(function ($p) {
            $p->delete();
        });
    }
}
