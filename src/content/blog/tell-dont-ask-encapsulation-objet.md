---
title: "Tell, Don't Ask : quand l'encapsulation sauve votre codebase"
description: "Comment le principe Tell Don't Ask transforme du code fragile en architecture solide. Illustré avec un exemple concret de validation utilisateur qui part en vrille."
pubDate: 'Feb 17 2026'
---

## Le code qui a l'air correct

Imaginez cette classe. Vous l'avez probablement vue cent fois :

```csharp
public class User
{
    public int Id { get; private set; }
    public int Age { get; set; }
}

public class UserValidator
{
    public bool CanVote(User user) => user.Age >= 18;
    public bool CanDrive(User user) => user.Age >= 18;
    public bool CanBuyAlcohol(User user) => user.Age >= 18;
}
```

Rien de choquant, non ? Trois méthodes, une règle simple : il faut avoir 18 ans.

Un développeur consciencieux va même remarquer la duplication et appliquer DRY :

```csharp
public class UserValidator
{
    private bool IsMajor(User user) => user.Age >= 18;

    public bool CanVote(User user) => IsMajor(user);
    public bool CanDrive(User user) => IsMajor(user);
    public bool CanBuyAlcohol(User user) => IsMajor(user);
}
```

Magnifique. Plus de duplication. Le code est propre.

**Et c'est exactement là que les problèmes commencent.**

## Le jour où le business évolue

Votre produit fonctionne bien en France. Le CEO annonce : "On s'internationalise !"

Aux États-Unis, on peut conduire à 16 ans et acheter de l'alcool à 21 ans. Soudain, `IsMajor` ne suffit plus :

```csharp
public class UserValidator
{
    private int GetAge(User user) => user.Age;
    private bool IsAmerican(User user) => user.Country == "US";

    public bool CanVote(User user) => GetAge(user) >= 18;
    public bool CanDrive(User user) => GetAge(user) >= (IsAmerican(user) ? 16 : 18);
    public bool CanBuyAlcohol(User user) => GetAge(user) >= (IsAmerican(user) ? 21 : 18);
}
```

Et quand vous ajoutez le Japon, l'Allemagne, le Royaume-Uni... la classe `UserValidator` explose en complexité. Chaque nouveau pays ajoute des conditions, des ternaires imbriquées, des cas particuliers.

Le DRY qu'on avait appliqué ? Il a fusionné des concepts métier **différents** sous une même abstraction. Voter, conduire et acheter de l'alcool ne sont pas la même chose — ils avaient juste le même seuil *par hasard*.

## Le vrai problème : Ask, Don't Tell

Le `UserValidator` **demande** des informations à l'objet `User` pour prendre des décisions à sa place. C'est le pattern "Ask" :

1. Demander l'âge
2. Demander le pays
3. Calculer la règle en dehors de l'objet

La logique métier est **à l'extérieur** de l'objet qui détient les données. C'est une violation classique de l'encapsulation.

## Tell, Don't Ask : inverser la responsabilité

Le principe **Tell, Don't Ask** (aussi appelé "Hollywood Principle" — *Don't call us, we'll call you*) dit : au lieu de demander des données à un objet pour prendre une décision, **dites-lui** ce que vous voulez et laissez-le décider.

Voici le même code refactoré :

```csharp
public abstract class User
{
    public int Id { get; private set; }
    private int Age { get; set; }

    protected abstract int VotingAge { get; }
    protected abstract int DrivingAge { get; }
    protected abstract int DrinkingAge { get; }

    public bool CanVote() => Age >= VotingAge;
    public bool CanDrive() => Age >= DrivingAge;
    public bool CanBuyAlcohol() => Age >= DrinkingAge;
}
```

```csharp
public class FrenchUser : User
{
    protected override int VotingAge => 18;
    protected override int DrivingAge => 17;
    protected override int DrinkingAge => 18;
}

public class AmericanUser : User
{
    protected override int VotingAge => 18;
    protected override int DrivingAge => 16;
    protected override int DrinkingAge => 21;
}
```

Qu'est-ce qui a changé ?

- **L'âge est privé.** Plus personne ne peut le lire de l'extérieur.
- **La décision appartient à l'objet.** On demande `user.CanDrive()`, on ne demande plus son âge pour calculer nous-mêmes.
- **Ajouter un pays = ajouter une classe.** Pas de `if`, pas de ternaire, pas de modification du code existant.
- **Le `UserValidator` n'existe plus.** Il n'a plus de raison d'être.

## Pourquoi ça change tout

### Le code est ouvert à l'extension, fermé à la modification

Ajouter le Japon ? Une nouvelle classe `JapaneseUser`. Le code existant ne bouge pas. Zéro risque de régression.

### Les tests sont triviaux

```csharp
[TestMethod]
public void FrenchUser_CanDriveAt17()
{
    var user = new FrenchUser { Age = 17 };
    Assert.IsTrue(user.CanDrive());
}
```

Plus besoin de mocker un `UserValidator`. Plus de dépendance externe. Le test est simple, rapide, et résistant au refactoring.

### La Loi de Déméter est respectée

On ne traverse plus les couches d'objets pour aller chercher des données. On envoie un message, l'objet répond. C'est la programmation orientée objet telle qu'elle a été conçue.

## Comment repérer le pattern "Ask" dans votre code

Quelques signaux d'alerte :

- **Des getters publics utilisés par d'autres classes pour prendre des décisions.** Si une classe lit les propriétés d'une autre pour faire un `if`, la logique est probablement au mauvais endroit.
- **Des classes "Validator", "Helper", "Utils" qui opèrent sur les données d'un objet.** Ces classes sont souvent le symptôme d'une logique métier déplacée.
- **Des chaînes de getters** : `user.getTeam().getManager().getName()`. Chaque `.` est un couplage supplémentaire.

## En résumé

| Ask (fragile) | Tell (solide) |
|---|---|
| Demander l'état interne | Envoyer un message |
| Logique à l'extérieur de l'objet | Logique à l'intérieur de l'objet |
| Modification = risque de régression | Extension = nouvelle classe |
| Couplage fort entre les classes | Couplage faible, encapsulation forte |

La prochaine fois que vous écrivez un getter suivi d'un `if`, posez-vous la question : est-ce que je ne devrais pas **dire** à l'objet ce que je veux, plutôt que de lui **demander** ses données ?

---

*Cet article est tiré de ma conférence [Le Seigneur du Legacy](/presentations/seigneur-du-legacy), où j'explore les pièges du couplage à travers une histoire épique en Terre du Milieu. Disponible en [Brown Bag Lunch](/presentations/) dans vos locaux.*
