require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const formRoutes = require('./routes/forms');
const responseRoutes = require('./routes/responses');

const uploadRoutes = require('./routes/uploadRoutes');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static if you want to serve local uploads during dev

app.use('/api', uploadRoutes);

app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error(err));