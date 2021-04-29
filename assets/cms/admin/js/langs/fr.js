'use strict';

import endsWith from 'lodash/endsWith';
import trim from 'lodash/trim';
import trimEnd from 'lodash/trimEnd';

import formatNum from 'lib/js/utils/formatNum';

const fr = {
    router: {
        home: `/`,
        login: `/se-connecter`,
        posts: `/posts/:type`,
        post: `/posts/:type/:id`,
        posts_types: `/posts-types`,
        post_type: `/posts-types/:id`,
        contacts: `/contacts`,
        users: `/utilisateurs`,
        user: `/utilisateurs/:id`,
    },
    menu: {
        icons: {
            website: `Site web`,
            logout: `Déconnexion`,
        },
    },
    sidebar: {
        title: `Admin`,
        items: {
            contacts: `Contacts`,
            users: `Utilisateurs`,
            posts_types: `Posts types`,
        },
    },
    types: {
        page: `Page`,
        translation: `Traduction`,
    },
    login: {
        seo: {
            title: `Panel admin`,
        },
        header: {
            title: `Panel admin`,
            subtitle: `Bienvenue`,
        },
        fields: {
            email: `Nom d'utilisateur`,
            password: `Mot de passe`,
        },
        buttons: {
            login: `Se connecter`,
        },
        messages: {
            failed: `Login failed.`,
        },
    },
    logged_out: {
        seo: {
            title: `Session expirée`,
        },
        header: {
            title: `Session expirée`,
            subtitle: `Veuillez vous reconnecter`,
            button: `Connexion`,
        },
    },
    superadmin_out: {
        seo: {
            title: `Accès non autorisé`,
        },
        header: {
            title: `Accès non autorisé`,
            subtitle: `Cet accès n'est pas autorisé`,
            button: `Retour`,
        },
    },
    dashboard: {
        seo: {
            title: `Dashboard`,
        },
        header: {
            title: `Dashboard`,
        },
    },
    posts: {
        seo: {
            title: (type) => `Posts "${type?.toLowerCase()}"`,
        },
        header: {
            title: (type) => `Liste des posts "${type?.toLowerCase()}"`,
        },
    },
    post: {
        seo: {
            title_create: (type) => `Nouveau post "${type?.toLowerCase()}"`,
            title_update: (name) => `Post "${name}"`,
        },
        header: {
            title_create: (type) => `Créer un nouveau post "${type?.toLowerCase()}"`,
            title_update: (name, isActive) =>
                `Editer le post "${name}"${
                    isActive === null
                        ? ''
                        : ` (${
                              isActive === true
                                  ? '<span class="text-success">actif</span>'
                                  : '<span class="text-warning">inactif</span>'
                          })`
                }`,
        },
        tabs: {
            details: `Détails`,
        },
        cards: {
            seo: `SEO`,
            details: `Post`,
        },
        fields: {
            title: `Titre`,
            description: `Description`,
            url: `URL`,
            post_id: `Post parent`,
            is_indexable: `Indexable`,
            key: `Clé`,
            reference: `Référence`,
            created_at: `Date de création`,
            updated_at: `Date de modification`,
            visible_at: `Date de début de visiblité`,
            hidden_at: `Date de fin de visiblité`,
            position: `Position`,
            modes: `Cachés`,
            delete_confirmation: `Etes-vous sûr de vouloir supprimer ce groupe ?`,
        },
        messages: {
            create_success: `Le post a été créé.`,
            update_success: `Le post a été mis à jour.`,
            delete_success: `Le post a été supprimé.`,
            delete_confirmation: `Etes-vous sûr de vouloir supprimer ce post ?`,
        },
    },
    posts_types: {
        seo: {
            title: `Posts types`,
        },
        header: {
            title: `List des posts types`,
        },
    },
    post_type: {
        seo: {
            title_create: `Créer un nouveau post type`,
            title_update: (name) => `Editer le post type "${name}"`,
        },
        header: {
            title_create: `Créer un nouveau post type`,
            title_update: (name, isActive) =>
                `Editer le post type "${name}"${
                    isActive === null
                        ? ''
                        : ` (${
                              isActive === true
                                  ? '<span class="text-success">actif</span>'
                                  : '<span class="text-warning">inactif</span>'
                          })`
                }`,
        },
        cards: {
            options: `Options`,
            details: `Details`,
            overrides: `Overrides`,
            conditions: `Conditions`,
        },
        fields: {
            type: `Type`,
            label: `Label`,
            has_key: `Clé`,
            is_page: `Page`,
            is_loaded: `Chargement initial`,
            order: `Classement`,
            required: `Champs requis`,
            modes: `Champs cachés`,
            mode: `Mode`,
            hidden: `Caché`,
            read: `Lecture`,
            update: `Lecture/édition`,
            write: `Lecture/édition/création`,
            created_at: `Date de création`,
            updated_at: `Date de modification`,
            override: `Override`,
            override_key: `Clé`,
            override_value: `Valeur`,
            delete_confirmation: `Etes-vous sûr de vouloir supprimer cet override ?`,
        },
        items: {
            fields: {
                is_required: `Requis`,
                is_superadmin: `Superadmin`,
                is_translatable: `Traduisible`,
                key: `Clé`,
                label: `Label`,
                mode: `Mode`,
                new: `Ajouter...`,
                restrictions: `Restrictions`,
                condition: `Condition`,
                condition_value: `Valeur`,
                condition_match: `Matchs`,
                type: `Type`,
                config: {
                    accept: `Extensions`,
                    cast: `Cast`,
                    count: `Compte exacte`,
                    step: `Steps`,
                    max: `Max`,
                    min: `Min`,
                    type: `Type`,
                    value: `Valeur`,
                    wysiwyg: `WYSIWYG`,
                    posts: {
                        id: `Post type qui est`,
                        key: `Post type dont les items sont`,
                        label: `Post type va afficher`,
                        type: `Post type`,
                    },
                },
                not_valid_uniq: (key) => `${key} (clé doublon)`,
                not_valid_empty: `(clé vide)`,
                delete_confirmation: `Etes-vous sûr de vouloir supprimer ce champs ?`,
                condition_delete_confirmation: `Etes-vous sûr de vouloir supprimer cette condition ?`,
            },
        },
        messages: {
            create_success: `Le post type a été créé.`,
            update_success: `Le post type a été mis à jour.`,
            delete_success: `Le post type a été supprimé.`,
            delete_confirmation: `Etes-vous sûr de vouloir supprimer ce post type ?`,
        },
    },
    users: {
        seo: {
            title: `Utilisateurs`,
        },
        header: {
            title: `Liste des utilisateurs`,
        },
    },
    user: {
        seo: {
            title_create: `Créer un nouvel utilisateur`,
            title_update: (name) => `Editer l'utilisateur "${name}"`,
        },
        header: {
            title_create: `Créer un nouvel utilisateur`,
            title_update: (name, isActive) =>
                `Editer l'utilisateur "${name}"${
                    isActive === null
                        ? ''
                        : ` (${
                              isActive === true
                                  ? '<span class="text-success">actif</span>'
                                  : '<span class="text-warning">inactif</span>'
                          })`
                }`,
        },
        cards: {
            infos: `Informations`,
            details: `Details`,
        },
        fields: {
            firstname: `Prénom`,
            lastname: `Nom`,
            email: `Email`,
            lang_id: `Langue de communication`,
            password: `Mot de passe`,
            password_placeholder: `Laisser vide pour ne pas mettre à jour`,
            created_at: `Date de création`,
            updated_at: `Date de modification`,
            last_connected_at: `Date de connexion`,
            address: {
                name: `Nom de l'adresse`,
                firstname: `Prénom`,
                lastname: `Nom`,
                street: `Nom de la rue, numéro`,
                zip: `Code postal`,
                city: `Ville`,
                country: `Pays`,
            },
        },
        buttons: {
            new_password: `Générer et envoyer un nouveau mot de passe`,
            forgotten_password: `Envoyer un lien de récupération du mot de passe`,
        },
        messages: {
            create_success: `L'utilisateur a été créé avec succès.`,
            update_success: `L'utilisateur a été mis à jour.`,
            password_create: `Un email contenant un lien d'activation va être envoyé à l'utilisateur lorsque celui-ci sera créé.`,
            password_active: `Vous pourrez gérer le mot de passe de l'utilisateur une fois celui-ci activé.`,
            new_password_success: `Un email contenant le nouveau mot de passe a été envoyé à l'utilisateur.`,
            new_password_confirmation: `Etes-vous sûr de vouloir mettre à jour le mot de passe de l'utilisateur ?`,
            forgotten_password_success: `Un email contenant un lien de récupération du mot de passe a été envoyé à l'utilisateur.`,
            forgotten_password_confirmation: `Etes-vous sûr de vouloir envoyer un email de récupération de mot de passe à utilisateur ?`,
            delete_success: `L'utilisateur a été supprimé.`,
            delete_confirmation: `Etes-vous sûr de vouloir supprimer cet utilisateur ?`,
        },
    },
    countries: {
        seo: {
            title: `Pays`,
        },
        header: {
            title: `Liste des pays`,
        },
    },
    country: {
        seo: {
            title: `Editer le pays`,
        },
        header: {
            title: `Editer le pays`,
        },
        cards: {
            details: `Détails`,
        },
        fields: {
            code: `Code`,
            name: `Nom`,
            tva: `TVA`,
        },
        messages: {
            update_success: `Le pays a été mis à jour.`,
        },
    },
    contacts: {
        general: {
            seo: {
                title: `Contacts`,
            },
            header: {
                title: `Liste des contacts`,
            },
            rows: {
                email: `Email :`,
                date: `Date :`,
            },
        },
    },
    error404: {
        title: `Page non trouvée`,
        message: `La page que vous recherchez n'existe pas ou plus...`,
    },
    price: {
        format: (price) => `CHF ${formatNum(price, 2).replace('.00', '.-')}`,
        range: (min, max) => `De ${min} à ${max}`,
    },
    pagination: {
        load_more: `Charger plus`,
        empty: `Il n'y a aucun résultat`,
        refresh: `Rafraichir`,
        orders: {
            created_at_1: `Date de création DESC`,
            created_at_0: `Date de création ASC`,
            updated_at_1: `Date de mise à jour DESC`,
            updated_at_0: `Date de mise à jour ASC`,
            reference_1: `Référence DESC`,
            reference_0: `Référence ASC`,
            firstname_1: `Prénom DESC`,
            firstname_0: `Prénom ASC`,
            lastname_1: `Nom DESC`,
            lastname_0: `Nom ASC`,
            email_1: `Email DESC`,
            email_0: `Email ASC`,
            type_1: `Type DESC`,
            type_0: `Type ASC`,
        },
        filters: {
            search: `Rechercher`,
            order: `Trier`,
            parent: `Post parent`,
        },
    },
    inputs: {
        empty: `Vide`,
        upload_file: `Uploader un fichier`,
        placeholder_search: `Rechercher`,
        message_reset: `Etes-vous sûr de vouloir réinitialiser tous les champs ?`,
        message_update: `Etes-vous sûr de vouloir mettre à jour tous les champs ?`,
        message_unsaved: `Vos changements n'ont pas été sauvegardés. Si vous souhaitez continuer, vous perdrez toutes vos modifications. Voulez-vous poursuivre ?`,
        message_create_loading: `Création en cours....`,
        message_update_loading: `Mise à jour en cours....`,
        message_delete_file: `Etes-vous sûr de vouloir supprimer ce fichier ?`,
        message_error_fields: `Il y a des erreurs dans le formulaire. Certains champs sont manquants ou incorrect.`,
        message_loading_content: `Chargement du contenu...`,
        message_no_content: `Rien a afficher`,
    },
    messages: {
        logout: `Etes-vous sûr de vouloir vous déconnecter ?`,
    },
    errors: {
        general: `Une erreur est survenue.`,
        unauthorized: `Accès non autorisé.`,
        disconnected: `Vous avez été déconnecté. Veuillez s'il vous plait vous reconnecter.`,
        version: `Une nouvelle version de la plateforme est disponible. Veuillez s\'il vous plait rafraichir la page.`,
    },
    dates: {
        dd_m_d: `EEEE dd.MM`,
        dd_m_d_h_m: `EEEE dd.MM HH:mm`,
        dd_m_d_y: `EEEE dd.MM yyyy`,
        dd_m_d_y_h_m: `EEEE dd.MM yyyy HH:mm`,
        dd_mm_d_y_h_m: `EEEE dd MMMM yyyy HH:mm`,
        m_d: `dd.MM`,
        dd: `EEEE`,
        dt: `yyyy-MM-dd HH:mm:ss`,
        d: `yyyy-MM-dd`,
        today: (time) => trim(`aujourd'hui ${time ?? ''}`),
        tomorrow: (time) => trim(`demain ${time ?? ''}`),
        yesterday: (time) => trim(`hier ${time ?? ''}`),
        the: (date) => trim(`le ${date ?? ''}`),
        to: (time) => trim(`à ${time ?? ''}`),
    },
    plural: {
        one: (word) =>
            endsWith(word, 's') === true ? trimEnd(word, 's') : endsWith(word, 'x') === true ? trimEnd(word, 'x') : word,
        many: (word) =>
            endsWith(word, 'eu') === true
                ? `${word}x`
                : endsWith(word, 's') === false && endsWith(word, 'x') === false
                ? `${word}s`
                : word,
    },
    words: {
        active: `Actif`,
        add: `Ajouter`,
        all: `Tous`,
        apply: `Appliquer`,
        at: `A`,
        back: `Retour`,
        block: `Bloquer`,
        blocked: `Débloquer`,
        call: `Appeler`,
        cancel: `Annuler`,
        checking_dot: `En vérification...`,
        close: `Fermer`,
        confirm: `Confirmer`,
        connecting: `Connection`,
        contact: `Contact`,
        create: `Créer`,
        delete: `Supprimer`,
        done: `Terminé`,
        download: `Télécharger`,
        edit: `Editer`,
        empty: `Vide`,
        error: `Erreur`,
        export: `Exporter`,
        from: `De`,
        inactive: `Inactif`,
        info: `Informations`,
        invisible: `Non visible`,
        loading: `Chargement`,
        loading_dot: `Chargement...`,
        login: `Se connecter`,
        logout: `Se déconnecter`,
        manage: `Manager`,
        month: `Mois`,
        more: `Plus`,
        new: `Nouveau`,
        no: `Non`,
        ok: `OK`,
        or: `Ou`,
        order_by: `Ordre part`,
        publish: `Publier`,
        published: `Publié`,
        read_only: `Lecture seule`,
        refresh: `Rafraichir`,
        remove: `Retirer`,
        register: `Enregister`,
        registered: `Enregisté`,
        reset: `Réinitialiser`,
        reset_all: `Tout réinitialiser`,
        restart: `Recommencer`,
        save: `Sauver`,
        search: `Rechercher`,
        select: `Sélectionner`,
        select_all: `Tout sélectionner`,
        send: `Envoer`,
        signin: `S'enregister`,
        signout: `Se désenregister`,
        submit: `Envoyer`,
        subscribe: `S'inscrire`,
        success: `Succès`,
        today: `Aujourd'hui`,
        to: `A`,
        unblock: `Débloquer`,
        update: `Mettre à jour`,
        update_all: `Tout mettre à jour`,
        updating: `Mise à jour`,
        updating_dot: `Mise à jour...`,
        unpublish: `Dépublier`,
        unpublished: `Dépublié`,
        warning: `Attention`,
        yes: `Oui`,
        yesterday: `Hier`,
        bool: {
            false: `Non`,
            true: `Oui`,
        },
        custom: {
            make_active: `Rendre actif`,
            make_inactive: `Rendre inactif`,
        },
    },
};

export default fr;
