# CartWish Frontend

React and Vite frontend for the CartWish e-commerce application. This repository includes Docker, Kubernetes, Helm, Jenkins and Argo CD configurations for local DevOps automation.

## Application Features

- User registration and login
- Product browsing and search
- Category filtering
- Product details
- Shopping cart
- Order placement
- Protected application routes
- Responsive user interface

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | React and Vite |
| Web server | NGINX |
| Containerization | Docker |
| Orchestration | Kubernetes and Minikube |
| Packaging | Helm |
| CI/CD | Jenkins |
| GitOps | Argo CD |

## Repository Structure

- `argocd/` - Argo CD Application manifest
- `cartwish-frontend-chart/` - Frontend Helm chart
- `k8s/` - Raw Kubernetes manifests
- `public/` - Public frontend assets
- `src/` - React source code
- `.env.example` - Example environment configuration
- `Dockerfile` - Multi-stage frontend image
- `Jenkinsfile` - Jenkins deployment pipeline
- `package.json` - Dependencies and scripts
- `README.md` - Project documentation

## Environment Configuration

Create a local `.env` file from `.env.example`.

```env
VITE_API_BASE_URL=http://localhost:5000/api/
VITE_BACKEND_URL=http://localhost:5000
```

The local `.env` file is ignored by Git. Update these values for the environment where the backend is available.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Docker

The Dockerfile uses a multi-stage build:

1. Node.js installs dependencies and builds the Vite application.
2. NGINX serves the compiled static assets.

Build the image:

```bash
docker build -t cartwish-frontend:latest .
```

Run the container:

```bash
docker run -p 8080:80 cartwish-frontend:latest
```

Open:

```text
http://localhost:8080
```

## Kubernetes

Start Minikube:

```bash
minikube start
```

Load the local frontend image:

```bash
minikube image load cartwish-frontend:latest
```

Apply the raw manifests:

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Check the deployment:

```bash
kubectl get pods
kubectl get services
kubectl rollout status deployment/cartwish-frontend
```

The Deployment includes:

- Two frontend replicas
- NGINX HTTP readiness and liveness probes
- CPU and memory requests and limits
- NodePort service access

## Helm

Validate the chart:

```bash
helm lint ./cartwish-frontend-chart
```

Render the manifests:

```bash
helm template cartwish-frontend ./cartwish-frontend-chart
```

Install or upgrade:

```bash
helm upgrade --install cartwish-frontend ./cartwish-frontend-chart
```

## Jenkins Pipeline

The Jenkins pipeline performs these stages:

1. Checks out the `main` branch.
2. Verifies Docker, kubectl and Minikube.
3. Installs frontend dependencies.
4. Creates a production Vite build.
5. Builds the Docker image.
6. Loads the image into Minikube.
7. Restarts the Kubernetes Deployment.
8. Waits for the rollout to complete.

The Jenkins Windows agent must have Docker, kubectl, Minikube, Node.js and npm available through `PATH`.

## Argo CD

The Argo CD Application manifest is located at:

```text
argocd/cartwish-frontend-argocd-app.yaml
```

It tracks the `main` branch and deploys the `cartwish-frontend-chart` Helm chart with automated synchronization, pruning and self-healing.

Apply the manifest after installing Argo CD:

```bash
kubectl apply -f argocd/cartwish-frontend-argocd-app.yaml
```

## Troubleshooting

```bash
kubectl get pods
kubectl describe pod POD_NAME
kubectl logs POD_NAME
kubectl get events
kubectl rollout status deployment/cartwish-frontend
kubectl rollout undo deployment/cartwish-frontend
```

## Related Repository

Backend: https://github.com/asritha-peddi/cartwishbackend
