# SonarQube Scanner Template

This template helps you add SonarQube code quality scanning to your projects. It supports both ephemeral (temporary container) and centralized (persistent server) modes.

## Features

- **Ephemeral Mode**: Automatically spins up a SonarQube container in GitHub Actions, runs the scan, checks the quality gate, and tears it down. No external server required!
- **Centralized Mode**: Connects to an existing SonarQube server for persistent history and trend analysis.
- **Configurable Quality Gates**: Choose between Strict, Balanced, or Lenient quality gates.
- **Multi-language Support**: optimized for Frontend (React), Backend (Node.js), or Fullstack (Monorepo) projects.
- **GitHub Integration**: Supports PR decoration and status checks.

## Usage

1. Select **SonarQube Code Quality Scanner** from the Quality Service Catalog.
2. Fill in the project details:
   - **Project Key**: Unique identifier (e.g., `my-cool-project`).
   - **Project Type**: Frontend, Backend, or Fullstack.
   - **Service Mode**: Ephemeral or Centralized.
3. Configure Quality Gate:
   - **Strict**: High standards for production (90% coverage).
   - **Balanced**: Good compromise (80% coverage).
   - **Lenient**: For initial development (70% coverage).

## Service Modes

| Feature | Ephemeral Mode | Centralized Mode |
|---------|----------------|------------------|
| **Setup** | Zero setup required | Requires external server |
| **History** | No history (snapshot only) | Full history & trends |
| **Cost** | Free (GitHub Runner resources) | Hosting costs |
| **Use Case** | Quick checks, simple projects | Enterprise, long-term tracking |

## Integration Details

The template generates:
- `.github/workflows/sonarqube.yml`: The CI pipeline.
- `sonar-project.properties`: Configuration file for the scanner.
- `sonar-config/`: Helper files for Docker and rules.

### Secrets (Centralized Mode Only)

If you choose **Centralized** mode, you must add these secrets to your repository:
- `SONAR_HOST_URL`: URL of your SonarQube server.
- `SONAR_TOKEN`: Authentication token.

## Best Practices

See [SONARQUBE_BEST_PRACTICES.md](./SONARQUBE_BEST_PRACTICES.md) for detailed guidelines on code coverage, exclusions, and quality profiles.
