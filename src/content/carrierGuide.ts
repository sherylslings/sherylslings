export type CarrierId = "stretchy" | "woven" | "slings" | "mehdais" | "buckles" | "onbuhimos";

export const carrierGuide = {
  navigation: {
    label: "Carrier Finder",
    href: "/carrier-finder",
  },

  seo: {
    title: "How to choose a baby carrier | Nestled",
    description:
      "Stretchy wrap, woven wrap, ring sling, meh dai or half buckle, soft structured carrier or onbuhimo? A simple guide to finding your fit, and renting it before you buy.",
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
    eyebrow: "The Nestled carrier finder",
    title: "Which carrier is right for your family?",
    intro:
      "Think about your baby's stage, the kind of days you have, and what feels the most comfortable for you. Find a carrier that works for you, rent it from the Nestled Carrier Library before you buy one from the brand or from the library itself.",
    byline: "",
    image: {
      src: "https://res.cloudinary.com/dan644ohr/image/upload/v1790250211/a49cc329-ca5a-406e-bcf6-df077b7b4d79_cht4wg.jpg",
      alt: "A parent wearing a baby in a carrier from the Nestled library",
    },
  },

  quickMatch: {
    title: "What does your week look like?",
    intro: "Pick the line that sounds most like your week as a parent. It points to the style worth renting first.",
    items: [
      { situation: "Newborn weeks, long cuddles at home", suggestion: "Try a stretchy wrap", target: "stretchy" },
      {
        situation: "Quick ups and downs, mall visits, a curious baby wanting to see the world",
        suggestion: "Try a ring sling",
        target: "slings",
      },
      {
        situation: "Long walks, travel days, airports and sightseeing",
        suggestion: "Try a soft structured carrier",
        target: "buckles",
      },
      {
        situation: "A fit shaped exactly for you, if you enjoy learning a skill",
        suggestion: "Try a woven wrap",
        target: "woven",
      },
      {
        situation: "Soft, spread-out shoulder straps, with a buckled waistband",
        suggestion: "Try a half buckle",
        target: "mehdais",
      },
      {
        situation: "No buckles anywhere, but less cloth to handle than a wrap",
        suggestion: "Try a meh dai",
        target: "mehdais",
      },
      {
        situation: "Sharing between parents and caregivers of different body shapes",
        suggestion: "Try a soft structured carrier",
        target: "buckles",
      },
      {
        situation: "A sitting baby or toddler on your back, and nothing around your waist",
        suggestion: "Try an onbuhimo",
        target: "onbuhimos",
      },
      {
        situation: "Something small enough to live in your diaper bag",
        suggestion: "Try a ring sling or onbuhimo",
        target: "slings",
      },
    ] as { situation: string; suggestion: string; target: CarrierId }[],
    noteLabel: "A note before you book:",
    note: "every listing shows the manufacturer's age, weight and developmental limits for that exact model. Make sure you go through them before renting",
  },

  types: {
    eyebrow: "What's in the library",
    title: "Six styles of baby carriers",
    intro:
      "The carriers listed here range between the softest, most hands-on to the most structured. These are honest generalisations. Individual models may differ, and renting a carrier to try it on  helps you decide as per your lifestyle needs.",
    goodForLabel: "Lovely for",
    readyForLabel: "Be ready for",
    cards: [
      {
        id: "stretchy",
        name: "Stretchy wraps",
        description:
          "One long piece of soft, stretchable knitted fabric, either cotton, lycra, spandex or a mix of all. You tie it on first, then tuck your baby in and spread the layers over them.",
        goodFor:
          "The newborn months. Gentle and forgiving to learn. You can pop baby in and out without retying each time.",
        readyFor:
          "Several layers mean more warmth, and most stretchy wraps start to sag once baby gets heavier. Front carries only.",
        linkLabel: "See stretchy wraps to rent",
        href: "/?type=stretchy-wraps#browse-all",
        image: {
          src: "https://res.cloudinary.com/dan644ohr/image/upload/v1774120428/image_6_wrvvzd.png",
          alt: "Stretchy wrap baby carrier",
        },
      },
      {
        id: "woven",
        name: "Woven wraps",
        description:
          "A long woven cloth with no stretch, tightened section by section around baby and you, tied in various kinds of knot-finishes.",
        goodFor:
          "A versatile carrier fit moulded to your body: from newborn to toddler ages, on your front, hip or back.",
        readyFor:
          "Woven wraps have the steepest learning curve. Wrap length matters, and the fabric may trail on the ground.",
        linkLabel: "See woven wraps to rent",
        href: "/?type=woven-wraps#browse-all",
        image: {
          src: "https://almitratattva.com/cdn/shop/files/Falak_woven_Nature_Baby_Wrap_Carrier_Front_Carry.png",
          alt: "Woven wrap baby carrier",
        },
      },
      {
        id: "slings",
        name: "Ring slings",
        description:
          "A shorter cloth that runs through a pair of rings and sits across one shoulder, forming a pouch that you tighten strand by strand.",
        goodFor: "Short carries and hip carries, for travelling light with curious babies and toddlers.",
        readyFor: "All the weight on one side. Threading and tightening feel overwhelming for the first few tries.",
        linkLabel: "See ring slings to rent",
        href: "/?type=ring-slings#browse-all",
        image: {
          src: "https://res.cloudinary.com/dan644ohr/image/upload/v1781449580/IMG_9115_xcukv7.jpg",
          alt: "Ring sling baby carrier",
        },
      },
      {
        id: "mehdais",
        name: "Meh dais & half buckles",
        description:
          "Both have a shaped fabric panel and long shoulder straps to tie. A meh dai ties at the waist; a half buckle clips at the waist.",
        goodFor:
          "Wrap-like comfort with less cloth to manage. The meh dai adjusts easily between adults; the half buckle gives you a quicker waist fastening.",
        readyFor:
          "Both need shoulder straps tied each time, and their long tails can dangle. A half buckle's waistband fits some bodies better than others.",
        linkLabel: "See meh dais and half buckles to rent",
        href: "/?type=meh-dai#browse-all",
        image: {
          src: "https://res.cloudinary.com/dan644ohr/image/upload/v1781078907/Gemini_Generated_Image_u87gk3u87gk3u87g_igjnvv.png",
          alt: "Meh dai or half buckle baby carrier with tie straps",
        },
      },
      {
        id: "buckles",
        name: "Soft structured carriers",
        description:
          "A shaped body panel with padded straps and a waistband. Pull the straps, fasten the buckles for a snug fit.",
        goodFor: "Longer outings, quick fastening, sharing between caregivers",
        readyFor:
          "Waistbands and straps suit some bodies more than others. Many models may need appropriate sizing down for a newborn.",
        linkLabel: "See soft structured carriers to rent",
        href: "/?type=buckle-carriers#browse-all",
        image: {
          src: "https://res.cloudinary.com/dan644ohr/image/upload/v1788517575/IMG_0566_o9g4cw.jpg",
          alt: "Soft structured baby carrier",
        },
      },
      {
        id: "onbuhimos",
        name: "Onbuhimos",
        description: "A small panel with shoulder straps and no waistband at all. Made mainly for high back carries.",
        goodFor:
          "Babies and toddlers who can sit on their own. Nothing pressing on your belly, quick on and off, folds up small.",
        readyFor:
          "Your shoulders take the entire load. Not for young babies: check the developmental and sizing requirements on the listing.",
        linkLabel: "See onbuhimos to rent",
        href: "/?type=onbuhimo#browse-all",
        image: {
          src: "https://res.cloudinary.com/dan644ohr/image/upload/v1774120635/vvkupbywvvy1l8ph1z1l_2_t0afjz.png",
          alt: "Onbuhimo baby carrier without a waistband",
        },
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
      title: "Do many of these carrier styles sound right to you?",
      text: "Connect with Sheryl (a Certified Babywearing Educator and Consultant) about your baby's age, your requirements, what your perfect babywearing experience sounds like, and she will suggest which one to rent first.",
      buttonLabel: "Ask Sheryl on WhatsApp",
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
        "Easy, one size fits all",
      ],
      [
        "Woven wrap",
        "Wrap, tighten section by section, knot",
        "Several practice sessions",
        "Custom fit from newborn to toddler",
        "Easy, if the length suits both of you",
      ],
      [
        "Ring sling",
        "One shoulder carry, tighten through the rings",
        "A few tries",
        "Short, frequent carries; packs small",
        "Easy, adjusts widely",
      ],
      [
        "Meh dai & half buckle",
        "Knot or buckle at the waist, then tie shoulder straps",
        "A few tries",
        "Wrap-like comfort with a tied or buckled waist",
        "Easy; a half buckle's waistband may need resizing",
      ],
      [
        "Soft structured carriers",
        "Buckle the waist and chest strap, pull straps tight",
        "A few tries",
        "Long outings, travel, newborn to toddler (some models)",
        "Quick, but each person re-adjusts",
      ],
      [
        "Onbuhimo",
        "Carry baby on your back, tighten the straps",
        "A few tries for back-carrying",
        "Sitting babies and toddlers; no waist pressure",
        "Quick, strap adjusters only",
      ],
    ],
    caption: "This is a rough guide for comparing styles. Your own experience may differ.",
  },

  fit: {
    eyebrow: "Carrier fit before its features",
    title: "A carrier has two people to fit:",
    columns: [
      {
        title: "Your baby",
        intro:
          'Terms like "newborn" or "toddler" may vary between one brand to another. What a brand advertises for its carrier, may not translate well into practicality.',
        points: [
          {
            label: "Newborns:",
            text: "Look at the minimum weight limits, how the head and neck are supported, and whether the carrier allows cinching it down using velcros or drawstrings. Baby's thighs should be fully supported frm one kneepit to the other, at the base of the carrier. Legs should not dangle.",
          },
          {
            label: "Infants:",
            text: "Arms can stay out but the panel should come up to the nape of the neck. M-position of legs to be maintained during infancy too. World-facing position allowed for 15-20 minutes at a stretch once sitting milestone has been achieved.",
          },
          {
            label: "Toddlers:",
            text: "Yes,they need upsies too! Choose a carrier that provides a generous spread of fabric at its base for good thigh support, and a large body panel for supporting their back.",
          },
        ],
      },
      {
        title: "Your body",
        intro:
          "A carrier that your friend swears by can feel all wrong on you. Neither of you is wrong, because every carrier fit is very individual.",
        points: [
          {
            label: "Waist and hips:",
            text: "Where does the waistband lie on your torso, how stiff is it, and if it is comfortable for you after a C-section?",
          },
          {
            label: "Shoulders and neck:",
            text: "Notice if the strap padding is comfortable for you, whether the strap width is wide enough, and whether fabric creeps towards your neck.",
          },
          {
            label: "Real life:",
            text: "Can you reach every buckle or tail yourself, without any help? Most carriers can be worn on your own. If you need an extra hand putting it on, it may not end up being practical in the long run.",
          },
        ],
      },
    ],
    note: "Does the carrier hurt your back or sag downwards? It is often one or two small adjustments away from the right fit.",
    noteLinkLabel: "Send Sheryl some fit check photos",
    noteHref: "#help",
    noteAfter: "before you give up on it.",
  },

  fabric: {
    eyebrow: "Fabric and weather",
    title: "Choose the carrier for the climate you live in",
    intro:
      "Two bodies pressed together can run warm, and Indian summers and humidity can make it warmer. Count the carrier as a layer of clothing for both of you.",
    items: [
      { name: "Cotton", text: "The easy all-rounder. Breathes well, washes without fuss, suits most of the year." },
      {
        name: "Linen",
        text: "Airy and strong in a thin cloth. Feels crisp when new and softens the more it is used.",
      },
      {
        name: "Stretchy fabric",
        text: "Soft and forgiving for newborns, but usually worn in several layers, tends to run warm.",
      },
    ],
    tip: "In the heat: dress baby one layer lighter. Single-layer carries help! Keep a thin muslin cloth between yourself and baby, hydrate well and take breaks when needed.",
  },

  safety: {
    eyebrow: "For every single carry",
    title: "The T.I.C.K.S. safety check",
    intro:
      "A five-point check used by babywearing educators around the world for upright, tummy-to-tummy carrying. Make a mental note to run through it each time, and follow the brand's instructions for any other position.",
    checks: [
      {
        letter: "T",
        name: "Tight",
        text: "Baby is held firmly against you. If you lean forward, they don't swing away or sink.",
      },
      {
        letter: "I",
        name: "In view",
        text: "A glance down shows you their face. Nothing covers the nose or mouth: not cloth, not a burp cloth, not your chest.",
      },
      {
        letter: "C",
        name: "Close enough to kiss",
        text: "Their head rests high on your chest, so you can easily kiss the top of their head.",
      },
      {
        letter: "K",
        name: "Keep chin off chest",
        text: "Leave at least a finger's width under the chin so their airways (nose and mouth) stay open.",
      },
      {
        letter: "S",
        name: "Supported back",
        text: "The carrier holds their back in its natural gentle curve, with no slumping to one side.",
      },
    ],
    morePageLabel: "Read the full safety page",
    notes: [
      "Look over seams, rings and buckles before each use, and keep checking on your baby while you wear them. Avoid carrier use around the stove, hot chai, two-wheelers, while running and cycling.",
      "Speak to your paediatrician first if your baby is born premature or has a health condition. This guide is for general information and does not replace their advice.",
    ],
  },

  faq: {
    title: "Things parents often ask",
    items: [
      {
        q: "Will one carrier last from birth to toddlerhood?",
        a: "Sometimes. Woven wraps and a few highly adjustable soft structured carriers cover a long span. Stretchy wraps suit the early newborn months, ring slings work better once babies have better neck control, and some buckle carriers are made for just one/two stages. Check the limits on the listing, and remember that renting lets you switch styles as your baby grows instead of owning three different carriers.",
      },
      {
        q: "How many carriers do we need?",
        a: "Go for a carrier that you like the look of. More often than not, it might end up being the carrier that you reach for without thinking. Some parents later add a second for a different need, such as a ring sling for quick trips alongside a soft structured carrier for longer days.",
      },
      {
        q: "The carrier everyone recommends feels wrong on me. What now?",
        a: "Reach out to Sheryl. She will guide you on how you can optimise your fit. A strap adjusted a few centimetres can bring about a world of difference in your fit. If you still feel that it's not working for you, try a different carrier.",
      },
      {
        q: "What if I want to buy the carrier after renting it?",
        a: "For every rental, you pay a refundable deposit, rental fees and shipping charges. If you wish to return the carrier after renting it, your deposit will be refunded. If you decide to keep the carrier, deposit is retained and your rental fee is refunded. Shipping charges are non-refundable.",
      },
      {
        q: "How to use the carrier?",
        a: "With every rental, you get a free consult with Sheryl over a WhatsApp video call. Reach out for a quick fit check!",
      },
    ],
  },

  cta: {
    title: "Still torn? Rent one and find out.",
    text: "Reading this Carrier Finder can only get you so far. Try the style you're leaning towards, learn to use it, and reach out for help to adjust it along the way. Rent weekly, biweekly or monthly. Shipping across India.",
    primaryLabel: "Browse the Library",
    secondaryLabel: "Ask Sheryl on WhatsApp",
    image: { src: "", alt: "Carriers from the Nestled library" },
  },
} as const;
