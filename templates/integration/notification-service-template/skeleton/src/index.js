/**
 * ${{ values.projectName }} - Notification Service
 *
 * Ce service envoie des notifications au Chatbot.
 * Généré par Backstage Template
 */

require('dotenv').config();
const axios = require('axios');

// Configuration
const CHATBOT_URL = process.env.CHATBOT_URL || '${{ values.chatbotUrl }}';
const NOTIFICATION_ENDPOINT = `${CHATBOT_URL}/api/notifications`;

/**
 * Envoie une notification au Chatbot
 * @param {Object} notification - La notification à envoyer
 * @param {string} notification.title - Titre de la notification
 * @param {string} notification.message - Message de la notification
 * @param {string} notification.type - Type: info, success, warning, error
 * @param {Object} notification.metadata - Métadonnées additionnelles
 * @returns {Promise<Object>} La réponse du serveur
 */
async function sendNotification({ title, message, type = 'info', metadata = {} }) {
  try {
    console.log(`[NotificationService] Envoi de la notification vers ${NOTIFICATION_ENDPOINT}`);
    console.log(`[NotificationService] Titre: ${title}`);
    console.log(`[NotificationService] Type: ${type}`);

    const response = await axios.post(NOTIFICATION_ENDPOINT, {
      title,
      message,
      type,
      metadata: {
        ...metadata,
        source: '${{ values.projectName }}',
        timestamp: new Date().toISOString()
      }
    });

    if (response.data.success) {
      console.log(`[NotificationService] ✅ Notification envoyée avec succès!`);
      console.log(`[NotificationService] ID: ${response.data.notification.id}`);
      return response.data;
    } else {
      console.error(`[NotificationService] ❌ Erreur: ${response.data.error}`);
      throw new Error(response.data.error);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error(`[NotificationService] ❌ Impossible de se connecter au chatbot à ${CHATBOT_URL}`);
      console.error(`[NotificationService] Vérifiez que le chatbot est démarré.`);
    } else if (error.response) {
      console.error(`[NotificationService] ❌ Erreur HTTP ${error.response.status}: ${error.response.data?.error}`);
    } else {
      console.error(`[NotificationService] ❌ Erreur: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fonction principale - Exemple d'utilisation
 */
async function main() {
  console.log(`\n🔔 ========================================`);
  console.log(`   ${{ values.projectName }}`);
  console.log(`   Notification Service pour Chatbot`);
  console.log(`========================================\n`);

  // Configuration de la notification par défaut
  const notification = {
    title: process.env.NOTIFICATION_TITLE || '${{ values.notificationTitle }}',
    message: process.env.NOTIFICATION_MESSAGE || '${{ values.notificationMessage }}',
    type: process.env.NOTIFICATION_TYPE || '${{ values.notificationType }}',
    metadata: {
      project: '${{ values.projectName }}',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }
  };

  try {
    const result = await sendNotification(notification);
    console.log(`\n✅ Succès! La notification est visible dans le chatbot.`);
    console.log(`   ID: ${result.notification.id}`);
    console.log(`   Timestamp: ${result.notification.timestamp}\n`);

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Échec de l'envoi de la notification.\n`);
    process.exit(1);
  }
}

// Exporter pour les tests
module.exports = { sendNotification };

// Exécuter si appelé directement
if (require.main === module) {
  main();
}