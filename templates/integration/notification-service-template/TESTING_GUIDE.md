# 🧪 Guide de Test - Système de Notifications

Ce guide explique comment tester le système de notifications de bout en bout.

## 📋 Prérequis

Avant de commencer les tests, assurez-vous que:

1. **Chatbot Backend** est démarré sur le port 8081
2. **Chatbot Frontend** est démarré sur le port 3000
3. **Backstage** est accessible sur le port 7007

## 🚀 Étape 1: Démarrer le Chatbot

```bash
cd ../chatbot

# Démarrer le backend
cd backend
npm install
npm start
# Backend devrait être sur http://localhost:8081

# Dans un nouveau terminal, démarrer le frontend
cd frontend
npm install
npm start
# Frontend devrait être sur http://localhost:3000
```

### Vérification

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Vérifiez que l'interface du chatbot s'affiche
3. **IMPORTANT**: Cherchez la cloche de notification en haut à droite du header
4. La cloche ne devrait avoir aucun badge (0 notifications)

## 🔔 Étape 2: Tester les Endpoints de Notification

### Test 1: Créer une notification via curl

```bash
curl -X POST http://localhost:8081/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test de notification",
    "message": "Ceci est un message de test",
    "type": "success"
  }'
```

**Résultat attendu**:
```json
{
  "success": true,
  "notification": {
    "id": "abc123...",
    "title": "Test de notification",
    "message": "Ceci est un message de test",
    "type": "success",
    "read": false,
    "timestamp": "2024-01-28T10:00:00.000Z"
  }
}
```

### Test 2: Vérifier dans le Frontend

1. Retournez sur http://localhost:3000
2. La cloche devrait maintenant afficher un badge rouge avec "1"
3. Cliquez sur la cloche
4. Un popup devrait s'ouvrir avec votre notification
5. La notification devrait afficher:
   - Une icône ✅ (success)
   - Le titre "Test de notification"
   - Le message "Ceci est un message de test"
   - L'heure "Il y a X secondes"

### Test 3: Marquer comme lu

1. Dans le popup, cliquez sur le bouton ✓ (marquer comme lu)
2. Le badge de la cloche devrait diminuer à "0"
3. La notification devrait rester visible mais ne plus afficher le point bleu

### Test 4: Supprimer une notification

1. Cliquez sur le bouton × (supprimer)
2. La notification devrait disparaître
3. Si c'était la dernière, le message "Aucune notification" devrait apparaître

## 📦 Étape 3: Créer un Service via le Template Backstage

### 3.1 Accéder à Backstage

1. Ouvrez http://localhost:7007
2. Cliquez sur "Create" dans le menu
3. Cherchez le template "🔔 Notification Service"
4. Cliquez sur "Choose"

### 3.2 Remplir le Formulaire

Remplissez les champs suivants:

**Configuration du Service:**
- **Nom du Projet**: `test-notification-service`
- **Description**: `Service de test pour les notifications`
- **Repository GitHub**: Sélectionnez votre organisation/utilisateur GitHub

**Configuration de la Notification:**
- **Titre**: `Service déployé`
- **Message**: `Le service test-notification-service a été créé avec succès`
- **Type**: `Success (✅)`

**Options Avancées** (laisser par défaut):
- **URL du Chatbot**: `http://localhost:8081`
- **Inclure Docker**: ✓
- **Inclure les Tests**: ✓

### 3.3 Créer le Service

1. Cliquez sur "Review"
2. Vérifiez la configuration
3. Cliquez sur "Create"
4. Backstage va créer le repository GitHub

### 3.4 Cloner et Tester le Service

```bash
# Cloner le repository créé
git clone [URL_DU_REPO]
cd test-notification-service

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer le service
npm start
```

**Résultat attendu**:
```
🔔 ========================================
   test-notification-service
   Notification Service pour Chatbot
========================================

[NotificationService] Envoi de la notification vers http://localhost:8081/api/notifications
[NotificationService] Titre: Service déployé
[NotificationService] Type: success
[NotificationService] ✅ Notification envoyée avec succès!
[NotificationService] ID: xyz789...

✅ Succès! La notification est visible dans le chatbot.
```

### 3.5 Vérifier dans le Chatbot

1. Retournez sur http://localhost:3000
2. La cloche devrait afficher un nouveau badge
3. Cliquez sur la cloche
4. La nouvelle notification devrait être visible:
   - Titre: "Service déployé"
   - Message: "Le service test-notification-service a été créé avec succès"
   - Type: success (✅)

## 🧪 Tests Supplémentaires

### Test des Différents Types

Envoyez des notifications de chaque type:

```bash
# Info
curl -X POST http://localhost:8081/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"title": "Info", "message": "Message informatif", "type": "info"}'

# Warning
curl -X POST http://localhost:8081/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"title": "Attention", "message": "Ceci est un avertissement", "type": "warning"}'

# Error
curl -X POST http://localhost:8081/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"title": "Erreur", "message": "Une erreur est survenue", "type": "error"}'
```

Vérifiez que chaque type affiche l'icône correcte:
- Info: ℹ️
- Success: ✅
- Warning: ⚠️
- Error: ❌

### Test du Polling Automatique

1. Gardez le chatbot ouvert (http://localhost:3000)
2. Dans un terminal, envoyez une notification:
   ```bash
   curl -X POST http://localhost:8081/api/notifications \
     -H "Content-Type: application/json" \
     -d '{"title": "Test Polling", "message": "Cette notification devrait apparaître automatiquement", "type": "info"}'
   ```
3. **Attendez maximum 5 secondes** sans rafraîchir la page
4. Le badge de la cloche devrait se mettre à jour automatiquement

### Test "Tout marquer comme lu"

1. Créez plusieurs notifications (3-5)
2. Ouvrez le popup de notifications
3. Cliquez sur "Tout marquer comme lu"
4. Toutes les notifications devraient perdre leur point bleu
5. Le badge devrait afficher "0"

### Test "Tout supprimer"

1. Ouvrez le popup de notifications
2. Cliquez sur "Tout supprimer"
3. Confirmez dans la boîte de dialogue
4. Toutes les notifications devraient disparaître
5. Le message "Aucune notification" devrait apparaître

## 🔍 Vérification des Endpoints Backend

### GET /api/notifications
```bash
curl http://localhost:8081/api/notifications
```

Devrait retourner toutes les notifications avec le count.

### GET /api/notifications/unread
```bash
curl http://localhost:8081/api/notifications/unread
```

Devrait retourner uniquement les notifications non lues.

### GET /api/notifications/stats
```bash
curl http://localhost:8081/api/notifications/stats
```

Devrait retourner les statistiques (total, unread, par type, etc.).

## ✅ Checklist de Validation

- [ ] Le chatbot affiche la cloche de notification dans le header
- [ ] Les notifications s'affichent dans le popup au clic
- [ ] Le badge affiche le bon nombre de notifications non lues
- [ ] Les icônes correspondent aux types (info, success, warning, error)
- [ ] Le bouton "marquer comme lu" fonctionne
- [ ] Le bouton "supprimer" fonctionne
- [ ] "Tout marquer comme lu" fonctionne
- [ ] "Tout supprimer" fonctionne
- [ ] Le polling automatique fonctionne (5 secondes)
- [ ] Le template Backstage est visible
- [ ] Le template peut créer un service
- [ ] Le service créé peut envoyer des notifications
- [ ] Les notifications du service apparaissent dans le chatbot
- [ ] Le format des timestamps est correct
- [ ] Les notifications persistent pendant 24h (cleanup automatique)

## 🐛 Dépannage

### La cloche n'apparaît pas

- Vérifiez que le frontend a été rebuild avec les nouveaux composants
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que NotificationCenter.js et NotificationCenter.css existent

### Les notifications n'apparaissent pas

- Vérifiez que le backend est démarré sur le port 8081
- Vérifiez les logs du backend: `tail -f ../chatbot/backend.log`
- Testez l'endpoint directement: `curl http://localhost:8081/health`
- Vérifiez la console du navigateur (F12)

### Le polling ne fonctionne pas

- Vérifiez que le chatbot n'est pas en erreur
- Regardez l'onglet Network dans les DevTools
- Vous devriez voir des requêtes GET vers `/api/notifications` toutes les 5 secondes

### Le template n'apparaît pas dans Backstage

- Vérifiez que le template est bien ajouté dans `app-config.yaml`
- Redémarrez Backstage
- Vérifiez les logs de Backstage pour les erreurs de parsing

## 📊 Résultats Attendus

À la fin des tests, vous devriez avoir:

1. ✅ Un chatbot fonctionnel avec un système de notifications visuelles
2. ✅ Un template Backstage opérationnel
3. ✅ Un service de notification déployé et fonctionnel
4. ✅ Des notifications qui s'affichent dans le chatbot
5. ✅ Un système de démo autonome et impressionnant!

## 🎉 Conclusion

Si tous les tests passent, félicitations! Vous avez un système de notification complet qui:
- Fonctionne de manière autonome (pas besoin de Slack/Teams)
- Est facilement démontrable
- Permet des intégrations réelles avec d'autres services
- Utilise une architecture moderne et extensible

**Ce système est prêt pour la production et peut être étendu avec:**
- Notifications en temps réel via WebSocket
- Filtres et catégories
- Notifications persistantes en base de données
- Intégrations avec d'autres outils (Jenkins, GitHub Actions, etc.)