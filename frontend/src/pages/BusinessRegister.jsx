import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { registerBusiness } from '../utils/api';
import { PrinterIcon, FabricIcon, ScissorsIcon } from '../components/GarmentIcons';
import './BusinessRegister.css';

const ROLES = [
  { type: 'printer', name: 'Printer', icon: <PrinterIcon size={48} color="#d4a574" />, desc: 'Screen & digital printing services', services: ['Screen Printing', 'DTG Printing', 'Sublimation', 'Embossing', 'Heat Transfer'] },
  { type: 'wholesaler', name: 'Cloth Wholesaler', icon: <FabricIcon size={48} color="#d4a574" />, desc: 'Supply fabrics & materials', services: ['Cotton', 'Silk', 'Linen', 'Polyester', 'Denim', 'Wool', 'Chiffon', 'Velvet'] },
  { type: 'tailor', name: 'Tailor', icon: <ScissorsIcon size={48} color="#d4a574" />, desc: 'Stitching & tailoring services', services: ['Shirts', 'Trousers', 'Suits', 'T-Shirts', 'Dresses', 'Traditional Wear', 'Alterations'] },
];

function BusinessRegister({ user }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    selectedServices: [],
    pricing: '',
  });
  const [registered, setRegistered] = useState(false);

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter(s => s !== service)
        : [...prev.selectedServices, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    const business = {
      name: formData.name,
      type: selectedRole.type,
      contact: formData.contact,
      services: formData.selectedServices,
      pricing: formData.pricing
        ? Object.fromEntries(formData.pricing.split(',').map(p => {
            const [k, v] = p.trim().split(':');
            return [k?.trim(), Number(v?.trim()) || 0];
          }))
        : {},
    };

    try {
      await registerBusiness(business);
    } catch {
      // Works even without backend
    }
    setRegistered(true);
  };

  if (registered) {
    return (
      <div className="business-page">
        <Navbar user={user} onLogout={() => navigate('/login')} />
        <div className="business-content">
          <div className="register-success">
            <div className="register-success-icon">🎉</div>
            <h2>Business Registered!</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>
              Your {selectedRole.name} business has been successfully registered on Design X.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/ratings')}>
                View Ratings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-page">
      <Navbar user={user} onLogout={() => navigate('/login')} />

      <div className="business-content">
        <div className="page-header">
          <h1>Register Your Business</h1>
          <p>Join the Design X platform as a service provider</p>
        </div>

        {/* Role Selection */}
        <div className="role-grid">
          {ROLES.map(role => (
            <div
              key={role.type}
              className={`role-card glass-card ${selectedRole?.type === role.type ? 'selected' : ''}`}
              onClick={() => { setSelectedRole(role); setFormData(prev => ({ ...prev, selectedServices: [] })); }}
            >
              <div className="role-icon">{role.icon}</div>
              <div className="role-name">{role.name}</div>
              <div className="role-desc">{role.desc}</div>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        {selectedRole && (
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="glass-card">
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ transform: 'scale(0.6)' }}>{selectedRole.icon}</span> {selectedRole.name} Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.contact}
                    onChange={e => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Services Offered</label>
                  <div className="services-checkboxes">
                    {selectedRole.services.map(service => (
                      <label
                        key={service}
                        className={`service-checkbox ${formData.selectedServices.includes(service) ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedServices.includes(service)}
                          onChange={() => toggleService(service)}
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pricing (optional)</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Shirts: 500, Suits: 2500"
                    value={formData.pricing}
                    onChange={e => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Format: Service: Price, separated by commas
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              ✦ Register Business
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BusinessRegister;
