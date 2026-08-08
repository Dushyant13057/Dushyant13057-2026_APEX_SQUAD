import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TShirtIcon, ShirtIcon, SandoIcon, NeedleIcon } from '../components/GarmentIcons';
import { saveDesign, getFabrics } from '../utils/api';
import HumanModel3D from '../components/HumanModel3D';
import ViewControls from '../components/ViewControls';
import StepBody from '../components/StepBody';
import StepOutfit from '../components/StepOutfit';
import AIChatBot from '../components/AIChatBot';
import './DesignStudio.css';

const STEPS = [
  { num: 1, label: 'Body' }, { num: 2, label: 'Fabric' }, { num: 3, label: 'Cut' },
  { num: 4, label: 'Place' }, { num: 5, label: 'Stitch' }, { num: 6, label: 'Outfit' },
  { num: 7, label: 'Embroid.' }, { num: 8, label: 'Color' }, { num: 9, label: 'Check' },
];

const THREAD_COLORS = ['#FFFFFF','#000000','#D4A574','#C41E3A','#1E3A5F','#2E8B57','#FFD700','#FF6347','#9370DB','#FF69B4','#00CED1','#8B4513'];
const EMBROIDERY_TYPES = [
  { name: 'None', cost: 0 },
  { name: 'Minimal', cost: 200 },
  { name: 'Floral', cost: 300 },
  { name: 'Traditional', cost: 400 },
  { name: 'Royal', cost: 500 },
];
const PATTERNS = [
  { name: 'Solid', bg: '#2a2a35' },
  { name: 'Stripes', bg: 'repeating-linear-gradient(0deg,#2a2a35 0px,#2a2a35 10px,#3a3a45 10px,#3a3a45 20px)' },
  { name: 'Checks', bg: 'repeating-conic-gradient(#2a2a35 0% 25%,#3a3a45 0% 50%) 50%/20px 20px' },
  { name: 'Polka Dots', bg: 'radial-gradient(circle,#d4a574 2px,#2a2a35 2px) 0 0/15px 15px' },
  { name: 'Herringbone', bg: 'linear-gradient(135deg,#2a2a35 25%,#3a3a45 25%,#3a3a45 50%,#2a2a35 50%,#2a2a35 75%,#3a3a45 75%) 0 0/20px 20px' },
];
const PROMINENT_CLOTH_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy Blue', hex: '#162447' },
  { name: 'Red', hex: '#C41E3A' },
  { name: 'Green', hex: '#2E8B57' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Maroon', hex: '#800000' },
];
const CLOTH_COLORS = ['#000000','#FFFFFF','#162447','#C41E3A','#2E8B57','#F5F5DC','#800000','#1a1a2e','#3c1518','#6b2d5b','#d4a574','#f0e68c','#ff6b6b','#4ecdc4','#a8e6cf','#dda0dd','#b0c4de'];
const COLOR_MAP = { White:'#FFFFFF',Blue:'#1E3A5F',Black:'#000000',Red:'#C41E3A',Green:'#2E8B57',Gold:'#FFD700',Maroon:'#800000',Ivory:'#FFFFF0',Navy:'#000080',Beige:'#F5F5DC','Sky Blue':'#87CEEB',Olive:'#808000',Grey:'#808080','Dark Blue':'#00008B','Light Blue':'#ADD8E6',Pink:'#FFB6C1',Peach:'#FFDAB9',Lavender:'#E6E6FA','Royal Blue':'#4169E1',Emerald:'#50C878',Rose:'#FF007F',Silver:'#C0C0C0',Brown:'#8B4513' };

function DesignStudio({ user }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [fabrics, setFabrics] = useState([]);
  const [camCtrl, setCamCtrl] = useState(null);

  const [design, setDesign] = useState({
    height: 170, chest: 40, waist: 32, shoulder: 18, hip: 36, neck: 15,
    armLength: 24, thigh: 24, legLength: 32, wrist: 7,
    gender: 'male', bodyType: 'regular', skinTone: 'medium',
    selectedFabric: null, selectedColor: null, cuttingMethod: 'ai',
    outfit: 'T-Shirt', outfitType: 'T-Shirt', outfitCategory: 'T-Shirt', size: 'M', fitType: 'regular',
    threadColor: '#000000', threadWidth: 2,
    embroidery: 'None', embroideryType: 'None', embroideryPlacement: 'chest',
    pattern: 'Solid', clothColor: '#162447', color: 'Navy Blue', fabric: 'Cotton',
    feasible: true, rotationLock: false, placedPieces: [],
  });

  useEffect(() => {
    getFabrics().then(r => setFabrics(r.data)).catch(() => {
      setFabrics([
        { fabric:'Cotton', colors:['White','Blue','Black'], pricePerMeter:250, wholesaler:'Royal Fabrics' },
        { fabric:'Silk', colors:['Gold','Maroon','Ivory'], pricePerMeter:800, wholesaler:'Royal Fabrics' },
        { fabric:'Linen', colors:['Beige','White','Sky Blue'], pricePerMeter:450, wholesaler:'Royal Fabrics' },
        { fabric:'Denim', colors:['Dark Blue','Light Blue','Black'], pricePerMeter:350, wholesaler:'Royal Fabrics' },
        { fabric:'Polyester', colors:['Black','White','Grey'], pricePerMeter:180, wholesaler:'Royal Fabrics' },
        { fabric:'Wool', colors:['Grey','Black','Brown'], pricePerMeter:600, wholesaler:'Heritage Textiles' },
        { fabric:'Velvet', colors:['Maroon','Royal Blue','Emerald'], pricePerMeter:750, wholesaler:'Heritage Textiles' },
        { fabric:'Satin', colors:['Ivory','Gold','Silver'], pricePerMeter:550, wholesaler:'Heritage Textiles' },
      ]);
    });
  }, []);

  useEffect(() => {
    if (currentStep === 3 && canvasRef.current) {
      const c = canvasRef.current, ctx = c.getContext('2d');
      c.width = 700; c.height = 500;
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,c.width,c.height);
      ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 0.5;
      for (let i=0;i<c.width;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,c.height);ctx.stroke();}
      for (let i=0;i<c.height;i+=20){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(c.width,i);ctx.stroke();}
    }
  }, [currentStep]);

  const [isDrawing, setIsDrawing] = useState(false);
  const startDraw = e => { if(!canvasRef.current)return; const r=canvasRef.current.getBoundingClientRect(); const ctx=canvasRef.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(e.clientX-r.left,e.clientY-r.top); ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.lineCap='round'; setIsDrawing(true); };
  const doDraw = e => { if(!isDrawing||!canvasRef.current)return; const r=canvasRef.current.getBoundingClientRect(); const ctx=canvasRef.current.getContext('2d'); ctx.lineTo(e.clientX-r.left,e.clientY-r.top); ctx.stroke(); };
  const stopDraw = () => setIsDrawing(false);

  const aiCut = () => {
    if(!canvasRef.current)return;
    const ctx=canvasRef.current.getContext('2d');
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,700,500);
    ctx.strokeStyle='#e0e0e0'; ctx.lineWidth=0.5;
    for(let i=0;i<700;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,500);ctx.stroke();}
    for(let i=0;i<500;i+=20){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(700,i);ctx.stroke();}
    ctx.strokeStyle='#C41E3A'; ctx.lineWidth=2; ctx.setLineDash([5,5]);
    const fw=design.chest*3.5, fh=design.height*1.8;
    ctx.strokeRect(50,50,fw,fh); ctx.setLineDash([]); ctx.fillStyle='#C41E3A'; ctx.font='12px Inter';
    ctx.fillText('Front Panel',60,70); ctx.fillText(`${design.chest}" × ${(design.height*0.5).toFixed(0)}"`,60,88);
    ctx.setLineDash([5,5]); ctx.strokeRect(50+fw+40,50,fw,fh); ctx.setLineDash([]);
    ctx.fillText('Back Panel',50+fw+50,70);
    const sw=design.shoulder*4; ctx.setLineDash([5,5]); ctx.strokeRect(50,50+fh+30,sw,100); ctx.setLineDash([]);
    ctx.fillText('Sleeve (×2)',60,50+fh+50);
    ctx.fillStyle='#1E3A5F'; ctx.font='bold 14px Inter'; ctx.fillText('✂️ AI Auto-Cut Pattern',250,490);
  };

  const clearCanvas = () => { if(!canvasRef.current)return; const ctx=canvasRef.current.getContext('2d'); ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,700,500); ctx.strokeStyle='#e0e0e0'; ctx.lineWidth=0.5; for(let i=0;i<700;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,500);ctx.stroke();} for(let i=0;i<500;i+=20){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(700,i);ctx.stroke();} };

  const calcCosts = () => {
    let fabricRate = 250;
    if (design.selectedFabric) {
      if (typeof design.selectedFabric === 'object' && Number(design.selectedFabric.pricePerMeter) > 0) {
        fabricRate = Number(design.selectedFabric.pricePerMeter);
      } else if (typeof design.selectedFabric === 'number' && design.selectedFabric > 0) {
        fabricRate = design.selectedFabric;
      }
    }
    const fabricCost = Math.round(fabricRate * 2.5);
    const stitchingCost = (design.outfitType || design.outfit) ? 500 : 300;
    const threadWidth = Number(design.threadWidth) || 2;
    const threadCost = Math.round(threadWidth * 50);

    let embroideryCost = 0;
    if (design.embroideryType) {
      if (typeof design.embroideryType === 'object' && Number(design.embroideryType.cost) >= 0) {
        embroideryCost = Number(design.embroideryType.cost);
      } else if (typeof design.embroideryType === 'number') {
        embroideryCost = design.embroideryType;
      } else if (typeof design.embroideryType === 'string') {
        const name = design.embroideryType.toLowerCase();
        if (name.includes('minimal')) embroideryCost = 200;
        else if (name.includes('floral')) embroideryCost = 300;
        else if (name.includes('traditional')) embroideryCost = 400;
        else if (name.includes('royal')) embroideryCost = 500;
      }
    }

    const totalRaw = fabricCost + stitchingCost + threadCost + embroideryCost;
    const total = isNaN(totalRaw) ? 1450 : totalRaw;

    return {
      fabric: fabricCost,
      stitching: stitchingCost,
      thread: threadCost,
      embroidery: embroideryCost,
      total,
      formattedTotal: total.toLocaleString('en-IN'),
    };
  };

  const checkFeasibility = () => [
    { label:'Body measurements provided', pass: design.height>0 && design.chest>0 },
    { label:'Fabric selected', pass: !!design.selectedFabric },
    { label:'Cutting pattern defined', pass: true },
    { label:'Stitch config valid', pass: design.threadWidth>0 },
    { label:'Color/pattern applied', pass: !!design.clothColor },
    { label:'Size compatibility', pass: design.chest<=60 && design.waist<=50 },
  ];

  const handleSave = async () => {
    try {
      await saveDesign({ ...design, selectedFabric: design.selectedFabric ? { fabric:design.selectedFabric.fabric, color:design.selectedColor, pricePerMeter:design.selectedFabric.pricePerMeter } : null, embroideryType:design.embroideryType?.name||null, costs:calcCosts() });
      alert('Design saved!'); navigate('/order');
    } catch { alert('Saved locally!'); navigate('/order'); }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <StepBody design={design} setDesign={setDesign} />;
      case 2: return (
        <div className="step-content"><div className="step-header"><h2>Select Fabric</h2><p>Choose your preferred fabric</p></div>
        <div className="fabric-grid">{fabrics.map((f,i) => (
          <div key={i} className={`fabric-card glass-card ${design.selectedFabric?.fabric===f.fabric?'selected':''}`}
            onClick={()=>setDesign(d=>({...d,selectedFabric:f,selectedColor:f.colors[0]}))}>
            <div className="fabric-swatch" style={{background:`linear-gradient(135deg,${COLOR_MAP[f.colors?.[0]]||'#ddd'},${COLOR_MAP[f.colors?.[1]]||'#aaa'})`}}></div>
            <div className="fabric-name">{f.fabric}</div>
            <div className="fabric-price">₹{f.pricePerMeter}/m</div>
            <div className="fabric-wholesaler">by {f.wholesaler}</div>
            <div className="fabric-colors">{f.colors?.map((c,ci)=>(
              <div key={ci} className={`color-dot ${design.selectedColor===c&&design.selectedFabric?.fabric===f.fabric?'selected':''}`}
                style={{backgroundColor:COLOR_MAP[c]||c}} onClick={e=>{e.stopPropagation();setDesign(d=>({...d,selectedFabric:f,selectedColor:c}))}}></div>
            ))}</div>
          </div>
        ))}</div></div>
      );
      case 3: return (
        <div className="step-content"><div className="step-header"><h2>Cloth Cutting</h2><p>Draw patterns or use AI auto-cut</p></div>
        <div className="cutting-layout">
          <div className="canvas-container"><canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={doDraw} onMouseUp={stopDraw} onMouseLeave={stopDraw}></canvas></div>
          <div className="cutting-tools">
            <h4 style={{color:'var(--accent-gold)',marginBottom:8}}>Tools</h4>
            <button className="tool-btn active" onClick={aiCut}>✂️ AI Auto-Cut</button>
            <button className="tool-btn" onClick={clearCanvas}>🗑️ Clear</button>
            <button className="tool-btn">✏️ Freehand</button>
            <button className="tool-btn">▭ Rectangle</button>
            <div className="cost-display" style={{marginTop:16}}>
              <p style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Based on measurements:</p>
              <p style={{color:'var(--text-primary)',marginTop:4}}>H:{design.height}cm C:{design.chest}in</p>
              <p style={{color:'var(--text-primary)'}}>W:{design.waist}in S:{design.shoulder}in</p>
            </div>
          </div>
        </div></div>
      );
      case 4: return (
        <div className="step-content"><div className="step-header"><h2>Piece Placement</h2><p>Click pieces to place on the 3D model</p></div>
        <div className="placement-layout">
          <div className="pieces-panel">
            <h4 style={{color:'var(--accent-gold)'}}>Available Pieces</h4>
            {['Front Panel','Back Panel','Left Sleeve','Right Sleeve','Collar','Pocket'].map((p,i)=>(
              <div key={i} className={`piece-item ${design.placedPieces.includes(p)?'placed':''}`}
                onClick={()=>{if(!design.placedPieces.includes(p))setDesign(d=>({...d,placedPieces:[...d.placedPieces,p]}))}}>
                <div className="piece-preview" style={{backgroundColor:design.clothColor||'#1a1a2e',opacity:design.placedPieces.includes(p)?0.3:0.6}}></div>
                <div className="piece-info"><h4 style={{textDecoration:design.placedPieces.includes(p)?'line-through':'none'}}>{p}</h4></div>
              </div>
            ))}
            <button className="btn btn-secondary" style={{marginTop:12,width:'100%'}} onClick={()=>setDesign(d=>({...d,placedPieces:[]}))}>Reset</button>
          </div>
          <div className="mannequin-preview">
            <ViewControls cameraController={camCtrl} rotationLocked={design.rotationLock} onToggleLock={()=>setDesign(d=>({...d,rotationLock:!d.rotationLock}))} />
            <HumanModel3D measurements={design} gender={design.gender} bodyType={design.bodyType} clothColor={design.clothColor}
              showCloth={design.placedPieces.length>0} placedPieces={design.placedPieces}
              autoRotate={!design.rotationLock} enableControls={true} rotationLocked={design.rotationLock} height={430} onCameraRef={setCamCtrl} />
          </div>
        </div></div>
      );
      case 5: return (
        <div className="step-content"><div className="step-header"><h2>Stitching</h2><p>Thread color and width</p></div>
        <div className="stitching-layout"><div>
          <h4 style={{color:'var(--accent-gold)',marginBottom:16}}>Thread Color</h4>
          <div className="thread-colors">{THREAD_COLORS.map((c,i)=>(
            <div key={i} className={`thread-color ${design.threadColor===c?'selected':''}`} style={{backgroundColor:c}}
              onClick={()=>setDesign(d=>({...d,threadColor:c}))}></div>
          ))}</div>
          <h4 style={{color:'var(--accent-gold)',margin:'24px 0 16px'}}>Thread Width</h4>
          <input type="range" min="1" max="5" value={design.threadWidth} className="width-slider"
            onChange={e=>setDesign(d=>({...d,threadWidth:Number(e.target.value)}))} />
          <div style={{display:'flex',justifyContent:'space-between',color:'var(--text-muted)',fontSize:'0.8rem',marginTop:8}}>
            <span>Thin (1)</span><span>Current: {design.threadWidth}</span><span>Thick (5)</span>
          </div>
          <div style={{marginTop:24,padding:20,background:'var(--bg-tertiary)',borderRadius:12,textAlign:'center'}}>
            <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:12}}>Stitch Preview</p>
            <div style={{height:`${design.threadWidth*3}px`,background:`repeating-linear-gradient(90deg,${design.threadColor} 0px,${design.threadColor} 8px,transparent 8px,transparent 12px)`,borderRadius:2,margin:'0 auto',width:'80%'}}></div>
          </div>
        </div><div>
          <h4 style={{color:'var(--accent-gold)',marginBottom:16}}>Cost Breakdown</h4>
          <div className="cost-display">{(()=>{const c=calcCosts();return(<>
            <div className="cost-row"><span>Cloth</span><span>₹{(c.fabric || 0).toLocaleString('en-IN')}</span></div>
            <div className="cost-row"><span>Stitching</span><span>₹{(c.stitching || 0).toLocaleString('en-IN')}</span></div>
            <div className="cost-row"><span>Thread</span><span>₹{(c.thread || 0).toLocaleString('en-IN')}</span></div>
            <div className="cost-row"><span>Embroidery</span><span>₹{(c.embroidery || 0).toLocaleString('en-IN')}</span></div>
            <div className="cost-row"><span>Total</span><span>₹{(c.total || 0).toLocaleString('en-IN')}</span></div>
          </>);})()}</div>
        </div></div></div>
      );
      case 6: return <StepOutfit design={design} setDesign={setDesign} />;
      case 7: {
        const curEmb = typeof design.embroideryType === 'object' ? design.embroideryType.name : (design.embroideryType || design.embroidery || 'None');
        return (
          <div className="step-content">
            <div className="step-header">
              <h2>Embroidery & Details</h2>
              <p>Add traditional, floral, or royal embroidery work to your 3D garment</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: 16 }}>Embroidery Style</h4>
                <div className="embroidery-types" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                  {EMBROIDERY_TYPES.map((t, i) => {
                    const isSelected = curEmb === t.name;
                    return (
                      <div
                        key={i}
                        className={`embroidery-type glass-card ${isSelected ? 'selected' : ''}`}
                        style={{
                          padding: 16,
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 12,
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'rgba(212,165,116,0.15)' : 'var(--bg-card)',
                        }}
                        onClick={() => setDesign(d => ({ ...d, embroideryType: t, embroidery: t.name }))}
                      >
                        <NeedleIcon size={32} color={isSelected ? '#d4a574' : '#6b6358'} />
                        <div style={{ fontWeight: 600, marginTop: 8, fontSize: '0.9rem' }}>{t.name}</div>
                        <div style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', marginTop: 2 }}>
                          {t.cost > 0 ? `+₹${t.cost}` : 'Free'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h4 style={{ color: 'var(--accent-gold)', margin: '24px 0 16px' }}>Placement</h4>
                <div className="placement-options" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {['Chest', 'Back', 'Sleeve', 'Collar', 'Pocket', 'Hem'].map(p => (
                    <div
                      key={p}
                      className={`placement-option glass-card ${design.embroideryPlacement === p.toLowerCase() ? 'selected' : ''}`}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: design.embroideryPlacement === p.toLowerCase() ? '1px solid #d4a574' : '1px solid #444',
                        background: design.embroideryPlacement === p.toLowerCase() ? '#d4a574' : 'var(--bg-card)',
                        color: design.embroideryPlacement === p.toLowerCase() ? '#000' : '#fff',
                      }}
                      onClick={() => setDesign(d => ({ ...d, embroideryPlacement: p.toLowerCase() }))}
                    >
                      {p}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24 }}>
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: 12 }}>Custom Embroidery Upload</h4>
                  <div className="upload-area" onClick={() => document.getElementById('emb-upload')?.click()} style={{ border: '2px dashed var(--border-subtle)', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Click to upload artwork/pattern</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>PNG, JPG, SVG up to 5MB</p>
                    <input type="file" id="emb-upload" accept="image/*" style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <div className="mannequin-preview">
                <ViewControls cameraController={camCtrl} rotationLocked={design.rotationLock} onToggleLock={() => setDesign(d => ({ ...d, rotationLock: !d.rotationLock }))} />
                <HumanModel3D
                  measurements={design}
                  gender={design.gender}
                  bodyType={design.bodyType}
                  clothColor={design.clothColor}
                  showCloth={true}
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
      case 8: return (
        <div className="step-content">
          <div className="step-header"><h2>Pattern & Color</h2><p>Apply color finishes and fabric patterns</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
            <div>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: 12 }}>Prominent Colors</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10, marginBottom: 24 }}>
                {PROMINENT_CLOTH_COLORS.map(c => {
                  const isSel = design.clothColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <div
                      key={c.name}
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        background: 'var(--bg-card)',
                        border: isSel ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                      }}
                      onClick={() => setDesign(d => ({ ...d, clothColor: c.hex, color: c.name }))}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.hex, border: '1px solid #666' }} />
                      <span style={{ fontSize: '0.8rem', color: isSel ? 'var(--accent-gold)' : 'var(--text-primary)', fontWeight: isSel ? 600 : 400 }}>{c.name}</span>
                    </div>
                  );
                })}
              </div>

              <h4 style={{ color: 'var(--accent-gold)', marginBottom: 12 }}>Patterns</h4>
              <div className="pattern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
                {PATTERNS.map((p, i) => (
                  <div
                    key={i}
                    className={`pattern-card ${design.pattern === p.name ? 'selected' : ''}`}
                    style={{ background: p.bg, borderRadius: 8, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: design.pattern === p.name ? '2px solid var(--accent-gold)' : '1px solid #444' }}
                    onClick={() => setDesign(d => ({ ...d, pattern: p.name }))}
                  >
                    <div className="pattern-name" style={{ background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem' }}>{p.name}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <label className="form-label" style={{ margin: 0 }}>Custom Color Picker:</label>
                <input
                  type="color"
                  value={design.clothColor}
                  onChange={e => setDesign(d => ({ ...d, clothColor: e.target.value, color: 'Custom' }))}
                  style={{ width: 50, height: 36, border: 'none', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{design.clothColor}</span>
              </div>
            </div>

            <div className="mannequin-preview">
              <ViewControls cameraController={camCtrl} rotationLocked={design.rotationLock} onToggleLock={() => setDesign(d => ({ ...d, rotationLock: !d.rotationLock }))} />
              <HumanModel3D
                measurements={design}
                gender={design.gender}
                bodyType={design.bodyType}
                clothColor={design.clothColor}
                showCloth={true}
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
      case 9: {
        const checks = checkFeasibility();
        const allPass = checks.every(c => c.pass);
        const costs = calcCosts();
        const embName = typeof design.embroideryType === 'object' ? design.embroideryType.name : (design.embroideryType || design.embroidery || 'None');
        const outfitName = design.outfitType || design.outfit || 'Kurta';

        return (
          <div className="step-content">
            <div className="step-header">
              <h2>🔍 Final Design & Feasibility Check</h2>
              <p>Review your complete 3D outfit preview, measurements, and manufacturing verification</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
              <div className="mannequin-preview glass-card" style={{ padding: 16, borderRadius: 16 }}>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: 12, textAlign: 'center' }}>Complete 3D Mannequin Preview</h4>
                <HumanModel3D
                  measurements={design}
                  gender={design.gender}
                  bodyType={design.bodyType}
                  clothColor={design.clothColor}
                  showCloth={true}
                  outfitType={outfitName}
                  fitType={design.fitType}
                  pattern={design.pattern}
                  embroideryType={design.embroideryType}
                  autoRotate={true}
                  enableControls={true}
                  height={450}
                />
              </div>

              <div className="design-summary glass-card" style={{ padding: 24, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: '1.8rem' }}>{allPass ? '✅' : '❌'}</div>
                  <div>
                    <h3 style={{ margin: 0, color: allPass ? '#4ecdc4' : '#ff6b6b' }}>
                      {allPass ? 'Design Ready for Tailoring!' : 'Feasibility Alert'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {allPass ? 'All specifications pass manufacturing checks.' : 'Check measurements or fabric selections.'}
                    </p>
                  </div>
                </div>

                <h4 style={{ color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, marginBottom: 12 }}>
                  Outfit Specifications
                </h4>
                <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.9rem', marginBottom: 20 }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Outfit:</span> <strong>{outfitName}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Category:</span> <strong>{design.outfitCategory || 'Custom'}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Color:</span> <strong style={{ color: design.clothColor }}>{design.color || 'Selected'} ({design.clothColor})</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Fabric:</span> <strong>{design.selectedFabric?.fabric || 'Cotton'}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Pattern:</span> <strong>{design.pattern}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Embroidery:</span> <strong>{embName}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Fit:</span> <strong>{design.fitType}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Size:</span> <strong>{design.size}</strong></div>
                </div>

                <h4 style={{ color: 'var(--accent-gold)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, marginBottom: 12 }}>
                  Body Measurements Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                  <div>Height: <strong>{design.height} cm</strong></div>
                  <div>Chest: <strong>{design.chest} in</strong></div>
                  <div>Waist: <strong>{design.waist} in</strong></div>
                  <div>Shoulder: <strong>{design.shoulder} in</strong></div>
                  <div>Hip: <strong>{design.hip} in</strong></div>
                  <div>Arm: <strong>{design.armLength} in</strong></div>
                  <div>Thigh: <strong>{design.thigh} in</strong></div>
                  <div>Leg: <strong>{design.legLength} in</strong></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,165,116,0.1)', padding: '12px 16px', borderRadius: 10, marginBottom: 20 }}>
                  <span style={{ fontWeight: 600 }}>Total Cost:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-gold)' }}>₹{costs.formattedTotal || costs.total?.toLocaleString('en-IN') || '1,450'}</span>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentStep(6)}>
                    ✏️ Edit Outfit
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleSave}>
                    💾 Save Design
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1.5 }} onClick={() => navigate('/order')}>
                    🛒 Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      default: return null;
    }
  };

  return (
    <div className="design-studio">
      <Navbar user={user} onLogout={()=>navigate('/login')} />
      <div className="studio-content">
        <div className="step-indicator">{STEPS.map((step,i)=>(
          <div key={step.num} className="step-dot-wrapper">
            <div className={`step-dot ${currentStep===step.num?'active':currentStep>step.num?'completed':'inactive'}`}
              onClick={()=>setCurrentStep(step.num)}>
              {currentStep>step.num?'✓':step.num}<span className="step-label">{step.label}</span>
            </div>
            {i<STEPS.length-1 && <div className={`step-connector ${currentStep>step.num?'completed':''}`}></div>}
          </div>
        ))}</div>
        {renderStep()}
        <div className="step-navigation">
          <button className="btn btn-secondary" onClick={()=>setCurrentStep(Math.max(1,currentStep-1))} disabled={currentStep===1}>← Previous</button>
          <button className="btn btn-primary" onClick={()=>setCurrentStep(Math.min(9,currentStep+1))} disabled={currentStep===9}>Next Step →</button>
        </div>
      </div>
      <AIChatBot currentStep={currentStep} design={design} setDesign={setDesign} />
    </div>
  );
}

export default DesignStudio;
