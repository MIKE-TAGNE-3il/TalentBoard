# Guide de contribution – TalentBoard

## Workflow Git

```
main          ← production stable
develop       ← intégration
feature/xxx   ← nouvelles fonctionnalités
fix/xxx       ← corrections de bugs
```

### Créer une branche
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-feature
```

### Convention de commits
```
feat: ajout du filtre par contrat
fix: correction du JWT expiré
docs: mise à jour du README
test: ajout tests JobService
refactor: extraction du service auth
```

### Ouvrir une Pull Request
1. Pousser la branche : `git push origin feature/xxx`
2. Ouvrir une PR vers `develop`
3. La CI doit passer (tests backend + frontend)
4. 1 review requise avant merge

## Lancer les tests

```bash
# Backend
cd backend && ./mvnw test

# Frontend
cd frontend && npm test -- --watch=false
```

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `SPRING_DATASOURCE_URL` | URL PostgreSQL | `jdbc:postgresql://localhost:5432/talentboard` |
| `SPRING_DATASOURCE_USERNAME` | Utilisateur DB | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe DB | `postgres` |
| `JWT_SECRET` | Clé secrète JWT (256 bits min) | (requis en prod) |
| `JWT_EXPIRATION` | Durée validité token (ms) | `86400000` (24h) |
