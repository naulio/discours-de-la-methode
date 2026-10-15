/* Recto · Livre : Discours de la méthode (Descartes, 1637).
   Citations en orthographe modernisée. Toutes les questions renvoient à une notion (fiche). */
Recto.add("discours-de-la-methode", (function () {
  const WIKI = "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode_(%C3%A9d._Cousin)/";

  const parts = [
    { n: 0, roman: "", name: "Contexte", label: "Contexte", title: "Le livre et son projet",
      metaphor: "", essence: "1637 · Leyde · anonyme · en français · préface de trois essais scientifiques." },
    { n: 1, roman: "I", name: "Première partie", label: "Les sciences", title: "Considérations touchant les sciences",
      metaphor: "Le terrain", essence: "Le bon sens est égal en tous, mais mes études ne m'ont rien donné de certain : j'étudierai en moi-même." },
    { n: 2, roman: "II", name: "Deuxième partie", label: "La méthode", title: "Les principales règles de la méthode",
      metaphor: "Le plan de l'architecte", essence: "Ce qu'un seul bâtit est plus parfait : je réforme mes propres pensées avec quatre règles." },
    { n: 3, roman: "III", name: "Troisième partie", label: "La morale", title: "Quelques règles de la morale tirée de cette méthode",
      metaphor: "Le logement provisoire", essence: "En attendant la certitude, une morale par provision pour agir sans hésiter." },
    { n: 4, roman: "IV", name: "Quatrième partie", label: "La métaphysique", title: "Les preuves de l'existence de Dieu et de l'âme",
      metaphor: "Les fondations", essence: "Je doute de tout ; je pense, donc je suis ; Dieu garantit la vérité de ce qui est clair et distinct." },
    { n: 5, roman: "V", name: "Cinquième partie", label: "La physique", title: "L'ordre des questions de physique",
      metaphor: "L'édifice", essence: "Le corps est une machine ; l'homme s'en distingue par le langage et la raison, instrument universel." },
    { n: 6, roman: "VI", name: "Sixième partie", label: "Pourquoi écrire", title: "Ce qui est requis pour aller plus avant",
      metaphor: "L'usage", essence: "Une science pratique et collective, pour la santé : « maîtres et possesseurs de la nature »." }
  ];

  const reading = {
    1: { full: 13, ess: 6, express: 3, link: WIKI + "Premi%C3%A8re_partie",
      text: {
        full: "Toute la partie, du « bon sens » jusqu'à la décision d'« étudier aussi en moi-même ».",
        ess: "Les deux premiers paragraphes (le bon sens, le projet), puis la revue des disciplines jusqu'à « je quittai entièrement l'étude des lettres », et le dernier paragraphe.",
        express: "Le premier paragraphe et le dernier paragraphe de la partie."
      },
      look: [
        "Comment il justifie que le bon sens est également réparti (et l'ironie de l'argument)",
        "La phrase « le principal est de l'appliquer bien » et l'image du marcheur lent",
        "Le verdict sur chaque discipline : mathématiques, philosophie, théologie, morale des anciens",
        "L'image des « palais superbes » bâtis sur le sable",
        "Le « grand livre du monde » : ce que les voyages lui apprennent sur la coutume",
        "La décision finale : étudier en lui-même"
      ] },
    2: { full: 13, ess: 7, express: 4, link: WIKI + "Deuxi%C3%A8me_partie",
      text: {
        full: "Toute la partie, du poêle jusqu'aux mathématiques et à ses « vingt-trois ans ».",
        ess: "Le début (le poêle, l'architecte, Sparte, « nous avons tous été enfants »), puis à partir de « comme un homme qui marche seul et dans les ténèbres » jusqu'aux quatre règles et le paragraphe qui les suit.",
        express: "Le premier paragraphe (le poêle) et les quatre règles."
      },
      look: [
        "Le poêle : où, quand, et pourquoi seul",
        "Les exemples : architecte, ville, Sparte, sciences des livres",
        "Pourquoi ne pas réformer l'État, mais seulement ses propres pensées",
        "Les deux sortes d'esprits qui ne doivent pas l'imiter",
        "Les quatre règles, presque mot à mot",
        "Les « longues chaînes de raisons » des géomètres"
      ] },
    3: { full: 11, ess: 6, express: 3, link: WIKI + "Troisi%C3%A8me_partie",
      text: {
        full: "Toute la partie, du logement provisoire jusqu'à la retraite en Hollande.",
        ess: "Le premier paragraphe (la maison à rebâtir), les trois maximes, et la conclusion (« cultiver ma raison »).",
        express: "La première phrase de chaque maxime et la conclusion."
      },
      look: [
        "L'image du logement provisoire pendant les travaux",
        "Maxime 1 : pourquoi les opinions les plus modérées",
        "Maxime 2 : l'image des voyageurs égarés dans la forêt",
        "Maxime 3 : ce qui est entièrement en notre pouvoir",
        "La conclusion : cultiver sa raison, « bien juger pour bien faire »",
        "Les sceptiques, le roc et l'argile, la retraite en Hollande"
      ] },
    4: { full: 11, ess: 11, express: 7, link: WIKI + "Quatri%C3%A8me_partie",
      text: {
        full: "Toute la partie : c'est le cœur métaphysique du livre, et elle est courte.",
        ess: "Toute la partie : c'est le cœur métaphysique du livre, et elle est courte. Ne saute rien.",
        express: "Les trois premiers paragraphes (doute, cogito, âme, règle du clair et distinct), puis les deux derniers (le rêve)."
      },
      look: [
        "La distinction : agir (opinions incertaines) / chercher la vérité (tout le contraire)",
        "Les trois raisons de douter, dans l'ordre",
        "La phrase exacte du cogito et pourquoi elle résiste au doute",
        "La définition de l'âme : substance dont l'essence est de penser",
        "La règle du clair et distinct, et d'où elle vient",
        "Les preuves de Dieu (idée du parfait, dépendance, triangle)",
        "La sortie du rêve : chimère, jaunisse, géomètre endormi"
      ] },
    5: { full: 24, ess: 8, express: 4, link: WIKI + "Cinqui%C3%A8me_partie",
      text: {
        full: "Toute la partie ; tu peux survoler la description détaillée du cœur.",
        ess: "Le premier paragraphe (le traité non publié, le monde nouveau), survole le cœur, puis lis attentivement à partir de « s'il y avait de telles machines » jusqu'à la fin.",
        express: "À partir de « s'il y avait de telles machines » jusqu'à la fin."
      },
      look: [
        "Le monde nouveau « dans les espaces imaginaires » : pourquoi ce détour",
        "Le cœur comparé à une horloge ; le « médecin d'Angleterre »",
        "Les deux moyens de distinguer un homme d'une machine",
        "Pies, perroquets, sourds-muets : proférer des mots n'est pas parler",
        "« Un instrument universel »",
        "L'âme : créée, unie au corps (pas « un pilote en son navire »), immortelle"
      ] },
    6: { full: 21, ess: 10, express: 5, link: WIKI + "Sixi%C3%A8me_partie",
      text: {
        full: "Toute la partie, de la condamnation d'« une opinion de physique » jusqu'à la médecine.",
        ess: "Le début jusqu'à « maîtres et possesseurs de la nature » et la médecine, le passage sur les expériences, puis les deux derniers paragraphes (le français, la médecine).",
        express: "Le passage « maîtres et possesseurs de la nature » et l'avant-dernier paragraphe (le français)."
      },
      look: [
        "Pourquoi il renonce à publier son traité (sans nommer Galilée)",
        "Philosophie spéculative contre philosophie pratique",
        "« Maîtres et possesseurs » : quel « comme », quel but (la santé)",
        "Le rôle des expériences et de la science collective",
        "Le lierre et l'aveugle dans la cave",
        "Pourquoi écrire en français"
      ] }
  };

  /* ---------------- FICHES ---------------- */
  const notions = {
    "ctx": { part: 0, title: "Le livre et son projet",
      essentiel: "Publié anonymement en 1637 à Leyde, en français, le Discours sert de préface à trois essais scientifiques. Ce n'est pas un traité qui impose une méthode : c'est le récit d'un itinéraire, « une histoire, ou, si vous l'aimez mieux, une fable ».",
      retenir: [
        "Titre complet : Discours de la méthode pour bien conduire sa raison et chercher la vérité dans les sciences.",
        "Préface de la Dioptrique, des Météores et de la Géométrie.",
        "« Discours » et non « Traité » : il veut parler de sa méthode, pas l'enseigner (lettre à Mersenne, 1637).",
        "Six parties : sciences · méthode · morale · métaphysique · physique · raisons d'écrire."
      ],
      citation: "mon dessein n'est pas d'enseigner ici la méthode que chacun doit suivre pour bien conduire sa raison, mais seulement de faire voir en quelle sorte j'ai tâché de conduire la mienne.",
      piege: "Ne confonds pas avec les Méditations métaphysiques (1641) : le malin génie, le morceau de cire et « je suis, j'existe » n'apparaissent pas dans le Discours.",
      video: "Discours de la méthode Descartes résumé explication" },

    "bon-sens": { part: 1, title: "Le bon sens, également partagé",
      essentiel: "Le bon sens, « la puissance de bien juger et distinguer le vrai d'avec le faux », est naturellement égal en tous. Si nos opinions diffèrent, c'est que nous conduisons nos pensées par diverses voies et ne considérons pas les mêmes choses.",
      retenir: [
        "Argument ironique : chacun pense en être si bien pourvu qu'il n'en désire pas plus.",
        "Égalité de nature, différence d'usage : « le principal est de l'appliquer bien ».",
        "Celui qui marche lentement sur le droit chemin avance plus que celui qui court en s'en écartant.",
        "Conséquence : il faut une méthode. C'est la raison d'être du Discours."
      ],
      citation: "Ce n'est pas assez d'avoir l'esprit bon, mais le principal est de l'appliquer bien.",
      piege: "Le bon sens n'est pas l'opinion commune : c'est la faculté de juger. Et l'égalité est naturelle (de droit), pas dans les résultats.",
      video: "Descartes le bon sens est la chose du monde la mieux partagée explication" },

    "etudes": { part: 1, title: "Le bilan des études",
      essentiel: "Formé dans « l'une des plus célèbres écoles de l'Europe », Descartes en sort « embarrassé de tant de doutes et d'erreurs ». Chaque discipline a ses mérites ; aucune ne donne une connaissance certaine et utile à la vie.",
      retenir: [
        "Mathématiques : certitude et évidence, mais on n'a rien bâti dessus « de plus relevé ».",
        "Philosophie : il n'y a rien dont on ne dispute, donc rien qui ne soit douteux.",
        "Morale des anciens païens : « palais fort superbes » bâtis sur du sable et de la boue.",
        "Théologie : vérités révélées au-dessus de notre intelligence. Fables : risque des « extravagances des paladins de nos romans »."
      ],
      citation: "je réputais presque pour faux tout ce qui n'était que vraisemblable.",
      piege: "Il ne méprise ni ses maîtres ni les disciplines : il leur reproche l'absence de fondement certain.",
      video: "Descartes Discours de la méthode première partie critique des études" },

    "monde": { part: 1, title: "Le grand livre du monde",
      essentiel: "Sorti du collège, il quitte « entièrement l'étude des lettres » pour lire « le grand livre du monde » : voyages, cours, armées. La diversité des mœurs lui apprend à ne pas croire trop fermement ce qu'il ne tient que de l'exemple et de la coutume. Puis il décide d'étudier en lui-même.",
      retenir: [
        "Les raisonnements des gens dans leurs affaires valent mieux que ceux d'un savant dans son cabinet : l'erreur y est sanctionnée.",
        "Ce qui nous semble extravagant est reçu ailleurs : la coutume n'est pas une preuve.",
        "Voyager trop longtemps rend étranger en son propre pays.",
        "Étape décisive : « je pris un jour résolution d'étudier aussi en moi-même »."
      ],
      citation: "je pris un jour résolution d'étudier aussi en moi-même, et d'employer toutes les forces de mon esprit à choisir les chemins que je devais suivre.",
      piege: "Le voyage n'est pas une fin : il délivre de la coutume et prépare le retour sur soi. Ce n'est pas du relativisme.",
      video: "Descartes le grand livre du monde explication" },

    "architecte": { part: 2, title: "Le poêle et l'architecte unique",
      essentiel: "Un hiver, en Allemagne, « enfermé seul dans un poêle » (une pièce chauffée), Descartes remarque qu'un ouvrage fait par un seul maître est plus parfait qu'un ouvrage composé de pièces faites par plusieurs. Nos opinions, reçues depuis l'enfance, ressemblent à ces villes anciennes mal ordonnées.",
      retenir: [
        "Exemples : bâtiment d'un seul architecte, ville tracée par un ingénieur, lois de Sparte (un seul législateur, tendant « à même fin »).",
        "Les sciences des livres, faites des opinions de plusieurs, approchent moins du vrai que le raisonnement simple d'un homme de bon sens.",
        "« Nous avons tous été enfants avant que d'être hommes » : nos jugements ont été formés par nos appétits et nos précepteurs.",
        "Le poêle est une chambre chauffée : lieu de solitude et de méditation."
      ],
      citation: "souvent il n'y a pas tant de perfection dans les ouvrages composés de plusieurs pièces, et faits de la main de divers maîtres, qu'en ceux auxquels un seul a travaillé.",
      piege: "Le poêle (IIe partie) voit naître la méthode, pas le cogito (IVe partie, médité plus tard en Hollande).",
      video: "Descartes poêle architecte Discours de la méthode deuxième partie" },

    "reforme": { part: 2, title: "Réformer ses pensées, pas l'État",
      essentiel: "On ne rase pas une ville pour la rebâtir, et un particulier ne doit pas réformer un État en le renversant. Mais chacun peut abattre sa propre maison : Descartes se limite à « réformer [ses] propres pensées » et à bâtir « dans un fonds qui est tout à [lui] ».",
      retenir: [
        "Les grands corps sont trop malaisés à relever une fois abattus ; l'usage a adouci leurs défauts, comme les chemins qui tournent entre les montagnes.",
        "Pas un exemple pour tous : ni pour les esprits précipités, ni pour les modestes qui feraient mieux de suivre l'avis d'autrui.",
        "« La pluralité des voix n'est pas une preuve » pour les vérités difficiles.",
        "Prudence : « comme un homme qui marche seul et dans les ténèbres », aller lentement pour au moins ne pas tomber."
      ],
      citation: "Mon dessein ne s'est jamais étendu plus avant que de tâcher à réformer mes propres pensées, et de bâtir dans un fonds qui est tout à moi.",
      piege: "Descartes n'est pas un révolutionnaire : la radicalité du doute reste intellectuelle et individuelle.",
      video: "Descartes réformer ses propres pensées pas l'État Discours de la méthode" },

    "regles": { part: 2, title: "Les quatre règles de la méthode",
      essentiel: "Comme un État est mieux réglé par peu de lois strictement observées, Descartes remplace les nombreux préceptes de la logique par quatre règles, à condition de ne jamais manquer à les observer.",
      retenir: [
        "1. Évidence : ne recevoir pour vrai que ce qui est évident ; éviter la précipitation et la prévention ; ne juger que du clair et distinct.",
        "2. Analyse : diviser chaque difficulté en autant de parcelles qu'il se peut.",
        "3. Ordre : aller des objets les plus simples aux plus composés, « comme par degrés ».",
        "4. Dénombrement : des revues si générales qu'on soit assuré de ne rien omettre."
      ],
      citation: "ne recevoir jamais aucune chose pour vraie que je ne la connusse évidemment être telle",
      piege: "Précipitation = juger trop vite. Prévention = juger d'avance, sous l'effet des préjugés. Ne pas les confondre.",
      video: "Descartes les quatre règles de la méthode évidence analyse synthèse dénombrement" },

    "maths": { part: 2, title: "Le modèle mathématique",
      essentiel: "La logique sert à expliquer ce qu'on sait déjà plutôt qu'à apprendre ; l'algèbre et l'analyse des anciens sont trop liées aux figures et aux chiffres. Seuls les mathématiciens ont trouvé des démonstrations : Descartes généralise leurs « longues chaînes de raisons » à toute connaissance.",
      retenir: [
        "Tout ce que l'homme peut connaître « s'entre-suit » comme les démonstrations des géomètres.",
        "Il commence par le plus simple : les proportions, figurées par des lignes et exprimées par des chiffres.",
        "« Il n'y a qu'une vérité de chaque chose » : l'enfant qui fait une addition selon les règles sait tout ce qu'on peut savoir de cette somme.",
        "À 23 ans, il juge trop tôt pour appliquer la méthode à la philosophie, d'où les sciences tirent leurs principes."
      ],
      citation: "Ces longues chaînes de raisons, toutes simples et faciles, dont les géomètres ont coutume de se servir pour parvenir à leurs plus difficiles démonstrations",
      piege: "Les mathématiques sont un modèle de méthode, pas le seul objet : la méthode vaut pour toutes les sciences.",
      video: "Descartes modèle mathématique méthode longues chaînes de raisons" },

    "morale-provision": { part: 3, title: "Pourquoi une morale par provision",
      essentiel: "Avant de rebâtir une maison, il faut un logement provisoire. Pendant que la raison l'oblige à douter dans ses jugements, Descartes ne veut pas rester irrésolu dans ses actions : il se forme une « morale par provision » de « trois ou quatre maximes ».",
      retenir: [
        "Douter en théorie, agir en pratique : la vie n'attend pas la certitude.",
        "« Par provision » : provisoire, en attendant mieux, mais aussi une réserve pour vivre.",
        "But : vivre « le plus heureusement » possible pendant la recherche.",
        "Trois maximes plus une conclusion (cultiver sa raison) : d'où « trois ou quatre »."
      ],
      citation: "afin que je ne demeurasse point irrésolu en mes actions pendant que la raison m'obligerait de l'être en mes jugements",
      piege: "Provisoire ne veut pas dire arbitraire. Et la foi est mise à part du doute, avec les maximes.",
      video: "Descartes morale par provision trois maximes explication" },

    "maxime1": { part: 3, title: "Maxime 1 : lois, coutumes, modération",
      essentiel: "Obéir aux lois et aux coutumes de son pays, garder la religion de son enfance, et se gouverner selon les opinions les plus modérées des plus sensés de ceux avec qui l'on vit.",
      retenir: [
        "Les plus modérées : plus commodes à pratiquer, sans doute les meilleures, et si l'on se trompe, on s'écarte moins du vrai chemin.",
        "Pour connaître les vraies opinions des gens, regarder ce qu'ils font plutôt que ce qu'ils disent.",
        "Éviter les promesses par lesquelles on retranche quelque chose de sa liberté.",
        "Cohérent avec le refus de réformer l'État (IIe partie)."
      ],
      citation: "obéir aux lois et aux coutumes de mon pays, retenant constamment la religion en laquelle Dieu m'a fait la grâce d'être instruit dès mon enfance",
      piege: "Ce n'est pas une soumission aveugle : c'est un choix raisonné, en attendant de juger par soi-même.",
      video: "Descartes première maxime morale par provision obéir aux lois" },

    "maxime2": { part: 3, title: "Maxime 2 : la fermeté (la forêt)",
      essentiel: "Être le plus ferme et le plus résolu possible dans ses actions, et suivre les opinions les plus douteuses, une fois décidé, aussi constamment que si elles étaient très assurées.",
      retenir: [
        "Les voyageurs égarés en forêt ne doivent ni tourner en rond ni s'arrêter, mais marcher droit vers un même côté : ils arriveront au moins quelque part.",
        "Les actions de la vie ne souffrent souvent aucun délai : à défaut du plus vrai, suivre le plus probable.",
        "Bénéfice : la délivrance des « repentirs et remords » des esprits faibles et chancelants.",
        "C'est l'inverse du doute théorique : la fermeté vaut pour l'action, pas pour la vérité."
      ],
      citation: "Imitant en ceci les voyageurs qui, se trouvant égarés en quelque forêt, ne doivent pas errer en tournoyant tantôt d'un côté tantôt d'un autre, ni encore moins s'arrêter en une place",
      piege: "Ce n'est pas de l'entêtement : on ne change pas de direction « pour de faibles raisons ».",
      video: "Descartes deuxième maxime voyageurs égarés forêt" },

    "maxime3": { part: 3, title: "Maxime 3 : se vaincre plutôt que la fortune",
      essentiel: "Tâcher plutôt à se vaincre que la fortune, et à changer ses désirs que l'ordre du monde : rien n'est entièrement en notre pouvoir que nos pensées.",
      retenir: [
        "Après avoir fait de notre mieux, ce qui nous manque est, à notre égard, « absolument impossible ».",
        "« Faire de nécessité vertu » : ne pas plus désirer la santé étant malade qu'un corps de diamant ou des ailes d'oiseau.",
        "Inspiration stoïcienne : ces philosophes qui ont su « se soustraire de l'empire de la fortune ».",
        "Il faut un long exercice et une méditation souvent réitérée pour s'y accoutumer."
      ],
      citation: "tâcher toujours plutôt à me vaincre que la fortune, et à changer mes désirs que l'ordre du monde",
      piege: "Ce n'est pas de la passivité : on fait d'abord « notre mieux » touchant les choses extérieures.",
      video: "Descartes troisième maxime se vaincre plutôt que la fortune stoïcisme" },

    "conclusion-morale": { part: 3, title: "Cultiver sa raison, contre les sceptiques",
      essentiel: "Pour conclure sa morale, Descartes choisit de continuer son occupation : cultiver sa raison selon sa méthode. Il voyage encore neuf ans, puis se retire en Hollande. Son doute n'est pas celui des sceptiques : il cherche un fondement solide.",
      retenir: [
        "« Il suffit de bien juger pour bien faire » : la vertu dépend du jugement.",
        "Neuf ans à « rouler çà et là dans le monde », « spectateur plutôt qu'acteur ».",
        "Les sceptiques « ne doutent que pour douter » ; lui veut trouver « le roc ou l'argile ».",
        "Retraite en Hollande, « aussi solitaire et retiré que dans les déserts les plus écartés »."
      ],
      citation: "tout mon dessein ne tendait qu'à m'assurer, et à rejeter la terre mouvante et le sable, pour trouver le roc ou l'argile.",
      piege: "Le doute cartésien est un moyen vers la certitude, pas une fin.",
      video: "Descartes doute méthodique différence scepticisme roc argile" },

    "doute": { part: 4, title: "Le doute méthodique",
      essentiel: "Pour agir, il faut parfois suivre des opinions incertaines comme si elles étaient indubitables. Pour chercher la vérité, Descartes fait « tout le contraire » : rejeter comme absolument faux tout ce qui laisse le moindre doute, pour voir s'il reste quelque chose d'indubitable.",
      retenir: [
        "Raison 1 : les sens nous trompent quelquefois.",
        "Raison 2 : on fait des paralogismes, même en géométrie : il rejette toutes les démonstrations.",
        "Raison 3 : le rêve. Les mêmes pensées nous viennent en dormant sans être vraies.",
        "Doute méthodique (un moyen), volontaire et hyperbolique (le douteux est traité comme faux)."
      ],
      citation: "je pensai qu'il fallait que je fisse tout le contraire, et que je rejetasse comme absolument faux tout ce en quoi je pourrais imaginer le moindre doute",
      piege: "Pas de malin génie ni de Dieu trompeur dans le Discours (ce sont les Méditations). Ici : sens, raisonnements, rêve.",
      video: "Descartes doute méthodique trois raisons de douter sens rêve Discours" },

    "cogito": { part: 4, title: "Je pense, donc je suis",
      essentiel: "Pendant qu'il veut penser que tout est faux, il faut nécessairement que lui, qui le pense, soit quelque chose. « Je pense, donc je suis » est si ferme que les suppositions des sceptiques ne peuvent l'ébranler : c'est le premier principe de la philosophie.",
      retenir: [
        "Le doute se retourne contre lui-même : douter, c'est penser ; pour penser, il faut être.",
        "Vérité évidente qui résiste même à l'hypothèse du rêve.",
        "C'est « le roc » cherché : un point fixe pour rebâtir.",
        "Formule française ; le latin « cogito, ergo sum » viendra plus tard (1644)."
      ],
      citation: "cette vérité, je pense, donc je suis, était si ferme et si assurée, que toutes les plus extravagantes suppositions des sceptiques n'étaient pas capables de l'ébranler",
      piege: "« Je suis, j'existe » est la formule des Méditations, pas du Discours.",
      video: "Descartes je pense donc je suis cogito explication" },

    "ame": { part: 4, title: "L'âme, substance pensante",
      essentiel: "Il peut feindre qu'il n'a pas de corps, qu'il n'y a ni monde ni lieu, mais pas qu'il n'est point. Il est donc une substance dont toute l'essence est de penser : l'âme est entièrement distincte du corps, et plus aisée à connaître que lui.",
      retenir: [
        "S'il cessait de penser, il n'aurait plus aucune raison de croire qu'il est.",
        "L'âme n'a besoin d'aucun lieu et ne dépend d'aucune chose matérielle.",
        "Plus aisée à connaître : on la connaît avec certitude quand on doute encore du corps.",
        "Fondement du dualisme : la pensée et le corps sont deux substances."
      ],
      citation: "ce moi, c'est-à-dire l'âme par laquelle je suis ce que je suis, est entièrement distincte du corps, et même qu'elle est plus aisée à connaître que lui",
      piege: "« Plus aisée à connaître » est un ordre de certitude, pas de valeur.",
      video: "Descartes l'âme substance pensante distincte du corps dualisme" },

    "critere": { part: 4, title: "Le critère du clair et distinct",
      essentiel: "Rien ne l'assure de la vérité du cogito, sinon qu'il voit très clairement que pour penser il faut être. D'où une règle générale : les choses que nous concevons fort clairement et fort distinctement sont toutes vraies.",
      retenir: [
        "Le cogito sert de modèle de vérité.",
        "Clair : présent et manifeste à l'esprit attentif. Distinct : nettement séparé du reste.",
        "La difficulté : bien remarquer ce que nous concevons distinctement.",
        "La règle ne sera pleinement assurée qu'une fois Dieu prouvé."
      ],
      citation: "les choses que nous concevons fort clairement et fort distinctement sont toutes vraies",
      piege: "Le critère n'est ni la vivacité d'une image ni l'accord de tous : un rêve peut être vif sans être distinct.",
      video: "Descartes idées claires et distinctes critère de vérité" },

    "dieu": { part: 4, title: "Les preuves de l'existence de Dieu",
      essentiel: "Je doute, donc je suis imparfait (connaître est plus parfait que douter). Or j'ai l'idée d'un être plus parfait que moi : elle ne vient ni du néant ni de moi. Elle a été mise en moi par un être qui a toutes les perfections : Dieu.",
      retenir: [
        "Par l'idée du parfait : le plus parfait ne peut venir du moins parfait, pas plus que quelque chose de rien.",
        "Par ma dépendance : si j'étais seul et indépendant, je me serais donné toutes les perfections qui me manquent.",
        "Par l'idée d'Être parfait : l'existence y est comprise comme, dans le triangle, l'égalité de ses angles à deux droits.",
        "L'existence de Dieu est « au moins aussi certaine » qu'une démonstration de géométrie."
      ],
      citation: "il est pour le moins aussi certain que Dieu, qui est cet Être si parfait, est ou existe, qu'aucune démonstration de géométrie le saurait être.",
      piege: "Dieu ne s'imagine pas : vouloir l'imaginer, c'est vouloir entendre les sons avec ses yeux.",
      video: "Descartes preuves de l'existence de Dieu idée de parfait Discours de la méthode" },

    "garantie-reve": { part: 4, title: "Dieu garant et la sortie du rêve",
      essentiel: "La règle du clair et distinct n'est assurée que parce que Dieu existe et que tout ce qui est en nous vient de lui. Nos erreurs viennent de ce qui est confus en nous. Éveillé ou endormi, il ne faut se fier qu'à l'évidence de la raison.",
      retenir: [
        "Assurance morale qu'on a un corps et qu'il y a des astres, mais pas de certitude métaphysique sans Dieu.",
        "Une démonstration géométrique trouvée en rêve resterait vraie.",
        "Les sens trompent aussi éveillés : la jaunisse fait voir jaune, les astres paraissent petits.",
        "En dormant, nos raisonnements ne sont jamais si évidents ni si entiers. Imaginer une chimère ne prouve pas qu'elle existe."
      ],
      citation: "soit que nous veillions, soit que nous dormions, nous ne nous devons jamais laisser persuader qu'à l'évidence de notre raison.",
      piege: "On sort du rêve par la raison (garantie par Dieu), pas par les sens ni par la vivacité des images.",
      video: "Descartes comment distinguer le rêve de la veille Dieu garant de la vérité" },

    "physique": { part: 5, title: "La physique et le corps-machine",
      essentiel: "Descartes résume un traité qu'il ne publie pas (Le Monde) : la lumière, un monde nouveau formé par Dieu à partir d'un chaos et des lois de la nature. Puis il décrit le corps humain comme une machine, notamment le mouvement du cœur.",
      retenir: [
        "Un monde nouveau « dans les espaces imaginaires », pour parler librement sans entrer dans les disputes des doctes.",
        "Le corps est d'abord décrit sans âme raisonnable : il fonctionne par la seule disposition de ses organes.",
        "Le cœur se meut aussi nécessairement qu'une horloge ; il loue « un médecin d'Angleterre » (Harvey) pour la circulation du sang.",
        "Esprits animaux : « comme un vent très subtil, ou plutôt comme une flamme très pure »."
      ],
      citation: "ce corps comme une machine qui, ayant été faite des mains de Dieu, est incomparablement mieux ordonnée [...] qu'aucune de celles qui peuvent être inventées par les hommes.",
      piege: "Le corps est une machine, pas l'homme entier : l'âme raisonnable n'est pas mécanique.",
      video: "Descartes corps machine mécanisme cinquième partie Discours de la méthode" },

    "animaux": { part: 5, title: "Homme, bête, machine : les deux critères",
      essentiel: "Une machine imitant un singe serait indiscernable d'un singe. Une machine imitant un homme se trahirait par deux moyens très certains : le langage et l'universalité de la raison. Les mêmes critères montrent que les bêtes n'ont pas de raison du tout.",
      retenir: [
        "Langage : arranger des paroles pour répondre au sens de tout ce qu'on dit. Les perroquets profèrent des mots sans témoigner qu'ils pensent ; les sourds-muets inventent des signes.",
        "Universalité : la raison est « un instrument universel » ; les organes doivent être disposés pour chaque action.",
        "Les bêtes qui font certaines choses mieux que nous agissent par nature, comme une horloge mesure mieux le temps.",
        "L'âme raisonnable est créée, unie au corps (pas « un pilote en son navire »), et ne meurt pas avec lui."
      ],
      citation: "la raison est un instrument universel qui peut servir en toutes sortes de rencontres",
      piege: "Les bêtes n'ont pas « moins » de raison : elles n'en ont « point du tout ». Et une machine pourrait proférer des mots.",
      video: "Descartes animaux machines langage instrument universel" },

    "galilee": { part: 6, title: "Publier ou non : l'affaire Galilée",
      essentiel: "Son traité était prêt quand il apprit que des personnes à qui il défère avaient désapprouvé une opinion de physique publiée par un autre (Galilée, condamné en 1633). Il renonce à publier ce traité, mais publie le Discours et les essais.",
      retenir: [
        "Galilée n'est jamais nommé : « quelque autre ».",
        "Il ne dit pas partager l'opinion condamnée, seulement n'y avoir rien vu de nuisible à la religion ou à l'État.",
        "Publier tout de même : la loi qui oblige à procurer le bien général des hommes.",
        "Il craint de perdre son temps dans les controverses."
      ],
      citation: "des personnes à qui je défère, et dont l'autorité ne peut guère moins sur mes actions que ma propre raison sur mes pensées, avaient désapprouvé une opinion de physique",
      piege: "La prudence de Descartes rejoint sa 1re maxime : obéir, sans renoncer à penser.",
      video: "Descartes sixième partie Discours de la méthode Galilée" },

    "maitres": { part: 6, title: "Maîtres et possesseurs de la nature",
      essentiel: "Au lieu de la philosophie spéculative des écoles, une philosophie pratique : connaître les forces du feu, de l'eau, de l'air, des astres comme on connaît les métiers des artisans, pour les employer à nos usages et « nous rendre comme maîtres et possesseurs de la nature ».",
      retenir: [
        "Des artifices pour jouir sans peine des fruits de la terre, mais surtout la conservation de la santé, « le premier bien ».",
        "L'esprit dépend du corps : c'est dans la médecine qu'il faut chercher à rendre les hommes plus sages.",
        "Le « comme » nuance : l'homme n'est pas maître absolu, Dieu reste le créateur.",
        "Le savoir se juge à son utilité pour la vie : rupture avec la science contemplative."
      ],
      citation: "et ainsi nous rendre comme maîtres et possesseurs de la nature.",
      piege: "Le texte vise la santé et le bien commun ; y lire la naissance de la technique moderne est une piste de réflexion, pas ce que dit Descartes.",
      video: "Descartes maîtres et possesseurs de la nature explication" },

    "experiences": { part: 6, title: "Expériences, science collective, français",
      essentiel: "Les expériences deviennent d'autant plus nécessaires qu'on avance en connaissance, et un homme seul ne peut toutes les faire : la science doit être collective. Il écrit en français pour être jugé par ceux qui usent de leur raison naturelle.",
      retenir: [
        "Ordre : les principes (tirés de « semences de vérités » en nos âmes), puis les effets ordinaires, puis des expériences pour trancher.",
        "Joindre les vies et les travaux de plusieurs pour aller plus loin.",
        "Les disciples d'Aristote sont comme le lierre ; les partisans de principes obscurs, comme un aveugle qui attire son adversaire dans une cave.",
        "Français plutôt que latin : contre l'autorité des livres anciens."
      ],
      citation: "ceux qui ne se servent que de leur raison naturelle toute pure jugeront mieux de mes opinions que ceux qui ne croient qu'aux livres anciens.",
      piege: "Descartes ne méprise pas l'expérience : dans la VIe partie, elle est indispensable pour les effets particuliers.",
      video: "Descartes expériences science collective écrire en français sixième partie" }
  };

  /* ---------------- EXERCICES ---------------- */
  const exercises = [];
  const add = (type, list) => list.forEach((e, i) => exercises.push(Object.assign({ id: type + "-" + (i + 1), type }, e)));

  /* QCM */
  add("qcm", [
    { part: 0, notion: "ctx", q: "Sous quelle forme le Discours paraît-il en 1637 ?",
      options: ["En français, sans nom d'auteur, comme préface à trois essais scientifiques", "En latin, sous son nom, comme traité de métaphysique", "En français, sous son nom, comme manuel pour les collèges", "En latin, sans nom d'auteur, en réponse à Galilée"], answer: 0,
      explain: "Leyde, 1637 : préface à la Dioptrique, aux Météores et à la Géométrie. Le choix du français est justifié dans la VIe partie." },
    { part: 0, notion: "ctx", q: "Pourquoi « Discours » et non « Traité » de la méthode ?",
      options: ["Pour montrer qu'il ne veut pas enseigner la méthode, seulement en parler à partir de son parcours", "Parce que le texte a d'abord été prononcé devant une université", "Parce qu'un traité aurait dû être écrit en latin", "Pour se moquer des traités de logique"], answer: 0,
      explain: "Il veut « faire voir en quelle sorte [il a] tâché de conduire [sa raison] », pas imposer une méthode. Il l'écrit aussi à Mersenne en 1637." },
    { part: 1, notion: "bon-sens", q: "Pour Descartes, d'où vient la diversité de nos opinions ?",
      options: ["De ce que nous conduisons nos pensées par diverses voies et ne considérons pas les mêmes choses", "De ce que certains hommes ont naturellement plus de raison que d'autres", "De ce que les sens trompent certains hommes plus que d'autres", "De ce que la vérité change d'un peuple à l'autre"], answer: 0,
      explain: "La diversité « ne vient pas de ce que les uns sont plus raisonnables que les autres ». L'égalité est naturelle ; la différence vient de l'usage." },
    { part: 1, notion: "bon-sens", q: "Quel argument, plein d'ironie, montre que le bon sens est également réparti ?",
      options: ["Chacun pense en être si bien pourvu qu'il n'en désire pas plus qu'il n'en a", "Tous les peuples ont à peu près les mêmes lois", "Tous les enfants comprennent l'arithmétique", "Dieu, étant juste, a dû le répartir également"], answer: 0,
      explain: "Personne ne se plaint d'en manquer, alors qu'on désire toujours plus des autres biens. Il n'est pas vraisemblable que tous se trompent." },
    { part: 1, notion: "bon-sens", q: "Quelle image montre que la méthode compte plus que la vivacité d'esprit ?",
      options: ["Celui qui marche lentement sur le droit chemin avance plus que celui qui court en s'en écartant", "L'architecte qui bâtit seul une maison plus belle", "Les voyageurs égarés qui marchent droit dans la forêt", "Le lierre qui ne monte pas plus haut que l'arbre"], answer: 0,
      explain: "Première partie. Les autres images : architecte (II), forêt (III), lierre (VI)." },
    { part: 1, notion: "etudes", q: "Que reproche Descartes aux mathématiques qu'on lui a enseignées ?",
      options: ["Sur des fondements si fermes, on n'a rien bâti de plus relevé", "Leurs démonstrations ne sont pas certaines", "Elles sont trop éloignées de l'expérience", "Elles contredisent la théologie"], answer: 0,
      explain: "Il les aime « à cause de la certitude et de l'évidence de leurs raisons » ; il s'étonne qu'on ne s'en serve que pour les arts mécaniques." },
    { part: 1, notion: "etudes", q: "Pourquoi tient-il pour douteuse la philosophie enseignée ?",
      options: ["Parce qu'il ne s'y trouve aucune chose dont on ne dispute", "Parce qu'elle est écrite en latin", "Parce qu'elle contredit la religion", "Parce qu'elle repose sur des expériences mal faites"], answer: 0,
      explain: "Là où il y a dispute, il y a doute ; et il « réputait presque pour faux tout ce qui n'était que vraisemblable »." },
    { part: 1, notion: "monde", q: "Quelle leçon tire-t-il de ses voyages ?",
      options: ["Ne rien croire trop fermement de ce qu'on ne tient que de l'exemple et de la coutume", "Toutes les coutumes se valent, donc il n'y a pas de vérité", "Les mœurs françaises sont les plus raisonnables", "Il faut voyager toute sa vie pour connaître la vérité"], answer: 0,
      explain: "La diversité des mœurs le délivre de beaucoup d'erreurs. Mais pas de relativisme : il décide ensuite d'étudier en lui-même." },
    { part: 2, notion: "architecte", q: "Dans la IIe partie, qu'est-ce que le « poêle » ?",
      options: ["Une chambre chauffée où il reste seul tout le jour à méditer", "Un ustensile qui lui sert d'exemple de machine", "Le surnom de son collège", "Un instrument d'optique de la Dioptrique"], answer: 0,
      explain: "En Allemagne, au début d'un hiver, de retour du couronnement de l'empereur : « enfermé seul dans un poêle »." },
    { part: 2, notion: "architecte", q: "Pourquoi les lois de Sparte étaient-elles si florissantes ?",
      options: ["Inventées par un seul, elles tendaient toutes à une même fin", "Chacune était excellente prise à part", "Elles avaient été votées par tout le peuple", "Elles imitaient les lois divines"], answer: 0,
      explain: "Plusieurs étaient même « fort étranges » : c'est l'unité du législateur qui fait leur force, comme celle de l'architecte." },
    { part: 2, notion: "reforme", q: "Pourquoi refuse-t-il de réformer l'État ?",
      options: ["Les grands corps sont trop malaisés à relever une fois abattus ; l'usage a adouci leurs défauts", "L'État est parfait tel qu'il est", "La méthode ne vaut que pour les mathématiques", "Le roi le lui a interdit"], answer: 0,
      explain: "Image des chemins qui tournent entre les montagnes : plus commodes, à force d'usage, que de grimper tout droit." },
    { part: 2, notion: "reforme", q: "Qui ne devrait pas imiter sa résolution de se défaire de toutes ses opinions ?",
      options: ["Ceux qui se croient plus habiles qu'ils ne sont et se précipitent", "Ceux qui, modestes, jugent qu'ils distinguent moins bien le vrai que d'autres", "Les mathématiciens", "Ceux qui ont beaucoup voyagé"], answer: [0, 1],
      explain: "« Le monde n'est quasi composé que de deux sortes d'esprits auxquels il ne convient aucunement » : les précipités et les modestes." },
    { part: 2, notion: "regles", q: "Que demande la première règle ?",
      options: ["Ne recevoir pour vrai que ce que je connais évidemment, en évitant précipitation et prévention", "Diviser chaque difficulté en autant de parcelles qu'il se peut", "Aller du plus simple au plus composé", "Faire des revues si générales qu'on ne puisse rien omettre"], answer: 0,
      explain: "Évidence (1), analyse (2), ordre (3), dénombrement (4)." },
    { part: 2, notion: "regles", q: "Dans la première règle, la « prévention » désigne :",
      options: ["Le préjugé : juger d'après des opinions reçues d'avance", "La prudence qui prévient l'erreur", "Le fait de juger trop vite", "La prévision des conséquences"], answer: 0,
      explain: "Juger trop vite, c'est la précipitation. La prévention, c'est juger d'avance, sous l'emprise des préjugés." },
    { part: 2, notion: "regles", q: "Pourquoi quatre préceptes seulement ?",
      options: ["Comme un État est mieux réglé par peu de lois strictement observées", "Parce que quatre est un nombre parfait en géométrie", "Parce que la logique d'Aristote en comptait quatre", "Pour qu'on les apprenne plus vite au collège"], answer: 0,
      explain: "« La multitude des lois fournit souvent des excuses aux vices. » Condition : ne jamais manquer à les observer." },
    { part: 2, notion: "maths", q: "À quoi servent surtout les syllogismes de la logique ?",
      options: ["À expliquer à autrui ce qu'on sait déjà, plutôt qu'à apprendre", "À découvrir des vérités nouvelles en physique", "À prouver l'existence de Dieu", "À réfuter les sceptiques"], answer: 0,
      explain: "Ou même, comme l'art de Lulle, « à parler sans jugement » de ce qu'on ignore." },
    { part: 2, notion: "maths", q: "Qu'est-ce qui, dans les mathématiques, inspire la méthode ?",
      options: ["Les longues chaînes de raisons simples et faciles des géomètres", "La beauté des figures", "L'utilité des calculs pour le commerce", "L'autorité d'Euclide"], answer: 0,
      explain: "Il imagine que tout ce que l'homme peut connaître « s'entre-suit » de la même façon." },
    { part: 3, notion: "morale-provision", q: "Pourquoi se donne-t-il une morale « par provision » ?",
      options: ["Pour ne pas rester irrésolu dans ses actions pendant que la raison l'oblige à douter dans ses jugements", "Parce qu'aucune morale définitive n'est possible", "Pour plaire aux autorités religieuses", "Parce que la morale est la première des sciences"], answer: 0,
      explain: "Image du logement provisoire pendant qu'on rebâtit sa maison." },
    { part: 3, notion: "maxime1", q: "Pourquoi suivre les opinions les plus modérées (1re maxime) ?",
      options: ["Elles sont plus commodes et, si l'on se trompe, on s'écarte moins du vrai chemin", "Elles sont toujours vraies", "Ce sont celles du plus grand nombre", "Ce sont celles des philosophes anciens"], answer: 0,
      explain: "Trois raisons : commodité, probabilité (l'excès est d'ordinaire mauvais), moindre écart en cas d'erreur." },
    { part: 3, notion: "maxime2", q: "Que doivent faire les voyageurs égarés dans une forêt ?",
      options: ["Marcher toujours le plus droit possible vers un même côté", "S'arrêter et attendre qu'on vienne les chercher", "Changer de direction dès qu'un chemin semble meilleur", "Revenir sur leurs pas"], answer: 0,
      explain: "Ils arriveront au moins quelque part, mieux qu'au milieu de la forêt. C'est la 2e maxime : la fermeté." },
    { part: 3, notion: "maxime3", q: "Selon la 3e maxime, qu'est-ce qui est entièrement en notre pouvoir ?",
      options: ["Nos pensées", "Nos actions", "Notre santé", "Notre fortune, si nous sommes prudents"], answer: 0,
      explain: "« Il n'y a rien qui soit entièrement en notre pouvoir que nos pensées. »" },
    { part: 3, notion: "conclusion-morale", q: "Quelle occupation choisit-il en conclusion de sa morale ?",
      options: ["Employer toute sa vie à cultiver sa raison selon sa méthode", "Entrer dans les ordres", "Servir comme soldat", "Enseigner au collège"], answer: 0,
      explain: "Les trois maximes « n'étaient fondées que sur le dessein [qu'il avait] de continuer à [s']instruire »." },
    { part: 3, notion: "conclusion-morale", q: "En quoi se distingue-t-il des sceptiques ?",
      options: ["Il doute pour s'assurer et trouver « le roc ou l'argile », pas pour rester irrésolu", "Il ne doute jamais de rien", "Il ne doute que de la religion", "Il ne doute que des sens, jamais de la raison"], answer: 0,
      explain: "Les sceptiques « ne doutent que pour douter et affectent d'être toujours irrésolus »." },
    { part: 4, notion: "doute", q: "Quelles sont, dans l'ordre, les trois raisons de douter de la IVe partie ?",
      options: ["Les sens, les erreurs de raisonnement, le rêve", "Le rêve, le malin génie, les sens", "Les sens, la folie, le Dieu trompeur", "La coutume, les sens, la mémoire"], answer: 0,
      explain: "Malin génie, folie et Dieu trompeur appartiennent aux Méditations, pas au Discours." },
    { part: 4, notion: "doute", q: "Pourquoi rejette-t-il même les démonstrations de géométrie ?",
      options: ["Parce que des hommes font des paralogismes, même sur les matières les plus simples, et qu'il peut faillir comme eux", "Parce qu'un malin génie pourrait le tromper", "Parce que la géométrie dépend des sens", "Parce que les géomètres se contredisent"], answer: 0,
      explain: "« Jugeant que j'étais sujet à faillir autant qu'aucun autre, je rejetai comme fausses toutes les raisons que j'avais prises auparavant pour démonstrations. »" },
    { part: 4, notion: "cogito", q: "Pourquoi « je pense, donc je suis » résiste-t-il au doute ?",
      options: ["Pendant que je veux penser que tout est faux, il faut nécessairement que moi qui le pense sois quelque chose", "Parce que Dieu le garantit", "Parce que tous les philosophes l'admettent", "Parce que je sens mon corps exister"], answer: 0,
      explain: "Le doute lui-même est une pensée : on ne peut douter sans être. Dieu n'intervient qu'après." },
    { part: 4, notion: "ame", q: "Que conclut-il sur sa propre nature, juste après le cogito ?",
      options: ["Il est une substance dont toute l'essence est de penser, distincte du corps", "Il est un corps capable de penser", "Il est une partie de Dieu", "Il ne peut rien savoir de lui-même"], answer: 0,
      explain: "Il peut feindre n'avoir aucun corps, pas qu'il n'est point." },
    { part: 4, notion: "ame", q: "Pourquoi l'âme est-elle « plus aisée à connaître » que le corps ?",
      options: ["On la connaît avec certitude alors qu'on peut encore douter d'avoir un corps", "Elle est plus simple que le corps", "Les sens nous la montrent clairement", "La théologie l'enseigne"], answer: 0,
      explain: "C'est un ordre de certitude : l'âme est connue dès le cogito, le corps reste douteux." },
    { part: 4, notion: "critere", q: "D'où tire-t-il sa règle générale de vérité ?",
      options: ["De l'examen du cogito : rien ne l'en assure, sinon qu'il voit très clairement que pour penser il faut être", "De la logique d'Aristote", "De l'accord de tous les hommes", "De l'expérience des sens"], answer: 0,
      explain: "D'où : « les choses que nous concevons fort clairement et fort distinctement sont toutes vraies »." },
    { part: 4, notion: "dieu", q: "Sur quoi repose la première preuve de l'existence de Dieu ?",
      options: ["Sur l'idée d'un être plus parfait que moi, qui ne peut venir ni du néant ni de moi", "Sur l'ordre et la beauté du monde", "Sur les miracles de l'Écriture", "Sur l'accord de tous les peuples"], answer: 0,
      explain: "Le plus parfait ne peut être « une suite et une dépendance du moins parfait »." },
    { part: 4, notion: "dieu", q: "À quoi compare-t-il l'existence comprise dans l'idée de l'Être parfait ?",
      options: ["À l'égalité des trois angles d'un triangle à deux droits", "À la lumière du soleil", "Au mouvement d'une horloge", "À une ville tracée par un seul architecte"], answer: 0,
      explain: "Ou à l'équidistance de tous les points d'une sphère à son centre." },
    { part: 4, notion: "garantie-reve", q: "Pourquoi la règle du clair et distinct a-t-elle besoin de Dieu ?",
      options: ["Elle n'est assurée qu'à cause que Dieu est parfait et que tout ce qui est en nous vient de lui", "Parce que Dieu nous a révélé les mathématiques", "Parce que seul Dieu pense clairement", "Elle n'en a pas besoin : le cogito suffit"], answer: 0,
      explain: "Nos idées, en tant que claires et distinctes, viennent de Dieu ; ce qui est confus « participe du néant »." },
    { part: 4, notion: "garantie-reve", q: "Comment ne pas être trompé, que l'on veille ou que l'on dorme ?",
      options: ["Ne se laisser persuader que par l'évidence de notre raison", "Se fier aux sens quand ils sont d'accord", "Vérifier qu'on peut se pincer", "Se fier aux images les plus vives"], answer: 0,
      explain: "« Je dis de notre raison, et non point de notre imagination ni de nos sens. »" },
    { part: 4, notion: "garantie-reve", q: "Que montre l'exemple de la chimère (tête de lion sur un corps de chèvre) ?",
      options: ["On peut imaginer distinctement une chose sans qu'il faille conclure qu'elle existe", "Les animaux sont des machines", "L'imagination est le meilleur moyen de connaître", "Les rêves sont toujours faux"], answer: 0,
      explain: "La raison ne dicte pas que ce que nous imaginons est vrai, mais que nos idées ont « quelque fondement de vérité »." },
    { part: 5, notion: "physique", q: "Pourquoi décrit-il un « monde nouveau » dans des espaces imaginaires ?",
      options: ["Pour dire librement ce qu'il pense sans suivre ni réfuter les opinions des doctes", "Parce qu'il croit qu'il existe plusieurs mondes", "Pour écrire un récit de fiction", "Parce que l'Église lui interdit de parler de ce monde-ci"], answer: 0,
      explain: "Il « laisse tout ce monde ici à leurs disputes » et montre qu'un monde semblable au nôtre se formerait par les seules lois de la nature." },
    { part: 5, notion: "physique", q: "À quoi compare-t-il la nécessité du mouvement du cœur ?",
      options: ["À une horloge, dont le mouvement suit de ses contrepoids et de ses roues", "À un pilote dans son navire", "À une flamme qui monte", "À un raisonnement géométrique"], answer: 0,
      explain: "Le mouvement suit « de la seule disposition des organes »." },
    { part: 5, notion: "animaux", q: "Quels sont les deux moyens de reconnaître qu'une machine n'est pas un vrai homme ?",
      options: ["Elle ne saurait arranger des paroles pour répondre au sens de ce qu'on dit, et elle échouerait en certaines actions, faute de raison universelle", "Elle ne saurait ni marcher ni manger", "Elle n'aurait ni sang ni cœur", "Elle ne pourrait ni rêver ni douter"], answer: 0,
      explain: "Langage et universalité de la raison : « deux moyens très certains »." },
    { part: 5, notion: "animaux", q: "Que montre l'exemple des pies et des perroquets ?",
      options: ["Proférer des paroles n'est pas parler, c'est-à-dire témoigner qu'on pense ce qu'on dit", "Les animaux ont un langage que nous ne comprenons pas", "Les oiseaux ont un peu de raison", "Le langage dépend seulement des organes"], answer: 0,
      explain: "Ce n'est pas faute d'organes : les sourds-muets, privés d'organes, inventent des signes." },
    { part: 5, notion: "animaux", q: "Que conclut-il sur les bêtes ?",
      options: ["Elles n'ont point du tout de raison : c'est la nature qui agit en elles", "Elles ont moins de raison que les hommes", "Elles ont une âme semblable à la nôtre", "Elles parlent entre elles un langage secret"], answer: 0,
      explain: "Comme une horloge mesure le temps « plus justement que nous avec toute notre prudence »." },
    { part: 5, notion: "animaux", q: "Pourquoi l'âme n'est-elle pas logée dans le corps « ainsi qu'un pilote en son navire » ?",
      options: ["Elle doit lui être jointe plus étroitement pour avoir des sentiments et des appétits comme les nôtres", "Elle est une partie du corps", "Le corps n'a pas besoin d'être dirigé", "Elle est située dans le cœur"], answer: 0,
      explain: "Le pilote suffirait « peut-être pour mouvoir ses membres », pas pour « composer un vrai homme »." },
    { part: 6, notion: "galilee", q: "Pourquoi renonce-t-il à publier son traité ?",
      options: ["Des personnes à qui il défère ont désapprouvé une opinion de physique publiée par un autre", "Il le jugeait inachevé", "Son imprimeur avait fait faillite", "Il craignait les critiques des mathématiciens"], answer: 0,
      explain: "Allusion à la condamnation de Galilée (1633), jamais nommé." },
    { part: 6, notion: "maitres", q: "Quel est « le premier bien et le fondement de tous les autres biens de cette vie » ?",
      options: ["La santé", "La connaissance de Dieu", "La richesse", "La liberté"], answer: 0,
      explain: "D'où l'importance de la médecine dans la VIe partie." },
    { part: 6, notion: "maitres", q: "Que veut dire « nous rendre comme maîtres et possesseurs de la nature » ?",
      options: ["Connaître les forces des corps comme les métiers des artisans, pour les employer à nos usages", "Posséder des terres et les exploiter", "Égaler Dieu dans la création", "Soumettre les animaux à notre volonté"], answer: 0,
      explain: "Une philosophie pratique, au lieu de la philosophie spéculative des écoles." },
    { part: 6, notion: "experiences", q: "Pourquoi écrit-il en français plutôt qu'en latin ?",
      options: ["Pour être jugé par ceux qui usent de leur raison naturelle toute pure, plutôt que par ceux qui ne croient qu'aux livres anciens", "Parce qu'il maîtrisait mal le latin", "Pour être lu par le roi", "Parce que le latin était interdit en Hollande"], answer: 0,
      explain: "Le latin est « la langue de [ses] précepteurs » : le choix du français s'oppose à l'autorité." },
    { part: 6, notion: "experiences", q: "À quoi compare-t-il ceux qui suivent Aristote ?",
      options: ["Au lierre, qui ne monte pas plus haut que les arbres qui le soutiennent", "À des voyageurs égarés dans une forêt", "À un pilote en son navire", "À une ville ancienne mal ordonnée"], answer: 0,
      explain: "Ils se contentent de ce qu'a dit leur maître, et redescendent même souvent plus bas." },
    { part: 6, notion: "experiences", q: "Pourquoi les expériences deviennent-elles de plus en plus nécessaires ?",
      options: ["Un même effet particulier peut dépendre des principes de plusieurs façons : l'expérience tranche", "Parce que la raison ne peut rien connaître seule", "Parce que les sens ne trompent jamais", "Parce que Dieu exige des preuves"], answer: 0,
      explain: "Les principes sont « si simples et si généraux » qu'il faut des expériences pour savoir de quelle manière les effets en dépendent." }
  ]);

  /* VRAI / FAUX */
  add("vf", [
    { part: 0, notion: "ctx", s: "Le Discours de la méthode a été publié en latin, sous le nom de Descartes.", a: false, explain: "En 1637 à Leyde, en français et sans nom d'auteur." },
    { part: 4, notion: "doute", s: "Le malin génie fait partie des raisons de douter du Discours.", a: false, explain: "Le malin génie est dans les Méditations (1641). Dans le Discours : les sens, les erreurs de raisonnement, le rêve." },
    { part: 1, notion: "bon-sens", s: "Pour Descartes, certains hommes naissent avec plus de bon sens que d'autres.", a: false, explain: "La puissance de bien juger est « naturellement égale en tous les hommes »." },
    { part: 2, notion: "reforme", s: "Descartes conseille à chacun de se défaire de toutes ses opinions.", a: false, explain: "« Ce n'est pas un exemple que chacun doive suivre. »" },
    { part: 3, notion: "maxime1", s: "La 1re maxime recommande de suivre les opinions les plus modérées.", a: true, explain: "Celles des plus sensés de ceux avec qui il aura à vivre." },
    { part: 3, notion: "conclusion-morale", s: "Descartes doute à la manière des sceptiques, pour rester en suspens.", a: false, explain: "Il cherche « le roc ou l'argile » : son doute est un moyen." },
    { part: 4, notion: "doute", s: "Dans la IVe partie, il rejette aussi les démonstrations mathématiques.", a: true, explain: "Des hommes font des paralogismes « même touchant les plus simples matières de géométrie »." },
    { part: 4, notion: "ame", s: "Pour Descartes, l'âme est plus aisée à connaître que le corps.", a: true, explain: "On la connaît avec certitude quand on doute encore du corps." },
    { part: 5, notion: "animaux", s: "Pour Descartes, les bêtes ont moins de raison que les hommes.", a: false, explain: "Elles n'en ont « point du tout »." },
    { part: 5, notion: "animaux", s: "Selon Descartes, une machine pourrait proférer des paroles.", a: true, explain: "Elle pourrait même crier qu'on lui fait mal ; mais pas arranger ses paroles pour répondre au sens de tout ce qu'on dit." },
    { part: 6, notion: "galilee", s: "Dans la VIe partie, Descartes nomme Galilée.", a: false, explain: "Il parle d'une opinion de physique publiée « par quelque autre »." },
    { part: 5, notion: "physique", s: "Descartes attribue à un médecin d'Angleterre la découverte de la circulation du sang.", a: true, explain: "Harvey, non nommé, qui a « rompu la glace en cet endroit »." },
    { part: 3, notion: "maxime2", s: "Selon la 2e maxime, quand on ne sait quel chemin prendre, mieux vaut s'arrêter.", a: false, explain: "Les voyageurs égarés doivent marcher droit vers un même côté." },
    { part: 2, notion: "reforme", s: "Il juge déraisonnable qu'un particulier réforme un État en le renversant.", a: true, explain: "Les grands corps sont trop malaisés à relever une fois abattus." },
    { part: 2, notion: "regles", s: "La règle d'évidence demande d'éviter la précipitation et la prévention.", a: true, explain: "Précipitation : juger trop vite. Prévention : juger par préjugé." },
    { part: 4, notion: "dieu", s: "Il juge l'existence de Dieu moins certaine qu'une démonstration de géométrie.", a: false, explain: "« Pour le moins aussi certain »." },
    { part: 4, notion: "garantie-reve", s: "La règle du clair et distinct n'est assurée que parce que Dieu existe.", a: true, explain: "« N'est assuré qu'à cause que Dieu est ou existe, et qu'il est un être parfait. »" },
    { part: 6, notion: "experiences", s: "Il écrit en français pour être jugé par ceux qui usent de leur raison naturelle.", a: true, explain: "Plutôt que par « ceux qui ne croient qu'aux livres anciens »." },
    { part: 4, notion: "cogito", s: "Descartes découvre « je pense, donc je suis » enfermé dans le poêle, en Allemagne.", a: false, explain: "Le poêle (IIe partie) voit naître la méthode. Le cogito vient des premières méditations faites en Hollande (IVe partie)." },
    { part: 1, notion: "etudes", s: "Descartes juge certaine la philosophie qu'on lui a enseignée.", a: false, explain: "« Il ne s'y trouve encore aucune chose dont on ne dispute. »" },
    { part: 1, notion: "bon-sens", s: "La diversité des opinions vient de ce que nous conduisons nos pensées par diverses voies.", a: true, explain: "Et que nous ne considérons pas les mêmes choses." },
    { part: 0, notion: "ctx", s: "Descartes présente sa méthode comme celle que chacun doit suivre.", a: false, explain: "Il veut seulement « faire voir en quelle sorte [il a] tâché de conduire [la sienne] »." },
    { part: 4, notion: "garantie-reve", s: "Une démonstration de géométrie trouvée en rêve resterait vraie.", a: true, explain: "« Son sommeil ne l'empêcherait pas d'être vraie. »" },
    { part: 4, notion: "dieu", s: "On conçoit mieux Dieu et l'âme en les imaginant.", a: false, explain: "L'imagination vaut pour les choses matérielles ; s'en servir ici, c'est vouloir entendre les sons avec ses yeux." },
    { part: 6, notion: "maitres", s: "La santé est « le premier bien et le fondement de tous les autres biens de cette vie ».", a: true, explain: "D'où le projet d'une médecine plus assurée." },
    { part: 3, notion: "morale-provision", s: "Pendant son doute, Descartes remet aussi en question les vérités de la foi.", a: false, explain: "Il les met à part, avec ses maximes, avant d'entreprendre de se défaire du reste de ses opinions." },
    { part: 3, notion: "maxime3", s: "La 3e maxime invite à changer l'ordre du monde plutôt que ses désirs.", a: false, explain: "C'est l'inverse : changer ses désirs plutôt que l'ordre du monde." }
  ]);

  /* TEXTE À TROUS */
  add("fill", [
    { part: 1, notion: "bon-sens", text: "Le bon sens est la chose du monde la mieux [[partagée]] : car chacun pense en être si bien [[pourvu]], que ceux même qui sont les plus difficiles à contenter en toute autre chose n'ont point coutume d'en désirer plus qu'ils en ont.", explain: "Phrase d'ouverture. Note l'ironie : personne ne se plaint d'en manquer." },
    { part: 1, notion: "bon-sens", text: "Ce n'est pas assez d'avoir l'esprit [[bon]], mais le principal est de l'[[appliquer]] bien.", explain: "D'où la nécessité d'une méthode." },
    { part: 1, notion: "etudes", text: "je réputais presque pour [[faux]] tout ce qui n'était que [[vraisemblable]].", explain: "Exigence de certitude : le probable ne suffit pas pour la science." },
    { part: 1, notion: "monde", text: "ne chercher plus d'autre science que celle qui se pourrait trouver en [[moi-même|moi meme|moi]], ou bien dans le grand [[livre]] du monde", explain: "Il quitte l'étude des lettres pour les voyages." },
    { part: 2, notion: "architecte", text: "nous avons tous été [[enfants|enfant]] avant que d'être [[hommes|homme]]", explain: "Nos jugements ont été formés par nos appétits et nos précepteurs avant que la raison soit maîtresse." },
    { part: 2, notion: "reforme", text: "la pluralité des [[voix]] n'est pas une preuve qui vaille rien pour les vérités un peu malaisées à découvrir", explain: "Un homme seul a plus de chances de les rencontrer que tout un peuple." },
    { part: 2, notion: "reforme", text: "comme un homme qui marche [[seul]] et dans les [[ténèbres]], je me résolus d'aller si lentement [...] que si je n'avançais que fort peu, je me garderais bien au moins de tomber.", explain: "Prudence de la méthode : lenteur et circonspection." },
    { part: 2, notion: "regles", text: "ne recevoir jamais aucune chose pour vraie que je ne la connusse [[évidemment]] être telle ; c'est-à-dire d'éviter soigneusement la [[précipitation]] et la [[prévention]]", explain: "Première règle : l'évidence." },
    { part: 2, notion: "regles", text: "diviser chacune des difficultés que j'examinerais en autant de [[parcelles]] qu'il se pourrait et qu'il serait requis pour les mieux résoudre.", explain: "Deuxième règle : l'analyse." },
    { part: 2, notion: "regles", text: "conduire par [[ordre]] mes pensées, en commençant par les objets les plus [[simples]] et les plus aisés à connaître, pour monter peu à peu, comme par [[degrés]], jusques à la connaissance des plus composés", explain: "Troisième règle : l'ordre (synthèse)." },
    { part: 2, notion: "maths", text: "Ces longues [[chaînes]] de raisons, toutes simples et faciles, dont les [[géomètres|mathematiciens]] ont coutume de se servir pour parvenir à leurs plus difficiles démonstrations", explain: "Le modèle mathématique, généralisé à toute connaissance." },
    { part: 3, notion: "morale-provision", text: "je me formai une [[morale]] par [[provision]], qui ne consistait qu'en trois ou quatre maximes", explain: "« Par provision » : provisoire, en attendant." },
    { part: 3, notion: "maxime3", text: "tâcher toujours plutôt à me vaincre que la [[fortune]], et à changer mes [[désirs]] que l'ordre du [[monde]]", explain: "Troisième maxime, d'inspiration stoïcienne." },
    { part: 3, notion: "conclusion-morale", text: "il suffit de bien [[juger]] pour bien [[faire]]", explain: "La bonne conduite dépend du bon jugement." },
    { part: 3, notion: "conclusion-morale", text: "non que j'imitasse pour cela les [[sceptiques]], qui ne doutent que pour douter, et affectent d'être toujours irrésolus", explain: "Le doute cartésien n'est pas une fin." },
    { part: 3, notion: "conclusion-morale", text: "rejeter la terre mouvante et le [[sable]], pour trouver le [[roc]] ou l'argile.", explain: "Le doute cherche un fondement solide." },
    { part: 4, notion: "doute", plain: true, text: "Trois raisons de douter : les [[sens]] nous trompent quelquefois ; on fait des [[paralogismes|erreurs|fautes]] même en géométrie ; les mêmes pensées nous viennent quand nous [[dormons|revons|sommes endormis]].", explain: "Dans cet ordre. Pas de malin génie dans le Discours." },
    { part: 4, notion: "cogito", text: "cette vérité, je pense, donc je [[suis]], était si ferme et si assurée [...] que je pouvais la recevoir sans scrupule pour le premier [[principe]] de la philosophie que je cherchais.", explain: "Le cogito, premier principe." },
    { part: 4, notion: "ame", text: "je pouvais [[feindre]] que je n'avais aucun [[corps]] [...] mais je ne pouvais pas feindre pour cela que je n'étais point", explain: "Expérience de pensée qui sépare l'âme du corps." },
    { part: 4, notion: "ame", text: "j'étais une [[substance]] dont toute l'essence ou la nature n'est que de [[penser]]", explain: "Définition de l'âme." },
    { part: 4, notion: "critere", text: "les choses que nous concevons fort [[clairement]] et fort [[distinctement]] sont toutes vraies", explain: "Règle générale tirée du cogito." },
    { part: 4, notion: "garantie-reve", text: "soit que nous veillions, soit que nous dormions, nous ne nous devons jamais laisser persuader qu'à l'évidence de notre [[raison]].", explain: "« Et non point de notre imagination ni de nos sens. »" },
    { part: 5, notion: "animaux", text: "au lieu que la raison est un instrument [[universel]] qui peut servir en toutes sortes de rencontres, ces [[organes]] ont besoin de quelque particulière disposition pour chaque action particulière", explain: "Deuxième critère distinguant l'homme de la machine." },
    { part: 6, notion: "maitres", text: "et ainsi nous rendre comme [[maîtres|maitre|maîtres]] et [[possesseurs|possesseur]] de la nature.", explain: "Note le « comme »." },
    { part: 6, notion: "maitres", text: "la conservation de la [[santé]], laquelle est sans doute le premier bien et le fondement de tous les autres biens de cette vie", explain: "Le but premier de la philosophie pratique." },
    { part: 6, notion: "experiences", text: "Et si j'écris en [[français]], qui est la langue de mon pays, plutôt qu'en [[latin]], qui est celle de mes précepteurs", explain: "Pour ceux qui usent de leur raison naturelle toute pure." },
    { part: 0, notion: "ctx", plain: true, text: "Le Discours paraît en [[1637]] à [[Leyde|leiden]], comme préface à trois essais : la Dioptrique, les [[Météores]] et la [[Géométrie]].", explain: "Publié sans nom d'auteur, en français." }
  ]);

  /* QUELLE PARTIE ? */
  add("part", [
    { notion: "bon-sens", a: 1, quote: "Le bon sens est la chose du monde la mieux partagée", explain: "Première phrase du livre." },
    { notion: "architecte", a: 2, quote: "je demeurais tout le jour enfermé seul dans un poêle, où j'avais tout loisir de m'entretenir de mes pensées", explain: "Début de la IIe partie : l'hiver en Allemagne." },
    { notion: "maxime2", a: 3, quote: "Ma seconde maxime était d'être le plus ferme et le plus résolu en mes actions que je pourrais", explain: "Morale par provision." },
    { notion: "cogito", a: 4, quote: "je pense, donc je suis", explain: "Le premier principe de la philosophie." },
    { notion: "animaux", a: 5, quote: "la raison est un instrument universel qui peut servir en toutes sortes de rencontres", explain: "Le second critère distinguant l'homme de la machine." },
    { notion: "maitres", a: 6, quote: "nous rendre comme maîtres et possesseurs de la nature", explain: "La philosophie pratique." },
    { notion: "monde", a: 1, quote: "je quittai entièrement l'étude des lettres", explain: "Il part lire « le grand livre du monde »." },
    { notion: "conclusion-morale", a: 3, quote: "tâchant d'y être spectateur plutôt qu'acteur en toutes les comédies qui s'y jouent", explain: "Les neuf années de voyages, après la morale par provision." },
    { notion: "garantie-reve", a: 4, quote: "nous pouvons bien imaginer distinctement une tête de lion entée sur le corps d'une chèvre", explain: "La chimère : imaginer ne prouve pas l'existence." },
    { notion: "animaux", a: 5, quote: "les pies et les perroquets peuvent proférer des paroles ainsi que nous, et toutefois ne peuvent parler ainsi que nous", explain: "Proférer n'est pas parler." },
    { notion: "experiences", a: 6, quote: "si j'écris en français, qui est la langue de mon pays, plutôt qu'en latin", explain: "Avant-dernier paragraphe du livre." },
    { notion: "architecte", a: 2, quote: "nous avons tous été enfants avant que d'être hommes", explain: "Nos jugements sont faussés par l'enfance." },
    { notion: "etudes", a: 1, quote: "des palais fort superbes et fort magnifiques, qui n'étaient bâtis que sur du sable et sur de la boue", explain: "La morale des anciens païens." },
    { notion: "maxime3", a: 3, quote: "il n'y a rien qui soit entièrement en notre pouvoir que nos pensées", explain: "Troisième maxime." },
    { notion: "physique", a: 5, quote: "un médecin d'Angleterre, auquel il faut donner la louange d'avoir rompu la glace en cet endroit", explain: "Harvey et la circulation du sang." },
    { notion: "experiences", a: 6, quote: "comme le lierre, qui ne tend point à monter plus haut que les arbres qui le soutiennent", explain: "Les disciples d'Aristote." },
    { notion: "regles", a: 2, quote: "diviser chacune des difficultés que j'examinerais en autant de parcelles qu'il se pourrait", explain: "Deuxième règle de la méthode." },
    { notion: "garantie-reve", a: 4, quote: "on a une assurance morale de ces choses, qui est telle qu'il semble qu'à moins que d'être extravagant on n'en peut douter", explain: "Assurance morale contre certitude métaphysique." },
    { notion: "galilee", a: 6, quote: "des personnes à qui je défère [...] avaient désapprouvé une opinion de physique, publiée un peu auparavant par quelque autre", explain: "L'affaire Galilée, sans le nommer." },
    { notion: "dieu", a: 4, quote: "l'existence y était comprise en même façon qu'il est compris en celle d'un triangle que ses trois angles sont égaux à deux droits", explain: "La preuve par l'idée d'Être parfait." }
  ]);

  /* REMETTRE DANS L'ORDRE */
  add("order", [
    { part: 2, notion: "regles", q: "Remets les quatre règles de la méthode dans l'ordre.",
      items: ["Ne recevoir pour vrai que ce que je connais évidemment être tel", "Diviser chaque difficulté en autant de parcelles qu'il se peut", "Conduire par ordre mes pensées, des plus simples aux plus composées", "Faire des dénombrements si entiers que je sois assuré de ne rien omettre"],
      explain: "Évidence, analyse, ordre, dénombrement." },
    { part: 0, notion: "ctx", q: "Remets les six parties du Discours dans l'ordre.",
      items: ["Considérations touchant les sciences", "Les principales règles de la méthode", "Quelques règles de la morale tirée de la méthode", "Les preuves de l'existence de Dieu et de l'âme", "Les questions de physique : le cœur, l'âme des bêtes", "Ce qui est requis pour aller plus avant, et pourquoi il écrit"],
      explain: "C'est le plan annoncé par Descartes lui-même au seuil du livre." },
    { part: 4, notion: "cogito", q: "Rétablis la chaîne des raisons de la IVe partie.",
      items: ["Rejeter comme faux tout ce qui est douteux", "Je pense, donc je suis", "Je suis une substance dont l'essence est de penser", "Ce que je conçois clairement et distinctement est vrai", "J'ai l'idée d'un être plus parfait que moi", "Dieu existe", "Dieu garantit la vérité de mes idées claires et distinctes"],
      explain: "Doute → cogito → nature de l'âme → critère → idée du parfait → Dieu → garantie." },
    { part: 0, notion: "monde", q: "Remets dans l'ordre l'itinéraire raconté dans le Discours.",
      items: ["Études au collège, « nourri aux lettres dès [son] enfance »", "Il quitte l'étude des lettres pour le grand livre du monde", "Un hiver en Allemagne, seul dans un poêle", "Neuf ans de voyages, « spectateur plutôt qu'acteur »", "Retraite en Hollande et premières méditations métaphysiques", "Il renonce à publier son traité après une condamnation", "Il publie le Discours et trois essais"],
      explain: "I (études, voyages) → II (poêle) → III (neuf ans, Hollande) → IV (méditations) → VI (condamnation, publication)." },
    { part: 6, notion: "experiences", q: "Remets dans l'ordre la démarche de recherche décrite dans la VIe partie.",
      items: ["Chercher les principes ou premières causes, à partir des semences de vérités en nos âmes", "En déduire les premiers et plus ordinaires effets (cieux, astres, terre)", "Descendre aux choses plus particulières", "Recourir aux expériences pour savoir de quelle façon elles dépendent des principes"],
      explain: "Plus on descend vers le particulier, plus les expériences sont nécessaires." }
  ]);

  /* ASSOCIER */
  add("match", [
    { part: 0, q: "Associe chaque image à ce qu'elle signifie (parties I à III).",
      pairs: [
        { l: "La ville tracée par un seul ingénieur", r: "Ce qu'un seul conçoit est plus parfait", n: "architecte" },
        { l: "L'homme qui marche seul dans les ténèbres", r: "Avancer lentement pour au moins ne pas tomber", n: "reforme" },
        { l: "Le logement provisoire pendant les travaux", r: "La morale par provision", n: "morale-provision" },
        { l: "Les voyageurs égarés dans la forêt", r: "Rester ferme dans ses résolutions", n: "maxime2" },
        { l: "Le roc ou l'argile sous le sable", r: "Le fondement certain que cherche le doute", n: "conclusion-morale" },
        { l: "Les palais superbes bâtis sur la boue", r: "La morale des anciens, sans fondement solide", n: "etudes" }
      ], explain: "Ces images sont tes meilleures preuves de lecture au contrôle." },
    { part: 0, q: "Associe chaque image à ce qu'elle signifie (parties IV à VI).",
      pairs: [
        { l: "La tête de lion sur un corps de chèvre", r: "Imaginer distinctement ne prouve pas l'existence", n: "garantie-reve" },
        { l: "Le triangle et ses trois angles", r: "L'existence est comprise dans l'idée de Dieu", n: "dieu" },
        { l: "L'horloge et ses roues", r: "Un mouvement qui suit de la seule disposition des organes", n: "physique" },
        { l: "Le pilote en son navire", r: "Une union trop lâche de l'âme et du corps", n: "animaux" },
        { l: "Le lierre", r: "Les disciples qui ne dépassent pas leur maître", n: "experiences" },
        { l: "L'aveugle dans une cave obscure", r: "Se cacher derrière des principes obscurs", n: "experiences" }
      ], explain: "IV : chimère, triangle. V : horloge, pilote. VI : lierre, aveugle." },
    { part: 1, notion: "etudes", q: "Associe chaque discipline au jugement qu'en porte Descartes.",
      pairs: [
        { l: "Mathématiques", r: "Certaines et évidentes, mais rien de plus relevé bâti dessus" },
        { l: "Philosophie", r: "Il n'y a rien dont on ne dispute" },
        { l: "Théologie", r: "Vérités révélées au-dessus de notre intelligence" },
        { l: "Morale des anciens païens", r: "Palais superbes bâtis sur du sable" },
        { l: "Fables et romans", r: "Risque des extravagances des paladins" },
        { l: "Éloquence et poésie", r: "Dons de l'esprit plutôt que fruits de l'étude" }
      ], explain: "Chaque discipline a un mérite, aucune ne donne de certitude utile à la vie." },
    { part: 2, notion: "regles", cite: true, q: "Associe chaque règle à l'expression qui la résume.",
      pairs: [
        { l: "Évidence", r: "« la précipitation et la prévention »" },
        { l: "Analyse", r: "« autant de parcelles qu'il se pourrait »" },
        { l: "Ordre", r: "« comme par degrés »" },
        { l: "Dénombrement", r: "« assuré de ne rien omettre »" }
      ], explain: "À savoir citer : ces fragments suffisent à prouver ta lecture." },
    { part: 0, q: "Associe chaque notion à sa définition.",
      pairs: [
        { l: "Bon sens", r: "La puissance de bien juger et distinguer le vrai du faux", n: "bon-sens" },
        { l: "Paralogisme", r: "Une erreur de raisonnement", n: "doute" },
        { l: "Assurance morale", r: "Une certitude suffisante pour vivre, mais pas métaphysique", n: "garantie-reve" },
        { l: "Esprits animaux", r: "Comme un vent très subtil, une flamme très pure", n: "physique" },
        { l: "Prévention", r: "Un jugement porté d'avance, par préjugé", n: "regles" },
        { l: "Substance pensante", r: "Ce dont toute l'essence est de penser", n: "ame" }
      ], explain: "Le vocabulaire précis fait la différence dans une réponse de philosophie." }
  ]);

  /* CLASSER */
  add("sort", [
    { part: 3, q: "Range chaque énoncé dans la bonne maxime de la morale par provision.",
      buckets: ["Maxime 1", "Maxime 2", "Maxime 3", "Conclusion"],
      items: [
        { t: "Suivre les opinions les plus modérées", b: 0, n: "maxime1" },
        { t: "Garder la religion de son enfance", b: 0, n: "maxime1" },
        { t: "Éviter les promesses qui retranchent de sa liberté", b: 0, n: "maxime1" },
        { t: "Marcher droit comme un voyageur égaré", b: 1, n: "maxime2" },
        { t: "Suivre une opinion douteuse comme si elle était assurée", b: 1, n: "maxime2" },
        { t: "Se délivrer des repentirs et des remords", b: 1, n: "maxime2" },
        { t: "Changer ses désirs plutôt que l'ordre du monde", b: 2, n: "maxime3" },
        { t: "Faire de nécessité vertu", b: 2, n: "maxime3" },
        { t: "Employer toute sa vie à cultiver sa raison", b: 3, n: "conclusion-morale" }
      ], explain: "M1 : conformité et modération. M2 : fermeté. M3 : maîtrise de soi. Conclusion : cultiver sa raison." },
    { part: 4, notion: "doute", q: "Qu'est-ce qui tombe sous le doute, et qu'est-ce qui lui résiste ?",
      buckets: ["Tombe sous le doute", "Résiste au doute"],
      items: [
        { t: "J'ai un corps", b: 0 }, { t: "Il y a un monde et des astres", b: 0 },
        { t: "Les démonstrations de géométrie", b: 0 }, { t: "Ce que je vois et touche", b: 0 },
        { t: "Ce dont je rêve", b: 0 }, { t: "Je pense", b: 1 }, { t: "Je suis, tant que je pense", b: 1 }
      ], explain: "Tout peut être mis en doute, sauf la pensée qui doute, et donc l'existence de celui qui pense." },
    { part: 0, q: "Ce motif apparaît-il dans le Discours, ou ailleurs chez Descartes ?",
      buckets: ["Dans le Discours", "Pas dans le Discours"],
      items: [
        { t: "Le poêle", b: 0, n: "architecte" }, { t: "Les voyageurs égarés en forêt", b: 0, n: "maxime2" },
        { t: "La chimère (tête de lion, corps de chèvre)", b: 0, n: "garantie-reve" }, { t: "Les pies et les perroquets", b: 0, n: "animaux" },
        { t: "Le lierre", b: 0, n: "experiences" }, { t: "Le malin génie", b: 1, n: "doute" },
        { t: "Le morceau de cire", b: 1, n: "ame" }, { t: "« Je suis, j'existe »", b: 1, n: "cogito" },
        { t: "L'arbre de la philosophie", b: 1, n: "ctx" }
      ], explain: "Malin génie, cire et « je suis, j'existe » : Méditations (1641). L'arbre (racines = métaphysique) : préface des Principes. Beaucoup de vidéos mélangent." },
    { part: 0, q: "Cette règle vaut-elle pour la recherche de la vérité, ou pour la conduite de la vie ?",
      buckets: ["Chercher la vérité (juger)", "Conduire sa vie (agir)"],
      items: [
        { t: "Rejeter comme faux le moindre doute", b: 0, n: "doute" },
        { t: "Ne recevoir pour vrai que l'évident", b: 0, n: "regles" },
        { t: "Diviser chaque difficulté", b: 0, n: "regles" },
        { t: "Feindre que tout n'est qu'illusion de songe", b: 0, n: "doute" },
        { t: "Suivre les opinions les plus probables", b: 1, n: "maxime2" },
        { t: "Rester ferme même dans les opinions douteuses", b: 1, n: "maxime2" },
        { t: "Obéir aux lois et coutumes de son pays", b: 1, n: "maxime1" },
        { t: "Changer ses désirs plutôt que l'ordre du monde", b: 1, n: "maxime3" }
      ], explain: "La distinction clé du livre : pour agir, on suit l'incertain comme s'il était certain ; pour connaître, on fait « tout le contraire »." }
  ]);

  /* SCHÉMAS */
  add("schema", [
    { part: 4, layout: "flow", q: "Complète le schéma : la chaîne des raisons de la IVe partie.",
      nodes: [
        { cap: "1", t: "Doute : rejeter comme faux tout ce qui est douteux" },
        { cap: "2", slot: "Je pense, donc je suis", n: "cogito" },
        { cap: "3", slot: "Je suis une chose qui pense, distincte du corps", n: "ame" },
        { cap: "4", slot: "Règle : le clair et distinct est vrai", n: "critere" },
        { cap: "5", t: "Je doute, donc je suis imparfait" },
        { cap: "6", slot: "L'idée du parfait vient d'un être parfait : Dieu existe", n: "dieu" },
        { cap: "7", slot: "Dieu garantit le clair et distinct", n: "garantie-reve" },
        { cap: "8", t: "Éveillé ou endormi, se fier à l'évidence de la raison" }
      ],
      distract: ["Un malin génie me trompe", "Le morceau de cire"],
      explain: "Les pièges viennent des Méditations : ils ne figurent pas dans le Discours." },
    { part: 4, notion: "doute", layout: "tree", q: "Complète l'arbre des trois raisons de douter.",
      root: "Le doute méthodique",
      branches: [
        [{ slot: "Les sens" }, { t: "Ils nous trompent quelquefois" }, { slot: "Rien n'est tel qu'ils le font imaginer" }],
        [{ slot: "Les raisonnements" }, { t: "On fait des paralogismes, même en géométrie" }, { slot: "Toutes les démonstrations sont rejetées" }],
        [{ slot: "Le rêve" }, { t: "Les mêmes pensées viennent en dormant" }, { slot: "Tout n'est pas plus vrai qu'un songe" }]
      ],
      distract: ["Le malin génie", "La folie"],
      explain: "Sens → raisonnements → rêve. La folie et le malin génie appartiennent aux Méditations." },
    { part: 2, notion: "regles", layout: "pictos", q: "Associe chaque pictogramme à la règle de la méthode qu'il représente.",
      nodes: [
        { icon: "filter", cap: "Un filtre", slot: "Évidence" },
        { icon: "split", cap: "Un bloc découpé", slot: "Analyse" },
        { icon: "stairs", cap: "Un escalier", slot: "Ordre" },
        { icon: "list", cap: "Une liste cochée", slot: "Dénombrement" }
      ],
      distract: ["Prévention", "Syllogisme"],
      explain: "Filtrer le douteux, découper, monter par degrés, tout passer en revue." },
    { part: 0, layout: "flow", q: "Le Discours comme un chantier : complète le schéma des six parties.",
      nodes: [
        { cap: "I", t: "Le terrain : les études n'offrent rien de solide" },
        { cap: "II", slot: "Le plan : quatre règles", n: "regles" },
        { cap: "III", slot: "Le logement provisoire : la morale", n: "morale-provision" },
        { cap: "IV", slot: "Les fondations : je pense, donc je suis", n: "cogito" },
        { cap: "V", t: "L'édifice : la physique et le corps-machine" },
        { cap: "VI", slot: "L'usage : maîtres et possesseurs de la nature", n: "maitres" }
      ],
      distract: ["Les murs : la logique des syllogismes", "Le toit : la théologie"],
      explain: "L'image de la maison à rebâtir traverse tout le livre : à réutiliser dans tes introductions." }
  ]);

  /* TABLEAUX */
  add("grid", [
    { part: 5, notion: "animaux", q: "Coche ce qui vaut pour chacun, selon la Ve partie.",
      cols: ["Homme", "Animal", "Machine"],
      rows: [
        { t: "Peut proférer des paroles", a: [1, 1, 1] },
        { t: "Arrange ses paroles pour répondre au sens de ce qu'on dit", a: [1, 0, 0] },
        { t: "Possède la raison, « instrument universel »", a: [1, 0, 0] },
        { t: "Agit seulement par la disposition de ses organes", a: [0, 1, 1] },
        { t: "A un corps qui fonctionne comme une machine", a: [1, 1, 1], n: "physique" },
        { t: "A une âme qui ne meurt pas avec le corps", a: [1, 0, 0] }
      ],
      explain: "Perroquets et machines profèrent des mots sans parler. Le corps humain est une machine ; seule l'âme raisonnable distingue l'homme." },
    { part: 4, q: "Qu'est-ce qui est certain à chaque étape de la IVe partie ?",
      cols: ["Au début du doute", "Après le cogito", "Après Dieu"],
      rows: [
        { t: "J'existe", a: [0, 1, 1], n: "cogito" },
        { t: "Je suis une chose qui pense", a: [0, 1, 1], n: "ame" },
        { t: "Le clair et distinct est vrai (pleinement assuré)", a: [0, 0, 1], n: "critere" },
        { t: "Dieu existe", a: [0, 0, 1], n: "dieu" },
        { t: "Les démonstrations de géométrie sont certaines", a: [0, 0, 1], n: "garantie-reve" }
      ],
      explain: "Le cogito donne l'existence et la nature du moi. La règle est posée à partir de lui, mais n'est « assurée qu'à cause que Dieu est »." }
  ]);

  /* CARTES MÉMOIRE */
  add("flash", [
    { part: 2, notion: "regles", f: "Les quatre règles de la méthode ?", b: "Évidence · Analyse · Ordre (synthèse) · Dénombrement" },
    { part: 4, notion: "doute", f: "Les trois raisons de douter (IVe partie) ?", b: "Les sens trompent · on fait des paralogismes · le rêve" },
    { part: 3, notion: "morale-provision", f: "Les trois maximes de la morale par provision ?", b: "1. Lois, coutumes, religion, opinions modérées · 2. Fermeté (la forêt) · 3. Se vaincre plutôt que la fortune" },
    { part: 5, notion: "animaux", f: "Les deux critères qui distinguent l'homme de la machine ?", b: "Le langage (répondre au sens) · l'universalité de la raison (instrument universel)" },
    { part: 1, notion: "bon-sens", f: "Définition du bon sens ?", b: "« La puissance de bien juger et distinguer le vrai d'avec le faux », naturellement égale en tous" },
    { part: 2, notion: "architecte", f: "Où naît le projet de la méthode ?", b: "En Allemagne, au début d'un hiver, seul dans un poêle (une pièce chauffée)" },
    { part: 3, notion: "morale-provision", f: "Pourquoi une morale « par provision » ?", b: "Pour ne pas rester irrésolu dans l'action pendant qu'il doute dans ses jugements (le logement provisoire)" },
    { part: 4, notion: "cogito", f: "Le premier principe de la philosophie ?", b: "« Je pense, donc je suis »" },
    { part: 4, notion: "ame", f: "Quelle est l'essence de l'âme ?", b: "Penser. Elle n'a besoin d'aucun lieu ni d'aucune chose matérielle" },
    { part: 4, notion: "critere", f: "La règle générale tirée du cogito ?", b: "Ce que nous concevons fort clairement et fort distinctement est vrai" },
    { part: 4, notion: "dieu", f: "Les preuves de Dieu dans le Discours ?", b: "Par l'idée du parfait · par ma dépendance · par l'idée d'Être parfait qui contient l'existence (triangle)" },
    { part: 4, notion: "garantie-reve", f: "Pourquoi Dieu est-il nécessaire après le cogito ?", b: "Il garantit la règle du clair et distinct et permet de lever le doute du rêve" },
    { part: 4, notion: "garantie-reve", f: "Comment distinguer la veille du rêve ?", b: "Par la raison : en dormant, nos raisonnements ne sont jamais si évidents ni si entiers" },
    { part: 4, notion: "garantie-reve", f: "« Assurance morale » ?", b: "Une certitude suffisante pour la vie (j'ai un corps, il y a des astres), mais pas une certitude métaphysique" },
    { part: 5, notion: "animaux", f: "Pourquoi les bêtes n'ont-elles « point du tout » de raison ?", b: "Aucune n'arrange des signes pour exprimer ses pensées, alors que même les hommes hébétés et les sourds-muets le font" },
    { part: 6, notion: "maitres", f: "Que veut-il à la place de la philosophie spéculative ?", b: "Une philosophie pratique qui nous rende « comme maîtres et possesseurs de la nature », surtout pour la santé" },
    { part: 6, notion: "galilee", f: "Pourquoi n'a-t-il pas publié son traité ?", b: "La condamnation d'une opinion de physique (Galilée, 1633) par des personnes à qui il défère" },
    { part: 6, notion: "experiences", f: "Pourquoi écrire en français ?", b: "Pour être jugé par ceux qui usent de leur raison naturelle, non par ceux qui ne croient qu'aux livres anciens" },
    { part: 3, notion: "conclusion-morale", f: "Doute cartésien contre doute sceptique ?", b: "Méthodique : un moyen pour trouver « le roc ou l'argile ». Les sceptiques doutent pour douter" },
    { part: 2, notion: "maths", f: "Que reproche-t-il à la logique ?", b: "Ses syllogismes servent à expliquer ce qu'on sait, pas à découvrir ; et elle a trop de préceptes" },
    { part: 2, notion: "reforme", f: "Pourquoi ne pas réformer l'État ?", b: "Les grands corps sont trop malaisés à relever une fois abattus ; on ne réforme que ses propres pensées" },
    { part: 2, notion: "reforme", f: "La pluralité des voix ?", b: "Pas une preuve pour les vérités difficiles : un homme seul les trouve plus vraisemblablement qu'un peuple" },
    { part: 0, notion: "ctx", f: "Date, lieu, forme de publication ?", b: "1637, Leyde, anonyme, en français, préface à la Dioptrique, aux Météores et à la Géométrie" },
    { part: 3, notion: "conclusion-morale", f: "« Il suffit de bien juger pour bien faire » ?", b: "La conduite dépend du jugement : cultiver sa raison, c'est aussi s'assurer de bien agir" },
    { part: 6, notion: "experiences", f: "Le rôle des expériences (VIe partie) ?", b: "D'autant plus nécessaires qu'on avance : elles tranchent entre plusieurs explications. Trop nombreuses pour un seul homme" },
    { part: 1, notion: "monde", f: "Que lui apprennent ses voyages ?", b: "À ne pas croire trop fermement ce qu'il ne tient que de l'exemple et de la coutume" },
    { part: 5, notion: "physique", f: "Les esprits animaux ?", b: "« Comme un vent très subtil, ou plutôt comme une flamme très pure et très vive » qui meut le corps" }
  ]);

  /* QUESTIONS DE RÉFLEXION : construire la réponse */
  add("build", [
    { part: 1, ns: ["bon-sens", "architecte"], q: "Si le bon sens est la chose du monde la mieux partagée, pourquoi les hommes ne pensent-ils pas tous la même chose ?",
      els: [
        { t: "Le bon sens est la puissance de bien juger, naturellement égale en tous", ok: true },
        { t: "La diversité vient de ce que nous conduisons nos pensées par des voies différentes", ok: true },
        { t: "Il ne suffit pas d'avoir l'esprit bon : il faut l'appliquer bien, d'où la méthode", ok: true },
        { t: "Nos jugements sont faussés par l'enfance, nos précepteurs, la coutume", ok: true },
        { t: "Certains peuples sont naturellement plus raisonnables", ok: false, why: "Contraire au texte : l'égalité est naturelle." },
        { t: "Le malin génie trompe certains esprits plus que d'autres", ok: false, why: "Le malin génie n'est pas dans le Discours." },
        { t: "La vérité est relative à chaque culture", ok: false, why: "Descartes cherche une vérité certaine, il n'est pas relativiste." },
        { t: "Le bon sens est un sentiment, non une faculté de juger", ok: false, why: "C'est précisément la faculté de juger." }
      ],
      prob: "Comment concilier une égalité de nature (la raison) et une inégalité de fait (les opinions) ?",
      plan: ["Le bon sens est également réparti : l'argument ironique, la définition (puissance de bien juger).", "La différence vient de l'usage : voies diverses, objets différents ; préjugés de l'enfance et de la coutume (I et II).", "D'où la méthode : « le principal est de l'appliquer bien » ; le marcheur lent sur le droit chemin."],
      cit: "Ce n'est pas assez d'avoir l'esprit bon, mais le principal est de l'appliquer bien." },
    { part: 1, ns: ["etudes", "monde"], q: "Pourquoi Descartes, après des études brillantes, se dit-il « embarrassé de tant de doutes et d'erreurs » ?",
      els: [
        { t: "Chaque discipline a des mérites, aucune ne donne de connaissance certaine", ok: true },
        { t: "En philosophie, tout est disputé, donc douteux", ok: true },
        { t: "Les mathématiques sont certaines, mais on n'a rien bâti dessus de plus relevé", ok: true },
        { t: "Il quitte les livres pour le grand livre du monde, puis étudie en lui-même", ok: true },
        { t: "Ses maîtres étaient incompétents", ok: false, why: "Il étudiait dans « l'une des plus célèbres écoles de l'Europe »." },
        { t: "Il rejette la religion comme une superstition", ok: false, why: "Il révère la théologie." },
        { t: "Il conclut que la vérité n'existe pas", ok: false, why: "Ce n'est pas un sceptique." },
        { t: "Les voyages lui prouvent que les mœurs françaises sont les meilleures", ok: false, why: "C'est l'inverse : il relativise sa coutume." }
      ],
      prob: "Pourquoi un savoir abondant peut-il laisser sans certitude ?",
      plan: ["Revue des disciplines : mérites et limites de chacune.", "Le critère est la certitude : le vraisemblable est tenu pour presque faux ; seules les mathématiques sont certaines, mais mal employées.", "Le remède : le grand livre du monde (contre la coutume), puis la décision d'étudier en soi-même."],
      cit: "je réputais presque pour faux tout ce qui n'était que vraisemblable." },
    { part: 2, ns: ["reforme", "architecte", "maxime1"], q: "Pourquoi Descartes refuse-t-il de réformer l'État, alors qu'il entreprend de réformer toutes ses opinions ?",
      els: [
        { t: "Ce qu'un seul conçoit est plus parfait : il peut rebâtir ses propres pensées", ok: true },
        { t: "Les grands corps sont trop malaisés à relever ; l'usage a adouci leurs défauts", ok: true },
        { t: "Il ne veut bâtir que « dans un fonds qui est tout à [lui] »", ok: true },
        { t: "Sa 1re maxime lui fait obéir aux lois et coutumes de son pays", ok: true },
        { t: "Il pense que l'État est parfait", ok: false, why: "Il reconnaît ses imperfections, adoucies par l'usage." },
        { t: "Il conseille à chacun de faire table rase", ok: false, why: "« Ce n'est pas un exemple que chacun doive suivre. »" },
        { t: "La méthode ne vaut que pour les mathématiques", ok: false, why: "Elle vaut pour toutes les sciences." },
        { t: "Il craint d'être condamné comme Galilée", ok: false, why: "Hors sujet ici : l'argument de la IIe partie est l'échelle et le risque." }
      ],
      prob: "La radicalité du doute est-elle compatible avec la prudence politique ?",
      plan: ["La ville et l'architecte : on peut rebâtir sa maison, pas raser une ville.", "Différence d'échelle : un État est un grand corps, l'esprit un fonds personnel.", "Cohérence avec la 1re maxime, et mise en garde : pas un exemple pour tous."],
      cit: "Mon dessein ne s'est jamais étendu plus avant que de tâcher à réformer mes propres pensées" },
    { part: 2, ns: ["regles", "maths"], q: "Comment quatre règles peuvent-elles suffire à toute la méthode ?",
      els: [
        { t: "Peu de lois strictement observées valent mieux que beaucoup", ok: true },
        { t: "Évidence, analyse, ordre, dénombrement forment un parcours complet", ok: true },
        { t: "Modèle : les longues chaînes de raisons des géomètres", ok: true },
        { t: "La règle d'évidence exclut précipitation et prévention", ok: true },
        { t: "Les règles reprennent les syllogismes d'Aristote", ok: false, why: "Elles remplacent la logique de l'École." },
        { t: "La méthode commence par l'expérience des sens", ok: false, why: "Elle commence par l'évidence rationnelle." },
        { t: "Chaque règle s'applique à une science différente", ok: false, why: "Toutes valent pour toute recherche." },
        { t: "Les règles sont tirées de l'Écriture", ok: false, why: "Elles viennent de la raison et du modèle mathématique." }
      ],
      prob: "Comment si peu de règles peuvent-elles guider la recherche dans toutes les sciences ?",
      plan: ["Critique de la logique et de ses nombreux préceptes : comparaison avec l'État.", "Les quatre règles : critère (évidence), diviser, reconstruire, vérifier.", "Leur universalité vient du modèle mathématique : tout « s'entre-suit »."],
      cit: "pourvu que je prisse une ferme et constante résolution de ne manquer pas une seule fois à les observer." },
    { part: 3, ns: ["morale-provision", "maxime2", "doute"], q: "Pourquoi Descartes a-t-il besoin d'une morale « par provision » ? Contredit-elle son doute ?",
      els: [
        { t: "L'image du logement provisoire pendant qu'on rebâtit", ok: true },
        { t: "Douter en théorie n'empêche pas de devoir agir : la vie ne souffre aucun délai", ok: true },
        { t: "2e maxime : suivre fermement même les opinions douteuses (la forêt)", ok: true },
        { t: "En IV, le doute fait « tout le contraire » : il vaut pour la vérité, pas pour la vie", ok: true },
        { t: "C'est une morale définitive", ok: false, why: "Elle est provisoire, en attendant mieux." },
        { t: "Il met aussi en doute la foi pendant ce temps", ok: false, why: "Il met les vérités de la foi à part." },
        { t: "Il faut s'abstenir d'agir tant qu'on n'est pas certain", ok: false, why: "C'est ce qu'il veut éviter : l'irrésolution." },
        { t: "Le doute s'applique d'abord à la conduite de la vie", ok: false, why: "Il ne porte que sur les jugements." }
      ],
      prob: "Comment vivre et agir pendant qu'on doute de tout ?",
      plan: ["Le problème : l'irrésolution du jugement ne doit pas devenir irrésolution de l'action (la maison).", "Les maximes répondent à ce besoin : conformité, fermeté, maîtrise de soi.", "Distinction théorie / pratique : pas de contradiction ; le provisoire est fondé sur le dessein de s'instruire."],
      cit: "afin que je ne demeurasse point irrésolu en mes actions pendant que la raison m'obligerait de l'être en mes jugements" },
    { part: 3, ns: ["maxime3"], q: "Que signifie « changer mes désirs plutôt que l'ordre du monde » ?",
      els: [
        { t: "Rien n'est entièrement en notre pouvoir que nos pensées", ok: true },
        { t: "Après avoir fait de son mieux, ce qui manque est à tenir pour impossible", ok: true },
        { t: "Faire de nécessité vertu : ne pas désirer l'impossible (diamant, ailes)", ok: true },
        { t: "Inspiration stoïcienne : se soustraire à l'empire de la fortune", ok: true },
        { t: "Il faut renoncer à toute action dans le monde", ok: false, why: "On fait d'abord de son mieux." },
        { t: "Il faut transformer le monde par la technique", ok: false, why: "C'est la VIe partie, dans un autre registre." },
        { t: "Nos désirs sont toujours mauvais", ok: false, why: "Il s'agit de les régler, pas de les condamner." },
        { t: "C'est une maxime tirée de la Bible", ok: false, why: "Elle vient des philosophes anciens (stoïciens)." }
      ],
      prob: "Le bonheur dépend-il de ce que nous obtenons ou de ce que nous désirons ?",
      plan: ["Le partage : nos pensées dépendent de nous, le reste non.", "La règle des désirs : faire de son mieux, puis tenir le reste pour impossible ; les exemples.", "Portée et limites : héritage stoïcien ; tension avec la VIe partie (maîtrise de la nature)."],
      cit: "il n'y a rien qui soit entièrement en notre pouvoir que nos pensées" },
    { part: 4, ns: ["doute", "conclusion-morale", "cogito"], q: "En quoi le doute cartésien n'est-il pas un doute sceptique ?",
      els: [
        { t: "C'est un doute méthodique : un moyen pour trouver un fondement", ok: true },
        { t: "Il cherche « le roc ou l'argile » sous le sable", ok: true },
        { t: "Il est hyperbolique : le simple douteux est traité comme faux", ok: true },
        { t: "Il aboutit à une certitude : je pense, donc je suis", ok: true },
        { t: "Il s'étend aussi à la conduite de la vie", ok: false, why: "La morale par provision le tient à l'écart de l'action." },
        { t: "Il conclut qu'on ne peut rien savoir", ok: false, why: "C'est la position qu'il combat." },
        { t: "Il s'appuie sur le malin génie", ok: false, why: "Méditations, pas Discours." },
        { t: "Il ne porte que sur les sens", ok: false, why: "Aussi sur les raisonnements et le rêve." }
      ],
      prob: "Peut-on douter de tout pour atteindre la certitude ?",
      plan: ["Les sceptiques doutent pour douter ; Descartes doute pour s'assurer.", "Un doute volontaire, méthodique, hyperbolique : sens, raisonnements, rêve.", "Il se dépasse lui-même : le cogito résiste aux « plus extravagantes suppositions des sceptiques »."],
      cit: "tout mon dessein ne tendait qu'à m'assurer, et à rejeter la terre mouvante et le sable, pour trouver le roc ou l'argile." },
    { part: 4, ns: ["cogito", "critere", "ame"], q: "Pourquoi « je pense, donc je suis » est-il le premier principe de la philosophie ?",
      els: [
        { t: "Il résiste à toutes les raisons de douter, même au rêve", ok: true },
        { t: "Douter, c'est penser ; et pour penser, il faut être", ok: true },
        { t: "Il sert de modèle de vérité : le clair et distinct", ok: true },
        { t: "Il fait connaître le moi : une chose qui pense, distincte du corps", ok: true },
        { t: "Il prouve d'abord l'existence du corps", ok: false, why: "Le corps reste douteux à ce stade." },
        { t: "Tous les philosophes l'admettaient déjà", ok: false, why: "Sa force vient de l'évidence, pas de l'autorité." },
        { t: "Il est découvert dans le poêle, en Allemagne", ok: false, why: "Le poêle, c'est la méthode (II)." },
        { t: "Il repose sur une expérience sensible", ok: false, why: "Les sens ont été mis en doute." }
      ],
      prob: "Comment une vérité unique peut-elle fonder tout le reste ?",
      plan: ["Il surgit du doute même : pendant que je pense que tout est faux, moi qui le pense, je suis.", "Il est indubitable et fournit le critère : ce qui est clair et distinct est vrai.", "Il ouvre la métaphysique : la nature de l'âme, puis Dieu."],
      cit: "je jugeai que je pouvais la recevoir sans scrupule pour le premier principe de la philosophie que je cherchais." },
    { part: 4, ns: ["ame", "dieu"], q: "Pourquoi l'âme est-elle « plus aisée à connaître » que le corps ?",
      els: [
        { t: "Je peux feindre que je n'ai pas de corps, pas que je ne suis pas", ok: true },
        { t: "L'âme est connue dès le cogito, le corps reste douteux", ok: true },
        { t: "Le corps relève des sens et de l'imagination, qui peuvent tromper", ok: true },
        { t: "Vouloir imaginer l'âme, c'est comme vouloir entendre avec ses yeux", ok: true },
        { t: "L'âme est visible dans le cerveau", ok: false, why: "Elle n'a besoin d'aucun lieu." },
        { t: "Le corps n'existe pas", ok: false, why: "Il est seulement douteux à ce stade." },
        { t: "L'âme est mortelle", ok: false, why: "Elle ne meurt pas avec le corps (V)." },
        { t: "Les animaux ont aussi une âme pensante", ok: false, why: "Ils n'ont point de raison (V)." }
      ],
      prob: "Qu'est-ce qui nous est le plus proche : notre corps ou notre pensée ?",
      plan: ["L'expérience de pensée : feindre l'absence de corps, de monde, de lieu ; impossible de feindre que je ne suis pas.", "Conclusion : une substance dont l'essence est de penser, indépendante de la matière.", "Renversement du sens commun : l'imagination ne vaut que pour les choses matérielles."],
      cit: "elle est plus aisée à connaître que lui, et qu'encore qu'il ne fût point, elle ne laisserait pas d'être tout ce qu'elle est." },
    { part: 4, ns: ["garantie-reve", "dieu", "critere"], q: "Comment Descartes peut-il être certain de ne pas rêver ?",
      els: [
        { t: "Pas par les sens, qui trompent aussi éveillés (jaunisse, astres)", ok: true },
        { t: "Ne se fier qu'à l'évidence de la raison, éveillé ou endormi", ok: true },
        { t: "Dieu, parfait, garantit nos idées claires et distinctes", ok: true },
        { t: "En dormant, nos raisonnements ne sont jamais si évidents ni si entiers", ok: true },
        { t: "La douleur d'un pincement prouve la veille", ok: false, why: "Les sens ne suffisent pas." },
        { t: "Les images des rêves sont toujours moins vives", ok: false, why: "Elles sont parfois aussi ou plus vives." },
        { t: "Un rêve ne peut contenir aucune vérité", ok: false, why: "Une démonstration géométrique y resterait vraie." },
        { t: "Le malin génie est écarté par la prière", ok: false, why: "Hors Discours, et hors sujet." }
      ],
      prob: "Si le rêve imite la veille, qu'est-ce qui nous assure de la réalité ?",
      plan: ["Le doute du rêve : assurance morale n'est pas certitude métaphysique.", "La solution passe par Dieu : la règle du clair et distinct n'est assurée que par lui ; l'erreur vient du confus.", "Le critère est la raison, non l'imagination ni les sens (soleil, chimère) ; le vrai est plutôt dans nos pensées éveillées."],
      cit: "soit que nous veillions, soit que nous dormions, nous ne nous devons jamais laisser persuader qu'à l'évidence de notre raison." },
    { part: 5, ns: ["animaux", "physique"], q: "Qu'est-ce qui distingue l'homme de l'animal et de la machine ?",
      els: [
        { t: "Le langage : arranger des paroles pour répondre au sens de ce qu'on dit", ok: true },
        { t: "La raison, instrument universel, contre des organes disposés pour chaque action", ok: true },
        { t: "Les bêtes n'ont pas moins de raison : elles n'en ont point du tout", ok: true },
        { t: "Le corps aussi est une machine : la différence est l'âme raisonnable", ok: true },
        { t: "Les animaux ont un langage que nous ne comprenons pas", ok: false, why: "Descartes rejette cette thèse des « anciens »." },
        { t: "Une machine ne pourrait proférer aucun mot", ok: false, why: "Elle pourrait en proférer, sans parler vraiment." },
        { t: "Les animaux sont meilleurs que nous en tout", ok: false, why: "En certaines choses seulement, et sans esprit." },
        { t: "L'homme se distingue par sa force physique", ok: false, why: "Hors sujet." }
      ],
      prob: "Peut-on reconnaître une pensée de l'extérieur ?",
      plan: ["Le corps comme machine : une machine-singe serait indiscernable d'un singe.", "Deux critères pour l'homme : langage et universalité de la raison (perroquets, sourds-muets, horloge).", "Conséquences : les bêtes sans raison ; l'âme créée, unie au corps (pas un pilote), immortelle."],
      cit: "la raison est un instrument universel qui peut servir en toutes sortes de rencontres" },
    { part: 6, ns: ["maitres", "experiences"], q: "Que signifie le projet de nous rendre « comme maîtres et possesseurs de la nature » ?",
      els: [
        { t: "Remplacer la philosophie spéculative par une philosophie pratique", ok: true },
        { t: "Connaître les forces de la nature comme les métiers des artisans", ok: true },
        { t: "Le but premier : la santé, par la médecine", ok: true },
        { t: "Le « comme » marque une limite : l'homme n'est pas Dieu", ok: true },
        { t: "Détruire la nature pour s'enrichir", ok: false, why: "Le texte vise la santé et le bien commun." },
        { t: "Un projet pour un savant isolé", ok: false, why: "La science doit être collective." },
        { t: "Dominer les autres hommes", ok: false, why: "Il s'agit de la nature, pas des hommes." },
        { t: "Un projet exposé dans la IIIe partie", ok: false, why: "C'est la VIe partie." }
      ],
      prob: "Le savoir doit-il servir à transformer le monde ?",
      plan: ["Une rupture : de la science contemplative à une science utile, sur le modèle des artisans.", "Des fins précises : commodités, mais surtout la santé, « premier bien » ; la médecine.", "Limites et portée : le « comme », les expériences collectives ; piste critique : la technique moderne."],
      cit: "et ainsi nous rendre comme maîtres et possesseurs de la nature." },
    { part: 0, ns: ["ctx", "experiences"], q: "Pourquoi Descartes présente-t-il son livre comme une « histoire » ou une « fable », à la première personne ?",
      els: [
        { t: "Il ne veut pas enseigner la méthode, mais montrer comment il a conduit sa raison", ok: true },
        { t: "Chacun doit juger par lui-même, avec sa propre raison", ok: true },
        { t: "Il présente sa vie « comme en un tableau », pour qu'on en tire ce qui est utile", ok: true },
        { t: "Il écrit en français pour ceux qui usent de leur raison naturelle", ok: true },
        { t: "Pour raconter sa vie privée et ses aventures", ok: false, why: "C'est une autobiographie intellectuelle." },
        { t: "Pour imposer une doctrine officielle", ok: false, why: "C'est l'inverse." },
        { t: "Parce que la philosophie n'est qu'une fiction", ok: false, why: "Il cherche la vérité certaine." },
        { t: "Pour imiter les romans de chevalerie", ok: false, why: "Il critique les « paladins de nos romans »." }
      ],
      prob: "Peut-on transmettre une méthode sans l'imposer ?",
      plan: ["La modestie du projet : faire voir, pas enseigner ; « une histoire, ou une fable ».", "Cohérence avec la thèse : le bon sens est égal en tous, chacun peut juger.", "Le français et le récit : s'adresser à la raison naturelle, contre l'autorité des livres."],
      cit: "mon dessein n'est pas d'enseigner ici la méthode que chacun doit suivre pour bien conduire sa raison, mais seulement de faire voir en quelle sorte j'ai tâché de conduire la mienne." }
  ]);

  /* Réglages propres à ce livre (le moteur a des valeurs par défaut pour les autres) */
  const unit = { one: "partie", many: "parties", fem: true };
  const exam = {
    kind: "contrôle de lecture de philosophie",
    format: "4 questions de réflexion en 1 h",
    perQuestion: "environ 15 minutes par question"
  };
  const plan = {
    defaultRead: [],
    priority: [4, 2, 3, 1, 6, 5],
    essOrder: [6, 5, 2, 3, 1],
    fullOrder: [4, 6, 3, 2, 1, 5],
    why: {
      1: "La phrase d'ouverture sur le bon sens fournit souvent un sujet de réflexion.",
      2: "Les quatre règles et l'image de l'architecte sont incontournables ; elles sont courtes et faciles à citer.",
      3: "Les trois maximes et leurs images (la maison, la forêt) nourrissent toutes les réponses sur l'action.",
      4: "C'est le cœur métaphysique du livre (doute, cogito, âme, Dieu, rêve), et c'est l'une des parties les plus courtes.",
      5: "L'essentiel pour un contrôle est la fin : homme, animal et machine, avec les deux critères. Le cœur peut se survoler.",
      6: "Les vidéos la survolent souvent ; or « maîtres et possesseurs de la nature » est un sujet classique."
    }
  };
  const overview = {
    title: "Le Discours en six temps",
    intro: "Descartes compare sa démarche à une maison qu'on rebâtit : constater que le terrain est meuble, tracer le plan, se loger en attendant, poser les fondations, bâtir, puis habiter.",
    boxes: [
      { t: "Le fil rouge", b: "Le bon sens est égal en tous : tout dépend de la méthode. Douter pour juger, mais agir sans hésiter ; trouver un premier principe certain, puis bâtir une science utile à la vie." },
      { t: "Le piège numéro un", b: "Ne pas mélanger avec les Méditations (1641) : ni malin génie, ni morceau de cire, ni « je suis, j'existe » dans le Discours." }
    ]
  };
  const tips = [
    "Pour chaque argument, cite une image ou une formule du texte (l'architecte, la forêt, le roc et l'argile, la chimère…) : c'est la preuve que tu as lu.",
    "Ne mélange pas le Discours (1637) et les Méditations (1641) : pas de malin génie, pas de morceau de cire.",
    "Distingue toujours juger (douter de tout) et agir (suivre fermement le plus probable) : beaucoup de questions reposent sur cette différence.",
    "Annonce une problématique en une phrase, puis deux ou trois arguments dans l'ordre du texte.",
    "Emploie le vocabulaire exact : évidence, doute méthodique, substance pensante, clair et distinct, morale par provision.",
    "Termine par une nuance ou une limite (le « comme » de « maîtres et possesseurs », le provisoire de la morale)."
  ];

  return { unit, exam, plan, overview, tips, parts, reading, notions, exercises };
})());
