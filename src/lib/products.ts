export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
};


export const normalizeTag = (tag: string) => 
  tag.toLowerCase().trim().replace(/[^a-z0-9]/g, "");


export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Placidol (Pure CBD)",
    description: "A pure CBD formulation designed to offer neuroprotective, anti-epileptic, and calming benefits without any psychoactive effects. Ideal for pediatric ASD, epilepsy, and anxiety.",
    category: "Tincture",
    image: "/1.png",
    tags: [
      "Pediatric ASD",
      "Epilepsy",
      "ADHD",
      "Cancer care",
      "Alzheimer’s",
      "Cognitive support",
      "Behavioural stability",
      "Anti-inflammatory",
      "Anti-aging",
    ],
  },
  {
    id: "2",
    name: "Vijaya Amrit (High CBD)",
    description: "A high-CBD, low-THC formulation designed to deliver strong anti-anxiety, anti-depressant, and mood-stabilizing benefits without sedation.",
    category: "Tincture",
    image: "/2.png",
    tags: [
      "Adult Epilepsy",
      "Anxiety",
      "Depression",
      "OCD",
      "ADHD",
      "Mood balancing",
      "Stress regulation",
      "Neuroprotective",
    ],
  },
  {
    id: "3",
    name: "Calm Drops",
    description: "Combines a balanced 2:1 CBD–THC formula with soothing bergamot to ease daily stress, anxiety, and fatigue.",
    category: "Tincture",
    image: "/3.png",
    tags: [
      "Daily stress",
      "Anxiety",
      "Fatigue",
      "Low energy",
      "Focus & productivity",
      "Mood stabilize",
    ],
  },
  {
    id: "4",
    name: "Elevate: Full Spectrum CBD:THC (1:1)",
    description: "A balanced 1:1 CBD–THC formula that effectively reduces mild to moderate pain, muscle stiffness, and inflammation.",
    category: "Tincture",
    image: "/4.png",
    tags: [
      "Mild–moderate pain",
      "Inflammation",
      "Body stiffness",
      "Arthritis",
      "Appetite boost",
      "Muscle stiffness",
    ],
  },
  {
    id: "5",
    name: "Brain Easer",
    description: "A synergistic herbal–cannabinoid formula with Valerian and Melatonin to promote deep, natural sleep and reset circadian rhythm.",
    category: "Tincture",
    image: "/5.png",
    tags: [
      "Insomnia",
      "Sleep disturbances",
      "Midnight awakenings",
      "Stress-induced insomnia",
      "Improved circadian rhythm",
    ],
  },
  {
    id: "6",
    name: "Vijaya Ambrosia (High THC 1:4)",
    description: "A THC-dominant formulation crafted for powerful pain relief, improved appetite, and deep, uninterrupted sleep.",
    category: "Tincture",
    image: "/6.png",
    tags: [
      "Chronic pain",
      "Cancer pain",
      "Autoimmune pain",
      "Severe insomnia",
      "Inflammation",
      "Nausea",
      "Vomiting",
      "Multiple sclerosis",
      "Motor neuron disease",
    ],
  },
  {
    id: "7",
    name: "Uplift THC Drops",
    description: "A THC-dominant full spectrum formula that uplifts mood, eases cravings, anxiety & pain relief and smoothens withdrawal symptoms.",
    category: "Tincture",
    image: "/7.png",
    tags: [
      "De-addiction",
      "De-alcoholism",
      "Anxiety relief",
      "Craving reduction",
      "Emotional burnout",
      "Unwind",
      "Relaxation",
      "Chronic pain",
    ],
  },

  // --- EXTRACTS ---
  {
    id: "8",
    name: "Uplift Extract (THC dominant)",
    description: "Offers a calming, relaxing high that helps unwind, improves sleep, and provides relief from chronic pain and withdrawal.",
    category: "Extract",
    image: "/8.png",
    tags: [
      "De-addiction",
      "Alcohol withdrawal",
      "Craving control",
      "Anxiety",
      "Emotional stability",
      "Calming high",
      "Unwind",
      "Relaxation",
      "Better Sleep",
      "Chronic pain",
    ],
  },
  {
    id: "9",
    name: "Cannaronil",
    description: "A highly potent full-spectrum Vijaya formulation offering powerful pain relief, deep sedation, and strong antiemetic support.",
    category: "Extract",
    image: "/9.png",
    tags: [
      "Cancer pain",
      "Severe inflammation",
      "Appetite improvement",
      "Nausea control",
      "Chronic pain",
      "Fibromyalgia",
    ],
  },
  {
    id: "10",
    name: "CBD Nano CannaRonil (Nebulization)",
    description: "Engineered for nebulization to cross the Blood–Brain Barrier for targeted therapeutic action on lungs and respiratory issues.",
    category: "Extract",
    image: "/9.png",
    tags: [
      "Respiratory issues",
      "Lung cleansing",
      "Smoker’s lung support",
      "Post-infection recovery",
      "Airway inflammation reduction",
      "Cough & wheezing relief",
    ],
  },

  // --- CAPSULES ---
  {
    id: "11",
    name: "Full Spectrum Capsules",
    description: "THC-rich medicine consisting of anti-inflammatory properties for pain and sleep.",
    category: "Capsules",
    image: "/10.png",
    tags: [
      "Chronic pain",
      "Inflammation",
      "Arthritis",
      "Sleep improvement",
    ],
  },

  // --- TABLETS ---
  {
    id: "12",
    name: "Trilokya Vijaya Vati",
    description: "Classic Ayurvedic formulation for pain relief and Vata balancing.",
    category: "Tablets",
    image: "/11.png",
    tags: [
      "Arthritis pain",
      "Muscle stiffness",
      "Back/neck pain",
      "Menstrual cramps",
      "Spasm relief",
      "Ayurvedic Vata balancing",
    ],
  },
];

export const SYMPTOM_TO_PRODUCT_ID: Record<string, string[]> = {};

PRODUCTS.forEach((product) => {
  product.tags.forEach((tag) => {
    const key = normalizeTag(tag);
    if (!SYMPTOM_TO_PRODUCT_ID[key]) {
      SYMPTOM_TO_PRODUCT_ID[key] = [];
    }
    // Prevent duplicates
    if (!SYMPTOM_TO_PRODUCT_ID[key].includes(product.id)) {
      SYMPTOM_TO_PRODUCT_ID[key].push(product.id);
    }
  });
});