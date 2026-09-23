export type CarrierId = "stretchy" | "woven" | "slings" | "mehdais" | "buckles" | "onbuhimos";

export const carrierGuide = {
  navigation: {
    label: "Carrier Guide",
    href: "/carrier-guide",
  },

  seo: {
    title: "How to choose a baby carrier | Nestled",
    description:
      "Stretchy wrap, woven wrap, ring sling, meh dai or half buckle, soft structured carrier or onbuhimo? A plain-spoken guide to finding your fit, and renting it before you buy.",
  },

  // Set enabled to false to hide a section. Reorder this array to reorder the page.
  sections: [
    { id: "start", label: "Quick match", enabled: true },
    { id: "types", label: "Carrier types", enabled: true },
    { id: "compare", label: "Compare", enabled: true },
    { id: "fit", label: "Fit", enabled: true },
    { id: "fabric", label: "Fabric and weather", enabled: true },
    { id: "safety", label: "Safety", enabled: true },
    { id: "faq", label: "Questions", enabled: true },
    { id: "help", label: "Get help", enabled: true },
  ],

  links: {
    library: "/#browse-all",
    // Leave empty to use the same WhatsApp link the site header uses (from Site Settings).
    whatsapp: "",
    safetyPage: "/safety",
  },

  hero: {
    eyebrow: "The Nestled carrier guide",
    title: "Which carrier is right for your family?",
    intro:
      "Think about your baby's stage, the kind of days you have, and what your own back and shoulders enjoy. Find a carrier that works, to rent it before you buy one from the brand or from the library itself.",
    //byline: "Written by [NAME, YOUR BABYWEARING CREDENTIAL]",
    image: { src: "", alt: "A parent wearing a baby in a carrier from the Nestled library" },
  },

  quickMatch: {
    title: "What does your week look like?",
    intro: "Pick the line that sounds most like your week. It points to the style worth borrowing first.",
    items: [
      { situation: "Newborn weeks, long cuddles at home", suggestion: "Try a stretchy wrap", target: "stretchy" },
      {
        situation: "Quick ups and downs, market runs, a baby who wants in and out",
        suggestion: "Try a ring sling",
        target: "slings",
      },
      {
        situation: "Long walks, travel days, airports and stations",
        suggestion: "Try a soft structured carrier",
        target: "buckles",
      },
      {
        situation: "A fit shaped exactly to you, and you enjoy learning a skill",
        suggestion: "Try a woven wrap",
        target: "woven",
      },
      {
        situation: "Soft, spread-out shoulder straps, but a quick clip at the waist",
        suggestion: "Try a half buckle",
        target: "mehdais",
      },
      {
        situation: "No buckles anywhere, but less cloth to handle than a wrap",
        suggestion: "Try a meh dai",
        target: "mehdais",
      },
      {
        situation: "Parents and grandparents of different builds all taking turns",
        suggestion: "Try a meh dai or half buckle",
        target: "mehdais",
      },
      {
        situation: "A sitting baby or toddler on your back, and nothing around your waist",
        suggestion: "Try an onbuhimo",
        target: "onbuhimos",
      },
      {
        situation: "Something small enough to live in the nappy bag",
        suggestion: "Try a ring sling or onbuhimo",
        target: "slings",
      },
    ] as { situation: string; suggestion: string; target: CarrierId }[],
    noteLabel: "One check before you book:",
    note: "every listing shows the maker's age, weight and developmental limits for that exact model. Go by those, not by the style name.",
  },

  types: {
    eyebrow: "What's in the library",
    title: "Six styles, from all cloth to all clips",
    intro:
      "Listed from the softest and most hands-on to the most structured. These are honest generalisations; individual models differ, which is the whole reason to try one on first.",
    goodForLabel: "Lovely for",
    readyForLabel: "Be ready for",
    cards: [
      {
        id: "stretchy",
        name: "Stretchy wraps",
        description:
          "One long piece of soft, springy knit. You tie it on first, then tuck your baby in and spread the layers over them.",
        goodFor: "The early months. Gentle and forgiving to learn, and you can pop baby in and out without retying.",
        readyFor: "Several layers mean more warmth, and most start to sag once baby gets heavier. Front carries only.",
        linkLabel: "See stretchy wraps to rent",
        href: "/?type=stretchy-wraps#browse-all",
        image: { src: "", alt: "Stretchy wrap baby carrier" },
      },
      {
        id: "woven",
        name: "Woven wraps",
        description:
          "A long woven cloth with no stretch, tightened section by section around the two of you and knotted.",
        goodFor: "A fit moulded to your body, from newborn to toddler, on the front, hip or back.",
        readyFor: "The steepest learning curve here. Length matters, and the tails trail on the ground outdoors.",
        linkLabel: "See woven wraps to rent",
        href: "/?type=woven-wraps#browse-all",
        image: { src: "", alt: "Woven wrap baby carrier" },
      },
      {
        id: "slings",
        name: "Ring slings",
        description:
          "A shorter cloth that runs through a pair of rings and sits across one shoulder, forming a pouch you snug up strand by strand.",
        goodFor: "Short carries, hip carries, babies who want up and down all day, and travelling light.",
        readyFor: "All the weight on one side. Threading and tightening feel fiddly for the first few tries.",
        linkLabel: "See ring slings to rent",
        href: "/?type=ring-slings#browse-all",
        image: { src: "", alt: "Ring sling baby carrier" },
      },
      {
        id: "mehdais",
        name: "Meh dais & half buckles",
        description: "Both have a shaped fabric panel and long shoulder straps to tie. A meh dai ties at the waist too; a half buckle clips there instead.",
        goodFor: "Wrap-like comfort with less cloth to manage. The meh dai adjusts easily between adults; the half buckle gives you a quicker waist fastening.",
        readyFor: "Both need shoulder straps tied each time, and their long tails can dangle. A half buckle's belt fits some bodies better than others.",
        linkLabel: "See meh dais and half buckles to rent",
        href: "/?type=meh-dai#browse-all",
        image: { src: "", alt: "Meh dai or half buckle baby carrier with tie straps" },
      },
      {
        id: "buckles",
        name: "Soft structured carriers",
        description:
          "A shaped body panel with padded straps and a waist belt. You clip it on and pull the webbing snug.",
        goodFor: "Longer outings, heavier babies, and handing over to a partner or grandparent in seconds.",
        readyFor:
          "Belts and straps suit some bodies more than others, and many models need adjusting or an insert for a newborn.",
        linkLabel: "See soft structured carriers to rent",
        href: "/?type=buckle-carriers#browse-all",
        image: { src: "", alt: "Soft structured baby carrier" },
      },
      {
        id: "onbuhimos",
        name: "Onbuhimos",
        description: "A small panel with shoulder straps and no waist belt at all. Made mainly for high back carries.",
        goodFor:
          "Babies who sit on their own and toddlers. Nothing pressing on your tummy, quick on and off, folds up tiny.",
        readyFor:
          "Your shoulders take the whole load. Not for young babies: check the sitting and size requirements on the listing.",
        linkLabel: "See onbuhimos to rent",
        href: "/?type=onbuhimo#browse-all",
        image: { src: "", alt: "Onbuhimo baby carrier without a waistband" },
      },
    ] as {
      id: CarrierId;
      name: string;
      description: string;
      goodFor: string;
      readyFor: string;
      linkLabel: string;
      href: string;
      image: { src: string; alt: string };
    }[],
    helperCard: {
      enabled: true,
      title: "Two of these sound right?",
      text: "That's normal. Tell me your baby's age and what a usual day looks like, and we'll suggest which one to borrow first.",
      buttonLabel: "Ask us",
      href: "#help",
    },
  },

  compare: {
    title: "Side by side",
    columns: ["Style", "Putting it on", "Time to feel confident", "Where it shines", "Sharing between adults"],
    rows: [
      [
        "Stretchy wrap",
        "Tie it on, then slide baby in",
        "A few tries",
        "Newborn months at home",
        "Easy, one size ties to fit",
      ],
      [
        "Woven wrap",
        "Wind, tighten section by section, knot",
        "Several practice sessions",
        "Custom fit from newborn to toddler",
        "Easy, if the length suits both of you",
      ],
      [
        "Ring sling",
        "Over one shoulder, tighten through the rings",
        "A few tries",
        "Short, frequent carries; packs tiny",
        "Easy, adjusts widely",
      ],
      [
        "Meh dai & half buckle",
        "Knot or clip the waist, then tie the shoulders",
        "A few tries",
        "Wrap-like comfort with a tied or clipped waist",
        "Easy; a half buckle's belt may need resizing",
      ],
      [
        "Soft structured carriers",
        "Clip the waist and chest, pull straps snug",
        "Same day",
        "Long outings, travel, newborn to toddler (some models)",
        "Quick, though each person re-adjusts",
      ],
      [
        "Onbuhimo",
        "Load baby on your back, tighten the straps",
        "A few tries for back loading",
        "Sitting babies and toddlers; no waist pressure",
        "Quick, strap adjusters only",
      ],
    ],
    caption: "A rough guide for comparing styles. Your own experience may differ, and that's useful information too.",
  },

  fit: {
    eyebrow: "Fit before features",
    title: "A carrier has two people to fit",
    columns: [
      {
        title: "Your baby",
        intro:
          'Labels like "newborn" or "toddler size" mean different things from one maker to the next. The manual for the exact model is the authority.',
        points: [
          {
            label: "Tiny babies:",
            text: "look at the minimum weight, how the head and neck are supported, and whether an insert or cinched setting is required.",
          },
          {
            label: "The middle months:",
            text: "the panel should reach from knee to knee and come up to the back of the neck without swallowing the baby.",
          },
          {
            label: "Toddlers:",
            text: "choose for your child’s current fit, rather than extra growing room.",
          },
        ],
      },
      {
        title: "Your body",
        intro: "A carrier your friend swears by can feel all wrong on you. Neither of you is mistaken.",
        points: [
          {
            label: "Waist and hips:",
            text: "where does the belt land, how stiff is it, and is it comfortable after a caesarean if that applies to you?",
          },
          {
            label: "Shoulders and neck:",
            text: "notice strap width, padding, and whether fabric creeps toward your neck.",
          },
          {
            label: "Real life:",
            text: "can you reach every clip or tail yourself, without any help?",
          },
        ],
      },
    ],
    note: "Something pinching or sagging? It is often one small adjustment away from right.",
    noteLinkLabel: "Send us a photo for a fit check",
    noteHref: "#help",
    noteAfter: "before you give up on it.",
  },

  fabric: {
    eyebrow: "Fabric and weather",
    title: "Dress the carrier for the climate you live in",
    intro:
      "Two bodies pressed together run warm, and Indian summers and humidity can make it warmer. Count the carrier as a layer of clothing for both of you.",
    items: [
      { name: "Cotton", text: "The easy all-rounder. Breathes well, washes without fuss, and suits most of the year." },
      {
        name: "Linen",
        text: "Airy and strong in a thin cloth. Feels crisp when new and softens the more it is used.",
      },
      {
        name: "Stretchy knits fabric",
        text: "Soft and forgiving for newborns, but usually worn in several layers, so they run warmer.",
      },
    ],
    tip: "In the heat: dress baby one layer lighter, single-layer carries help, keep a thin muslin between skin and skin, and take breaks in the shade.",
  },

  safety: {
    eyebrow: "Every single carry",
    title: "The T.I.C.K.S. safety check",
    intro:
      "A five-point check used by babywearing educators around the world for upright, tummy-to-tummy carrying. Run through it each time, and follow the maker's manual for any other position.",
    checks: [
      {
        letter: "T",
        name: "Tight",
        text: "Baby is held firmly against you. If you lean forward, they don't swing away or sink.",
      },
      {
        letter: "I",
        name: "In view",
        text: "A glance down shows you their face. Nothing covers the nose or mouth: not cloth, not a dupatta, not you.",
      },
      {
        letter: "C",
        name: "Close enough to kiss",
        text: "Their head rides high on your chest, so tipping your chin down reaches it.",
      },
      {
        letter: "K",
        name: "Keep chin off chest",
        text: "Leave at least a finger's width under the chin so the airway stays open.",
      },
      {
        letter: "S",
        name: "Supported back",
        text: "The carrier holds their back in its natural gentle curve, with no slumping to one side.",
      },
    ],
    morePageLabel: "Read our full safety page",
    notes: [
      "Look over seams, rings and buckles before each use, and keep checking on your baby while you wear them. Skip the carrier around the stove, hot chai, two-wheelers, running and cycling.",
      "Speak to your paediatrician first if your baby is born premature or has a health condition. This guide is general information and does not replace their advice or the maker's manual.",
    ],
  },

  faq: {
    title: "Things parents ask us",
    items: [
      {
        q: "Will one carrier last from birth to toddlerhood?",
        a: "Sometimes. Woven wraps and a few highly adjustable soft structured carriers cover a long span. Stretchy wraps suit the early months, onbuhimos come later, and many others are built for one stage. Check the limits on the listing, and remember that renting lets you switch styles as your baby grows instead of owning three.",
      },
      {
        q: "How many carriers does a family need?",
        a: "One that you reach for without thinking. Some families later add a second for a different job, such as a sling for quick trips alongside a soft structured carrier for long days, but nobody needs a shelf full to get started.",
      },
      {
        q: "The carrier everyone recommends feels wrong on me. What now?",
        a: "First, message us. A strap moved a few centimetres changes a lot. If it still isn't for you, that's the library doing its job: send it back and try a different style.",
      },
      {
        q: "Are rental carriers cleaned between families?",
        a: "[DESCRIBE YOUR WASHING AND SAFETY INSPECTION PROCESS]",
      },
    ],
  },

  cta: {
    title: "Still torn? Borrow one and find out.",
    text: "Reading only gets you so far. Rent the style you're leaning towards, live with it, and we'll help you adjust it along the way. [ONE LINE ON HOW RENTING WORKS AND WHERE YOU DELIVER]",
    primaryLabel: "Browse the library",
    secondaryLabel: "Ask me on WhatsApp",
    image: { src: "", alt: "Carriers from the Nestled library" },
  },
} as const;
