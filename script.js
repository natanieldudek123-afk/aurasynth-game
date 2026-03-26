/* ═══════════════════════════════════════════════════════════
   AURA SYNTHESIZER v3.0 — script.js
   Chaos Engine · Batch Roller · Cosmic Anomalies · Frenzy Mode
   Transcendence · Constellation Tree · Global Leaderboard
   Impossible Rarities · SQL-backed Backend API
   ═══════════════════════════════════════════════════════════ */
"use strict";

const API_URL = "https://campunity.pl/aura/api/leaderboard.php";

/* ══════════════════════════════════════════
   BASE AURAS (27 original + 5 impossible)
══════════════════════════════════════════ */
const BASE_AURAS = [
  { id:"iron",          name:"Iron",           chance:1/3,              baseValue:4,         color:"#94a3b8" },
  { id:"spark",         name:"Spark",          chance:1/2,              baseValue:2,         color:"#facc15" },
  { id:"plasma",        name:"Plasma",         chance:1/6,              baseValue:3,         color:"#f97316" },
  { id:"shadow",        name:"Shadow",         chance:1/4,              baseValue:5,         color:"#818cf8" },
  { id:"frost",         name:"Frost",          chance:1/8,              baseValue:10,        color:"#67e8f9" },
  { id:"flame",         name:"Flame",          chance:1/16,             baseValue:20,        color:"#fb923c" },
  { id:"storm",         name:"Storm",          chance:1/40,             baseValue:50,        color:"#a3e635" },
  { id:"crystal",       name:"Crystal",        chance:1/20,             baseValue:30,        color:"#a5f3fc" },
  { id:"venom",         name:"Venom",          chance:1/100,            baseValue:130,       color:"#4ade80" },
  { id:"magma",         name:"Magma",          chance:1/60,             baseValue:90,        color:"#dc2626" },
  { id:"light",         name:"Light",          chance:1/300,            baseValue:400,       color:"#fde68a" },
  { id:"thunder",       name:"Thunder",        chance:1/200,            baseValue:600,       color:"#fbbf24" },
  { id:"void",          name:"Void",           chance:1/1000,           baseValue:1500,      color:"#7c3aed" },
  { id:"spectral",      name:"Spectral",       chance:1/700,            baseValue:2500,      color:"#c4b5fd" },
  { id:"rift",          name:"Rift",           chance:1/2500,           baseValue:12000,     color:"#6366f1" },
  { id:"nebula",        name:"Nebula",         chance:1/5000,           baseValue:8000,      color:"#e879f9" },
  { id:"nullpoint",     name:"Null Point",     chance:1/3000,           baseValue:18000,     color:"#334155" },
  { id:"corona",        name:"Corona",         chance:1/10000,          baseValue:60000,     color:"#fcd34d" },
  { id:"singularity",   name:"Singularity",    chance:1/25000,          baseValue:40000,     color:"#38bdf8" },
  { id:"phantom",       name:"Phantom",        chance:1/50000,          baseValue:250000,    color:"#94a3b8" },
  { id:"solaris",       name:"Solaris",        chance:1/80000,          baseValue:400000,    color:"#fef3c7" },
  { id:"abyssdepth",    name:"Abyss Depth",    chance:1/150000,         baseValue:900000,    color:"#1e3a8a" },
  { id:"eternity",      name:"Eternity",       chance:1/500000,         baseValue:1000000,   color:"#f9a8d4" },
  { id:"supernova",     name:"Supernova",      chance:1/500000,         baseValue:5000000,   color:"#ff6b6b" },
  { id:"astralcore",    name:"Astral Core",    chance:1/5000000,        baseValue:50000000,  color:"#67e8f9" },
  { id:"eventhorizon",  name:"Event Horizon",  chance:1/50000000,       baseValue:500000000, color:"#1e1e2e" },
  { id:"omnipotence",   name:"Omnipotence",    chance:1/100000000,      baseValue:1e9,       color:"#fff" },
  { id:"genesis",       name:"Genesis",        chance:1/1000000000,     baseValue:5e9,       color:"#fde68a" },
  { id:"theabsolute",   name:"The Absolute",   chance:1/50000000000,    baseValue:5e11,      color:"#fff" },
  /* IMPOSSIBLE RARITIES — unlocked by Transcendence */
  { id:"multiversalechoe",name:"Multiversal Echo", chance:1/100000000000,  baseValue:5e12,  color:"#ff6b6b",  requiresTranscend:1 },
  { id:"thearchitect",  name:"The Architect",  chance:1/10000000000000, baseValue:5e13,      color:"#ffd700",  requiresTranscend:1 },
  { id:"truenothingness",name:"True Nothingness",chance:1/1e15,         baseValue:1e15,      color:"#00ff88",  requiresTranscend:2 },
  { id:"cosmicwill",    name:"Cosmic Will",    chance:1/1e18,           baseValue:1e18,      color:"#ff00ff",  requiresTranscend:3 },
  { id:"theorigin",     name:"The Origin",     chance:1/1e21,           baseValue:1e21,      color:"#ffffff",  requiresTranscend:5 },
];

/* ══════════════════════════════════════════
   MUTATIONS
══════════════════════════════════════════ */
const MUTATIONS = [
  { id:"none",         name:"",              chance:0,        valMult:1,       label:"" },
  { id:"glitched",     name:"Glitched",      chance:0.08,     valMult:1.5,     label:"⌛ Glitched" },
  { id:"radiant",      name:"Radiant",       chance:0.04,     valMult:3,       label:"✦ Radiant" },
  { id:"ethereal",     name:"Ethereal",      chance:0.02,     valMult:5,       label:"✧ Ethereal" },
  { id:"corrupted",    name:"Corrupted",     chance:0.025,    valMult:4,       label:"☣ Corrupted" },
  { id:"cursed",       name:"Cursed",        chance:0.015,    valMult:12,      label:"⚠ Cursed" },
  { id:"frozen",       name:"Frozen",        chance:0.01,     valMult:7,       label:"❄ Frozen" },
  { id:"abyssal",      name:"Abyssal",       chance:0.012,    valMult:8,       label:"▼ Abyssal" },
  { id:"volcanic",     name:"Volcanic",      chance:0.007,    valMult:18,      label:"🌋 Volcanic" },
  { id:"ancient",      name:"Ancient",       chance:0.006,    valMult:15,      label:"⎉ Ancient" },
  { id:"shattered",    name:"Shattered",     chance:0.004,    valMult:25,      label:"💠 Shattered" },
  { id:"spectral_m",   name:"Spectral",      chance:0.003,    valMult:30,      label:"◌ Spectral" },
  { id:"exalted",      name:"Exalted",       chance:0.002,    valMult:60,      label:"★ Exalted" },
  { id:"nullified",    name:"Nullified",     chance:0.0015,   valMult:80,      label:"∅ Nullified" },
  { id:"divine_m",     name:"Divine",        chance:0.001,    valMult:100,     label:"✦ Divine" },
  { id:"paradox",      name:"Paradox",       chance:0.0005,   valMult:400,     label:"⟳ Paradox" },
  { id:"omni_m",       name:"Omni",          chance:0.0001,   valMult:1000,    label:"∞ Omni" },
  { id:"omnipotent",   name:"Omnipotent",    chance:0.000001, valMult:10000,   label:"∞∞ Omnipotent" },
];

/* ══════════════════════════════════════════
   RARITY TIERS
══════════════════════════════════════════ */
const RARITY_TIERS = [
  { name:"Common",       threshold:1/2,             cssClass:"r-common",      flashClass:"",                tierIdx:0  },
  { name:"Uncommon",     threshold:1/10,            cssClass:"r-uncommon",    flashClass:"",                tierIdx:1  },
  { name:"Rare",         threshold:1/100,           cssClass:"r-rare",        flashClass:"",                tierIdx:2  },
  { name:"Epic",         threshold:1/1000,          cssClass:"r-epic",        flashClass:"flash-epic",      tierIdx:3  },
  { name:"Legendary",    threshold:1/10000,         cssClass:"r-legendary",   flashClass:"flash-legendary", tierIdx:4  },
  { name:"Mythic",       threshold:1/100000,        cssClass:"r-mythic",      flashClass:"flash-mythic",    tierIdx:5  },
  { name:"Divine",       threshold:1/1000000,       cssClass:"r-divine",      flashClass:"flash-divine",    tierIdx:6  },
  { name:"Cosmic",       threshold:1/10000000,      cssClass:"r-cosmic",      flashClass:"flash-cosmic",    tierIdx:7  },
  { name:"Celestial",    threshold:1/100000000,     cssClass:"r-celestial",   flashClass:"flash-celestial", tierIdx:8  },
  { name:"Transcendent", threshold:1/5000000000,    cssClass:"r-transcendent",flashClass:"flash-transcendent",tierIdx:9 },
  { name:"Supernal",     threshold:1/25000000000,   cssClass:"r-supernal",    flashClass:"flash-supernal",  tierIdx:10 },
  { name:"Primordial",   threshold:1/1e12,          cssClass:"r-primordial",  flashClass:"flash-primordial",tierIdx:11 },
  { name:"Impossible I", threshold:1/1e14,          cssClass:"r-impossible1", flashClass:"flash-impossible1",tierIdx:12 },
  { name:"Impossible II",threshold:1/1e16,          cssClass:"r-impossible2", flashClass:"flash-impossible2",tierIdx:13 },
  { name:"Impossible III",threshold:1/1e18,         cssClass:"r-impossible3", flashClass:"flash-impossible3",tierIdx:14 },
  { name:"Impossible IV",threshold:1/1e20,          cssClass:"r-impossible4", flashClass:"flash-impossible4",tierIdx:15 },
  { name:"Impossible V", threshold:0,               cssClass:"r-impossible5", flashClass:"flash-impossible5",tierIdx:16 },
];

/* ══════════════════════════════════════════
   CRAFTED AURAS
══════════════════════════════════════════ */
const CRAFTED_AURAS = [
  { id:"prism",       name:"Prism",          baseValue:200000,    color:"#a5f3fc", rarityClass:"r-cosmic",       rarityName:"Cosmic",      desc:"3× Rare auras",
    condition:(a)=>a.length===3&&a.every(x=>getBaseRarityTier(x).name==="Rare") },
  { id:"eclipse",     name:"Eclipse",        baseValue:500000,    color:"#fbbf24", rarityClass:"r-legendary",    rarityName:"Legendary",   desc:"Void + Light + any",
    condition:(a)=>a.length>=3&&a.some(x=>x.baseId==="void")&&a.some(x=>x.baseId==="light") },
  { id:"aurora",      name:"Aurora",         baseValue:2000000,   color:"#86efac", rarityClass:"r-divine",       rarityName:"Divine",      desc:"4+ auras, total score ≥5000",
    condition:(a)=>a.length>=4&&totalRarityScore(a)>=5000 },
  { id:"nexus",       name:"Nexus",          baseValue:10000000,  color:"#f9a8d4", rarityClass:"r-cosmic",       rarityName:"Cosmic",      desc:"5 auras, 3+ mutated",
    condition:(a)=>a.length===5&&a.filter(x=>x.mutationIds&&x.mutationIds.some(m=>m!=="none")).length>=3 },
  { id:"oblivion",    name:"Oblivion",       baseValue:50000000,  color:"#c4b5fd", rarityClass:"r-celestial",    rarityName:"Celestial",   desc:"2× Singularity/Eternity/Supernova",
    condition:(a)=>a.length>=3&&a.filter(x=>["singularity","eternity","supernova","astralcore"].includes(x.baseId)).length>=2 },
  { id:"godstrand",   name:"God Strand",     baseValue:500000000, color:"#fff",    rarityClass:"r-transcendent", rarityName:"Transcendent",desc:"5 auras including Omnipotence",
    condition:(a)=>a.length===5&&a.some(x=>x.baseId==="omnipotence") },
  { id:"nullcore",    name:"Null Core",      baseValue:80000000,  color:"#334155", rarityClass:"r-cosmic",       rarityName:"Cosmic",      desc:"2× Null Point or Void",
    condition:(a)=>a.length>=3&&a.filter(x=>["nullpoint","void"].includes(x.baseId)).length>=2 },
  { id:"solarflare",  name:"Solar Flare",    baseValue:300000000, color:"#fef3c7", rarityClass:"r-celestial",    rarityName:"Celestial",   desc:"Solaris + Corona + any rare+",
    condition:(a)=>a.length>=3&&a.some(x=>x.baseId==="solaris")&&a.some(x=>x.baseId==="corona") },
  { id:"abyssalrift", name:"Abyssal Rift",   baseValue:2e9,       color:"#1e3a8a", rarityClass:"r-supernal",     rarityName:"Supernal",    desc:"Abyss Depth + Event Horizon",
    condition:(a)=>a.length>=3&&a.some(x=>x.baseId==="abyssdepth")&&a.some(x=>x.baseId==="eventhorizon") },
  { id:"alphaomega",  name:"Alpha Omega",    baseValue:1e12,      color:"#fff",    rarityClass:"r-primordial",   rarityName:"Primordial",  desc:"Genesis + The Absolute + 3 others",
    condition:(a)=>a.length===5&&a.some(x=>x.baseId==="genesis")&&a.some(x=>x.baseId==="theabsolute") },
];

/* ══════════════════════════════════════════
   RELICS
══════════════════════════════════════════ */
const RELICS_DEF = [
  { id:"greed_stone",      name:"Greed Stone",       icon:"💰", desc:"All Energy from selling is massively amplified.", effect:"Sell Energy ×5",         fragmentCost:15,
    apply:(G)=>{G.sellMult*=5;},  unapply:(G)=>{G.sellMult=Math.max(1,G.sellMult/5);} },
  { id:"mutation_catalyst",name:"Mutation Catalyst",  icon:"🧬", desc:"All mutation chances increased by 20%.",            effect:"Mutation Chance +20%",   fragmentCost:20,
    apply:(G)=>{G.mutationChanceBonus+=0.20;}, unapply:(G)=>{G.mutationChanceBonus=Math.max(0,G.mutationChanceBonus-0.20);} },
  { id:"forge_hammer",     name:"Forge Hammer",       icon:"🔨", desc:"Reduces minimum Auras for Synthesis by 1.",        effect:"Synth Min: 2 Auras",     fragmentCost:25,
    apply:(G)=>{G.synthMinAuras=Math.max(2,G.synthMinAuras-1);}, unapply:(G)=>{G.synthMinAuras=Math.min(3,G.synthMinAuras+1);} },
  { id:"shard_magnet",     name:"Shard Magnet",       icon:"◈",  desc:"Cosmic Shard rewards on Rebirth are doubled.",     effect:"Rebirth Shards ×2",      fragmentCost:30,
    apply:(G)=>{G.shardMult*=2;}, unapply:(G)=>{G.shardMult=Math.max(1,G.shardMult/2);} },
  { id:"fragment_lens",    name:"Fragment Lens",      icon:"🔮", desc:"Doubles Relic Fragment drop chance.",              effect:"Fragment Drop ×2",       fragmentCost:18,
    apply:(G)=>{G.fragDropMult*=2;}, unapply:(G)=>{G.fragDropMult=Math.max(1,G.fragDropMult/2);} },
  { id:"xp_nexus",         name:"XP Nexus",           icon:"⬆",  desc:"All XP gain is tripled.",                          effect:"XP Gain ×3",             fragmentCost:22,
    apply:(G)=>{G.xpMult*=3;}, unapply:(G)=>{G.xpMult=Math.max(1,G.xpMult/3);} },
  { id:"luck_engine",      name:"Luck Engine",        icon:"🎲", desc:"Global luck multiplier permanently ×2.",           effect:"Luck ×2",                fragmentCost:40,
    apply:(G)=>{G.luckMult*=2;}, unapply:(G)=>{G.luckMult=Math.max(1,G.luckMult/2);} },
];

/* ══════════════════════════════════════════
   COSMIC UPGRADES
══════════════════════════════════════════ */
const UPGRADES_DEF = [
  { id:"overclock",   name:"Core Overclock",      desc:"Reduces Auto-Roll cooldown.",        maxLevel:20, baseCost:3,  costMult:2.2,
    effect:(l)=>`Interval: ${Math.max(0.1,2.0-l*0.095).toFixed(2)}s`,
    apply:(l,G)=>{G.autoRollInterval=Math.max(100,2000-l*95);} },
  { id:"matrix",      name:"Probability Matrix",  desc:"Multiplies luck.",                   maxLevel:15, baseCost:5,  costMult:3,
    effect:(l)=>`Luck: ×${(1+l*0.5).toFixed(1)}`,
    apply:(l,G)=>{G.luckMult=1+l*0.5;} },
  { id:"storage",     name:"Expanded Storage",    desc:"Increases Inventory slot limit.",    maxLevel:10, baseCost:2,  costMult:2,
    effect:(l)=>`Slots: ${50+l*10}`,
    apply:(l,G)=>{G.maxInventory=50+l*10;} },
  { id:"xpboost",     name:"Resonance Amplifier", desc:"Multiplies XP gained from rolls.",   maxLevel:10, baseCost:4,  costMult:2.5,
    effect:(l)=>`XP: ×${(1+l*0.3).toFixed(1)}`,
    apply:(l,G)=>{G.xpMult=1+l*0.3;} },
  { id:"energyboost", name:"Energy Condenser",    desc:"Auras sell for more Energy.",        maxLevel:10, baseCost:3,  costMult:2.2,
    effect:(l)=>`Sell: ×${(1+l*0.5).toFixed(1)}`,
    apply:(l,G)=>{G.sellMult=1+l*0.5;} },
  { id:"batchroller", name:"Batch Roller",        desc:"Roll multiple Auras per Auto-Roll tick. 1=×1, 2=×5, 3=×10, 4=×50, 5=×100", maxLevel:5, baseCost:10, costMult:5,
    effect:(l)=>`Batch: ${[1,5,10,50,100][l]}×/tick`,
    apply:(l,G)=>{G.batchSize=[1,5,10,50,100][l]||1;} },
  { id:"autosynth",   name:"Auto-Synthesizer",    desc:"Auto-combines 3 identical Common auras after each tick.", maxLevel:1, baseCost:8, costMult:1,
    effect:(l)=>l>0?"Auto-Synth: Active":"Inactive",
    apply:(l,G)=>{G.autoSynthEnabled=l>0;} },
  { id:"expandedmind",name:"Expanded Mind",       desc:"Increases max equippable Relics.",   maxLevel:2,  baseCost:12, costMult:4,
    effect:(l)=>`Relic Slots: ${2+l}`,
    apply:(l,G)=>{G.maxEquippedRelics=2+l;} },
  { id:"shardmulti",  name:"Shard Multiplier",    desc:"Increases Cosmic Shards from Rebirth.", maxLevel:5, baseCost:6, costMult:3,
    effect:(l)=>`Rebirth Shards: ×${(1+l*0.5).toFixed(1)}`,
    apply:(l,G)=>{G.shardMult=1+l*0.5;} },
  { id:"fragboost",   name:"Fragment Attractor",  desc:"Increases Relic Fragment drop chance.", maxLevel:5, baseCost:5, costMult:2.5,
    effect:(l)=>`Frag Drop: ${10+l*5}%`,
    apply:(l,G)=>{G.baseFragDropChance=0.10+l*0.05;} },
];

/* ══════════════════════════════════════════
   CONSTELLATION (TRANSCENDENCE SHOP)
══════════════════════════════════════════ */
const CONSTELLATION_DEF = [
  { id:"c_luck",       name:"Star of Fortune",    icon:"⭐", desc:"Permanently multiplies all luck by ×3. Stacks exponentially per level.",
    maxLevel:99, baseCost:1, costMult:2.5,
    effect:(l)=>`Luck ×${Math.pow(3,l).toFixed(0)}`,
    apply:(l,G)=>{G.constLuckMult=Math.pow(3,l);} },
  { id:"c_energy",     name:"Energy Singularity", icon:"⚡", desc:"All Energy gain is exponentially multiplied.",
    maxLevel:99, baseCost:2, costMult:2.8,
    effect:(l)=>`Energy ×${Math.pow(5,l).toFixed(0)}`,
    apply:(l,G)=>{G.constEnergyMult=Math.pow(5,l);} },
  { id:"c_xp",         name:"Wisdom Nebula",      icon:"📚", desc:"XP gain multiplied exponentially.",
    maxLevel:99, baseCost:1, costMult:2,
    effect:(l)=>`XP ×${Math.pow(2,l).toFixed(0)}`,
    apply:(l,G)=>{G.constXpMult=Math.pow(2,l);} },
  { id:"c_shards",     name:"Shard Cascade",      icon:"◈",  desc:"Cosmic Shards from Rebirth multiplied exponentially.",
    maxLevel:50, baseCost:3, costMult:3,
    effect:(l)=>`Rebirth Shards ×${Math.pow(10,l).toFixed(0)}`,
    apply:(l,G)=>{G.constShardMult=Math.pow(10,l);} },
  { id:"c_batch",      name:"Chaos Engine",       icon:"⊕",  desc:"Further multiplies Batch Roll count.",
    maxLevel:10, baseCost:5, costMult:4,
    effect:(l)=>`Batch ×${Math.pow(2,l).toFixed(0)} (stacks with Batch Roller)`,
    apply:(l,G)=>{G.constBatchMult=Math.pow(2,l);} },
  { id:"c_impossible", name:"Void Sight",         icon:"👁",  desc:"Unlocks Impossible rarity Auras to be rollable. Level determines max tier.",
    maxLevel:5,  baseCost:10, costMult:10,
    effect:(l)=>`Unlocks Impossible I–${["none","I","II","III","IV","V"][l]||"V"}`,
    apply:(l,G)=>{G.transcendCount=Math.max(G.transcendCount||0,0); G.impossibleUnlockLevel=l;} },
  { id:"c_storage",    name:"Infinite Vault",     icon:"🗄",  desc:"Massively expands Inventory capacity.",
    maxLevel:20, baseCost:4, costMult:2,
    effect:(l)=>`Inventory +${l*500} slots`,
    apply:(l,G)=>{G.constExtraStorage=l*500;} },
  { id:"c_spark",      name:"Spark Condenser",    icon:"✦",   desc:"Gain bonus Singularity Sparks on Transcendence.",
    maxLevel:20, baseCost:3, costMult:2.5,
    effect:(l)=>`+${l*5} bonus Sparks per Transcendence`,
    apply:(l,G)=>{G.constBonusSparks=l*5;} },
];

/* ══════════════════════════════════════════
   GAME STATE
══════════════════════════════════════════ */
const DEFAULT_STATE = () => ({
  level:1, xp:0, xpNext:100, totalRolls:0, energy:0, cosmicShards:0,
  inventory:[], maxInventory:50,
  autoRollInterval:2000, luckMult:1, xpMult:1, sellMult:1,
  mutationChanceBonus:0, synthMinAuras:3, shardMult:1, fragDropMult:1,
  baseFragDropChance:0.10, autoSynthEnabled:false, maxEquippedRelics:2,
  batchSize:1,
  relicFragments:0, unlockedRelics:[], equippedRelics:[],
  singularitySparks:0, transcendCount:0,
  constellationLevels:{},
  constLuckMult:1, constEnergyMult:1, constXpMult:1, constShardMult:1,
  constBatchMult:1, constExtraStorage:0, constBonusSparks:0,
  impossibleUnlockLevel:0,
  upgradeLevels:{ overclock:0,matrix:0,storage:0,xpboost:0,energyboost:0,
                  batchroller:0,autosynth:0,expandedmind:0,shardmulti:0,fragboost:0 },
  filter:{ enabled:false, threshold:0 },
  username:"",
  stats:{
    totalXPEarned:0, totalEnergySold:0, totalSynths:0, rebirths:0,
    highestValueRoll:0, highestAuraName:"—", highestAuraRarity:"—",
    rarestRoll:"—", autoSoldCount:0,
    commonCount:0, uncommonCount:0, rareCount:0, epicCount:0,
    legendaryCount:0, mythicCount:0, divineCount:0, cosmicCount:0,
    celestialCount:0, transcendentCount:0, supernalCount:0, primordialCount:0,
    impossible1Count:0, impossible2Count:0, impossible3Count:0, impossible4Count:0, impossible5Count:0,
    anomaliesClicked:0, frenzyModes:0,
  },
});

let G = DEFAULT_STATE();

/* Transient state */
let selectedInventoryItems = [];
let synthSlotItems = [null,null,null,null,null];
let autoRollTimer = null;
let isAutoRolling = false;
let pendingUIUpdate = false;
let invRenderScheduled = false;
const recentRollsCache = [];
const MAX_RECENT = 80;

/* Frenzy state */
let frenzyActive = false;
let frenzyType = "comet"; // "comet" | "void"
let frenzyTimer = null;
let frenzySecondsLeft = 0;
let frenzyCountdown = null;

/* Anomaly state */
let anomalyTimer = null;
let anomalyEl = null;

/* ══════════════════════════════════════════
   UTILITY
══════════════════════════════════════════ */
function rand() { return Math.random(); }

function fmt(n) {
  n = Number(n);
  if (!isFinite(n)) return "∞";
  if (n >= 1e21) return (n/1e21).toFixed(2)+"Sx";
  if (n >= 1e18) return (n/1e18).toFixed(2)+"Qt";
  if (n >= 1e15) return (n/1e15).toFixed(2)+"Qa";
  if (n >= 1e12) return (n/1e12).toFixed(2)+"T";
  if (n >= 1e9)  return (n/1e9).toFixed(2)+"B";
  if (n >= 1e6)  return (n/1e6).toFixed(2)+"M";
  if (n >= 1e3)  return (n/1e3).toFixed(1)+"K";
  return Math.floor(n).toString();
}

function getRarityTier(chance) {
  for (let i = RARITY_TIERS.length-1; i >= 0; i--) {
    if (chance <= RARITY_TIERS[i].threshold) return RARITY_TIERS[i];
  }
  return RARITY_TIERS[0];
}

function getBaseRarityTier(aura) {
  if (aura.isCrafted) {
    const ca = CRAFTED_AURAS.find(c=>c.id===aura.baseId);
    const tier = RARITY_TIERS.find(r=>r.cssClass===(ca?ca.rarityClass:"r-cosmic"));
    return tier||RARITY_TIERS[0];
  }
  const base = BASE_AURAS.find(b=>b.id===aura.baseId);
  if (!base) return RARITY_TIERS[0];
  return getRarityTier(base.chance);
}

function getEffectiveTier(aura) {
  if (aura.isCrafted) return getBaseRarityTier(aura);
  const baseTier = getBaseRarityTier(aura);
  const ids = aura.mutationIds||[];
  let boost = 0;
  ids.forEach(mid=>{
    const idx = MUTATIONS.findIndex(m=>m.id===mid);
    if (idx >= 7) boost += Math.floor(idx/3);
  });
  if (boost===0) return baseTier;
  return RARITY_TIERS[Math.min(RARITY_TIERS.length-1, baseTier.tierIdx+boost)];
}

function totalRarityScore(auras) {
  return auras.reduce((sum,a)=>{
    const base = BASE_AURAS.find(b=>b.id===a.baseId);
    return sum + (base ? (1/base.chance)*a.value : 0);
  },0);
}

function xpForLevel(lvl) { return Math.floor(100*Math.pow(1.18,lvl-1)); }
function shardReward(lvl) {
  const base = Math.floor((lvl*1.5+Math.pow(lvl,1.4))*G.shardMult*(G.constShardMult||1));
  return base;
}
function sparkReward(lvl) {
  return Math.max(1, Math.floor(lvl/1000)) + (G.constBonusSparks||0);
}
function upgradeShardCost(id, lvl) {
  const def = UPGRADES_DEF.find(u=>u.id===id);
  if (!def) return 9999;
  return Math.floor(def.baseCost*Math.pow(def.costMult,lvl));
}
function constellationSparkCost(id, lvl) {
  const def = CONSTELLATION_DEF.find(c=>c.id===id);
  if (!def) return 9999;
  return Math.floor(def.baseCost*Math.pow(def.costMult,lvl));
}

function getEffectiveBatchSize() {
  return Math.floor((G.batchSize||1) * (G.constBatchMult||1));
}

/* ══════════════════════════════════════════
   RNG — ROLL A SINGLE AURA
══════════════════════════════════════════ */
function rollAura() {
  const luck = G.luckMult * (G.constLuckMult||1) * (frenzyActive && frenzyType==="comet" ? 11 : 1);
  const mutBonus = G.mutationChanceBonus||0;
  const impossibleLevel = G.impossibleUnlockLevel||0;

  /* Build eligible base pool (filter impossible rarities by transcendence unlock) */
  const eligibleBases = BASE_AURAS.filter(b=>{
    if (!b.requiresTranscend) return true;
    return impossibleLevel >= b.requiresTranscend;
  });

  let pickedBase = eligibleBases[0];
  for (let i=eligibleBases.length-1; i>=0; i--) {
    const b = eligibleBases[i];
    const adj = Math.min(0.9999, b.chance*luck);
    if (rand() < adj) { pickedBase = b; break; }
  }

  /* If frenzy void type: guarantee at minimum a Mythic */
  if (frenzyActive && frenzyType==="void" && getRarityTier(pickedBase.chance).tierIdx < 5) {
    const mythicBases = eligibleBases.filter(b=>getRarityTier(b.chance).tierIdx >= 5);
    if (mythicBases.length > 0) pickedBase = mythicBases[Math.floor(rand()*mythicBases.length)];
  }

  /* Mutations */
  const pickedMuts = [];
  let m1 = MUTATIONS[0];
  const r1 = rand();
  let cum = 0;
  for (let i=1; i<MUTATIONS.length; i++) {
    const adj = Math.min(0.5, MUTATIONS[i].chance*luck + MUTATIONS[i].chance*mutBonus);
    cum += adj;
    if (r1 < cum) { m1 = MUTATIONS[i]; break; }
  }
  pickedMuts.push(m1);

  const dualChance = 0.005*(1+mutBonus)*(frenzyActive?3:1);
  if (rand() < dualChance && m1.id!=="none") {
    let m2 = MUTATIONS[0];
    let cum2 = 0;
    for (let i=1; i<MUTATIONS.length; i++) {
      if (MUTATIONS[i].id===m1.id) continue;
      const adj = Math.min(0.4, MUTATIONS[i].chance*luck);
      cum2 += adj;
      if (rand() < cum2) { m2 = MUTATIONS[i]; break; }
    }
    if (m2.id!=="none") pickedMuts.push(m2);
  }

  const totalMult = pickedMuts.reduce((p,m)=>p*m.valMult, 1);
  const finalValue = Math.floor(pickedBase.baseValue * totalMult * (G.constEnergyMult||1) * 0.01 + pickedBase.baseValue);

  const mutPrefix = pickedMuts.filter(m=>m.id!=="none").map(m=>m.name).join(" ");
  const name = mutPrefix ? `${mutPrefix} ${pickedBase.name}` : pickedBase.name;

  return {
    id: Date.now()+"_"+Math.random().toString(36).slice(2,8),
    baseId: pickedBase.id,
    mutationIds: pickedMuts.map(m=>m.id),
    name, value: finalValue, color: pickedBase.color,
    chance: pickedBase.chance, isCrafted: false, ts: Date.now(),
  };
}

/* ══════════════════════════════════════════
   PROCESS BATCH ROLL
══════════════════════════════════════════ */
function performRoll() {
  const batchCount = getEffectiveBatchSize();
  if (batchCount <= 1) {
    processSingleRoll(true);
    return;
  }
  /* Batch processing — do not block main thread */
  let bestAura = null;
  let bestTierIdx = -1;
  let totalEnergyAutoSold = 0;
  let autoSoldCount = 0;
  let addedToInv = 0;
  const rarityHitCounts = {};

  for (let i=0; i<batchCount; i++) {
    const aura = rollAura();
    G.totalRolls++;

    const xpGain = Math.max(1, Math.floor(Math.log2(aura.value+2)*5*G.xpMult*(G.constXpMult||1)));
    addXPSilent(xpGain);
    G.stats.totalXPEarned += xpGain;

    if (aura.value > G.stats.highestValueRoll) {
      G.stats.highestValueRoll = aura.value;
      G.stats.highestAuraName = aura.name;
      G.stats.highestAuraRarity = getEffectiveTier(aura).name;
    }

    const tier = getEffectiveTier(aura);
    const key = tier.name.toLowerCase().replace(/\s+/g,"")+"Count";
    const statKey = tier.name==="Impossible I"?"impossible1Count":
                    tier.name==="Impossible II"?"impossible2Count":
                    tier.name==="Impossible III"?"impossible3Count":
                    tier.name==="Impossible IV"?"impossible4Count":
                    tier.name==="Impossible V"?"impossible5Count":
                    (tier.name.toLowerCase()+"Count");
    if (G.stats[statKey]!==undefined) G.stats[statKey]++;

    if (!rarityHitCounts[tier.name]) rarityHitCounts[tier.name]={count:0,tier};
    rarityHitCounts[tier.name].count++;

    /* Track rarest */
    if (tier.tierIdx > (RARITY_TIERS.find(r=>r.name===G.stats.rarestRoll)||{tierIdx:-1}).tierIdx) {
      G.stats.rarestRoll = tier.name;
    }

    /* Fragment drop */
    const base = BASE_AURAS.find(b=>b.id===aura.baseId);
    if (base && base.chance <= 1/100000) {
      const dropChance = (G.baseFragDropChance||0.10)*(G.fragDropMult||1);
      if (rand() < dropChance) G.relicFragments++;
    }

    /* Loot filter */
    if (G.filter.enabled && G.filter.threshold>0 && tier.tierIdx < G.filter.threshold) {
      const earned = Math.floor(aura.value*G.sellMult*(G.constEnergyMult||1));
      totalEnergyAutoSold += earned;
      autoSoldCount++;
      addToRecentRolls(aura, tier, xpGain, true);
      continue;
    }

    /* Inventory */
    if (G.inventory.length < G.maxInventory+(G.constExtraStorage||0)) {
      G.inventory.push(aura);
      addedToInv++;
    } else {
      let lowestIdx=0, lowestVal=G.inventory[0]?.value||0;
      for (let j=1;j<G.inventory.length;j++) {
        if (G.inventory[j].value < lowestVal) { lowestVal=G.inventory[j].value; lowestIdx=j; }
      }
      if (aura.value > lowestVal) {
        const ev = G.inventory[lowestIdx];
        G.energy += Math.floor(ev.value*G.sellMult);
        G.stats.totalEnergySold += Math.floor(ev.value*G.sellMult);
        G.inventory[lowestIdx] = aura;
      } else {
        G.energy += Math.floor(aura.value*G.sellMult);
        G.stats.totalEnergySold += Math.floor(aura.value*G.sellMult);
      }
    }

    if (tier.tierIdx > bestTierIdx) { bestTierIdx=tier.tierIdx; bestAura=aura; }
    addToRecentRolls(aura, tier, xpGain, false);
  }

  /* Apply batched auto-sold energy */
  if (totalEnergyAutoSold > 0) {
    G.energy += totalEnergyAutoSold;
    G.stats.totalEnergySold += totalEnergyAutoSold;
    G.stats.autoSoldCount += autoSoldCount;
  }

  /* Update display with best result */
  if (bestAura) {
    const bestTier = getEffectiveTier(bestAura);
    updateCurrentAuraDisplay(bestAura, bestTier);
    triggerRarityEffects(bestTier, bestAura, batchCount);
  }

  /* Batch summary in UI */
  showBatchSummary(rarityHitCounts, batchCount, autoSoldCount);

  /* Floating texts for high-tier batch hits */
  spawnBatchFloatingTexts(rarityHitCounts);

  /* Auto synth */
  if (G.autoSynthEnabled) tryAutoSynth();

  updateXPBar();
  scheduleUIUpdate();
}

function processSingleRoll(doEffects) {
  const aura = rollAura();
  G.totalRolls++;
  const xpGain = Math.max(1, Math.floor(Math.log2(aura.value+2)*5*G.xpMult*(G.constXpMult||1)));
  addXP(xpGain);
  G.stats.totalXPEarned += xpGain;
  if (aura.value > G.stats.highestValueRoll) {
    G.stats.highestValueRoll = aura.value; G.stats.highestAuraName = aura.name; G.stats.highestAuraRarity = getEffectiveTier(aura).name;
  }
  const tier = getEffectiveTier(aura);
  const statKey = tier.name==="Impossible I"?"impossible1Count":tier.name==="Impossible II"?"impossible2Count":
    tier.name==="Impossible III"?"impossible3Count":tier.name==="Impossible IV"?"impossible4Count":
    tier.name==="Impossible V"?"impossible5Count":(tier.name.toLowerCase()+"Count");
  if (G.stats[statKey]!==undefined) G.stats[statKey]++;
  if (tier.tierIdx>(RARITY_TIERS.find(r=>r.name===G.stats.rarestRoll)||{tierIdx:-1}).tierIdx) G.stats.rarestRoll=tier.name;
  const base = BASE_AURAS.find(b=>b.id===aura.baseId);
  if (base && base.chance<=1/100000) {
    const dc=(G.baseFragDropChance||0.10)*(G.fragDropMult||1);
    if (rand()<dc) { G.relicFragments++; showToast(`◉ Relic Fragment! (${G.relicFragments})`, "t-frag"); }
  }
  if (G.filter.enabled&&G.filter.threshold>0&&tier.tierIdx<G.filter.threshold) {
    const earned=Math.floor(aura.value*G.sellMult);
    G.energy+=earned; G.stats.totalEnergySold+=earned; G.stats.autoSoldCount++;
    addToRecentRolls(aura,tier,xpGain,true);
    if (doEffects) triggerRarityEffects(tier,aura,1);
    scheduleUIUpdate(); return;
  }
  const maxInv = G.maxInventory+(G.constExtraStorage||0);
  if (G.inventory.length<maxInv) {
    G.inventory.push(aura);
  } else {
    let li=0,lv=G.inventory[0]?.value||0;
    for (let j=1;j<G.inventory.length;j++) { if (G.inventory[j].value<lv){lv=G.inventory[j].value;li=j;} }
    if (aura.value>lv) { const ev=G.inventory[li]; G.energy+=Math.floor(ev.value*G.sellMult); G.inventory[li]=aura; }
    else { G.energy+=Math.floor(aura.value*G.sellMult); }
  }
  if (G.autoSynthEnabled) tryAutoSynth();
  if (doEffects) {
    updateCurrentAuraDisplay(aura,tier);
    triggerRarityEffects(tier,aura,1);
    addToRecentRolls(aura,tier,xpGain,false);
  }
  scheduleUIUpdate();
}

/* ══════════════════════════════════════════
   BATCH SUMMARY & FLOATING TEXTS
══════════════════════════════════════════ */
function showBatchSummary(hitCounts, total, autoSold) {
  const el = document.getElementById("batchRollInfo");
  const sum = document.getElementById("batchRollSummary");
  if (!el||!sum) return;
  const highTier = Object.values(hitCounts).filter(h=>h.tier.tierIdx>=4);
  if (highTier.length > 0) {
    const lines = highTier.sort((a,b)=>b.tier.tierIdx-a.tier.tierIdx)
      .slice(0,4).map(h=>`${h.tier.name}×${h.count}`).join(" | ");
    sum.textContent = `Batch ×${total} | ${lines}${autoSold>0?` | AutoSold:${autoSold}`:""}`;
    el.classList.remove("hidden");
    setTimeout(()=>el.classList.add("hidden"), 4000);
  }
}

function spawnBatchFloatingTexts(hitCounts) {
  const layer = document.getElementById("floatingTextLayer");
  if (!layer) return;
  const high = Object.values(hitCounts).filter(h=>h.tier.tierIdx>=4);
  high.forEach((h,i) => {
    const el = document.createElement("div");
    el.className = "float-text";
    el.style.color = RARITY_TIERS[h.tier.tierIdx]?.cssClass ? getComputedStyle(document.documentElement).getPropertyValue("--c-"+h.tier.name.toLowerCase())||"#facc15" : "#facc15";
    const colorMap = {
      "Legendary":"#facc15","Mythic":"#fb923c","Divine":"#f472b6","Cosmic":"#e879f9",
      "Celestial":"#67e8f9","Transcendent":"#fff","Supernal":"#fde68a","Primordial":"#c4b5fd",
      "Impossible I":"#ff6b6b","Impossible II":"#ffd700","Impossible III":"#00ff88",
      "Impossible IV":"#ff00ff","Impossible V":"#fff"
    };
    el.style.color = colorMap[h.tier.name]||"#facc15";
    el.textContent = `★ ${h.tier.name} ×${h.count}`;
    el.style.left = (20+i*120)%window.innerWidth+"px";
    el.style.top = (Math.random()*60+30)+"%";
    el.style.animationDuration = (1.0+Math.random()*0.8)+"s";
    layer.appendChild(el);
    setTimeout(()=>el.remove(), 2000);
  });
}

/* ══════════════════════════════════════════
   XP & LEVELING
══════════════════════════════════════════ */
function addXPSilent(amount) {
  G.xp += amount;
  while (G.xp >= G.xpNext) {
    G.xp -= G.xpNext; G.level++; G.xpNext = xpForLevel(G.level);
    if (G.level >= 50) { document.getElementById("rebirthBtn").classList.remove("hidden"); document.getElementById("rebirthBtnUpgrades").classList.remove("hidden"); }
    if (G.level >= 10000 && G.cosmicShards >= 1000000) { document.getElementById("transcendBtn").classList.remove("hidden"); document.getElementById("transcendBtnPage").classList.remove("hidden"); }
  }
}
function addXP(amount) {
  G.xp += amount;
  let leveledUp = false;
  while (G.xp >= G.xpNext) {
    G.xp -= G.xpNext; G.level++; G.xpNext = xpForLevel(G.level);
    leveledUp = true;
    if (G.level >= 50) { document.getElementById("rebirthBtn").classList.remove("hidden"); document.getElementById("rebirthBtnUpgrades").classList.remove("hidden"); }
    if (G.level >= 10000 && G.cosmicShards >= 1000000) { document.getElementById("transcendBtn").classList.remove("hidden"); document.getElementById("transcendBtnPage").classList.remove("hidden"); }
  }
  if (leveledUp) { showToast(`⬆ LEVEL UP! Now Level ${G.level}`, "t-info"); triggerLevelUpEffect(); updateTopBar(); }
  updateXPBar();
}

/* ══════════════════════════════════════════
   EFFECTS
══════════════════════════════════════════ */
function triggerRarityEffects(tier, aura, batchCount) {
  if (tier.tierIdx < 3) return;
  if (tier.flashClass) {
    const fl = document.getElementById("screenFlash");
    fl.className = tier.flashClass;
    fl.style.opacity = "1";
    setTimeout(()=>{ fl.style.opacity="0"; setTimeout(()=>{fl.className="";},150); }, 350+(tier.tierIdx*20));
  }
  if (tier.tierIdx >= 4) {
    document.body.classList.remove("shaking","shaking-hard");
    void document.body.offsetWidth;
    document.body.classList.add(tier.tierIdx >= 10 ? "shaking-hard" : "shaking");
    setTimeout(()=>document.body.classList.remove("shaking","shaking-hard"),800);
  }
  if (tier.tierIdx >= 3) spawnSparks(aura.color, tier.tierIdx + (batchCount>10?3:0));
  if (tier.tierIdx >= 4) {
    const tName = `t-${tier.name.toLowerCase().replace(/\s+/g,"")}`;
    showToast(`★ ${tier.name.toUpperCase()} — ${aura.name} [${fmt(aura.value)}⚡]`, tName);
  }
  if (tier.tierIdx >= 12) {
    /* Impossible tier: mega effects */
    for (let i=0;i<3;i++) setTimeout(()=>{
      document.body.classList.remove("shaking-hard"); void document.body.offsetWidth;
      document.body.classList.add("shaking-hard");
    }, i*200);
  }
}
function triggerLevelUpEffect() {
  const el = document.createElement("div"); el.className = "levelup-flash"; document.body.appendChild(el); setTimeout(()=>el.remove(),800);
}
function spawnSparks(color, tierIdx) {
  const container = document.getElementById("auraParticles");
  if (!container) return;
  const num = Math.min(80, 6+tierIdx*5);
  for (let i=0;i<num;i++) {
    const s = document.createElement("div"); s.className = "spark";
    const angle = (360/num)*i+rand()*20;
    const dist = 40+rand()*100;
    s.style.cssText = `background:${color};box-shadow:0 0 6px ${color};left:50%;top:50%;--sx:${Math.cos(angle*Math.PI/180)*dist}px;--sy:${Math.sin(angle*Math.PI/180)*dist}px;animation-delay:${rand()*0.2}s;animation-duration:${0.5+rand()*0.5}s;`;
    container.appendChild(s);
    setTimeout(()=>s.remove(),1100);
  }
}

/* ══════════════════════════════════════════
   CURRENT AURA DISPLAY
══════════════════════════════════════════ */
function updateCurrentAuraDisplay(aura, tier) {
  const nameEl=document.getElementById("auraNameDisplay");
  const badgeEl=document.getElementById("auraRarityBadge");
  const mutEl=document.getElementById("auraMutationDisplay");
  const valEl=document.getElementById("auraValueDisplay");
  nameEl.className=""; badgeEl.className="";
  nameEl.classList.add(tier.cssClass); badgeEl.classList.add(tier.cssClass);
  const ids = aura.mutationIds||[];
  if (ids.includes("cursed")) nameEl.classList.add("mut-cursed");
  badgeEl.textContent = tier.name.toUpperCase();
  nameEl.textContent = aura.name;
  const mutLabels = ids.filter(m=>m!=="none").map(mid=>{ const m=MUTATIONS.find(x=>x.id===mid); return m?m.label:""; }).filter(Boolean);
  mutEl.textContent = mutLabels.join("  ")+(ids.filter(m=>m!=="none").length>1?"  ⚡DUAL⚡":"");
  valEl.textContent = aura.isCrafted ? `✦ Crafted — ${fmt(aura.value)}⚡` : `Value: ${fmt(aura.value)}⚡`;
}

/* ══════════════════════════════════════════
   RECENT ROLLS
══════════════════════════════════════════ */
function addToRecentRolls(aura, tier, xpGain, autoSold) {
  recentRollsCache.unshift({aura,tier,xpGain,autoSold});
  if (recentRollsCache.length>MAX_RECENT) recentRollsCache.pop();
}
function renderRecentRolls() {
  const list = document.getElementById("recentRollsList");
  if (!list) return;
  list.innerHTML="";
  recentRollsCache.slice(0,60).forEach(({aura,tier,xpGain,autoSold})=>{
    const el=document.createElement("div"); el.className="roll-entry";
    el.style.borderLeftColor=aura.color;
    el.innerHTML=`<span class="roll-entry-name" style="color:${aura.color}">${aura.name}${autoSold?' <small style="color:#ef4444">[SOLD]</small>':""}</span>`+
      `<span class="roll-entry-val">${tier.name} · ${fmt(aura.value)}⚡ · +${fmt(xpGain)}XP</span>`;
    list.appendChild(el);
  });
}

/* ══════════════════════════════════════════
   TOP BAR
══════════════════════════════════════════ */
function updateTopBar() {
  document.getElementById("playerLevel").textContent=G.level;
  document.getElementById("totalRolls").textContent=fmt(G.totalRolls);
  document.getElementById("cosmicShards").textContent=fmt(G.cosmicShards);
  document.getElementById("energyDisplay").textContent=fmt(G.energy);
  document.getElementById("relicFragments").textContent=fmt(G.relicFragments);
  document.getElementById("singularitySparks").textContent=fmt(G.singularitySparks);
  const batch=getEffectiveBatchSize();
  document.getElementById("batchSizeDisplay").textContent="×"+fmt(batch);
  document.getElementById("batchStatusText").textContent="×"+fmt(batch);
  const equipped=(G.equippedRelics||[]).length;
  updateXPBar();
}
function updateXPBar() {
  const pct=Math.min(100,(G.xp/G.xpNext)*100);
  document.getElementById("xpBarFill").style.width=pct+"%";
  document.getElementById("xpLabel").textContent=`${fmt(G.xp)} / ${fmt(G.xpNext)} XP`;
}

/* ══════════════════════════════════════════
   INVENTORY
══════════════════════════════════════════ */
function scheduleUIUpdate() {
  if (pendingUIUpdate) return;
  pendingUIUpdate=true;
  requestAnimationFrame(()=>{
    pendingUIUpdate=false;
    updateTopBar();
    updateInventoryUI();
    renderRecentRolls();
  });
}
function updateInventoryUI() {
  if (invRenderScheduled) return;
  invRenderScheduled=true;
  requestAnimationFrame(()=>{ invRenderScheduled=false; _renderInventory(); });
}
function _renderInventory() {
  const grid=document.getElementById("inventoryGrid");
  const countEl=document.getElementById("invCount");
  if (!grid) return;
  const maxInv=G.maxInventory+(G.constExtraStorage||0);
  countEl.textContent=`${G.inventory.length} / ${maxInv}`;
  grid.innerHTML="";
  if (G.inventory.length===0) { grid.innerHTML='<div class="empty-inv">No Auras collected yet</div>'; document.getElementById("sellSelectedBtn").disabled=true; document.getElementById("sendSelectedToForgeBtn").disabled=true; return; }
  G.inventory.forEach((aura,idx)=>{
    const tier=getEffectiveTier(aura);
    const el=document.createElement("div"); el.className="inv-item"; el.dataset.idx=idx;
    if (selectedInventoryItems.includes(idx)) el.classList.add("selected");
    el.style.borderColor=aura.color+"70";
    el.innerHTML=`<div class="inv-item-name" style="color:${aura.color}">${aura.name}${aura.isCrafted?'<br><span class="crafted-tag">✦</span>':""}</div>`+
      `<div class="inv-item-rarity">${tier.name}</div><div class="inv-item-val">${fmt(aura.value)}</div>`;
    el.addEventListener("click",()=>toggleInventorySelect(idx));
    el.addEventListener("mouseenter",(e)=>showTooltip(e,aura,tier));
    el.addEventListener("mouseleave",hideTooltip);
    grid.appendChild(el);
  });
  document.getElementById("sellSelectedBtn").disabled=selectedInventoryItems.length===0;
  document.getElementById("sendSelectedToForgeBtn").disabled=selectedInventoryItems.length===0;
}
function toggleInventorySelect(idx) {
  const pos=selectedInventoryItems.indexOf(idx);
  pos===-1?selectedInventoryItems.push(idx):selectedInventoryItems.splice(pos,1);
  _renderInventory();
}
function showTooltip(e,aura,tier) {
  const tt=document.getElementById("tooltip");
  const ids=aura.mutationIds||[];
  const mutLines=ids.filter(m=>m!=="none").map(mid=>{ const m=MUTATIONS.find(x=>x.id===mid); return m?`${m.label} ×${m.valMult}x`:""; }).filter(Boolean);
  tt.innerHTML=`<strong style="color:${aura.color}">${aura.name}</strong><br>Rarity: ${tier.name}`+
    (mutLines.length?`<br>Mutations: ${mutLines.join(", ")}`:"")+
    (aura.isCrafted?`<br><span style="color:#e879f9">✦ Crafted</span>`:"")+
    `<br>Value: ${fmt(aura.value)}⚡<br><small style="color:#6272a4">Click=select · Dbl=sell · R-click=Forge</small>`;
  tt.style.display="block"; positionTooltip(e);
}
function positionTooltip(e) {
  const tt=document.getElementById("tooltip");
  let x=e.clientX+14,y=e.clientY-20;
  if(x+250>window.innerWidth) x=e.clientX-260;
  if(y+120>window.innerHeight) y=e.clientY-120;
  tt.style.left=x+"px"; tt.style.top=y+"px";
}
function hideTooltip() { document.getElementById("tooltip").style.display="none"; }

function sellSelected() {
  if (selectedInventoryItems.length===0) return;
  let earned=0; const toRemove=[...selectedInventoryItems].sort((a,b)=>b-a);
  toRemove.forEach(idx=>{ const a=G.inventory[idx]; if(a){earned+=Math.floor(a.value*G.sellMult);G.inventory.splice(idx,1);} });
  selectedInventoryItems=[]; G.energy+=earned; G.stats.totalEnergySold+=earned;
  showToast(`Sold ${toRemove.length} auras for ${fmt(earned)}⚡`,"t-success"); updateTopBar(); updateInventoryUI();
}
function sellAllCommon() {
  let earned=0,count=0;
  G.inventory=G.inventory.filter(aura=>{ const t=getEffectiveTier(aura); if(t.tierIdx<=1){earned+=Math.floor(aura.value*G.sellMult);count++;return false;} return true; });
  selectedInventoryItems=selectedInventoryItems.filter(i=>i<G.inventory.length);
  G.energy+=earned; G.stats.totalEnergySold+=earned;
  showToast(`Sold ${count} Common/Uncommon for ${fmt(earned)}⚡`,"t-success"); updateTopBar(); updateInventoryUI();
}

/* ══════════════════════════════════════════
   AUTO-SYNTH
══════════════════════════════════════════ */
function tryAutoSynth() {
  const idCounts={};
  G.inventory.forEach((a,i)=>{ const t=getEffectiveTier(a); if(t.tierIdx<=1){if(!idCounts[a.baseId])idCounts[a.baseId]=[];idCounts[a.baseId].push(i);} });
  for (const baseId in idCounts) {
    const indices=idCounts[baseId];
    if (indices.length>=3) {
      const toMerge=indices.slice(0,3).sort((a,b)=>b-a);
      const base=BASE_AURAS.find(b=>b.id===baseId)||BASE_AURAS[0];
      const baseIdx=BASE_AURAS.indexOf(base);
      const nextBase=BASE_AURAS[Math.min(BASE_AURAS.length-1,baseIdx+1)];
      const result={ id:Date.now()+"_as_"+Math.random().toString(36).slice(2,6), baseId:nextBase.id, mutationIds:["none"], name:nextBase.name, value:Math.floor(nextBase.baseValue*1.2), color:nextBase.color, chance:nextBase.chance, isCrafted:false, ts:Date.now() };
      toMerge.forEach(i=>G.inventory.splice(i,1));
      if (G.inventory.length<G.maxInventory+(G.constExtraStorage||0)) G.inventory.push(result);
      G.stats.totalSynths++; break;
    }
  }
}

/* ══════════════════════════════════════════
   SYNTHESIZER
══════════════════════════════════════════ */
function updateSynthSlots() {
  document.querySelectorAll(".synth-slot").forEach((slot,i)=>{
    const aura=synthSlotItems[i];
    if (aura) {
      slot.classList.remove("empty"); slot.classList.add("filled"); slot.style.borderColor=aura.color;
      slot.innerHTML=`<div class="synth-slot-name" style="color:${aura.color}">${aura.name}</div>`;
    } else {
      slot.classList.add("empty"); slot.classList.remove("filled"); slot.style.borderColor=""; slot.innerHTML="<span>+</span>";
    }
  });
  const filled=synthSlotItems.filter(Boolean).length;
  const minNeeded=G.synthMinAuras||3;
  const synthBtn=document.getElementById("synthBtn");
  const synthInfo=document.getElementById("synthInfo");
  if (filled>=minNeeded) {
    synthBtn.disabled=false;
    const outcome=predictSynthOutcome(synthSlotItems.filter(Boolean));
    synthInfo.innerHTML=outcome?`<span style="color:#e879f9">Will create: ${outcome.name}</span>`:`<span style="color:var(--text-dim)">Will create: Enhanced Aura</span>`;
  } else {
    synthBtn.disabled=true; synthInfo.textContent=`Select ${minNeeded-filled} more Aura(s)`;
  }
  const ml=document.getElementById("synthMinLabel"); if(ml) ml.textContent=`Combine ${minNeeded}–5 Auras`;
}
function predictSynthOutcome(auras) { for(const ca of CRAFTED_AURAS){if(ca.condition(auras))return ca;} return null; }
function addToSynthSlot(aura) {
  if (synthSlotItems.some(s=>s&&s.id===aura.id)){showToast("Already in Synthesizer","t-info");return;}
  const empty=synthSlotItems.findIndex(s=>!s);
  if (empty===-1){showToast("Synthesizer full","t-info");return;}
  synthSlotItems[empty]={...aura}; updateSynthSlots();
}
function removeFromSynthSlot(i){synthSlotItems[i]=null;updateSynthSlots();}
function clearSynth(){synthSlotItems=[null,null,null,null,null];document.getElementById("synthResult").textContent="";updateSynthSlots();}
function performSynth() {
  const usedAuras=synthSlotItems.filter(Boolean);
  const minNeeded=G.synthMinAuras||3;
  if (usedAuras.length<minNeeded) return;
  let resultAura=null;
  for (const ca of CRAFTED_AURAS) {
    if (ca.condition(usedAuras)) {
      resultAura={ id:Date.now()+"_craft_"+Math.random().toString(36).slice(2,6), baseId:ca.id, mutationIds:["none"], name:ca.name, value:ca.baseValue, color:ca.color, chance:0, isCrafted:true, ts:Date.now() };
      break;
    }
  }
  if (!resultAura) {
    const best=usedAuras.reduce((b,a)=>a.value>b.value?a:b,usedAuras[0]);
    const bonus=1+(usedAuras.length-minNeeded)*0.5+rand()*0.5;
    const baseIdx=BASE_AURAS.findIndex(b=>b.id===best.baseId);
    const nextBase=BASE_AURAS[Math.min(BASE_AURAS.length-1,baseIdx+1)];
    const mutIdx=Math.min(MUTATIONS.length-1,Math.floor(rand()*3+usedAuras.length-2));
    const mut=MUTATIONS[mutIdx];
    const newVal=Math.floor(nextBase.baseValue*(mut.id!=="none"?mut.valMult:1)*bonus);
    const name=mut.id!=="none"?`${mut.name} ${nextBase.name}`:nextBase.name;
    resultAura={ id:Date.now()+"_craft_"+Math.random().toString(36).slice(2,6), baseId:nextBase.id, mutationIds:[mut.id], name, value:newVal, color:nextBase.color, chance:nextBase.chance, isCrafted:false, ts:Date.now() };
  }
  const usedIds=new Set(usedAuras.map(a=>a.id));
  G.inventory=G.inventory.filter(a=>!usedIds.has(a.id));
  selectedInventoryItems=[];
  if (G.inventory.length<G.maxInventory+(G.constExtraStorage||0)) G.inventory.push(resultAura);
  G.stats.totalSynths++;
  const tier=getEffectiveTier(resultAura);
  document.getElementById("synthResult").innerHTML=`<span style="color:${resultAura.color}">✦ Created: ${resultAura.name}</span><br><span style="color:var(--text-dim);font-size:10px">${tier.name} · ${fmt(resultAura.value)}⚡</span>`;
  clearSynth(); updateCurrentAuraDisplay(resultAura,tier); triggerRarityEffects(tier,resultAura,1);
  updateInventoryUI(); updateTopBar();
  addXP(Math.floor(Math.log2(resultAura.value+2)*15*G.xpMult));
}

/* ══════════════════════════════════════════
   UPGRADES
══════════════════════════════════════════ */
function renderUpgrades() {
  const list=document.getElementById("upgradesList"); if(!list)return; list.innerHTML="";
  UPGRADES_DEF.forEach(def=>{
    const lvl=G.upgradeLevels[def.id]||0;
    const cost=lvl<def.maxLevel?upgradeShardCost(def.id,lvl):0;
    const maxed=lvl>=def.maxLevel;
    const card=document.createElement("div"); card.className="upgrade-card";
    card.innerHTML=`<div class="upgrade-name">${def.name}</div><div class="upgrade-desc">${def.desc}</div>`+
      `<div class="upgrade-level">${def.effect(lvl)} · Lv ${lvl}/${def.maxLevel}</div>`+
      `<button class="upgrade-buy-btn" data-id="${def.id}" ${maxed||G.cosmicShards<cost?"disabled":""}>${maxed?"MAXED":`◈ ${fmt(cost)} Shards`}</button>`;
    list.appendChild(card);
  });
  const info=document.getElementById("rebirthInfo");
  if(info){const s=shardReward(G.level);info.innerHTML=`<div class="stat-row"><span class="stat-row-label">Shards on Rebirth</span><span class="stat-row-val" style="color:#e879f9">${fmt(s)}</span></div>`;}
  if(G.level>=50){document.getElementById("rebirthBtnUpgrades").classList.remove("hidden");}
}
function buyUpgrade(id) {
  const def=UPGRADES_DEF.find(u=>u.id===id); if(!def)return;
  const lvl=G.upgradeLevels[id]||0; if(lvl>=def.maxLevel)return;
  const cost=upgradeShardCost(id,lvl);
  if(G.cosmicShards<cost){showToast("Not enough Cosmic Shards","t-info");return;}
  G.cosmicShards-=cost; G.upgradeLevels[id]=lvl+1; def.apply(G.upgradeLevels[id],G);
  showToast(`${def.name} → Lv ${G.upgradeLevels[id]}!`,"t-success");
  renderUpgrades(); updateTopBar(); if(isAutoRolling)restartAutoRoll();
}
function applyAllUpgrades() {
  G.autoRollInterval=2000; G.luckMult=1; G.xpMult=1; G.sellMult=1;
  G.maxInventory=50; G.autoSynthEnabled=false; G.maxEquippedRelics=2;
  G.shardMult=1; G.baseFragDropChance=0.10; G.fragDropMult=1;
  G.synthMinAuras=3; G.mutationChanceBonus=0; G.batchSize=1;
  UPGRADES_DEF.forEach(def=>{ const lvl=G.upgradeLevels[def.id]||0; if(lvl>0)def.apply(lvl,G); });
  applyAllConstellations();
  reapplyRelicEffects();
}
function applyAllConstellations() {
  G.constLuckMult=1; G.constEnergyMult=1; G.constXpMult=1; G.constShardMult=1;
  G.constBatchMult=1; G.constExtraStorage=0; G.constBonusSparks=0;
  CONSTELLATION_DEF.forEach(def=>{ const lvl=G.constellationLevels[def.id]||0; if(lvl>0)def.apply(lvl,G); });
}

/* ══════════════════════════════════════════
   RELICS
══════════════════════════════════════════ */
function reapplyRelicEffects() {
  (G.equippedRelics||[]).forEach(rid=>{ const def=RELICS_DEF.find(r=>r.id===rid); if(def)def.apply(G); });
}
function renderRelics() {
  const list=document.getElementById("relicsList"); if(!list)return; list.innerHTML="";
  const maxSlots=G.maxEquippedRelics||2;
  document.getElementById("relicEquipCount").textContent=(G.equippedRelics||[]).length;
  document.getElementById("relicEquipMax").textContent=maxSlots;
  document.getElementById("relicEquipMax2").textContent=maxSlots;
  document.getElementById("fragCountRelics").textContent=fmt(G.relicFragments);
  RELICS_DEF.forEach(def=>{
    const unlocked=(G.unlockedRelics||[]).includes(def.id);
    const equipped=(G.equippedRelics||[]).includes(def.id);
    const canAfford=G.relicFragments>=def.fragmentCost;
    const card=document.createElement("div"); card.className="relic-card"+(equipped?" equipped":"");
    let btns="";
    if(!unlocked) btns=`<button class="relic-btn" data-rid="${def.id}" data-action="unlock" ${canAfford?"":"disabled"}>◉ UNLOCK — ${def.fragmentCost} Frags</button>`;
    else if(equipped) btns=`<button class="relic-btn unequip-btn" data-rid="${def.id}" data-action="unequip">UNEQUIP</button>`;
    else { const canEquip=(G.equippedRelics||[]).length<maxSlots; btns=`<button class="relic-btn equip-btn" data-rid="${def.id}" data-action="equip" ${canEquip?"":"disabled"}>EQUIP</button>`; }
    card.innerHTML=`<span class="relic-icon-big">${def.icon}</span><div class="relic-name">${def.name}</div><div class="relic-desc">${def.desc}</div><div class="relic-effect">${def.effect}</div><div class="relic-cost">${unlocked?"Unlocked":"Cost: "+def.fragmentCost+" Fragments"}</div>${btns}`;
    list.appendChild(card);
  });
}
function handleRelicAction(rid,action) {
  const def=RELICS_DEF.find(r=>r.id===rid); if(!def)return;
  if(action==="unlock"){
    if(G.relicFragments<def.fragmentCost){showToast("Not enough Fragments","t-info");return;}
    G.relicFragments-=def.fragmentCost; G.unlockedRelics=[...(G.unlockedRelics||[]),rid];
    showToast(`${def.icon} ${def.name} unlocked!`,"t-frag");
  } else if(action==="equip"){
    const max=G.maxEquippedRelics||2;
    if((G.equippedRelics||[]).length>=max){showToast(`Max ${max} Relics equipped`,"t-info");return;}
    G.equippedRelics=[...(G.equippedRelics||[]),rid]; def.apply(G);
    showToast(`${def.icon} ${def.name} equipped!`,"t-success");
  } else if(action==="unequip"){
    G.equippedRelics=(G.equippedRelics||[]).filter(r=>r!==rid); def.unapply(G);
    showToast(`${def.name} unequipped`,"t-info");
  }
  renderRelics(); updateTopBar();
}

/* ══════════════════════════════════════════
   REBIRTH
══════════════════════════════════════════ */
function performRebirth() {
  if(G.level<50){showToast("Reach Level 50!","t-info");return;}
  const shards=shardReward(G.level);
  if(!confirm(`COSMIC REBIRTH\n\n+${fmt(shards)} Cosmic Shards.\nLevel, XP, Inventory, Energy reset.\nUpgrades & Relics permanent.\n\nProceed?`))return;
  G.cosmicShards+=shards; G.stats.rebirths++;
  G.level=1;G.xp=0;G.xpNext=100;G.inventory=[];G.energy=0;G.totalRolls=0;
  selectedInventoryItems=[];clearSynth();
  ["rebirthBtn","rebirthBtnUpgrades"].forEach(id=>document.getElementById(id).classList.add("hidden"));
  showToast(`★ REBIRTH — +${fmt(shards)} Shards!`,"t-transcendent");
  const fl=document.getElementById("screenFlash"); fl.className="flash-transcendent"; fl.style.opacity="1"; setTimeout(()=>{fl.style.opacity="0";},1000);
  document.body.classList.remove("shaking"); void document.body.offsetWidth; document.body.classList.add("shaking-hard");
  renderUpgrades();updateInventoryUI();updateTopBar();renderStats();
}

/* ══════════════════════════════════════════
   TRANSCENDENCE
══════════════════════════════════════════ */
function performTranscendence() {
  if(G.level<10000||G.cosmicShards<1000000){showToast("Requires Level 10,000 AND 1,000,000 Cosmic Shards!","t-info");return;}
  const sparks=sparkReward(G.level);
  if(!confirm(`✦ TRANSCENDENCE\n\nHARD RESET — Everything is wiped.\nUpgrades, Relics, Level, Energy, Inventory, Shards — ALL GONE.\n\nYou will receive: ${sparks} Singularity Sparks\nConstellation nodes are PERMANENT.\n\nProceed?`))return;

  G.singularitySparks=(G.singularitySparks||0)+sparks;
  G.transcendCount=(G.transcendCount||0)+1;

  /* Hard reset everything except constellation + sparks + transcend count */
  const savedConst=G.constellationLevels;
  const savedSparks=G.singularitySparks;
  const savedTranscend=G.transcendCount;
  const savedUsername=G.username;

  const fresh=DEFAULT_STATE();
  Object.assign(G,fresh);
  G.constellationLevels=savedConst;
  G.singularitySparks=savedSparks;
  G.transcendCount=savedTranscend;
  G.username=savedUsername;

  /* Re-apply constellation effects */
  applyAllConstellations();

  showToast(`✦ TRANSCENDENCE! +${sparks} Sparks! Total: ${G.transcendCount}×`,"t-spark");

  const fl=document.getElementById("screenFlash");
  fl.className="flash-impossible5"; fl.style.opacity="1";
  setTimeout(()=>{fl.style.opacity="0";},2000);

  selectedInventoryItems=[];clearSynth();
  ["rebirthBtn","rebirthBtnUpgrades","transcendBtn","transcendBtnPage"].forEach(id=>document.getElementById(id)?.classList.add("hidden"));

  updateTopBar();updateInventoryUI();renderUpgrades();renderRelics();renderConstellations();renderStats();
  saveGame();
}

/* ══════════════════════════════════════════
   CONSTELLATION
══════════════════════════════════════════ */
function renderConstellations() {
  const list=document.getElementById("constellationList"); if(!list)return; list.innerHTML="";
  document.getElementById("sparkDisplay").textContent=fmt(G.singularitySparks);
  document.getElementById("transcendCount").textContent=G.transcendCount||0;
  const req=`Lv 10,000 (${fmt(G.level)}) + 1M Shards (${fmt(G.cosmicShards)})`;
  if(G.level>=10000&&G.cosmicShards>=1000000){
    document.getElementById("transcendBtnPage").classList.remove("hidden");
  }
  CONSTELLATION_DEF.forEach(def=>{
    const lvl=G.constellationLevels[def.id]||0;
    const cost=lvl<def.maxLevel?constellationSparkCost(def.id,lvl):0;
    const maxed=lvl>=def.maxLevel;
    const canBuy=!maxed&&G.singularitySparks>=cost;
    const card=document.createElement("div"); card.className="constellation-card"+(maxed?" maxed":"");
    card.innerHTML=`<span class="const-icon">${def.icon}</span><div class="const-name">${def.name}</div><div class="const-desc">${def.desc}</div>`+
      `<div class="const-effect">${def.effect(lvl)}</div><div class="const-level">Lv ${lvl}/${def.maxLevel}</div>`+
      `<button class="const-buy-btn" data-id="${def.id}" ${!canBuy?"disabled":""}>${maxed?"MAXED":`✦ ${fmt(cost)} Sparks`}</button>`;
    list.appendChild(card);
  });
}
function buyConstellation(id) {
  const def=CONSTELLATION_DEF.find(c=>c.id===id); if(!def)return;
  const lvl=G.constellationLevels[id]||0; if(lvl>=def.maxLevel)return;
  const cost=constellationSparkCost(id,lvl);
  if(G.singularitySparks<cost){showToast("Not enough Singularity Sparks","t-info");return;}
  G.singularitySparks-=cost; G.constellationLevels[id]=lvl+1; def.apply(G.constellationLevels[id],G);
  showToast(`${def.icon} ${def.name} → Lv ${G.constellationLevels[id]}!`,"t-spark");
  renderConstellations(); updateTopBar();
}

/* ══════════════════════════════════════════
   FRENZY MODE
══════════════════════════════════════════ */
function startFrenzy(type) {
  if (frenzyActive) return;
  frenzyActive=true; frenzyType=type;
  G.stats.frenzyModes=(G.stats.frenzyModes||0)+1;
  frenzySecondsLeft=60;

  const banner=document.getElementById("frenzyBanner");
  const overlay=document.getElementById("frenzyOverlay");
  const rollBtn=document.getElementById("rollBtn");
  const coreArea=document.getElementById("coreArea");

  overlay.classList.remove("hidden","frenzy-void"); banner.classList.remove("hidden","frenzy-void");
  rollBtn.classList.add("frenzy-active"); coreArea.classList.add("frenzy-active");

  if (type==="comet") {
    document.getElementById("frenzyBannerText").textContent="⚡ GOLDEN COMET FRENZY — LUCK ×1000% ⚡";
    overlay.classList.add("active");
  } else {
    document.getElementById("frenzyBannerText").textContent="🌀 VOID RIFT FRENZY — GUARANTEED MYTHIC+ 🌀";
    overlay.classList.add("active","frenzy-void");
    banner.classList.add("frenzy-void");
  }

  frenzyCountdown=setInterval(()=>{
    frenzySecondsLeft--;
    document.getElementById("frenzyTimer").textContent=frenzySecondsLeft+"s";
    if (frenzySecondsLeft<=0) endFrenzy();
  },1000);

  showToast(type==="comet"?"⚡ GOLDEN COMET! LUCK ×1000% FOR 60s!":"🌀 VOID RIFT! GUARANTEED MYTHIC+ FOR 60s!","t-anomaly");

  /* Void rift: also drop a guaranteed ultra-rare immediately */
  if (type==="void") {
    const ultraBases=BASE_AURAS.filter(b=>b.chance<=1/100000&&!b.requiresTranscend);
    if (ultraBases.length>0) {
      const b=ultraBases[Math.floor(rand()*ultraBases.length)];
      const guaranteed={
        id:Date.now()+"_void_"+Math.random().toString(36).slice(2,6),
        baseId:b.id, mutationIds:["none"], name:"★ "+b.name,
        value:b.baseValue*10, color:b.color, chance:b.chance, isCrafted:false, ts:Date.now(),
      };
      if(G.inventory.length<G.maxInventory+(G.constExtraStorage||0)) G.inventory.push(guaranteed);
      const tier=getEffectiveTier(guaranteed);
      updateCurrentAuraDisplay(guaranteed,tier);
      triggerRarityEffects(tier,guaranteed,1);
      addToRecentRolls(guaranteed,tier,9999,false);
      scheduleUIUpdate();
    }
  }
}

function endFrenzy() {
  frenzyActive=false;
  clearInterval(frenzyCountdown); frenzyCountdown=null;
  document.getElementById("frenzyBanner").classList.add("hidden");
  document.getElementById("frenzyOverlay").classList.remove("active","frenzy-void");
  document.getElementById("rollBtn").classList.remove("frenzy-active");
  document.getElementById("coreArea").classList.remove("frenzy-active");
  showToast("Frenzy Mode ended.","t-info");
}

/* ══════════════════════════════════════════
   COSMIC ANOMALY EVENTS
══════════════════════════════════════════ */
function scheduleNextAnomaly() {
  const delay=(3*60+Math.random()*7*60)*1000; /* 3–10 minutes */
  anomalyTimer=setTimeout(spawnAnomaly, delay);
}

function spawnAnomaly() {
  const container=document.getElementById("anomalyContainer");
  if (!container||anomalyEl) { scheduleNextAnomaly(); return; }

  const type=rand()<0.6?"comet":"void";
  anomalyEl=document.createElement("div");
  anomalyEl.className=`anomaly anomaly-${type}`;

  /* Random position avoiding edges */
  const x=Math.random()*(window.innerWidth-160)+80;
  const y=Math.random()*(window.innerHeight-200)+100;
  anomalyEl.style.left=x+"px";
  anomalyEl.style.top=y+"px";
  anomalyEl.innerHTML=type==="comet"?`<span>GOLDEN<br>COMET<br>⚡</span>`:`<span>VOID<br>RIFT<br>🌀</span>`;

  container.appendChild(anomalyEl);

  /* Move the anomaly across screen */
  const vx=(rand()-0.5)*3, vy=(rand()-0.5)*3;
  let ax=x,ay=y;
  const moveInterval=setInterval(()=>{
    ax+=vx; ay+=vy;
    if (ax<0||ax>window.innerWidth-80||ay<0||ay>window.innerHeight-80) {
      clearInterval(moveInterval);
      if (anomalyEl) { anomalyEl.remove(); anomalyEl=null; }
      scheduleNextAnomaly();
    }
    if (anomalyEl) { anomalyEl.style.left=ax+"px"; anomalyEl.style.top=ay+"px"; }
  },16);

  /* Click handler */
  anomalyEl.addEventListener("click",()=>{
    clearInterval(moveInterval);
    if (anomalyEl) { anomalyEl.remove(); anomalyEl=null; }
    G.stats.anomaliesClicked=(G.stats.anomaliesClicked||0)+1;
    startFrenzy(type);
    scheduleNextAnomaly();
  });

  /* Auto-despawn after 5 seconds */
  setTimeout(()=>{
    clearInterval(moveInterval);
    if (anomalyEl) { anomalyEl.remove(); anomalyEl=null; }
    scheduleNextAnomaly();
  },5000);
}

/* ══════════════════════════════════════════
   STATS
══════════════════════════════════════════ */
function renderStats() {
  const el=document.getElementById("statsContent"); if(!el)return;
  const rows=[
    ["Total Rolls",     fmt(G.totalRolls)],
    ["Level",           G.level],
    ["XP Earned",       fmt(G.stats.totalXPEarned)],
    ["Energy Sold",     fmt(G.stats.totalEnergySold)+"⚡"],
    ["Auto-Sold",       fmt(G.stats.autoSoldCount)],
    ["Syntheses",       G.stats.totalSynths],
    ["Rebirths",        G.stats.rebirths],
    ["Transcendences",  G.transcendCount||0],
    ["Sparks ✦",        fmt(G.singularitySparks)],
    ["Cosmic Shards",   fmt(G.cosmicShards)],
    ["Relic Frags",     G.relicFragments],
    ["Best Value",      fmt(G.stats.highestValueRoll)],
    ["Best Aura",       G.stats.highestAuraName||"—"],
    ["Rarest",          G.stats.rarestRoll],
    ["Luck ×",          (G.luckMult*(G.constLuckMult||1)).toFixed(2)],
    ["XP ×",            (G.xpMult*(G.constXpMult||1)).toFixed(2)],
    ["Sell ×",          G.sellMult.toFixed(2)],
    ["Batch Size",      getEffectiveBatchSize()],
    ["Auto-Roll",       G.autoRollInterval+"ms"],
    ["Inv Cap",         G.maxInventory+(G.constExtraStorage||0)],
    ["Anomalies",       G.stats.anomaliesClicked||0],
    ["Frenzies",        G.stats.frenzyModes||0],
    ["—Common",         fmt(G.stats.commonCount)],
    ["—Uncommon",       fmt(G.stats.uncommonCount)],
    ["—Rare",           fmt(G.stats.rareCount)],
    ["—Epic",           fmt(G.stats.epicCount)],
    ["—Legendary",      fmt(G.stats.legendaryCount)],
    ["—Mythic",         fmt(G.stats.mythicCount)],
    ["—Divine",         fmt(G.stats.divineCount)],
    ["—Cosmic",         fmt(G.stats.cosmicCount)],
    ["—Celestial",      fmt(G.stats.celestialCount)],
    ["—Transcendent",   fmt(G.stats.transcendentCount)],
    ["—Supernal",       fmt(G.stats.supernalCount)],
    ["—Primordial",     fmt(G.stats.primordialCount)],
    ["—Impossible I",   fmt(G.stats.impossible1Count)],
    ["—Impossible II",  fmt(G.stats.impossible2Count)],
    ["—Impossible III", fmt(G.stats.impossible3Count)],
    ["—Impossible IV",  fmt(G.stats.impossible4Count)],
    ["—Impossible V",   fmt(G.stats.impossible5Count)],
  ];
  el.innerHTML=rows.map(([l,v])=>`<div class="stat-row"><span class="stat-row-label">${l}</span><span class="stat-row-val">${v}</span></div>`).join("");
}

/* ══════════════════════════════════════════
   FILTER UI
══════════════════════════════════════════ */
function updateFilterUI() {
  const cb=document.getElementById("filterEnabled");
  const sel=document.getElementById("filterThreshold");
  const desc=document.getElementById("filterDesc");
  const statusText=document.getElementById("filterStatusText");
  if(!cb)return;
  cb.checked=G.filter.enabled; sel.value=G.filter.threshold;
  if(G.filter.enabled&&G.filter.threshold>0){
    const tierName=RARITY_TIERS[G.filter.threshold]?.name||"?";
    desc.textContent=`Auto-selling everything below ${tierName}`;
    if(statusText) statusText.textContent=`< ${tierName}`;
  } else {
    desc.textContent="Filter is disabled.";
    if(statusText) statusText.textContent="Off";
  }
}

/* ══════════════════════════════════════════
   AUTO ROLL
══════════════════════════════════════════ */
function startAutoRoll(){isAutoRolling=true;scheduleNextAutoRoll();updateAutoRollSpeedDisplay();}
function stopAutoRoll(){isAutoRolling=false;if(autoRollTimer){clearTimeout(autoRollTimer);autoRollTimer=null;}updateAutoRollSpeedDisplay();}
function scheduleNextAutoRoll(){if(!isAutoRolling)return;autoRollTimer=setTimeout(()=>{if(isAutoRolling){performRoll();scheduleNextAutoRoll();}},G.autoRollInterval);}
function restartAutoRoll(){if(autoRollTimer)clearTimeout(autoRollTimer);if(isAutoRolling)scheduleNextAutoRoll();}
function updateAutoRollSpeedDisplay(){
  const el=document.getElementById("autoRollSpeedDisplay");
  if(el)el.textContent=isAutoRolling?`Speed: ${(G.autoRollInterval/1000).toFixed(2)}s · ×${fmt(getEffectiveBatchSize())}/tick`:"Speed: —";
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
function showToast(msg,cls=""){
  const c=document.getElementById("toastContainer");
  const el=document.createElement("div"); el.className=`toast ${cls}`; el.textContent=msg;
  c.appendChild(el); setTimeout(()=>el.remove(),3200);
}

/* ══════════════════════════════════════════
   LEADERBOARD API
══════════════════════════════════════════ */
async function fetchLeaderboard() {
  const statusEl=document.getElementById("lbStatus");
  const tableEl=document.getElementById("leaderboardTable");
  if(statusEl) statusEl.textContent="Loading...";
  if(tableEl) tableEl.innerHTML='<div class="lb-loading">Fetching data...</div>';
  try {
    const resp=await fetch(API_URL,{method:"GET",headers:{"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"},signal:AbortSignal.timeout(8000)});
    if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data=await resp.json();
    renderLeaderboard(data.leaderboard||data||[]);
    if(statusEl) statusEl.textContent=`Updated: ${new Date().toLocaleTimeString()}`;
  } catch(e) {
    if(tableEl) tableEl.innerHTML=`<div class="lb-error">⚠ Could not load leaderboard: ${e.message}<br><small>Ensure the backend API is running at ${API_URL}</small></div>`;
    if(statusEl) statusEl.textContent="Error loading";
  }
}

async function submitScore() {
  const username=(G.username||"").trim();
  if(!username){showToast("Set your username in Settings first!","t-info");return;}
  const statusEl=document.getElementById("lbStatus");
  if(statusEl) statusEl.textContent="Submitting...";
  const payload={
    username,
    highest_aura_name: G.stats.highestAuraName||"—",
    highest_aura_value: G.stats.highestValueRoll||0,
    transcendences: G.transcendCount||0,
  };
  try {
    const resp=await fetch(API_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"},
      body:JSON.stringify(payload),
      signal:AbortSignal.timeout(8000),
    });
    if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data=await resp.json();
    if(statusEl) statusEl.textContent=data.message||"Score submitted!";
    showToast("✦ Score submitted to leaderboard!","t-success");
    fetchLeaderboard();
  } catch(e) {
    if(statusEl) statusEl.textContent="Submit failed: "+e.message;
    showToast("Submit failed: "+e.message,"t-info");
  }
}

function renderLeaderboard(rows) {
  const tableEl=document.getElementById("leaderboardTable");
  if(!tableEl)return;
  if(!rows||rows.length===0){tableEl.innerHTML='<div class="lb-loading">No scores yet. Be the first to submit!</div>';return;}
  const myName=(G.username||"").trim().toLowerCase();
  let html=`<table class="lb-table"><thead><tr><th>#</th><th>PLAYER</th><th>HIGHEST AURA</th><th>VALUE</th><th>✦ TRANSCENDENCES</th><th>UPDATED</th></tr></thead><tbody>`;
  rows.forEach((row,i)=>{
    const rank=i+1;
    const rankClass=rank===1?"gold":rank===2?"silver":rank===3?"bronze":"";
    const isMe=row.username&&row.username.toLowerCase()===myName;
    const updated=row.updated_at?new Date(row.updated_at).toLocaleDateString():"—";
    html+=`<tr class="${isMe?"lb-you":""}">
      <td><span class="lb-rank ${rankClass}">${rank}</span></td>
      <td class="lb-username">${escHtml(row.username||"Unknown")}${isMe?' <small style="color:var(--spark-color)">(you)</small>':""}</td>
      <td class="lb-aura">${escHtml(row.highest_aura_name||"—")}</td>
      <td class="lb-value">${fmt(row.highest_aura_value||0)}⚡</td>
      <td class="lb-transcend">${row.transcendences||0}×</td>
      <td style="color:var(--text-dim);font-size:10px">${updated}</td>
    </tr>`;
  });
  html+="</tbody></table>";
  tableEl.innerHTML=html;
}

function escHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

/* ══════════════════════════════════════════
   RECIPES RENDER
══════════════════════════════════════════ */
function renderRecipes() {
  const list=document.getElementById("recipeList"); if(!list)return; list.innerHTML="";
  CRAFTED_AURAS.forEach(ca=>{
    const card=document.createElement("div"); card.className="recipe-card";
    card.innerHTML=`<div class="recipe-name" style="color:${ca.color}">${ca.name}</div><div class="recipe-cond">${ca.desc}</div><div class="recipe-reward">${ca.rarityName} · ${fmt(ca.baseValue)}⚡</div>`;
    list.appendChild(card);
  });
}

/* ══════════════════════════════════════════
   SAVE / LOAD
══════════════════════════════════════════ */
const SAVE_KEY="auraSynthSave_v5";

function saveGame() {
  try {
    const data={
      level:G.level,xp:G.xp,xpNext:G.xpNext,totalRolls:G.totalRolls,energy:G.energy,
      cosmicShards:G.cosmicShards,inventory:G.inventory,maxInventory:G.maxInventory,
      autoRollInterval:G.autoRollInterval,luckMult:G.luckMult,xpMult:G.xpMult,sellMult:G.sellMult,
      mutationChanceBonus:G.mutationChanceBonus,synthMinAuras:G.synthMinAuras,
      shardMult:G.shardMult,fragDropMult:G.fragDropMult,batchSize:G.batchSize,
      baseFragDropChance:G.baseFragDropChance,autoSynthEnabled:G.autoSynthEnabled,
      maxEquippedRelics:G.maxEquippedRelics,relicFragments:G.relicFragments,
      unlockedRelics:G.unlockedRelics,equippedRelics:G.equippedRelics,
      singularitySparks:G.singularitySparks,transcendCount:G.transcendCount,
      constellationLevels:G.constellationLevels,
      constLuckMult:G.constLuckMult,constEnergyMult:G.constEnergyMult,
      constXpMult:G.constXpMult,constShardMult:G.constShardMult,
      constBatchMult:G.constBatchMult,constExtraStorage:G.constExtraStorage,
      constBonusSparks:G.constBonusSparks,impossibleUnlockLevel:G.impossibleUnlockLevel,
      upgradeLevels:G.upgradeLevels,filter:G.filter,username:G.username,stats:G.stats,
    };
    localStorage.setItem(SAVE_KEY,JSON.stringify(data));
    return true;
  } catch(e){console.warn("Save failed:",e);return false;}
}

function loadGame() {
  try {
    const raw=localStorage.getItem(SAVE_KEY); if(!raw)return;
    const d=JSON.parse(raw);
    const def=DEFAULT_STATE();
    Object.keys(def).forEach(k=>{ if(d[k]!==undefined) G[k]=d[k]; });
    G.upgradeLevels={...def.upgradeLevels,...(d.upgradeLevels||{})};
    G.constellationLevels={...def.constellationLevels,...(d.constellationLevels||{})};
    G.stats={...def.stats,...(d.stats||{})};
    G.filter=d.filter||{enabled:false,threshold:0};
    G.unlockedRelics=d.unlockedRelics||[];
    G.equippedRelics=d.equippedRelics||[];
    G.username=d.username||"";
  } catch(e){console.warn("Load failed:",e);}
}

function exportSave(){saveGame();const raw=localStorage.getItem(SAVE_KEY)||"{}";const blob=new Blob([raw],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="aurasynth_v3_save.json";a.click();}
function importSave(file){const reader=new FileReader();reader.onload=e=>{try{const d=JSON.parse(e.target.result);localStorage.setItem(SAVE_KEY,JSON.stringify(d));location.reload();}catch(err){showToast("Invalid save file","t-info");}};reader.readAsText(file);}
function wipeGame(){if(!confirm("WIPE ALL SAVE DATA?\nThis cannot be undone!"))return;localStorage.removeItem(SAVE_KEY);location.reload();}

/* ══════════════════════════════════════════
   CANVAS BACKGROUND
══════════════════════════════════════════ */
function initBGCanvas() {
  const canvas=document.getElementById("bgCanvas");
  const ctx=canvas.getContext("2d");
  let W,H,stars=[];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;stars=[];for(let i=0;i<180;i++)stars.push({x:rand()*W,y:rand()*H,r:rand()*1.2+0.2,alpha:rand()*0.7+0.1,speed:rand()*0.15+0.02,pulse:rand()*Math.PI*2});}
  let frame=0;
  function draw(){ctx.clearRect(0,0,W,H);frame++;stars.forEach(s=>{const a=s.alpha*(0.7+0.3*Math.sin(s.pulse+frame*0.02));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(180,200,255,${a})`;ctx.fill();s.y-=s.speed;if(s.y<-2){s.y=H+2;s.x=rand()*W;}});ctx.strokeStyle="rgba(30,42,70,0.35)";ctx.lineWidth=0.5;const sp=60;for(let x=0;x<W;x+=sp){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=sp){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}requestAnimationFrame(draw);}
  resize();window.addEventListener("resize",resize);draw();
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
function init() {
  loadGame();
  applyAllUpgrades();

  if(G.level>=50){document.getElementById("rebirthBtn").classList.remove("hidden");document.getElementById("rebirthBtnUpgrades").classList.remove("hidden");}
  if(G.level>=10000&&G.cosmicShards>=1000000){document.getElementById("transcendBtn").classList.remove("hidden");document.getElementById("transcendBtnPage").classList.remove("hidden");}

  initBGCanvas();

  /* Load saved username into input */
  if(G.username) document.getElementById("usernameInput").value=G.username;

  /* ── MAIN NAV ── */
  document.querySelectorAll(".main-tab-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const tabId=btn.dataset.mainTab;
      document.querySelectorAll(".main-tab-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".main-tab-page").forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(tabId).classList.add("active");
      if(tabId==="tabForge"){updateInventoryUI();renderRecipes();}
      if(tabId==="tabUpgrades"){renderUpgrades();}
      if(tabId==="tabRelics"){renderRelics();}
      if(tabId==="tabTranscend"){renderConstellations();}
      if(tabId==="tabLeaderboard"){fetchLeaderboard();}
      if(tabId==="tabSettings"){updateFilterUI();}
      if(tabId==="tabCore"){renderStats();renderRecentRolls();}
    });
  });

  /* ── SYNTH SLOTS ── */
  document.querySelectorAll(".synth-slot").forEach(slot=>{
    slot.addEventListener("click",()=>{
      const idx=parseInt(slot.dataset.slot);
      if(synthSlotItems[idx]){removeFromSynthSlot(idx);}
      else if(selectedInventoryItems.length>0){const invIdx=selectedInventoryItems[0];const aura=G.inventory[invIdx];if(aura){addToSynthSlot(aura);selectedInventoryItems.splice(0,1);_renderInventory();}}
      else{showToast("Select an Aura from Inventory first","t-info");}
    });
  });

  /* ── CORE ACTIONS ── */
  document.getElementById("rollBtn").addEventListener("click",performRoll);
  document.getElementById("autoRollToggle").addEventListener("change",(e)=>{e.target.checked?startAutoRoll():stopAutoRoll();});
  document.getElementById("rebirthBtn").addEventListener("click",performRebirth);
  document.getElementById("rebirthBtnUpgrades").addEventListener("click",performRebirth);
  document.getElementById("transcendBtn").addEventListener("click",performTranscendence);
  document.getElementById("transcendBtnPage").addEventListener("click",performTranscendence);

  /* ── FORGE ── */
  document.getElementById("synthBtn").addEventListener("click",performSynth);
  document.getElementById("clearSynthBtn").addEventListener("click",clearSynth);

  /* ── INVENTORY ── */
  document.getElementById("sellSelectedBtn").addEventListener("click",sellSelected);
  document.getElementById("sellAllCommonBtn").addEventListener("click",sellAllCommon);
  document.getElementById("sendSelectedToForgeBtn").addEventListener("click",()=>{
    selectedInventoryItems.slice().forEach(i=>{const aura=G.inventory[i];if(aura)addToSynthSlot(aura);});
    selectedInventoryItems=[];_renderInventory();
    document.querySelectorAll(".main-tab-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".main-tab-page").forEach(p=>p.classList.remove("active"));
    document.querySelector('[data-main-tab="tabForge"]').classList.add("active");
    document.getElementById("tabForge").classList.add("active");
    updateInventoryUI();renderRecipes();
  });
  document.getElementById("inventoryGrid").addEventListener("dblclick",(e)=>{
    const item=e.target.closest(".inv-item"); if(!item)return;
    const idx=parseInt(item.dataset.idx); const aura=G.inventory[idx]; if(!aura)return;
    const earned=Math.floor(aura.value*G.sellMult);
    G.inventory.splice(idx,1);
    selectedInventoryItems=selectedInventoryItems.filter(i=>i!==idx).map(i=>i>idx?i-1:i);
    G.energy+=earned;G.stats.totalEnergySold+=earned;
    showToast(`Sold ${aura.name} for ${fmt(earned)}⚡`,"t-success");updateInventoryUI();updateTopBar();
  });
  document.getElementById("inventoryGrid").addEventListener("contextmenu",(e)=>{
    e.preventDefault();const item=e.target.closest(".inv-item");if(!item)return;
    const aura=G.inventory[parseInt(item.dataset.idx)];if(aura)addToSynthSlot(aura);
  });

  /* ── UPGRADES ── */
  document.getElementById("upgradesList").addEventListener("click",(e)=>{if(e.target.classList.contains("upgrade-buy-btn"))buyUpgrade(e.target.dataset.id);});

  /* ── RELICS ── */
  document.getElementById("relicsList").addEventListener("click",(e)=>{const btn=e.target.closest("[data-rid]");if(btn)handleRelicAction(btn.dataset.rid,btn.dataset.action);});

  /* ── CONSTELLATION ── */
  document.getElementById("constellationList").addEventListener("click",(e)=>{if(e.target.classList.contains("const-buy-btn"))buyConstellation(e.target.dataset.id);});

  /* ── LEADERBOARD ── */
  document.getElementById("refreshLbBtn").addEventListener("click",fetchLeaderboard);
  document.getElementById("submitScoreBtn").addEventListener("click",submitScore);

  /* ── FILTER ── */
  document.getElementById("filterEnabled").addEventListener("change",(e)=>{G.filter.enabled=e.target.checked;updateFilterUI();});
  document.getElementById("filterThreshold").addEventListener("change",(e)=>{G.filter.threshold=parseInt(e.target.value);updateFilterUI();});

  /* ── SETTINGS ── */
  document.getElementById("saveUsernameBtn").addEventListener("click",()=>{
    const val=document.getElementById("usernameInput").value.trim();
    if(!val){showToast("Username cannot be empty","t-info");return;}
    G.username=val;saveGame();
    document.getElementById("usernameSaveStatus").textContent="Saved!";
    setTimeout(()=>{const el=document.getElementById("usernameSaveStatus");if(el)el.textContent="";},2000);
    showToast(`Username set to: ${val}`,"t-success");
  });
  document.getElementById("wipeSaveBtn").addEventListener("click",wipeGame);
  document.getElementById("manualSaveBtn").addEventListener("click",()=>{
    const ok=saveGame();const el=document.getElementById("saveStatus");
    if(el)el.textContent=ok?"Saved!":"Save failed!";showToast(ok?"Game saved!":"Save failed","t-success");setTimeout(()=>{if(el)el.textContent="Auto-saves every 5s";},2000);
  });
  document.getElementById("exportSaveBtn").addEventListener("click",exportSave);
  document.getElementById("importSaveTrigger").addEventListener("click",()=>document.getElementById("importSaveFile").click());
  document.getElementById("importSaveFile").addEventListener("change",(e)=>{if(e.target.files[0])importSave(e.target.files[0]);});

  /* ── KEYBOARD ── */
  document.addEventListener("keydown",(e)=>{if(e.code==="Space"&&e.target===document.body){e.preventDefault();performRoll();}});

  /* ── TOOLTIP TRACK ── */
  document.addEventListener("mousemove",(e)=>{if(document.getElementById("tooltip").style.display==="block")positionTooltip(e);});

  /* ── AUTO SAVE ── */
  setInterval(()=>saveGame(),5000);

  /* ── PERIODIC STAT REFRESH ── */
  setInterval(()=>{
    const active=document.querySelector(".main-tab-btn.active");
    if(active&&active.dataset.mainTab==="tabCore"){renderStats();renderRecentRolls();}
  },2000);

  /* ── ANOMALY SYSTEM ── */
  scheduleNextAnomaly();

  /* ── INITIAL RENDER ── */
  updateTopBar(); updateInventoryUI(); updateSynthSlots(); renderStats();
  updateFilterUI(); renderRecentRolls();
  document.getElementById("auraNameDisplay").textContent=G.inventory.length>0?"Ready":"Roll to Begin";

  showToast("Aura Synthesizer v3.0 — CHAOS ENGINE ONLINE","t-info");
  showToast("[SPACE] to roll · Watch for Cosmic Anomalies!","t-info");
}

document.addEventListener("DOMContentLoaded",init);
