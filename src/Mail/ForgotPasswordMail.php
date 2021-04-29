<?php

namespace Tbnt\Cms\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Tbnt\Cms\Model\Post;
use Tbnt\Cms\Model\UserWeb;

class ForgotPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * User
     *
     * @var UserWeb
     */
    public $user;

    /**
     * Template lang code
     *
     * @var string
     */
    public $lang_code;

    /**
     * Recovery link
     *
     * @var string
     */
    public $recovery_link;

    /**
     * Recovery token duration
     *
     * @var int
     */
    public $duration;

    /**
     * Create a new message instance.
     *
     * @param array $data
     * @return void
     */
    public function __construct(array $data)
    {
        $this->user = optional($data['user'] ?? null);
        $this->lang_code = lang()->getCode($this->user->lang_id ?? lang()->getDefaultId());

        $token = $data['token'] ?? '';
        $url =
            optional(
                Post::isType(config('cmstypes.page'))
                    ->isKey(config('cmstemplates.recover_password'))
                    ->first()
            )->canonical[$this->lang_code] ?? '';

        $this->recovery_link = app_url($url . '?token=' . $token);
        $this->duration = config('cms.password_reset_duration');
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(config('mail.from.address'), app_name())
            ->subject(__('cms::emails/forgot-password.subject', ['name' => app_name()], $this->lang_code))
            ->view('cms::emails.forgot-password.html')
            ->text('cms::emails.forgot-password.plain');
    }
}
