import React from 'react';

const btnStyle = (active) => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  border: `1px solid ${active ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
  background: active ? 'rgba(212,165,116,0.15)' : 'var(--bg-tertiary)',
  color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const containerStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
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

const POSES = [
  { id: 'default', icon: '🧍', label: 'Default Pose' },
  { id: 'hips', icon: '🧍‍♀️', label: 'Hands on Hips' },
  { id: 'crossed', icon: '🙅', label: 'Arms Crossed' },
  { id: 'casual', icon: '🚶', label: 'Casual Pose' }
];

export default function PoseControls({ currentPose = 'default', onSelectPose }) {
  return (
    <div style={containerStyle}>
      {POSES.map(p => (
        <button
          key={p.id}
          style={btnStyle(currentPose === p.id)}
          onClick={() => onSelectPose(p.id)}
          title={p.label}
        >
          {p.icon}
        </button>
      ))}
    </div>
  );
}
