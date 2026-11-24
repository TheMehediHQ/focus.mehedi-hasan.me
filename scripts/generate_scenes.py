import os

scenes = {
    "rainy-window.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="rw-glow" cx="60%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <filter id="rw-blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="35"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#rw-glow)"/>
  <!-- Distant streetlights blurred through wet glass -->
  <g filter="url(#rw-blur)" opacity="0.6">
    <circle cx="1100" cy="450" r="160" fill="#38bdf8" opacity="0.25"/>
    <circle cx="650" cy="520" r="120" fill="#f59e0b" opacity="0.2"/>
    <circle cx="1400" cy="380" r="90" fill="#818cf8" opacity="0.3"/>
    <circle cx="350" cy="600" r="140" fill="#06b6d4" opacity="0.15"/>
  </g>
  <!-- Window frame subtle structure -->
  <line x1="960" y1="0" x2="960" y2="1080" stroke="#1e293b" stroke-width="8" opacity="0.4"/>
  <line x1="0" y1="540" x2="1920" y2="540" stroke="#1e293b" stroke-width="8" opacity="0.4"/>
</svg>""",

    "forest.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="for-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#062117"/>
      <stop offset="50%" stop-color="#03160f"/>
      <stop offset="100%" stop-color="#010805"/>
    </linearGradient>
    <radialGradient id="sun-glow" cx="50%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#064e3b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#for-bg)"/>
  <circle cx="960" cy="200" r="450" fill="url(#sun-glow)"/>
  <!-- Multi-layered silhouettes of trees and rolling hills -->
  <path d="M 0,680 Q 480,580 960,660 T 1920,600 L 1920,1080 L 0,1080 Z" fill="#042318" opacity="0.6"/>
  <path d="M 0,780 Q 520,700 1100,770 T 1920,720 L 1920,1080 L 0,1080 Z" fill="#031a12" opacity="0.8"/>
  <path d="M 0,880 Q 400,810 960,860 T 1920,830 L 1920,1080 L 0,1080 Z" fill="#02120c"/>
  <!-- Subtle light rays through canopy -->
  <polygon points="960,0 800,1080 860,1080 960,0" fill="#34d399" opacity="0.04"/>
  <polygon points="960,0 1080,1080 1160,1080 960,0" fill="#34d399" opacity="0.05"/>
</svg>""",

    "ocean.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="ocn-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#081b2e"/>
      <stop offset="45%" stop-color="#0f2b48"/>
      <stop offset="70%" stop-color="#0a1a2e"/>
      <stop offset="100%" stop-color="#030810"/>
    </linearGradient>
    <radialGradient id="ocn-moon" cx="50%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#38bdf8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0f2b48" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#ocn-sky)"/>
  <circle cx="960" cy="320" r="180" fill="url(#ocn-moon)"/>
  <!-- Horizon line -->
  <line x1="0" y1="580" x2="1920" y2="580" stroke="#38bdf8" stroke-width="1.5" opacity="0.25"/>
  <!-- Moon reflection on deep water -->
  <polygon points="960,580 880,1080 1040,1080" fill="#7dd3fc" opacity="0.06"/>
  <!-- Low wave swells -->
  <path d="M 0,650 Q 480,630 960,650 T 1920,640 L 1920,1080 L 0,1080 Z" fill="#072036" opacity="0.6"/>
  <path d="M 0,760 Q 420,735 960,760 T 1920,745 L 1920,1080 L 0,1080 Z" fill="#041524" opacity="0.8"/>
  <path d="M 0,890 Q 500,860 1020,890 T 1920,870 L 1920,1080 L 0,1080 Z" fill="#020a12"/>
</svg>""",

    "night-sky.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="ns-nebula" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#311042" stop-opacity="0.7"/>
      <stop offset="40%" stop-color="#140b2e" stop-opacity="0.5"/>
      <stop offset="80%" stop-color="#060514"/>
      <stop offset="100%" stop-color="#020208"/>
    </radialGradient>
    <radialGradient id="ns-dust" cx="30%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#020208" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#ns-nebula)"/>
  <rect width="100%" height="100%" fill="url(#ns-dust)"/>
  <!-- Glowing star clusters -->
  <circle cx="450" cy="220" r="2.5" fill="#ffffff" opacity="0.9"/>
  <circle cx="890" cy="180" r="3" fill="#ffffff" opacity="0.95"/>
  <circle cx="1400" cy="290" r="2.5" fill="#fbcfe8" opacity="0.85"/>
  <circle cx="1650" cy="190" r="2" fill="#bae6fd" opacity="0.8"/>
  <circle cx="280" cy="450" r="2" fill="#ffffff" opacity="0.7"/>
  <circle cx="1120" cy="510" r="2.2" fill="#ffffff" opacity="0.9"/>
  <circle cx="780" cy="740" r="2" fill="#e9d5ff" opacity="0.75"/>
</svg>""",

    "fireplace.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="fp-fire" cx="50%" cy="85%" r="65%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8"/>
      <stop offset="25%" stop-color="#ea580c" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#7c2d12" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#090503" stop-opacity="0.95"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0a0604"/>
  <circle cx="960" cy="850" r="650" fill="url(#fp-fire)"/>
  <!-- Hearth stone surround outline -->
  <path d="M 600,1080 L 600,650 C 600,480 1320,480 1320,650 L 1320,1080 Z" fill="none" stroke="#271810" stroke-width="12" opacity="0.6"/>
  <!-- Glowing coals at base -->
  <ellipse cx="960" cy="980" rx="260" ry="60" fill="#f97316" opacity="0.4"/>
  <ellipse cx="960" cy="990" rx="180" ry="35" fill="#fbbf24" opacity="0.7"/>
</svg>"""
}

os.makedirs("public/images/backgrounds", exist_ok=True)
for filename, svg in scenes.items():
    with open(f"public/images/backgrounds/{filename}", "w") as f:
        f.write(svg.strip())
    print(f"Created: public/images/backgrounds/{filename}")
