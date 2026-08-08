import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getBusinesses, submitRating } from '../utils/api';
import { StoreIcon, StarIcon, ScissorsIcon, PrinterIcon, FabricIcon } from '../components/GarmentIcons';
import './RatingsPage.css';

function RatingsPage({ user }) {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [reviewInputs, setReviewInputs] = useState({});

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const res = await getBusinesses();
      setBusinesses(res.data);
    } catch {
      // Fallback data
      setBusinesses([
        { id: 1, name: 'Royal Fabrics', type: 'wholesaler', rating: 4.5, reviews: [
          { user: 'Rahul', comment: 'Excellent quality fabrics!', rating: 5 },
          { user: 'Priya', comment: 'Good variety and fair prices', rating: 4 },
        ]},
        { id: 3, name: 'Stitch Master', type: 'tailor', rating: 4.8, reviews: [
          { user: 'Vikram', comment: 'Best tailor in the city!', rating: 5 },
          { user: 'Ananya', comment: 'Perfect fit every time', rating: 5 },
        ]},
        { id: 5, name: 'PrintZone Studio', type: 'printer', rating: 4.6, reviews: [
          { user: 'Rohit', comment: 'Vibrant prints that last!', rating: 5 },
          { user: 'Meera', comment: 'Great for bulk orders', rating: 4 },
        ]},
      ]);
    }
  };

  const filtered = filter === 'all' ? businesses : businesses.filter(b => b.type === filter);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} size={16} filled={i <= Math.round(rating)} color="#FFD700" />);
    }
    return <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>{stars}</div>;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tailor': return <ScissorsIcon size={32} color="#ffffff" />;
      case 'printer': return <PrinterIcon size={32} color="#ffffff" />;
      case 'wholesaler': return <FabricIcon size={32} color="#ffffff" />;
      default: return <StoreIcon size={32} color="#ffffff" />;
    }
  };

  const handleSubmitReview = async (businessId) => {
    const input = reviewInputs[businessId];
    if (!input?.rating || !input?.comment) return;

    try {
      await submitRating({
        businessId,
        rating: input.rating,
        comment: input.comment,
        user: user?.name || 'Admin',
      });
      loadBusinesses();
    } catch {
      // Update locally
      setBusinesses(prev => prev.map(b => {
        if (b.id === businessId) {
          const newReview = { user: user?.name || 'Admin', comment: input.comment, rating: input.rating };
          const reviews = [...(b.reviews || []), newReview];
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          return { ...b, reviews, rating: parseFloat((totalRating / reviews.length).toFixed(1)) };
        }
        return b;
      }));
    }

    setReviewInputs(prev => ({ ...prev, [businessId]: { rating: 0, comment: '' } }));
  };

  return (
    <div className="ratings-page">
      <Navbar user={user} onLogout={() => navigate('/login')} />

      <div className="ratings-content">
        <div className="page-header">
          <h1>Ratings & Reviews</h1>
          <p>Rate and review tailors, printers, and wholesalers</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { key: 'all', label: <div style={{display:'flex', alignItems:'center', gap:'8px'}}><StoreIcon size={16} color="currentColor" /> All</div> },
            { key: 'tailor', label: <div style={{display:'flex', alignItems:'center', gap:'8px'}}><ScissorsIcon size={16} color="currentColor" /> Tailors</div> },
            { key: 'printer', label: <div style={{display:'flex', alignItems:'center', gap:'8px'}}><PrinterIcon size={16} color="currentColor" /> Printers</div> },
            { key: 'wholesaler', label: <div style={{display:'flex', alignItems:'center', gap:'8px'}}><FabricIcon size={16} color="currentColor" /> Wholesalers</div> },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Business Cards */}
        <div className="ratings-list">
          {filtered.map(b => (
            <div key={b.id} className="rating-card glass-card">
              <div className="rating-card-header">
                <div className="rating-avatar">{getTypeIcon(b.type)}</div>
                <div className="rating-header-info">
                  <h3>{b.name}</h3>
                  <span className="badge badge-gold type-badge">{b.type}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {b.reviews?.length || 0} reviews
                  </span>
                </div>
                <div className="rating-score-big">
                  <div className="rating-number">{b.rating || 0}</div>
                  <div className="rating-stars-big">{renderStars(b.rating || 0)}</div>
                </div>
              </div>

              {/* Reviews */}
              {b.reviews && b.reviews.length > 0 && (
                <div className="reviews-list">
                  {b.reviews.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-user-avatar">{r.user?.[0] || '?'}</div>
                      <div className="review-content">
                        <div className="review-header">
                          <span className="review-user">{r.user}</span>
                          <span className="review-stars">{renderStars(r.rating)}</span>
                        </div>
                        <p className="review-comment">{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Review */}
              <div className="add-review">
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '12px' }}>
                  Add Your Review
                </h4>
                <div className="star-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      onClick={() => setReviewInputs(prev => ({
                        ...prev,
                        [b.id]: { ...prev[b.id], rating: star }
                      }))}
                      style={{ display: 'inline-block', padding: '4px' }}
                    >
                      <StarIcon size={24} filled={star <= (reviewInputs[b.id]?.rating || 0)} color="#FFD700" />
                    </span>
                  ))}
                </div>
                <div className="review-form">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Write your review..."
                    value={reviewInputs[b.id]?.comment || ''}
                    onChange={e => setReviewInputs(prev => ({
                      ...prev,
                      [b.id]: { ...prev[b.id], comment: e.target.value }
                    }))}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSubmitReview(b.id)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RatingsPage;
