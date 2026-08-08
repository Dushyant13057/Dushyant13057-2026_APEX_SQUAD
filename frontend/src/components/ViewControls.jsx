import { useState } from 'react';

const viewBtnStyle = (active) => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  border: `1px solid ${active ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
  background: active ? 'rgba(212,165,116,0.15)' : 'var(--bg-tertiary)',
  color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
  fontSize: '0.7rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const containerStyle = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  zIndex: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  background: 'rgba(10,10,11,0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  padding: '8px',
};

export default function ViewControls({ cameraController, rotationLocked, onToggleLock }) {
  const [activeView, setActiveView] = useState('front');

  const handleView = (view) => {
    setActiveView(view);
    if (cameraController?.setView) {
      cameraController.setView(view);
    }
  };

  return (
    <div style={containerStyle}>
      {/* View presets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        {[
          { key: 'front', label: 'F' },
          { key: 'back', label: 'B' },
          { key: 'left', label: 'L' },
          { key: 'right', label: 'R' },
        ].map(v => (
          <button
            key={v.key}
            style={viewBtnStyle(activeView === v.key)}
            onClick={() => handleView(v.key)}
            title={`${v.key.charAt(0).toUpperCase() + v.key.slice(1)} View`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '2px 0' }} />

      {/* Rotation lock */}
      <button
        style={{
          ...viewBtnStyle(rotationLocked),
          width: '100%',
          fontSize: '0.65rem',
          height: '30px',
          gap: '4px',
        }}
        onClick={onToggleLock}
        title={rotationLocked ? 'Unlock Rotation' : 'Lock Rotation'}
      >
        {rotationLocked ? '🔒' : '🔄'}
      </button>
    </div>
  );
}
