const express = require('express');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'E-Commerce API is running' });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});