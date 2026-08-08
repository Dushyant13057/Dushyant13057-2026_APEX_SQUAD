import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TShirtIcon, ShirtIcon, SandoIcon, PackageIcon } from '../components/GarmentIcons';
import './PrintMode.css';

const GARMENTS = [
  { name: 'T-Shirt', icon: <TShirtIcon size={40} color="#d4a574" />, types: ['Polo', 'Oversized', 'Regular'] },
  { name: 'Shirt', icon: <ShirtIcon size={40} color="#d4a574" />, types: ['Full Sleeve', 'Half Sleeve', 'Sleeveless'] },
  { name: 'Sando', icon: <SandoIcon size={40} color="#d4a574" />, types: ['Gym', 'Regular'] },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const PLACEMENTS = ['Front', 'Back', 'Sleeve'];

function PrintMode({ user }) {
  const navigate = useNavigate();
  const [garment, setGarment] = useState(null);
  const [subType, setSubType] = useState('');
  const [size, setSize] = useState('M');
  const [placement, setPlacement] = useState('Front');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState('normal');
  const [payment, setPayment] = useState('cod');
  const [address, setAddress] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const baseCost = 500;
  const printCost = 150;
  const deliveryCost = delivery === 'fast' ? 200 : 0;
  const totalPerItem = baseCost + printCost;
  const grandTotal = (totalPerItem * quantity) + deliveryCost;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const validatePrint = () => {
    if (!garment) {
      setPopupMessage('Please select a garment type first.');
      setShowPopup(true);
      return;
    }
    if (!subType) {
      setPopupMessage('Please select a specific garment style (e.g., Polo, Oversized).');
      setShowPopup(true);
      return;
    }
    if (!uploadedFile) {
      setPopupMessage('Please upload a logo/design to print.');
      setShowPopup(true);
      return;
    }
    if (!address.trim()) {
      setPopupMessage('Please enter a delivery address.');
      setShowPopup(true);
      return;
    }
    if ((garment === 'Sando' || subType === 'Sleeveless') && placement === 'Sleeve') {
      setPopupMessage('Not Possible — Sleeveless garments do not have sleeves for printing.');
      setShowPopup(true);
      return;
    }

    setPopupMessage('');
    alert(`✅ Print order placed!\n\nGarment: ${garment} (${subType})\nSize: ${size}\nPlacement: ${placement}\nDesign: ${uploadedFile}\nQuantity: ${quantity}\nPayment: ${payment}\nTotal: ₹${grandTotal}`);
    navigate('/dashboard');
  };

  return (
    <div className="print-page">
      <Navbar user={user} onLogout={() => navigate('/login')} />

      <div className="print-content">
        <div className="page-header">
          <h1>Print Mode</h1>
          <p>Print your logo or design on garments — quick and simple</p>
        </div>

        <div className="print-layout">
          {/* Left: Configuration */}
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Select Garment</h3>
            <div className="garment-grid">
              {GARMENTS.map(g => (
                <div
                  key={g.name}
                  className={`garment-card glass-card ${garment === g.name ? 'selected' : ''}`}
                  onClick={() => { setGarment(g.name); setSubType(g.types[0]); }}
                >
                  <div className="garment-icon">{g.icon}</div>
                  <div className="garment-name">{g.name}</div>
                </div>
              ))}
            </div>

            {garment && (
              <>
                <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 16px' }}>Select Type</h3>
                <div className="sizes-row" style={{ justifyContent: 'flex-start' }}>
                  {GARMENTS.find(g => g.name === garment)?.types.map(t => (
                    <button
                      key={t}
                      className={`size-btn ${subType === t ? 'selected' : ''}`}
                      style={{ width: 'auto', padding: '0 16px' }}
                      onClick={() => setSubType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}

            <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 16px' }}>Select Size</h3>
            <div className="sizes-row" style={{ justifyContent: 'flex-start' }}>
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`size-btn ${size === s ? 'selected' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 16px' }}>Upload Logo / Design</h3>
            <div className="print-upload" onClick={() => document.getElementById('print-file-input')?.click()}>
              <div className="print-upload-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>Click to upload your design</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>PNG, JPG, SVG</p>
              <input
                type="file"
                id="print-file-input"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>

            {uploadedFile && (
              <div className="print-uploaded">
                <span>✅</span>
                <span style={{ color: 'var(--success)' }}>{uploadedFile}</span>
              </div>
            )}

            <h3 style={{ color: 'var(--text-primary)', margin: '24px 0 16px' }}>Placement</h3>
            <div className="placement-selector">
              {PLACEMENTS.map(p => (
                <button
                  key={p}
                  className={`placement-btn ${placement === p ? 'selected' : ''}`}
                  onClick={() => setPlacement(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '32px' }}
              onClick={validatePrint}
            >
              Submit Print Order
            </button>
          </div>

          {/* Right: Preview */}
          <div className="print-preview">
            <h3 style={{ color: 'var(--text-primary)' }}>Preview</h3>
            <div className="preview-garment">
              <div className="garment-shape" style={{ opacity: garment ? 0.8 : 0.15 }}>
                {garment === 'T-Shirt' ? <TShirtIcon size={180} color={garment ? '#d4a574' : '#ffffff'} /> :
                 garment === 'Shirt' ? <ShirtIcon size={180} color={garment ? '#d4a574' : '#ffffff'} /> :
                 garment === 'Sando' ? <SandoIcon size={180} color={garment ? '#d4a574' : '#ffffff'} /> :
                 <TShirtIcon size={180} color="#ffffff" />}
              </div>
              {uploadedFile && (
                <div className={`preview-logo ${placement.toLowerCase()}`}>
                  📷 {uploadedFile.substring(0, 10)}...
                </div>
              )}
            </div>
            <div className="glass-card" style={{ padding: '16px', width: '100%', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Garment</span>
                <span>{garment ? `${garment} (${subType})` : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Size</span>
                <span>{size}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Placement</span>
                <span>{placement}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Design</span>
                <span>{uploadedFile || '—'}</span>
              </div>
            </div>

            {/* Order Sidebar Integrated */}
            <div className="glass-card" style={{ padding: '16px', width: '100%', marginTop: '16px' }}>
              <div className="order-section" style={{ marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Quantity</h4>
                <div className="quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-primary)' }}>−</button>
                  <span className="qty-value" style={{ fontWeight: 600 }}>{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-primary)' }}>+</button>
                </div>
              </div>

              <div className="order-section" style={{ marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Delivery</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className={`delivery-option ${delivery === 'normal' ? 'selected' : ''}`} onClick={() => setDelivery('normal')} style={{ flex: 1, padding: '12px', border: `1px solid ${delivery === 'normal' ? 'var(--accent-gold)' : 'var(--border-subtle)'}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: delivery === 'normal' ? 'var(--accent-gold)' : 'var(--text-primary)' }}>Normal</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Free</div>
                  </div>
                  <div className={`delivery-option ${delivery === 'fast' ? 'selected' : ''}`} onClick={() => setDelivery('fast')} style={{ flex: 1, padding: '12px', border: `1px solid ${delivery === 'fast' ? 'var(--accent-gold)' : 'var(--border-subtle)'}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: delivery === 'fast' ? 'var(--accent-gold)' : 'var(--text-primary)' }}>Fast</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>₹200</div>
                  </div>
                </div>
              </div>

              <div className="order-section" style={{ marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Payment</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                    <span>Cash on Delivery</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="payment" checked={payment === 'online'} onChange={() => setPayment('online')} />
                    <span>Pay Online (UPI/Card)</span>
                  </label>
                </div>
              </div>

              <div className="order-section" style={{ marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Delivery Address</h4>
                <textarea 
                  className="form-input" 
                  placeholder="Enter complete delivery location..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Item Total</span>
                  <span>₹{totalPerItem * quantity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                  <span>{deliveryCost > 0 ? `₹${deliveryCost}` : 'Free'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Not Possible Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ marginBottom: '12px' }}>Not Possible</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{popupMessage}</p>
            <button className="btn btn-primary" onClick={() => setShowPopup(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrintMode;
