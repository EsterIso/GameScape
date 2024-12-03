let WORDS = [// People & Relationships
    // People & Relationships
    "adult", "baby", "child", "daddy", "uncle", "woman", "women", "human", "friend", "guest", 
    "nurse", "queen", "owner", "chief", "judge", "staff", "group", "party", "crowd", "youth",
    "bride", "dozen", "elder", "enemy", "folks", "guard", "lover", "mummy", "peers", "pupil",
    "class", "buyer", "agent", "coach", "donor", "angel", "clerk", "giant", "kings", "pilot",
    
    // Body Parts & Health
    "teeth", "heart", "brain", "chest", "thumb", "nerve", "blood", "faces", "flesh", "heads",
    "lungs", "mouth", "tooth", "wrist", "ankle", "beard", "bones", "cheek", "fever", "liver",
    
    // Actions & States
    "about", "above", "adopt", "agree", "align", "allow", "apply", "avoid", "begin", "blame", 
    "break", "bring", "build", "carry", "catch", "cause", "check", "claim", "clean", "clear", 
    "climb", "close", "count", "cover", "crash", "dance", "delay", "drive", "exist", "fight",
    "float", "focus", "guard", "guess", "guide", "happy", "laugh", "learn", "marry", "occur",
    "offer", "order", "paint", "print", "prove", "raise", "reach", "react", "refer", "relax",
    "serve", "shake", "share", "shine", "shoot", "sleep", "smile", "solve", "speak", "spend",
    "split", "stand", "start", "teach", "thank", "think", "throw", "touch", "treat", "trust",
    "visit", "watch", "worry", "write", "adapt", "admit", "agree", "alert", "arise", "await",
    "boost", "break", "burst", "carve", "chase", "cheat", "choke", "claim", "click", "climb",
    "cling", "close", "count", "court", "crash", "crawl", "cross", "dance", "defer", "drink",
    
    // Descriptors & Qualities
    "alert", "alone", "angry", "basic", "black", "blank", "blind", "broad", "brown", "cheap",
    "clean", "clear", "crazy", "early", "empty", "equal", "exact", "extra", "false", "fresh",
    "funny", "grand", "great", "green", "happy", "heavy", "inner", "large", "legal", "light",
    "local", "loose", "lucky", "major", "mixed", "moral", "naked", "outer", "plain", "proud",
    "quick", "quiet", "rapid", "ready", "rough", "royal", "rural", "sharp", "short", "smart",
    "solid", "sorry", "sweet", "thick", "tight", "total", "urban", "valid", "vital", "whole",
    "wrong", "young", "aware", "awful", "basic", "brave", "brief", "broad", "cheap", "civil",
    "clean", "cruel", "daily", "eager", "exact", "faint", "false", "fancy", "fatal", "final",
    "fleet", "fresh", "fuzzy", "giant", "grand", "grave", "great", "gross", "happy", "harsh",
    
    // Objects & Things
    "apple", "award", "beach", "board", "brain", "chair", "chest", "clock", "cloud", "cream",
    "crown", "diary", "doors", "dress", "earth", "field", "floor", "frame", "fruit", "ghost",
    "glass", "grass", "heart", "honey", "horse", "hotel", "house", "image", "knife", "label",
    "light", "metal", "money", "mouse", "movie", "music", "ocean", "paper", "phone", "photo",
    "piece", "pilot", "plane", "plant", "plate", "power", "prize", "proof", "queen", "radio",
    "river", "route", "scale", "scene", "scope", "sheet", "shelf", "shell", "shirt", "shoes",
    "space", "staff", "stage", "stamp", "steel", "stick", "stone", "store", "sugar", "table",
    "teeth", "theme", "thumb", "tiger", "timer", "tooth", "tower", "track", "train", "truck",
    "video", "voice", "waste", "watch", "water", "wheel", "album", "arrow", "badge", "baker",
    "beach", "beast", "bench", "blade", "block", "board", "boots", "bread", "brick", "brush",
    
    // Food & Drink
    "bread", "candy", "cream", "drink", "feast", "fruit", "honey", "juice", "lunch", "pasta",
    "pizza", "salad", "sugar", "sweet", "cocoa", "curry", "dairy", "feast", "flour", "peach",
    
    // Places & Locations
    "beach", "earth", "field", "hotel", "house", "ocean", "river", "store", "tower", "world",
    "arena", "basin", "caves", "coast", "court", "depot", "villa", "apart", "beach", "cabin",
    
    // Abstract Concepts
    "faith", "fault", "focus", "force", "glory", "grade", "guard", "guide", "index", "input",
    "issue", "level", "limit", "logic", "magic", "match", "model", "month", "moral", "nerve",
    "noise", "order", "peace", "point", "power", "press", "price", "pride", "prime", "range",
    "sense", "skill", "sound", "speed", "sport", "state", "style", "title", "trade", "trend",
    "trial", "truth", "unity", "usage", "value", "waste", "world", "abuse", "anger", "birth",
    "blame", "chaos", "charm", "crime", "crisis", "doubt", "dream", "error", "faith", "fault",
    
    // Time-related
    "today", "month", "early", "never", "night", "still", "timer", "until", "while", "first",
    "final", "prior", "daily", "dated", "delay", "early", "hours", "night", "pause", "quick",
    
    // Numbers & Quantities
    "dozen", "equal", "extra", "first", "heavy", "large", "level", "light", "major", "mixed",
    "quick", "rough", "sharp", "short", "small", "solid", "thick", "third", "tight", "total",
    
    // Weather & Nature
    "cloud", "earth", "field", "grass", "ocean", "river", "storm", "water", "beach", "bloom",
    "cloud", "coast", "flood", "flora", "frost", "plant", "beach", "breed", "cloud", "earth",
    
    // Common Phrases & Function Words
    "about", "above", "after", "again", "along", "below", "since", "their", "there", "these",
    "those", "three", "under", "where", "which", "while", "whose", "would", "about", "after",
    "among", "below", "every", "never", "often", "quite", "since", "still", "their", "there"
];


    export function getRandomWord() {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    
    export { WORDS };