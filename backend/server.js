const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper functions
const DATA_DIR = path.join(__dirname, 'data');

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ============ AUTH ROUTES ============
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJSON('users.json');
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true, message: 'Login successful', user: { name: user.name, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// ============ DESIGN ROUTES ============
app.get('/designs', (req, res) => {
  const designs = readJSON('designs.json');
  res.json(designs);
});

app.post('/design', (req, res) => {
  const designs = readJSON('designs.json');
  const newDesign = {
    id: designs.length > 0 ? Math.max(...designs.map(d => d.id)) + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  designs.push(newDesign);
  writeJSON('designs.json', designs);
  res.json({ success: true, message: 'Design saved successfully', design: newDesign });
});

app.get('/designs/:id', (req, res) => {
  const designs = readJSON('designs.json');
  const design = designs.find(d => d.id === parseInt(req.params.id));
  if (design) {
    res.json(design);
  } else {
    res.status(404).json({ message: 'Design not found' });
  }
});

// ============ ORDER ROUTES ============
app.get('/orders', (req, res) => {
  const orders = readJSON('orders.json');
  res.json(orders);
});

app.post('/order', (req, res) => {
  const orders = readJSON('orders.json');
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  writeJSON('orders.json', orders);
  res.json({ success: true, message: 'Order placed successfully', order: newOrder });
});

// ============ BUSINESS ROUTES ============
app.get('/businesses', (req, res) => {
  const businesses = readJSON('businesses.json');
  const { type } = req.query;
  if (type) {
    res.json(businesses.filter(b => b.type === type));
  } else {
    res.json(businesses);
  }
});

app.post('/business', (req, res) => {
  const businesses = readJSON('businesses.json');
  const newBusiness = {
    id: businesses.length > 0 ? Math.max(...businesses.map(b => b.id)) + 1 : 1,
    ...req.body,
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  };
  businesses.push(newBusiness);
  writeJSON('businesses.json', businesses);
  res.json({ success: true, message: 'Business registered successfully', business: newBusiness });
});

// ============ RATING ROUTES ============
app.post('/rating', (req, res) => {
  const { businessId, rating, comment, user } = req.body;
  const businesses = readJSON('businesses.json');
  const business = businesses.find(b => b.id === parseInt(businessId));
  
  if (!business) {
    return res.status(404).json({ message: 'Business not found' });
  }
  
  if (!business.reviews) business.reviews = [];
  business.reviews.push({ user: user || 'Anonymous', comment, rating, date: new Date().toISOString() });
  
  // Recalculate average rating
  const totalRating = business.reviews.reduce((sum, r) => sum + r.rating, 0);
  business.rating = parseFloat((totalRating / business.reviews.length).toFixed(1));
  
  writeJSON('businesses.json', businesses);
  res.json({ success: true, message: 'Rating submitted', business });
});

// ============ INVENTORY / FABRICS ============
app.get('/fabrics', (req, res) => {
  const businesses = readJSON('businesses.json');
  const wholesalers = businesses.filter(b => b.type === 'wholesaler');
  const allFabrics = [];
  
  wholesalers.forEach(w => {
    if (w.inventory) {
      w.inventory.forEach(item => {
        allFabrics.push({
          ...item,
          wholesaler: w.name,
          wholesalerId: w.id
        });
      });
    }
  });
  
  res.json(allFabrics);
});

// Start server
app.listen(PORT, () => {
  console.log(`🧵 Design X Backend running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
});
