<?php

return [
    /*
	|--------------------------------------------------------------------------
	| ERRORS
	|--------------------------------------------------------------------------
	|
	*/

    'bad_gateway' =>
        'Le serveur, alors qu\'il agissait en tant que passerelle ou proxy, recevait une réponse invalide d\'un serveur entrant auquel il accédait alors qu\'il tentait de répondre à la demande.',
    'bad_request' =>
        'Le serveur ne peut pas ou ne veut pas traiter la demande en raison de quelque chose qui est perçu comme une erreur du client (p. ex. syntaxe malformée de la demande, messages de demande invalides ou acheminement trompeur des demandes).',
    'forbidden' => 'Le serveur a compris la demande mais refuse de l\'autoriser.',
    'method_not_allowed' =>
        'La méthode reçue dans la ligne de requête est connue par le serveur d\'origine mais non supportée par la ressource cible.',
    'page_not_found' =>
        'Le serveur d\'origine n\'a pas trouvé de représentation actuelle pour la ressource cible ou n\'est pas disposé à divulguer son existence.',
    'post_too_large' =>
        'Le serveur refuse de traiter une requête parce que la requête est plus grande que ce que le serveur est prêt ou capable de traiter.',
    'request_timeout' => 'Le serveur n\'a pas reçu de demande complête dans le délai imparti.',
    'server_error' => 'Le serveur s\'est trouvé dans une situation inattendue qui l\'a empêché de répondre à la demande.',
    'service_unavailable' =>
        'Le serveur est actuellement incapable de traiter la demande en raison d\'une surcharge temporaire ou d\'une maintenance planifiée, qui sera probablement atténuée après un certain délai.',
    'token_mismatch' => 'Token CSRF invalide.',
    'too_many_requests' => 'L\'utilisateur a envoyé trop de demandes dans un laps de temps donné ("limitation du débit").',
    'unauthorized' => 'Unauthenticated.',
    'validate' =>
        'Le serveur comprend le type de contenu de l\'entité de requête (par conséquent, un code d\'état 415 Unsupported Media Type est inapproprié) et la syntaxe de l\'entité de requête est correcte (donc un code d\'état 400 Bad Request est inapproprié) mais n\'a pas pu traiter les instructions contenues.',
];
