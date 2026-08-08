import HumanModel3D from './HumanModel3D';
import ViewControls from './ViewControls';
import PoseControls from './PoseControls';
import { TShirtIcon, ShirtIcon, SandoIcon } from './GarmentIcons';
import { useState } from 'react';

const OUTFIT_TYPES = [
  { name: 'T-Shirt', garmentType: 'tshirt', category: 'T-Shirt' },
  { name: 'Shirt', garmentType: 'shirt', category: 'Shirt' },
  { name: 'Hoodie', garmentType: 'hoodie', category: 'Outerwear' },
  { name: 'Jacket', garmentType: 'jacket', category: 'Outerwear' },
  { name: 'Kurta', garmentType: 'kurta', category: 'Ethnic' },
  { name: 'Pants', garmentType: 'pants', category: 'Bottom' },
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FIT_TYPES = ['tight', 'regular', 'loose', 'oversized'];

function getIcon(t, c) {
  if (t === 'shirt' || t === 'hoodie' || t === 'jacket' || t === 'kurta') return <ShirtIcon size={54} color={c} />;
  if (t === 'sando') return <SandoIcon size={54} color={c} />;
  return <TShirtIcon size={54} color={c} />;
}

export default function StepOutfit({ design, setDesign }) {
  const [camCtrl, setCamCtrl] = useState(null);

  const selectOutfit = (o) => {
    setDesign(d => ({
      ...d,
      outfitType: o.name,
      outfitCategory: o.category,
      outfit: o.name,
    }));
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Select Outfit Style</h2>
        <p>Choose garment design, size, and fit for 3D mannequin preview</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        <div>
          <div className="outfits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {OUTFIT_TYPES.map((o, i) => {
              const isSelected = design.outfitType === o.name || design.outfit === o.name;
              return (
                <div
                  key={i}
                  className={`outfit-card glass-card ${isSelected ? 'selected' : ''}`}
                  style={{
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'space-between',
                    border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    background: isSelected ? 'rgba(212, 165, 116, 0.12)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  onClick={() => selectOutfit(o)}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', height: 70, alignItems: 'center' }}>
                    {getIcon(o.garmentType, isSelected ? '#d4a574' : '#888')}
                  </div>
                  <div className="outfit-name" style={{ fontWeight: 600, fontSize: '1rem', marginTop: 8, textAlign: 'center' }}>
                    {o.name}
                  </div>
                  <div className="badge badge-gold" style={{ margin: '6px 0 10px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: 10, background: 'rgba(212,165,116,0.2)', color: '#d4a574' }}>
                    {o.category}
                  </div>

                  <button
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', padding: '6px 12px', fontSize: '0.85rem', marginTop: 4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectOutfit(o);
                    }}
                  >
                    {isSelected ? '✓ Selected' : 'Select Outfit'}
                  </button>

                  {isSelected && (
                    <div className="sizes-row" style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                      {SIZES.map(s => (
                        <button
                          key={s}
                          className={`size-btn ${design.size === s ? 'selected' : ''}`}
                          style={{
                            padding: '2px 6px',
                            fontSize: '0.75rem',
                            borderRadius: 4,
                            border: design.size === s ? '1px solid #d4a574' : '1px solid #444',
                            background: design.size === s ? '#d4a574' : 'transparent',
                            color: design.size === s ? '#000' : '#fff',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            setDesign(d => ({ ...d, size: s }));
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24 }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: 12 }}>Fit Type</h4>
            <div className="fit-selector" style={{ display: 'flex', gap: 10 }}>
              {FIT_TYPES.map(ft => (
                <button
                  key={ft}
                  className={`fit-btn ${design.fitType === ft ? 'active' : ''}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: design.fitType === ft ? '1px solid #d4a574' : '1px solid #444',
                    background: design.fitType === ft ? '#d4a574' : 'var(--bg-card)',
                    color: design.fitType === ft ? '#000' : '#fff',
                    cursor: 'pointer',
                    fontWeight: design.fitType === ft ? 600 : 400,
                  }}
                  onClick={() => setDesign(d => ({ ...d, fitType: ft }))}
                >
                  {ft.charAt(0).toUpperCase() + ft.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mannequin-preview">
          <ViewControls
            cameraController={camCtrl}
            rotationLocked={design.rotationLock}
            onToggleLock={() => setDesign(d => ({ ...d, rotationLock: !d.rotationLock }))}
          />
          <PoseControls currentPose={design.pose} onSelectPose={p => setDesign(d => ({ ...d, pose: p }))} />
          <HumanModel3D
            measurements={design}
            gender={design.gender}
            bodyType={design.bodyType}
            pose={design.pose}
            clothColor={design.clothColor}
            showCloth={!!design.outfitType || !!design.outfit}
            outfitType={design.outfitType || design.outfit}
            fitType={design.fitType}
            pattern={design.pattern}
            embroideryType={design.embroideryType}
            autoRotate={!design.rotationLock}
            height={420}
            onCameraRef={setCamCtrl}
          />
        </div>
      </div>
    </div>
  );
}

