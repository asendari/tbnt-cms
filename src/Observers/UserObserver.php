<?php

namespace Tbnt\Cms\Observers;

use Tbnt\Cms\Model\User;

class UserObserver extends BaseObserver
{
    /**
     * Handle the "created" event.
     *
     * @param User $user
     * @return void
     */
    public function created(User $user)
    {
        if ($user->isTypeAdmin() === true) {
            $user->user_admin()->firstOrCreate([]);
        } elseif ($user->isTypeCron() === true) {
            $user->user_cron()->firstOrCreate([]);
        } elseif ($user->isTypeWeb() === true) {
            $user->user_web()->firstOrCreate([]);
        }
    }

    /**
     * Handle the "deleted" event.
     *
     * @param User $user
     * @return void
     */
    public function deleted(User $user)
    {
        // Delete password resets
        $user->password_resets->each(function ($p) {
            $p->delete();
        });

        // Delete files folder
        recursive_rmdir(media_root($user->getUploadDir()));

        // Empty sensitive informations
        $user->updateEntries([
            'lang_id' => null,
            'username' => '',
            'password' => '',
            'remember_token' => '',
            'is_active' => 0,
            'last_login_at' => null,
            'last_connected_at' => null,
        ]);

        if ($user->isTypeWeb() === true) {
            // Delete image
            if ($user->image) {
                $user->image->delete();
            }

            // Empty sensitive informations
            $user->user_web->updateEntries([
                'image_id' => null,
                'firstname' => '',
                'lastname' => '',
            ]);
        }
    }
}
