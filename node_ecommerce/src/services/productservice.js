const Category = require('../models/categorymodel');
const Product = require('../models/product');

async function createProduct(reqData) {
    let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

    if (!topLevel) {
        topLevel = new Category({
            name: reqData.topLevelCategory,
            level: 1,
        });
        await topLevel.save();
    }

    let secondLevel = await Category.findOne({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id,
    });

    if (!secondLevel) {
        secondLevel = new Category({
            name: reqData.secondLevelCategory,
            parentCategory: topLevel._id,
            level: 2,
        });
        await secondLevel.save();
    }

    let thirdLevel = await Category.findOne({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
        level: 3,
    });

    if (!thirdLevel) {
        thirdLevel = new Category({
            name: reqData.thirdLevelCategory,
            parentCategory: secondLevel._id,
            level: 3,
        });
        await thirdLevel.save();
    }

    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrice: reqData.discountedPrice,
        discountPresent: reqData.discountPresent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: reqData.price,
        sizes: reqData.size,
        quantity: reqData.quantity,
        category: thirdLevel._id,
    });

    return await product.save();
}

async function deleteProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error(`Product not found with id: ${productId}`);
    }

    await Product.findByIdAndDelete(productId);
    return "Product Deleted Successfully";
}

async function updateProduct(productId, reqData) {
    const product = await Product.findByIdAndUpdate(productId, reqData, { new: true });
    if (!product) {
        throw new Error(`Product not found with id: ${productId}`);
    }
    return product;
}

async function findProductById(id) {
    // Validate the provided ID
    if (!id) {
        throw new Error("Product ID is required");
    }

    // Try to find the product and populate its category
    const product = await Product.findById(id).populate("category").exec();
    console.log("Product",product);

    // Check if the product exists
    if (!product) {
        throw new Error(`Product not found with id: ${id}`);
    }

    // Return the found product
    return product;
}


async function getAllProducts(reqQuery = {}, sortOptions = {}) {
    let {
        category,
        color,
        sizes,
        minPrice,
        maxPrice,
        minDiscount,
        sort,
        stock,
        pageNumber = 1,
        pageSize = 10
    } = reqQuery;

    // Start with a base query
    let query = Product.find().populate("category");

    // Apply category filter if provided
    if (category) {
        const existCategory = await Category.findOne({ name: category });
        if (existCategory) {
            query = query.where("category").equals(existCategory._id);
        } else {
            // If the category doesn't exist, return an empty result
            return { content: [], currentPage: 1, totalPages: 0 };
        }
    }

    // Apply color filter only if color is present in the query
    if (color) {
        const colorRegex = new RegExp(color.split(",").map(c => c.trim()).join("|"), "i");
        query = query.where("color").regex(colorRegex);
    }

    // Apply size filter if sizes are present in the query
    if (sizes) {
        query = query.where("sizes").in(sizes.split(",").map(size => size.trim()));
    }

    // Apply price range filter if minPrice and maxPrice are both provided
    if (minPrice && maxPrice) {
        query = query.where("price").gte(minPrice).lte(maxPrice);
    }


    // Apply stock filter if stock is provided
    if (stock) {
        if (stock === "in_stock") {
            query = query.where("quantity").gt(0);
        } else if (stock === "out_stock") {
            query = query.where("quantity").lte(0);
        }
    }

    // Apply sorting if sortOptions are provided
    if (sortOptions) {
        query = query.sort(sortOptions);
    }

    // Pagination: skip and limit for current page
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    // Get the total count of products that match the query
    const totalProducts = await Product.countDocuments(query);
    console.log("Total products are: ", totalProducts);

    // Fetch the products that match the query
    const products = await query.exec();

    // Return products and pagination info
    return {
        content: products,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / pageSize),
    };
}




async function createMultipleProducts(products) {
    for (let product of products) {
        await createProduct(product);
    }
}

module.exports = { createProduct, deleteProduct, updateProduct, findProductById, getAllProducts, createMultipleProducts };
