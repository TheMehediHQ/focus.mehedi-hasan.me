import os

artworks = {
    "deep-focus.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="df-bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <radialGradient id="df-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="df-ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#df-bg)"/>
  <circle cx="200" cy="200" r="140" fill="url(#df-glow)"/>
  <circle cx="200" cy="200" r="110" fill="none" stroke="url(#df-ring)" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.6"/>
  <circle cx="200" cy="200" r="80" fill="none" stroke="url(#df-ring)" stroke-width="2" opacity="0.8"/>
  <circle cx="200" cy="200" r="50" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="200" cy="200" r="22" fill="#38bdf8" opacity="0.9"/>
  <circle cx="200" cy="200" r="8" fill="#ffffff"/>
  <path d="M 60,200 Q 130,160 200,200 T 340,200" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.4"/>
  <path d="M 80,215 Q 140,240 200,215 T 320,215" fill="none" stroke="#818cf8" stroke-width="1.2" opacity="0.3"/>
</svg>""",

    "meditation.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="med-bg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#142624"/>
      <stop offset="60%" stop-color="#0a1413"/>
      <stop offset="100%" stop-color="#040807"/>
    </radialGradient>
    <radialGradient id="med-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#34d399" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="med-lotus" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#6ee7b7" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#med-bg)"/>
  <circle cx="200" cy="200" r="130" fill="url(#med-glow)"/>
  <!-- Concentric Zen Rings -->
  <circle cx="200" cy="200" r="115" fill="none" stroke="#34d399" stroke-width="1" stroke-dasharray="2 6" opacity="0.4"/>
  <circle cx="200" cy="200" r="90" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.6"/>
  <!-- Enso / Lotus petals -->
  <path d="M 200,120 C 170,160 170,220 200,250 C 230,220 230,160 200,120 Z" fill="url(#med-lotus)"/>
  <path d="M 200,140 C 150,180 150,230 200,260 C 250,230 250,180 200,140 Z" fill="none" stroke="#6ee7b7" stroke-width="1.5" opacity="0.7"/>
  <path d="M 150,200 C 160,160 210,180 220,220 C 200,240 160,230 150,200 Z" fill="url(#med-lotus)" opacity="0.5"/>
  <path d="M 250,200 C 240,160 190,180 180,220 C 200,240 240,230 250,200 Z" fill="url(#med-lotus)" opacity="0.5"/>
  <circle cx="200" cy="195" r="7" fill="#ecfdf5"/>
</svg>""",

    "rain.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="rain-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <linearGradient id="drop-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#rain-bg)"/>
  <!-- Rain streaks -->
  <line x1="80" y1="50" x2="60" y2="120" stroke="url(#drop-grad)" stroke-width="2" stroke-linecap="round"/>
  <line x1="160" y1="30" x2="140" y2="110" stroke="url(#drop-grad)" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="240" y1="60" x2="220" y2="150" stroke="url(#drop-grad)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="320" y1="40" x2="300" y2="130" stroke="url(#drop-grad)" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="110" y1="160" x2="90" y2="250" stroke="url(#drop-grad)" stroke-width="2" stroke-linecap="round"/>
  <line x1="200" y1="140" x2="180" y2="230" stroke="url(#drop-grad)" stroke-width="2.8" stroke-linecap="round"/>
  <line x1="280" y1="180" x2="260" y2="270" stroke="url(#drop-grad)" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="350" y1="170" x2="330" y2="260" stroke="url(#drop-grad)" stroke-width="2" stroke-linecap="round"/>
  <!-- Ripple rings on glass -->
  <ellipse cx="180" cy="270" rx="45" ry="12" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>
  <ellipse cx="180" cy="270" rx="75" ry="20" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.3"/>
  <ellipse cx="290" cy="310" rx="35" ry="9" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.5"/>
</svg>""",

    "nature.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="nat-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="50%" stop-color="#022c22"/>
      <stop offset="100%" stop-color="#021712"/>
    </linearGradient>
    <linearGradient id="pine-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#nat-bg)"/>
  <circle cx="200" cy="160" r="60" fill="#a7f3d0" opacity="0.08"/>
  <!-- Layered evergreen trees -->
  <polygon points="120,290 80,360 160,360" fill="#04382c"/>
  <polygon points="120,250 90,310 150,310" fill="#054f3e"/>
  <polygon points="120,210 100,265 140,265" fill="#065f4b"/>
  
  <polygon points="280,270 235,360 325,360" fill="#04382c"/>
  <polygon points="280,230 245,305 315,305" fill="#054f3e"/>
  <polygon points="280,195 255,255 305,255" fill="#065f4b"/>
  
  <polygon points="200,240 145,360 255,360" fill="url(#pine-grad)"/>
  <polygon points="200,190 155,290 245,290" fill="url(#pine-grad)"/>
  <polygon points="200,140 165,225 235,225" fill="#34d399"/>
  <!-- Gentle mist bands -->
  <path d="M 40,320 Q 120,300 200,320 T 360,320" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.3"/>
  <path d="M 60,345 Q 160,330 260,350 T 380,340" fill="none" stroke="#a7f3d0" stroke-width="1.5" opacity="0.2"/>
</svg>""",

    "ocean.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="oc-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c2540"/>
      <stop offset="50%" stop-color="#08182b"/>
      <stop offset="100%" stop-color="#040c17"/>
    </linearGradient>
    <radialGradient id="moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="70%" stop-color="#bae6fd" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#oc-bg)"/>
  <!-- Glowing horizon moon -->
  <circle cx="200" cy="150" r="40" fill="url(#moon)"/>
  <circle cx="200" cy="150" r="18" fill="#f0f9ff"/>
  <!-- Rolling wave layers -->
  <path d="M 0,250 C 80,230 120,270 200,250 C 280,230 320,270 400,250 L 400,400 L 0,400 Z" fill="#0c4a6e" opacity="0.5"/>
  <path d="M 0,285 C 90,265 130,305 210,285 C 290,265 330,305 400,285 L 400,400 L 0,400 Z" fill="#075985" opacity="0.7"/>
  <path d="M 0,325 C 70,305 140,345 220,325 C 300,305 340,335 400,320 L 400,400 L 0,400 Z" fill="#0284c7" opacity="0.85"/>
  <path d="M 0,330 C 70,310 140,350 220,330 C 300,310 340,340 400,325" fill="none" stroke="#bae6fd" stroke-width="2.5" opacity="0.9"/>
</svg>""",

    "piano.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="p-bg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#2a1b3d"/>
      <stop offset="60%" stop-color="#140e1f"/>
      <stop offset="100%" stop-color="#08050d"/>
    </radialGradient>
    <linearGradient id="p-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#e879f9"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#p-bg)"/>
  <!-- Minimalist abstract piano keys and floating musical curves -->
  <g transform="translate(60, 220)">
    <!-- White keys -->
    <rect x="0" y="0" width="36" height="120" rx="4" fill="#3b2d54" stroke="#58437a" stroke-width="1.5"/>
    <rect x="40" y="0" width="36" height="120" rx="4" fill="#3b2d54" stroke="#58437a" stroke-width="1.5"/>
    <rect x="80" y="0" width="36" height="120" rx="4" fill="#3b2d54" stroke="#58437a" stroke-width="1.5"/>
    <rect x="120" y="0" width="36" height="120" rx="4" fill="#4c386d" stroke="#c084fc" stroke-width="1.5"/>
    <rect x="160" y="0" width="36" height="120" rx="4" fill="#3b2d54" stroke="#58437a" stroke-width="1.5"/>
    <rect x="200" y="0" width="36" height="120" rx="4" fill="#3b2d54" stroke="#58437a" stroke-width="1.5"/>
    <rect x="240" y="0" width="36" height="120" rx="4" fill="#3b2d54" stroke="#58437a" stroke-width="1.5"/>
    <!-- Black keys -->
    <rect x="26" y="0" width="22" height="72" rx="3" fill="#171024" stroke="#7e22ce" stroke-width="1"/>
    <rect x="66" y="0" width="22" height="72" rx="3" fill="#171024" stroke="#7e22ce" stroke-width="1"/>
    <rect x="146" y="0" width="22" height="72" rx="3" fill="#251838" stroke="#a855f7" stroke-width="1"/>
    <rect x="186" y="0" width="22" height="72" rx="3" fill="#171024" stroke="#7e22ce" stroke-width="1"/>
    <rect x="226" y="0" width="22" height="72" rx="3" fill="#171024" stroke="#7e22ce" stroke-width="1"/>
  </g>
  <!-- Floating harmonic waves -->
  <path d="M 60,160 Q 140,80 200,140 T 340,110" fill="none" stroke="url(#p-glow)" stroke-width="2.5" opacity="0.8"/>
  <path d="M 80,180 Q 170,120 230,170 T 320,150" fill="none" stroke="#e879f9" stroke-width="1.5" opacity="0.5"/>
  <circle cx="200" cy="140" r="4" fill="#ffffff"/>
  <circle cx="140" cy="110" r="3" fill="#c084fc"/>
</svg>""",

    "sleep.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="sl-bg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#181829"/>
      <stop offset="60%" stop-color="#0c0c17"/>
      <stop offset="100%" stop-color="#04040a"/>
    </radialGradient>
    <linearGradient id="crescent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#sl-bg)"/>
  <!-- Starlight constellation points -->
  <circle cx="80" cy="90" r="1.5" fill="#ffffff" opacity="0.8"/>
  <circle cx="130" cy="60" r="2" fill="#ffffff" opacity="0.9"/>
  <circle cx="280" cy="80" r="1.8" fill="#ffffff" opacity="0.7"/>
  <circle cx="330" cy="140" r="1.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="90" cy="220" r="1.5" fill="#ffffff" opacity="0.75"/>
  <circle cx="310" cy="270" r="2" fill="#ffffff" opacity="0.8"/>
  <!-- Glowing Golden Crescent Moon -->
  <path d="M 230,120 A 70,70 0 0,0 160,250 A 60,60 0 1,1 230,120 Z" fill="url(#crescent-grad)" opacity="0.95"/>
  <!-- Cozy warm embers/clouds at bottom -->
  <path d="M 0,330 Q 100,290 200,320 T 400,300 L 400,400 L 0,400 Z" fill="#1e1b4b" opacity="0.6"/>
  <path d="M 0,355 Q 120,325 240,355 T 400,345 L 400,400 L 0,400 Z" fill="#0f172a" opacity="0.8"/>
</svg>"""
}

os.makedirs("public/images/artwork", exist_ok=True)
for filename, svg in artworks.items():
    with open(f"public/images/artwork/{filename}", "w") as f:
        f.write(svg.strip())
    print(f"Created: public/images/artwork/{filename}")
