import React, { useState, useEffect } from "react";
import {
  Trophy, Star, Zap, Target, Shield, Activity, ChevronRight, RotateCcw,
  Flag, HeartPulse, Coins, Gift, Medal, Battery, Smile, Users,
  Mic, Moon, PartyPopper, Newspaper, Home, Sun, Dumbbell, CircleDot, Lock, Palette, Wallet
} from "lucide-react";

// ---------- Data ----------
const STAT_LABELS = { hiz: "HIZ", sut: "ŞUT", pas: "PAS", dribbling: "DRB", defans: "DEF", fizik: "FZK" };
const GK_LABELS = { hiz: "ÇEVİKLİK", sut: "ÇIKIŞ", pas: "DAĞITIM", dribbling: "REFLEKS", defans: "KURTARIŞ", fizik: "FZK" };
const STAT_KEYS = Object.keys(STAT_LABELS);
const TOTAL_ROUNDS = 6;
const SEASON_WEEKS = 34; // her ligin gerçek sezon uzunluğu — puan tablosu buna göre ölçeklenir

const POSITIONS = {
  FW: { label: "Forvet", icon: Target, weights: { hiz: .2, sut: .35, pas: .1, dribbling: .2, defans: .05, fizik: .1 }, goalFactor: .45, assistFactor: .15 },
  MF: { label: "Orta Saha", icon: Zap, weights: { hiz: .15, sut: .15, pas: .3, dribbling: .2, defans: .1, fizik: .1 }, goalFactor: .18, assistFactor: .3 },
  DF: { label: "Defans", icon: Shield, weights: { hiz: .15, sut: .05, pas: .15, dribbling: .1, defans: .4, fizik: .15 }, goalFactor: .05, assistFactor: .1 },
  GK: { label: "Kaleci", icon: Activity, weights: { hiz: .05, sut: .05, pas: .1, dribbling: .05, defans: .55, fizik: .2 }, goalFactor: .01, assistFactor: .02 },
};

// Ülke / lig / takım veri seti — 2026-27 sezonuna göre güncel takımlar ve gerçek lig boyutları.
const COUNTRIES = {
  TR: {
    name: "Türkiye",
    tiers: [
      {
        name: "Trendyol 1. Lig", wageBase: 3000,
        teams: [
          { name: "Antalyaspor", stars: 3 }, { name: "Kayserispor", stars: 3 }, { name: "Fatih Karagümrük", stars: 3 }, { name: "Bursaspor", stars: 3 },
          { name: "Boluspor", stars: 2 }, { name: "Manisa FK", stars: 2 }, { name: "Sivasspor", stars: 2 }, { name: "Pendikspor", stars: 2 },
          { name: "İstanbulspor", stars: 2 }, { name: "Ümraniyespor", stars: 2 }, { name: "Bandırmaspor", stars: 2 }, { name: "Sarıyer", stars: 2 },
          { name: "Keçiörengücü", stars: 2 }, { name: "Bodrum FK", stars: 2 }, { name: "Vanspor FK", stars: 2 }, { name: "Iğdır FK", stars: 2 },
          { name: "Batman Petrolspor", stars: 2 }, { name: "Mardin 1969 Spor", stars: 2 }, { name: "Muğlaspor", stars: 2 },
        ],
      },
      {
        name: "Trendyol Süper Lig", wageBase: 40000,
        teams: [
          { name: "Galatasaray", stars: 5 }, { name: "Fenerbahçe", stars: 5 }, { name: "Beşiktaş", stars: 4 }, { name: "Trabzonspor", stars: 4 },
          { name: "Başakşehir", stars: 3 }, { name: "Samsunspor", stars: 3 }, { name: "Göztepe", stars: 3 },
          { name: "Konyaspor", stars: 2 }, { name: "Kasımpaşa", stars: 2 }, { name: "Eyüpspor", stars: 2 }, { name: "Çaykur Rizespor", stars: 2 },
          { name: "Kocaelispor", stars: 2 }, { name: "Alanyaspor", stars: 2 }, { name: "Gaziantep FK", stars: 2 }, { name: "Gençlerbirliği", stars: 2 },
          { name: "Erzurumspor FK", stars: 2 }, { name: "Amed Sportif Faaliyetler", stars: 2 }, { name: "Çorum FK", stars: 2 },
        ],
      },
    ],
  },
  EN: {
    name: "İngiltere",
    tiers: [
      {
        name: "EFL Championship", wageBase: 5000,
        teams: [
          { name: "West Ham United", stars: 4 }, { name: "Wolverhampton Wanderers", stars: 4 },
          { name: "Burnley", stars: 3 }, { name: "Sheffield United", stars: 3 }, { name: "Middlesbrough", stars: 3 }, { name: "West Bromwich Albion", stars: 3 },
          { name: "Norwich City", stars: 3 }, { name: "Southampton", stars: 3 },
          { name: "Birmingham City", stars: 2 }, { name: "Queens Park Rangers", stars: 2 }, { name: "Bristol City", stars: 2 }, { name: "Derby County", stars: 2 },
          { name: "Stoke City", stars: 2 }, { name: "Cardiff City", stars: 2 }, { name: "Millwall", stars: 2 }, { name: "Lincoln City", stars: 2 },
          { name: "Portsmouth", stars: 2 }, { name: "Bolton Wanderers", stars: 2 }, { name: "Swansea City", stars: 2 }, { name: "Watford", stars: 2 },
          { name: "Charlton Athletic", stars: 2 }, { name: "Blackburn Rovers", stars: 2 }, { name: "Wrexham", stars: 2 }, { name: "Preston North End", stars: 2 },
        ],
      },
      {
        name: "Premier League", wageBase: 90000,
        teams: [
          { name: "Manchester City", stars: 5 }, { name: "Arsenal", stars: 5 }, { name: "Liverpool", stars: 5 }, { name: "Manchester United", stars: 5 },
          { name: "Chelsea", stars: 4 }, { name: "Tottenham", stars: 4 }, { name: "Newcastle United", stars: 4 },
          { name: "Aston Villa", stars: 3 }, { name: "Brighton", stars: 3 }, { name: "Leeds United", stars: 3 },
          { name: "Everton", stars: 2 }, { name: "Crystal Palace", stars: 2 }, { name: "Fulham", stars: 2 }, { name: "Bournemouth", stars: 2 },
          { name: "Brentford", stars: 2 }, { name: "Nottingham Forest", stars: 2 }, { name: "Sunderland", stars: 2 }, { name: "Coventry City", stars: 2 }, { name: "Ipswich Town", stars: 2 }, { name: "Hull City", stars: 2 },
        ],
      },
    ],
  },
  ES: {
    name: "İspanya",
    tiers: [
      {
        name: "LaLiga Hypermotion", wageBase: 4500,
        teams: [
          { name: "Real Oviedo", stars: 3 }, { name: "Girona", stars: 3 }, { name: "Mallorca", stars: 3 }, { name: "Las Palmas", stars: 3 }, { name: "Sporting Gijón", stars: 3 },
          { name: "Córdoba", stars: 2 }, { name: "Cádiz", stars: 2 }, { name: "Granada", stars: 2 }, { name: "Real Valladolid", stars: 2 }, { name: "Albacete", stars: 2 },
          { name: "Leganés", stars: 2 }, { name: "Eibar", stars: 2 }, { name: "Castellón", stars: 2 }, { name: "Almería", stars: 2 }, { name: "Burgos", stars: 2 },
          { name: "Ceuta", stars: 2 }, { name: "FC Andorra", stars: 2 }, { name: "Real Sociedad B", stars: 2 }, { name: "Tenerife", stars: 2 }, { name: "Eldense", stars: 2 },
          { name: "Sabadell", stars: 2 }, { name: "Celta Fortuna", stars: 1 },
        ],
      },
      {
        name: "LaLiga EA Sports", wageBase: 85000,
        teams: [
          { name: "Real Madrid", stars: 5 }, { name: "Barcelona", stars: 5 }, { name: "Atlético Madrid", stars: 5 },
          { name: "Villarreal", stars: 4 }, { name: "Athletic Bilbao", stars: 4 }, { name: "Real Sociedad", stars: 4 },
          { name: "Real Betis", stars: 3 }, { name: "Celta Vigo", stars: 3 }, { name: "Sevilla", stars: 3 }, { name: "Valencia", stars: 3 },
          { name: "Deportivo La Coruña", stars: 3 }, { name: "Málaga", stars: 3 },
          { name: "Getafe", stars: 2 }, { name: "Osasuna", stars: 2 }, { name: "Rayo Vallecano", stars: 2 }, { name: "Espanyol", stars: 2 },
          { name: "Elche", stars: 2 }, { name: "Deportivo Alavés", stars: 2 }, { name: "Levante", stars: 2 }, { name: "Racing de Santander", stars: 2 },
        ],
      },
    ],
  },
};

const INTENSITY = {
  hafif: { label: "Hafif", boost: [0, 1], energy: 3, risk: 0, desc: "Düşük risk, az gelişim" },
  orta: { label: "Orta", boost: [1, 2], energy: 8, risk: 0.02, desc: "Dengeli gelişim" },
  yogun: { label: "Yoğun", boost: [2, 4], energy: 15, risk: 0.06, desc: "Yüksek gelişim, sakatlık riski" },
};

const ENERGY_DRINKS = [
  { name: "Küçük İçecek", cost: 40, energy: 20 },
  { name: "Orta İçecek", cost: 60, energy: 40 },
  { name: "Büyük İçecek", cost: 80, energy: 60 },
  { name: "Mega İçecek", cost: 100, energy: 100 },
];

// ---------- Theme tokens ----------
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

const ACCENT_NAMES = {
  rose: "Gül", pink: "Pembe", fuchsia: "Fuşya", purple: "Mor", violet: "Menekşe",
  indigo: "Çivit", blue: "Mavi", sky: "Gök Mavisi", cyan: "Camgöbeği", teal: "Turkuaz",
  emerald: "Zümrüt", green: "Yeşil", lime: "Fıstık Yeşili", yellow: "Sarı", amber: "Kehribar",
  orange: "Turuncu", red: "Kırmızı", stone: "Taş Grisi", zinc: "Çinko Grisi", slate: "Arduvaz",
};

const SWATCH = {
  rose: "bg-rose-400", pink: "bg-pink-400", fuchsia: "bg-fuchsia-400", purple: "bg-purple-400", violet: "bg-violet-400",
  indigo: "bg-indigo-400", blue: "bg-blue-400", sky: "bg-sky-400", cyan: "bg-cyan-400", teal: "bg-teal-400",
  emerald: "bg-emerald-400", green: "bg-green-400", lime: "bg-lime-400", yellow: "bg-yellow-400", amber: "bg-amber-400",
  orange: "bg-orange-400", red: "bg-red-400", stone: "bg-stone-400", zinc: "bg-zinc-400", slate: "bg-slate-400",
};

const ACCENTS = {
  rose: {
    dark: { label: "text-rose-400", active: "bg-rose-500/20 border-rose-500 text-rose-300", rowPlayer: "bg-rose-500/10 border border-rose-500/50", offerBox: "bg-rose-500/10 border-2 border-rose-500/40", blob: "bg-rose-600/20" },
    light: { label: "text-rose-600", active: "bg-rose-50 border-rose-500 text-rose-700", rowPlayer: "bg-rose-50 border border-rose-400", offerBox: "bg-rose-50 border-2 border-rose-300", blob: "bg-rose-300/30" },
    btn: "bg-rose-400 border-rose-700 text-slate-950", selected: "bg-rose-400 text-slate-950 border-rose-500",
  },
  pink: {
    dark: { label: "text-pink-400", active: "bg-pink-500/20 border-pink-500 text-pink-300", rowPlayer: "bg-pink-500/10 border border-pink-500/50", offerBox: "bg-pink-500/10 border-2 border-pink-500/40", blob: "bg-pink-600/20" },
    light: { label: "text-pink-600", active: "bg-pink-50 border-pink-500 text-pink-700", rowPlayer: "bg-pink-50 border border-pink-400", offerBox: "bg-pink-50 border-2 border-pink-300", blob: "bg-pink-300/30" },
    btn: "bg-pink-400 border-pink-700 text-slate-950", selected: "bg-pink-400 text-slate-950 border-pink-500",
  },
  fuchsia: {
    dark: { label: "text-fuchsia-400", active: "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300", rowPlayer: "bg-fuchsia-500/10 border border-fuchsia-500/50", offerBox: "bg-fuchsia-500/10 border-2 border-fuchsia-500/40", blob: "bg-fuchsia-600/20" },
    light: { label: "text-fuchsia-600", active: "bg-fuchsia-50 border-fuchsia-500 text-fuchsia-700", rowPlayer: "bg-fuchsia-50 border border-fuchsia-400", offerBox: "bg-fuchsia-50 border-2 border-fuchsia-300", blob: "bg-fuchsia-300/30" },
    btn: "bg-fuchsia-400 border-fuchsia-700 text-slate-950", selected: "bg-fuchsia-400 text-slate-950 border-fuchsia-500",
  },
  purple: {
    dark: { label: "text-purple-400", active: "bg-purple-500/20 border-purple-500 text-purple-300", rowPlayer: "bg-purple-500/10 border border-purple-500/50", offerBox: "bg-purple-500/10 border-2 border-purple-500/40", blob: "bg-purple-600/20" },
    light: { label: "text-purple-600", active: "bg-purple-50 border-purple-500 text-purple-700", rowPlayer: "bg-purple-50 border border-purple-400", offerBox: "bg-purple-50 border-2 border-purple-300", blob: "bg-purple-300/30" },
    btn: "bg-purple-400 border-purple-700 text-slate-950", selected: "bg-purple-400 text-slate-950 border-purple-500",
  },
  violet: {
    dark: { label: "text-violet-400", active: "bg-violet-500/20 border-violet-500 text-violet-300", rowPlayer: "bg-violet-500/10 border border-violet-500/50", offerBox: "bg-violet-500/10 border-2 border-violet-500/40", blob: "bg-violet-600/20" },
    light: { label: "text-violet-600", active: "bg-violet-50 border-violet-500 text-violet-700", rowPlayer: "bg-violet-50 border border-violet-400", offerBox: "bg-violet-50 border-2 border-violet-300", blob: "bg-violet-300/30" },
    btn: "bg-violet-400 border-violet-700 text-slate-950", selected: "bg-violet-400 text-slate-950 border-violet-500",
  },
  indigo: {
    dark: { label: "text-indigo-400", active: "bg-indigo-500/20 border-indigo-500 text-indigo-300", rowPlayer: "bg-indigo-500/10 border border-indigo-500/50", offerBox: "bg-indigo-500/10 border-2 border-indigo-500/40", blob: "bg-indigo-600/20" },
    light: { label: "text-indigo-600", active: "bg-indigo-50 border-indigo-500 text-indigo-700", rowPlayer: "bg-indigo-50 border border-indigo-400", offerBox: "bg-indigo-50 border-2 border-indigo-300", blob: "bg-indigo-300/30" },
    btn: "bg-indigo-400 border-indigo-700 text-slate-950", selected: "bg-indigo-400 text-slate-950 border-indigo-500",
  },
  blue: {
    dark: { label: "text-blue-400", active: "bg-blue-500/20 border-blue-500 text-blue-300", rowPlayer: "bg-blue-500/10 border border-blue-500/50", offerBox: "bg-blue-500/10 border-2 border-blue-500/40", blob: "bg-blue-600/20" },
    light: { label: "text-blue-600", active: "bg-blue-50 border-blue-500 text-blue-700", rowPlayer: "bg-blue-50 border border-blue-400", offerBox: "bg-blue-50 border-2 border-blue-300", blob: "bg-blue-300/30" },
    btn: "bg-blue-400 border-blue-700 text-slate-950", selected: "bg-blue-400 text-slate-950 border-blue-500",
  },
  sky: {
    dark: { label: "text-sky-400", active: "bg-sky-500/20 border-sky-500 text-sky-300", rowPlayer: "bg-sky-500/10 border border-sky-500/50", offerBox: "bg-sky-500/10 border-2 border-sky-500/40", blob: "bg-sky-600/20" },
    light: { label: "text-sky-600", active: "bg-sky-50 border-sky-500 text-sky-700", rowPlayer: "bg-sky-50 border border-sky-400", offerBox: "bg-sky-50 border-2 border-sky-300", blob: "bg-sky-300/30" },
    btn: "bg-sky-400 border-sky-700 text-slate-950", selected: "bg-sky-400 text-slate-950 border-sky-500",
  },
  cyan: {
    dark: { label: "text-cyan-400", active: "bg-cyan-500/20 border-cyan-500 text-cyan-300", rowPlayer: "bg-cyan-500/10 border border-cyan-500/50", offerBox: "bg-cyan-500/10 border-2 border-cyan-500/40", blob: "bg-cyan-600/20" },
    light: { label: "text-cyan-600", active: "bg-cyan-50 border-cyan-500 text-cyan-700", rowPlayer: "bg-cyan-50 border border-cyan-400", offerBox: "bg-cyan-50 border-2 border-cyan-300", blob: "bg-cyan-300/30" },
    btn: "bg-cyan-400 border-cyan-700 text-slate-950", selected: "bg-cyan-400 text-slate-950 border-cyan-500",
  },
  teal: {
    dark: { label: "text-teal-400", active: "bg-teal-500/20 border-teal-500 text-teal-300", rowPlayer: "bg-teal-500/10 border border-teal-500/50", offerBox: "bg-teal-500/10 border-2 border-teal-500/40", blob: "bg-teal-600/20" },
    light: { label: "text-teal-600", active: "bg-teal-50 border-teal-500 text-teal-700", rowPlayer: "bg-teal-50 border border-teal-400", offerBox: "bg-teal-50 border-2 border-teal-300", blob: "bg-teal-300/30" },
    btn: "bg-teal-400 border-teal-700 text-slate-950", selected: "bg-teal-400 text-slate-950 border-teal-500",
  },
  emerald: {
    dark: { label: "text-emerald-400", active: "bg-emerald-500/20 border-emerald-500 text-emerald-300", rowPlayer: "bg-emerald-500/10 border border-emerald-500/50", offerBox: "bg-emerald-500/10 border-2 border-emerald-500/40", blob: "bg-emerald-600/20" },
    light: { label: "text-emerald-600", active: "bg-emerald-50 border-emerald-500 text-emerald-700", rowPlayer: "bg-emerald-50 border border-emerald-400", offerBox: "bg-emerald-50 border-2 border-emerald-300", blob: "bg-emerald-300/30" },
    btn: "bg-emerald-400 border-emerald-700 text-slate-950", selected: "bg-emerald-400 text-slate-950 border-emerald-500",
  },
  green: {
    dark: { label: "text-green-400", active: "bg-green-500/20 border-green-500 text-green-300", rowPlayer: "bg-green-500/10 border border-green-500/50", offerBox: "bg-green-500/10 border-2 border-green-500/40", blob: "bg-green-600/20" },
    light: { label: "text-green-600", active: "bg-green-50 border-green-500 text-green-700", rowPlayer: "bg-green-50 border border-green-400", offerBox: "bg-green-50 border-2 border-green-300", blob: "bg-green-300/30" },
    btn: "bg-green-400 border-green-700 text-slate-950", selected: "bg-green-400 text-slate-950 border-green-500",
  },
  lime: {
    dark: { label: "text-lime-400", active: "bg-lime-500/20 border-lime-500 text-lime-300", rowPlayer: "bg-lime-500/10 border border-lime-500/50", offerBox: "bg-lime-500/10 border-2 border-lime-500/40", blob: "bg-lime-600/20" },
    light: { label: "text-lime-600", active: "bg-lime-50 border-lime-500 text-lime-700", rowPlayer: "bg-lime-50 border border-lime-400", offerBox: "bg-lime-50 border-2 border-lime-300", blob: "bg-lime-300/30" },
    btn: "bg-lime-400 border-lime-700 text-slate-950", selected: "bg-lime-400 text-slate-950 border-lime-500",
  },
  yellow: {
    dark: { label: "text-yellow-400", active: "bg-yellow-500/20 border-yellow-500 text-yellow-300", rowPlayer: "bg-yellow-500/10 border border-yellow-500/50", offerBox: "bg-yellow-500/10 border-2 border-yellow-500/40", blob: "bg-yellow-600/20" },
    light: { label: "text-yellow-600", active: "bg-yellow-50 border-yellow-500 text-yellow-700", rowPlayer: "bg-yellow-50 border border-yellow-400", offerBox: "bg-yellow-50 border-2 border-yellow-300", blob: "bg-yellow-300/30" },
    btn: "bg-yellow-400 border-yellow-700 text-slate-950", selected: "bg-yellow-400 text-slate-950 border-yellow-500",
  },
  amber: {
    dark: { label: "text-amber-400", active: "bg-amber-500/20 border-amber-500 text-amber-300", rowPlayer: "bg-amber-500/10 border border-amber-500/50", offerBox: "bg-amber-500/10 border-2 border-amber-500/40", blob: "bg-amber-600/20" },
    light: { label: "text-amber-600", active: "bg-amber-50 border-amber-500 text-amber-700", rowPlayer: "bg-amber-50 border border-amber-400", offerBox: "bg-amber-50 border-2 border-amber-300", blob: "bg-amber-300/30" },
    btn: "bg-amber-400 border-amber-700 text-slate-950", selected: "bg-amber-400 text-slate-950 border-amber-500",
  },
  orange: {
    dark: { label: "text-orange-400", active: "bg-orange-500/20 border-orange-500 text-orange-300", rowPlayer: "bg-orange-500/10 border border-orange-500/50", offerBox: "bg-orange-500/10 border-2 border-orange-500/40", blob: "bg-orange-600/20" },
    light: { label: "text-orange-600", active: "bg-orange-50 border-orange-500 text-orange-700", rowPlayer: "bg-orange-50 border border-orange-400", offerBox: "bg-orange-50 border-2 border-orange-300", blob: "bg-orange-300/30" },
    btn: "bg-orange-400 border-orange-700 text-slate-950", selected: "bg-orange-400 text-slate-950 border-orange-500",
  },
  red: {
    dark: { label: "text-red-400", active: "bg-red-500/20 border-red-500 text-red-300", rowPlayer: "bg-red-500/10 border border-red-500/50", offerBox: "bg-red-500/10 border-2 border-red-500/40", blob: "bg-red-600/20" },
    light: { label: "text-red-600", active: "bg-red-50 border-red-500 text-red-700", rowPlayer: "bg-red-50 border border-red-400", offerBox: "bg-red-50 border-2 border-red-300", blob: "bg-red-300/30" },
    btn: "bg-red-400 border-red-700 text-slate-950", selected: "bg-red-400 text-slate-950 border-red-500",
  },
  stone: {
    dark: { label: "text-stone-400", active: "bg-stone-500/20 border-stone-500 text-stone-300", rowPlayer: "bg-stone-500/10 border border-stone-500/50", offerBox: "bg-stone-500/10 border-2 border-stone-500/40", blob: "bg-stone-600/20" },
    light: { label: "text-stone-600", active: "bg-stone-50 border-stone-500 text-stone-700", rowPlayer: "bg-stone-50 border border-stone-400", offerBox: "bg-stone-50 border-2 border-stone-300", blob: "bg-stone-300/30" },
    btn: "bg-stone-400 border-stone-700 text-slate-950", selected: "bg-stone-400 text-slate-950 border-stone-500",
  },
  zinc: {
    dark: { label: "text-zinc-400", active: "bg-zinc-500/20 border-zinc-500 text-zinc-300", rowPlayer: "bg-zinc-500/10 border border-zinc-500/50", offerBox: "bg-zinc-500/10 border-2 border-zinc-500/40", blob: "bg-zinc-600/20" },
    light: { label: "text-zinc-600", active: "bg-zinc-50 border-zinc-500 text-zinc-700", rowPlayer: "bg-zinc-50 border border-zinc-400", offerBox: "bg-zinc-50 border-2 border-zinc-300", blob: "bg-zinc-300/30" },
    btn: "bg-zinc-400 border-zinc-700 text-slate-950", selected: "bg-zinc-400 text-slate-950 border-zinc-500",
  },
  slate: {
    dark: { label: "text-slate-400", active: "bg-slate-500/20 border-slate-500 text-slate-300", rowPlayer: "bg-slate-500/10 border border-slate-500/50", offerBox: "bg-slate-500/10 border-2 border-slate-500/40", blob: "bg-slate-600/20" },
    light: { label: "text-slate-600", active: "bg-slate-50 border-slate-500 text-slate-700", rowPlayer: "bg-slate-50 border border-slate-400", offerBox: "bg-slate-50 border-2 border-slate-300", blob: "bg-slate-300/30" },
    btn: "bg-slate-400 border-slate-700 text-slate-950", selected: "bg-slate-400 text-slate-950 border-slate-500",
  },
};

// ---------- Helpers ----------
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

// Bir oyuncunun gücüne göre gidebileceği en yüksek takım yıldızı.
// Genç / güçsüz oyuncular direkt 5 yıldızlı devlere gidemesin diye.
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
    .map((tm) => ({ name: tm.name, points: clamp(Math.round(SEASON_WEEKS * (0.55 + tm.stars * 0.35) * randFloat(0.85, 1.15)), 0, SEASON_WEEKS * 3) }));
  const table = [...rivals, { name: playerClub, points: clamp(playerPoints, 0, SEASON_WEEKS * 3), isPlayer: true }];
  table.sort((a, b) => b.points - a.points);
  const rank = table.findIndex((t) => t.isPlayer) + 1;
  return { table, rank };
}
function applyLifeActivity(key, life) {
  let L = { ...life }; const msgs = [];
  if (key === "rest") {
    L.enerji = clamp(L.enerji + 25, 0, 100); L.mutluluk = clamp(L.mutluluk + 5, 0, 100);
    msgs.push("Sezon arasında iyi dinlendin, enerjin yerine geldi.");
  } else if (key === "party") {
    L.mutluluk = clamp(L.mutluluk + 15, 0, 100); L.populerlik = clamp(L.populerlik + 8, 0, 100); L.enerji = clamp(L.enerji - 20, 0, 100);
    msgs.push("Gece hayatının tadını çıkardın, popülerliğin arttı.");
    if (Math.random() < 0.15) {
      L.mutluluk = clamp(L.mutluluk - 20, 0, 100);
      msgs.push("Magazin basını gece hayatını manşete taşıdı, imajın zedelendi.");
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
  }
  return { life: L, msgs };
}

// ---------- Small UI pieces ----------
function Chunky({ children, onClick, disabled, color = "amber", t, className = "" }) {
  const palette = {
    amber: t.chunkyAccent,
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
function PlayerCard({ name, number, position, club, overall, stats, tier, posKey, value }) {
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
          {value != null && <p className={`text-[10px] font-black ${ct.text} opacity-90 mb-1`}>Değer: {shortMoney(value)}</p>}
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
function shortMoney(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0", "") + "M ₺";
  if (n >= 1000) return Math.round(n / 1000) + "K ₺";
  return n + " ₺";
}
function ageValueFactor(age) {
  if (age <= 20) return 0.8 + (age - 16) * 0.05;
  if (age <= 27) return 1.2;
  if (age <= 30) return 1.0;
  if (age <= 33) return 0.6;
  return 0.3;
}
function computeMarketValue(overall, age) {
  const base = Math.pow(Math.max(overall - 25, 1), 2) * 800;
  return Math.round((base * ageValueFactor(age)) / 1000) * 1000;
}
function generateContract(clubStars) {
  return { goalBonus: randInt(5, 10 + clubStars * 4), assistBonus: randInt(3, 6 + clubStars * 2) };
}
function makeOffer(country, toTier, target, overall, age) {
  const val = computeMarketValue(overall, age);
  const wage = Math.round(tierData(country, toTier).wageBase * (1 + (overall - 50) / 100));
  const signingBonus = Math.round(val * randFloat(0.05, 0.15));
  const contract = generateContract(target.stars);
  return { country, toTier, club: target.name, stars: target.stars, wage, marketValue: val, signingBonus, contract };
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

// ---------- Main component ----------
export default function FutbolcuKariyeri() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("kk-theme") || "dark"; } catch { return "dark"; }
  });
  const [accent, setAccent] = useState(() => {
    try { return localStorage.getItem("kk-accent") || "amber"; } catch { return "amber"; }
  });
  function chooseTheme(next) {
    setTheme(next);
    try { localStorage.setItem("kk-theme", next); } catch {}
  }
  function chooseAccent(next) {
    setAccent(next);
    try { localStorage.setItem("kk-accent", next); } catch {}
  }
  const a = ACCENTS[accent] || ACCENTS.amber;
  const aMode = a[theme];
  const t = {
    ...(theme === "dark" ? DARK : LIGHT),
    label: aMode.label, headerLabel: aMode.label,
    btnActive: aMode.active, tableRowPlayer: aMode.rowPlayer,
    blob1: aMode.blob, blob2: aMode.blob,
    offerBox: aMode.offerBox, chunkyAccent: a.btn, chunkySelected: a.selected,
  };

  // ---- Kayıtlı kariyer: sayfadan çıkılsa/yenilense bile kariyer kaybolmasın ----
  const SAVE_KEY = "kk-save";
  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  const save0 = readSave();
  const sv = (key, fallback) => (save0 && save0[key] !== undefined ? save0[key] : fallback);

  const [phase, setPhase] = useState(() => sv("phase", "home"));
  const [homeReturnPhase, setHomeReturnPhase] = useState(() => sv("homeReturnPhase", "youth"));
  const [showHelp, setShowHelp] = useState(false);

  const [name, setName] = useState(() => sv("name", ""));
  const [position, setPosition] = useState(() => sv("position", "FW"));
  const [squadNumber, setSquadNumber] = useState(() => sv("squadNumber", 9));
  const [player, setPlayer] = useState(() => sv("player", null));
  const [career, setCareer] = useState(() => sv("career", { goals: 0, assists: 0, matches: 0, trophies: [], caps: 0, natGoals: 0, peakOverall: 0 }));
  const [seasonYear, setSeasonYear] = useState(() => sv("seasonYear", 1));
  const [wallet, setWallet] = useState(() => sv("wallet", 0));

  // Takım seçim ekranı için taslak veriler
  const [draftStats, setDraftStats] = useState(() => sv("draftStats", null));
  const [draftOverall, setDraftOverall] = useState(() => sv("draftOverall", 0));
  const [selectedCountry, setSelectedCountry] = useState(() => sv("selectedCountry", "TR"));
  const [chosenTeam, setChosenTeam] = useState(() => sv("chosenTeam", null));

  const [trainingFocus, setTrainingFocus] = useState(() => sv("trainingFocus", "sut"));
  const [intensity, setIntensity] = useState(() => sv("intensity", "orta"));
  const [lifeActivity, setLifeActivity] = useState(() => sv("lifeActivity", "rest"));
  const [life, setLife] = useState(() => sv("life", { enerji: 100, mutluluk: 65, populerlik: 5 }));
  const [sponsorFlags, setSponsorFlags] = useState(() => sv("sponsorFlags", [false, false, false]));
  const [coins, setCoins] = useState(() => sv("coins", 0));
  const [packUsed, setPackUsed] = useState(() => sv("packUsed", false));

  const [fixtures, setFixtures] = useState(() => sv("fixtures", []));
  const [currentRound, setCurrentRound] = useState(() => sv("currentRound", 1));
  const [matchLog, setMatchLog] = useState(() => sv("matchLog", []));
  const [roundInjured, setRoundInjured] = useState(() => sv("roundInjured", false));
  const [trainingNote, setTrainingNote] = useState(() => sv("trainingNote", null));
  const [lastMatch, setLastMatch] = useState(() => sv("lastMatch", null));
  const [seasonStatsBefore, setSeasonStatsBefore] = useState(() => sv("seasonStatsBefore", null));
  const [seasonResult, setSeasonResult] = useState(() => sv("seasonResult", null));
  const [offer, setOffer] = useState(() => sv("offer", null));
  const [pendingNextPlayer, setPendingNextPlayer] = useState(() => sv("pendingNextPlayer", null));

  // Her önemli değişiklikte otomatik kaydet — sekme kapatılsa/yenilense bile kariyer kalır.
  useEffect(() => {
    const data = {
      phase, homeReturnPhase, name, position, squadNumber, player, career, seasonYear, wallet,
      draftStats, draftOverall, selectedCountry, chosenTeam,
      trainingFocus, intensity, lifeActivity, life, sponsorFlags, coins, packUsed,
      fixtures, currentRound, matchLog, roundInjured, trainingNote, lastMatch,
      seasonStatsBefore, seasonResult, offer, pendingNextPlayer,
    };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
  }, [
    phase, homeReturnPhase, name, position, squadNumber, player, career, seasonYear, wallet,
    draftStats, draftOverall, selectedCountry, chosenTeam,
    trainingFocus, intensity, lifeActivity, life, sponsorFlags, coins, packUsed,
    fixtures, currentRound, matchLog, roundInjured, trainingNote, lastMatch,
    seasonStatsBefore, seasonResult, offer, pendingNextPlayer,
  ]);

  function goHome() { setHomeReturnPhase(phase); setPhase("home"); }

  // Adım 1: isim / forma no / mevki seçildikten sonra güç üretilir, takım seçimine geçilir.
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

  // Adım 2: takım seçilince kariyer resmen başlar (altyapı yılları o kulüpte geçer).
  function confirmTeam() {
    if (!chosenTeam) return;
    const stats = draftStats;
    setPlayer({ age: 16, country: selectedCountry, club: chosenTeam.name, clubStars: chosenTeam.stars, tier: "youth", wage: 500, contract: generateContract(chosenTeam.stars), stats });
    setCareer({ goals: 0, assists: 0, matches: 0, trophies: [], caps: 0, natGoals: 0, peakOverall: computeOverall(stats, position) });
    setSeasonYear(1);
    setCoins(100); setWallet(0); setPackUsed(false);
    setLife({ enerji: 100, mutluluk: 65, populerlik: 5 });
    setSponsorFlags([false, false, false]);
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

  // ---- Altyapı (16-17 yaş) basit sezon ----
  function buyEnergyDrink(idx) {
    const d = ENERGY_DRINKS[idx];
    if (coins < d.cost || life.enerji >= 100) return;
    setCoins((c) => c - d.cost);
    setLife((l) => ({ ...l, enerji: clamp(l.enerji + d.energy, 0, 100) }));
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

  // ---- Profesyonel sezon: hafta hafta antrenman + maç döngüsü ----
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
    const { life: lifeAfter, msgs: lifeMsgs } = applyLifeActivity(lifeActivity, life);
    const perfMod = (lifeAfter.enerji - 50) / 250 + (lifeAfter.mutluluk - 50) / 300;

    const played = matchLog.filter((m) => !m.skipped);
    const wins = played.filter((m) => m.result === "W").length;
    const draws = played.filter((m) => m.result === "D").length;
    const featuredGoals = played.reduce((s, m) => s + m.goals, 0);
    const featuredAssists = played.reduce((s, m) => s + m.assists, 0);
    const featuredMatches = played.length;
    const ratings = played.map((m) => m.rating);

    const totalSeasonMatches = SEASON_WEEKS;
    const backgroundMatches = Math.max(0, totalSeasonMatches - featuredMatches);
    const backgroundGoals = Math.max(0, Math.round(backgroundMatches * pos.goalFactor * (stats.sut / 99) * randFloat(0.7, 1.3) * (1 + perfMod)));
    const backgroundAssists = Math.max(0, Math.round(backgroundMatches * pos.assistFactor * (stats.pas / 99) * randFloat(0.7, 1.3) * (1 + perfMod)));

    const totalGoals = featuredGoals + backgroundGoals;
    const totalAssists = featuredAssists + backgroundAssists;
    const totalMatches = featuredMatches + backgroundMatches;
    const avgRating = ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : clamp(6.0 + (overall - 60) / 20, 4, 9);

    const playerQualityStars = allowedStars(overall);
    const backgroundPPG = 0.55 + playerQualityStars * 0.35;
    const backgroundPoints = Math.round(backgroundMatches * backgroundPPG * randFloat(0.85, 1.15));
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
    const contract = player.contract || { goalBonus: 10, assistBonus: 5 };
    const goalBonusCoins = totalGoals * contract.goalBonus;
    const assistBonusCoins = totalAssists * contract.assistBonus;
    let coinsEarned = Math.round(wage / 40) + goalBonusCoins + assistBonusCoins + (trophy ? 200 : 0) + capsGain * 20;
    messages.push(`Sözleşme primin: gol başı +${contract.goalBonus} altın, asist başı +${contract.assistBonus} altın kazandırdı.`);

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
      newOffer = makeOffer(player.country, 1, target, overall, player.age);
    } else if (tier === 1 && overall >= 60) {
      const tryForeign = overall >= 70 && Math.random() < 0.3;
      if (tryForeign) {
        const others = Object.keys(COUNTRIES).filter((c) => c !== player.country);
        const foreignCountry = others[randInt(0, others.length - 1)];
        const target = pickTeamFiltered(foreignCountry, 1, allowedStars(overall), null);
        if (Math.random() < 0.5) newOffer = makeOffer(foreignCountry, 1, target, overall, player.age);
      }
      if (!newOffer) {
        const biggerClubs = tierData(player.country, 1).teams.filter((tm) => tm.name !== club && tm.stars >= player.clubStars);
        if (biggerClubs.length && Math.random() < 0.35) {
          const target = biggerClubs[randInt(0, biggerClubs.length - 1)];
          newOffer = makeOffer(player.country, 1, target, overall, player.age);
        }
      }
    }

    setPlayer({ ...player, wage });
    setLife(lifeAfter);
    setSponsorFlags(newSponsorFlags);
    setCoins((c) => c + coinsEarned);
    setWallet((w) => w + wage);
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
    if (accept && offer) {
      updated = { ...updated, country: offer.country, tier: offer.toTier, club: offer.club, clubStars: offer.stars, wage: offer.wage, contract: offer.contract };
      setWallet((w) => w + offer.signingBonus);
    }
    setOffer(null);
    setSeasonYear((y) => y + 1);
    startSeasonRounds(updated);
  }

  function resetGame() {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    setPhase("create"); setPlayer(null); setName(""); setPosition("FW"); setSquadNumber(randInt(1, 99));
    setCareer({ goals: 0, assists: 0, matches: 0, trophies: [], caps: 0, natGoals: 0, peakOverall: 0 });
    setSeasonYear(1); setSeasonResult(null); setOffer(null); setCoins(0); setWallet(0); setPackUsed(false);
    setLife({ enerji: 100, mutluluk: 65, populerlik: 5 }); setSponsorFlags([false, false, false]);
    setDraftStats(null); setDraftOverall(0); setSelectedCountry("TR"); setChosenTeam(null);
  }

  const overall = player ? computeOverall(player.stats, position) : 0;
  const packCost = player && typeof player.tier === "number" ? 150 + player.tier * 50 + (player.clubStars || 0) * 10 : 0;
  const lifeOptions = [
    { key: "rest", label: "Dinlen", icon: Moon },
    { key: "party", label: "Gece Hayatı", icon: PartyPopper },
    { key: "interview", label: "Röportaj", icon: Mic },
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
                <div className={`flex items-center gap-1 ${t.pill} rounded-full px-2.5 py-1.5`}>
                  <Coins className="w-4 h-4 text-amber-400" /><span className={`font-mono font-black text-sm ${t.pillText}`}>{coins}</span>
                </div>
                <div className={`flex items-center gap-1 ${t.pill} rounded-full px-2.5 py-1.5`}>
                  <Wallet className="w-4 h-4 text-emerald-400" /><span className={`font-mono font-black text-sm ${t.pillText}`}>{shortMoney(wallet)}</span>
                </div>
              </>
            )}
            <button onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")} className={`${t.iconBtn} rounded-full p-2`}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ---------------- HOME ---------------- */}
        {phase === "home" && (
          <div className="space-y-4">
            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Ana Menü</p>
              {player ? (
                <>
                  <h2 className={`text-lg font-black mb-3 ${t.textMain}`}>Kaldığın yerden devam et</h2>
                  <PlayerCard name={name} number={squadNumber} position={POSITIONS[position].label} posKey={position} club={player.club} overall={overall} stats={player.stats} tier={`${tierLabel(player)} · Sezon ${seasonYear} · Yaş ${player.age}`} value={computeMarketValue(overall, player.age)} />
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
              <p className={`flex items-center gap-1.5 text-xs uppercase tracking-widest ${t.label} font-bold mb-3`}><Palette className="w-3.5 h-3.5" /> Tema Rengi</p>
              <div className="grid grid-cols-5 gap-2.5">
                {Object.keys(ACCENTS).map((c) => (
                  <button
                    key={c}
                    onClick={() => chooseAccent(c)}
                    title={ACCENT_NAMES[c]}
                    className={`w-9 h-9 rounded-full ${SWATCH[c]} flex items-center justify-center transition ${accent === c ? "ring-2 ring-offset-2 ring-slate-400" : ""}`}
                    style={accent === c ? { boxShadow: theme === "dark" ? "0 0 0 2px #020617" : "0 0 0 2px #ffffff" } : undefined}
                  >
                    {accent === c && <span className="w-2.5 h-2.5 rounded-full bg-slate-950/60" />}
                  </button>
                ))}
              </div>
              <p className={`text-[11px] ${t.textFaint} mt-3`}>Seçili renk: <b className={t.textSub}>{ACCENT_NAMES[accent]}</b></p>
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
                  <li>Sezon sonunda dinlen, röportaj ver ya da gece hayatına çık — her birinin enerji/mutluluk/popülerliğe etkisi farklı.</li>
                  <li>Ligde şampiyon ol, transfer teklifi al, milli takıma çağrıl.</li>
                  <li>35 yaşında emekli ol ve kariyer ünvanını öğren.</li>
                </ul>
              )}
            </Panel>
          </div>
        )}

        {/* ---------------- CREATE ---------------- */}
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

        {/* ---------------- TEAM SELECT ---------------- */}
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
                    className={`flex flex-col items-start gap-1 rounded-xl px-3 py-2.5 border-2 text-left transition disabled:opacity-35 ${active ? t.btnActive : t.btnInactive}`}>
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

        {/* ---------------- YOUTH ---------------- */}
        {phase === "youth" && player && (
          <div className="space-y-4">
            <PlayerCard name={name} number={squadNumber} position={POSITIONS[position].label} posKey={position} club={player.club} overall={overall} stats={player.stats} tier={`${tierLabel(player)} · Sezon ${seasonYear} · Yaş ${player.age}`} value={computeMarketValue(overall, player.age)} />
            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-2`}>Altyapı Sezonu</p>
              <p className={`text-sm ${t.textSub} mb-3`}>Henüz profesyonel değilsin. Bu sezon bir özelliğine odaklan.</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {STAT_KEYS.map((k) => (
                  <button key={k} onClick={() => setTrainingFocus(k)} className={`rounded-xl py-2 text-xs font-black border-2 transition ${trainingFocus === k ? t.chunkySelected : t.btnInactive}`}>{trainLabel(k, position)}</button>
                ))}
              </div>
              <Chunky t={t} onClick={playYouthSeason} color="green">Sezonu Tamamla <ChevronRight className="w-4 h-4" /></Chunky>
            </Panel>
          </div>
        )}

        {/* ---------------- TRAINING ---------------- */}
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
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-3 flex items-center gap-1.5`}><Battery className="w-3.5 h-3.5" /> Enerji İçecekleri</p>
              <div className="grid grid-cols-2 gap-2">
                {ENERGY_DRINKS.map((d, i) => {
                  const disabled = coins < d.cost || life.enerji >= 100;
                  return (
                    <button key={i} onClick={() => buyEnergyDrink(i)} disabled={disabled}
                      className={`flex flex-col items-start gap-1 rounded-xl px-3 py-2.5 border-2 text-left transition disabled:opacity-35 ${t.btnInactive}`}>
                      <span className={`text-xs font-black ${t.textMain}`}>{d.name}</span>
                      <span className={`text-[11px] ${t.textFaint}`}>+{d.energy} enerji</span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400"><Coins className="w-3 h-3" />{d.cost}</span>
                    </button>
                  );
                })}
              </div>
              {life.enerji >= 100 && <p className={`text-[11px] ${t.textFaint} mt-2`}>Enerjin zaten dolu.</p>}
            </Panel>

            <Panel t={t}>
              <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-3 flex items-center gap-1.5`}><Dumbbell className="w-3.5 h-3.5" /> Antrenman Odağı</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {STAT_KEYS.map((k) => (
                  <button key={k} onClick={() => setTrainingFocus(k)} className={`rounded-xl py-2 text-xs font-black border-2 transition ${trainingFocus === k ? t.chunkySelected : t.btnInactive}`}>{trainLabel(k, position)}</button>
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

        {/* ---------------- MATCH ---------------- */}
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

        {/* ---------------- MATCH RESULT ---------------- */}
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

        {/* ---------------- OFFSEASON (life choice) ---------------- */}
        {phase === "offseason" && player && (
          <div className="space-y-4">
            <PlayerCard name={name} number={squadNumber} position={POSITIONS[position].label} posKey={position} club={player.club} overall={overall} stats={player.stats} tier={`${tierLabel(player)} · Sezon ${seasonYear} özeti`} value={computeMarketValue(overall, player.age)} />
            <Panel t={t}>
              <LifeBar icon={Battery} label="Enerji" value={life.enerji} grad="from-sky-500 to-cyan-400" t={t} />
              <LifeBar icon={Smile} label="Mutluluk" value={life.mutluluk} grad="from-rose-500 to-pink-400" t={t} />
              <LifeBar icon={Users} label="Popülerlik" value={life.populerlik} grad="from-purple-500 to-fuchsia-400" t={t} />
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

        {/* ---------------- SUMMARY ---------------- */}
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
                        {m.includes("basın") || m.includes("sponsor") ? <Newspaper className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> : <Smile className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
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

        {/* ---------------- TRANSFER ---------------- */}
        {phase === "transfer" && offer && player && (
          <Panel t={t}>
            <p className={`text-xs uppercase tracking-widest ${t.label} font-bold mb-1`}>Transfer Teklifi</p>
            <h2 className={`text-lg font-black ${t.textMain} mb-1`}>{offer.club} seni istiyor!</h2>
            {offer.country !== player.country && <p className="text-xs font-bold text-amber-400 mb-3">Yurt dışından teklif! {COUNTRIES[offer.country].name}'ya transfer</p>}
            <div className={`flex items-center justify-between ${t.panelAlt2} rounded-xl px-3 py-2.5 mb-2 ${offer.country === player.country ? "" : "mt-2"}`}>
              <span className={`text-sm ${t.textFaint} font-bold`}>Mevcut</span><span className={`text-sm font-black ${t.textSub}`}>{player.club} · {COUNTRIES[player.country].name} {tierData(player.country, player.tier).name}</span>
            </div>
            <div className={`flex items-center justify-between ${t.offerBox} rounded-xl px-3 py-2.5 mb-2`}>
              <span className={`text-sm ${t.label} font-bold`}>Yeni Teklif</span><span className={`text-sm font-black ${t.label}`}>{offer.club} · {COUNTRIES[offer.country].name} {tierData(offer.country, offer.toTier).name}</span>
            </div>
            <div className="flex items-center gap-2 mb-3"><StarRow count={offer.stars} /><span className={`text-[11px] ${t.textFaint}`}>kulüp prestiji</span></div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className={`${t.scoreBox} rounded-xl px-3 py-2`}>
                <p className={`text-[9px] uppercase tracking-widest ${t.textFaint} font-bold`}>Piyasa Değerin</p>
                <p className={`text-sm font-black ${t.textMain}`}>{shortMoney(offer.marketValue)}</p>
              </div>
              <div className={`${t.scoreBox} rounded-xl px-3 py-2`}>
                <p className={`text-[9px] uppercase tracking-widest ${t.textFaint} font-bold`}>İmza Bonusu</p>
                <p className="text-sm font-black text-amber-400">{shortMoney(offer.signingBonus)}</p>
              </div>
            </div>
            <div className={`${t.scoreBox} rounded-xl px-3 py-2 mb-3`}>
              <p className={`text-[9px] uppercase tracking-widest ${t.textFaint} font-bold`}>Sezonluk Ücret</p>
              <p className={`text-sm font-black ${t.textMain}`}>{money(offer.wage)}</p>
            </div>
            <div className={`${t.panelAlt2} rounded-xl px-3 py-2.5 mb-6`}>
              <p className={`text-[10px] uppercase tracking-widest ${t.textFaint} font-bold mb-1`}>Yeni Sözleşme Primleri</p>
              <p className={`text-sm ${t.textSub}`}>Gol başı <b className="text-amber-400">+{offer.contract.goalBonus} altın</b> · Asist başı <b className="text-amber-400">+{offer.contract.assistBonus} altın</b></p>
            </div>

            <div className="flex gap-3">
              <Chunky t={t} onClick={() => handleOffer(false)} color="slate">Reddet, Kal</Chunky>
              <Chunky t={t} onClick={() => handleOffer(true)} color="amber">Kabul Et</Chunky>
            </div>
          </Panel>
        )}

        {/* ---------------- RETIRED ---------------- */}
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
