
/**
 * Point d'entrée du serveur
 * 
 * Ce fichier est un simple point d'entrée qui redirige vers le serveur principal
 * à la racine du projet pour faciliter le démarrage avec "node src/server.js"
 */

// Importer et exécuter le serveur depuis le fichier racine
require('../server.js');

console.log('Serveur démarré depuis src/server.js');
