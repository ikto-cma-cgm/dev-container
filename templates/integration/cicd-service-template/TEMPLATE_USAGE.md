# Dynamic CI/CD Service Template Usage Guide

This template allows you to generate production-ready CI/CD pipelines for **Node.js**, **React/Next.js**, and **Java/Spring Boot** applications. It supports multiple CI providers including **GitHub Actions**, **Jenkins**, and **GitLab CI**.

## Features

-   **Multi-Language Support**: One template for all your microservices and web apps.
-   **Provider Flexibility**: Switch between GitHub Actions, Jenkins, or GitLab CI without changing your project code.
-   **Composition Ready**: Designed to be fetched by other templates (e.g., Application Scaffolding) to keep pipeline definitions centralized.

## Usage Options

### 1. Standalone Usage (Backstage Catalog)

You can use this template directly from the Integration Service Catalog to add a pipeline to an existing repository.

1.  Go to **Create...** in Backstage and select **Dynamic CI/CD Pipeline**.
2.  **Repository Location**: Enter the URL of your existing repository.
3.  **Project Type**: Select your tech stack (`nodejs`, `react`, `java`).
4.  **CI/CD Provider**: Select your preferred runner (`github-actions`, `jenkins`, `gitlab-ci`).
5.  **Configuration**:
    -   **Node Version**: (For Node/React) e.g., '18.x', '20.x'.
    -   **Java Version**: (For Java) e.g., '17', '21'.
    -   **Deployment Target**: e.g., Kubernetes, Cloud Run.

### 2. Composition (Integration with Other Templates)

This template is designed to be composed into other Scaffolder templates. This ensures that all new services created via Backstage use the latest approved pipeline definitions.

**Example: Including in a Node.js Service Template**

```yaml
steps:
  # ... fetch your service skeleton ...

  - id: fetch-cicd
    name: Fetch CI/CD Pipeline
    action: fetch:template
    input:
      # Fetch the specific provider skeleton dynamically
      url: ../../../integration/cicd-service-template/skeleton/nodejs/${{ parameters.ciProvider }}
      values:
        appName: ${{ parameters.name }}
        nodeVersion: ${{ parameters.nodeVersion }}
        # ... pass other necessary variables
```

## Supported Configurations

| Project Type | GitHub Actions | Jenkins | GitLab CI |
| :--- | :---: | :---: | :---: |
| **Node.js** | ✅ | ✅ | ✅ |
| **React** | ✅ | ✅ | ✅ |
| **Java** | ✅ | ✅ | ✅ |

### Parameter Reference

-   `repoUrl`: (Required) Location of the target repository.
-   `projectType`: `nodejs` | `react` | `java`
-   `ciProvider`: `github-actions` (default) | `jenkins` | `gitlab-ci`
-   `deploymentTarget`: `kubernetes` | `cloud-run` | `aws-ecs` | `vercel` | `none`
-   `nodeVersion`: `18.x` | `20.x` | `22.x`
-   `javaVersion`: `17` | `21`

## Troubleshooting

-   **Pipeline Files Not Created?** Ensure you selected the correct `projectType` that matches your code structure.
-   **Jenkins File Missing?** Verify that you selected `jenkins` as the `ciProvider`.
-   **Composition Error?** Check that the relative path in your calling template correctly points to `cicd-service-template/skeleton/<type>/<provider>`.
