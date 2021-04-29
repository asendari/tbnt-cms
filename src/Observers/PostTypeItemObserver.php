<?php

namespace Tbnt\Cms\Observers;

use Tbnt\Cms\Model\PostTypeItem;

class PostTypeItemObserver extends BaseObserverUuid
{
    /**
     * Handle the "deleting" event.
     *
     * @param PostTypeItem $post_type_item
     * @return void
     */
    public function deleting(PostTypeItem $post_type_item)
    {
        $post_type_item->post_items->each(function ($p) {
            $p->delete();
        });

        $post_type_item->post_type_items->each(function ($p) {
            $p->delete();
        });

        $post_type_item->post_type_item_conditions_matches->each(function ($p) {
            $p->delete();
        });

        $post_type_item->post_type_item_conditions_values->each(function ($p) {
            $p->delete();
        });

        $post_type_item->post_type_item_conditions->each(function ($p) {
            $p->delete();
        });

        $post_type_item->post_type_item_restrictions->each(function ($p) {
            $p->delete();
        });

        $post_type_item->trans->each(function ($p) {
            $p->delete();
        });
    }
}
