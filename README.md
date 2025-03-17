
# JenCity API

API pour l'application JenCity, permettant de découvrir et d'explorer la région de Jendouba en Tunisie.

## 📋 Fonctionnalités

- Authentification des utilisateurs (locale et OAuth avec Clerk)
- Gestion des lieux touristiques
- Événements et réservations
- Système d'avis et notations
- Messagerie entre utilisateurs
- Promotions et offres spéciales

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- npm ou yarn

### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/jencity-api.git
   cd jencity-api
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   DB_HOST=localhost
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=myapp_database1
   PORT=3000
   SESSION_SECRET=votre_secret_de_session
   JWT_SECRET=votre_secret_jwt
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. Initialisez la base de données :
   ```bash
   npm run init-db
   ```

5. Générez la documentation API :
   ```bash
   npm run generate-docs
   ```

6. Démarrez le serveur :
   ```bash
   npm start
   ```

Le serveur sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

La documentation API est disponible à l'adresse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) après le démarrage du serveur.

Elle comprend :
- Une liste complète des endpoints API
- Des exemples de requêtes et réponses
- Un diagramme de classes des entités
- Des instructions pour tester avec Postman

## 📝 Utilisation de l'API

### Exemple d'inscription d'un utilisateur

```javascript
fetch('http://localhost:3000/api/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    password: 'motdepasse123'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));
```

### Exemple de récupération des lieux

```javascript
fetch('http://localhost:3000/api/places', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));
```

## 🛠️ Scripts disponibles

- `npm start` : Démarre le serveur
- `npm run dev` : Démarre le serveur en mode développement avec nodemon
- `npm run init-db` : Initialise la base de données
- `npm run generate-docs` : Génère la documentation API

## 📝 Licence

Ce projet est sous licence MIT.
