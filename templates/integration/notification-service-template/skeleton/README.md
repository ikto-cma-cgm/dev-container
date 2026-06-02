# ${{ values.projectName }}

> ${{ values.description }}

Service de notification qui envoie des messages au Chatbot Backstage. Généré automatiquement par le template Backstage.

## 🚀 Quick Start

### Prérequis

- Node.js >= 18.x
- Le Chatbot Backstage doit être démarré sur `${{ values.chatbotUrl }}`{% if values.includeDocker %}
- Docker (optionnel){% endif %}

### Installation

```bash
# Cloner le repository (si pas déjà fait)
git clone [REPO_URL]
cd ${{ values.projectName }}

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env si nécessaire
```

### Utilisation{% if values.includeDocker %}

#### Avec Docker (Recommandé)

```bash
# Construire et lancer
docker-compose up

# En arrière-plan
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

#### Sans Docker{% endif %}

```bash
# Lancer le service
npm start

# Ou avec des variables d'environnement
NOTIFICATION_TITLE="Mon titre" NOTIFICATION_MESSAGE="Mon message" npm start
```

## 📝 Configuration

### Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `CHATBOT_URL` | URL de l'API du chatbot | `${{ values.chatbotUrl }}` |
| `NOTIFICATION_TITLE` | Titre de la notification | `${{ values.notificationTitle }}` |
| `NOTIFICATION_MESSAGE` | Message de la notification | `${{ values.notificationMessage }}` |
| `NOTIFICATION_TYPE` | Type: info, success, warning, error | `${{ values.notificationType }}` |

### Personnalisation

Éditez `src/index.js` pour modifier la logique:

```javascript
const notification = {
  title: 'Mon titre personnalisé',
  message: 'Mon message personnalisé',
  type: 'success', // info, success, warning, error
  metadata: {
    // Ajoutez vos propres métadonnées
    buildNumber: '123',
    branch: 'main',
    author: 'john.doe'
  }
};

await sendNotification(notification);
```

## 🔄 Intégration CI/CD

### GitHub Actions

Ajoutez ce workflow dans `.github/workflows/notify.yml`:

```yaml
name: Send Notification

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Send notification
        env:
          CHATBOT_URL: {% raw %}${{ secrets.CHATBOT_URL }}{% endraw %}
          NOTIFICATION_TITLE: "Build terminé"
          NOTIFICATION_MESSAGE: {% raw %}"Build ${{ github.run_number }} déployé sur main"{% endraw %}
          NOTIFICATION_TYPE: "success"
        run: npm start
```

### GitLab CI

Ajoutez dans `.gitlab-ci.yml`:

```yaml
notify:
  stage: deploy
  script:
    - npm install
    - npm start
  variables:
    CHATBOT_URL: $CHATBOT_URL
    NOTIFICATION_TITLE: "Déploiement réussi"
    NOTIFICATION_MESSAGE: "Pipeline $CI_PIPELINE_ID terminé"
    NOTIFICATION_TYPE: "success"
```

## 🧪 Tests{% if values.includeTests %}

```bash
# Lancer les tests
npm test

# Avec couverture
npm test -- --coverage

# En mode watch
npm run test:watch
```{% else %}

Les tests ne sont pas inclus dans cette configuration. Ajoutez-les selon vos besoins.{% endif %}

## 📊 API du Chatbot

Le service envoie un POST vers `/api/notifications`:

```json
{
  "title": "Titre de la notification",
  "message": "Message détaillé",
  "type": "success",
  "metadata": {
    "source": "${{ values.projectName }}",
    "timestamp": "2024-01-28T10:00:00.000Z"
  }
}
```

Réponse:

```json
{
  "success": true,
  "notification": {
    "id": "abc123",
    "title": "Titre de la notification",
    "message": "Message détaillé",
    "type": "success",
    "read": false,
    "timestamp": "2024-01-28T10:00:00.000Z"
  }
}
```

## 🔧 Développement

```bash
# Installer les dépendances de dev
npm install

# Linter
npm run lint
{% if values.includeTests %}
# Tests
npm test
{% endif %}
# Format du code
npm run format
```

## 🆘 Dépannage

### Le chatbot ne reçoit pas les notifications

1. Vérifiez que le chatbot est démarré:
   ```bash
   curl ${{ values.chatbotUrl }}/health
   ```

2. Vérifiez l'URL dans `.env`:
   ```bash
   cat .env | grep CHATBOT_URL
   ```

3. Vérifiez les logs du service:
   ```bash{% if values.includeDocker %}
   docker-compose logs{% else %}
   # Voir la sortie console{% endif %}
   ```

### Erreur de connexion

Si vous voyez `ECONNREFUSED`, le chatbot n'est pas accessible:
- Le chatbot est-il démarré?
- L'URL est-elle correcte?
- Y a-t-il un firewall qui bloque?

## 📚 Documentation

- [Backstage Documentation](https://backstage.io/docs)
- [Template Source](../notification-service-template)
- [Chatbot API](../chatbot/README.md)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

MIT

---

**Généré par**: Backstage Notification Service Template
**Owner**: ${{ values.owner }}
**Date**: {% raw %}${{ '' | now }}{% endraw %}

🤖 Besoin d'aide? Demandez au chatbot: "Comment utiliser mon service de notification?"