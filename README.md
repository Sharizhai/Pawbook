# Pawbook

![Logo du site Pawbook](https://raw.githubusercontent.com/Sharizhai/Pawbook/refs/heads/main/packages/client/public/Logo_Pawbook.png)

Pawbook est un réseau social destiné aux propriétaires d'animaux de compagnie. Il permet aux utilisateurs de partager des publications, de suivre d'autres utilisateurs, d'interagir avec des animaux, et bien plus encore.

## Table des matières

- Fonctionnalités
- Technologies utilisées
- Installation
- Configuration
- Utilisation
- Tests
- Contribution
- Licence
- Contact
- Remerciements

## Fonctionnalités

- **Création de comptes utilisateurs** : Inscription et connexion sécurisées.
- **Publications** : Partage de photos et de textes avec possibilité de commenter et de liker.
- **Suivi** : Suivez d'autres utilisateurs et découvrez leurs publications ainsi que leurs animaux.
- **Profil d'utilisateur** : Affichez et modifiez votre profil ainsi que celui de vos animaux de compagnie.
- **Notifications** : Restez informé des activités sur vos publications et ceux que vous suivez.

## Technologies utilisées

- **Frontend** : React, Vite, Zustand, Axios
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : MongoDB
- **Validation** : Zod pour la validation des données
- **Sécurité** : Argon2 pour le hachage des mots de passe


## Installation

### Prérequis

Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) et [pnpm](https://pnpm.io/) sur votre machine.

### Cloner le dépôt

```bash
git clone https://github.com/Sharizhai/Pawbook.git
cd pawbook
```

### Installer les dépendances

Pour le frontend :
```bash
cd client
pnpm install
```

Pour le backend :
```bash
cd server
pnpm install
```

## Configuration

Créez un fichier `.env` dans le dossier server en vous basant sur le fichier `.env.example`.
Remplissez les variables d'environnement nécessaires, notamment l'URL de votre base de données MongoDB et les clés secrètes.


## Utilisation

Ce projet utilise un **monorepo** géré avec [pnpm](https://pnpm.io/), ce qui permet de gérer les dépendances pour le frontend et le backend dans un seul dépôt. 

### Lancer le client et le serveur simultanément

Grâce à [concurrently](https://www.npmjs.com/package/concurrently), il est possible de lancer le serveur backend et l'application frontend simultanément avec une seule commande.

### Commande pour démarrer

Pour lancer à la fois le client et le serveur, exécutez la commande suivante à la racine du projet :

```bash
pnpm run dev
```

Cette commande utilisera concurrently pour démarrer les deux applications en parallèle :

    Le client (frontend) : accessible sur http://localhost:3000
    Le serveur (backend) : accessible sur http://localhost:5000



## License

Ce projet est sous la licence MIT. Pour plus de détails, veuillez consulter le fichier LICENSE.


## Acknowledgements

Merci à toutes les personnes qui ont contribué à ce projet, ainsi qu'aux bibliothèques et frameworks qui l'ont rendu possible.