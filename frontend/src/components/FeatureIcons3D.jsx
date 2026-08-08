/* FeatureIcons3D — SVG icon components (no 3D dependency) */

export function ScissorsIcon({ size = 48, color = '#d4a574' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

export function RulerIcon({ size = 48, color = '#d4a574' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <rect x="2" y="8" width="20" height="8" rx="1" />
      {[6,10,14,18].map(x => <line key={x} x1={x} y1="8" x2={x} y2="12" />)}
    </svg>
  );
}

export function ThreadIcon({ size = 48, color = '#d4a574' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" />
      <path d="M12 4 Q16 8 12 12 Q8 16 12 20" />
    </svg>
  );
}

export default { ScissorsIcon, RulerIcon, ThreadIcon };
