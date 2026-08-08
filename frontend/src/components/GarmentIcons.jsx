/* SVG-based realistic garment icons to replace emojis throughout the app */

/* ---- T-Shirt SVG ---- */
export function TShirtIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 8L12 16L16 20L20 16V56H44V16L48 20L52 16L44 8H40C40 12.4183 36.4183 16 32 16C27.5817 16 24 12.4183 24 8H20Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M20 8C20 8 24 6 32 6C40 6 44 8 44 8" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none"/>
      <path d="M32 16V56" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5"/>
      <ellipse cx="32" cy="10" rx="6" ry="4" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
    </svg>
  );
}

/* ---- Shirt SVG ---- */
export function ShirtIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22 8L10 18L15 22L20 17V56H44V17L49 22L54 18L42 8H38C38 11.3137 35.3137 14 32 14C28.6863 14 26 11.3137 26 8H22Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Collar flaps */}
      <path d="M26 8L30 14L32 10" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none"/>
      <path d="M38 8L34 14L32 10" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none"/>
      {/* Button line */}
      <line x1="32" y1="14" x2="32" y2="56" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"/>
      {/* Buttons */}
      <circle cx="32" cy="22" r="1.5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="32" cy="30" r="1.5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="32" cy="38" r="1.5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="32" cy="46" r="1.5" fill="rgba(255,255,255,0.4)"/>
      {/* Pocket */}
      <rect x="23" y="24" width="7" height="6" rx="1" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8"/>
    </svg>
  );
}

/* ---- Sando / Tank Top SVG ---- */
export function SandoIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22 12C22 12 26 8 32 8C38 8 42 12 42 12L44 14V56H20V14L22 12Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Armhole cutouts */}
      <path d="M20 14C16 16 14 22 14 28L20 24V14Z" fill="var(--bg-primary, #0a0a0b)" stroke="none"/>
      <path d="M44 14C48 16 50 22 50 28L44 24V14Z" fill="var(--bg-primary, #0a0a0b)" stroke="none"/>
      {/* Neckline */}
      <path d="M22 12C24 10 28 8 32 8C36 8 40 10 42 12" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none"/>
    </svg>
  );
}

/* ---- Scissors SVG ---- */
export function ScissorsIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="20" cy="48" r="8" fill="none" stroke={color} strokeWidth="2.5"/>
      <circle cx="44" cy="48" r="8" fill="none" stroke={color} strokeWidth="2.5"/>
      <line x1="26" y1="42" x2="44" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="38" y1="42" x2="20" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ---- Thread Spool SVG ---- */
export function ThreadIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="32" cy="48" rx="16" ry="6" fill={color} opacity="0.3"/>
      <rect x="20" y="18" width="24" height="30" rx="4" fill={color} opacity="0.8"/>
      <rect x="18" y="14" width="28" height="8" rx="3" fill={color}/>
      <rect x="18" y="44" width="28" height="8" rx="3" fill={color}/>
      {/* Thread lines */}
      <path d="M24 22H40M24 26H40M24 30H40M24 34H40M24 38H40M24 42H40" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
      {/* Thread coming off */}
      <path d="M40 28C44 26 48 20 46 14C44 10 40 12 42 16" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ---- Needle SVG ---- */
export function NeedleIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 4L36 20L32 58L28 20L32 4Z" fill={color}/>
      <ellipse cx="32" cy="10" rx="2" ry="3" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
      {/* Thread */}
      <path d="M34 10C38 8 42 10 40 14C38 18 34 16 36 12" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
    </svg>
  );
}

/* ---- Printer SVG ---- */
export function PrinterIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="16" y="8" width="32" height="14" rx="2" fill={color} opacity="0.6"/>
      <rect x="10" y="22" width="44" height="22" rx="4" fill={color}/>
      <rect x="18" y="38" width="28" height="18" rx="2" fill={color} opacity="0.5"/>
      <circle cx="46" cy="30" r="2" fill="rgba(255,255,255,0.4)"/>
      <line x1="24" y1="46" x2="40" y2="46" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <line x1="24" y1="50" x2="36" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    </svg>
  );
}

/* ---- Store / Business SVG ---- */
export function StoreIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="24" width="44" height="32" rx="2" fill={color} opacity="0.5"/>
      <path d="M6 24L10 10H54L58 24H6Z" fill={color}/>
      {/* Awning scallops */}
      <path d="M6 24C6 24 11 30 16 24C21 18 26 24 26 24C26 24 31 30 36 24C41 18 46 24 46 24C46 24 51 30 58 24" stroke={color} strokeWidth="2" fill="none"/>
      {/* Door */}
      <rect x="26" y="38" width="12" height="18" rx="1" fill="rgba(0,0,0,0.3)"/>
      <circle cx="36" cy="48" r="1" fill="rgba(255,255,255,0.3)"/>
      {/* Window */}
      <rect x="14" y="32" width="8" height="8" rx="1" fill="rgba(255,255,255,0.15)"/>
      <rect x="42" y="32" width="8" height="8" rx="1" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}

/* ---- Star SVG ---- */
export function StarIcon({ size = 48, color = '#FFD700', filled = true, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---- Fabric Roll SVG ---- */
export function FabricIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="20" cy="32" rx="10" ry="20" fill={color}/>
      <rect x="20" y="12" width="34" height="40" rx="2" fill={color} opacity="0.7"/>
      <ellipse cx="20" cy="32" rx="6" ry="14" fill="rgba(0,0,0,0.15)"/>
      {/* Fabric texture lines */}
      <line x1="26" y1="16" x2="26" y2="48" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <line x1="32" y1="14" x2="32" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <line x1="38" y1="13" x2="38" y2="51" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <line x1="44" y1="14" x2="44" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <line x1="50" y1="16" x2="50" y2="48" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
    </svg>
  );
}

/* ---- Design Palette SVG ---- */
export function PaletteIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 6C16.536 6 4 18.536 4 34C4 38 6 42 10 42C14 42 16 38 20 38C24 38 26 44 32 44C38 44 40 38 44 38C48 38 50 42 54 42C58 42 60 38 60 34C60 18.536 47.464 6 32 6Z" fill={color} opacity="0.3"/>
      <circle cx="20" cy="22" r="5" fill="#FF6B6B"/>
      <circle cx="34" cy="16" r="5" fill="#4ECDC4"/>
      <circle cx="46" cy="24" r="5" fill="#FFD93D"/>
      <circle cx="44" cy="38" r="4" fill="#6C5CE7"/>
      <circle cx="20" cy="36" r="4" fill="#00B894"/>
    </svg>
  );
}

/* ---- Package / Order SVG ---- */
export function PackageIcon({ size = 48, color = '#d4a574', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 4L56 16V48L32 60L8 48V16L32 4Z" fill={color} opacity="0.5"/>
      <path d="M32 4L56 16L32 28L8 16L32 4Z" fill={color} opacity="0.8"/>
      <line x1="32" y1="28" x2="32" y2="60" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
      <line x1="32" y1="28" x2="56" y2="16" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
      {/* Tape */}
      <path d="M20 10L44 22" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
    </svg>
  );
}
