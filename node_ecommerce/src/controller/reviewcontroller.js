const reviewService = require('../services/reviewservice.js');

const createReview = async(req,res) => {
    const user = req.user;
    try {
        const review = await reviewService.createReview(req.body,user);
        return res.status(201).send(review);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const getAllReviews = async(req,res) => {
    const productId = req.params.productId;
    const user = req.user;
    try {
        const reviews = await reviewService.getAllReviews(productId);
        return res.status(201).send(reviews);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

module.exports = { createReview , getAllReviews };