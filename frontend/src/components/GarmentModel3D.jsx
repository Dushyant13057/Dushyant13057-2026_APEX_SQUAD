/* GarmentModel3D — SVG-based garment preview (no 3D dependency) */

function GarmentModel3D({ type = 'tshirt', color = '#1a1a2e', height = 200, style = {} }) {
  return (
    <div style={{
      width: '100%', height: `${height}px`, borderRadius: '12px', overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, #18181e 0%, #0e0e12 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
        {type === 'tshirt' && (
          <>
            <path d="M30 35 L10 55 L25 60 L25 120 L95 120 L95 60 L110 55 L90 35 L75 45 L60 35 L45 45 Z" fill={color} opacity="0.8" />
            <path d="M45 45 Q60 55 75 45" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" />
          </>
        )}
        {type === 'shirt' && (
          <>
            <path d="M30 30 L5 55 L20 60 L20 125 L100 125 L100 60 L115 55 L90 30 L75 42 L60 30 L45 42 Z" fill={color} opacity="0.8" />
            <line x1="60" y1="42" x2="60" y2="125" stroke="#fff" strokeWidth="0.8" opacity="0.2" />
            {[55,70,85,100].map(y => <circle key={y} cx="60" cy={y} r="2" fill="#e8e0d0" opacity="0.6" />)}
          </>
        )}
        {type === 'sando' && (
          <>
            <path d="M35 30 L35 120 L85 120 L85 30 L70 25 Q60 35 50 25 Z" fill={color} opacity="0.8" />
            <path d="M50 25 Q60 35 70 25" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" />
          </>
        )}
      </svg>
    </div>
  );
}

export default GarmentModel3D;
