<?php

return [
    /*
	|--------------------------------------------------------------------------
	| Validation Language Lines
	|--------------------------------------------------------------------------
	|
	| The following language lines contain the default error messages used by
	| the validator class. Some of these rules have multiple versions such
	| as the size rules. Feel free to tweak each of these messages here.
	|
	*/

    'accepted' => 'Le champ :attribute doit être accepté.',
    'active_url' => 'Le champ :attribute n\'est pas une URL valide.',
    'after' => 'Le champ :attribute doit être une date postérieur à :date.',
    'after_or_equal' => 'Le champ :attribute doit être une date postérieur ou égale à :date.',
    'alpha' => 'Le champ :attribute ne doit contenir que les lettres.',
    'alpha_dash' => 'Le champ :attribute ne doit contenir que des letters, nombres et des tirets.',
    'alpha_num' => 'Le champ :attribute ne doit contenir que des lettre et nombres.',
    'array' => 'Le champ :attribute doit être un tableau.',
    'before' => 'Le champ :attribute doit être une date antérieur à :date.',
    'before_or_equal' => 'Le champ :attribute doit être une date antérieur ou égale à :date.',
    'between' => [
        'numeric' => 'Le champ :attribute doit être entre :min et :max.',
        'file' => 'Le champ :attribute doit être entre :min et :max kilobytes.',
        'string' => 'Le champ :attribute doit être entre :min et :max caractèrs.',
        'array' => 'Le champ :attribute doit contenir entre :min et :max éléments.',
    ],
    'boolean' => 'Le champ :attribute doit être vrai ou faux.',
    'confirmed' => 'Le champ :attribute ne correspond pas à la confirmation.',
    'date' => 'Le champ :attribute n\'est pas une date valide.',
    'date_equals' => 'Le champ :attribute doit être une date égale au champ :format.',
    'date_format' => 'Le champ :attribute ne correspond pas au format :format.',
    'different' => 'Le champ :attribute doit être différent du champ :other.',
    'digits' => 'Le champ :attribute doit être un nombre à :digits chiffres.',
    'digits_between' => 'Le champ :attribute doit être un nombre entre :min et :max chiffres.',
    'dimensions' => 'Le champ :attribute a une dimension invalide.',
    'distinct' => 'Le champ :attribute a une valeur double.',
    'email' => 'Le champ :attribute doit être une adresse email valide.',
    'ends_with' => 'Le champ :attribute doit se terminer avec: :values',
    'exists' => 'Le champ :attribute sélectionné est invalide.',
    'file' => 'Le champ :attribute doit être un fichier.',
    'filled' => 'Le champ :attribute est requis.',
    'gt' => [
        'numeric' => 'Le champ :attribute doit être plus grand que :value.',
        'file' => 'Le champ :attribute doit être plus grand que :value kilobytes.',
        'string' => 'Le champ :attribute doit avoir plus de :value caractères.',
        'array' => 'Le champ :attribute doit avoir plus de :value valeurs.',
    ],
    'gte' => [
        'numeric' => 'Le champ :attribute doit être plus grand ou égale à :value.',
        'file' => 'Le champ :attribute doit être plus grand ou égale à :value kilobytes.',
        'string' => 'Le champ :attribute doit avoir :value caractères ou plus.',
        'array' => 'Le champ :attribute doit avoir :value valeurs ou plus.',
    ],
    'image' => 'Le champ :attribute doit être une image.',
    'in' => 'Le champ :attribute a un élément invalide.',
    'in_array' => 'Le champ :attribute n\'existe pas dans le champ tableau :other.',
    'integer' => 'Le champ :attribute doit être un entier.',
    'ip' => 'Le champ :attribute doit être une adresse IP valide.',
    'ipv4' => 'Le champ :attribute doit être une adresse IPv4 valide.',
    'ipv6' => 'Le champ :attribute doit être une adresse IPv6 valide.',
    'json' => 'Le champ :attribute doit être au format JSON valide.',
    'lt' => [
        'numeric' => 'Le champ :attribute doit être plus petit que :value.',
        'file' => 'Le champ :attribute doit être plus petit que :value kilobytes.',
        'string' => 'Le champ :attribute doit avoir moins de :value caractères.',
        'array' => 'Le champ :attribute doit avoir moins de :value valeurs.',
    ],
    'lte' => [
        'numeric' => 'Le champ :attribute doit être plus petit ou égale à :value.',
        'file' => 'Le champ :attribute doit être plus petit ou égale à :value kilobytes.',
        'string' => 'Le champ :attribute doit avoir :value caractères ou moins.',
        'array' => 'Le champ :attribute doit avoir :value valeurs ou moins.',
    ],
    'max' => [
        'numeric' => 'Le champ :attribute ne doit pas être plus grand que :max.',
        'file' => 'Le champ :attribute ne doit pas être plus grand que :max kilobytes.',
        'string' => 'Le champ :attribute ne doit pas être plus grand que :max caractèrs.',
        'array' => 'Le champ :attribute ne doit pas avoir plus de :max éléments.',
    ],
    'mimes' => 'Le champ :attribute doit être un fichier de type :values.',
    'mimetypes' => 'Le champ :attribute doit être un fichier de type :values.',
    'min' => [
        'numeric' => 'Le champ :attribute doit être au moins :min.',
        'file' => 'Le champ :attribute doit être au moins :min kilobytes.',
        'string' => 'Le champ :attribute doit être au moins :min caractèrs.',
        'array' => 'Le champ :attribute doit avoir au moins :min éléments.',
    ],
    'not_in' => 'Le champ :attribute sélectionné est invalide.',
    'not_regex' => 'Le champ :attribute a un format invalide.',
    'numeric' => 'Le champ :attribute doit être au format numérique.',
    'password' => 'Le mot de passe est incorrect.',
    'present' => 'Le champ :attribute doit être présent.',
    'regex' => 'Le champ :attribute a un format invalide.',
    'required' => 'Le champ :attribute est requis.',
    'required_if' => 'Le champ :attribute est requis quand :other égale à :value.',
    'required_unless' => 'Le champ :attribute est requis sauf si :other est dans :values.',
    'required_with' => 'Le champ :attribute est requis quand :values est présent.',
    'required_with_all' => 'Le champ :attribute est requis quand :values sont présents.',
    'required_without' => 'Le champ :attribute est requis quand :values n\'est pas présent.',
    'required_without_all' => 'Le champ :attribute est requis quand :values ne sont pas présents.',
    'same' => 'Le champ :attribute et :other doivent correspondre.',
    'size' => [
        'numeric' => 'Le champ :attribute doit être de :size.',
        'file' => 'Le champ :attribute doit être de :size kilobytes.',
        'string' => 'Le champ :attribute doit être de :size caractèrs.',
        'array' => 'Le champ :attribute doit contenir :size éléments.',
    ],
    'starts_with' => 'Le champ :attribute doit se commencer avec: :values',
    'string' => 'Le champ :attribute doit être une chaine de caractères.',
    'timezone' => 'Le champ :attribute doit être une zone valide.',
    'unique' => 'Le champ :attribute est déjà utilisé.',
    'uploaded' => 'Le champ :attribute a échoué lors de l\'upload.',
    'url' => 'Le champ :attribute a un format invalide.',
    'uuid' => 'Le champ :attribute doit être un UUID valide.',

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines - ValidatorServiceProvider
	|--------------------------------------------------------------------------
	|
	| Custom
	|
	*/

    'carbon' => 'Le champ :attribute doit être une date valide.',
    'date_check' => 'Le champ :attribute doit être :dir à :date.',
    'datetime' => 'Le champ :attribute doit être une date et heure valide.',
    'file_size' => 'Le champ :attribute est trop grand (max ' . media()->getFileMaxSize() / 1024 . 'Mo).',
    'file_update' => 'Le champ :attribute doit être un fichier valide et est requis.',
    'file_update_delete' => 'Le champ :attribute doit être un fichier valide.',
    'file_valid' => 'Le champ :attribute doit être un type de fichier valide.',
    'filled_if' => 'Le champ :attribute est requis quand :other égale à :value.',
    'gender' => 'Le champ :attribute doit être un genre valide.',
    'geocode_success' => 'Le champ :attribute doit être une adresse valide geocodable.',
    'image_dimensions' =>
        'L\'image est trop grande (max ' . media()->getImageMaxWidth() . 'x' . media()->getImageMaxWidth() . 'px).',
    'image_size' => 'L\'image est trop grande (max ' . media()->getImageMaxSize() / 1024 . 'Mo).',
    'is_utf8_malformed' => 'Le champ :attribute a des caractères invalides.',
    'lang_code_exists' => 'Le champ :attribute doit être une langue valide.',
    'lang_id_exists' => 'Le champ :attribute doit être une langue valide.',
    'post_exists' => 'Le champ :attribute doit être un post valide.',
    'post_type' => 'Le champ :attribute doit être un type de post valide.',
    'recaptcha' => 'Une erreur s\'est produite lors de la vérification du reCaptcha. Veuillez s\'il vous plait réessayer.',
    'slug' => 'Le champ :attribute ne doit contenir que des lettres minuscules [a-z] et des traits d\'unions [-].',
    'string_numeric' => 'Le champ :attribute doit être au format numérique ou une chaine de caractères.',
    'time' => 'Le champ :attribute doit être une heure valide.',

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines - Responses
	|--------------------------------------------------------------------------
	|
	| Custom
	|
	*/

    'bad_credentials' => 'Ces informations de connexion n\'existe pas.',
    'csrf_token' => 'La session est invalide. Veuillez vous connecter une nouvelle fois.',
    'logged_out' => 'La session est invalide. Veuillez vous connecter une nouvelle fois.',
    'login_fail' => 'L\'authentification a échoué.',
    'need_reload' => 'La session est invalide. Veuillez vous connecter une nouvelle fois.',
    'not_allowed' => 'La requête n\'est pas disponible.',
    'not_found' => 'La requête n\'existe pas.',
    'old_password' => 'L\'ancien mot de passe est incorrect.',
    'post_too_large' => 'La requête est trop grande.',
    'reset_failed' => 'La récupération du mot de passe a échoué. Le token est invalide ou expiré',
    'token_expired' => 'La session est expirée. Veuillez vous connecter une nouvelle fois.',
    'token_invalid' => 'La session est expirée. Veuillez vous connecter une nouvelle fois.',
    'token_not_provided' => 'La session est invalide. Veuillez vous connecter une nouvelle fois.',

    'user_active' => 'L\'utilisateur est actif.',
    'user_deleted' => 'L\'utilisateur est supprimé.',
    'user_email_exists' => 'L\'email n\'existe pas.',
    'user_email_unique' => 'L\'email est déjà utilisée.',
    'user_id_exists' => 'L\'utilisateur n\'existe pas.',
    'user_inactive' => 'L\'utilisateur n\'est pas actif.',
    'user_is_admin' => 'L\'utilisateur est un admin.',
    'user_is_guest' => 'L\'utilisateur est un invité.',
    'user_not_admin' => 'L\'utilisateur n\'est pas un admin.',
    'user_not_exists' => 'L\'utilisateur n\'existe pas ou l\'authentification a échoué.',
    'user_not_found' => 'La session est invalide. Veuillez vous connecter une nouvelle fois.',
    'user_password' => 'Le mot de passe de l\'utilisateur est incorrect.',
    'user_password_format' =>
        'Le format du mot de passe de l\'utilisateur est invalide: min 6 caracters et au moins une minuscule, une majuscule et un chiffre.',
    'user_platform_malformed' => 'La plateforme de l\'utilisateur n\'existe pas.',
    'user_platform_missing' => 'La plateforme de l\'utilisateur est manquante.',
    'user_status_active' => 'L\'utilisateur est actif.',
    'user_status_banned' => 'L\'utilisateur est banni.',
    'user_status_inactive' => 'L\'utilisateur est inactif.',
    'user_zone_malformed' => 'La zone de l\'utilisateur est manquante.',
    'user_zone_missing' => 'La zone de l\'utilisateur n\'existe pas.',
    'user_zone_not_admin' => 'L\'utilisateur ne peut pas accéder à la zone admin.',

    'file_id_exists' => 'Le fichier n\'existe pas.',
    'image_id_exists' => 'L\'image n\'existe pas.',

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines - Project
	|--------------------------------------------------------------------------
	|
	| Custom
	|
	*/

    'after' => 'après',
    'after_equal' => 'après ou égale',
    'before' => 'avant',
    'before_equal' => 'avant ou égale',
    'something_went_wrong' => 'Un message à afficher.',

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines
	|--------------------------------------------------------------------------
	|
	| Here you may specify custom validation messages for attributes using the
	| convention "attribute.rule" to name the lines. This makes it quick to
	| specify a specific custom language line for a given attribute rule.
	|
	*/

    'custom' => [
        'captcha_response' => [
            'required' => 'Le captcha est requis.',
            'string' => 'Le captcha est invalide.',
        ],
        'deleted_files' => [
            'array' => 'Le champ :attribute n\'est pas au bon format.',
        ],
        'files.*' => [
            'max' => 'Le fichier ne doit pas être plus grand que :max kilobytes.',
        ],
        'image' => [
            'accepted' => 'Une image est requise.',
        ],
        'image.*' => [
            'dimensions' => 'L\'image doit avoir une largeur/hauter max de 2400px.',
            'file' => 'L\'image doit être un fichier image.',
        ],
        'lang' => [
            'accepted' => 'Au moins une langue doit être spécifiée.',
        ],
        'langs_ids' => [
            'array' => 'Le champ :attribute n\'est pas au bon format.',
        ],
        'pdf' => [
            'accepted' => 'Une fichier PDF est requis.',
        ],
        'pdf.*' => [
            'file' => 'Le PDF doit être un fichier PDF.',
        ],
        'users_ids' => [
            'array' => 'Le champ :attribute n\'est pas au bon format.',
        ],
    ],

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Attributes
	|--------------------------------------------------------------------------
	|
	| The following language lines are used to swap attribute place-holders
	| with something more reader friendly such as E-Mail Address instead
	| of "email". This simply helps us make messages a little cleaner.
	|
	*/

    'attributes' => [
        'card_ccv' => 'CCV de la carte',
        'card_month' => 'mois de la carte',
        'card_number' => 'numéro de carte',
        'card_year' => 'année de la carte',
        'comments' => 'remarques',
        'country' => 'pays',
        'credit_card' => 'carte de crédit',
        'date' => 'date',
        'deleted_files' => 'fichiers supprimés',
        'deleted_files.*' => 'fichier supprimé',
        'domain' => 'domaine',
        'email' => 'email',
        'file' => 'fichier',
        'files.*' => 'fichier',
        'firstname' => 'prénom',
        'image' => 'image',
        'is_active' => 'actif',
        'is_admin' => 'administrateur',
        'lang_id' => 'langue',
        'langs_ids' => 'langues',
        'langs_ids.*' => 'langue',
        'language_id' => 'langue',
        'lastname' => 'nom',
        'name' => 'nom complet',
        'new_password' => 'nouveau mot de passe',
        'password' => 'mot de passe',
        'phone' => 'téléphone',
        'position' => 'position',
        'status' => 'statut',
        'street_number' => 'Nom de la rue, numéro',
        'time_end' => 'heure de fin',
        'time_start' => 'heure de début',
        'title' => 'titre',
        'type' => 'type',
        'url' => 'url',
        'user_id' => 'utilisateur',
        'username' => 'nom d\'utilisateur',
        'users_ids' => 'utilisateurs',
        'users_ids.*' => 'utilisateur',
        'website' => 'site internet',
        'zip_city' => 'ZIP, Ville',
    ],
];
