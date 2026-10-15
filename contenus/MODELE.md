# Ajouter un livre ou une leçon à Recto

Un contenu = un fichier JavaScript dans `contenus/livres/` ou `contenus/lecons/`, plus une entrée dans `contenus/bibliotheque.js`.

## 1. L'entrée de bibliothèque

```js
{
  id: "la-conscience",              // identifiant unique, utilisé dans l'adresse (#/la-conscience/plan)
  type: "lecon",                    // "livre" ou "lecon"
  file: "contenus/lecons/la-conscience.js",
  title: "La conscience",
  author: "",                       // pour un livre
  year: null,                       // pour un livre
  subject: "Philosophie",           // sert de filtre dans la bibliothèque
  level: "Terminale",
  tagline: "Une phrase d'accroche.",
  tone: "#3a2a1f"                   // couleur de la couverture
}
```

## 2. Le fichier du contenu

```js
Recto.add("la-conscience", {
  unit: { one: "chapitre", many: "chapitres" },   // comment s'appellent les sections
  exam: { kind: "devoir", format: "une dissertation en 4 h", perQuestion: "" },
  plan: { defaultRead: [], priority: [2, 1, 3] }, // sections à travailler en premier
  overview: { title: "…", intro: "…", boxes: [{ t: "Le fil rouge", b: "…" }] },
  tips: ["Conseil affiché dans le bilan…"],
  parts: [
    { n: 0, roman: "", name: "Contexte", label: "Contexte", title: "…", essence: "…" },
    { n: 1, roman: "I", name: "Chapitre 1", label: "…", title: "…", metaphor: "", essence: "…" }
  ],                                              // l'index du tableau doit être égal à n
  reading: { 1: { full: 10, ess: 5, express: 3, link: "", text: { full: "…", ess: "…", express: "…" }, look: ["…"] } },
  notions: { "id-notion": { part: 1, title: "…", essentiel: "…", retenir: ["…"], citation: "…", piege: "…", video: "recherche YouTube" } },
  exercises: [ /* voir contenus/livres/discours-de-la-methode.js pour les 11 formats */ ]
});
```

Formats d'exercices : `qcm`, `vf`, `fill`, `part`, `order`, `match`, `sort`, `schema`, `grid`, `flash`, `build`.
Un exercice de citation (`part`, ou `fill` sans `plain: true`, ou `cite: true`) disparaît en mode « sans citations ».
