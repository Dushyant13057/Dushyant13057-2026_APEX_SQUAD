import HumanModel3D from './HumanModel3D';
import ViewControls from './ViewControls';
import PoseControls from './PoseControls';
import { useState } from 'react';

const MEASUREMENTS = [
  { key: 'height', label: 'Height', unit: 'cm', min: 100, max: 220 },
  { key: 'chest', label: 'Chest', unit: 'in', min: 28, max: 60 },
  { key: 'waist', label: 'Waist', unit: 'in', min: 24, max: 50 },
  { key: 'shoulder', label: 'Shoulder', unit: 'in', min: 14, max: 26 },
  { key: 'hip', label: 'Hip', unit: 'in', min: 28, max: 55 },
  { key: 'neck', label: 'Neck', unit: 'in', min: 10, max: 22 },
  { key: 'armLength', label: 'Arm Length', unit: 'in', min: 18, max: 30 },
  { key: 'thigh', label: 'Thigh', unit: 'in', min: 16, max: 35 },
  { key: 'legLength', label: 'Leg Length', unit: 'in', min: 24, max: 40 },
  { key: 'wrist', label: 'Wrist', unit: 'in', min: 5, max: 10 },
];

const BODY_TYPES = ['slim', 'regular', 'muscular', 'oversized'];

export default function StepBody({ design, setDesign }) {
  const [camCtrl, setCamCtrl] = useState(null);

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Body Measurements</h2>
        <p>Enter measurements — the 3D model reshapes in real-time</p>
      </div>
      <div className="measurements-layout">
        <div>
          <div className="gender-toggle">
            {['male','female'].map(g => (
              <button key={g} className={`gender-btn ${design.gender===g?'active':''}`}
                onClick={()=>setDesign(d=>({...d,gender:g}))}>
                {g==='male'?'👨 Male':'👩 Female'}
              </button>
            ))}
          </div>
          <div className="body-selectors">
            {BODY_TYPES.map(bt => (
              <button key={bt} className={`body-selector-btn ${design.bodyType===bt?'active':''}`}
                onClick={()=>setDesign(d=>({...d,bodyType:bt}))}>
                {bt.charAt(0).toUpperCase()+bt.slice(1)}
              </button>
            ))}
          </div>
          <div className="measurement-form" style={{marginTop:16}}>
            {MEASUREMENTS.map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <div className="measurement-input">
                  <input className="form-input" type="number" min={f.min} max={f.max}
                    value={design[f.key]||''} onChange={e=>setDesign(d=>({...d,[f.key]:Number(e.target.value)}))} />
                  <span className="unit">{f.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mannequin-preview">
          <ViewControls cameraController={camCtrl} rotationLocked={design.rotationLock}
            onToggleLock={()=>setDesign(d=>({...d,rotationLock:!d.rotationLock}))} />
          <PoseControls currentPose={design.pose} onSelectPose={p => setDesign(d => ({ ...d, pose: p }))} />
          <HumanModel3D measurements={design} gender={design.gender} bodyType={design.bodyType}
            pose={design.pose} showCloth={false} autoRotate={false} height={440} onCameraRef={setCamCtrl}
            rotationLocked={design.rotationLock} />
          <div style={{marginTop:12,textAlign:'center',fontSize:'0.75rem',color:'var(--text-muted)'}}>
            🖱️ Drag to rotate • Scroll to zoom • Use F/B/L/R buttons for preset views
          </div>
          <div style={{marginTop:4,textAlign:'center',fontSize:'0.8rem',color:'var(--accent-gold)'}}>
            {design.gender==='female'?'👩':'👨'} {design.bodyType} • H:{design.height}cm C:{design.chest}in W:{design.waist}in
          </div>
        </div>
      </div>
    </div>
  );
}
