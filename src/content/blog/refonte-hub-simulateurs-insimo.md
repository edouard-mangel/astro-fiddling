---
title: 'Refonte du hub de simulateurs InSimo'
description: "Rétrospective d'un projet de refactorisation complète d'une plateforme de simulateurs chirurgicaux, livré en 8 semaines avec zéro bug en production."
pubDate: 'Feb 09 2026'
heroImage: '/insimo-hub-courses.png'
---

## Contexte du Projet

InSimo développe des jeux vidéo de formation chirurgicale pour améliorer les compétences des professionnels de santé. L'entreprise devait moderniser son hub de simulateurs legacy (Vue 2 non maintenable) pour supporter plusieurs simulateurs avant un salon de l'innovation santé prévu le 11 juin 2025.

**Contraintes :**
- Deadline de 8 semaines
- Codebase existante non maintenable
- Besoin de supporter plusieurs simulateurs (Sim and Care, Robotis)
- Impératif de tests automatisés pour la fiabilité long terme

## Approche Contractuelle

Plutôt qu'un contrat au forfait avec un périmètre incertain, nous avons opté pour une collaboration en régie structurée autour d'itérations hebdomadaires :

- **Must-have et nice-to-have** définis chaque semaine
- Facturation au temps passé (demi-journées)
- Notification client avant dépassement de 10 jours/homme
- Rétrospectives hebdomadaires avec boucles de feedback
- Déploiement continu permettant l'utilisation du produit à tout moment

Cette approche a permis une flexibilité maximale pour ajuster le périmètre selon les découvertes en cours de projet.

## Phases du Projet

### Phase 1 : Collectif de Freelances (Itérations 1-2)

- **Équipe :** Collectif de freelances en mob programming 100%
- **Méthode :** TDD strict, intégration des designs from scratch
- **Architecture :** Injection de dépendances, architecture hexagonale

### Phase 2 : La Crafterie Tech (Itérations 3-10)

- **Équipe :** Edouard Mangel, Thomas Stocker, Marc Bouvier + contributeurs ponctuels
- **Évolution méthodologique :**
  - Mob/pair programming réservé aux tâches complexes
  - TDD appliqué de manière sélective
  - Utilisation de composants existants pour accélérer le développement
  - Équilibre pragmatisme/craftmanship

## Livrables

### Application Web

- Hub fonctionnel pour multiple simulateurs
- Affichage des parcours de formation
- Visualisation des résultats de simulation
- Interface utilisateur moderne et maintenable

### Application Desktop Electron

- Packaging de l'application web
- Lancement des processus Unity
- Interprétation des données de simulation
- Récupération et analyse des résultats

![Tableau de bord de résultats de simulation InSimo](/insimo-hub-results.png)

## Résultats Mesurables

- ✅ **Livraison dans les temps** : Versions fonctionnelles des deux simulateurs avant la deadline
- ✅ **Zéro bug** en production sur les fonctionnalités livrées
- ✅ **Budget respecté** : Prédictions de timeline précises évitant les dérapages
- ✅ **Transfert de connaissances** : Équipe InSimo autonome sur la nouvelle base de code
- ✅ **Feedback client** : Intégration immédiate des retours utilisateurs

## Méthodologies Employées

### Pratiques Techniques

- **Test-Driven Development (TDD)** : Appliqué majoritairement avec pragmatisme
- **Mob Programming** : Excellent pour les décisions architecturales complexes
- **Pair Programming** : Utilisé pour l'exploration de nouvelles technologies
- **Trunk-Based Development** : Pipeline CI/CD avec GitHub Actions
- **Infrastructure in-memory** : Pas de base de données pour simplifier

### Architecture

- **Injection de dépendances** : Facilite les tests et la maintenabilité
- **Architecture hexagonale** : Séparation claire des responsabilités
- **Composants réutilisables** : Accélération du développement

## Apprentissages et Compromis

### Ce Qui a Fonctionné

1. **Mob programming sélectif** : Excellent pour les décisions critiques, mais peut devenir épuisant s'il est systématique
2. **Déploiement continu** : Feedback immédiat et confiance dans les releases
3. **Itérations courtes** : Adaptation rapide aux changements de priorités
4. **Communication transparente** : Client informé en temps réel des avancées

### Compromis Assumés

- **Dette technique consciente** : Certains raccourcis pris pour tenir la deadline du salon, avec engagement de résolution post-événement
- **Pragmatisme sur TDD** : Exploration de technologies inconnues (WebSocket vers Unity) sans TDD strict
- **Équilibre craft/livraison** : Éviter le dogmatisme quand la réalité du projet l'exige

## Conclusion

Ce projet illustre comment une approche craft peut s'adapter aux contraintes réelles d'un projet avec deadline serrée, sans compromettre la qualité du livrable final.

**Points clés :**
- Communication transparente et itérations courtes créent la confiance
- Le pragmatisme n'est pas l'ennemi du craftsmanship
- La dette technique peut être contractée consciemment si elle est documentée et planifiée
- Zéro bug en production est possible même avec des contraintes de temps

---

*Envie de discuter de votre projet de refonte ou de modernisation ? [Contactez-moi](mailto:edouard@lacrafterie.tech) pour échanger sur vos besoins.*
