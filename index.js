
/**
 * Point d'entrée principal de l'application JenCity
 * 
 * Ce fichier initialise le serveur Express et démarre l'application.
 */
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors/safe');

// Charger les variables d'environnement
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Journalisation des requêtes en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to JendoubaLife API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Routes API
const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const messagerieRoutes = require('./routes/messagerieRoutes');

// Enregistrer les routes
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/messagerie', messagerieRoutes);

// Servir la documentation API
app.use('/api-docs', express.static(path.join(__dirname, 'docs')));
app.use('/documentation', express.static(path.join(__dirname, 'documentation_api.html')));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(colors.red(`❌ Erreur: ${err.message}`));
  res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(colors.cyan(`
╭────────────────────────────────────────────────╮
│                                                │
│   🚀 Serveur JenCity démarré!                  │
│   📡 Port: ${PORT}                               │
│   🌐 Mode: ${process.env.NODE_ENV || 'development'}                        │
│                                                │
│   📘 Documentation API:                         │
│   http://localhost:${PORT}/api-docs               │
│                                                │
╰────────────────────────────────────────────────╯
  `));
});

// Capture des erreurs non gérées
process.on('unhandledRejection', (err) => {
  console.error(colors.red('❌ Erreur non gérée:'), err);
  process.exit(1);
});
