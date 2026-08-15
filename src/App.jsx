import React, { useState } from "react";
import {
  Trophy, Star, Zap, Target, Shield, Activity, ChevronRight, RotateCcw,
  Flag, HeartPulse, Coins, Gift, Medal, Battery, Smile, Users, Heart,
  Mic, Moon, PartyPopper, Sparkles, Newspaper, Baby, Home, Sun, Dumbbell, CircleDot, Lock
} from "lucide-react";

// ---------- Data ----------
const STAT_LABELS = { hiz: "HIZ", sut: "ŞUT", pas: "PAS", dribbling: "DRB", defans: "DEF", fizik: "FZK" };
const GK_LABELS = { hiz: "ÇEVİKLİK", sut: "ÇIKIŞ", pas: "DAĞITIM", dribbling: "REFLEKS", defans: "KURTARIŞ", fizik: "FZK" };
const STAT_KEYS = Object.keys(STAT_LABELS);
const TOTAL_ROUNDS = 6;

const POSITIONS = {
  FW: { label: "Forvet", icon: Target, weights: { hiz: .2, sut: .35, pas: .1, dribbling: .2, defans: .05, fizik: .1 }, goalFactor: .45, assistFactor: .15 },
  MF: { label: "Orta Saha", icon: Zap, weights: { hiz: .15, sut: .15, pas: .3, dribbling: .2, defans: .1, fizik: .1 }, goalFactor: .18, assistFactor: .3 },
  DF: { label: "Defans", icon: Shield, weights: { hiz: .15, sut: .05, pas: .15, dribbling: .1, defans: .4, fizik: .15 }, goalFactor: .05, assistFactor: .1 },
  GK: { label: "Kaleci", icon: Activity, weights: { hiz: .05, sut: .05, pas: .1, dribbling: .05, defans: .55, fizik: .2 }, goalFactor: .01, assistFactor: .02 },
};

const COUNTRIES = {
  TR: {
    name: "Türkiye",
    tiers: [
      { name: "1. Lig", wageBase: 3000, teams: [
        { name: "Boluspor", stars: 2 }, { name: "Manisa FK", stars: 2 }, { name: "Ankaragücü", stars: 3 },
        { name: "Erzurumspor", stars: 2 }, { name: "Adanaspor", stars: 2 }, { name: "Bandırmaspor", stars: 2 },
        { name: "Sakaryaspor", stars: 2 }, { name: "Pendikspor", stars: 3 },
      ]},
      { name: "Süper Lig", wageBase: 40000, teams: [
        { name: "Galatasaray", stars: 5 }, { name: "Fenerbahçe", stars: 5 }, { name: "Beşiktaş", stars: 4 }, { name: "Trabzonspor", stars: 4 },
        { name: "Başakşehir", stars: 3 }, { name: "Konyaspor", stars: 2 }, { name: "Kayserispor", stars: 2 }, { name: "Sivasspor", stars: 2 },
        { name: "Alanyaspor", stars: 2 }, { name: "Antalyaspor", stars: 2 }, { name: "Gaziantep FK", stars: 2 }, { name: "Kasımpaşa", stars: 2 },
      ]},
    ],
  },
  EN: {
    name: "İngiltere",
    tiers: [
      { name: "Championship", wageBase: 5000, teams: [
        { name: "Leeds United", stars: 3 }, { name: "Leicester City", stars: 3 }, { name: "Southampton", stars: 3 },
        { name: "West Brom", stars: 2 }, { name: "Norwich City", stars: 2 }, { name: "Sunderland", stars: 2 },
        { name: "Middlesbrough", stars: 2 }, { name: "Coventry City", stars: 2 },
      ]},
      { name: "Premier League", wageBase: 90000, teams: [
        { name: "Manchester City", stars: 5 }, { name: "Arsenal", stars: 5 }, { name: "Liverpool", stars: 5 }, { name: "Manchester United", stars: 5 },
        { name: "Chelsea", stars: 4 }, { name: "Tottenham", stars: 4 }, { name: "Newcastle United", stars: 4 },
        { name: "Aston Villa", stars: 3 }, { name: "Brighton", stars: 3 }, { name: "West Ham United", stars: 3 },
        { name: "Everton", stars: 2 }, { name: "Crystal Palace", stars: 2 }, { name: "Fulham", stars: 2 }, { name: "Wolves", stars: 2 },
      ]},
    ],
  },
  ES: {
    name: "İspanya",
    tiers: [
      { name: "Segunda División", wageBase: 4500, teams: [
        { name: "Real Zaragoza", stars: 2 }, { name: "Sporting Gijón", stars: 2 }, { name: "Racing Santander", stars: 2 },
        { name: "Deportivo La Coruña", stars: 3 }, { name: "Levante", stars: 2 }, { name: "Eibar", stars: 2 }, { name: "Albacete", stars: 2 },
      ]},
      { name: "La Liga", wageBase: 85000, teams: [
        { name: "Real Madrid", stars: 5 }, { name: "Barcelona", stars: 5 }, { name: "Atlético Madrid", stars: 5 },
        { name: "Real Sociedad", stars: 4 }, { name: "Athletic Bilbao", stars: 4 }, { name: "Real Betis", stars: 3 }, { name: "Villarreal", stars: 3 },
        { name: "Sevilla", stars: 3 }, { name: "Valencia", stars: 2 }, { name: "Girona", stars: 3 }, { name: "Osasuna", stars: 2 },
        { name: "Celta Vigo", stars: 2 }, { name: "Getafe", stars: 2 }, { name: "Mallorca", stars: 2 },
      ]},
    ],
  },
};

const DATE_NAMES = ["Elif", "Zeynep", "Aslı", "Deniz", "Ece", "Selin", "Buse", "Mira", "Ada", "Naz"];
const REL_STAGE = {
  flört: { label: "Flört", chip: "bg-slate-600" },
  iliski: { label: "İlişki", chip: "bg-pink-600" },
  nisanli: { label: "Nişanlı", chip: "bg-amber-600" },
  evli: { label: "Evli", chip: "bg-rose-600" },
};

const INTENSITY = {
  hafif: { label: "Hafif", boost: [0, 1], energy: 3, risk: 0, desc: "Düşük risk, az gelişim" },
  orta: { label: "Orta", boost: [1, 2], energy: 8, risk: 0.02, desc: "Dengeli gelişim" },
  yogun: { label: "Yoğun", boost: [2, 4], energy: 15, risk: 0.06, desc: "Yüksek gelişim, sakatlık riski" },
};

const DARK = {
  app: "bg-slate-950", blob1: "bg-emerald-600/20", blob2: "bg-amber-600/10",
  headerLabel: "text-emerald-400/70", headerTitle: "text-white",
  pill: "bg-slate-800 border border-slate-700", pillText: "text-slate-100",
  iconBtn: "bg-slate-800 border border-slate-700 text-slate-200",
  panel: "bg-slate-800/70 border border-slate-700/60 backdrop-blur",
  panelAlt: "bg-slate-900/70", panelAlt2: "bg-slate-900/50",
  textMain: "text-white", textSub: "text-slate-300", textFaint: "text-slate-500", label: "text-emerald-400",
  input: "bg-slate-900 border-2 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-400",
  btnActive: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
  btnInactive: "bg-slate-900 border-slate-700 text-slate-400",
  statPip: "bg-slate-900/70", statPipLabel: "text-emerald-400", statPipValue: "text-slate-100",
  tableRow: "bg-slate-900/50", tableRowPlayer: "bg-amber-500/10 border border-amber-500/50",
  footer: "text-slate-700", chunkySlate: "bg-slate-700 border-slate-900 text-slate-100",
  scoreBox: "bg-slate-950 border border-slate-800", barTrack: "bg-slate-950",
};
const LIGHT = {
  app: "bg-slate-100", blob1: "bg-emerald-300/30", blob2: "bg-amber-300/20",
  headerLabel: "text-emerald-700/80", headerTitle: "text-slate-900",
  pill: "bg-white border border-slate-200 shadow-sm", pillText: "text-slate-800",
  iconBtn: "bg-white border border-slate-200 text-slate-600 shadow-sm",
  panel: "bg-white border border-slate-200 shadow-md",
  panelAlt: "bg-slate-50", panelAlt2: "bg-slate-50",
  textMain: "text-slate-900", textSub: "text-slate-600", textFaint: "text-slate-400", label: "text-emerald-600",
  input: "bg-slate-50 border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500",
  btnActive: "bg-emerald-50 border-emerald-500 text-emerald-700",
  btnInactive: "bg-slate-50 border-slate-200 text-slate-500",
  statPip: "bg-slate-50", statPipLabel: "text-emerald-600", statPipValue: "text-slate-800",
  tableRow: "bg-slate-50", tableRowPlayer: "bg-amber-50 border border-amber-400",
  footer: "text-slate-400", chunkySlate: "bg-slate-200 border-slate-400 text-slate-700",
  scoreBox: "bg-slate-50 border border-slate-200", barTrack: "bg-slate-200",
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => Math.random() * (max - min) + min;
const money = (n) => n.toLocaleString("tr-TR") + " ₺";
const trainLabel = (k, pos) => (pos === "GK" ? GK_LABELS[k] : STAT_LABELS[k]);

function computeOverall(stats, posKey) {
  const w = POSITIONS[posKey].weights;
  let sum = 0;
  for (const k of STAT_KEYS) sum += stats[k] * w[k];
  return Math.round(sum);
}
function applyAging(stats, age) {
  const out = { ...stats };
  STAT_KEYS.forEach((k) => {
    let delta;
    if (age <= 21) delta = randInt(0, 2);
    else if (age <= 29) delta = randInt(-1, 1);
    else delta = (k === "hiz" || k === "fizik") ? randInt(-3, -1) : randInt(-2, 0);
    out[k] = clamp(out[k] + delta, 10, 99);
  });
  return out;
}
function cardTier(v) {
  if (v >= 90) return { name: "EFSANE", border: "border-fuchsia-400", grad: "from-fuchsia-500 via-purple-500 to-indigo-500", text: "text-white" };
  if (v >= 82) return { name: "ELMAS", border: "border-cyan-300", grad: "from-cyan-400 via-sky-400 to-blue-500", text: "text-white" };
  if (v >= 72) return { name: "ALTIN", border: "border-yellow-400", grad: "from-yellow-300 via-amber-400 to-orange-400", text: "text-emerald-950" };
  if (v >= 60) return { name: "GÜMÜŞ", border: "border-slate-300", grad: "from-slate-300 via-slate-400 to-slate-500", text: "text-slate-950" };
  return { name: "BRONZ", border: "border-orange-700", grad: "from-orange-700 via-orange-800 to-amber-900", text: "text-white" };
}
function starsFromOverall(v) { return clamp(Math.round(v / 20), 1, 5); }
function hallOfFame(career) {
  const score = career.goals + career.assists * 0.7 + career.trophies.length * 15 + career.caps * 2 + career.peakOverall * 3;
  if (score >= 1200) return { label: "EFSANE", note: "Adın kulüp tarihine altın harflerle yazıldı.", chip: "bg-fuchsia-600" };
  if (score >= 700) return { label: "YILDIZ OYUNCU", note: "Taraftarların formanı asla unutmayacağı bir kariyer.", chip: "bg-cyan-600" };
  if (score >= 300) return { label: "PROFESYONEL", note: "Onurlu, istikrarlı bir kariyer geçirdin.", chip: "bg-amber-600" };
  return { label: "AMATÖR EMEKLİ", note: "Sahalardan uzaklaştın ama sevgiyle hatırlanacaksın.", chip: "bg-slate-600" };
}

function allowedStars(overall) { return clamp(Math.floor((overall - 30) / 10) + 1, 1, 5); }
function tierData(country, idx) { return COUNTRIES[country].tiers[idx]; }
function tierLabel(player) {
  if (!player) return "";
  if (player.tier === "youth") return `${COUNTRIES[player.country].name} Altyapısı`;
  return `${COUNTRIES[player.country].name} · ${tierData(player.country, player.tier).name}`;
}
function pickOpponent(country, idx, excludeName) {
  const pool = tierData(country, idx).teams.filter((tm) => tm.name !== excludeName);
  return pool[randInt(0, pool.length - 1)].name;
}
function pickTeamFiltered(country, idx, maxStars, excludeName) {
  const all = tierData(country, idx).teams.filter((tm) => tm.name !== excludeName);
  const qualifying = all.filter((tm) => tm.stars <= maxStars);
  const list = qualifying.length ? qualifying : all;
  return list[randInt(0, list.length - 1)];
}
function buildLeagueTableFromPoints(country, tierIdx, playerClub, playerPoints) {
  const rivals = tierData(country, tierIdx).teams
    .filter((tm) => tm.name !== playerClub)
    .map((tm) => ({ name: tm.name, points: randInt(10, 25) + tm.stars * 11 }));
  const table = [...rivals, { name: playerClub, points: clamp(playerPoints, 0, 140), isPlayer: true }];
  table.sort((a, b) => b.points - a.points);
  const rank = table.findIndex((t) => t.isPlayer) + 1;
  return { table, rank };
}
function applyLifeActivity(key, life, rel) {
  let L = { ...life }; let R = rel ? { ...rel } : null; const msgs = [];
  if (key === "rest") {
    L.enerji = clamp(L.enerji + 25, 0, 100); L.mutluluk = clamp(L.mutluluk + 5, 0, 100);
    msgs.push("Sezon arasında iyi dinlendin, enerjin yerine geldi.");
  } else if (key === "party") {
    L.mutluluk = clamp(L.mutluluk + 15, 0, 100); L.populerlik = clamp(L.populerlik + 8, 0, 100); L.enerji = clamp(L.enerji - 20, 0, 100);
    msgs.push("Gece hayatının tadını çıkardın, popülerliğin arttı.");
    if (Math.random() < 0.15) {
      L.mutluluk = clamp(L.mutluluk - 20, 0, 100);
      msgs.push("Magazin basını gece hayatını manşete taşıdı, imajın zedelendi.");
      if (R) { R.affection = clamp(R.affection - 15, 0, 100); msgs.push(`${R.name} bu haberden hoşlanmadı.`); }
    }
  } else if (key === "interview") {
    const confident = Math.random() < 0.5;
    if (confident) {
      L.populerlik = clamp(L.populerlik + 12, 0, 100);
      if (Math.random() < 0.3) { L.mutluluk = clamp(L.mutluluk - 10, 0, 100); msgs.push("Kendinden emin açıklamaların bazı eleştiriler aldı."); }
      else msgs.push("Röportajda kendinden emin duruşun beğenildi.");
    } else {
      L.mutluluk = clamp(L.mutluluk + 5, 0, 100); L.populerlik = clamp(L.populerlik + 5, 0, 100);
      msgs.push("Alçakgönüllü açıklamaların takdir topladı.");
    }
  } else if (key === "date" && R) {
    R.affection = clamp(R.affection + 15, 0, 100); R.seasonsTogether += 1;
    L.mutluluk = clamp(L.mutluluk + 10, 0, 100); L.enerji = clamp(L.enerji - 10, 0, 100);
    msgs.push(`${R.name} ile güzel vakit geçirdin.`);
    if (R.stage === "flört" && R.affection >= 60) { R.stage = "iliski"; msgs.push(`${R.name} ile resmi olarak birlikte oldunuz!`); }
    else if (R.stage === "iliski" && R.affection >= 90 && R.seasonsTogether >= 3) { R.stage = "nisanli"; msgs.push(`${R.name}'e evlilik teklif ettin, nişanlandınız!`); }
    else if (R.stage === "nisanli" && R.affection >= 85 && Math.random() < 0.5) { R.stage = "evli"; msgs.push(`${R.name} ile evlendiniz!`); }
  } else if (key === "meet" && !R) {
    if (Math.random() < 0.6) {
      const nm = DATE_NAMES[randInt(0, DATE_NAMES.length - 1)];
      R = { name: nm, stage: "flört", affection: 30, seasonsTogether: 0, hasChild: false };
      L.mutluluk = clamp(L.mutluluk + 8, 0, 100);
      msgs.push(`${nm} ile tanıştın, görüşmeye başladınız.`);
    } else msgs.push("Bu sezon kimseyle tanışamadın.");
  }
  if (R && key !== "date" && R.stage !== "evli") {
    R.affection = clamp(R.affection - 8, 0, 100);
    if (R.affection <= 10 && Math.random() < 0.4) { msgs.push(`${R.name} ile yollarınızı ayırdınız.`); R = null; }
  }
  if (R && R.stage === "evli" && !R.hasChild && Math.random() < 0.22) {
    R.hasChild = true; L.mutluluk = clamp(L.mutluluk + 20, 0, 100);
    msgs.push("Bebeğiniz dünyaya geldi! Aileniz büyüdü.");
  }
  return { life: L, rel: R, msgs };
}

function Chunky({ children, onClick, disabled, color = "amber", t, className = "" }) {
  const palette = {
    amber: "bg-amber-400 border-amber-700 text-slate-950",
    green: "bg-emerald-500 border-emerald-800 text-slate-950",
    sky: "bg-sky-500 border-sky-800 text-slate-950",
    slate: t.chunkySlate,
  }[color];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 font-black uppercase italic tracking-wide rounded-2xl py-3 border-b-4 transition active:border-b-0 active:translate-y-1 disabled:opacity-30 disabled:active:translate-y-0 ${palette} ${className}`}>
      {children}
    </button>
  );
}
function Panel({ children, t, className = "" }) {
  return <div className={`${t.panel} rounded-3xl shadow-lg p-4 ${className}`}>{children}</div>;
}
function StatPip({ label, value, delta, t }) {
  return (
    <div className={`flex items-center justify-between ${t.statPip} rounded-xl px-3 py-1.5`}>
      <span className={`text-[11px] font-black ${t.statPipLabel}`}>{label}</span>
      <span className={`font-mono text-sm font-bold ${t.statPipValue}`}>
        {value}{delta ? <span className={delta > 0 ? "text-emerald-500 ml-1" : "text-red-500 ml-1"}>{delta > 0 ? `+${delta}` : delta}</span> : null}
      </span>
    </div>
  );
}
function StarRow({ count }) {
  return <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`w-3.5 h-3.5 ${i <= count ? "fill-amber-400 text-amber-400" : "text-white/30"}`} />)}</div>;
}
function LifeBar({ icon: Icon, label, value, grad, t }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest ${t.textFaint} font-bold`}><Icon className="w-3.5 h-3.5" />{label}</span>
        <span className={`font-mono text-xs ${t.textSub}`}>{value}</span>
      </div>
      <div className={`h-1.5 w-full ${t.barTrack} rounded-full overflow-hidden`}><div className={`h-full rounded-full bg-gradient-to-r ${grad}`} style={{ width: `${value}%` }} /></div>
    </div>
  );
}
function PlayerCard({ name, number, position, club, overall, stats, tier, posKey }) {
  const ct = cardTier(overall);
  return (
    <div className={`relative rounded-3xl p-4 bg-gradient-to-br ${ct.grad} border-4 ${ct.border} shadow-xl shadow-black/40 overflow-hidden`}>
      <div className="absolute top-2 right-2 text-[10px] font-black uppercase tracking-widest bg-black/25 rounded-full px-2 py-0.5 text-white">{ct.name}</div>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <span className={`font-mono text-4xl font-black leading-none ${ct.text}`}>{overall}</span>
          <span className={`text-xs font-black ${ct.text} opacity-80`}>{position}</span>
        </div>
        <div className="flex-1 pt-1">
          <p className={`font-black italic text-lg leading-tight ${ct.text}`}>#{number} {name}</p>
          <p className={`text-xs font-semibold ${ct.text} opacity-80`}>{club}</p>
          <p className={`text-[10px] font-bold ${ct.text} opacity-60 mb-1`}>{tier}</p>
          <StarRow count={starsFromOverall(overall)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mt-3">
        {STAT_KEYS.map((k) => (
          <div key={k} className="bg-black/20 rounded-lg px-2 py-1 flex items-center justify-between">
            <span className={`text-[10px] font-black ${ct.text} opacity-70`}>{trainLabel(k, posKey)}</span>
            <span className={`font-mono text-xs font-black ${ct.text}`}>{stats[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function LeagueTableView({ table, rank, t }) {
  return (
    <div className="space-y-1">
      {table.map((row, i) => (
        <div key={i} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${row.isPlayer ? t.tableRowPlayer + " font-black" : t.tableRow}`}>
          <span className={`w-4 font-mono ${t.textFaint}`}>{i + 1}</span>
          <span className={`flex-1 truncate ${t.textSub}`}>{row.name}</span>
          {i === 0 && <Medal className="w-3.5 h-3.5 text-amber-400" />}
          <span className={`font-mono ${t.textFaint}`}>{row.points}p</span>
        </div>
      ))}
      <p className={`text-[11px] ${t.textFaint} mt-1`}>Kulübün sıralamada <b className={t.textSub}>{rank}.</b> sırada bitirdi.</p>
    </div>
  );
}
function RelationshipCard({ rel, t }) {
  if (!rel) return <div className={`flex items-center gap-2 text-xs ${t.textFaint} ${t.panelAlt2} rounded-xl px-3 py-2.5`}><Heart className="w-4 h-4" /> Şu anda bekarsın.</div>;
  const s = REL_STAGE[rel.stage];
  return (
    <div className={`${t.panelAlt2} rounded-xl px-3 py-2.5`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`flex items-center gap-1.5 text-sm font-bold ${t.textMain}`}><Heart className="w-4 h-4 text-rose-400" /> {rel.name}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white ${s.chip}`}>{s.label}</span>
      </div>
      <div className={`h-1.5 w-full ${t.barTrack} rounded-full overflow-hidden mb-1`}><div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400" style={{ width: `${rel.affection}%` }} /></div>
      <p className={`text-[10px] ${t.textFaint}`}>Bağlılık: {rel.affection}/100{rel.hasChild ? " · Bir çocuğunuz var" : ""}</p>
    </div>
  );
}
function FormChips({ log }) {
  const chip = { W: "bg-emerald-500 text-white", D: "bg-slate-400 text-white", L: "bg-red-500 text-white" };
  const items = log.filter((m) => !m.skipped).slice(-5);
  if (items.length === 0) return null;
  return (
    <div className="flex gap-1">
      {items.map((m, i) => <span key={i} className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${chip[m.result]}`}>{m.result}</span>)}
    </div>
  );
}

export default function FutbolcuKariyeri() {
  const [theme, setTheme] = useState("dark");
  const t = theme === "dark" ? DARK : LIGHT;

  const [phase, setPhase] = useState("home");
  const [homeReturnPhase, setHomeReturnPhase] = useState("youth");
  const [showHelp, setShowHelp] = useState(false);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("FW");
  const [squadNumber, setSquadNumber] = useState(9);
  const [player, setPlayer] = useState(null);
  const [career, setCareer] = useState({ goals: 0, assists: 0, matches: 0, trophies: [], caps: 0, natGoals: 0, peakOverall: 0 });
  const [seasonYear, setSeasonYear] = useState(1);

  const [draftStats, setDraftStats] = useState(null);
  const [draftOverall, setDraftOverall] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("TR");
  const [chosenTeam, setChosenTeam] = useState(null);

  const [trainingFocus, setTrainingFocus] = useState("sut");
  const [intensity, setIntensity] = useState("orta");
  const [lifeActivity, setLifeActivity] = useState("rest");
  const [life, setLife] = useState({ enerji: 100, mutluluk: 65, populerlik: 5 });
  const [relationship, setRelationship] = useState(null);
  const [sponsorFlags, setSponsorFlags] = useState([false, false, false]);
  const [coins, setCoins] = useState(0);
  const [packUsed, setPackUsed] = useState(false);

  const [fixtures, setFixtures] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [matchLog, setMatchLog] = useState([]);
  const [roundInjured, setRoundInjured] = useState(false);
  const [trainingNote, setTrainingNote] = useState(null);
  const [lastMatch, setLastMatch] = useState(null);
  const [seasonStatsBefore, setSeasonStatsBefore] = useState(null);
  const [seasonResult, setSeasonResult] = useState(null);
  const [offer, setOffer] = useState(null);
  const [pendingNextPlayer, setPendingNextPlayer] = useState(null);

  function goHome() { setHomeReturnPhase(phase); setPhase("home"); }

  function goToTeamSelect() {
    const stats = {
      hiz: randInt(35, 55), sut: randInt(30, 50), pas: randInt(30, 50),
      dribbling: randInt(30, 50), defans: randInt(30, 50), fizik: randInt(35, 55),
    };
    const w = POSITIONS[position].weights;
    STAT_KEYS.forEach((k) => { if (w[k] >= 0.3) stats[k] = clamp(stats[k] + randInt(8, 15), 10, 99); });
    setDraftStats(stats);
    setDraftOverall(computeOverall(stats, position));
    setSelectedCountry("TR");
    setChosenTeam(null);
    setPhase("team-select");
  }

  function confirmTeam() {
    if (!chosenTeam) return;
    const stats = draftStats;
    setPlayer({ age: 16, country: selectedCountry, club: chosenTeam.name, clubStars: chosenTeam.stars, tier: "youth", wage: 500, stats });
    setCareer({ goals: 0, assists: 0, matches: 0, trophies: [], caps: 0, natGoals: 0, peakOverall: computeOverall(stats, position) });
    setSeasonYear(1);
    setCoins(100); setPackUsed(false);
    setLife({ enerji: 100, mutluluk: 65, populerlik: 5 });
    setRelationship(null); setSponsorFlags([false, false, false]);
    setTrainingFocus(STAT_KEYS.find((k) => POSITIONS[position].weights[k] >= 0.3) || "sut");
    setPhase("youth");
  }

  function buyPack() {
    const cost = 150 + player.tier * 50 + (player.clubStars || 0) * 10;
    if (packUsed || coins < cost) return;
    const w = POSITIONS[position].weights;
    const weighted = STAT_KEYS.filter((k) => w[k] >= 0.15);
    const target = Math.random() < 0.7 ? weighted[randInt(0, weighted.length - 1)] : STAT_KEYS[randInt(0, STAT_KEYS.length - 1)];
    const stats = { ...player.stats };
    stats[target] = clamp(stats[target] + randInt(2, 4), 10, 99);
    setPlayer({ ...player, stats });
    setCoins((c) => c - cost);
    setPackUsed(true);
  }

  function playYouthSeason() {
    let stats = { ...player.stats };
    const boost = stats[trainingFocus] >= 85 ? randInt(1, 2) : randInt(2, 4);
    stats[trainingFocus] = clamp(stats[trainingFocus] + boost, 10, 99);
    STAT_KEYS.forEach((k) => { stats[k] = clamp(stats[k] + randInt(0, 2), 10, 99); });
    const newAge = player.age + 1;
    let tier = player.tier, wage = player.wage;
    if (newAge === 18) { tier = 0; wage = tierData(player.country, 0).wageBase; }
    const updated = { ...player, stats, age: newAge, tier, wage };
    setSeasonYear((y) => y + 1);
    if (newAge === 18) startSeasonRounds(updated, true);
    else { setPlayer(updated); setPhase("youth"); }
  }

  function startSeasonRounds(p, skipAging = false) {
    let updated = p;
    const preStats = { ...p.stats };
    if (!skipAging) updated = { ...p, stats: applyAging(preStats, p.age) };
    setPlayer(updated);
    setSeasonStatsBefore(preStats);
    setFixtures(Array.from({ length: TOTAL_ROUNDS }, () => pickOpponent(updated.country, updated.tier, updated.club)));
    setMatchLog([]);
    setCurrentRound(1);
    setIntensity("orta");
    setRoundInjured(false);
    setTrainingNote(null);
    setPackUsed(false);
    setPhase("training");
  }

  function completeTraining() {
    const cfg = INTENSITY[intensity];
    const boost = randInt(cfg.boost[0], cfg.boost[1]);
    const stats = { ...player.stats };
    stats[trainingFocus] = clamp(stats[trainingFocus] + boost, 10, 99);
    const injured = Math.random() < cfg.risk;
    setPlayer({ ...player, stats });
    setLife((l) => ({ ...l, enerji: clamp(l.enerji - cfg.energy, 0, 100) }));
    setTrainingNote({ boost, focus: trainingFocus, injured });
    setRoundInjured(injured);
    setPhase("match");
  }

  function playMatch() {
    const opponent = fixtures[currentRound - 1];
    if (roundInjured) {
      const entry = { opponent, skipped: true };
      setMatchLog((prev) => [...prev, entry]);
      setLastMatch(entry);
      setPhase("matchresult");
      return;
    }
    const overall = computeOverall(player.stats, position);
    const pos = POSITIONS[position];
    const perfMod = (life.enerji - 50) / 250 + (life.mutluluk - 50) / 300;
    const scoreProb = clamp(0.015 + (player.stats.sut / 99) * pos.goalFactor * 1.25 + perfMod * 0.05, 0.01, 0.28);
    const assistProb = clamp(0.02 + (player.stats.pas / 99) * pos.assistFactor * 1.35 + perfMod * 0.05, 0.01, 0.25);
    let goals = 0;
    if (Math.random() < scoreProb) goals++;
    if (Math.random() < scoreProb * 0.32) goals++;
    let assists = 0;
    if (Math.random() < assistProb) assists++;
    if (Math.random() < assistProb * 0.22) assists++;
    let rating = clamp(6.0 + (overall - 60) / 20 + goals * 0.6 + assists * 0.4 + perfMod * 2 + randFloat(-0.4, 0.4), 4.0, 9.9);
    rating = Math.round(rating * 10) / 10;
    const contributions = goals + assists;
    const teamGoals = Math.max(contributions, randInt(0, 3));
    const oppGoals = randInt(0, 3);
    const result = teamGoals > oppGoals ? "W" : teamGoals === oppGoals ? "D" : "L";
    const attendance = randInt(300, 1800) * player.clubStars * (player.tier + 1);
    const entry = { opponent, teamGoals, oppGoals, result, goals, assists, rating, attendance, skipped: false };
    setMatchLog((prev) => [...prev, entry]);
    setLastMatch(entry);
    setLife((l) => ({ ...l, enerji: clamp(l.enerji - 5, 0, 100) }));
    setPhase("matchresult");
  }

  function nextRound() {
    if (currentRound >= TOTAL_ROUNDS) { setPhase("offseason"); return; }
    setCurrentRound((r) => r + 1);
    setIntensity("orta");
    setRoundInjured(false);
    setTrainingNote(null);
    setPhase("training");
  }

  function finishSeason() {
    const stats = player.stats;
    const overall = computeOverall(stats, position);
    const pos = POSITIONS[position];
    let tier = player.tier, club = player.club;
    const { life: lifeAfter, rel: relAfter, msgs: lifeMsgs } = applyLifeActivity(lifeActivity, life, relationship);
    const perfMod = (lifeAfter.enerji - 50) / 250 + (lifeAfter.mutluluk - 50) / 300;

    const played = matchLog.filter((m) => !m.skipped);
    const wins = played.filter((m) => m.result === "W").length;
    const draws = played.filter((m) => m.result === "D").length;
    const featuredGoals = played.reduce((s, m) => s + m.goals, 0);
    const featuredAssists = played.reduce((s, m) => s + m.assists, 0);
    const featuredMatches = played.length;
    const ratings = played.map((m) => m.rating);

    const totalSeasonMatches = clamp(15 + tier * 5 + Math.floor(overall / 10) + randInt(-3, 3), 8, 42);
    const backgroundMatches = Math.max(0, totalSeasonMatches - featuredMatches);
    const backgroundGoals = Math.max(0, Math.round(backgroundMatches * pos.goalFactor * (stats.sut / 99) * randFloat(0.7, 1.3) * (1 + perfMod)));
    const backgroundAssists = Math.max(0, Math.round(backgroundMatches * pos.assistFactor * (stats.pas / 99) * randFloat(0.7, 1.3) * (1 + perfMod)));

    const totalGoals = featuredGoals + backgroundGoals;
    const totalAssists = featuredAssists + backgroundAssists;
    const totalMatches = featuredMatches + backgroundMatches;
    const avgRating = ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : clamp(6.0 + (overall - 60) / 20, 4, 9);

    const winRateEstimate = clamp((overall - 40) / 110, 0.05, 0.85);
    const backgroundPoints = Math.round(backgroundMatches * winRateEstimate * 3 + backgroundMatches * 0.24);
    const playerPoints = wins * 3 + draws * 1 + backgroundPoints;

    const messages = [];
    let leagueInfo = null, trophy = null;
    if (typeof tier === "number") {
      leagueInfo = buildLeagueTableFromPoints(player.country, tier, club, playerPoints);
      if (leagueInfo.rank === 1) { trophy = "Lig Şampiyonluğu"; messages.push(`${club} ile ${tierData(player.country, tier).name} şampiyonu oldun!`); }
      else if (Math.random() < 0.1) { trophy = "Kupa Zaferi"; messages.push(`${club} ile kupa kazandın!`); }
    }

    let capsGain = 0, natGoalsGain = 0;
    if (overall >= 76 && player.age <= 33) {
      const prob = clamp(0.25 + (overall - 76) / 100, 0, 0.85);
      if (Math.random() < prob) {
        capsGain = randInt(1, 8);
        natGoalsGain = position === "FW" ? randInt(0, 4) : position === "MF" ? randInt(0, 2) : randInt(0, 1);
        messages.push(`Milli takıma çağrıldın! (${capsGain} maç)`);
      }
    }

    const wage = Math.round(tierData(player.country, tier).wageBase * (1 + (overall - 50) / 100));
    let coinsEarned = Math.round(wage / 40) + totalGoals * 15 + totalAssists * 10 + (trophy ? 200 : 0) + capsGain * 20;

    const sponsorThresholds = [30, 60, 85];
    const newSponsorFlags = [...sponsorFlags];
    sponsorThresholds.forEach((th, i) => {
      if (lifeAfter.populerlik >= th && !newSponsorFlags[i]) {
        const bonus = (i + 1) * 300; coinsEarned += bonus; newSponsorFlags[i] = true;
        lifeMsgs.push(`Yeni bir sponsorluk anlaşması imzaladın! +${bonus} coin`);
      }
    });

    let newOffer = null;
    if (tier === 0 && overall >= 55) {
      const target = pickTeamFiltered(player.country, 1, allowedStars(overall), null);
      newOffer = {
        toTier: 1, club: target.name, stars: target.stars,
        wage: Math.round(tierData(player.country, 1).wageBase * (1 + (overall - 50) / 100)),
      };
    }

    setPlayer({ ...player, wage });
    setLife(lifeAfter);
    setRelationship(relAfter);
    setSponsorFlags(newSponsorFlags);
    setCoins((c) => c + coinsEarned);
    setCareer((prev) => ({
      goals: prev.goals + totalGoals, assists: prev.assists + totalAssists, matches: prev.matches + totalMatches,
      trophies: trophy ? [...prev.trophies, { year: seasonYear, name: trophy, club }] : prev.trophies,
      caps: prev.caps + capsGain, natGoals: prev.natGoals + natGoalsGain, peakOverall: Math.max(prev.peakOverall, overall),
    }));
    setSeasonResult({
      overall, matches: totalMatches, goals: totalGoals, assists: totalAssists, avgRating,
      trophy, messages, lifeMsgs, coinsEarned, leagueInfo, backgroundMatches, backgroundGoals, backgroundAssists,
      fixtures: matchLog,
      statsBefore: seasonStatsBefore, statsAfter: player.stats,
    });
    setOffer(newOffer);
    setPhase("summary");
  }

  function continueFromSummary() {
    const newAge = player.age + 1;
    if (newAge > 35) { setPhase("retired"); return; }
    const updated = { ...player, age: newAge };
    if (offer) { setPendingNextPlayer(updated); setPhase("transfer"); return; }
    setSeasonYear((y) => y + 1);
    startSeasonRounds(updated);
  }

  function handleOffer(accept) {
    let updated = pendingNextPlayer;
    if (accept && offer) updated = { ...updated, tier: offer.toTier, club: offer.club, clubStars: offer.stars, wage: offer.wage };
    setOffer(null);
    setSeasonYear((y) => y + 1);
    startSeasonRounds(updated);
  }

  function resetGame() {
    setPhase("create"); setPlayer(null); setName(""); setPosition("FW"); setSquadNumber(randInt(1, 99));
    setCareer({ goals: 0, assists: 0, matches: 0, trophies: [], caps: 0, natGoals: 0, peakOverall: 0 });
    setSeasonYear(1); setSeasonResult(null); setOffer(null); setCoins(0); setPackUsed(false);
    setLife({ enerji: 100, mutluluk: 65, populerlik: 5 }); setRelationship(null); setSponsorFlags([false, false, false]);
    setDraftStats(null); setDraftOverall(0); setSelectedCountry("TR"); setChosenTeam(null);
  }

  const overall = player ? computeOverall(player.stats, position) : 0;
  const packCost = player && typeof player.tier === "number" ? 150 + player.tier * 50 + (player.clubStars || 0) * 10 : 0;
  const lifeOptions = [
    { key: "rest", label: "Dinlen", icon: Moon },
    { key: "party", label: "Gece Hayatı", icon: PartyPopper },
    { key: "interview", label: "Röportaj", icon: Mic },
    relationship ? { key: "date", label: "Buluş", icon: Heart } : { key: "meet", label: "Tanış", icon: Sparkles },
  ];
  const resultLabel = { W: ["Kazandın!", "text-emerald-400"], D: ["Berabere", "text-slate-400"], L: ["Kaybettin", "text-red-400"] };

  return (
    <div className={`min-h-screen w-full ${t.app} relative overflow-hidden transition-colors`}>
      <div className={`pointer-events-none absolute -top-40 -right-40 w-80 h-80 ${t.blob1} rounded-full blur-3xl`} />
      <div className={`pointer-events-none absolute -bottom-40 -left-40 w-80 h-80 ${t.blob2} rounded-full blur-3xl`} />

      <div className="relative max-w-md mx-auto px-4 py-6 sm:py-10">
        <header className="flex items-center justify-between mb-5">
          <div>
            <p className={`text-[10px] uppercase tracking-[0.3em] ${t.headerLabel} font-bold`}>Kariyer Modu</p>
            <h1 className={`text-2xl font-black italic tracking-tight ${t.headerTitle}`}>KARİYER KULÜBÜ ⚽</h1>
          </div>
          <div className="flex items-center gap-2">
            {player && phase !== "home" && phase !== "create" && phase !== "team-select" && (
              <>
                <button onClick={goHome} className={`${t.iconBtn} rounded-full p-2`}><Home className="w-4 h-4" /></button>
                <div className={`flex items-center gap-1 ${t.pill} rounded-full px-3 py-1.5`}>
                  <Coins className="w-4 h-4 text-amber-400" /><span className={`font-mono font-black text-sm ${t.pillText}`}>{coins}</span>
                </div>
              </>
            )}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`${t.iconBtn} rounded-full p-2`}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {phase === "home" && (
          <div className="space-y-4">
            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Ana Menü</p>
              {player ? (
                <>
                  <h2 className={`text-lg font-black mb-3 ${t.textMain}`}>Kaldığın yerden devam et</h2>
                  <PlayerCard name={name} number={squadNumber} position={POSITIONS[position].label} posKey={position} club={player.club} overall={overall} stats={player.stats} tier={`${tierLabel(player)} · Sezon ${seasonYear} · Yaş ${player.age}`} />
                  <div className="mt-4 space-y-2">
                    <Chunky t={t} onClick={() => setPhase(homeReturnPhase)} color="amber">Kariyere Devam Et <ChevronRight className="w-4 h-4" /></Chunky>
                    <Chunky t={t} onClick={resetGame} color="slate"><RotateCcw className="w-4 h-4" /> Yeni Kariyer Başlat</Chunky>
                  </div>
                </>
              ) : (
                <>
                  <h2 className={`text-lg font-black mb-3 ${t.textMain}`}>16 yaşında bir efsane yarat</h2>
                  <Chunky t={t} onClick={() => setPhase("create")} color="amber">Yeni Kariyer Başlat <ChevronRight className="w-4 h-4" /></Chunky>
                </>
              )}
            </Panel>

            <Panel t={t}>
              <button onClick={() => setShowHelp((v) => !v)} className={`w-full flex items-center justify-between text-xs uppercase tracking-widest ${t.label} font-bold`}>
                Nasıl Oynanır? <ChevronRight className={`w-4 h-4 transition-transform ${showHelp ? "rotate-90" : ""}`} />
              </button>
              {showHelp && (
                <ul className={`mt-3 space-y-1.5 text-sm ${t.textSub} list-disc list-inside`}>
                  <li>Önce takımını seç — gücüne uygun olmayan yüksek yıldızlı kulüplere hemen gidemezsin.</li>
                  <li>Her hafta önce antrenman yap, sonra maça çık.</li>
                  <li>Antrenman yoğunluğu arttıkça gelişim de sakatlık riski de artar.</li>
                  <li>Kaleci seçersen antrenman seçenekleri kaleciye özel isimlerle gelir.</li>
                  <li>Enerjin ve mutluluğun maç performansını doğrudan etkiler.</li>
                  <li>Sezon sonunda özel hayatına vakit ayır: dinlen, röportaj ver ya da biriyle buluş.</li>
                  <li>Ligde şampiyon ol, transfer teklifi al, milli takıma çağrıl.</li>
                  <li>35 yaşında emekli ol ve kariyer ünvanını öğren.</li>
                </ul>
              )}
            </Panel>
          </div>
        )}

        {phase === "create" && (
          <Panel t={t}>
            <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Yeni Kart Oluştur</p>
            <h2 className={`text-lg font-black mb-4 ${t.textMain}`}>16 yaşında kariyerine başla</h2>

            <label className={`block text-[11px] uppercase tracking-widest ${t.textFaint} font-bold mb-1`}>İsim</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn. Emre Yıldırım" className={`w-full ${t.input} rounded-xl px-3 py-2.5 mb-4 outline-none`} />

            <label className={`block text-[11px] uppercase tracking-widest ${t.textFaint} font-bold mb-1`}>Forma Numarası</label>
            <input type="number" min={1} max={99} value={squadNumber} onChange={(e) => setSquadNumber(clamp(parseInt(e.target.value) || 1, 1, 99))} className={`w-full ${t.input} rounded-xl px-3 py-2.5 mb-4 outline-none`} />

            <label className={`block text-[11px] uppercase tracking-widest ${t.textFaint} font-bold mb-2`}>Mevki</label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {Object.entries(POSITIONS).map(([key, p]) => {
                const Icon = p.icon; const active = position === key;
                return (
                  <button key={key} onClick={() => setPosition(key)} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border-2 text-sm font-black transition ${active ? t.btnActive : t.btnInactive}`}>
                    <Icon className="w-4 h-4" /> {p.label}
                  </button>
                );
              })}
            </div>
            {position === "GK" && (
              <p className={`text-[11px] ${t.textFaint} mb-4 -mt-3`}>Kaleci seçtin: antrenman seçeneklerin Çeviklik / Çıkış / Dağıtım / Refleks / Kurtarış / Fizik olarak gelecek.</p>
            )}
            <Chunky t={t} onClick={goToTeamSelect} disabled={!name.trim()} color="amber">Devam Et — Takım Seç <ChevronRight className="w-4 h-4" /></Chunky>
          </Panel>
        )}

        {phase === "team-select" && draftStats && (
          <Panel t={t}>
            <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Kulübünü Seç</p>
            <h2 className={`text-lg font-black mb-1 ${t.textMain}`}>{name} · {POSITIONS[position].label}</h2>
            <p className={`text-sm ${t.textFaint} mb-4`}>Başlangıç gücün: <b className={t.textSub}>{draftOverall}</b> overall. Sadece gücüne uygun yıldızdaki takımlara katılabilirsin.</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(COUNTRIES).map(([code, c]) => (
                <button key={code} onClick={() => { setSelectedCountry(code); setChosenTeam(null); }} className={`rounded-xl py-2 text-xs font-black border-2 transition ${selectedCountry === code ? t.btnActive : t.btnInactive}`}>{c.name}</button>
              ))}
            </div>

            <p className={`text-[11px] uppercase tracking-widest ${t.textFaint} font-bold mb-2`}>{tierData(selectedCountry, 0).name} Takımları</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {tierData(selectedCountry, 0).teams.map((tm) => {
                const locked = tm.stars > allowedStars(draftOverall);
                const active = chosenTeam && chosenTeam.name === tm.name;
                return (
                  <button key={tm.name} disabled={locked} onClick={() => setChosenTeam(tm)}
                    className={`flex flex-col items-start gap-1 rounded-xl px-3 py-2.5 border-2 text-left transition disabled:opacity-35 ${active ? "bg-amber-400/20 border-amber-500" : t.btnInactive}`}>
                    <span className={`text-xs font-black ${t.textMain}`}>{tm.name}</span>
                    <span className="flex items-center gap-1">
                      <StarRow count={tm.stars} />
                      {locked && <Lock className="w-3 h-3 text-red-400" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className={`text-[11px] ${t.textFaint} mb-4`}>Kilitli takımlar için önce sahada kendini kanıtlayıp gücünü artırman gerekiyor.</p>
            <Chunky t={t} onClick={confirmTeam} disabled={!chosenTeam} color="amber">Bu Takımla Başla <ChevronRight className="w-4 h-4" /></Chunky>
          </Panel>
        )}

        {phase === "youth" && player && (
          <div className="space-y-4">
            <PlayerCard name={name} number={squadNumber} position={POSITIONS[position].label} posKey={position} club={player.club} overall={overall} stats={player.stats} tier={`${tierLabel(player)} · Sezon ${seasonYear} · Yaş ${player.age}`} />
            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-2`}>Altyapı Sezonu</p>
              <p className={`text-sm ${t.textSub} mb-3`}>Henüz profesyonel değilsin. Bu sezon bir özelliğine odaklan.</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {STAT_KEYS.map((k) => (
                  <button key={k} onClick={() => setTrainingFocus(k)} className={`rounded-xl py-2 text-xs font-black border-2 transition ${trainingFocus === k ? "bg-amber-400 text-slate-950 border-amber-500" : t.btnInactive}`}>{trainLabel(k, position)}</button>
                ))}
              </div>
              <Chunky t={t} onClick={playYouthSeason} color="green">Sezonu Tamamla <ChevronRight className="w-4 h-4" /></Chunky>
            </Panel>
          </div>
        )}

        {phase === "training" && player && (
          <div className="space-y-4">
            <Panel t={t}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`text-xs uppercase tracking-widest ${t.label} font-bold`}>Hafta {currentRound}/{TOTAL_ROUNDS}</p>
                  <h2 className={`text-lg font-black ${t.textMain}`}>{player.club}</h2>
                </div>
                <FormChips log={matchLog} />
              </div>
              <div className={`flex items-center gap-2 text-sm ${t.textSub} ${t.panelAlt2} rounded-lg px-3 py-2`}>
                <CircleDot className="w-4 h-4 text-amber-400" /> Sıradaki rakip: <b className={t.textMain}>{fixtures[currentRound - 1]}</b>
              </div>
            </Panel>

            <Panel t={t}>
              <LifeBar icon={Battery} label="Enerji" value={life.enerji} grad="from-sky-500 to-cyan-400" t={t} />
              <LifeBar icon={Smile} label="Mutluluk" value={life.mutluluk} grad="from-rose-500 to-pink-400" t={t} />
            </Panel>

            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-3 flex items-center gap-1.5`}><Dumbbell className="w-3.5 h-3.5" /> Antrenman Odağı</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {STAT_KEYS.map((k) => (
                  <button key={k} onClick={() => setTrainingFocus(k)} className={`rounded-xl py-2 text-xs font-black border-2 transition ${trainingFocus === k ? "bg-amber-400 text-slate-950 border-amber-500" : t.btnInactive}`}>{trainLabel(k, position)}</button>
                ))}
              </div>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-3`}>Yoğunluk</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {Object.entries(INTENSITY).map(([key, cfg]) => {
                  const disabled = key === "yogun" && life.enerji < 20;
                  const active = intensity === key;
                  return (
                    <button key={key} disabled={disabled} onClick={() => setIntensity(key)} className={`rounded-xl py-2 px-1 text-xs font-black border-2 transition disabled:opacity-30 ${active ? "bg-rose-500/20 border-rose-500 text-rose-300" : t.btnInactive}`}>{cfg.label}</button>
                  );
                })}
              </div>
              <p className={`text-[11px] ${t.textFaint} mb-4`}>{INTENSITY[intensity].desc} · Enerji -{INTENSITY[intensity].energy}</p>
              <Chunky t={t} onClick={completeTraining} color="green">Antrenmanı Tamamla <ChevronRight className="w-4 h-4" /></Chunky>
            </Panel>

            {player.age >= 20 && <button onClick={() => setPhase("retired")} className={`w-full text-center text-[11px] uppercase tracking-widest ${t.textFaint} font-bold py-2`}>Erken emekli ol</button>}
          </div>
        )}

        {phase === "match" && player && (
          <div className="space-y-4">
            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Antrenman Sonucu</p>
              {trainingNote && (
                trainingNote.injured
                  ? <p className="text-sm text-red-400 font-semibold">Antrenmanda sakatlandın! Bu maçı kaçıracaksın.</p>
                  : <p className={`text-sm ${t.textSub}`}>{trainLabel(trainingNote.focus, position)} özelliğine <span className="text-emerald-400 font-bold">+{trainingNote.boost}</span> kazandırdın.</p>
              )}
            </Panel>
            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-2`}>Hafta {currentRound}/{TOTAL_ROUNDS} Maçı</p>
              <div className={`flex items-center justify-between ${t.panelAlt2} rounded-xl px-4 py-4 mb-4`}>
                <span className={`font-black ${t.textMain}`}>{player.club}</span>
                <span className={`text-xs ${t.textFaint}`}>vs</span>
                <span className={`font-black ${t.textMain}`}>{fixtures[currentRound - 1]}</span>
              </div>
              <Chunky t={t} onClick={playMatch} color="amber"><CircleDot className="w-4 h-4" /> Maça Çık</Chunky>
            </Panel>
          </div>
        )}

        {phase === "matchresult" && lastMatch && player && (
          <Panel t={t}>
            {lastMatch.skipped ? (
              <>
                <p className={`text-xs uppercase tracking-widest text-red-400 font-bold mb-2`}>Sakatlık</p>
                <p className={`text-sm ${t.textSub} mb-6`}>{fixtures[currentRound - 1]} maçında forma giyemedin.</p>
              </>
            ) : (
              <>
                <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Maç Sonucu</p>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-2xl font-black ${t.textMain}`}>{lastMatch.teamGoals} - {lastMatch.oppGoals}</span>
                  <span className={`text-sm font-black uppercase italic ${resultLabel[lastMatch.result][1]}`}>{resultLabel[lastMatch.result][0]}</span>
                </div>
                <p className={`text-sm ${t.textFaint} mb-4`}>{player.club} · {lastMatch.opponent} · {lastMatch.attendance.toLocaleString("tr-TR")} taraftar</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[["Gol", lastMatch.goals], ["Asist", lastMatch.assists], ["Puan", lastMatch.rating]].map(([l, v]) => (
                    <div key={l} className={`${t.scoreBox} rounded-xl py-2 text-center`}>
                      <span className="font-mono text-lg font-black text-amber-400">{v}</span>
                      <p className={`text-[9px] uppercase tracking-widest ${t.textFaint} font-bold`}>{l}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Chunky t={t} onClick={nextRound} color="amber">{currentRound >= TOTAL_ROUNDS ? "Sezonu Bitir" : "Devam Et"} <ChevronRight className="w-4 h-4" /></Chunky>
          </Panel>
        )}

        {phase === "offseason" && player && (
          <div className="space-y-4">
            <PlayerCard name={name} number={squadNumber} position={POSITIONS[position].label} posKey={position} club={player.club} overall={overall} stats={player.stats} tier={`${tierLabel(player)} · Sezon ${seasonYear} özeti`} />
            <Panel t={t}>
              <LifeBar icon={Battery} label="Enerji" value={life.enerji} grad="from-sky-500 to-cyan-400" t={t} />
              <LifeBar icon={Smile} label="Mutluluk" value={life.mutluluk} grad="from-rose-500 to-pink-400" t={t} />
              <LifeBar icon={Users} label="Popülerlik" value={life.populerlik} grad="from-purple-500 to-fuchsia-400" t={t} />
              <div className="mt-3"><RelationshipCard rel={relationship} t={t} /></div>
            </Panel>
            <Panel t={t}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-xs uppercase tracking-widest ${t.label} font-bold`}>Boost Paketi</p>
                <span className={`text-[11px] font-bold ${t.textFaint} flex items-center gap-1`}>{packCost} <Coins className="w-3 h-3 text-amber-400" /></span>
              </div>
              <Chunky t={t} onClick={buyPack} disabled={packUsed || coins < packCost} color="sky"><Gift className="w-4 h-4" /> {packUsed ? "Bu Sezon Kullanıldı" : "Paket Aç"}</Chunky>
            </Panel>
            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-3`}>Sezon Arasında Ne Yaparsın?</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {lifeOptions.map((o) => {
                  const Icon = o.icon; const active = lifeActivity === o.key;
                  return <button key={o.key} onClick={() => setLifeActivity(o.key)} className={`flex items-center gap-2 rounded-xl py-2 px-2.5 text-xs font-black border-2 transition ${active ? "bg-rose-500/20 border-rose-500 text-rose-300" : t.btnInactive}`}><Icon className="w-3.5 h-3.5" /> {o.label}</button>;
                })}
              </div>
              <Chunky t={t} onClick={finishSeason} color="amber">Sezonu Kapat <ChevronRight className="w-4 h-4" /></Chunky>
            </Panel>
          </div>
        )}

        {phase === "summary" && seasonResult && player && (
          <div className="space-y-4">
            <Panel t={t}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`text-xs uppercase tracking-widest ${t.label} font-bold`}>Sezon {seasonYear} Sonucu</p>
                  <h2 className={`text-lg font-black ${t.textMain}`}>{player.club} · Yaş {player.age}</h2>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/40 rounded-full px-2.5 py-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" /><span className="font-mono text-xs font-black text-amber-300">+{seasonResult.coinsEarned}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[["Maç", seasonResult.matches], ["Gol", seasonResult.goals], ["Asist", seasonResult.assists], ["Puan", seasonResult.avgRating]].map(([l, v]) => (
                  <div key={l} className={`${t.scoreBox} rounded-xl py-2 text-center`}><span className="font-mono text-lg font-black text-amber-400">{v}</span><p className={`text-[9px] uppercase tracking-widest ${t.textFaint} font-bold`}>{l}</p></div>
                ))}
              </div>

              <p className={`text-[11px] uppercase tracking-widest ${t.label} font-bold mb-1.5`}>Sezon Fikstürü</p>
              <div className="space-y-1 mb-3">
                {seasonResult.fixtures.map((m, i) => (
                  <div key={i} className={`flex items-center justify-between text-xs ${t.panelAlt2} rounded-lg px-3 py-1.5`}>
                    <span className={t.textSub}>{m.opponent}</span>
                    {m.skipped ? <span className="text-red-400 font-bold">Sakatlık</span> : <span className={`font-mono font-black ${resultLabel[m.result][1]}`}>{m.teamGoals}-{m.oppGoals}</span>}
                  </div>
                ))}
              </div>
              <p className={`text-[11px] ${t.textFaint} mb-3`}>Ayrıca lig genelinde {seasonResult.backgroundMatches} maça daha çıktın ({seasonResult.backgroundGoals} gol, {seasonResult.backgroundAssists} asist).</p>

              {seasonResult.messages.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {seasonResult.messages.map((m, i) => (
                    <div key={i} className={`flex items-start gap-2 text-sm ${t.panelAlt2} rounded-lg px-3 py-2 ${t.textSub}`}>
                      {m.includes("Kupa") || m.includes("şampiyon") ? <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> : m.includes("Milli") ? <Flag className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" /> : <Star className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              )}

              {seasonResult.lifeMsgs.length > 0 && (
                <>
                  <p className="text-[11px] uppercase tracking-widest text-rose-400 font-bold mb-1.5">Özel Hayat</p>
                  <div className="space-y-1.5 mb-3">
                    {seasonResult.lifeMsgs.map((m, i) => (
                      <div key={i} className={`flex items-start gap-2 text-sm bg-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-2 ${t.textSub}`}>
                        {m.includes("Bebeğiniz") ? <Baby className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" /> : m.includes("basın") || m.includes("sponsor") ? <Newspaper className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> : <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {seasonResult.leagueInfo && (
                <>
                  <p className={`text-[11px] uppercase tracking-widest ${t.label} font-bold mb-1.5`}>{tierData(player.country, player.tier).name} Puan Durumu</p>
                  <LeagueTableView table={seasonResult.leagueInfo.table} rank={seasonResult.leagueInfo.rank} t={t} />
                </>
              )}

              <p className={`text-[11px] uppercase tracking-widest ${t.label} font-bold mt-4 mb-2`}>Gelişim</p>
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {STAT_KEYS.map((k) => <StatPip key={k} label={trainLabel(k, position)} value={seasonResult.statsAfter[k]} delta={seasonResult.statsAfter[k] - seasonResult.statsBefore[k]} t={t} />)}
              </div>
              <Chunky t={t} onClick={continueFromSummary} color="amber">Devam Et <ChevronRight className="w-4 h-4" /></Chunky>
            </Panel>
          </div>
        )}

        {phase === "transfer" && offer && player && (
          <Panel t={t}>
            <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">Transfer Teklifi</p>
            <h2 className={`text-lg font-black ${t.textMain} mb-4`}>{offer.club} seni istiyor!</h2>
            <div className={`flex items-center justify-between ${t.panelAlt2} rounded-xl px-3 py-2.5 mb-2`}>
              <span className={`text-sm ${t.textFaint} font-bold`}>Mevcut</span><span className={`text-sm font-black ${t.textSub}`}>{player.club} · {tierData(player.country, player.tier).name}</span>
            </div>
            <div className="flex items-center justify-between bg-amber-500/10 border-2 border-amber-500/40 rounded-xl px-3 py-2.5 mb-2">
              <span className="text-sm text-amber-400 font-bold">Yeni Teklif</span><span className="text-sm font-black text-amber-300">{offer.club} · {tierData(player.country, offer.toTier).name}</span>
            </div>
            <div className="flex items-center gap-2 mb-4"><StarRow count={offer.stars} /><span className={`text-[11px] ${t.textFaint}`}>kulüp prestiji</span></div>
            <div className={`flex items-center gap-1.5 mb-6 text-sm ${t.textFaint} font-semibold`}>Yeni sezonluk ücret: {money(offer.wage)}</div>
            <div className="flex gap-3">
              <Chunky t={t} onClick={() => handleOffer(false)} color="slate">Reddet, Kal</Chunky>
              <Chunky t={t} onClick={() => handleOffer(true)} color="amber">Kabul Et</Chunky>
            </div>
          </Panel>
        )}

        {phase === "retired" && player && (() => {
          const hof = hallOfFame(career);
          return (
            <div className="space-y-4">
              <Panel t={t}>
                <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Kariyer Tamamlandı</p>
                <h2 className={`text-xl font-black ${t.textMain} mb-1`}>{name}</h2>
                <p className={`text-sm ${t.textFaint} mb-4`}>{POSITIONS[position].label} · Emeklilik yaşı {player.age}</p>
                <div className={`text-center py-4 mb-4 rounded-2xl ${hof.chip}`}>
                  <p className="text-2xl font-black tracking-wide text-white">{hof.label}</p>
                  <p className="text-xs text-white/80 mt-1">{hof.note}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[["Toplam Maç", career.matches], ["Toplam Gol", career.goals], ["Toplam Asist", career.assists], ["Milli Maç", career.caps]].map(([l, v]) => (
                    <div key={l} className={`${t.scoreBox} rounded-xl py-2.5 text-center`}><span className="font-mono text-xl font-black text-amber-400">{v}</span><p className={`text-[9px] uppercase tracking-widest ${t.textFaint} font-bold`}>{l}</p></div>
                  ))}
                </div>
                <div className={`flex items-center justify-between text-sm ${t.panelAlt2} rounded-lg px-3 py-2 mb-2 font-semibold ${t.textSub}`}><span>Zirve Rating</span><span className="font-mono text-amber-400 font-black">{career.peakOverall}</span></div>
                <div className={`flex items-center justify-between text-sm ${t.panelAlt2} rounded-lg px-3 py-2 font-semibold ${t.textSub}`}><span>Milli Takım Golü</span><span className="font-mono text-amber-400 font-black">{career.natGoals}</span></div>
              </Panel>
              <Panel t={t}><p className="text-xs uppercase tracking-widest text-rose-400 font-bold mb-3">Özel Hayat</p><RelationshipCard rel={relationship} t={t} /></Panel>
              <Panel t={t}>
                <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-3`}>Kupa Dolabı</p>
                {career.trophies.length === 0 ? <p className={`text-sm ${t.textFaint}`}>Kariyerinde kupa kazanamadın.</p> : (
                  <div className="space-y-2">
                    {career.trophies.map((tr, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm ${t.panelAlt2} rounded-lg px-3 py-2`}>
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" /><span className={`${t.textSub} font-semibold`}>{tr.name}</span><span className={`${t.textFaint} ml-auto text-xs`}>Sezon {tr.year} · {tr.club}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
              <Chunky t={t} onClick={resetGame} color="amber"><RotateCcw className="w-4 h-4" /> Yeniden Başla</Chunky>
            </div>
          );
        })()}

        <footer className={`text-center text-[10px] ${t.footer} mt-8 tracking-widest uppercase font-bold`}>Kariyer Kulübü · Sanal Simülasyon</footer>
      </div>
    </div>
  );
}
