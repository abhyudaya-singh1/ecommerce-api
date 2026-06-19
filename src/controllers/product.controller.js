const pool = require('../config/db');

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.id, p.name, p.price, p.sale_price,
                    p.stock_quantity, p.brand, p.status,
                    c.name AS category_name
             FROM products p
             JOIN categories c ON p.category_id = c.id
             ORDER BY p.id DESC`
        );
        res.status(200).json({
            success: true,
            count:   result.rows.length,
            data:    result.rows
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET ONE PRODUCT
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT p.*, c.name AS category_name
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE p.id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Product with id ${id} not found`
            });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADD PRODUCT
const addProduct = async (req, res) => {
    try {
        const {
            category_id, name, slug, short_description,
            description, sku, price, sale_price,
            stock_quantity, thumbnail, brand
        } = req.body;

        if (!name || !sku || !category_id || !price) {
            return res.status(400).json({
                success: false,
                message: 'name, sku, category_id and price are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO products
                (category_id, name, slug, short_description, description,
                 sku, price, sale_price, stock_quantity, thumbnail, brand)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             RETURNING *`,
            [category_id, name, slug, short_description, description,
             sku, price, sale_price, stock_quantity || 0, thumbnail, brand]
        );
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data:    result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU or slug already exists'
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, slug, short_description, description,
            price, sale_price, stock_quantity,
            thumbnail, brand, status
        } = req.body;

        const existing = await pool.query(
            'SELECT id FROM products WHERE id = $1', [id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Product with id ${id} not found`
            });
        }

        const result = await pool.query(
            `UPDATE products SET
                name              = COALESCE($1,  name),
                slug              = COALESCE($2,  slug),
                short_description = COALESCE($3,  short_description),
                description       = COALESCE($4,  description),
                price             = COALESCE($5,  price),
                sale_price        = COALESCE($6,  sale_price),
                stock_quantity    = COALESCE($7,  stock_quantity),
                thumbnail         = COALESCE($8,  thumbnail),
                brand             = COALESCE($9,  brand),
                status            = COALESCE($10, status),
                updated_at        = NOW()
             WHERE id = $11
             RETURNING *`,
            [name, slug, short_description, description,
             price, sale_price, stock_quantity,
             thumbnail, brand, status, id]
        );
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data:    result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Product with id ${id} not found`
            });
        }
        res.status(200).json({
            success: true,
            message: `Product "${result.rows[0].name}" deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};