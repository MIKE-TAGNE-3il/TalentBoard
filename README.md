# 🎯 TalentBoard

> Plateforme de recrutement web Full Stack – inspirée de JobTeaser

![CI/CD](https://github.com/MIKE-TAGNE-3il/TalentBoard/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Description

TalentBoard est une plateforme web de mise en relation entre candidats et recruteurs.  
Elle permet aux entreprises de publier des offres d'emploi et aux candidats de postuler en ligne, gérer leur profil et suivre leurs candidatures.

## 🏗️ Architecture

```
TalentBoard/
├── frontend/          # Angular 17 – Interface utilisateur
├── backend/           # Java Spring Boot 3 – API REST
├── docker/            # Docker Compose – Orchestration
└── .github/workflows/ # GitHub Actions – CI/CD
```

## 🛠️ Stack Technique

| Couche       | Technologies                              |
|--------------|-------------------------------------------|
| Front End    | Angular 17, TypeScript, Bootstrap 5       |
| Back End     | Java 17, Spring Boot 3, Spring Security   |
| Base données | PostgreSQL 15, Spring Data JPA            |
| Auth         | JWT (JSON Web Tokens)                     |
| DevOps       | Docker, Docker Compose, GitHub Actions    |
| Tests        | JUnit 5, Mockito, Jest (Angular)          |

## 🚀 Démarrage rapide

### Prérequis
- Docker & Docker Compose
- Node.js 18+
- Java 17+

### Lancement avec Docker
```bash
git clone https://github.com/YOUR_USERNAME/TalentBoard.git
cd TalentBoard
docker-compose -f docker/docker-compose.yml up --build
```

L'application sera disponible sur :
- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8080/api
- **Swagger UI** : http://localhost:8080/swagger-ui.html

### Lancement en développement

**Backend :**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend :**
```bash
cd frontend
npm install
ng serve
```

## 📌 Fonctionnalités

### Candidat
- ✅ Inscription / Connexion (JWT)
- ✅ Recherche et filtrage des offres d'emploi
- ✅ Consultation du détail d'une offre
- ✅ Dépôt de candidature (lettre de motivation)
- ✅ Tableau de bord : suivi des candidatures

### Recruteur
- ✅ Création et gestion des offres
- ✅ Consultation des candidatures reçues
- ✅ Mise à jour du statut des candidatures

## 🔌 API REST – Endpoints principaux

| Méthode | Endpoint                     | Description                    |
|---------|------------------------------|--------------------------------|
| POST    | /api/auth/register           | Inscription                    |
| POST    | /api/auth/login              | Connexion – retourne JWT       |
| GET     | /api/jobs                    | Liste des offres               |
| GET     | /api/jobs/{id}               | Détail d'une offre             |
| POST    | /api/jobs                    | Créer une offre (recruteur)    |
| POST    | /api/applications            | Postuler à une offre           |
| GET     | /api/applications/me         | Mes candidatures               |

## 🐳 Docker

```bash
# Build et démarrage
docker-compose -f docker/docker-compose.yml up --build

# Arrêt
docker-compose -f docker/docker-compose.yml down

# Logs
docker-compose -f docker/docker-compose.yml logs -f
```

## 🧪 Tests

```bash
# Tests backend
cd backend && ./mvnw test

# Tests frontend
cd frontend && npm test
```

## 👤 Auteur

**Mike Allan TAGNE FOTSO**  
Étudiant Ingénieur – 3iL Limoges  
gneta056@gmail.com

## 📄 Licence

MIT License
