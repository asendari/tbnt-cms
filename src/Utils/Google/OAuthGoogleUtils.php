<?php

namespace Tbnt\Cms\Utils\Google;

use Google_Client;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class OAuthGoogleUtils
{
    /**
     * Access token name
     *
     * @var string
     */
    private static $access_token_name = 'access_token.json';

    /**
     * Init Google application credentials
     *
     * @return void
     */
    private static function initConfigEnv()
    {
        if (getenv('GOOGLE_APPLICATION_CREDENTIALS') === false) {
            putenv('GOOGLE_APPLICATION_CREDENTIALS=' . self::getConfigPath());
        }
    }

    /**
     * Get Google config file path
     *
     * @return string
     */
    private static function getConfigPath()
    {
        return base_path(config('services.google.service_accounts.key'));
    }

    /**
     * Get Google asserted user
     *
     * @return string
     */
    private static function getAssertedUser()
    {
        return config('services.google.service_accounts.asserted_user');
    }

    /**
     * Get Google asserted user
     *
     * @return string
     */
    private static function isReadOnly()
    {
        return config('services.google.service_accounts.read_only');
    }

    /**
     * Get storage
     *
     * @return FilesystemAdapter
     */
    private static function getStorage()
    {
        return Storage::disk('google');
    }

    /**
     * Get stored token
     *
     * @return string|bool
     * @throws FileNotFoundException
     */
    private static function getToken()
    {
        return self::getStorage()->exists(self::$access_token_name) === true
            ? self::getStorage()->get(self::$access_token_name)
            : false;
    }

    /**
     * Store token
     *
     * @param string $content Token content
     * @return string|bool
     * @throws FileNotFoundException
     */
    private static function putToken(string $content)
    {
        self::getStorage()->put(self::$access_token_name, $content);

        return self::getToken();
    }

    /**
     * Request token
     *
     * @param array $scopes Google Client scopes
     * @param array $claims
     * @return string
     */
    private static function requestToken($scopes = [], $claims = [])
    {
        $access_token = json_decode(file_get_contents(self::getConfigPath()), true);

        $header = [
            'alg' => 'RS256',
            'typ' => 'JWT',
        ];

        $claim_set = array_merge($claims, [
            'iss' => $access_token['client_email'],
            'scope' => join(',', to_array($scopes)),
            'aud' => 'https://oauth2.googleapis.com/token',
            'exp' => strtotime('+1 hour'),
            'iat' => strtotime('now'),
        ]);

        $assertion = [
            rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '='),
            rtrim(strtr(base64_encode(json_encode($claim_set)), '+/', '-_'), '='),
        ];

        $signature = null;
        $result = openssl_sign(
            join('.', $assertion),
            $signature,
            openssl_pkey_get_private($access_token['private_key']),
            'sha256'
        );

        if ($result === true) {
            $assertion[] = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
        }

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
        curl_setopt(
            $ch,
            CURLOPT_POSTFIELDS,
            http_build_query([
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => join('.', $assertion),
            ])
        );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        curl_close($ch);

        return json_decode($response, true);
    }

    /**
     * Request token to impersonate user
     *
     * @param array $scopes Google Client scopes
     * @return string
     */
    private static function requestTokenImpersonate($scopes = [])
    {
        return self::requestToken($scopes, ['sub' => self::getAssertedUser()]);
    }

    /**
     * Get client
     *
     * @param array $scopes Google Client scopes
     * @return Google_Client
     */
    public static function getClient($scopes = [])
    {
        self::initConfigEnv();

        $client = new Google_Client();
        $client->useApplicationDefaultCredentials();

        foreach (to_array($scopes) as $scope) {
            $client->addScope($scope);
        }

        return $client;
    }

    /**
     * Get client to impersonate user
     *
     * @param array $scopes Google Client scopes
     * @return Google_Client
     */
    public static function getClientImpersonate($scopes = [])
    {
        $client = self::getClient($scopes);
        $client->setSubject(self::getAssertedUser());

        return $client;

        // self::initConfigEnv();

        // $client = new Google_Client();

        // $access_token = self::getToken();

        // if ($access_token !== false) {
        // 	$client->setAccessToken(json_decode($access_token, true));
        // }

        // if ($client->isAccessTokenExpired() === true) {
        // 	if ($client->getRefreshToken() === true) {
        // 		$client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        // 	}
        // 	else {
        // 		$access_token = self::requestTokenImpersonate($scopes);

        // 		if (array_key_exists('error', $access_token)) throw new \Exception(join(', ', $access_token));

        // 		$client->setAccessToken($access_token);
        // 	}

        // 	self::putToken(json_encode($client->getAccessToken()));
        // }

        // $is_readonly = self::isReadOnly();

        // foreach (to_array($scopes) as &$scope) $client->addScope($scope.($is_readonly === true ? '.readonly' : ''));

        // return $client;
    }
}
