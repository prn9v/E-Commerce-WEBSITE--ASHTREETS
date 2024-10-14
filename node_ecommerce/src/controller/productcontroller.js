const productService = require('../services/productservice.js');

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        console.log('Product created:', product);

        // Optionally, immediately fetch all products to confirm the new one is included
        const products = await productService.getAllProducts({});
        console.log('All products after creation:', products);

        res.status(201).send(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send({ error: error.message });
    }
};
;

const deleteProduct = async(req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.deleteProduct(productId);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const updateProduct = async(req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.updateProduct(productId, req.body);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const findProductById = async(req, res) => {
    const productId = req.params.id;
    try {
        const product = await productService.findProductById(productId);
        console.log("product is: ",product);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        console.log('Request received with query:', req.query);

        // Build filters from the query
        const filter = {};

        // Handle color filter
        if (req.query.color) {
            filter.color = { $in: req.query.color.split(',') };
        }

        // Handle price filter
        if (req.query.price) {
            const priceRange = req.query.price.split('-');
            filter.discountedPrice = {
                $gte: Number(priceRange[0]),
                $lte: Number(priceRange[1]),
            };
        }

        // Handle size filter
        if (req.query.size) {
            filter.sizes = { $in: req.query.size.split(',') };
        }

        // Handle availability filter
        if (req.query.availability) {
            filter.quantity = req.query.availability === 'true' ? { $gt: 0 } : { $lte: 0 };
        }

        // Handle discount price filter
        if (req.query.discountPrice) {
            const discountRange = req.query.discountPrice.split('-');
            filter.discountedPrice = {
                $gte: Number(discountRange[0]),
                $lte: Number(discountRange[1]),
            };
        }

        // Extract sort parameters (e.g., sortBy and order)
        const sortBy = req.query.sortBy || 'createdAt'; // Default sort is creation date
        const order = req.query.order === 'desc' ? -1 : 1; // Descending or Ascending

        // Fetch products based on filters and sorting
        const products = await productService.getAllProducts(filter, { [sortBy]: order });

        return res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: error.message });
    }
};




const createMultipleProducts = async(req, res) => {
    try {
        await productService.createMultipleProducts(req.body);
        return res.status(201).send({ message: "Products Created Successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = { createProduct, deleteProduct, updateProduct, findProductById, getAllProducts, createMultipleProducts };
