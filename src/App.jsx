import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";

const DEFAULT_CONTENT = {
  PROFILE: {
    name: "Jonathan Jo",
    firstName: "Jonathan",
    lastName: "Jo",
    roles: ["IT Student", "Blockchain Learner", "AI Enthusiast", "Builder"],
    bio: "Fourth-semester IT student building at the intersection of blockchain, AI, and software engineering. I learn by shipping — every project here is a step toward production-grade work.",
    location: "Jakarta, Indonesia",
    email: "you@email.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    photo: "",
    logo: "/logo.png",
    greeting: "Hi, I am",
  },
  PROJECTS: [],
  CERTIFICATES: [],
  STACK: [
    "JavaScript",
    "TypeScript",
    "React",
    "Python",
    "Solidity",
    "Node.js",
    "Git",
    "SQL",
    "Figma",
  ],
  LANGUAGES: ["Indonesian — Native", "English"],
  CONTACTS: [
    { label: "Contact Me", kind: "email" },
    { label: "Connect With Me", kind: "linkedin" },
    { label: "Explore My Code", kind: "github" },
  ],
};

function mergeContent(base, json) {
  if (!json || typeof json !== "object") return base;
  return {
    PROFILE: { ...base.PROFILE, ...(json.PROFILE || {}) },
    PROJECTS: Array.isArray(json.PROJECTS) ? json.PROJECTS : base.PROJECTS,
    CERTIFICATES: Array.isArray(json.CERTIFICATES)
      ? json.CERTIFICATES
      : base.CERTIFICATES,
    STACK: Array.isArray(json.STACK) ? json.STACK : base.STACK,
    LANGUAGES: Array.isArray(json.LANGUAGES) ? json.LANGUAGES : base.LANGUAGES,
    CONTACTS: Array.isArray(json.CONTACTS) ? json.CONTACTS : base.CONTACTS,
  };
}

const ContentCtx = createContext(DEFAULT_CONTENT);
const useContent = () => useContext(ContentCtx);

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500&family=JetBrains+Mono:ital,wght@0,300;0,400;1,300&display=swap');

:root {
  --ink-0: #070708;
  --ink-1: #121214;
  --ink-2: #1d1d21;
  --line:  #34343a;
  --mist:  #9b9ba3;
  --silver:#d3d3d9;
  --paper: #f2f2f0;
  --white: #ffffff;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.t-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 300;
}
.t-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: none;
  font-weight: 300;
}

.pf-root {
  background: var(--ink-0);
  color: var(--paper);
  min-height: 100vh;
  font-family: 'Manrope', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
  position: relative;
  cursor: default;
}

.pf-root::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 49;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.027) 0px,
    rgba(255, 255, 255, 0.027) 1px,
    transparent 1px,
    transparent 3px
  );
}

.pf-root::after {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none;
  opacity: 0.045;
  z-index: 50;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.pf-net {
  position: fixed; inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
}

.pf-cursor {
  position: fixed; top: 0; left: 0;
  width: 38px; height: 38px;
  pointer-events: none;
  z-index: 45;
  will-change: transform;
}
.pf-cursor .corner {
  position: absolute;
  width: 9px; height: 9px;
  border-color: var(--silver);
  border-style: solid;
  border-width: 0;
  opacity: 0.9;
}
.pf-cursor .tl { top: 0; left: 0; border-top-width: 1px; border-left-width: 1px; }
.pf-cursor .tr { top: 0; right: 0; border-top-width: 1px; border-right-width: 1px; }
.pf-cursor .bl { bottom: 0; left: 0; border-bottom-width: 1px; border-left-width: 1px; }
.pf-cursor .br { bottom: 0; right: 0; border-bottom-width: 1px; border-right-width: 1px; }
.pf-cursor .coords {
  position: absolute;
  top: 100%; left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--mist);
  white-space: nowrap;
}
.pf-trailchar {
  position: fixed;
  pointer-events: none;
  z-index: 44;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 300;
  color: var(--silver);
  animation: trailFade 1.1s ease forwards;
}
@keyframes trailFade {
  from { opacity: 0.85; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-22px); }
}
@media (pointer: coarse) {
  .pf-cursor, .pf-trailchar { display: none; }
}

.pf-caret {
  display: inline-block;
  width: 8px; height: 1.1em;
  background: var(--paper);
  vertical-align: text-bottom;
  margin-left: 6px;
  animation: blink 1.1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.pf-nav {
  position: absolute; top: 0; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 28px 6vw;
  z-index: 40;
  mix-blend-mode: difference;
}
.pf-logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  letter-spacing: 0.08em;
  color: var(--white);
  cursor: pointer;
  font-weight: 400;
}
.pf-logo .dim { opacity: 0.5; }
.pf-logo img {
  height: 78px;
  width: auto;
  display: block;
  object-fit: contain;
  cursor: pointer;
}
.pf-links { display: flex; gap: 38px; }
.pf-link {
  background: none; border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px; letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--white);
  cursor: pointer;
  position: relative;
  padding: 4px 0;
  opacity: 0.7;
  transition: opacity 0.35s ease;
}
.pf-link::after {
  content: ""; position: absolute;
  left: 0; bottom: 0;
  width: 100%; height: 1px;
  background: var(--white);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
}
.pf-link:hover, .pf-link.active { opacity: 1; }
.pf-link.active::after { transform: scaleX(1); transform-origin: left; }
.pf-link:focus-visible { outline: 1px solid var(--white); outline-offset: 4px; }

.pf-page {
  position: relative; z-index: 2;
  min-height: 100vh;
  padding: 0 6vw;
  animation: pageIn 0.9s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes pageIn {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pf-hero {
  min-height: 100vh;
  min-height: 100svh;
  display: flex; flex-direction: column; justify-content: center;
  position: relative;
}
.pf-greet {
  display: block;
  font-size: 0.34em;
  line-height: 1.5;
  color: var(--mist);
  letter-spacing: 0.06em;
}
.pf-name {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 300;
  font-size: clamp(32px, 6.5vw, 86px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--white);
  white-space: nowrap;
  overflow: hidden;
  padding-bottom: 0.06em;
}
.pf-name .inner {
  display: inline-block;
  animation: riseUp 1.1s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes riseUp {
  from { transform: translateY(110%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

.pf-term {
  margin-top: 40px;
  display: flex; flex-direction: column; gap: 12px;
}
.pf-term .ln {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  font-weight: 300;
  color: var(--mist);
}
.pf-term .ln .kw { color: var(--silver); }
.pf-term .ln .val { color: var(--white); }
.pf-term .ln .cm { color: var(--mist); opacity: 0.8; }

.pf-piggy {
  position: absolute;
  right: 2vw;
  top: 50%;
  transform: translateY(-50%);
  width: clamp(240px, 34vw, 480px);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.pf-piggy svg { width: 100%; height: auto; display: block; overflow: visible; }
.pf-piggy .pig-fill {
  fill: url(#pigGrad);
  stroke: var(--silver);
  stroke-width: 1.8;
  stroke-linejoin: round;
}
.pf-piggy .pig-line {
  fill: none;
  stroke: var(--silver);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.pf-piggy .pig-outline {
  fill: none;
  stroke: var(--silver);
  stroke-width: 1.6;
  stroke-linejoin: round;
}
.pf-piggy .pigbody {
  transform-origin: 105px 105px;
  animation: pigBounce 2.8s ease infinite;
}
.pf-piggy .pigbody.party-once {
  animation:
    pigParty 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    pigBounce 2.8s ease 0.85s infinite;
}
@keyframes pigBounce {
  0%, 55%, 100% { transform: scale(1); }
  62% { transform: scale(1.03, 0.97); }
  70% { transform: scale(0.99, 1.01); }
  78% { transform: scale(1); }
}
@keyframes pigParty {
  0%   { transform: scale(1) rotate(0deg); }
  25%  { transform: scale(1.07, 0.93) rotate(-2.5deg); }
  50%  { transform: scale(0.96, 1.04) rotate(2deg); }
  75%  { transform: scale(1.03, 0.97) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.pf-coin, .pf-coin-burst {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}
.pf-coin { animation: coinDrop 2.8s cubic-bezier(0.45, 0, 0.7, 1) infinite; }
.pf-coin-burst { animation: coinDropOnce 1.05s cubic-bezier(0.45, 0, 0.7, 1) both; }
@keyframes coinDrop {
  0%   { transform: translateY(-36px); opacity: 0; }
  12%  { transform: translateY(-36px); opacity: 1; }
  52%  { transform: translateY(26px); opacity: 1; }
  60%  { transform: translateY(34px) scaleY(0.35); opacity: 0; }
  100% { transform: translateY(34px); opacity: 0; }
}
@keyframes coinDropOnce {
  0%   { transform: translateY(-48px); opacity: 0; }
  14%  { transform: translateY(-48px); opacity: 1; }
  68%  { transform: translateY(26px); opacity: 1; }
  80%  { transform: translateY(34px) scaleY(0.35); opacity: 0; }
  100% { transform: translateY(34px); opacity: 0; }
}
.pf-coin-face { fill: #F7931A; }
.pf-coin-ring { fill: none; stroke: #ffffff; stroke-width: 1.4; }
.pf-coin-b {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 13px;
  fill: #ffffff;
  text-anchor: middle;
  dominant-baseline: central;
}
.pf-feedhint {
  position: absolute;
  bottom: -26px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--mist);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.pf-piggy:hover .pf-feedhint { opacity: 1; }
@media (max-width: 880px) {
  .pf-piggy { display: none; }
}

.pf-hero-socials {
  margin-top: 44px;
  display: flex; gap: 18px;
}
.pf-icon-btn {
  width: 46px; height: 46px;
  border: 1px solid var(--line);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--silver);
  text-decoration: none;
  transition: color 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s ease;
}
.pf-icon-btn:hover {
  color: var(--ink-0);
  background: var(--white);
  border-color: var(--white);
  transform: translateY(-4px);
}
.pf-icon-btn:focus-visible { outline: 1px solid var(--white); outline-offset: 3px; }
.pf-icon-btn svg { width: 19px; height: 19px; }

.pf-hero-bottom {
  margin-top: 64px;
  display: flex; align-items: center;
}
.pf-cta {
  display: inline-flex; align-items: center; gap: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--white);
  background: transparent;
  border: 1px solid var(--silver);
  border-radius: 999px;
  padding: 18px 36px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: color 0.4s ease, border-color 0.4s ease;
  flex-shrink: 0;
  z-index: 1;
}
.pf-cta::before {
  content: "";
  position: absolute; inset: 0;
  background: var(--white);
  transform: translateY(101%);
  transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
  z-index: -1;
}
.pf-cta:hover { color: var(--ink-0); border-color: var(--white); }
.pf-cta:hover::before { transform: translateY(0); }
.pf-cta:focus-visible { outline: 1px solid var(--white); outline-offset: 4px; }
.pf-cta .arrow {
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
}
.pf-cta:hover .arrow { transform: translate(4px, -4px); }

.pf-chain {
  display: flex; align-items: center;
  flex: 1;
  overflow: hidden;
  margin: 0 36px;
  min-width: 0;
  opacity: 0.45;
}
.pf-chain .block {
  width: 8px; height: 8px;
  border: 1px solid var(--line);
  flex-shrink: 0;
  animation: blockGlow 3.2s ease infinite;
}
.pf-chain .linkline {
  width: 22px; height: 1px;
  background: var(--line);
  flex-shrink: 0;
}
@keyframes blockGlow {
  0%, 100% { border-color: var(--line); background: transparent; }
  50% { border-color: var(--silver); background: rgba(255,255,255,0.08); }
}

.pf-section-head {
  padding-top: 17vh;
  margin-bottom: 8vh;
  border-bottom: 1px solid var(--line);
  padding-bottom: 34px;
}
.pf-section-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  font-weight: 300;
  color: var(--mist);
  margin-bottom: 18px;
}
.pf-section-row {
  display: flex; justify-content: space-between; align-items: flex-end;
}
.pf-section-title {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 300;
  font-size: clamp(30px, 4.6vw, 60px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--white);
}
.pf-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--silver);
}

.pf-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6vw 4vw;
  padding-bottom: 14vh;
}
.pf-card {
  text-decoration: none;
  color: inherit;
  display: block;
}
.pf-card:focus-visible { outline: 1px solid var(--silver); outline-offset: 6px; }
.pf-media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--line);
  background: linear-gradient(135deg, var(--ink-2), var(--ink-1));
  margin-bottom: 26px;
}
.pf-media img, .pf-media video {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease;
  display: block;
}
.pf-card:hover .pf-media img,
.pf-card:hover .pf-media video {
  transform: scale(1.05);
  filter: grayscale(0.3) contrast(1.02);
}
.pf-media-ph {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
}
.pf-media-ph .initial {
  font-family: 'JetBrains Mono', monospace;
  font-size: 52px;
  color: var(--line);
  line-height: 1;
}
.pf-media .veil {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(7,7,8,0.55), transparent 45%);
  pointer-events: none;
}
.pf-media .badge {
  position: absolute; top: 16px; left: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--paper);
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(7,7,8,0.45);
  backdrop-filter: blur(6px);
  padding: 6px 14px;
  border-radius: 999px;
}
.pf-card-head {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 18px;
}
.pf-card-title {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  font-size: clamp(19px, 2vw, 28px);
  letter-spacing: 0.01em;
  color: var(--paper);
  transition: color 0.4s ease;
}
.pf-card:hover .pf-card-title { color: var(--white); }
.pf-card-year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em;
  color: var(--silver);
}
.pf-card-desc {
  margin-top: 12px;
  font-size: 14px; line-height: 1.7;
  color: var(--silver);
  max-width: 460px;
}
.pf-card-tags { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
.pf-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 13px;
  color: var(--paper);
  transition: border-color 0.35s ease;
}
.pf-card:hover .pf-tag { border-color: var(--mist); }
.pf-card-link {
  margin-top: 18px;
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--mist);
  transition: color 0.35s ease;
}
.pf-card:hover .pf-card-link { color: var(--white); }
.pf-card-link .arrow { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
.pf-card:hover .pf-card-link .arrow { transform: translate(4px, -4px); }

.pf-soon {
  grid-column: 1 / -1;
  min-height: 38vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 18px;
  text-align: center;
}
.pf-soon .code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  letter-spacing: 0.04em;
  font-weight: 300;
  color: var(--silver);
}
.pf-soon .code .kw { color: var(--white); }
.pf-soon .sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--paper);
}

.pf-profile-grid {
  display: grid;
  grid-template-columns: minmax(260px, 380px) 1fr;
  gap: 6vw;
  align-items: start;
  margin-bottom: 10vh;
}
.pf-photo-frame {
  position: relative;
  aspect-ratio: 4 / 5;
}
.pf-photo-frame::before {
  content: "";
  position: absolute; inset: 0;
  border: 1px solid var(--line);
  transform: translate(16px, 16px);
  transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
}
.pf-photo-frame:hover::before { transform: translate(8px, 8px); }
.pf-photo {
  position: relative;
  width: 100%; height: 100%;
  object-fit: cover;
  border: 1px solid var(--line);
  display: block;
}
.pf-photo-ph {
  position: relative;
  width: 100%; height: 100%;
  border: 1px solid var(--line);
  background: linear-gradient(135deg, var(--ink-2), var(--ink-1));
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
}
.pf-photo-ph .initial {
  font-family: 'JetBrains Mono', monospace;
  font-size: 56px;
  color: var(--line);
  line-height: 1;
}
.pf-photo-ph .hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--mist);
}
.pf-bio {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 300;
  font-size: clamp(14px, 1.6vw, 21px);
  line-height: 1.95;
  color: var(--paper);
}
.pf-bio em { color: var(--white); font-style: italic; }
.pf-bio-meta {
  margin-top: 36px;
  display: flex; flex-direction: column; gap: 14px;
}
.pf-bio-meta .row {
  display: flex; gap: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  font-weight: 300;
}
.pf-bio-meta .k { color: var(--mist); min-width: 130px; }
.pf-bio-meta .v { color: var(--silver); }

.pf-about-block { margin-top: 44px; }
.pf-about-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--mist);
  margin-bottom: 16px;
}
.pf-chiprow { display: flex; flex-wrap: wrap; gap: 10px; }
.pf-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 18px;
  color: var(--paper);
  transition: border-color 0.35s ease, color 0.35s ease;
}
.pf-chip:hover { border-color: var(--silver); color: var(--white); }

.pf-certs { margin-bottom: 10vh; }
.pf-certgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}
.pf-cert {
  display: flex; flex-direction: column;
  border: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
  background: linear-gradient(160deg, var(--ink-1), var(--ink-0));
}
.pf-cert:hover { border-color: var(--mist); transform: translateY(-4px); }
.pf-cert:focus-visible { outline: 1px solid var(--silver); outline-offset: 4px; }
.pf-cert-thumb {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  background: var(--ink-2);
}
.pf-cert-thumb img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
}
.pf-cert:hover .pf-cert-thumb img { transform: scale(1.04); }
.pf-cert-pdf {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.35em;
  color: var(--mist);
  border: 1px solid var(--line);
  padding: 12px 22px;
  border-radius: 4px;
}
.pf-cert-body { padding: 20px 22px 24px; }
.pf-cert-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: var(--paper);
  margin-bottom: 8px;
}
.pf-cert-desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--mist);
}
.pf-cert-open {
  margin-top: 16px;
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--mist);
  transition: color 0.35s ease;
}
.pf-cert:hover .pf-cert-open { color: var(--white); }
.pf-cert-open .arrow { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
.pf-cert:hover .pf-cert-open .arrow { transform: translate(3px, -3px); }
.pf-cert-empty {
  border: 1px dashed var(--line);
  padding: 44px 20px;
  display: flex; flex-direction: column;
  align-items: center; gap: 14px;
  text-align: center;
}
.pf-cert-empty .code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--silver);
}
.pf-cert-empty .code .kw { color: var(--white); }
.pf-cert-empty .sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--mist);
}

.pf-marquee {
  overflow: hidden;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 22px 0;
  margin-bottom: 10vh;
  white-space: nowrap;
}
.pf-marquee-track {
  display: inline-block;
  animation: marquee 28s linear infinite;
}
.pf-marquee span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--silver);
  margin-right: 64px;
}
.pf-marquee span::after { content: "·"; margin-left: 64px; color: var(--mist); }
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.pf-contactlist { list-style: none; padding-bottom: 14vh; }
.pf-contactrow {
  display: flex; align-items: center; gap: 26px;
  padding: 34px 8px;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  transition: padding-left 0.5s cubic-bezier(0.22,1,0.36,1);
}
.pf-contactrow:hover { padding-left: 28px; }
.pf-contactrow:focus-visible { outline: 1px solid var(--silver); outline-offset: -1px; }
.pf-contacticon {
  width: 52px; height: 52px;
  border: 1px solid var(--line);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--silver);
  flex-shrink: 0;
  transition: color 0.35s ease, background 0.35s ease, border-color 0.35s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1);
}
.pf-contactrow:hover .pf-contacticon {
  color: var(--ink-0);
  background: var(--white);
  border-color: var(--white);
  transform: rotate(-8deg) scale(1.06);
}
.pf-contacticon svg { width: 21px; height: 21px; }
.pf-contactlabel {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(16px, 2.2vw, 26px);
  font-weight: 300;
  letter-spacing: 0.04em;
  color: var(--paper);
  transition: color 0.35s ease;
  flex: 1;
}
.pf-contactrow:hover .pf-contactlabel { color: var(--white); }
.pf-contactmeta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--silver);
}
.pf-arrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  color: var(--silver);
  transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), color 0.35s ease;
}
.pf-contactrow:hover .pf-arrow { transform: translate(8px, -8px); color: var(--white); }

.pf-footer {
  border-top: 1px solid var(--line);
  padding: 36px 6vw 40px;
  position: relative; z-index: 2;
  display: flex; justify-content: space-between; align-items: center;
  gap: 24px;
}
.pf-footer .left {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  font-weight: 300;
  color: var(--mist);
}
.pf-footer .left .kw { color: var(--silver); }
.pf-totop {
  background: none; border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--silver);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 10px;
  transition: color 0.35s ease;
}
.pf-totop:hover { color: var(--white); }
.pf-totop .arrow {
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
}
.pf-totop:hover .arrow { transform: translateY(-4px); }

@media (max-width: 880px) {
  .pf-grid { grid-template-columns: 1fr; gap: 64px; }
  .pf-profile-grid { grid-template-columns: 1fr; gap: 48px; }
  .pf-photo-frame { max-width: 320px; }
}
@media (max-width: 720px) {
  .pf-nav { padding: 22px 5vw; }
  .pf-links { gap: 18px; }
  .pf-link { font-size: 10px; letter-spacing: 0.16em; }
  .pf-logo img { height: 46px; }
  .pf-section-head { padding-top: 18vh; margin-bottom: 6vh; }
  .pf-hero { padding-top: 12vh; justify-content: flex-start; }
  .pf-hero-bottom { flex-direction: column; align-items: flex-start; gap: 28px; margin-top: 48px; }
  .pf-chain { display: none; }
  .pf-term { margin-top: 30px; gap: 10px; }
  .pf-term .ln { font-size: 11px; }
  .pf-hero-socials { margin-top: 34px; }
  .pf-cta { padding: 15px 30px; font-size: 11px; }
  .pf-contactlabel { font-size: 17px; }
  .pf-contactmeta { display: none; }
  .pf-contactrow { padding: 26px 4px; gap: 18px; }
  .pf-contacticon { width: 44px; height: 44px; }
  .pf-footer { flex-direction: column; align-items: flex-start; gap: 14px; }
  .pf-grid { gap: 52px; padding-bottom: 10vh; }
  .pf-soon { min-height: 30vh; }
  .pf-photo-frame { max-width: 260px; }
  .pf-bio { font-size: 14px; line-height: 1.85; }
  .pf-chip { font-size: 10px; padding: 7px 14px; }
}
@media (max-width: 420px) {
  .pf-links { gap: 13px; }
  .pf-link { font-size: 9px; letter-spacing: 0.12em; }
  .pf-name { font-size: clamp(24px, 8vw, 32px); }
  .pf-section-title { font-size: 28px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .pf-net { display: none; }
}
`;

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14 0 1.54-.02 2.79-.02 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const ICONS = {
  email: <MailIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
};

function ScrambleText({ text, className }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const CH = "!<>-_/[]{}=+*^?#01";
    let frame = 0;
    let raf;
    const tick = () => {
      frame++;
      const progress = Math.floor(frame / 3);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (i < progress) out += text[i];
        else if (text[i] === " ") out += " ";
        else out += CH[Math.floor(Math.random() * CH.length)];
      }
      setDisplay(out);
      if (progress <= text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return <span className={className}>{display}</span>;
}

function CursorFX() {
  const frameRef = useRef(null);
  const coordsRef = useRef(null);
  const [trail, setTrail] = useState([]);
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );

  useEffect(() => {
    if (!enabled) return;
    const CHARS = ["0", "1", "<", ">", "/", "{", "}", ";", "=", "*"];
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf;
    let lastSpawn = 0;

    const move = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const now = performance.now();
      if (now - lastSpawn > 110) {
        lastSpawn = now;
        const item = {
          id: now + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 44,
          y: e.clientY + (Math.random() - 0.5) * 44,
          c: CHARS[Math.floor(Math.random() * CHARS.length)],
        };
        setTrail((t) => [...t.slice(-11), item]);
      }
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.14;
      pos.y += (target.y - pos.y) * 0.14;
      if (frameRef.current) {
        frameRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
      if (coordsRef.current) {
        coordsRef.current.textContent = `x:${Math.round(pos.x)} y:${Math.round(pos.y)}`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={frameRef} className="pf-cursor" aria-hidden="true">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <span ref={coordsRef} className="coords" />
      </div>
      {trail.map((t) => (
        <span
          key={t.id}
          className="pf-trailchar"
          style={{ left: t.x, top: t.y }}
          aria-hidden="true"
        >
          {t.c}
        </span>
      ))}
    </>
  );
}

function NetworkCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf, w, h;
    const N = window.innerWidth < 720 ? 22 : 46;
    const LINK_DIST = window.innerWidth < 720 ? 120 : 160;
    const nodes = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.2 + Math.random() * 1.8,
        square: Math.random() < 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i],
            b = nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - d / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const glow = 0.35 + 0.3 * Math.sin(t / 900 + n.phase);
        ctx.fillStyle = `rgba(255,255,255,${glow})`;
        if (n.square) {
          const s = n.r * 2.4;
          ctx.strokeStyle = `rgba(255,255,255,${glow})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(n.x - s / 2, n.y - s / 2, s, s);
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="pf-net" />;
}

function TypedRole() {
  const { PROFILE } = useContent();
  const [text, setText] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = PROFILE.roles[roleIdx % PROFILE.roles.length] || "";
    let delay = deleting ? 40 : 85;
    if (!deleting && text === full) delay = 2000;
    if (deleting && text === "") delay = 400;

    const t = setTimeout(() => {
      if (!deleting && text === full) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % PROFILE.roles.length);
      } else {
        setText(full.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, roleIdx, PROFILE.roles]);

  return <span className="val">{text}</span>;
}

function HashTicker() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const gen = () =>
      "0x" +
      Array.from(
        { length: 12 },
        () => "0123456789abcdef"[Math.floor(Math.random() * 16)],
      ).join("");
    setHash(gen());
    const t = setInterval(() => setHash(gen()), 1800);
    return () => clearInterval(t);
  }, []);
  return <span className="val">{hash}…</span>;
}

function BitcoinCoin({ className, style }) {
  return (
    <g className={className} style={style}>
      <circle className="pf-coin-face" cx="113" cy="16" r="13" />
      <circle className="pf-coin-ring" cx="113" cy="16" r="10" />
      <text className="pf-coin-b" x="113" y="16.5">
        ₿
      </text>
    </g>
  );
}

function PiggyBank() {
  const [burst, setBurst] = useState([]);
  const [partyKey, setPartyKey] = useState(0);

  const feed = () => {
    const now = Date.now();
    const coins = Array.from({ length: 7 }, (_, i) => ({
      id: `${now}-${i}`,
      delay: i * 0.13,
      dx: (Math.random() - 0.5) * 26,
    }));
    setBurst((b) => [...b, ...coins]);
    setPartyKey((k) => k + 1);
    setTimeout(() => {
      setBurst((b) => b.filter((c) => !coins.some((k) => k.id === c.id)));
    }, 2600);
  };

  const bodyPath = `M 30 96
    C 22 96, 18 102, 18 110
    C 18 118, 24 124, 33 124
    C 38 140, 58 154, 88 157
    C 118 160, 152 154, 168 136
    C 182 120, 184 96, 174 80
    C 162 60, 132 50, 104 51
    C 74 52, 48 64, 38 84
    C 35 89, 32 92, 30 96 Z`;
  const earPath = "M 64 60 C 58 44, 72 34, 86 38 C 86 50, 78 58, 68 62 Z";

  return (
    <div
      className="pf-piggy"
      onClick={feed}
      role="button"
      tabIndex={0}
      aria-label="Feed the piggy bank"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") feed();
      }}
    >
      <svg viewBox="0 0 210 178">
        <defs>
          <linearGradient id="pigGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#27272c" />
            <stop offset="1" stopColor="#101013" />
          </linearGradient>
        </defs>

        <BitcoinCoin className="pf-coin" />

        {burst.map((c) => (
          <g key={c.id} transform={`translate(${c.dx} 0)`}>
            <BitcoinCoin
              className="pf-coin-burst"
              style={{ animationDelay: `${c.delay}s` }}
            />
          </g>
        ))}

        <g
          className={`pigbody ${partyKey > 0 ? "party-once" : ""}`}
          key={partyKey}
        >
          <rect
            className="pig-fill"
            x="70"
            y="140"
            width="17"
            height="26"
            rx="7"
          />
          <rect
            className="pig-fill"
            x="132"
            y="140"
            width="17"
            height="26"
            rx="7"
          />
          <path className="pig-fill" d={bodyPath} />
          <ellipse
            cx="84"
            cy="80"
            rx="36"
            ry="17"
            fill="#ffffff"
            opacity="0.05"
          />
          <path
            className="pig-line"
            d="M 42 88 C 38 98, 38 112, 43 121"
            strokeWidth="1.3"
            opacity="0.7"
          />
          <ellipse cx="25" cy="104" rx="1.7" ry="2.8" fill="var(--mist)" />
          <ellipse cx="25" cy="114" rx="1.7" ry="2.8" fill="var(--mist)" />
          <circle cx="60" cy="90" r="3.1" fill="var(--silver)" />
          <path className="pig-fill" d={earPath} />
          <path
            className="pig-line"
            d="M 177 94 C 193 88, 199 100, 189 105 C 183 108, 181 102, 186 99"
            strokeWidth="1.6"
          />
          <rect
            x="96"
            y="46"
            width="34"
            height="6"
            rx="3"
            fill="var(--ink-0)"
            stroke="var(--silver)"
            strokeWidth="1.4"
          />
        </g>
      </svg>
      <span className="pf-feedhint">click to feed</span>
    </div>
  );
}

function ChainAccent() {
  const blocks = 14;
  return (
    <div className="pf-chain" aria-hidden="true">
      {Array.from({ length: blocks }).map((_, i) => (
        <span key={i} style={{ display: "contents" }}>
          <span className="linkline" />
          <span className="block" style={{ animationDelay: `${i * 0.24}s` }} />
        </span>
      ))}
    </div>
  );
}

function NavLogo() {
  const { PROFILE } = useContent();
  const [failed, setFailed] = useState(false);
  if (PROFILE.logo && !failed) {
    return (
      <img
        src={PROFILE.logo}
        alt={PROFILE.name + " logo"}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <>
      <span className="dim">&lt;</span>JJ<span className="dim">/&gt;</span>
    </>
  );
}

function Home({ go }) {
  const { PROFILE } = useContent();
  return (
    <main className="pf-page">
      <section className="pf-hero">
        <PiggyBank />
        <h1 className="pf-name">
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="inner pf-greet">{PROFILE.greeting}</span>
          </span>
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="inner" style={{ animationDelay: "0.12s" }}>
              <ScrambleText text={PROFILE.name} />
            </span>
          </span>
        </h1>

        <div className="pf-term">
          <div className="ln">
            <span className="kw">role</span> &nbsp;—&nbsp; <TypedRole />
            <span className="pf-caret" />
          </div>
          <div className="ln">
            <span className="kw">block</span> —&nbsp; <HashTicker />{" "}
            <span className="cm">verified</span>
          </div>
        </div>

        <div className="pf-hero-socials">
          <a
            className="pf-icon-btn"
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            className="pf-icon-btn"
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            className="pf-icon-btn"
            href={`mailto:${PROFILE.email}`}
            aria-label="Email"
          >
            <MailIcon />
          </a>
        </div>

        <div className="pf-hero-bottom">
          <button className="pf-cta" onClick={() => go("work")}>
            View Projects <span className="arrow">↗</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function ProjectMedia({ project }) {
  const { media, title, category } = project;
  const hasSrc = media && media.src;
  return (
    <div className="pf-media">
      {hasSrc ? (
        media.type === "video" ? (
          <video src={media.src} muted loop autoPlay playsInline />
        ) : (
          <img src={media.src} alt={title} />
        )
      ) : (
        <div className="pf-media-ph">
          <span className="initial">{title[0]}</span>
        </div>
      )}
      <div className="veil" />
      <span className="badge">{category}</span>
    </div>
  );
}

function Work() {
  const { PROJECTS } = useContent();
  return (
    <main className="pf-page">
      <header className="pf-section-head">
        <div className="pf-section-row">
          <h2 className="pf-section-title">
            <ScrambleText text="Projects" />
          </h2>
          <span className="pf-count">
            {PROJECTS.length > 0
              ? String(PROJECTS.length).padStart(2, "0") + " shipped"
              : "in progress"}
          </span>
        </div>
      </header>
      <div className="pf-grid">
        {PROJECTS.map((p) => (
          <a
            className="pf-card"
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noreferrer"
          >
            <ProjectMedia project={p} />
            <div className="pf-card-head">
              <span className="pf-card-title">{p.title}</span>
              <span className="pf-card-year">{p.year}</span>
            </div>
            <p className="pf-card-desc">{p.desc}</p>
            <div className="pf-card-tags">
              {p.tags.map((t) => (
                <span className="pf-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <span className="pf-card-link">
              View project <span className="arrow">↗</span>
            </span>
          </a>
        ))}

        <div className="pf-soon">
          <span className="code">
            <span className="kw">await</span> nextProject()
            <span className="pf-caret" />
          </span>
          <span className="sub">coming soon</span>
        </div>
      </div>
    </main>
  );
}

function Profile() {
  const { PROFILE, STACK, LANGUAGES, CERTIFICATES, CONTACTS } = useContent();
  const bioParts = PROFILE.bio.split("—");

  const resolveContact = (c) => {
    if (c.kind === "email")
      return { href: "mailto:" + PROFILE.email, meta: "email" };
    if (c.kind === "linkedin")
      return { href: PROFILE.linkedin, meta: "linkedin" };
    if (c.kind === "github") return { href: PROFILE.github, meta: "github" };
    return { href: c.href || "#", meta: c.kind || "" };
  };

  return (
    <main className="pf-page">
      <header className="pf-section-head">
        <div className="pf-section-row">
          <h2 className="pf-section-title">
            <ScrambleText text="About Me" />
          </h2>
          <span className="pf-count">{PROFILE.location}</span>
        </div>
      </header>

      <div className="pf-profile-grid">
        <div className="pf-photo-frame">
          {PROFILE.photo ? (
            <img className="pf-photo" src={PROFILE.photo} alt={PROFILE.name} />
          ) : (
            <div className="pf-photo-ph">
              <span className="initial">
                {PROFILE.firstName[0]}
                {PROFILE.lastName[0]}
              </span>
              <span className="hint">your photo here</span>
            </div>
          )}
        </div>
        <div>
          <p className="pf-bio">
            {bioParts[0]}
            {bioParts[1] && <em>—{bioParts[1]}</em>}
          </p>

          <div className="pf-about-block">
            <div className="pf-about-label">Stack & Tools</div>
            <div className="pf-chiprow">
              {STACK.map((s) => (
                <span className="pf-chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pf-about-block">
            <div className="pf-about-label">Languages</div>
            <div className="pf-chiprow">
              {LANGUAGES.map((l) => (
                <span className="pf-chip" key={l}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pf-certs">
        <div className="pf-about-label">Certificates</div>
        {CERTIFICATES.length > 0 ? (
          <div className="pf-certgrid">
            {CERTIFICATES.map((cert) => {
              const isPdf = (cert.file || "").toLowerCase().endsWith(".pdf");
              return (
                <a
                  className="pf-cert"
                  key={cert.name}
                  href={cert.file || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="pf-cert-thumb">
                    {cert.file && !isPdf ? (
                      <img src={cert.file} alt={cert.name} loading="lazy" />
                    ) : (
                      <span className="pf-cert-pdf">PDF</span>
                    )}
                  </div>
                  <div className="pf-cert-body">
                    <div className="pf-cert-name">{cert.name}</div>
                    <div className="pf-cert-desc">{cert.desc}</div>
                    <span className="pf-cert-open">
                      View certificate <span className="arrow">↗</span>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="pf-cert-empty">
            <span className="code">
              certificates.push(<span className="kw">next</span>)
              <span className="pf-caret" />
            </span>
            <span className="sub">coming soon</span>
          </div>
        )}
      </div>

      <div className="pf-marquee" aria-hidden="true">
        <div className="pf-marquee-track">
          {[...STACK, ...STACK].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>

      <ul className="pf-contactlist">
        {CONTACTS.map((c) => {
          const r = resolveContact(c);
          return (
            <li key={c.label}>
              <a
                className="pf-contactrow"
                href={r.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="pf-contacticon">{ICONS[c.kind]}</span>
                <span className="pf-contactlabel">{c.label}</span>
                <span className="pf-contactmeta">{r.meta}</span>
                <span className="pf-arrow">↗</span>
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default function PortfolioSite() {
  const [page, setPage] = useState("home");
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/content.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setContent(mergeContent(DEFAULT_CONTENT, json)))
      .catch(() => {});
  }, []);

  const go = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <ContentCtx.Provider value={content}>
      <div className="pf-root">
        <style>{css}</style>

        <NetworkCanvas />
        <CursorFX />

        <nav className="pf-nav">
          <div className="pf-logo" onClick={() => go("home")}>
            <NavLogo />
          </div>
          <div className="pf-links">
            {["home", "work", "profile"].map((p) => (
              <button
                key={p}
                className={`pf-link ${page === p ? "active" : ""}`}
                onClick={() => go(p)}
              >
                {p === "home"
                  ? "Homepage"
                  : p === "work"
                    ? "Projects"
                    : "About Me"}
              </button>
            ))}
          </div>
        </nav>

        {page === "home" && <Home key="home" go={go} />}
        {page === "work" && <Work key="work" />}
        {page === "profile" && <Profile key="profile" />}

        <footer className="pf-footer">
          <span className="left">
            <span className="kw">©</span> 2026 — designed & built by{" "}
            {content.PROFILE.name}
          </span>
          <ChainAccent />
          <button
            className="pf-totop"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top <span className="arrow">↑</span>
          </button>
        </footer>
      </div>
    </ContentCtx.Provider>
  );
}
