---
title: "Tests couplés à l'implémentation : pourquoi vos tests cassent à chaque refactoring"
description: "Vos tests cassent dès que vous refactorez ? C'est probablement parce qu'ils testent l'implémentation plutôt que le comportement. La différence change tout."
pubDate: 'Feb 17 2026'
---

## Le TDD qui ralentit

Vous avez adopté le TDD. Red, Green, Refactor. L'équipe écrit des tests avant le code. La couverture est bonne.

Et pourtant, **chaque refactoring est un calvaire**.

Vous renommez une méthode ? Trois tests cassent. Vous fusionnez deux classes ? Dix tests à réécrire. Vous extrayez un service ? Vingt tests à adapter.

Les tests étaient censés vous donner confiance pour changer le code. Au lieu de ça, ils sont devenus **la première raison de ne pas le faire**.

## Le problème : tester l'implémentation

Prenons un exemple classique. On veut tester la validation d'un utilisateur :

```csharp
public class User
{
    public int Id { get; private set; }
    public int Age { get; set; }
}

public class UserValidator
{
    public bool CanVote(User user) => user.Age >= 18;
}
```

Le test "évident" :

```csharp
[TestClass]
public class UserValidatorTests
{
    [TestMethod]
    public void CanVote_Returns_True_When_Over18()
    {
        var validator = new UserValidator();
        var user = new User { Id = 1, Age = 18 };
        Assert.IsTrue(validator.CanVote(user));
    }

    [TestMethod]
    public void CanVote_Returns_False_When_Under18()
    {
        var validator = new UserValidator();
        var user = new User { Id = 1, Age = 17 };
        Assert.IsFalse(validator.CanVote(user));
    }
}
```

Ça a l'air correct. Un test par méthode publique. Chaque cas est couvert.

**Le problème arrive quand le code évolue.**

## Le jour où vous refactorez

L'équipe décide d'appliquer le principe Tell, Don't Ask. La logique de validation est déplacée dans l'objet `User` lui-même. Le `UserValidator` disparaît.

Résultat : **tous les tests cassent**. Pas parce que le comportement a changé — un utilisateur de 18 ans peut toujours voter. Mais parce que les tests étaient couplés à **la structure du code**, pas à ce que le code fait.

C'est le symptôme : quand un refactoring casse vos tests, vos tests testent l'implémentation. Par définition, un refactoring ne change pas le comportement — si vos tests cassent, c'est qu'ils ne testaient pas le comportement.

## Ce qu'un test devrait faire

Prenons du recul. À quoi sert un test ?

Un bon test doit :

1. **Avertir** quand le système n'a plus le même comportement qu'avant
2. **Donner confiance** pour faire des changements
3. **Permettre de refactorer** sans peur

Si vos tests cassent à chaque refactoring, ils échouent sur les points 2 et 3. Ils ne vous donnent pas confiance — ils vous paralysent.

## Tester le comportement, pas la structure

Voici le même scénario, testé différemment :

```csharp
[TestClass]
public class UserRegistrationTests
{
    [TestMethod]
    public void AdultUser_CanRegisterForVoting()
    {
        // Arrange
        var registrationService = new RegistrationService();
        var user = new User { Id = 1, Age = 18 };

        // Act
        registrationService.RegisterForElection(user);

        // Assert - Vérifie le changement dans le système
        var registeredUsers = registrationService.GetRegisteredVoters();
        CollectionAssert.Contains(registeredUsers, user);
    }

    [TestMethod]
    public void MinorUser_CannotRegisterForVoting()
    {
        var registrationService = new RegistrationService();
        var user = new User { Id = 2, Age = 17 };

        registrationService.RegisterForElection(user);

        Assert.AreEqual(0, registrationService.GetRegisteredVoters().Count);
    }
}
```

Qu'est-ce qui a changé ?

- **On teste un cas d'usage métier**, pas une méthode isolée
- **On vérifie un changement d'état du système**, pas la valeur de retour d'une fonction
- **Le test est résilient au refactoring** : que la validation soit dans `UserValidator`, dans `User`, ou ailleurs, le test passe toujours

## La différence en pratique

| Couplé à l'implémentation | Couplé au comportement |
|---|---|
| `CanVote_Returns_True_When_Over18` | `AdultUser_CanRegisterForVoting` |
| Teste une méthode | Teste un cas d'usage |
| Casse quand on refactore | Casse quand le comportement change |
| Freine le changement | Protège le changement |

Regardez les noms des tests. Le premier décrit **ce que fait le code** (`CanVote returns true`). Le second décrit **ce que fait le système** (`Adult user can register for voting`).

## Les tests comme documentation vivante

Un test couplé au comportement a un avantage supplémentaire : **son nom documente le système**.

```
AdultUser_CanRegisterForVoting        ✅
MinorUser_CannotRegisterForVoting     ✅
UserCanUpdateTheirProfile             ✅
DeactivatedUser_CannotLogin           ✅
```

En lisant la liste des tests, vous comprenez ce que le système fait — sans lire une seule ligne de code. On parle parfois de **spécifications exécutables** : les tests *sont* la documentation, et ils se vérifient eux-mêmes à chaque exécution.

## Le piège du "unitaire"

Une partie du problème vient du mot "unitaire". Si on l'interprète comme "un test par unité de code isolée", on couple naturellement les tests à la structure du code.

Mais une "unité" peut aussi être **une unité de comportement** : un cas d'usage, un scénario métier, une règle business.

Tester une unité de comportement, c'est tester ce que le système fait pour l'utilisateur — pas comment il le fait en interne.

## Comment migrer vos tests

Quelques questions pour évaluer vos tests existants :

- **Est-ce que ce test casse si je refactore sans changer de comportement ?** Si oui, il est couplé à l'implémentation.
- **Est-ce que le nom du test décrit un comportement métier ?** Si non, il décrit probablement une implémentation.
- **Est-ce que je teste une méthode isolée ou un scénario complet ?** Les méthodes changent, les scénarios métier sont stables.

Cela ne veut pas dire que les tests unitaires "classiques" sont toujours mauvais. Pour de la logique algorithmique complexe ou du code utilitaire pur, tester une fonction isolée a du sens. Mais pour la logique métier, **testez le comportement**.

## En résumé

- Les tests couplés à l'implémentation **cassent à chaque refactoring**
- Les tests couplés au comportement **cassent quand le comportement change** (ce qu'on veut)
- Un bon test vérifie **ce que le système fait**, pas comment il le fait
- Les noms de tests deviennent une **documentation vivante** du système
- "Unitaire" peut signifier une **unité de comportement**, pas une unité de code

La prochaine fois qu'un refactoring casse vos tests alors que rien n'a changé pour l'utilisateur, c'est le signal : vos tests testent la mauvaise chose.

---

*Cet article est tiré de ma conférence [Le Seigneur du Legacy](/presentations/seigneur-du-legacy), où l'on explore comment le couplage — y compris dans les tests — détruit les projets. Disponible en [Brown Bag Lunch](/presentations/) dans vos locaux.*
