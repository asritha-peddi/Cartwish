# CartWish Frontend

CartWish is an e-commerce application built with React and Vite. This repository contains the frontend and its Docker, Kubernetes, Helm, Jenkins, and Argo CD configuration for a local Minikube deployment.

[Backend source code](https://github.com/asritha-peddi/cartwishbackend)

## Application Features

- User registration and login
- Product browsing, search, and category filtering
- Product details and shopping cart
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
| Build automation | Jenkins |
| GitOps deployment | Argo CD |
| Backend image scanning | Trivy |
| Monitoring | Prometheus and kube-state-metrics |
| Database | MongoDB Atlas, accessed through the backend |

## Repository Structure

| Path | Purpose |
| --- | --- |
| `src/` | React source code |
| `public/` | Public frontend assets |
| `k8s/` | Raw Kubernetes manifests |
| `cartwish-frontend-chart/` | Frontend Helm chart |
| `argocd/` | Argo CD Application manifest |
| `.env.example` | Example local environment configuration |
| `Dockerfile` | Builds the frontend and packages it with NGINX |
| `nginx.conf` | Serves static files and falls back to `index.html` for React routes |
| `Jenkinsfile` | Builds and verifies the frontend image in Minikube |

## Environment Configuration

Create a local `.env` file from `.env.example` and set the backend URLs:

```env
VITE_API_BASE_URL=http://localhost:5000/api/
VITE_BACKEND_URL=http://localhost:5000
```

Vite uses these values at build time for the production bundle. Rebuild the frontend image if the backend URLs change.

## Run Locally

Start the backend on port `5000`, then run:

```bash
npm ci
npm run dev
```

To create a production build:

```bash
npm run build
```

## Docker

The Dockerfile builds the Vite application with Node.js and serves the compiled assets with NGINX. The NGINX fallback allows routes such as `/products` to open directly and survive a browser refresh.

```bash
docker build -t cartwish-frontend:latest .
docker run --rm -p 127.0.0.1:8083:80 cartwish-frontend:latest
```

Open `http://localhost:8083/products` with the backend available at `http://localhost:5000`.

## Kubernetes and Helm

Start Minikube and validate the chart:

```bash
minikube start
helm lint ./cartwish-frontend-chart
helm template cartwish-frontend ./cartwish-frontend-chart
```

The frontend chart defines two replicas, HTTP health probes, resource requests and limits, and a NodePort Service. It uses `imagePullPolicy: Never`, so the image tag in `cartwish-frontend-chart/values.yaml` must already exist in Minikube before deployment.

Raw manifests are also available under `k8s/` for a separate manual setup.

## Jenkins Pipeline

The frontend pipeline checks out the branch configured in the Jenkins job, verifies the Minikube cluster identity, and builds a Docker image tagged with the build number and Git commit. It exports the image, loads it into Minikube, verifies the tag is present, and archives the image reference.

The `Jenkinsfile` is configured for a Windows agent with Docker, kubectl, Minikube, and Git. The Docker build runs the Node.js and Vite build steps.

## Argo CD Deployment

The frontend Application manifest is `argocd/cartwish-frontend-argocd-app.yaml`. It tracks the `main` branch and renders the `cartwish-frontend-chart` Helm chart.

After installing Argo CD, register the Application:

```bash
kubectl --context=minikube apply -f argocd/cartwish-frontend-argocd-app.yaml
```

To release a new image, update the chart's image tag in Git after Jenkins verifies that image in Minikube. Merge the change into `main`, then verify the Argo CD sync and Kubernetes rollout:

```bash
kubectl --context=minikube -n argocd get applications
kubectl --context=minikube -n default rollout status deployment/cartwish-frontend
```

## Open the CartWish Demo

Run each command in a separate terminal and keep both terminals open:

```bash
kubectl --context=minikube -n default port-forward svc/cartwish-frontend-service 8083:80
```

```bash
kubectl --context=minikube -n default port-forward svc/cartwish-backend-service 5000:5000
```

Open `http://localhost:8083/products`. Refresh the page and confirm that the product cards still load.

## Deployment and Monitoring Verification

- **Image security:** The backend image passed the Jenkins Trivy gate for HIGH and CRITICAL vulnerabilities before it was loaded into Minikube.
- **Frontend routing:** Verified that `/products` opens directly and loads product data after a browser refresh.
- **Backend recovery:** After a MongoDB Atlas connection failure, verified a successful backend rollout and confirmed that product data loaded again.
- **Prometheus:** Verified that both backend pods were Ready using metrics from kube-state-metrics.

In the Prometheus query page, run:

```promql
sum(kube_pod_status_ready{namespace="default", pod=~"cartwish-backend-.*", condition="true"})
```

The observed result was `2`, matching the two Ready backend replicas. Grafana dashboard verification is pending.

## Troubleshooting

```bash
kubectl --context=minikube -n default get deployments,pods,services
kubectl --context=minikube -n default describe pod POD_NAME
kubectl --context=minikube -n default logs deployment/cartwish-backend --tail=30
kubectl --context=minikube -n default get events --sort-by=.lastTimestamp
```

For an Argo CD managed rollback, revert the image tag in Git and sync the Application.

## Related Repository

[CartWish Backend](https://github.com/asritha-peddi/cartwishbackend)
