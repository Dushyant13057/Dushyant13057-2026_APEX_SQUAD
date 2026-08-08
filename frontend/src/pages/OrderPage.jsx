import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getBusinesses, getDesigns, placeOrder } from '../utils/api';
import { ScissorsIcon, StarIcon, PackageIcon } from '../components/GarmentIcons';
import './OrderPage.css';

function OrderPage({ user }) {
  const navigate = useNavigate();
  const [tailors, setTailors] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [delivery, setDelivery] = useState('normal');
  const [payment, setPayment] = useState('cod');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [tailorRes, designRes] = await Promise.all([
          getBusinesses('tailor'),
          getDesigns()
        ]);
        setTailors(tailorRes.data);
        setDesigns(designRes.data);
      } catch {
        setTailors([
          { id: 3, name: 'Stitch Master', rating: 4.8, services: ['Shirts', 'Suits', 'Traditional'], reviews: [{ rating: 5 }, { rating: 5 }] },
          { id: 4, name: 'Perfect Fit Tailors', rating: 4.3, services: ['T-Shirts', 'Casual', 'Dresses'], reviews: [{ rating: 4 }, { rating: 4 }] },
        ]);
      }
    };
    load();
  }, []);

  const latestDesign = designs[designs.length - 1];
  const baseCost = latestDesign?.costs?.total || 1500;
  const deliveryCost = delivery === 'fast' ? 200 : 0;
  const totalPerItem = baseCost + deliveryCost;
  const grandTotal = totalPerItem * quantity;

  const handlePlaceOrder = async () => {
    try {
      const res = await placeOrder({
        designId: latestDesign?.id || 1,
        tailorId: selectedTailor?.id,
        tailorName: selectedTailor?.name,
        quantity,
        delivery,
        payment,
        address,
        totalCost: grandTotal,
      });
      setOrderId(res.data.order?.id || Math.floor(Math.random() * 9000) + 1000);
    } catch {
      setOrderId(Math.floor(Math.random() * 9000) + 1000);
    }
    setOrderPlaced(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} size={16} filled={i <= Math.round(rating)} color="#FFD700" />);
    }
    return <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>{stars}</div>;
  };

  if (orderPlaced) {
    return (
      <div className="order-page">
        <Navbar user={user} onLogout={() => navigate('/login')} />
        <div className="order-content">
          <div className="popup-overlay" style={{ position: 'relative', background: 'transparent', backdropFilter: 'none', minHeight: '60vh' }}>
            <div className="popup-content" style={{ maxWidth: '500px' }}>
              <div className="order-success">
                <div className="success-icon">🎉</div>
                <h2 style={{ marginBottom: '12px' }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Your custom outfit is being prepared</p>
                <div className="order-id">Order #{orderId}</div>
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                    Back to Home
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/design')}>
                    New Design
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <Navbar user={user} onLogout={() => navigate('/login')} />
      <div className="order-content">
        <div className="page-header">
          <h1>Place Your Order</h1>
          <p>Select a tailor, choose delivery & payment, and confirm your order</p>
        </div>

        <div className="order-layout">
          {/* Tailor Selection */}
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Select a Tailor</h3>
            <div className="tailor-list">
              {tailors.map(t => (
                <div
                  key={t.id}
                  className={`tailor-card glass-card ${selectedTailor?.id === t.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTailor(t)}
                >
                  <div className="tailor-avatar"><ScissorsIcon size={32} color="#ffffff" /></div>
                  <div className="tailor-info">
                    <h4>{t.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {t.reviews?.length || 0} reviews
                    </p>
                    <div className="tailor-services">
                      {t.services?.map((s, i) => (
                        <span key={i} className="badge badge-gold">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="tailor-rating">
                    <div className="tailor-score">{t.rating}</div>
                    <div className="tailor-stars">{renderStars(t.rating)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Sidebar */}
          <div className="order-sidebar">
            <div className="glass-card">
              <div className="order-section">
                <h4>Quantity</h4>
                <div className="quantity-control">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="order-section">
                <h4>Delivery</h4>
                <div className="delivery-options">
                  <div
                    className={`delivery-option ${delivery === 'normal' ? 'selected' : ''}`}
                    onClick={() => setDelivery('normal')}
                  >
                    <div><PackageIcon size={24} color={delivery === 'normal' ? "#d4a574" : "#a1a1a9"} /></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Normal</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>5-7 days</div>
                    <div style={{ color: 'var(--success)', fontWeight: 600 }}>Free</div>
                  </div>
                  <div
                    className={`delivery-option ${delivery === 'fast' ? 'selected' : ''}`}
                    onClick={() => setDelivery('fast')}
                  >
                    <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={delivery === 'fast' ? "#d4a574" : "#a1a1a9"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={delivery === 'fast' ? "#d4a574" : "none"}/></svg></div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Fast</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2-3 days</div>
                    <div style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>₹200</div>
                  </div>
                </div>
              </div>

              <div className="order-section">
                <h4>Payment</h4>
                <div className="payment-options">
                  <div
                    className={`payment-option ${payment === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPayment('cod')}
                  >
                    <div className={`payment-radio ${payment === 'cod' ? 'checked' : ''}`}></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>Cash on Delivery</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay when you receive</div>
                    </div>
                  </div>
                  <div
                    className={`payment-option ${payment === 'online' ? 'selected' : ''}`}
                    onClick={() => setPayment('online')}
                  >
                    <div className={`payment-radio ${payment === 'online' ? 'checked' : ''}`}></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>Pay Online</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UPI / Card / Net Banking</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-section">
                <h4>Delivery Address</h4>
                <textarea 
                  className="form-input" 
                  placeholder="Enter complete delivery location..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', minHeight: '80px', marginTop: '12px', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Total */}
              <div className="order-total">
                <div className="total-row">
                  <span style={{ color: 'var(--text-secondary)' }}>Item Cost</span>
                  <span>₹{baseCost}</span>
                </div>
                <div className="total-row">
                  <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                  <span>{deliveryCost > 0 ? `₹${deliveryCost}` : 'Free'}</span>
                </div>
                <div className="total-row">
                  <span style={{ color: 'var(--text-secondary)' }}>Quantity</span>
                  <span>×{quantity}</span>
                </div>
                {latestDesign?.selectedFabric?.wholesaler && (
                  <div className="total-row" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Fabric (To Wholesaler)</span>
                    <span>₹{latestDesign.costs?.fabric || 0}</span>
                  </div>
                )}
                <div className="total-row grand">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={handlePlaceOrder}
                disabled={!selectedTailor || !address.trim()}
              >
                {selectedTailor ? (address.trim() ? '✦ Place Order' : 'Enter Delivery Address') : 'Select a Tailor First'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
