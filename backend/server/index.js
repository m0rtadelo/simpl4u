const express = require('express');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const app = express();
const port = 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/mydb';
const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Secret key for signing tokens

app.use(express.json());
app.use('/simpl4u', express.json());
app.use('/simpl4u', express.text({ type: 'text/plain' }));

// Disable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

let db;

// Connect to MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user; // Attach user info to the request
    next();
  });
}

// Route to generate a token (for login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace this with your own user validation logic
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' }); // Generate token
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid username or password.' });
});

// Updated GET route to handle query params
app.get('/simpl4u', authenticateToken, async (req, res) => {
  try {
    const simpl4u = await db.collection('simpl4u').find().toArray();
    const key = req.query.key; // Get the 'key' query parameter

    if (key && simpl4u[0]) {
      return res.json(simpl4u[0][key]); // Return the value for the specified key
    }

    res.json(simpl4u[0]); // Return the entire object if no key is provided
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Updated POST route to handle raw text input
app.post('/simpl4u', authenticateToken, async (req, res) => {
  try {
    const key = req.query.key; // Get the 'key' query parameter
    const contentType = req.headers['content-type'];

    let value;
    if (contentType === 'text/plain') {
      value = req.body.toString(); // Handle raw text input
    } else {
      value = req.body; // Handle JSON input
    }

    if (key) {
      // Update only the specified key in the first document of the collection
      const result = await db.collection('simpl4u').updateOne({}, { $set: { [key]: value } }, { upsert: true });
      return res.json(result);
    }

    // If no key is provided, replace the entire content of the collection
    await db.collection('simpl4u').deleteMany({});
    const result = await db.collection('simpl4u').insertOne(value);

    res.json(result);
  } catch (error) {
    console.error('Error updating collection content:', error);
    res.status(500).json({ error: 'Failed to update collection content' });
  }
});
