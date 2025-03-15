
/**
 * Utilitaire de génération de documentation API
 * Permet de créer un fichier récapitulatif de toutes les routes API
 */
const fs = require('fs');
const path = require('path');

// Liste des routes principales à documenter
const routeFiles = [
  { file: 'userRoutes.js', name: 'Utilisateurs' },
  { file: 'placeRoutes.js', name: 'Lieux' },
  { file: 'eventRoutes.js', name: 'Événements' },
  { file: 'reservationRoutes.js', name: 'Réservations' },
  { file: 'reviewRoutes.js', name: 'Avis' },
  { file: 'promotionRoutes.js', name: 'Promotions' },
  { file: 'messagerieRoutes.js', name: 'Messagerie' },
  { file: 'clerkRoutes.js', name: 'Intégration Clerk' }
];

// Fonction pour générer la documentation
const generateApiDoc = () => {
  // En-tête du document
  let docContent = `# Documentation de l'API JendoubaLife\n\n`;
  docContent += `Date de génération: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
  
  // Itérer sur chaque fichier de routes
  routeFiles.forEach(route => {
    try {
      const routePath = path.join(__dirname, '..', 'routes', route.file);
      const routeContent = fs.readFileSync(routePath, 'utf8');
      
      docContent += `## API ${route.name}\n\n`;
      
      // Extraire les routes des fichiers
      const routeLines = routeContent.split('\n');
      const endpoints = [];
      
      routeLines.forEach(line => {
        // Détecter les définitions de routes
        if (line.match(/router\.(get|post|put|delete|patch)/i)) {
          const method = line.match(/router\.(get|post|put|delete|patch)/i)[1].toUpperCase();
          const pathMatch = line.match(/'([^']+)'/);
          const path = pathMatch ? pathMatch[1] : 'chemin non détecté';
          
          // Déterminer si la route est protégée
          const isProtected = line.includes('protect');
          const isAdmin = line.includes('admin');
          
          endpoints.push({
            method,
            path,
            protected: isProtected,
            admin: isAdmin
          });
        }
      });
      
      // Formater les endpoints pour le document
      endpoints.forEach(endpoint => {
        docContent += `### ${endpoint.method} \`/api/${route.file.replace('Routes.js', '')}${endpoint.path}\`\n\n`;
        docContent += `- **Description**: Endpoint pour ${getEndpointDescription(route.file, endpoint)}\n`;
        docContent += `- **Accès**: ${endpoint.protected ? (endpoint.admin ? 'Administrateur uniquement' : 'Utilisateur authentifié') : 'Public'}\n`;
        docContent += `- **Paramètres**: ${getEndpointParams(route.file, endpoint)}\n`;
        docContent += `- **Exemple de test**:\n\`\`\`\n${getTestExample(route.file, endpoint)}\n\`\`\`\n\n`;
      });
      
      docContent += `---\n\n`;
      
    } catch (error) {
      docContent += `### Erreur lors de l'analyse de ${route.file}: ${error.message}\n\n`;
    }
  });
  
  // Ajouter une section pour les tests
  docContent += `## Tests de l'API\n\n`;
  docContent += `Voici quelques exemples de tests à réaliser pour valider le bon fonctionnement de l'API:\n\n`;
  
  // Exemples de tests de bout en bout
  docContent += `### Test de création d'un compte et connexion\n\n`;
  docContent += "```javascript\n";
  docContent += `// 1. Créer un nouveau compte utilisateur
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
\n`;
  docContent += "```\n\n";
  
  // Écriture du fichier
  const outputPath = path.join(__dirname, '..', 'documentation_api.md');
  fs.writeFileSync(outputPath, docContent);
  
  console.log(`✅ Documentation API générée avec succès: ${outputPath}`);
  return outputPath;
};

// Fonctions utilitaires pour générer des descriptions et exemples
function getEndpointDescription(routeFile, endpoint) {
  const baseName = routeFile.replace('Routes.js', '');
  
  if (endpoint.method === 'GET') {
    if (endpoint.path.includes(':id')) return `récupérer un(e) ${baseName} spécifique`;
    return `lister les ${baseName}s`;
  }
  if (endpoint.method === 'POST') return `créer un(e) nouveau(elle) ${baseName}`;
  if (endpoint.method === 'PUT') return `mettre à jour un(e) ${baseName} existant(e)`;
  if (endpoint.method === 'DELETE') return `supprimer un(e) ${baseName}`;
  if (endpoint.method === 'PATCH') return `mettre à jour partiellement un(e) ${baseName}`;
  
  return `interagir avec les ${baseName}s`;
}

function getEndpointParams(routeFile, endpoint) {
  const baseName = routeFile.replace('Routes.js', '');
  
  // Définition des paramètres communs selon le type de route
  let params = [];
  
  if (endpoint.path.includes(':id')) {
    params.push(`id: ID du/de la ${baseName}`);
  }
  
  if (routeFile === 'userRoutes.js') {
    if (endpoint.method === 'POST' && endpoint.path.includes('register')) {
      params = ['nom: Nom de l\'utilisateur', 'prenom: Prénom de l\'utilisateur', 'email: Adresse email', 'password: Mot de passe'];
    } else if (endpoint.method === 'POST' && endpoint.path.includes('login')) {
      params = ['email: Adresse email', 'password: Mot de passe'];
    }
  } else if (routeFile === 'placeRoutes.js' && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
    params = ['nom_place: Nom du lieu', 'description: Description du lieu', 'location: Adresse', 'longitude: Coordonnée longitude', 'latitude: Coordonnée latitude', 'category: Catégorie du lieu'];
  } else if (routeFile === 'eventRoutes.js' && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
    params = ['title: Titre de l\'événement', 'place_id: ID du lieu associé', 'start_date: Date de début', 'end_date: Date de fin', 'price: Prix (optionnel)'];
  }
  
  return params.length > 0 ? params.join(', ') : 'Aucun paramètre requis';
}

function getTestExample(routeFile, endpoint) {
  const baseName = routeFile.replace('Routes.js', '');
  const baseUrl = `http://localhost:3000/api/${baseName.toLowerCase()}`;
  let url = baseUrl;
  
  if (endpoint.path !== '/') {
    // Remplacer les paramètres dynamiques par des exemples
    url += endpoint.path.replace(/:id/g, '1').replace(/:userId/g, '2');
  }
  
  let example = `// Exemple de requête ${endpoint.method}\n`;
  example += `fetch('${url}', {\n`;
  example += `  method: '${endpoint.method}',\n`;
  example += `  headers: { 'Content-Type': 'application/json' },\n`;
  
  // Ajouter un exemple de corps de requête pour les méthodes POST, PUT et PATCH
  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    let requestBody = {};
    
    if (routeFile === 'userRoutes.js') {
      if (endpoint.path.includes('register')) {
        requestBody = {
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@example.com',
          password: 'motdepasse123'
        };
      } else if (endpoint.path.includes('login')) {
        requestBody = {
          email: 'jean.dupont@example.com',
          password: 'motdepasse123'
        };
      } else if (endpoint.path.includes('status')) {
        requestBody = { status: 'actif' };
      } else {
        requestBody = {
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@example.com'
        };
      }
    } else if (routeFile === 'placeRoutes.js') {
      requestBody = {
        nom_place: 'Café des Artistes',
        description: 'Un café confortable au cœur de Jendouba',
        location: '123 Rue Principale, Jendouba',
        longitude: 8.7767,
        latitude: 36.5014,
        category: 'restaurants'
      };
    } else if (routeFile === 'eventRoutes.js') {
      requestBody = {
        title: 'Festival de Musique',
        place_id: 1,
        start_date: '2023-08-15T18:00:00',
        end_date: '2023-08-15T23:00:00',
        price: 15.5
      };
    } else if (routeFile === 'reviewRoutes.js') {
      requestBody = {
        place_id: 1,
        rating: 4.5,
        comment: 'Excellent service et cadre agréable.'
      };
    } else if (routeFile === 'reservationRoutes.js') {
      requestBody = {
        place_id: 1,
        reservation_date: '2023-09-20',
        start_time: '19:00',
        end_time: '21:00',
        num_guests: 4
      };
    } else if (routeFile === 'promotionRoutes.js') {
      requestBody = {
        place_id: 1,
        title: 'Offre Spéciale Été',
        discount_percent: 15,
        start_date: '2023-07-01',
        end_date: '2023-08-31'
      };
    } else if (routeFile === 'messagerieRoutes.js') {
      requestBody = {
        id_destinataire: 2,
        texte: 'Bonjour, avez-vous des disponibilités pour ce week-end?'
      };
    }
    
    example += `  body: JSON.stringify(${JSON.stringify(requestBody, null, 2)})\n`;
  }
  
  example += `})\n`;
  example += `.then(response => response.json())\n`;
  example += `.then(data => console.log('Réponse:', data))\n`;
  example += `.catch(error => console.error('Erreur:', error));`;
  
  return example;
}

// Exécuter la génération si ce script est appelé directement
if (require.main === module) {
  generateApiDoc();
}

module.exports = { generateApiDoc };
