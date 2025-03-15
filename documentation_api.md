# Documentation de l'API JendoubaLife

Date de génération: 15/03/2025

## API Utilisateurs

### POST `/api/user/register`

- **Description**: Endpoint pour créer un(e) nouveau(elle) user
- **Accès**: Public
- **Paramètres**: nom: Nom de l'utilisateur, prenom: Prénom de l'utilisateur, email: Adresse email, password: Mot de passe
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/user/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### POST `/api/user/login`

- **Description**: Endpoint pour créer un(e) nouveau(elle) user
- **Accès**: Public
- **Paramètres**: email: Adresse email, password: Mot de passe
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/user/me`

- **Description**: Endpoint pour lister les users
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/user/me', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/user/`

- **Description**: Endpoint pour lister les users
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/user', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PUT `/api/user/:id`

- **Description**: Endpoint pour mettre à jour un(e) user existant(e)
- **Accès**: Utilisateur authentifié
- **Paramètres**: id: ID du/de la user
- **Exemple de test**:
```
// Exemple de requête PUT
fetch('http://localhost:3000/api/user/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### DELETE `/api/user/:id`

- **Description**: Endpoint pour supprimer un(e) user
- **Accès**: Utilisateur authentifié
- **Paramètres**: id: ID du/de la user
- **Exemple de test**:
```
// Exemple de requête DELETE
fetch('http://localhost:3000/api/user/1', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PATCH `/api/user/:id/status`

- **Description**: Endpoint pour mettre à jour partiellement un(e) user
- **Accès**: Utilisateur authentifié
- **Paramètres**: id: ID du/de la user
- **Exemple de test**:
```
// Exemple de requête PATCH
fetch('http://localhost:3000/api/user/1/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "status": "actif"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## API Lieux

### GET `/api/placechemin non détecté`

- **Description**: Endpoint pour lister les places
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/placechemin non détecté`

- **Description**: Endpoint pour lister les places
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/placechemin non détecté`

- **Description**: Endpoint pour lister les places
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/placechemin non détecté`

- **Description**: Endpoint pour lister les places
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/placechemin non détecté`

- **Description**: Endpoint pour lister les places
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/placechemin non détecté`

- **Description**: Endpoint pour lister les places
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### POST `/api/placechemin non détecté`

- **Description**: Endpoint pour créer un(e) nouveau(elle) place
- **Accès**: Utilisateur authentifié
- **Paramètres**: nom_place: Nom du lieu, description: Description du lieu, location: Adresse, longitude: Coordonnée longitude, latitude: Coordonnée latitude, category: Catégorie du lieu
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "nom_place": "Café des Artistes",
  "description": "Un café confortable au cœur de Jendouba",
  "location": "123 Rue Principale, Jendouba",
  "longitude": 8.7767,
  "latitude": 36.5014,
  "category": "restaurants"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PUT `/api/placechemin non détecté`

- **Description**: Endpoint pour mettre à jour un(e) place existant(e)
- **Accès**: Utilisateur authentifié
- **Paramètres**: nom_place: Nom du lieu, description: Description du lieu, location: Adresse, longitude: Coordonnée longitude, latitude: Coordonnée latitude, category: Catégorie du lieu
- **Exemple de test**:
```
// Exemple de requête PUT
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "nom_place": "Café des Artistes",
  "description": "Un café confortable au cœur de Jendouba",
  "location": "123 Rue Principale, Jendouba",
  "longitude": 8.7767,
  "latitude": 36.5014,
  "category": "restaurants"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### DELETE `/api/placechemin non détecté`

- **Description**: Endpoint pour supprimer un(e) place
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête DELETE
fetch('http://localhost:3000/api/placechemin non détecté', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## API Événements

### GET `/api/eventchemin non détecté`

- **Description**: Endpoint pour lister les events
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/eventchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/eventchemin non détecté`

- **Description**: Endpoint pour lister les events
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/eventchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/eventchemin non détecté`

- **Description**: Endpoint pour lister les events
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/eventchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### POST `/api/eventchemin non détecté`

- **Description**: Endpoint pour créer un(e) nouveau(elle) event
- **Accès**: Utilisateur authentifié
- **Paramètres**: title: Titre de l'événement, place_id: ID du lieu associé, start_date: Date de début, end_date: Date de fin, price: Prix (optionnel)
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/eventchemin non détecté', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "title": "Festival de Musique",
  "place_id": 1,
  "start_date": "2023-08-15T18:00:00",
  "end_date": "2023-08-15T23:00:00",
  "price": 15.5
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PUT `/api/eventchemin non détecté`

- **Description**: Endpoint pour mettre à jour un(e) event existant(e)
- **Accès**: Utilisateur authentifié
- **Paramètres**: title: Titre de l'événement, place_id: ID du lieu associé, start_date: Date de début, end_date: Date de fin, price: Prix (optionnel)
- **Exemple de test**:
```
// Exemple de requête PUT
fetch('http://localhost:3000/api/eventchemin non détecté', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "title": "Festival de Musique",
  "place_id": 1,
  "start_date": "2023-08-15T18:00:00",
  "end_date": "2023-08-15T23:00:00",
  "price": 15.5
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### DELETE `/api/eventchemin non détecté`

- **Description**: Endpoint pour supprimer un(e) event
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête DELETE
fetch('http://localhost:3000/api/eventchemin non détecté', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## API Réservations

### GET `/api/reservationchemin non détecté`

- **Description**: Endpoint pour lister les reservations
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/reservationchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/reservationchemin non détecté`

- **Description**: Endpoint pour lister les reservations
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/reservationchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/reservationchemin non détecté`

- **Description**: Endpoint pour lister les reservations
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/reservationchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### POST `/api/reservationchemin non détecté`

- **Description**: Endpoint pour créer un(e) nouveau(elle) reservation
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/reservationchemin non détecté', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "place_id": 1,
  "reservation_date": "2023-09-20",
  "start_time": "19:00",
  "end_time": "21:00",
  "num_guests": 4
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PUT `/api/reservationchemin non détecté`

- **Description**: Endpoint pour mettre à jour un(e) reservation existant(e)
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête PUT
fetch('http://localhost:3000/api/reservationchemin non détecté', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "place_id": 1,
  "reservation_date": "2023-09-20",
  "start_time": "19:00",
  "end_time": "21:00",
  "num_guests": 4
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### DELETE `/api/reservationchemin non détecté`

- **Description**: Endpoint pour supprimer un(e) reservation
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête DELETE
fetch('http://localhost:3000/api/reservationchemin non détecté', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## API Avis

### GET `/api/reviewchemin non détecté`

- **Description**: Endpoint pour lister les reviews
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/reviewchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/reviewchemin non détecté`

- **Description**: Endpoint pour lister les reviews
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/reviewchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### POST `/api/reviewchemin non détecté`

- **Description**: Endpoint pour créer un(e) nouveau(elle) review
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/reviewchemin non détecté', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "place_id": 1,
  "rating": 4.5,
  "comment": "Excellent service et cadre agréable."
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PUT `/api/reviewchemin non détecté`

- **Description**: Endpoint pour mettre à jour un(e) review existant(e)
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête PUT
fetch('http://localhost:3000/api/reviewchemin non détecté', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "place_id": 1,
  "rating": 4.5,
  "comment": "Excellent service et cadre agréable."
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### DELETE `/api/reviewchemin non détecté`

- **Description**: Endpoint pour supprimer un(e) review
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête DELETE
fetch('http://localhost:3000/api/reviewchemin non détecté', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PATCH `/api/reviewchemin non détecté`

- **Description**: Endpoint pour mettre à jour partiellement un(e) review
- **Accès**: Administrateur uniquement
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête PATCH
fetch('http://localhost:3000/api/reviewchemin non détecté', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "place_id": 1,
  "rating": 4.5,
  "comment": "Excellent service et cadre agréable."
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## API Promotions

### GET `/api/promotionchemin non détecté`

- **Description**: Endpoint pour lister les promotions
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/promotionchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/promotionchemin non détecté`

- **Description**: Endpoint pour lister les promotions
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/promotionchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/promotionchemin non détecté`

- **Description**: Endpoint pour lister les promotions
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/promotionchemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### POST `/api/promotionchemin non détecté`

- **Description**: Endpoint pour créer un(e) nouveau(elle) promotion
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/promotionchemin non détecté', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "place_id": 1,
  "title": "Offre Spéciale Été",
  "discount_percent": 15,
  "start_date": "2023-07-01",
  "end_date": "2023-08-31"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### PUT `/api/promotionchemin non détecté`

- **Description**: Endpoint pour mettre à jour un(e) promotion existant(e)
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête PUT
fetch('http://localhost:3000/api/promotionchemin non détecté', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "place_id": 1,
  "title": "Offre Spéciale Été",
  "discount_percent": 15,
  "start_date": "2023-07-01",
  "end_date": "2023-08-31"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### DELETE `/api/promotionchemin non détecté`

- **Description**: Endpoint pour supprimer un(e) promotion
- **Accès**: Utilisateur authentifié
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête DELETE
fetch('http://localhost:3000/api/promotionchemin non détecté', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## API Messagerie

### POST `/api/messageriechemin non détecté`

- **Description**: Endpoint pour créer un(e) nouveau(elle) messagerie
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/messageriechemin non détecté', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  "id_destinataire": 2,
  "texte": "Bonjour, avez-vous des disponibilités pour ce week-end?"
})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/messageriechemin non détecté`

- **Description**: Endpoint pour lister les messageries
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/messageriechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/messageriechemin non détecté`

- **Description**: Endpoint pour lister les messageries
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/messageriechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/messageriechemin non détecté`

- **Description**: Endpoint pour lister les messageries
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/messageriechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### GET `/api/messageriechemin non détecté`

- **Description**: Endpoint pour lister les messageries
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête GET
fetch('http://localhost:3000/api/messageriechemin non détecté', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### DELETE `/api/messageriechemin non détecté`

- **Description**: Endpoint pour supprimer un(e) messagerie
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête DELETE
fetch('http://localhost:3000/api/messageriechemin non détecté', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## API Intégration Clerk

### POST `/api/clerk/sync`

- **Description**: Endpoint pour créer un(e) nouveau(elle) clerk
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/clerk/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

### POST `/api/clerk/signout`

- **Description**: Endpoint pour créer un(e) nouveau(elle) clerk
- **Accès**: Public
- **Paramètres**: Aucun paramètre requis
- **Exemple de test**:
```
// Exemple de requête POST
fetch('http://localhost:3000/api/clerk/signout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})
.then(response => response.json())
.then(data => console.log('Réponse:', data))
.catch(error => console.error('Erreur:', error));
```

---

## Tests de l'API

Voici quelques exemples de tests à réaliser pour valider le bon fonctionnement de l'API:

### Test de création d'un compte et connexion

```javascript
// 1. Créer un nouveau compte utilisateur
fetch('http://localhost:3000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    password: 'motdepasse123'
  })
})
.then(response => response.json())
.then(data => console.log('Utilisateur créé:', data))
.catch(error => console.error('Erreur:', error));

// 2. Se connecter avec le compte créé
fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'jean.dupont@example.com',
    password: 'motdepasse123'
  })
})
.then(response => response.json())
.then(data => console.log('Connexion réussie:', data))
.catch(error => console.error('Erreur:', error));

```

