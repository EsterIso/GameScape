let WORDS = [// People & Relationships
    "adult", "baby", "child", "daddy", "uncle", "woman", "women", "human", "guest", 
    "nurse", "queen", "owner", "chief", "judge", "staff", "group", "party", "crowd", "youth",
    
    // Actions & States
    "about", "above", "adopt", "agree", "align", "allow", "apply", "avoid", "begin", "blame", 
    "break", "bring", "build", "carry", "catch", "cause", "check", "claim", "clean", "clear", 
    "climb", "close", "count", "cover", "crash", "dance", "delay", "drive", "exist", "fight",
    "float", "focus", "guard", "guess", "guide", "happy", "laugh", "learn", "marry", "occur",
    "offer", "order", "paint", "print", "prove", "raise", "reach", "react", "refer", "relax",
    "serve", "shake", "share", "shine", "shoot", "sleep", "smile", "solve", "speak", "spend",
    "split", "stand", "start", "teach", "thank", "think", "throw", "touch", "treat", "trust",
    "visit", "watch", "worry", "write",
    
    // Descriptors
    "alert", "alone", "angry", "basic", "black", "blank", "blind", "broad", "brown", "cheap",
    "clean", "clear", "crazy", "early", "empty", "equal", "exact", "extra", "false", "fresh",
    "funny", "grand", "great", "green", "happy", "heavy", "inner", "large", "legal", "light",
    "local", "loose", "lucky", "major", "mixed", "moral", "naked", "outer", "plain", "proud",
    "quick", "quiet", "rapid", "ready", "rough", "royal", "rural", "sharp", "short", "smart",
    "solid", "sorry", "sweet", "thick", "tight", "total", "urban", "valid", "vital", "whole",
    "wrong", "young",
    
    // Objects & Things
    "apple", "award", "beach", "board", "brain", "chair", "chest", "clock", "cloud", "cream",
    "crown", "diary", "doors", "dress", "earth", "field", "floor", "frame", "fruit", "ghost",
    "glass", "grass", "heart", "honey", "horse", "hotel", "house", "image", "knife", "label",
    "light", "metal", "money", "mouse", "movie", "music", "ocean", "paper", "phone", "photo",
    "piece", "pilot", "plane", "plant", "plate", "power", "prize", "proof", "queen", "radio",
    "river", "route", "scale", "scene", "scope", "sheet", "shelf", "shell", "shirt", "shoes",
    "space", "staff", "stage", "stamp", "steel", "stick", "stone", "store", "sugar", "table",
    "teeth", "theme", "thumb", "tiger", "timer", "tooth", "tower", "track", "train", "truck",
    "video", "voice", "waste", "watch", "water", "wheel",
    
    // Abstract Concepts
    "faith", "fault", "focus", "force", "glory", "grade", "guard", "guide", "index", "input",
    "issue", "level", "limit", "logic", "magic", "match", "model", "month", "moral", "nerve",
    "noise", "order", "peace", "point", "power", "press", "price", "pride", "prime", "range",
    "sense", "skill", "sound", "speed", "sport", "state", "style", "title", "trade", "trend",
    "trial", "truth", "unity", "usage", "value", "waste", "world",
    
    // Time-related
    "today", "month", "early", "never", "night", "still", "timer", "until", "while", "first",
    "final", "prior",
    
    // Common Phrases & Function Words
    "about", "above", "after", "again", "along", "below", "since", "their", "there", "these",
    "those", "three", "under", "where", "which", "while", "whose", "would"];


    export function getRandomWord() {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    
    export { WORDS };