---
title: "DRY mal appliqué : le piège du couplage invisible"
description: "DRY ne veut pas dire 'pas de duplication de code'. C'est 'pas de duplication de connaissance'. Confondre les deux crée du couplage invisible qui explose au premier changement métier."
pubDate: 'Feb 17 2026'
---

## "Ne te répète pas"

Don't Repeat Yourself. C'est l'un des premiers principes qu'on apprend en tant que développeur. Et c'est souvent l'un des plus mal compris.

Quand on voit du code dupliqué, le réflexe est immédiat : factoriser. Extraire une méthode. Créer une abstraction commune.

**Le problème, c'est que deux morceaux de code identiques ne représentent pas forcément la même connaissance.**

## L'exemple classique

Prenons ce code :

```csharp
public class UserValidator
{
    public bool CanVote(User user) => user.Age >= 18;
    public bool CanDrive(User user) => user.Age >= 18;
    public bool CanBuyAlcohol(User user) => user.Age >= 18;
}
```

Trois fois `>= 18`. Un développeur consciencieux va immédiatement factoriser :

```csharp
public class UserValidator
{
    private bool IsMajor(User user) => user.Age >= 18;

    public bool CanVote(User user) => IsMajor(user);
    public bool CanDrive(User user) => IsMajor(user);
    public bool CanBuyAlcohol(User user) => IsMajor(user);
}
```

C'est satisfaisant. Zéro duplication. Un seul endroit à modifier si la règle change.

Sauf que **la règle ne changera jamais de manière uniforme**.

## Le jour où ça casse

Le produit s'internationalise. Aux États-Unis :

- On vote à 18 ans
- On conduit à 16 ans
- On achète de l'alcool à 21 ans

Notre belle abstraction `IsMajor` vole en éclats :

```csharp
public class UserValidator
{
    private int GetAge(User user) => user.Age;
    private bool IsAmerican(User user) => user.Country == "US";

    public bool CanVote(User user) => GetAge(user) >= 18;
    public bool CanDrive(User user) =>
        GetAge(user) >= (IsAmerican(user) ? 16 : 18);
    public bool CanBuyAlcohol(User user) =>
        GetAge(user) >= (IsAmerican(user) ? 21 : 18);
}
```

Et puis il faut ajouter la France (permis à 17 ans), le Japon, l'Allemagne... La classe devient un enchevêtrement de ternaires, de `switch` et de cas particuliers.

**Tout ça parce qu'on a fusionné trois concepts métier différents sous une même abstraction.**

## Ce que DRY veut vraiment dire

L'auteur du principe, Andy Hunt, le clarifie dans *The Pragmatic Programmer* :

> **"Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."**

Le mot clé, c'est **knowledge** — connaissance. Pas *code*.

DRY parle de **duplication de connaissance**, pas de duplication de lignes. Deux morceaux de code identiques peuvent représenter deux connaissances métier distinctes.

Dans notre exemple :

- **L'âge pour voter** est une connaissance électorale
- **L'âge pour conduire** est une connaissance du code de la route
- **L'âge pour acheter de l'alcool** est une connaissance réglementaire

Ces trois règles ont le même seuil *par coïncidence*, pas par nature. Elles évolueront indépendamment.

## Duplication de code vs duplication de connaissance

| Situation | DRY s'applique ? | Pourquoi |
|---|---|---|
| Deux fonctions calculent la TVA à 20% | **Oui** | C'est la même connaissance fiscale |
| `CanVote` et `CanDrive` vérifient `>= 18` | **Non** | Ce sont deux connaissances métier différentes |
| Deux endpoints valident un email avec le même regex | **Oui** | C'est la même règle de validation |
| Le même message d'erreur dans deux contextes différents | **Non** | Les contextes évolueront séparément |

La question à se poser n'est jamais "est-ce que ce code se ressemble ?" mais **"est-ce que ces deux morceaux changent pour la même raison ?"**

Si la réponse est non, la duplication est saine. La factoriser créerait un **couplage artificiel**.

## Le couplage invisible

C'est le danger le plus pernicieux du DRY mal appliqué. Quand on fusionne deux concepts sous une même abstraction, on crée un couplage que personne ne voit :

- Il n'y a pas de `import` suspect
- Il n'y a pas de dépendance cyclique
- L'analyseur statique ne le détecte pas
- Le code a l'air propre

Mais le jour où un des concepts doit évoluer indépendamment, on découvre que modifier un comportement en casse un autre. Les estimations explosent. Les bugs de régression se multiplient.

**Le couplage par abstraction prématurée est invisible jusqu'à ce qu'il soit trop tard.**

## Comment éviter le piège

### 1. Attendez la troisième occurrence

Deux occurrences identiques ? C'est peut-être une coïncidence. Trois occurrences qui évoluent ensemble ? C'est probablement une vraie duplication de connaissance.

### 2. Posez-vous la question du "pourquoi"

Si deux morceaux de code changent **pour la même raison business**, c'est une duplication à éliminer. S'ils changent pour des raisons différentes, gardez-les séparés.

### 3. Préférez la duplication au mauvais couplage

Martin Fowler le dit clairement :

> *"Duplication is far cheaper than the wrong abstraction."*

Trois lignes identiques coûtent moins cher qu'une abstraction qui couple des concepts indépendants.

### 4. Nommez vos abstractions avec le vocabulaire métier

Si vous ne trouvez pas de nom métier pour votre abstraction, c'est un signal. `IsMajor` est un nom technique qui masque trois concepts métier. Si vous ne pouvez pas nommer l'abstraction sans utiliser "Utils", "Common" ou "Shared", il n'y a probablement pas d'abstraction à faire.

## En résumé

- **DRY** = pas de duplication de **connaissance**, pas de duplication de **code**
- Deux morceaux de code identiques ne sont pas forcément une duplication
- Factoriser trop tôt crée du **couplage invisible**
- La question clé : **"est-ce que ça change pour la même raison ?"**
- En cas de doute, **dupliquez** — c'est moins cher qu'une mauvaise abstraction

La prochaine fois que vous verrez du code dupliqué et que votre instinct crie "factoriser !", prenez une seconde. Demandez-vous si vous êtes face à une vraie duplication de connaissance, ou simplement à une coïncidence syntaxique.

---

*Cet article est tiré de ma conférence [Le Seigneur du Legacy](/presentations/seigneur-du-legacy), où l'on découvre comment le couplage détruit les projets — lentement, silencieusement, et souvent au nom des "bonnes pratiques". Disponible en [Brown Bag Lunch](/presentations/) dans vos locaux.*
