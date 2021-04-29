<?php

namespace Tbnt\Cms\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Tbnt\Cms\Model\Post;
use Tbnt\Cms\Model\UserWeb;

class NewPasswordMail extends Mailable
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
     * Signin link
     *
     * @var string
     */
    public $signin_link;

    /**
     * Password
     *
     * @var string
     */
    public $password;

    /**
     * Create a new message instance.
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->user = optional($data['user'] ?? null);
        $this->lang_code = lang()->getCode($this->user->lang_id ?? lang()->getDefaultId());
        $this->signin_link = app_url(
            optional(
                Post::isType(config('cmstypes.page'))
                    ->isKey(config('cmstemplates.signin'))
                    ->first()
            )->canonical[$this->lang_code] ?? ''
        );
        $this->password = $data['password'];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(config('mail.from.address'), app_name())
            ->subject(__('cms::emails/new-password.subject', ['name' => app_name()], $this->lang_code))
            ->view('cms::emails.new-password.html')
            ->text('cms::emails.new-password.plain');
    }
}
