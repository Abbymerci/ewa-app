"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { supabase } from "../lib/supabaseClient";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Pinyon+Script&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

const LOGO_SRC = "/images/logo.jpg";
const SHOT1_SRC = "/images/portfolio-new-fall-arch-web.jpg";
const SHOT2_SRC = "/images/portfolio-2-tableflower.jpg";
const SHOT3_SRC = "/images/portfolio-3-noir-gold-dinner-setup.jpg";
const SHOT4_SRC = "/images/portfolio-4-harvest-banquet-styling.jpg";
const SHOT5_SRC = "/images/portfolio-5-midnight-surprise-setup.jpg";
const SHOT6_SRC = "/images/portfolio-6-engagement-party-gold.jpg";
const SHOT7_SRC = "/images/portfolio-7-ivory-champagne-garlands.jpg";
const SHOT8_SRC = "/images/portfolio-8-monogram-rose-bouquet-a.jpg";
const SHOT9_SRC = "/images/portfolio-9-monogram-rose-bouquet-b.jpg";
const SHOT10_SRC = "/images/portfolio-10-monogram-rose-bouquet-closeup.jpg";
const SHOT11_SRC = "/images/portfolio-11-birthday-bouquet-car-reveal-a.jpg";
const SHOT12_SRC = "/images/portfolio-12-birthday-bouquet-car-reveal-b.jpg";
const SHOT13_SRC = "/images/portfolio-13-birthday-suite-luminaries.jpg";
const SHOT14_SRC = "/images/portfolio-14-birthday-suite-dim-wide.jpg";
const SHOT15_SRC = "/images/portfolio-15-birthday-bouquet-bedside.jpg";
const SHOT16_SRC = "/images/portfolio-16-birthday-suite-dim-detail.jpg";
const SHOT17_SRC = "/images/portfolio-17-birthday-suite-dim-lowres.jpg";
const SHOT18_SRC = "/images/portfolio-18-rhinestone-butterfly-bouquet.jpg";
const SHOT19_SRC = "/images/portfolio-19-rhinestone-butterfly-bouquet-alt.jpg";
const SHOT20_SRC = "/images/portfolio-20-client-with-bouquet.jpg";
const SHOT21_SRC = "/images/portfolio-21-client-with-bouquet-alt.jpg";
const SHOT22_SRC = "/images/portfolio-22-welcome-column-holiday-entry.jpg";
const SHOT23_SRC = "/images/portfolio-23-reception-table-setting.jpg";
const SHOT24_SRC = "/images/portfolio-24-album-launch-dual-backdrop.jpg";
const SHOT25_SRC = "/images/portfolio-25-engagement-arch-wide.jpg";
const SHOT26_SRC = "/images/portfolio-26-engagement-arch-closeup.jpg";
const SHOT27_SRC = "/images/portfolio-27-engagement-welcome-sign.jpg";
const SHOT28_SRC = "/images/portfolio-28-engagement-photo-display.jpg";
const ABBY2_SRC = "/images/founder-abby-2.jpg";
const CLIP1_SRC = "/videos/video-1-reveal-moment.mp4";
const CLIP2_SRC = "/videos/video-2-setup-walkthrough.mp4";
const CLIP3_SRC = "/videos/video-3-styling-in-motion.mp4";
const CLIP4_SRC = "/videos/video-4-event-highlight.mp4";
const POSTER1_SRC = "/videos/video-1-poster.jpg";
const POSTER2_SRC = "/videos/video-2-poster.jpg";
const POSTER3_SRC = "/videos/video-3-poster.jpg";
const POSTER4_SRC = "/videos/video-4-poster.jpg";
const ABBY1_SRC = "/images/founder-abby-1.jpg";

const INK = "#3A2B26";
const INK_SOFT = "#5C463E";
const PAPER = "#FCF2ED";
const WHITE = "#FFFFFF";
const GOLD = "#C98D93";
const GOLD_DEEP = "#A85F6B";
const BLUSH = "#E8B4B0";
const SAGE = "#8E9B7C";
const LINE = "#F0DCD3";
const CREAM_TEXT = "#3A2B26";
const CREAM_BG = "#FCF2ED";

const SERVICES = [
  { id: "decor", label: "Luxury décor & styling" },
  { id: "planning", label: "Event planning & coordination" },
  { id: "romantic", label: "Romantic & surprise experiences" },
  { id: "gifting", label: "Gifting — bouquets & boxes" },
  { id: "custom", label: "Custom experience" },
  { id: "unsure", label: "Not sure yet — just asking" },
];

const PACKAGES = [
  {
    category: "Luxury Décor & Styling",
    items: [
      { name: "Standard Décor Setup", now: "$350", popular: true, desc: "Balloon arches, backdrop, and basic table styling." },
      { name: "Deluxe Décor Setup", now: "$700", desc: "Full themed design with florals, luxury backdrops, lighting, and table styling." },
      { name: "Premium Luxury Setup", now: "$1,200", desc: "Complete event transformation — custom props, florals, and high-end finishes. Add-ons: name signage, neon lights, flower walls." },
    ],
  },
  {
    category: "Romantic & Surprise Experiences",
    items: [
      { name: "Room or Hotel Surprise", now: "$250", desc: "Perfect for birthdays, anniversaries, or \"just because\" — décor, candles, and personalized accents." },
      { name: "Dinner & Intimate Experiences", now: "$300", desc: "Custom-designed tablescapes for private dinners, date nights, or celebrations." },
      { name: "Proposal Setup", now: "$350", popular: true, desc: "Personalized romantic designs with candles, flowers, balloons, and message setup." },
    ],
  },
  {
    category: "Gifting & Presentation",
    items: [
      { name: "Flower Bouquet", now: "$50", desc: "Fresh or faux floral designs styled with elegance." },
      { name: "Gift Wrapping & Packaging", now: "$50", desc: "Luxury wrapping, themed boxes, or presentation baskets for any occasion." },
      { name: "Money Bouquet / Box", now: "$80", popular: true, desc: "Creative, luxurious money bouquet designs perfect for birthdays or surprises." },
    ],
  },
  {
    category: "Event Planning & Coordination",
    items: [
      { name: "Classic Planning Package", now: "$300", popular: true, desc: "Perfect for birthdays, bridal showers, or baby showers. Theme consultation, vendor coordination, and day-of management." },
      { name: "Corporate or Brand Events", now: "$600", desc: "Professional, elegant setups for launches, office parties, and corporate celebrations." },
      { name: "Premium Planning Package", now: "$900", desc: "Full-service planning — concept design to flawless execution, with vendor sourcing, decor design, and on-site management." },
    ],
  },
  {
    category: "Custom Experiences",
    items: [
      { name: "Personalized Event Concept", now: "$100", desc: "Design consultation for unique or themed experiences." },
      { name: "Rentals & Props", now: "On request", desc: "Luxury chairs, floral stands, or balloon frames — pricing varies by item and duration." },
    ],
  },
];

const TESTIMONIALS = [
  { quote: "I booked ẸWÀ for my birthday décor, and it was absolutely stunning. The colors, the setup, the whole vibe — it felt so luxurious and personal. Abby pays attention to every single detail, and it shows. Everyone couldn't stop taking pictures!", name: "Kim" },
  { quote: "I walked into the room and literally couldn't believe my eyes. It was breathtaking! Abby and the ẸWÀ team completely transformed the space — soft lights, elegant décor, everything felt so intentional. You can feel the love in her work.", name: "Temi" },
  { quote: "I ordered a money bouquet from ẸWÀ, and it was beyond perfect!", name: "A happy client" },
];
const CONTACT = { phone: "202-769-7282", email: "eventwithabby@gmail.com" };

const PORTFOLIO_TAGS = ["All", "Birthdays", "Dinners & corporate", "Backdrops", "Surprises", "Videos", "Engagements","Flower Bouquets"];

const GALLERY = [
  { type: "image", src: SHOT6_SRC, caption: "Engagement party gold", tags: ["Engagements","Backdrops"] },
  { type: "image", src: SHOT2_SRC, caption: "Flower Table Setup", tags: ["Birthdays", "Dinners & corporate"] },
  { type: "image", src: SHOT1_SRC, caption: "Autumn circle backdrop", tags: ["Birthdays", "Backdrops"] },
  { type: "image", src: SHOT5_SRC, caption: "Noir & gold dinner", tags: ["Dinners & corporate"] },
  { type: "image", src: SHOT4_SRC, caption: "Harvest banquet styling", tags: ["Dinners & corporate"] },
  { type: "image", src: SHOT3_SRC, caption: "Midnight surprise setup", tags: ["Birthdays", "Surprises"] },
  { type: "image", src: SHOT7_SRC, caption: "Ivory & champagne garlands", tags: ["Birthdays", "Backdrops"] },
  { type: "image", src: SHOT11_SRC, caption: "Master's Degree bouquet", tags: ["Flower Bouquets", "Surprises"] },
  { type: "image", src: SHOT13_SRC, caption: "Birthday suite luminaries", tags: ["Birthdays"] },
  { type: "image", src: SHOT14_SRC, caption: "Birthday suite dim wide", tags: ["Birthdays"] },
  { type: "image", src: SHOT15_SRC, caption: "Birthday bouquet bedside", tags: ["Birthdays"] },
  { type: "image", src: SHOT17_SRC, caption: "Birthday suite dim lowres", tags: ["Birthdays"] },
  { type: "image", src: SHOT18_SRC, caption: "Rhinestone butterfly bouquet", tags: ["Flower Bouquets"] },
  { type: "image", src: SHOT19_SRC, caption: "Rhinestone butterfly bouquet alt", tags: ["Flower Bouquets"] },
  { type: "image", src: SHOT20_SRC, caption: "Client with bouquet", tags: ["Flower Bouquets"] },
  { type: "image", src: SHOT21_SRC, caption: "Client with bouquet alt", tags: ["Flower Bouquets"] },
  { type: "image", src: SHOT22_SRC, caption: "Welcome column holiday entry", tags: ["Backdrops"] }, 
  { type: "image", src: SHOT23_SRC, caption: "Reception table setting", tags: ["Dinners & corporate"] },
  { type: "image", src: SHOT24_SRC, caption: "Album launch dual backdrop", tags: ["Backdrops"] },
  { type: "image", src: SHOT25_SRC, caption: "Engagement arch wide", tags: ["Engagements","Backdrops"] },
  { type: "image", src: SHOT26_SRC, caption: "Engagement arch closeup", tags: ["Engagements","Backdrops"] },
  { type: "image", src: SHOT27_SRC, caption: "Engagement welcome sign", tags: ["Engagements","Backdrops"] },
  { type: "image", src: SHOT28_SRC, caption: "Engagement photo display", tags: ["Engagements","Backdrops"] },

  { type: "video", src: CLIP1_SRC, poster: POSTER1_SRC, caption: "Reveal moment", tags: ["Videos"] },
  { type: "video", src: CLIP2_SRC, poster: POSTER2_SRC, caption: "Setup walkthrough", tags: ["Videos"] },
  { type: "video", src: CLIP3_SRC, poster: POSTER3_SRC, caption: "Styling in motion", tags: ["Videos"] },
  { type: "video", src: CLIP4_SRC, poster: POSTER4_SRC, caption: "Event highlight", tags: ["Videos"] },
];

const EVENT_TYPES = ["Birthday", "Wedding", "Baby shower", "Proposal", "Gender reveal", "Corporate", "Other"];
const BUDGETS = ["Under $300", "$300–$700", "$700–$1,500", "$1,500+", "Not sure yet"];
const STATUSES = ["New", "Quoted", "Confirmed"];

const SHAPES = [
  { id: "garlandArch", label: "Doorway arch" },
  { id: "circleFrame", label: "Circle backdrop" },
  { id: "ceilingCloud", label: "Ceiling garland" },
  { id: "centerpiece", label: "Table cluster" },
  { id: "tablescape", label: "Full tablescape" },
  { id: "flowerWall", label: "Flower wall" },
];

const DECOR_STYLES = [
  { id: "balloons", label: "Balloons" },
  { id: "florals", label: "Flowers" },
  { id: "mixed", label: "Mixed" },
];

const VENUES = [
  { id: "studio", label: "Blank studio", wall: "#EFE6D8", floor: "#8A6B4F", accent: "#DDD2BF" },
  { id: "banquet", label: "Banquet hall", wall: "#D9CDB8", floor: "#5C4632", accent: "#C9B896" },
  { id: "home", label: "Home / loft", wall: "#CFCAC2", floor: "#9C7B5A", accent: "#B8B2A6" },
  { id: "noir", label: "Evening venue", wall: "#2E2620", floor: "#1E1712", accent: "#4A3C2E" },
];

const PALETTES = [
  { id: "noirGold", label: "Noir & Gold", colors: ["#141010", "#C9A24E", "#EFE6D3"] },
  { id: "ivoryChampagne", label: "Ivory & Champagne", colors: ["#F3E8D6", "#C9A24E", "#E7DCC9"] },
  { id: "blushSage", label: "Blush & Sage", colors: ["#C97A82", "#7C8768", "#F3E8D6"] },
  { id: "rustOlive", label: "Rust & Olive", colors: ["#B5651D", "#6B6B47", "#D9C8A5"] },
];

function refCode(id) {
  return "EWA-" + id.slice(-5).toUpperCase();
}

function rowToInquiry(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    eventDate: row.event_date,
    eventType: row.event_type,
    guestCount: row.guest_count != null ? String(row.guest_count) : "",
    budget: row.budget,
    services: row.services || [],
    message: row.message,
    styleLook: row.saved_look ? `${row.saved_look.shapeLabel} · ${row.saved_look.paletteLabel}` : null,
    totalAmount: row.total_amount,
    styleImageUrl: row.saved_look?.imageUrl || null,
    status: row.status,
    createdIso: row.created_at,
  };
}


function inquiryToRow(inquiry, savedLookObj) {
  return {
    ref_code: refCode(inquiry.id),
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    event_date: inquiry.eventDate,
    event_type: inquiry.eventType,
    guest_count: inquiry.guestCount ? Number(inquiry.guestCount) : null,
    budget: inquiry.budget,
    services: inquiry.services,
    message: inquiry.message,
    saved_look: savedLookObj
      ? {
          shapeLabel: savedLookObj.shapeLabel,
          paletteLabel: savedLookObj.paletteLabel,
          imageUrl: savedLookObj.dataUrl && savedLookObj.dataUrl.startsWith("http") ? savedLookObj.dataUrl : null,
        }
      : null,
    status: inquiry.status,
  };
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function Ornament({ color = GOLD }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "18px 0" }}>
      <div style={{ height: 1, width: 40, background: color, opacity: 0.6 }} />
      <div style={{ width: 6, height: 6, transform: "rotate(45deg)", background: color }} />
      <div style={{ height: 1, width: 40, background: color, opacity: 0.6 }} />
    </div>
  );
}

function generatePositions(shape, count) {
  const pts = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  if (shape === "circleFrame") {
    const base = 2.9;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand(-0.05, 0.05);
      const r = base + rand(-0.35, 0.35);
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r * 1.08,
        z: rand(-0.35, 0.35),
        size: rand(0.24, 0.44),
      });
    }
  } else if (shape === "ceilingCloud") {
    for (let i = 0; i < count; i++) {
      const x = rand(-3.8, 3.8);
      const droop = Math.cos((x / 3.8) * (Math.PI / 2)) * 0.5;
      pts.push({
        x,
        y: 2.1 + droop + rand(-0.25, 0.25),
        z: rand(-0.45, 0.45),
        size: rand(0.22, 0.42),
      });
    }
  } else if (shape === "garlandArch") {
    const arcCount = Math.floor(count * 0.72);
    const legCount = Math.floor((count - arcCount) / 2);
    const R = 2.7;
    for (let i = 0; i < arcCount; i++) {
      const t = i / (arcCount - 1);
      const angle = t * Math.PI;
      const rr = R + rand(-0.28, 0.28);
      pts.push({
        x: Math.cos(angle) * rr,
        y: -0.4 + Math.sin(angle) * rr,
        z: rand(-0.32, 0.32),
        size: rand(0.24, 0.44),
      });
    }
    for (const side of [-1, 1]) {
      for (let i = 0; i < legCount; i++) {
        const t = i / legCount;
        pts.push({
          x: side * (R + rand(-0.22, 0.22)),
          y: -0.4 - t * 2.6,
          z: rand(-0.3, 0.3),
          size: rand(0.24, 0.42),
        });
      }
    }
  } else if (shape === "centerpiece") {
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const rr = 1.15 + rand(-0.18, 0.18);
      pts.push({
        x: Math.sin(phi) * Math.cos(theta) * rr,
        y: 1.5 + Math.cos(phi) * rr,
        z: Math.sin(phi) * Math.sin(theta) * rr,
        size: rand(0.22, 0.36),
      });
    }
  } else if (shape === "tablescape") {
    const runCount = Math.floor(count * 0.6);
    for (let i = 0; i < runCount; i++) {
      const t = i / Math.max(1, runCount - 1);
      const x = -2.2 + t * 4.4;
      pts.push({
        x: x + rand(-0.12, 0.12),
        y: -0.62 + rand(0, 0.3),
        z: rand(-0.28, 0.28),
        size: rand(0.16, 0.3),
      });
    }
    const clusterCount = count - runCount;
    for (let i = 0; i < clusterCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const phi = Math.acos(1 - 2 * ((i + 0.5) / clusterCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const rr = 0.55 + rand(-0.1, 0.1);
      pts.push({
        x: side * 1.7 + Math.sin(phi) * Math.cos(theta) * rr,
        y: 0.35 + Math.cos(phi) * rr * 0.8,
        z: Math.sin(phi) * Math.sin(theta) * rr,
        size: rand(0.14, 0.26),
      });
    }
  } else if (shape === "flowerWall") {
    const cols = Math.ceil(Math.sqrt(count * 1.6));
    const rows = Math.ceil(count / cols);
    let i = 0;
    for (let r = 0; r < rows && i < count; r++) {
      for (let c = 0; c < cols && i < count; c++) {
        const x = -2.9 + (c / (cols - 1)) * 5.8 + rand(-0.14, 0.14);
        const y = -1.7 + (r / (rows - 1)) * 4.0 + rand(-0.14, 0.14);
        pts.push({ x, y, z: rand(-0.18, 0.18), size: rand(0.2, 0.36) });
        i++;
      }
    }
  }
  return pts;
}

function addFlowerCluster(group, p, color) {
  const petalMat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 });
  const centerMat = new THREE.MeshStandardMaterial({ color: new THREE.Color("#F3E8D6"), roughness: 0.6 });
  const leafMat = new THREE.MeshStandardMaterial({ color: new THREE.Color("#7C8768"), roughness: 0.75 });

  const bloom = new THREE.Group();
  const petalCount = 6;
  for (let k = 0; k < petalCount; k++) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(p.size * 0.62, 8, 8), petalMat);
    const a = (k / petalCount) * Math.PI * 2;
    petal.position.set(Math.cos(a) * p.size * 0.55, Math.sin(a) * p.size * 0.55, 0);
    petal.scale.set(1, 1, 0.35);
    bloom.add(petal);
  }
  const center = new THREE.Mesh(new THREE.SphereGeometry(p.size * 0.4, 10, 10), centerMat);
  bloom.add(center);

  for (let k = 0; k < 2; k++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(p.size * 0.34, 6, 6), leafMat);
    leaf.position.set((k === 0 ? -1 : 1) * p.size * 0.7, -p.size * 0.6, -p.size * 0.1);
    leaf.scale.set(1.6, 0.5, 0.4);
    bloom.add(leaf);
  }

  bloom.position.set(p.x, p.y, p.z);
  bloom.lookAt(p.x, p.y, p.z + 1);
  bloom.rotation.z = Math.random() * Math.PI * 2;
  bloom.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  group.add(bloom);
}

function addPersonFigure(group, x, z, tone) {
  const skinMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(tone || "#8A6B54"), roughness: 0.7 });
  const clothMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(INK_SOFT), roughness: 0.8 });
  const person = new THREE.Group();

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), skinMat);
  head.position.y = 1.62;
  person.add(head);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.85, 12), clothMat);
  torso.position.y = 1.05;
  person.add(torso);

  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.85, 12), clothMat);
  legs.position.y = 0.28;
  person.add(legs);

  person.position.set(x, -3.2, z);
  person.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  group.add(person);
}

function BalloonVisualizer({ shape, palette, count, venue, decorStyle, showPeople, onSnapshot, onGeneratePreview, onSavePreviewToInquiry, previewLoading, previewUrl, previewRefinement, onRefinementChange }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 9.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffe9c2, 0.9);
    dir.position.set(4, 6, 6);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.left = -8;
    dir.shadow.camera.right = 8;
    dir.shadow.camera.top = 8;
    dir.shadow.camera.bottom = -8;
    scene.add(dir);
    const goldLight = new THREE.PointLight(0xc9a24e, 0.7, 24);
    goldLight.position.set(-3, 2, 4);
    scene.add(goldLight);

    const room = new THREE.Group();
    scene.add(room);

    const group = new THREE.Group();
    scene.add(group);

    let dragging = false;
    let lastX = 0, lastY = 0;
    let rotX = 0.1, rotY = 0;

    function onDown(e) {
      dragging = true;
      lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      lastY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    }
    function onMove(e) {
      if (!dragging) return;
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? lastX;
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? lastY;
      const dx = cx - lastX, dy = cy - lastY;
      lastX = cx; lastY = cy;
      rotY += dx * 0.006;
      rotX = Math.max(-0.5, Math.min(0.5, rotX + dy * 0.006));
    }
    function onUp() { dragging = false; }
    let zoom = 9.2;
    function onWheel(e) {
      e.preventDefault();
      zoom = Math.max(5.5, Math.min(14, zoom + e.deltaY * 0.01));
    }
    scene.background = new THREE.Color(0x1c1410);

    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    let frameId;
    function animate() {
      frameId = requestAnimationFrame(animate);
      const yaw = Math.max(-0.9, Math.min(0.9, rotY));
      const pitch = Math.max(-0.15, Math.min(0.45, rotX));
      camera.position.x = Math.sin(yaw) * zoom;
      camera.position.y = 0.6 + pitch * 4;
      camera.position.z = Math.cos(yaw) * zoom;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = mount.clientWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    stateRef.current = { scene, renderer, camera, group, room, el };

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("wheel", onWheel);
      group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
      if (mount.contains(el)) mount.removeChild(el);
    };
  }, []);

  useEffect(() => {
    const { room } = stateRef.current;
    if (!room) return;
    while (room.children.length) {
      const obj = room.children.pop();
      obj.geometry?.dispose();
      obj.material?.dispose();
    }
    const wallMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(venue.wall), roughness: 0.95, metalness: 0 });
    const floorMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(venue.floor), roughness: 0.85, metalness: 0.05 });
    const accentMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(venue.accent), roughness: 0.9, metalness: 0 });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.2;
    floor.receiveShadow = true;
    room.add(floor);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), wallMat);
    backWall.position.set(0, 4.8, -5.5);
    room.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), wallMat.clone());
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-9, 4.8, 0);
    room.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), wallMat.clone());
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(9, 4.8, 0);
    room.add(rightWall);

    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(30, 0.28, 0.06), accentMat);
    baseboard.position.set(0, -3.05, -5.45);
    room.add(baseboard);

    const frameMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(venue.accent), roughness: 0.8 });
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 6.4, 0.1), frameMat);
    doorL.position.set(-6.4, 0, -5.4);
    room.add(doorL);
    const doorR = doorL.clone();
    doorR.position.x = -4.4;
    room.add(doorR);
    const doorTop = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.18, 0.1), frameMat);
    doorTop.position.set(-5.4, 3.2, -5.4);
    room.add(doorTop);
  }, [venue]);

  useEffect(() => {
    const { group } = stateRef.current;
    if (!group) return;
    while (group.children.length) {
      const obj = group.children.pop();
      obj.geometry?.dispose();
      obj.material?.dispose();
    }
    const positions = generatePositions(shape, count);
    positions.forEach((p, i) => {
      const color = new THREE.Color(palette[i % palette.length]);
      const useFlower = decorStyle === "florals" || (decorStyle === "mixed" && i % 3 === 0);
      if (useFlower) {
        addFlowerCluster(group, p, color);
      } else {
        const geo = new THREE.SphereGeometry(p.size, 20, 20);
        const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.25 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(p.x, p.y, p.z);
        mesh.scale.y = 1.14;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
      }
    });

    if (showPeople) {
      addPersonFigure(group, -3.6, 1.9, "#8A6B54");
      addPersonFigure(group, 3.4, 2.3, "#5C4432");
    }

    const goldMat = () => new THREE.MeshStandardMaterial({ color: new THREE.Color(GOLD_DEEP), metalness: 0.7, roughness: 0.3 });
    const clothMat = () => new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.9 });

    if (shape === "centerpiece") {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.6, 12), goldMat());
      stand.position.set(0, -0.6, 0);
      group.add(stand);
      const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.14, 32), clothMat());
      tableTop.position.set(0, -1.45, 0);
      group.add(tableTop);
      const tableSkirt = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.35, 1.7, 32, 1, true), clothMat());
      tableSkirt.position.set(0, -2.35, 0);
      group.add(tableSkirt);
    }

    if (shape === "tablescape") {
      const tableTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.16, 1.7), clothMat());
      tableTop.position.set(0, -0.85, 0);
      group.add(tableTop);
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.2, 1.7), clothMat());
      skirt.position.set(0, -2.0, 0);
      group.add(skirt);
      const runnerMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(palette[0]), roughness: 0.8 });
      const runner = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.02, 0.6), runnerMat);
      runner.position.set(0, -0.75, 0);
      group.add(runner);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.1 });
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        for (const zSide of [-1, 1]) {
          const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 24), plateMat);
          plate.position.set(i * 1.0, -0.74, zSide * 0.55);
          group.add(plate);
        }
      }
      for (const x of [-1.1, 0, 1.1]) {
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 10), goldMat());
        candle.position.set(x, -0.45, 0);
        group.add(candle);
        const flameMat = new THREE.MeshStandardMaterial({ color: 0xffdf9e, emissive: 0xffb84d, emissiveIntensity: 0.9 });
        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), flameMat);
        flame.position.set(x, -0.13, 0);
        flame.scale.y = 1.5;
        group.add(flame);
      }
    }
  }, [shape, palette, count, decorStyle, showPeople]);

  function handleSnapshot() {
    const { renderer, scene, camera } = stateRef.current;
    if (!renderer) return;
    renderer.render(scene, camera);
    const url = renderer.domElement.toDataURL("image/jpeg", 0.7);
    onSnapshot(url);
  }

  return (
    <div>
      <div
        ref={mountRef}
        style={{
          width: "100%", height: 440, borderRadius: 4, overflow: "hidden", cursor: "grab",
          background: `radial-gradient(ellipse at 50% 40%, #3A2C1E 0%, ${INK} 65%)`,
          border: `1px solid rgba(201,141,147,0.35)`, position: "relative",
        }}
      />
      <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.08em", color: "#8A746B", marginTop: 10, textAlign: "center" }}>
        DRAG TO ROTATE · SCROLL TO ZOOM
      </div>
      <button
        className="cta-btn"
        onClick={handleSnapshot}
        style={{
          display: "block", margin: "18px auto 0", background: GOLD, color: INK, border: "none", borderRadius: 30,
          padding: "13px 26px", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        }}
      >
        Save this look to my inquiry
      </button>
      <input
        value={previewRefinement}
        onChange={(e) => onRefinementChange(e.target.value)}
        placeholder="Describe the full scene — e.g. 'with a table setup and guests mingling'…"
        style={{ width: "100%", marginTop: 14, border: `1px solid ${LINE}`, borderRadius: 20, padding: "10px 16px", fontSize: 13, fontFamily: "'Manrope', sans-serif" }}
      />
      <button
        onClick={onGeneratePreview}
        disabled={previewLoading}
        style={{
          display: "block", margin: "10px auto 0", background: "transparent", color: GOLD_DEEP,
          border: `1px solid ${GOLD}`, borderRadius: 30, padding: "13px 26px", fontSize: 12.5,
          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
        }}
      >
        {previewLoading ? "Generating…" : previewUrl ? "✦ Generate another" : "✦ Generate realistic preview"}
      </button>
      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <img src={previewUrl} alt="AI-generated realistic preview" style={{ width: "100%", borderRadius: 8, border: `1px solid rgba(201,141,147,0.35)` }} />
          <div className="mono" style={{ fontSize: 9.5, color: "#8A746B", marginTop: 6, letterSpacing: "0.04em", textAlign: "center" }}>
            AI CONCEPT — FINAL LOOK MAY VARY
          </div>
          <button onClick={onSavePreviewToInquiry} className="cta-btn" style={{ display: "block", margin: "12px auto 0", background: GOLD, color: INK, border: "none", borderRadius: 20, padding: "9px 20px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Use this preview in my inquiry
          </button>
        </div>
      )}
    </div>
  );
}

function VideoTile({ src, poster, style }) {
  return (
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      style={{ ...style, background: "#000" }}
    />
  );
}

export default function EwaApp() {
  const [view, setView] = useState("home");
  const [viewHistory, setViewHistory] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("owner") === "ledger") {
        setView("ledger");
      } else {
        const v = params.get("view");
        const validViews = ["home", "concierge", "visualize", "services", "portfolio", "about", "testimonials", "inquire"];
        if (v && validViews.includes(v)) setView(v);
      }
    }
  }, []);

  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("owner") === "ledger") {
        setView("ledger");
        return;
      }
      const v = params.get("view");
      const validViews = ["home", "concierge", "visualize", "services", "portfolio", "about", "testimonials", "inquire"];
      setView(v && validViews.includes(v) ? v : "home");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 30);
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [inquiries, setInquiries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentConfirmation, setPaymentConfirmation] = useState(null);
  const [ledgerUnlocked, setLedgerUnlocked] = useState(false);
  const [ledgerPasswordInput, setLedgerPasswordInput] = useState("");
  const [ledgerError, setLedgerError] = useState("");
  const [ledgerChecking, setLedgerChecking] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [form, setForm] = useState({
    eventDate: "", eventType: EVENT_TYPES[0], guestCount: "", budget: BUDGETS[0],
    name: "", email: "", phone: "", message: "",
  });
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(null);
  const [vizShape, setVizShape] = useState("garlandArch");
  const [vizDecorStyle, setVizDecorStyle] = useState("balloons");
  const [vizShowPeople, setVizShowPeople] = useState(false);
  const [vizPaletteId, setVizPaletteId] = useState("noirGold");
  const [customColors, setCustomColors] = useState(["#C97A82", "#C9A24E", "#F3E8D6"]);
  const [vizVenueId, setVizVenueId] = useState("studio");
  const [vizCount, setVizCount] = useState(46);
  const [savedLook, setSavedLook] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewRefinement, setPreviewRefinement] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const formRef = useRef(null);
  const chatEndRef = useRef(null);

  const vizVenue = VENUES.find((v) => v.id === vizVenueId);
  const vizPalette = vizPaletteId === "custom"
    ? { id: "custom", label: `Custom (${customColors.join(", ")})`, colors: customColors }
    : PALETTES.find((p) => p.id === vizPaletteId);

  useEffect(() => {
    (async () => {
      if (!supabase) {
        setLoaded(true);
        return;
      }
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("event_date", { ascending: true });
      if (!error && data) setInquiries(data.map(rowToInquiry));
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("ewa_ledger_unlocked") === "1") {
      setLedgerUnlocked(true);
    }
  }, []);


  useEffect(() => {
  (async () => {
    if (typeof window === "undefined" || !supabase) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success") return;
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();
    if (!payment) return;

    const { data: inquiry } = await supabase
      .from("inquiries")
      .select("total_amount")
      .eq("id", payment.inquiry_id)
      .single();

    const { data: paidPayments } = await supabase
      .from("payments")
      .select("amount")
      .eq("inquiry_id", payment.inquiry_id)
      .eq("status", "paid");

    const totalPaid = (paidPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);
    const total = inquiry?.total_amount ? Number(inquiry.total_amount) : null;
    const remaining = total !== null ? total - totalPaid : null;

    setPaymentConfirmation({ label: payment.label, amount: Number(payment.amount), totalPaid, total, remaining });
    window.history.replaceState({}, "", window.location.pathname);
  })();
}, []);


if (paymentConfirmation) {
  return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 4, padding: "48px 36px", textAlign: "center", maxWidth: 420, boxShadow: "0 20px 50px -20px rgba(28,20,16,0.15)" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", border: `2px solid ${SAGE}`, margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 30, color: SAGE }}>✓</span>
        </div>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: SAGE, marginBottom: 12 }}>PAYMENT CONFIRMED</div>
        <h2 className="display" style={{ margin: "0 0 10px", fontSize: 28 }}>Thank you!</h2>
        <p style={{ fontSize: 15, color: INK, marginBottom: 4 }}>
          {paymentConfirmation.label} — <strong>${paymentConfirmation.amount.toFixed(2)}</strong>
        </p>
        {paymentConfirmation.total !== null && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${LINE}` }}>
            <p style={{ fontSize: 13, color: "#8A746B", margin: "4px 0" }}>Total quote: ${paymentConfirmation.total.toFixed(2)}</p>
            <p style={{ fontSize: 13, color: "#8A746B", margin: "4px 0" }}>Paid so far: ${paymentConfirmation.totalPaid.toFixed(2)}</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: paymentConfirmation.remaining <= 0 ? SAGE : GOLD_DEEP, margin: "10px 0 0" }}>
              {paymentConfirmation.remaining <= 0 ? "Paid in full 🤍" : `Remaining balance: $${paymentConfirmation.remaining.toFixed(2)}`}
            </p>
          </div>
        )}
        <button
          className="cta-btn"
          onClick={() => { setPaymentConfirmation(null); go("home"); }}
          style={{ marginTop: 28, background: INK, color: WHITE, border: "none", borderRadius: 30, padding: "13px 26px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Return to site
        </button>
      </div>
    </div>
  );
}

  async function checkLedgerPassword() {
    setLedgerChecking(true);
    setLedgerError("");
    try {
      const res = await fetch("/api/ledger-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ledgerPasswordInput }),
      });
      const data = await res.json();
      if (data.ok) {
        setLedgerUnlocked(true);
        sessionStorage.setItem("ewa_ledger_unlocked", "1");
        setLedgerPasswordInput("");
      } else {
        setLedgerError(data.error || "Incorrect password.");
      }
    } catch (e) {
      setLedgerError("Could not verify — please try again.");
    }
    setLedgerChecking(false);
  }

  function toggleService(id) {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function go(v) {
    setViewHistory((prev) => [...prev, view]);
    setView(v);
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      const url = v === "home" ? window.location.pathname : `${window.location.pathname}?view=${v}`;
      window.history.pushState({ view: v }, "", url);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 30);
  }

  function goBack() {
    setViewHistory((prev) => {
      const last = prev.length === 0 ? "home" : prev[prev.length - 1];
      setView(last);
      if (typeof window !== "undefined") {
        const url = last === "home" ? window.location.pathname : `${window.location.pathname}?view=${last}`;
        window.history.pushState({ view: last }, "", url);
      }
      return prev.length === 0 ? prev : prev.slice(0, -1);
    });
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 30);
  }

function PaymentsPanel({ inquiry, payments, onSend }) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const list = payments.filter((p) => p.inquiry_id === inquiry.id);
  const [savingQuote, setSavingQuote] = useState(false);
  const [quoteSaved, setQuoteSaved] = useState(false);

  async function handleSend() {
    setError("");
    if (!label.trim() || !amount || Number(amount) <= 0) {
      setError("Add a label and a valid amount.");
      return;
    }
    setSending(true);
    await onSend(inquiry, label.trim(), Number(amount));
    setSending(false);
    setLabel("");
    setAmount("");
  }

  return (
    <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 12, paddingTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 10, color: "#8A746B" }}>QUOTE TOTAL:</span>
        <input
          defaultValue={inquiry.totalAmount || ""}
          onBlur={async (e) => {
            const val = Number(e.target.value);
            if (!val) return;
            setSavingQuote(true);
            setQuoteSaved(false);
            const { error } = await supabase.from("inquiries").update({ total_amount: val }).eq("id", inquiry.id);
            setSavingQuote(false);
            if (error) {
              alert("Could not save quote total: " + error.message);
              return;
            }
            inquiry.totalAmount = val;
            setQuoteSaved(true);
            setTimeout(() => setQuoteSaved(false), 2000);
          }}
          placeholder="$700"
          style={{ width: 80, fontSize: 12, border: `1px solid ${LINE}`, borderRadius: 12, padding: "3px 8px" }}
        />
        {savingQuote && <span style={{ fontSize: 10, color: "#8A746B" }}>saving…</span>}
        {quoteSaved && <span style={{ fontSize: 10, color: SAGE }}>✓ saved</span>}
      </div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: "#8A746B", marginBottom: 7, textTransform: "uppercase" }}>Payments</div>
      {list.length === 0 ? (
        <div style={{ fontSize: 12, color: "#B0A090", fontStyle: "italic" }}>No payments yet.</div>
      ) : (
        list.map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${LINE}` }}>
            <span style={{ fontSize: 13, color: INK }}>{p.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>${Number(p.amount).toLocaleString()}</span>
              <span style={{
                background: p.status === "paid" ? "#EEF0E8" : "#F5EBD8",
                color: p.status === "paid" ? SAGE : GOLD_DEEP,
                fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700,
              }}>
                {p.status.toUpperCase()}
              </span>
              {p.checkout_url && (
                <button
                  onClick={() => navigator.clipboard.writeText(p.checkout_url)}
                  style={{ background: "transparent", border: "none", color: GOLD_DEEP, fontSize: 10, textDecoration: "underline", cursor: "pointer" }}
                >
                  Copy link
                </button>
              )}
            </div>
          </div>
        ))
      )}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" style={{ flex: 1, fontSize: 12, border: `1px solid ${LINE}`, borderRadius: 16, padding: "6px 10px", fontFamily: "'Manrope', sans-serif" }} />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$" type="number" style={{ width: 70, fontSize: 12, border: `1px solid ${LINE}`, borderRadius: 16, padding: "6px 10px", fontFamily: "'Manrope', sans-serif" }} />
        <button onClick={handleSend} disabled={sending} style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD_DEEP, borderRadius: 16, padding: "6px 14px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
          {sending ? "…" : "+ Send"}
        </button>
      </div>
      {error && <div style={{ color: BLUSH, fontSize: 12, marginTop: 6 }}>{error}</div>}
    </div>
  );
}
  function BackButton() {
    if (view === "home") return null;
    return (
      <button
        onClick={goBack}
        className="ghost-btn"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "transparent",
          border: "none", color: GOLD_DEEP, fontSize: 12.5, fontWeight: 600, padding: "4px 0", marginBottom: 16,
        }}
      >
        ← Back
      </button>
    );
  }

  function scrollToForm() {
    go("inquire");
  }
useEffect(() => {
  (async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: true });
    if (!error && data) setPayments(data);
  })();
}, []);
  function handleSaveLook(dataUrl) {
    const shapeLabel = SHAPES.find((s) => s.id === vizShape).label;
    const styleLabel = DECOR_STYLES.find((d) => d.id === vizDecorStyle).label;
    const note = `Style reference: ${shapeLabel} (${styleLabel}) in ${vizPalette.label} — pictured in a ${vizVenue.label.toLowerCase()} setting.`;
    setForm((f) => ({ ...f, message: f.message ? `${f.message}\n${note}` : note }));
    setSavedLook({ shapeLabel, paletteLabel: vizPalette.label, dataUrl });
    scrollToForm();
  }

  async function generateRealisticPreview() {
    setPreviewLoading(true);
    setPreviewUrl(null);
    try {
      const res = await fetch("/api/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shapeLabel: SHAPES.find((s) => s.id === vizShape).label,
          colors: vizPalette.colors,
          venueId: vizVenueId,
          packageName: null,
          refinement: previewRefinement,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) setPreviewUrl(data.imageUrl);
    } catch (e) {
      // fail silently — nice-to-have, not core functionality
    }
    setPreviewLoading(false);
  }

  function saveGeneratedPreviewToInquiry() {
    const note = `Realistic AI preview generated: ${SHAPES.find((s) => s.id === vizShape).label} in ${vizPalette.label}${previewRefinement ? ` — ${previewRefinement}` : ""}.`;
    setForm((f) => ({ ...f, message: f.message ? `${f.message}\n${note}` : note }));
    setSavedLook({ shapeLabel: SHAPES.find((s) => s.id === vizShape).label, paletteLabel: vizPalette.label, dataUrl: previewUrl });
    scrollToForm();
  }

async function sendPaymentLink(inquiry, label, amount) {
  const alreadyPaid = payments
    .filter((p) => p.inquiry_id === inquiry.id && p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const res = await fetch("/api/create-payment-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inquiryId: inquiry.id,
      label,
      amount,
      refCode: refCode(inquiry.id),
      customerEmail: inquiry.email,
      customerName: inquiry.name,
      totalAmount: inquiry.totalAmount,
      alreadyPaid,
    }),
  });
  const data = await res.json();
  if (data.error) {
    alert(data.error.message);
    return;
  }
  const { data: row, error } = await supabase
    .from("payments")
    .insert({ inquiry_id: inquiry.id, label, amount, status: "sent", stripe_session_id: data.sessionId, checkout_url: data.url })
    .select()
    .single();
  if (!error) {
    setPayments((prev) => [...prev, row]);
  }
}

  async function submitInquiry() {
    if (selectedServices.length === 0) return setError("Pick at least one service.");
    if (!form.eventDate) return setError("Add your event date.");
    if (!form.name.trim() || !form.email.trim()) return setError("Add your name and email.");
    if (!supabase) return setError("Storage isn't connected yet — add your Supabase keys to .env.local (see DEPLOYMENT.md).");
    setError("");
    const draft = {
      id: `${Date.now()}`,
      services: selectedServices.map((sid) => SERVICES.find((s) => s.id === sid).label),
      ...form,
      guestCount: form.guestCount.trim(),
      status: "New",
    };
    const row = inquiryToRow(draft, savedLook);
    const { data, error } = await supabase.from("inquiries").insert(row).select().single();
    if (error) {
      setError("Could not submit — please try again in a moment.");
      return;
    }
    const inquiry = rowToInquiry(data);
    setInquiries((prev) => [...prev, inquiry].sort((a, b) => a.eventDate.localeCompare(b.eventDate)));

    fetch("/api/notify-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...draft, savedLook }),
  }).catch(() => {});

    setConfirmed(inquiry);
    setSelectedServices([]);
    setSavedLook(null);
    setPreviewUrl(null);
    setPreviewRefinement("");
    setForm({ eventDate: "", eventType: EVENT_TYPES[0], guestCount: "", budget: BUDGETS[0], name: "", email: "", phone: "", message: "" });
  }

  async function cycleStatus(id) {
    if (!supabase) return;
    const inq = inquiries.find((i) => i.id === id);
    if (!inq) return;
    const idx = STATUSES.indexOf(inq.status);
    const nextStatus = STATUSES[(idx + 1) % STATUSES.length];
    const { error } = await supabase.from("inquiries").update({ status: nextStatus }).eq("id", id);
    if (!error) {
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: nextStatus } : i)));
    }
  }

async function removeInquiry(id) {
  if (!supabase) return;
  const confirmed = window.confirm("Are you sure you want to permanently remove this inquiry and its payment history? This can't be undone.");
  if (!confirmed) return;

  await supabase.from("payments").delete().eq("inquiry_id", id);
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) {
    alert("Could not remove: " + error.message);
    return;
  }
  setInquiries((prev) => prev.filter((i) => i.id !== id));
  setPayments((prev) => prev.filter((p) => p.inquiry_id !== id));
}

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatBusy]);

  function localConcierge(text) {
    const t = text.toLowerCase();
    const COLOR_MAP = [
      ["burgundy", "#6E1423"], ["maroon", "#6E1423"], ["wine", "#722F37"],
      ["gold", "#C9A24E"], ["champagne", "#EFDCB9"], ["silver", "#C0C0C8"],
      ["black", "#141010"], ["noir", "#141010"], ["white", "#F7F2E8"], ["ivory", "#F3E8D6"],
      ["blush", "#E8B4B8"], ["pink", "#E8A0B4"], ["rose", "#D98E9C"], ["red", "#B02E2E"],
      ["sage", "#7C8768"], ["green", "#4E6B4E"], ["emerald", "#2E6B4F"], ["olive", "#6B6B47"],
      ["blue", "#3A5A8C"], ["navy", "#22304A"], ["royal", "#2E4A9E"], ["teal", "#2E6B6B"],
      ["purple", "#6B4E8C"], ["lavender", "#B8A0D0"], ["lilac", "#C0A8D8"],
      ["orange", "#D97B2E"], ["rust", "#B5651D"], ["terracotta", "#C06B4E"],
      ["yellow", "#E8C84E"], ["cream", "#F3E8D6"], ["brown", "#7A5A3E"], ["nude", "#D9BFA5"],
    ];
    const found = [];
    for (const [name, hex] of COLOR_MAP) {
      if (t.includes(name) && !found.includes(hex)) found.push(hex);
      if (found.length >= 3) break;
    }
    const hasOccasion = /(birthday|wedding|shower|proposal|reveal|anniversary|graduation|corporate|party|dinner|brunch|engagement|retirement|christening|naming)/.test(t);
    if (!hasOccasion && found.length === 0) {
      return {
        reply: "I'd love to style this for you! Tell me the occasion, the colors you're dreaming of, and roughly how many guests.",
        suggestion: null,
      };
    }
    const colors = found.length >= 3 ? found : [...found, "#C9A24E", "#F3E8D6", "#141010"].slice(0, 3);
    let shapeId = "garlandArch", shapeLabel = "Doorway arch", packageName = "Standard Décor Setup", packageFrom = "$350";
    if (/(dinner|tablescape|table|seated|banquet|brunch|intimate|date)/.test(t)) {
      shapeId = "tablescape"; shapeLabel = "Full tablescape"; packageName = "Dinner & Intimate Experience"; packageFrom = "$300";
    } else if (/(photo|backdrop|picture|selfie|wall)/.test(t)) {
      shapeId = "circleFrame"; shapeLabel = "Circle backdrop"; packageName = "Standard Décor Setup"; packageFrom = "$350";
    } else if (/(surprise|proposal|romantic|hotel|room)/.test(t)) {
      shapeId = "ceilingCloud"; shapeLabel = "Ceiling garland"; packageName = /propos/.test(t) ? "Proposal Setup" : "Room or Hotel Surprise"; packageFrom = /propos/.test(t) ? "$350" : "$250";
    } else if (/(wedding|full|everything|premium|transform)/.test(t)) {
      shapeId = "garlandArch"; shapeLabel = "Doorway arch"; packageName = "Deluxe Décor Setup"; packageFrom = "$700";
    }
    const venueId = /(home|house|apartment|loft)/.test(t) ? "home"
      : /(hall|venue|ballroom|hotel|banquet)/.test(t) ? "banquet"
      : /(evening|night|moody|dark)/.test(t) ? "noir" : "studio";
    return {
      reply: "Beautiful choice — here's a direction I'd love for this. Tap below to see it in 3D, or send it with your inquiry and Ẹwà will tailor it from there.",
      suggestion: { shapeId, shapeLabel, colors, venueId, packageName, packageFrom, rationale: "Styled from the details you shared." },
    };
  }

  async function callConciergeAPI(prompt) {
    const response = await fetch("/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const bodyText = await response.text();
    let data;
    try {
      data = JSON.parse(bodyText);
    } catch {
      throw new Error(`Bad response (${response.status})`);
    }
    if (!response.ok || data.error) {
      throw new Error(data?.error?.message || `Request failed (${response.status})`);
    }
    const raw = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text || "")
      .join("")
      .replace(/```json|```/g, "")
      .trim();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try { parsed = JSON.parse(raw.slice(start, end + 1)); } catch { parsed = null; }
      }
    }
    if (!parsed || typeof parsed.reply !== "string") {
      if (raw) return { reply: raw, suggestion: null };
      throw new Error("Empty response");
    }
    return parsed;
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatBusy) return;
    setChatInput("");
    const history = [...chatMessages, { role: "user", text }];
    setChatMessages(history);
    setChatBusy(true);

    const contact = { phone: "202-769-7282", email: "eventwithabby@gmail.com" };
    const convo = history.map((m) => `${m.role === "user" ? "Client" : "Concierge"}: ${m.text}`).join("\n");
    const prompt = `You are the style concierge for Ẹwà (Events with Abby), a luxury event styling studio in Charlotte, NC, founded by Abby. Ewa means "beauty" in Yoruba. Tagline: "Where intentionality meets elegance."
Abby's direct contact: phone ${contact.phone}, email ${contact.email}. If a client asks to speak with a human, reach Abby directly, wants her contact info, or asks for a phone number/Instagram/etc, give them this phone number and email directly and warmly point them to the inquiry form as the fastest way to get a tailored quote. Never say you don't have her contact info, never invent a different contact method, and never ask them to leave their info in the chat.

Services & starting prices (currently discounted): Luxury decor — Standard $350, Deluxe $700, Premium $1,200 (add-ons: name signage, neon lights, flower walls). Event planning — Classic $300, Premium $900, Corporate $600. Romantic & surprise — Proposal setup $350, Room/hotel surprise $250, Dinner & intimate tablescapes $300. Gifting — Flower bouquet $50, Money bouquet/box $80, Gift wrapping $50. Custom event concept consultation $100. All bookings require a consultation for a tailored quote.

A client is describing their dream event. Respond warmly and briefly (2-4 sentences), like a boutique stylist — elegant but not stuffy. Then recommend ONE design. Mention once, naturally, that after picking a design they can describe a full scene (like "with a table setup" or "add guests mingling") to generate a realistic AI preview image of the whole thing.

Available shapes (use the exact id): garlandArch (doorway arch), circleFrame (circle backdrop), ceilingCloud (ceiling garland), centerpiece (table cluster), tablescape (full tablescape with plates & candles).
Available venue ids: studio, banquet, home, noir (evening/moody).

Conversation so far:
${convo}


Respond ONLY with valid JSON, no markdown fences, in exactly this format:
{"reply": "your conversational message", "suggestion": {"shapeId": "one of the shape ids", "shapeLabel": "human label", "colors": ["#hex1", "#hex2", "#hex3"], "venueId": "one of the venue ids", "packageName": "short package name matching the real menu", "packageFrom": "$X", "rationale": "one sentence on why this suits them"}}

If the client hasn't given enough detail yet (no occasion or vibe at all), set "suggestion" to null and use "reply" to ask one warm clarifying question.`;

    let parsed = null;
    for (let attempt = 0; attempt < 2 && !parsed; attempt++) {
      try {
        parsed = await callConciergeAPI(prompt);
      } catch (e) {
        parsed = null;
        if (attempt === 0) await new Promise((r) => setTimeout(r, 600));
      }
    }
    if (!parsed) {
      parsed = localConcierge(history.filter((m) => m.role === "user").map((m) => m.text).join(" "));
    }

    let suggestion = parsed.suggestion || null;
    if (suggestion) {
      const validShape = SHAPES.some((sh) => sh.id === suggestion.shapeId);
      const validColors = Array.isArray(suggestion.colors) && suggestion.colors.length >= 1 &&
        suggestion.colors.every((c) => typeof c === "string" && /^#[0-9a-fA-F]{6}$/.test(c.trim()));
      if (!validShape || !validColors) suggestion = null;
      else {
        suggestion = {
          shapeId: suggestion.shapeId,
          shapeLabel: suggestion.shapeLabel || SHAPES.find((sh) => sh.id === suggestion.shapeId).label,
          colors: suggestion.colors.slice(0, 3).map((c) => c.trim()),
          venueId: VENUES.some((v) => v.id === suggestion.venueId) ? suggestion.venueId : "studio",
          packageName: suggestion.packageName || "Custom design",
          packageFrom: suggestion.packageFrom || "$250",
          rationale: suggestion.rationale || "",
        };
      }
    }

    setChatMessages((prev) => [...prev, { role: "assistant", text: parsed.reply, suggestion }]);
    setChatBusy(false);
  }

  function applySuggestionToVisualizer(s) {
    if (SHAPES.some((sh) => sh.id === s.shapeId)) setVizShape(s.shapeId);
    if (Array.isArray(s.colors) && s.colors.length >= 3) {
      setCustomColors(s.colors.slice(0, 3));
      setVizPaletteId("custom");
    }
    if (VENUES.some((v) => v.id === s.venueId)) setVizVenueId(s.venueId);
    setView("visualize");
  }

  function applySuggestionToInquiry(s) {
    const note = `Concierge suggestion: ${s.shapeLabel} in ${(s.colors || []).join(", ")} — ${s.packageName} (from ${s.packageFrom}). ${s.rationale || ""}`.trim();
    setForm((f) => ({ ...f, message: f.message ? `${f.message}\n${note}` : note }));
    setSavedLook({ shapeLabel: s.shapeLabel, paletteLabel: (s.colors || []).join(", "), dataUrl: null });
    scrollToForm();
  }

  function selectServiceAndInquire(categoryName, item) {
    const categoryServiceMap = {
      "Event Planning & Coordination": "planning",
      "Luxury Décor & Styling": "decor",
      "Romantic & Surprise Experiences": "romantic",
      "Gifting & Presentation": "gifting",
      "Custom Experiences": "custom",
    };
    const serviceId = categoryServiceMap[categoryName];
    if (serviceId && !selectedServices.includes(serviceId)) {
      setSelectedServices((prev) => [...prev, serviceId]);
    }
    const priceLabel = item.now === "On request" ? item.now : `from ${item.now}`;
    const note = `Interested in: ${item.name} (${priceLabel})`;
    setForm((f) => ({ ...f, message: f.message ? `${f.message}\n${note}` : note }));
    scrollToForm();
  }

  const upcoming = useMemo(
    () => inquiries.filter((i) => i.eventDate >= todayIso()).sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
    [inquiries]
  );

  const inputStyle = {
    border: "none", borderBottom: `1.5px solid ${LINE}`, borderRadius: 0, padding: "12px 2px", fontSize: 15,
    fontFamily: "'Manrope', sans-serif", background: "transparent", color: INK, width: "100%",
  };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: GOLD_DEEP, marginBottom: 8, display: "block", letterSpacing: "0.14em", textTransform: "uppercase" };

  return (
    <div style={{ minHeight: "100vh", background: PAPER, fontFamily: "'Manrope', sans-serif", color: INK }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .display { font-family: 'Cormorant Garamond', serif; }
        .script { font-family: 'Pinyon Script', cursive; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        button { cursor: pointer; font-family: inherit; }
        button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 3px; }
        .svc-card { transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease; }
        .svc-card:hover { transform: translateY(-2px); border-color: ${GOLD} !important; }
        .gallery-img { transition: transform 0.5s ease, filter 0.4s ease; filter: saturate(0.94); }
        .gallery-frame:hover .gallery-img { transform: scale(1.06); filter: saturate(1.05); }
        .cta-btn { transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease; }
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -8px rgba(201,141,147,0.5); }
        .ghost-btn { transition: border-color 0.15s ease, color 0.15s ease; }
        .ghost-btn:hover { border-color: ${GOLD}; color: ${GOLD_DEEP}; }
        .shape-btn, .swatch-btn { transition: border-color 0.15s ease, transform 0.15s ease; }
        .shape-btn:hover, .swatch-btn:hover { transform: translateY(-2px); }
        select, textarea { font-family: 'Manrope', sans-serif; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.55) sepia(1) saturate(3) hue-rotate(1deg); }
        input[type="range"] { accent-color: ${GOLD}; }
        @media (max-width: 760px) {
          .svc-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 56px !important; }
          .shape-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `,
        }}
      />

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              style={{ background: "none", border: "none", padding: 6, display: "flex", flexDirection: "column", gap: 5 }}
            >
              <span style={{ width: 22, height: 2, background: CREAM_TEXT, display: "block" }} />
              <span style={{ width: 22, height: 2, background: CREAM_TEXT, display: "block" }} />
              <span style={{ width: 14, height: 2, background: GOLD, display: "block" }} />
            </button>
            <button onClick={() => go("home")} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <img src={LOGO_SRC} alt="Ẹwà logo" style={{ width: 34, height: 34, objectFit: "contain" }} />
              <span className="display" style={{ color: CREAM_TEXT, fontSize: 20, letterSpacing: "0.02em" }}>Ẹwà</span>
            </button>
          </div>
          <button
            onClick={() => go("inquire")}
            style={{ border: "none", padding: "9px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              background: GOLD, color: INK, textTransform: "uppercase" }}
          >
            Inquire
          </button>
        </div>
      </div>

      {/* SIDEBAR DRAWER */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.55)" }}
        />
      )}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, width: 280, maxWidth: "82vw",
        background: WHITE, borderRight: `1px solid ${LINE}`, boxShadow: "8px 0 30px -12px rgba(58,43,38,0.12)",
        transform: menuOpen ? "translateX(0)" : "translateX(-102%)",
        transition: "transform 0.28s ease", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${LINE}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={LOGO_SRC} alt="" style={{ width: 30, height: 30, objectFit: "contain" }} />
            <span className="display" style={{ color: CREAM_TEXT, fontSize: 18 }}>Ẹwà</span>
          </div>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", color: CREAM_TEXT, fontSize: 22, lineHeight: 1 }}>×</button>
        </div>
        <nav style={{ padding: "14px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {[
            { id: "home", label: "Home" },
            { id: "concierge", label: "✦ Style Concierge" },
            { id: "visualize", label: "3D Visualizer" },
            { id: "services", label: "Services & Pricing" },
            { id: "portfolio", label: "Portfolio" },
            { id: "about", label: "About Ẹwà" },
            { id: "testimonials", label: "Testimonials" },
            { id: "inquire", label: "Inquire" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              style={{
                textAlign: "left", background: view === item.id ? "rgba(201,141,147,0.12)" : "transparent",
                border: "none", borderLeft: view === item.id ? `3px solid ${GOLD}` : "3px solid transparent",
                color: view === item.id ? GOLD_DEEP : CREAM_TEXT,
                padding: "13px 18px", fontSize: 14.5, fontWeight: 600, letterSpacing: "0.02em", borderRadius: "0 8px 8px 0",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: "auto", padding: "18px 20px", borderTop: `1px solid ${LINE}` }}>
          <div className="script" style={{ color: GOLD_DEEP, fontSize: 17, marginBottom: 6 }}>Where intentionality meets elegance</div>
          <a href={`tel:${CONTACT.phone.replace(/-/g, "")}`} className="mono" style={{ display: "block", color: "#8A746B", fontSize: 12, textDecoration: "none", marginBottom: 4 }}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`} className="mono" style={{ display: "block", color: "#8A746B", fontSize: 12, textDecoration: "none" }}>{CONTACT.email}</a>
          <a href="https://www.instagram.com/eventwithabby/" target="_blank" rel="noopener noreferrer" className="mono" style={{ display: "block", color: "#8A746B", fontSize: 12, textDecoration: "none", marginTop: 4 }}>@eventwithabby</a>
        </div>
      </div>

      {view === "home" && (
        <>
          {/* HERO */}
          <div style={{
            background: `radial-gradient(ellipse at 50% -10%, #FBE4DD 0%, ${PAPER} 60%), ${PAPER}`,
            padding: "64px 24px 52px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(201,141,147,0.28) 1px, transparent 1px)`, backgroundSize: "26px 26px", opacity: 0.35, pointerEvents: "none" }} />
            <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
              <img src={LOGO_SRC} alt="Ẹwà — Events with Abby" style={{ width: 92, height: 92, objectFit: "contain", margin: "0 auto 16px" }} />
              <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.3em", marginBottom: 14 }}>CHARLOTTE, NORTH CAROLINA</div>
              <h1 className="display hero-title" style={{ color: CREAM_TEXT, fontSize: 68, fontWeight: 500, margin: 0, lineHeight: 1.02 }}>Ẹwà</h1>
              <div className="script" style={{ color: GOLD_DEEP, fontSize: 30, marginTop: 2 }}>Events with Abby</div>
              <Ornament />
              <p className="display" style={{ color: CREAM_TEXT, fontSize: 21, fontStyle: "italic", margin: "0 0 8px" }}>
                Turning moments into timeless memories.
              </p>
              <p className="mono" style={{ color: "#8A746B", fontSize: 11, letterSpacing: "0.24em", margin: "0 0 26px" }}>
                LUXURY · INTENTIONALITY · BEAUTY
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="cta-btn" onClick={() => go("concierge")} style={{
                  background: "transparent", color: GOLD_DEEP, border: `1.5px solid ${GOLD}`, borderRadius: 30, padding: "14px 22px",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  ✦ Ask the concierge
                </button>
                <button className="cta-btn" onClick={() => go("inquire")} style={{
                  background: GOLD, color: WHITE, border: "none", borderRadius: 30, padding: "14px 26px",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  Begin your inquiry
                </button>
              </div>
            </div>
          </div>

          {/* FEATURED WORK STRIP */}
          <div style={{ background: PAPER, padding: "0 24px 40px" }}>
            <div className="gallery-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {GALLERY.filter((g) => g.type === "image").slice(0, 3).map((g) => (
                <button key={g.caption} onClick={() => go("portfolio")} className="gallery-frame" style={{ border: `1px solid ${LINE}`, borderRadius: 4, overflow: "hidden", background: WHITE, padding: 0, textAlign: "left" }}>
                  <div style={{ overflow: "hidden", aspectRatio: "4 / 5" }}>
                    <img src={g.src} alt={g.caption} className="gallery-img" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <div className="mono" style={{ color: "#8A746B", fontSize: 10.5, letterSpacing: "0.08em", padding: "10px 12px", textTransform: "uppercase" }}>
                    {g.caption}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button className="ghost-btn" onClick={() => go("portfolio")} style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD_DEEP, borderRadius: 20, padding: "10px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                View full portfolio
              </button>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div style={{ padding: "44px 24px" }}>
            <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
              {[
                { v: "concierge", title: "✦ Style Concierge", desc: "Describe your dream event — get a design and price in seconds." },
                { v: "visualize", title: "3D Visualizer", desc: "Pick shapes and colors, and see your setup before it's built." },
                { v: "services", title: "Services & Pricing", desc: "The full Ẹwà menu, from bouquets to full transformations." },
                { v: "about", title: "About Ẹwà", desc: "The story behind the beauty — and the founder behind Ẹwà." },
                { v: "testimonials", title: "Kind Words", desc: "What clients say about celebrating with Ẹwà." },
              ].map((c) => (
                <button key={c.v} onClick={() => go(c.v)} className="svc-card" style={{ textAlign: "left", background: WHITE, border: `1px solid ${LINE}`, borderRadius: 10, padding: "20px 20px" }}>
                  <div className="display" style={{ fontSize: 19, marginBottom: 8, color: INK }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "#8A746B", lineHeight: 1.55 }}>{c.desc}</div>
                  <div className="mono" style={{ fontSize: 11, color: GOLD_DEEP, marginTop: 12, letterSpacing: "0.1em" }}>EXPLORE →</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {view === "portfolio" && (
        <div style={{ background: PAPER, padding: "48px 24px 64px", minHeight: "60vh" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <BackButton />
            <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.22em", textAlign: "center", marginBottom: 8 }}>THE PORTFOLIO</div>
            <h2 className="display" style={{ fontSize: 32, textAlign: "center", marginBottom: 20, color: CREAM_TEXT }}>Recent work</h2>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 22 }}>
              {PORTFOLIO_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setGalleryFilter(tag)}
                  style={{
                    border: `1px solid ${galleryFilter === tag ? GOLD : LINE}`,
                    background: galleryFilter === tag ? "rgba(201,141,147,0.14)" : WHITE,
                    color: galleryFilter === tag ? GOLD_DEEP : "#8A746B",
                    borderRadius: 20, padding: "8px 16px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {GALLERY.filter((g) => (galleryFilter === "All" ? g.type !== "video" : g.tags.includes(galleryFilter))).map((g) => (
                <div key={g.caption} className="gallery-frame" style={{ border: `1px solid ${LINE}`, borderRadius: 4, overflow: "hidden", background: WHITE }}>
                  <div style={{ overflow: "hidden", aspectRatio: "4 / 5", position: "relative" }}>
                    {g.type === "video" ? (
                      <>
                        <VideoTile
                          src={g.src}
                          poster={g.poster}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <span className="mono" style={{
                          position: "absolute", top: 8, right: 8, background: "rgba(58,43,38,0.65)", color: "#FCEEEA",
                          fontSize: 9, letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 10, border: `1px solid rgba(255,255,255,0.4)`,
                          pointerEvents: "none",
                        }}>▶ VIDEO</span>
                      </>
                    ) : (
                      <img src={g.src} alt={g.caption} className="gallery-img" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    )}
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div className="mono" style={{ color: "#8A746B", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                      {g.caption}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {g.tags.map((t) => (
                        <span key={t} className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: GOLD_DEEP, border: `1px solid ${LINE}`, borderRadius: 10, padding: "2px 8px" }}>
                          {t.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {GALLERY.filter((g) => (galleryFilter === "All" ? g.type !== "video" : g.tags.includes(galleryFilter))).length === 0 && (
              <div className="mono" style={{ color: "#8A746B", fontSize: 12, textAlign: "center", padding: "32px 0" }}>
                More {galleryFilter.toLowerCase()} coming soon.
              </div>
            )}
          </div>
        </div>
      )}

      {view === "services" && (
        <div style={{ background: PAPER, padding: "48px 24px 40px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <BackButton />
            <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.22em", textAlign: "center", marginBottom: 8 }}>SERVICES &amp; PRICING</div>
            <h2 className="display" style={{ fontSize: 32, textAlign: "center", marginBottom: 8 }}>The Ẹwà menu</h2>
            <p style={{ fontSize: 13, color: "#8A746B", textAlign: "center", marginBottom: 32, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Prices vary by event size, location, materials, and customization — every booking begins with a consultation to finalize your tailored quote.
            </p>
            {PACKAGES.map((cat) => (
              <div key={cat.category} style={{ marginBottom: 28 }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: GOLD_DEEP, marginBottom: 12, textTransform: "uppercase" }}>
                  {cat.category}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cat.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => selectServiceAndInquire(cat.category, item)}
                      className="svc-card"
                      style={{
                        textAlign: "left", width: "100%", cursor: "pointer",
                        background: WHITE, border: `1px solid ${item.popular ? GOLD : LINE}`, borderRadius: 8,
                        padding: "14px 18px", display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
                        boxShadow: item.popular ? "0 4px 16px -8px rgba(169,95,107,0.25)" : "none",
                        color: INK, WebkitAppearance: "none", appearance: "none",
                      }}
                    >
                      <div style={{ flex: "1 1 260px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: INK }}>{item.name}</div>
                          {item.popular && (
                            <span className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: GOLD_DEEP, border: `1px solid ${GOLD}`, borderRadius: 10, padding: "2px 8px" }}>
                              MOST POPULAR
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12.5, color: "#8A746B", marginTop: 4, lineHeight: 1.55 }}>{item.desc}</div>
                      </div>
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: GOLD_DEEP }}>
                          {item.now === "On request" ? item.now : `from ${item.now}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button className="cta-btn" onClick={() => go("inquire")} style={{ background: INK, color: WHITE, border: "none", borderRadius: 30, padding: "14px 28px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Begin your inquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "about" && (
        <div style={{ background: PAPER, padding: "48px 24px 56px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <BackButton />
            <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.22em", textAlign: "center", marginBottom: 8 }}>OUR STORY</div>
            <h2 className="display" style={{ fontSize: 32, textAlign: "center", marginBottom: 6 }}>About Ẹwà</h2>
            <div className="script" style={{ fontSize: 22, color: GOLD_DEEP, textAlign: "center", marginBottom: 28 }}>Where intentionality meets elegance</div>

            <p style={{ fontSize: 15, lineHeight: 1.85, color: INK, marginBottom: 18 }}>
              Founded in <strong>2025</strong>, <strong>Ẹwà (Event With Abby)</strong> was born from a passion for turning
              moments into memories that feel intentional, beautiful, and everlasting. The name <strong>Ẹwà</strong>, meaning
              "beauty" in Yoruba, represents everything we stand for — elegance, purpose, and authenticity in every creation.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: INK, marginBottom: 18 }}>
              What began as Abby's love for creating thoughtful, heartfelt setups has blossomed into a full event brand known
              for its luxury décor, surprise experiences, and curated designs. Every detail, from the soft glow of a candle to
              the perfect petal arrangement, is crafted with care and meaning.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: INK, marginBottom: 36 }}>
              At <strong>Ẹwà</strong>, we believe beauty isn't just seen — it's felt. Each celebration is more than décor;
              it's a story told through intentional design, timeless style, and a touch of luxury. Whether it's an intimate
              proposal, a surprise setup, or a grand celebration, we bring your vision to life — beautifully and purposefully.
            </p>

            <Ornament />

            <h3 className="display" style={{ fontSize: 26, textAlign: "center", margin: "32px 0 24px" }}>Behind the Beauty</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 32 }}>
              <div style={{ border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden", background: WHITE }}>
                <img src={ABBY1_SRC} alt="Abby, founder of Ẹwà, holding a rose" style={{ width: "100%", display: "block" }} />
              </div>
              <div style={{ border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden", background: WHITE }}>
                <img src={ABBY2_SRC} alt="Abby with a bouquet of pink roses" style={{ width: "100%", display: "block" }} />
              </div>
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.85, color: INK, marginBottom: 18 }}>
              Abby Arowolaju is a Nigerian-born creative, software engineer, and content creator whose love for design began
              at a young age. Growing up, she found joy in decorating her home for Christmas, arranging details with care, and
              watching spaces come alive through her creativity. She never imagined that what once felt like play would blossom
              into a passion — and later, a purpose.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: INK, marginBottom: 18 }}>
              In 2025, Abby founded Ẹwà, which stands for <em>Event With Abby</em>. Coincidentally — and beautifully — "Ẹwà"
              also means <em>beauty</em> in Yoruba, a sign that affirmed her calling to create elegance with intention.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: INK, marginBottom: 32 }}>
              Through Ẹwà, Abby combines her technical precision as a software engineer with her natural eye for design to
              craft events that feel purposeful, timeless, and heartfelt. Every creation reflects her belief that beauty is
              not just seen, but deeply felt.
            </p>

            <div style={{ textAlign: "center" }}>
              <button className="cta-btn" onClick={() => go("inquire")} style={{ background: INK, color: WHITE, border: "none", borderRadius: 30, padding: "14px 28px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Celebrate with Ẹwà
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "testimonials" && (
        <div style={{ background: PAPER, padding: "48px 24px 56px", minHeight: "50vh" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <BackButton />
            <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.22em", textAlign: "center", marginBottom: 8 }}>KIND WORDS</div>
            <h2 className="display" style={{ fontSize: 30, textAlign: "center", marginBottom: 24 }}>What clients say</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 8, padding: "20px 22px" }}>
                  <div className="display" style={{ fontSize: 30, color: GOLD, lineHeight: 0.6, marginBottom: 10 }}>"</div>
                  <p style={{ fontSize: 14, fontStyle: "italic", lineHeight: 1.7, color: INK, margin: "0 0 12px" }}>{t.quote}</p>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: GOLD_DEEP }}>— {t.name.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: ["ledger", "visualize", "concierge", "inquire"].includes(view) ? "48px 24px 80px" : "0" }}>
        {view === "concierge" ? (
          <div>
            <BackButton />
            <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.16em", marginBottom: 6, textAlign: "center" }}>AI STYLE CONCIERGE</div>
            <h2 className="display" style={{ fontSize: 32, marginBottom: 10, color: INK, textAlign: "center" }}>Describe your dream event</h2>
            <p style={{ fontSize: 14, color: "#8A746B", marginBottom: 24, textAlign: "center", maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Tell the concierge the occasion, colors, and guest count — get a tailored design and starting price in seconds.
            </p>

            <div style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 4, boxShadow: "0 24px 60px -30px rgba(28,20,16,0.18)", display: "flex", flexDirection: "column", height: 520 }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: "center", margin: "auto", maxWidth: 340 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${GOLD}`, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="display" style={{ fontSize: 20, color: GOLD_DEEP }}>Ẹ</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#8A746B", lineHeight: 1.6 }}>
                      Try something like: <em>"Gold and burgundy 30th birthday for 40 people"</em> or <em>"A soft, romantic proposal setup at home"</em>
                    </p>
                  </div>
                )}
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "82%", padding: "11px 15px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: m.role === "user" ? INK : "#FBF3E1",
                      color: m.role === "user" ? CREAM_BG : INK,
                      fontSize: 14, lineHeight: 1.55,
                      border: m.role === "user" ? "none" : `1px solid ${LINE}`,
                    }}>
                      {m.text}
                    </div>
                    {m.suggestion && (
                      <div style={{ marginTop: 10, border: `1px solid ${GOLD}`, borderRadius: 8, padding: "14px 16px", background: WHITE, maxWidth: "88%" }}>
                        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: GOLD_DEEP, marginBottom: 8 }}>SUGGESTED DESIGN</div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m.suggestion.shapeLabel}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          {(m.suggestion.colors || []).map((c, ci) => (
                            <span key={ci} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.15)" }} />
                          ))}
                          <span className="mono" style={{ fontSize: 11, color: "#8A746B" }}>{(m.suggestion.colors || []).join(" · ")}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#8A746B", marginBottom: 4 }}>{m.suggestion.packageName} — from <strong style={{ color: INK }}>{m.suggestion.packageFrom}</strong></div>
                        {m.suggestion.rationale && <div style={{ fontSize: 12.5, color: "#8A746B", fontStyle: "italic", marginBottom: 12 }}>{m.suggestion.rationale}</div>}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            className="cta-btn"
                            onClick={() => applySuggestionToVisualizer(m.suggestion)}
                            style={{ background: GOLD, color: INK, border: "none", borderRadius: 20, padding: "9px 16px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                          >
                            See it in 3D
                          </button>
                          <button
                            className="ghost-btn"
                            onClick={() => applySuggestionToInquiry(m.suggestion)}
                            style={{ background: "transparent", color: INK, border: `1px solid ${LINE}`, borderRadius: 20, padding: "9px 16px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                          >
                            Start my inquiry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {chatBusy && (
                  <div style={{ alignSelf: "flex-start", padding: "11px 15px", borderRadius: "16px 16px 16px 4px", background: "#FBF3E1", border: `1px solid ${LINE}`, fontSize: 14, color: "#8A746B" }}>
                    Styling your look…
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ borderTop: `1px solid ${LINE}`, padding: "14px 16px", display: "flex", gap: 10 }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
                  placeholder="Describe your event…"
                  style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 24, padding: "12px 18px", fontSize: 14, fontFamily: "'Manrope', sans-serif", background: PAPER, color: INK }}
                />
                <button
                  className="cta-btn"
                  onClick={sendChat}
                  disabled={chatBusy}
                  style={{ background: chatBusy ? LINE : INK, color: CREAM_BG, border: "none", borderRadius: 24, padding: "12px 22px", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em" }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : view === "visualize" ? (
          <div>
            <BackButton />
            <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.16em", marginBottom: 6, textAlign: "center" }}>3D STYLE PREVIEW</div>
            <h2 className="display" style={{ fontSize: 32, marginBottom: 10, color: INK, textAlign: "center" }}>Picture it before it's built</h2>
            <p style={{ fontSize: 14, color: "#8A746B", marginBottom: 28, textAlign: "center", maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Choose a shape, balloons or flowers (or both), and a palette — drag to look around it, then save the look straight into your inquiry.
            </p>

            <div style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 4, padding: "28px", boxShadow: "0 24px 60px -30px rgba(28,20,16,0.18)" }}>
              <label style={labelStyle}>Shape</label>
              <div className="shape-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginBottom: 22 }}>
                {SHAPES.map((s) => (
                  <button
                    key={s.id}
                    className="shape-btn"
                    onClick={() => setVizShape(s.id)}
                    style={{
                      border: `1px solid ${vizShape === s.id ? GOLD : LINE}`, background: vizShape === s.id ? "#FBF3E1" : WHITE,
                      borderRadius: 6, padding: "10px 8px", fontSize: 12, fontWeight: 600,
                      color: vizShape === s.id ? GOLD_DEEP : INK,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <label style={labelStyle}>Style</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                {DECOR_STYLES.map((d) => (
                  <button
                    key={d.id}
                    className="shape-btn"
                    onClick={() => setVizDecorStyle(d.id)}
                    style={{
                      border: `1px solid ${vizDecorStyle === d.id ? GOLD : LINE}`, background: vizDecorStyle === d.id ? "#FBF3E1" : WHITE,
                      borderRadius: 20, padding: "9px 18px", fontSize: 12, fontWeight: 600,
                      color: vizDecorStyle === d.id ? GOLD_DEEP : INK,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <label style={labelStyle}>Palette</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    className="swatch-btn"
                    onClick={() => setVizPaletteId(p.id)}
                    style={{
                      border: `1.5px solid ${vizPaletteId === p.id ? GOLD : LINE}`, borderRadius: 30, padding: "6px 14px 6px 8px",
                      background: vizPaletteId === p.id ? "#FBF3E1" : WHITE, display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    <span style={{ display: "flex" }}>
                      {p.colors.map((c, i) => (
                        <span key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, marginLeft: i === 0 ? 0 : -4, border: "1px solid rgba(0,0,0,0.15)" }} />
                      ))}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: vizPaletteId === p.id ? GOLD_DEEP : INK }}>{p.label}</span>
                  </button>
                ))}
                <button
                  className="swatch-btn"
                  onClick={() => setVizPaletteId("custom")}
                  style={{
                    border: `1.5px solid ${vizPaletteId === "custom" ? GOLD : LINE}`, borderRadius: 30, padding: "6px 14px 6px 8px",
                    background: vizPaletteId === "custom" ? "#FBF3E1" : WHITE, display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <span style={{ display: "flex" }}>
                    {customColors.map((c, i) => (
                      <span key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, marginLeft: i === 0 ? 0 : -4, border: "1px solid rgba(0,0,0,0.15)" }} />
                    ))}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: vizPaletteId === "custom" ? GOLD_DEEP : INK }}>✦ My own colors</span>
                </button>
              </div>

              {vizPaletteId === "custom" && (
                <div style={{ display: "flex", gap: 16, marginBottom: 22, flexWrap: "wrap", alignItems: "center", background: "#FBF3E1", border: `1px solid ${GOLD}`, borderRadius: 8, padding: "12px 16px" }}>
                  {customColors.map((c, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="color"
                        value={c}
                        onChange={(e) => {
                          const next = [...customColors];
                          next[i] = e.target.value;
                          setCustomColors(next);
                        }}
                        style={{ width: 38, height: 38, border: "none", borderRadius: 8, padding: 0, cursor: "pointer", background: "transparent" }}
                      />
                      <span className="mono" style={{ fontSize: 11, color: GOLD_DEEP }}>Color {i + 1}</span>
                    </label>
                  ))}
                </div>
              )}

              <label style={labelStyle}>Venue setting</label>
              <div className="shape-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 22 }}>
                {VENUES.map((v) => (
                  <button
                    key={v.id}
                    className="shape-btn"
                    onClick={() => setVizVenueId(v.id)}
                    style={{
                      border: `1px solid ${vizVenueId === v.id ? GOLD : LINE}`, background: vizVenueId === v.id ? "#FBF3E1" : WHITE,
                      borderRadius: 6, padding: "10px 8px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      color: vizVenueId === v.id ? GOLD_DEEP : INK,
                    }}
                  >
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: `linear-gradient(180deg, ${v.wall} 55%, ${v.floor} 55%)`, border: "1px solid rgba(0,0,0,0.15)" }} />
                    {v.label}
                  </button>
                ))}
              </div>

              <label style={labelStyle}>Fullness — {vizCount} {vizDecorStyle === "florals" ? "blooms" : vizDecorStyle === "mixed" ? "pieces" : "balloons"}</label>
              <input
                type="range" min={20} max={80} value={vizCount}
                onChange={(e) => setVizCount(Number(e.target.value))}
                style={{ width: "100%", marginBottom: 18 }}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}>
                <input type="checkbox" checked={vizShowPeople} onChange={(e) => setVizShowPeople(e.target.checked)} style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: 12.5, color: "#8A746B" }}>Show stylized figures for scale</span>
              </label>
              <p className="mono" style={{ fontSize: 10, letterSpacing: "0.04em", color: "#B0A090", margin: "-16px 0 22px", lineHeight: 1.5 }}>
                This is a 3D style preview, not a photo-real render — figures are simplified silhouettes to help judge scale.
              </p>

              <BalloonVisualizer
                shape={vizShape}
                palette={vizPalette.colors}
                count={vizCount}
                venue={vizVenue}
                decorStyle={vizDecorStyle}
                showPeople={vizShowPeople}
                onSnapshot={handleSaveLook}
                onGeneratePreview={generateRealisticPreview}
                onSavePreviewToInquiry={saveGeneratedPreviewToInquiry}
                previewLoading={previewLoading}
                previewUrl={previewUrl}
                previewRefinement={previewRefinement}
                onRefinementChange={setPreviewRefinement}
              />
            </div>
          </div>
        ) : view === "ledger" ? (
          <div>
            <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.16em", marginBottom: 6 }}>OWNER VIEW</div>
            <h2 className="display" style={{ fontSize: 32, marginBottom: 20, color: INK }}>Inquiries ledger</h2>
            {!ledgerUnlocked ? (
              <div style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 10, padding: "32px 28px", maxWidth: 380, boxShadow: "0 1px 3px rgba(28,20,16,0.05)" }}>
                <p style={{ fontSize: 13.5, color: "#8A746B", marginBottom: 16, lineHeight: 1.6 }}>
                  This page is private. Enter your Ledger password to continue.
                </p>
                <input
                  type="password"
                  value={ledgerPasswordInput}
                  onChange={(e) => setLedgerPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkLedgerPassword()}
                  placeholder="Password"
                  style={{ width: "100%", padding: "12px 14px", border: `1px solid ${LINE}`, borderRadius: 6, fontSize: 14, marginBottom: 12, fontFamily: "'Manrope', sans-serif" }}
                />
                {ledgerError && <div style={{ color: BLUSH, fontSize: 12.5, marginBottom: 12 }}>{ledgerError}</div>}
                <button
                  className="cta-btn"
                  onClick={checkLedgerPassword}
                  disabled={ledgerChecking}
                  style={{ background: INK, color: WHITE, border: "none", borderRadius: 30, padding: "12px 24px", fontSize: 12.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", width: "100%", opacity: ledgerChecking ? 0.6 : 1 }}
                >
                  {ledgerChecking ? "Checking…" : "Unlock"}
                </button>
              </div>
            ) : !loaded ? (
              <p style={{ color: "#8A746B" }}>Loading…</p>
            ) : !supabase ? (
              <div style={{ border: `1px dashed ${GOLD}`, borderRadius: 10, padding: 24, color: "#8A746B", background: "#FBF3E1" }}>
                <strong style={{ color: GOLD_DEEP }}>Storage isn't connected yet.</strong> Add your Supabase URL and anon key
                to <code>.env.local</code> (see <code>DEPLOYMENT.md</code>, step 5) — once that's set, inquiries will
                start saving here for real.
              </div>
            ) : upcoming.length === 0 ? (
              <div style={{ border: `1px dashed ${LINE}`, borderRadius: 10, padding: 32, color: "#8A746B", textAlign: "center" }}>
                No inquiries yet — they'll show up here as clients submit them.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {upcoming.map((inq) => (
                  <div key={inq.id} style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(28,20,16,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{inq.name} — {inq.eventType}</div>
                        <div className="mono" style={{ fontSize: 11, color: GOLD_DEEP, marginTop: 3, letterSpacing: "0.06em" }}>{refCode(inq.id)}</div>
                        <div style={{ fontSize: 13, color: "#8A746B", marginTop: 8 }}>{inq.services.join(", ")}</div>
                        <div className="mono" style={{ fontSize: 12, color: "#8A746B", marginTop: 4 }}>
                          {fmtDate(inq.eventDate)} · {inq.guestCount ? `${inq.guestCount} guests · ` : ""}{inq.budget}
                        </div>
                        <div style={{ fontSize: 12, color: "#8A746B", marginTop: 4 }}>{inq.email}{inq.phone ? ` · ${inq.phone}` : ""}</div>
                       {inq.styleLook && (
                          <div className="mono" style={{ fontSize: 11, color: GOLD_DEEP, marginTop: 6, letterSpacing: "0.04em" }}>
                            ✦ VISUALIZED: {inq.styleLook}
                          </div>
                        )}
                        {inq.styleImageUrl && (
                          <img src={inq.styleImageUrl} alt="Client's AI-generated preview" style={{ width: 160, borderRadius: 6, marginTop: 8, border: `1px solid ${LINE}` }} />
                        )}
                        
                        {inq.message && <div style={{ fontSize: 13, marginTop: 10, color: INK, lineHeight: 1.5, fontStyle: "italic", whiteSpace: "pre-line" }}>"{inq.message}"</div>}
                        
                        <PaymentsPanel inquiry={inq} payments={payments} onSend={sendPaymentLink} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        <button
                          onClick={() => cycleStatus(inq.id)}
                          style={{
                            border: "none", borderRadius: 20, padding: "5px 13px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
                            background: inq.status === "New" ? "#FBEEEE" : inq.status === "Quoted" ? "#F5EBD8" : "#EEF0E8",
                            color: inq.status === "New" ? BLUSH : inq.status === "Quoted" ? GOLD_DEEP : SAGE,
                          }}
                        >
                          {inq.status.toUpperCase()}
                        </button>
                        <button
                          onClick={() => removeInquiry(inq.id)}
                          className="ghost-btn"
                          style={{ border: `1px solid ${LINE}`, background: "transparent", borderRadius: 6, padding: "5px 10px", fontSize: 11, color: "#8A746B" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : view === "inquire" ? (
          confirmed ? (
            <div style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 4, padding: "48px 36px", textAlign: "center", marginTop: 56, boxShadow: "0 20px 50px -20px rgba(28,20,16,0.15)" }}>
              <div style={{ textAlign: "left" }}>
                <BackButton />
              </div>
              <div style={{
                width: 76, height: 76, borderRadius: "50%", border: `2px solid ${GOLD}`, margin: "0 auto 18px",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
                <div style={{ position: "absolute", inset: 5, borderRadius: "50%", border: `1px solid ${GOLD}`, opacity: 0.5 }} />
                <span className="display" style={{ fontSize: 26, color: GOLD_DEEP }}>Ẹ</span>
              </div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: GOLD_DEEP, marginBottom: 12 }}>
                INQUIRY RECEIVED · {refCode(confirmed.id)}
              </div>
              <h2 className="display" style={{ margin: "0 0 14px", fontSize: 30 }}>Thank you, {confirmed.name.split(" ")[0]}</h2>
              <Ornament />
              <p style={{ margin: "0 0 6px", fontSize: 14, color: "#8A746B" }}>{confirmed.services.join(", ")}</p>
              <p className="mono" style={{ margin: "0 0 22px", fontSize: 14 }}>{fmtDate(confirmed.eventDate)}</p>
              <p style={{ fontSize: 13, color: "#8A746B", marginBottom: 28, lineHeight: 1.7, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
                Ẹwà will follow up at {confirmed.email} with availability and a tailored quote for your event.
              </p>
              <button
                className="cta-btn"
                onClick={() => setConfirmed(null)}
                style={{ background: INK, color: WHITE, border: "none", borderRadius: 30, padding: "13px 26px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <div ref={formRef}>
              <BackButton />
              <div className="mono" style={{ color: GOLD_DEEP, fontSize: 11, letterSpacing: "0.18em", marginBottom: 8, textAlign: "center" }}>REQUEST A CONSULTATION</div>
              <h2 className="display" style={{ fontSize: 34, textAlign: "center", marginBottom: 10 }}>Tell us about your event</h2>
              <p style={{ fontSize: 14, color: "#8A746B", marginBottom: 36, textAlign: "center", maxWidth: 420, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                No booking fee to inquire — Ẹwà will follow up personally with availability and pricing.
              </p>

              <div style={{ background: WHITE, border: `1px solid ${LINE}`, borderRadius: 4, padding: "36px 32px", boxShadow: "0 24px 60px -30px rgba(28,20,16,0.18)" }}>
                {savedLook && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FBF3E1", border: `1px solid ${GOLD}`, borderRadius: 6, padding: "10px 14px", marginBottom: 24 }}>
                    {savedLook.dataUrl && <img src={savedLook.dataUrl} alt="Saved style preview" style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 4 }} />}
                    <div className="mono" style={{ fontSize: 11, color: GOLD_DEEP, letterSpacing: "0.04em" }}>
                      STYLE ATTACHED — {savedLook.shapeLabel} · {savedLook.paletteLabel}
                    </div>
                  </div>
                )}

                <label style={labelStyle}>What do you need</label>
                <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
                  {SERVICES.map((s) => {
                    const active = selectedServices.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        className="svc-card"
                        onClick={() => toggleService(s.id)}
                        style={{
                          textAlign: "left", border: `1px solid ${active ? GOLD : LINE}`, background: active ? "#FBF3E1" : WHITE,
                          borderRadius: 6, padding: "14px 16px", fontSize: 13.5, fontWeight: 500,
                        }}
                      >
                        <span style={{ color: active ? GOLD_DEEP : INK }}>{active ? "✓ " : ""}{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
                  <div>
                    <label style={labelStyle}>Event date</label>
                    <input type="date" min={todayIso()} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Event type</label>
                    <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} style={inputStyle}>
                      {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
                  <div>
                    <label style={labelStyle}>Estimated guests</label>
                    <input placeholder="e.g. 30" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Budget range</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} style={inputStyle}>
                      {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
                  <div>
                    <label style={labelStyle}>Your name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <label style={labelStyle}>Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ ...inputStyle, marginBottom: 22 }} />

                <label style={labelStyle}>Your vision (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Colors, theme, venue, anything you're picturing…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, marginBottom: 26, resize: "vertical", borderBottom: `1.5px solid ${LINE}` }}
                />

                {error && <div style={{ color: BLUSH, fontSize: 13, marginBottom: 18 }}>{error}</div>}

                <button
                  className="cta-btn"
                  onClick={submitInquiry}
                  style={{ background: INK, color: WHITE, border: "none", borderRadius: 30, padding: "15px 24px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", width: "100%" }}
                >
                  Send inquiry
                </button>
              </div>
            </div>
          )
        ) : null}
      </main>
      <footer style={{ borderTop: `1px solid ${LINE}`, padding: "26px 24px", textAlign: "center" }}>
        <div className="script" style={{ fontSize: 22, color: GOLD_DEEP, marginBottom: 6 }}>Where intentionality meets elegance</div>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "#8A746B", marginBottom: 10 }}>
          ẸWÀ · CHARLOTTE, NC ·{" "}
          <a href={`tel:${CONTACT.phone.replace(/-/g, "")}`} style={{ color: "#8A746B", textDecoration: "underline" }}>{CONTACT.phone}</a>
          {", "}
          <a href={`mailto:${CONTACT.email}`} style={{ color: "#8A746B", textDecoration: "underline" }}>{CONTACT.email}</a>
        </div>
        <a
          href="https://www.instagram.com/eventwithabby/"
          target="_blank"
          rel="noopener noreferrer"
          className="mono"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, letterSpacing: "0.1em", color: GOLD_DEEP, textDecoration: "none" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          @eventwithabby
        </a>
      </footer>
    </div>
  );
}
