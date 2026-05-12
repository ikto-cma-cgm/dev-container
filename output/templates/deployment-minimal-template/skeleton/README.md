## ${{values.project_name}} Deployment

${{values.description}}

### Tech Stack

- Kubernetes
- Kustomize
- GitLab CI/CD

### Getting Started

1. Clone the repository
2. Apply resources: `kubectl apply -k resources/`
3. Configure secrets in GitLab Settings

### Resources

Deployment resources for the `${{values.project_name}}` microservice include:

- `deployment.yaml` — Kubernetes Deployment
- `service.yaml` — Kubernetes Service
- `configmap.yaml` — Application configuration
- `secrets.yaml` — Secrets placeholder
- `ingress.yaml` — Ingress resource
- `hpa.yaml` — Horizontal Pod Autoscaler
- `pdb.yaml` — Pod Disruption Budget
- `cnp.yaml` — Calico Network Policy
- `role.yaml` — RBAC Role
- `rolebinding.yaml` — RBAC RoleBinding
- `service-account.yaml` — Service Account

### TechDocs

Documentation is built with MkDocs and available in the Docs tab of the Backstage service page.
