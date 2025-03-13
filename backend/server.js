const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
// const port = process.env.PORT || 6000;
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./products.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create products table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      marketing_blurb TEXT
    )`);
  }
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate marketing blurb using OpenAI
async function generateMarketingBlurb(name, category) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert. Create a short, catchy marketing blurb (max 100 characters) for the given product."
        },
        {
          role: "user",
          content: `Product: ${name}, Category: ${category}`
        }
      ],
      max_tokens: 100
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating marketing blurb:', error);
    return null;
  }
}

// API Routes
// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new product
app.post('/api/products', async (req, res) => {
  const { name, description, price, category } = req.body;
  
  try {
    const marketingBlurb = await generateMarketingBlurb(name, category);
    
    db.run(
      'INSERT INTO products (name, description, price, category, marketing_blurb) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category, marketingBlurb],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          id: this.lastID,
          name,
          description,
          price,
          category,
          marketingBlurb
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  
  try {
    const marketingBlurb = await generateMarketingBlurb(name, category);
    
    db.run(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, marketing_blurb = ? WHERE id = ?',
      [name, description, price, category, marketingBlurb, id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          id,
          name,
          description,
          price,
          category,
          marketingBlurb
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 