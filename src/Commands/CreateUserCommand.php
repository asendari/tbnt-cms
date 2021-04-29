<?php

namespace Tbnt\Cms\Commands;

use Tbnt\Cms\Model\User;
use Tbnt\Cms\Model\UserType;

class CreateUserCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:create-user
							{--username= : User username}
							{--password= : User password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create user';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        // Prompt for username
        $username = $this->optionAsk('username', 'What is the username?');
        $password = $this->optionSafe('password');

        if ($username === null) {
            $this->line('Username is empty, aborting...');
            return;
        }

        $user = User::findFor($username, 'username');

        $update =
            $user === null ||
            $password !== null ||
            $this->confirm('Username already exists... Would you like to update the password?');

        // Prompt for password
        if ($update === true) {
            $password = $this->optionAsk('password', 'What is the password?');

            if ($password === null) {
                $password = $this->optionAsk('password', 'What is the password? (Press enter to skip)');
            }

            if ($password === null) {
                $this->line('Password is empty, aborting...');
                return;
            }
        }

        // Prompt for active
        $is_active = $this->confirm('Is the user "active"?', $user ? $user->is_active : true);

        // Prompt for type
        $types = UserType::all();
        $types_keys = $types->pluck('key')->toArray();

        $type = $this->choice('What is the user "type"?', $types_keys, $user ? $user->user_type->key : $types_keys[0] ?? null);

        $user_type_id = $types->firstWhere('key', $type)->id;

        // Create user
        $user = $this->create([
            'user_type_id' => $user_type_id,
            'username' => $username,
            'password' => $password,
            'is_active' => $is_active,
        ]);

        // Update profile
        if ($type === UserType::ADMIN) {
            $this->updateAdmin($user);
        } elseif ($type === UserType::WEB) {
            $this->updateWeb($user);
        }
    }

    /**
     * Create user.
     *
     * @param array $data
     * @return User
     */
    public function create(array $data)
    {
        $user = User::findFor($data['username'], 'username');

        if ($user !== null) {
            $user->update(['user_type_id' => $data['user_type_id']]);
        } else {
            $user = new User(['user_type_id' => $data['user_type_id'], 'username' => $data['username']]);
        }

        if ($data['password'] !== null) {
            $user->updatePassword($data['password']);
        }

        $user->setActive($data['is_active']);

        return $user;
    }

    /**
     * Update admin profile.
     *
     * @param User $user
     * @return void
     */
    public function updateAdmin(User $user)
    {
        // Prompt for superadmin
        $is_superadmin = $this->confirm('Should I make the user a "superadmin"?', $user->profile->is_superadmin ?? false);

        // Update admin profile
        $user->profile->update([
            'is_superadmin' => $is_superadmin,
        ]);
    }

    /**
     * Update web profile.
     *
     * @param User $user
     * @return void
     */
    public function updateWeb(User $user)
    {
        // Prompt for firstname
        $firstname = $this->askSafe('What is the user "firstname"?');

        // Prompt for lastname
        $lastname = $this->askSafe('What is the user "lastname"?');

        // Update web profile
        $user->profile->update([
            'firstname' => $firstname,
            'lastname' => $lastname,
        ]);
    }
}
