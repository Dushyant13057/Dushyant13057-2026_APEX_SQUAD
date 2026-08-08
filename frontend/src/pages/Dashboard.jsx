import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getDesigns, getOrders } from '../utils/api';
import { PaletteIcon, PackageIcon, PrinterIcon, StoreIcon, StarIcon, ShirtIcon } from '../components/GarmentIcons';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ designs: 0, orders: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [designsRes, ordersRes] = await Promise.all([getDesigns(), getOrders()]);
        setStats({
          designs: designsRes.data.length,
          orders: ordersRes.data.length,
        });
      } catch (e) {
        // Backend might not be running
      }
    };
    loadStats();
  }, []);

  const features = [
    {
      icon: <PaletteIcon size={36} color="#d4a574" />,
      title: 'New Design',
      desc: 'Create a custom outfit from scratch — measurements, fabric, stitching & more.',
      path: '/design'
    },
    {
      icon: <PackageIcon size={36} color="#d4a574" />,
      title: 'My Orders',
      desc: 'View, manage and track all your placed orders in one place.',
      path: '/order'
    },
    {
      icon: <PrinterIcon size={36} color="#d4a574" />,
      title: 'Print Mode',
      desc: 'Quick print logos & designs on T-shirts, shirts, and sandos.',
      path: '/print'
    },
    {
      icon: <StoreIcon size={36} color="#d4a574" />,
      title: 'Register Business',
      desc: 'Register as a Tailor, Printer, or Cloth Wholesaler.',
      path: '/register'
    },
    {
      icon: <StarIcon size={36} color="#FFD700" />,
      title: 'Ratings & Reviews',
      desc: 'Rate tailors, printers, and wholesalers based on your experience.',
      path: '/ratings'
    },
    {
      icon: <ShirtIcon size={36} color="#d4a574" />,
      title: 'Quick Outfit',
      desc: 'Choose from standard outfits — Polo, Oversized, Formal & more.',
      path: '/design'
    }
  ];

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        {/* Hero */}
        <div className="dashboard-hero">
          <p className="dashboard-welcome">Welcome back</p>
          <h1 className="dashboard-title">
            Your <span className="gold">Creative Studio</span>
          </h1>
          <p className="dashboard-subtitle">
            Design, customize, and order your perfect outfit — all in one place.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="dashboard-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card glass-card"
              onClick={() => navigate(f.path)}
              id={`feature-${f.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-arrow">→</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.designs}</div>
            <div className="stat-label">Designs Created</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.orders}</div>
            <div className="stat-label">Orders Placed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">5</div>
            <div className="stat-label">Partner Businesses</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">9</div>
            <div className="stat-label">Fabric Types</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
