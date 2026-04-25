require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'C2C E-commerce API is running.' });
});

//require('./routes')(app);

//require('./events/listeners');

require('./src/routes')(app);

require('./src/events/listeners');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const db = require('./src/config/db.config'); // chắc là path đúng với file db.config.js

// Test connection
db.query('SELECT NOW() AS now')
  .then(res => {
    console.log('✅ Database connected, current time:', res.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });
