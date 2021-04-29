<?php

namespace Tbnt\Cms\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Tbnt\Cms\Model\Contact;

class ContactContactMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Contact
     *
     * @var Contact
     */
    public $contact = null;

    /**
     * Create a new message instance.
     *
     * @param Contact $contact
     */
    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(config('mail.from.address'), app_name())
            ->subject(__('cms::emails/contact/contact.subject', ['name' => app_name()]))
            ->replyTo($this->contact->email)
            ->view('cms::emails.contact.contact.html')
            ->text('cms::emails.contact.contact.plain');
    }
}
