
import { PersonalityChoice, Theme, ArtStyle } from './types';

export const PERSONALITY_CHOICES: PersonalityChoice[] = [
  {
    id: 1,
    statement: "I like structure, clarity, and finishing what I start.",
    label: "Strategic Architect",
    description: "You thrive on precision and order. Your future self is a master of disciplined execution and high-fidelity results."
  },
  {
    id: 2,
    statement: "I trust intuition and big-picture thinking.",
    label: "Visionary Explorer",
    description: "You see patterns where others see noise. Your future self leads by intuition and expansive, uncharted thinking."
  },
  {
    id: 3,
    statement: "I make decisions based on logic and outcomes.",
    label: "Pragmatic Catalyst",
    description: "Efficiency is your compass. Your future self cuts through complexity to deliver objective, high-impact solutions."
  },
  {
    id: 4,
    statement: "I value harmony, meaning, and human impact.",
    label: "Empathetic Leader",
    description: "People are your focus. Your future self builds bridges, fostering resonance and deep, collective meaning."
  },
  {
    id: 5,
    statement: "I prefer planning before acting.",
    label: "Methodical Mind",
    description: "Preparation is your power. Your future self acts with absolute certainty because every move is pre-calculated."
  },
  {
    id: 6,
    statement: "I thrive by exploring and adapting as I go.",
    label: "Adaptive Innovator",
    description: "Agility is your strength. Your future self turns every unexpected challenge into a creative breakthrough."
  }
];

export const THEMES: Theme[] = [
  // REGULAR THEMES (Holographic/UI focused)
  { 
    id: 'holographic_architect', 
    label: 'Data Architect', 
    emoji: '📊', 
    description: 'Surrounded by floating blue holographic data boards and UI screens', 
    mood: 'Analytical, tech-focused, and organized', 
    expression: 'Intense focus while swiping through digital blueprints',
    category: 'regular'
  },
  { 
    id: 'cyber_strategist', 
    label: 'Cyber Strategist', 
    emoji: '💻', 
    description: 'A dark server room with glowing blue interface overlays', 
    mood: 'Methodical and digital', 
    expression: 'Calmly orchestrating complex holographic flows',
    category: 'regular'
  },
  { 
    id: 'digital_visionary', 
    label: 'Digital Visionary', 
    emoji: '👁️', 
    description: 'A white minimalist space with floating transparent glass boards', 
    mood: 'Clean, corporate, and futuristic', 
    expression: 'Looking through a transparent planning board',
    category: 'regular'
  },
  
  // MODERN THEMES (Diverse/Physical focused)
  { 
    id: 'visionary', 
    label: 'Cosmic Navigator', 
    emoji: '🚀', 
    description: 'Nebula-filled starship bridge without any screens', 
    mood: 'Epic, grand, and boundary-pushing', 
    expression: 'Determined gaze toward a distant dying sun',
    category: 'modern'
  },
  { 
    id: 'growth', 
    label: 'Verdant Alchemist', 
    emoji: '🌱', 
    description: 'Bioluminescent rainforest at night, touching raw glowing vines', 
    mood: 'Vibrant, healing, and overflowing with life', 
    expression: 'Hands glowing while reviving a mechanical forest',
    category: 'modern'
  },
  { 
    id: 'high', 
    label: 'Kinetic Dynamo', 
    emoji: '🔥', 
    description: 'Electric storm over a futuristic city, sparks flying from fingers', 
    mood: 'High-voltage, blurred motion, and raw power', 
    expression: 'Riding a lightning bolt through a copper canyon',
    category: 'modern'
  },
  { 
    id: 'balanced', 
    label: 'Void Monk', 
    emoji: '🧘', 
    description: 'A stone platform at the center of a black hole', 
    mood: 'Perfectly still, gravity-defying, and zen', 
    expression: 'Levitating while holding a perfect sphere of heavy mercury',
    category: 'modern'
  },
  { 
    id: 'warrior', 
    label: 'Iron Vanguard', 
    emoji: '⚔️', 
    description: 'Volcanic forge during an eruption, holding a real obsidian sword', 
    mood: 'Gritty, unyielding, and battle-hardened', 
    expression: 'Shielding a small flower from a rain of molten metal',
    category: 'modern'
  },
  { 
    id: 'mastermind', 
    label: 'Quantum Puppeteer', 
    emoji: '♟️', 
    description: 'A room made of shifting granite cubes and golden threads', 
    mood: 'Complex, multi-dimensional, and dominant', 
    expression: 'Fingers pulling golden strings that move distant mountains',
    category: 'modern'
  }
];

export const ART_STYLES: ArtStyle[] = [
  { id: 'pencil', label: 'Hyper-Realistic Graphite', description: 'Intricate charcoal and lead textures' },
  { id: 'watercolor', label: 'Surreal Ink Wash', description: 'Dramatic splashes and bleeding edges' },
  { id: 'vintage', label: '80s Dark Synth', description: 'Grainy, atmospheric film noir with neon accents' },
  { id: 'canvas', label: 'Impressionist Oil', description: 'Thick impasto brushwork and visible canvas texture' },
  { id: 'landscape', label: 'Environmental Fusion', description: 'The subject merges with the landscape elements' },
  { id: 'retro', label: 'Cyber-Punk Glitch', description: 'Digital distortion and high-contrast glitch art' },
  { id: 'abstract', label: 'Geometric Fractal', description: 'The subject is composed of intricate geometric shapes' },
  { id: 'oil', label: 'Renaissance Masterpiece', description: 'Chiaroscuro lighting and classical oil finishes' }
];

export const AFFIRMATIONS: Record<string, string> = {
  holographic_architect: "Structure is the skeleton of success.",
  cyber_strategist: "I command the flow of the future.",
  digital_visionary: "I see through the complexity.",
  visionary: "The stars are my milestones.",
  growth: "I grow where I am planted.",
  high: "I am the spark that starts the storm.",
  balanced: "I am the silence in the scream.",
  warrior: "I am the iron that does not bend.",
  mastermind: "The future is a game I've already won."
};

export const MOTIVATIONS: Record<string, string[]> = {
  holographic_architect: [
    "I organize chaos into crystalline perfection.",
    "Every line of data is a step toward my goal."
  ],
  cyber_strategist: [
    "I am the ghost in the machine of my own ambition.",
    "Digital precision is my ultimate weapon."
  ],
  digital_visionary: [
    "Transparency allows me to see the path ahead.",
    "I map the unseen to build the incredible."
  ],
  visionary: [
    "I lead through the dark to find the new dawn.",
    "My vision is the map of tomorrow."
  ],
  growth: [
    "I turn every wound into a source of power.",
    "I am the forest that will one day cover the mountain."
  ],
  high: [
    "I run at the speed of my own ambition.",
    "The world moves fast, but I move first."
  ],
  balanced: [
    "I move mountains without lifting a finger.",
    "My peace is a fortress no chaos can breach."
  ],
  warrior: [
    "I am the shield that protects the innocent.",
    "My courage is the flame that lights the forge."
  ],
  mastermind: [
    "I see the pattern before the first piece is moved.",
    "Everything is connected, and I hold the threads."
  ]
};
