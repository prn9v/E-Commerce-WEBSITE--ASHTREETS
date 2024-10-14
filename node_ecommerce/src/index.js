const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    return res.status(200).send({message:"Welcome to ecommmerce api-node",status:true});
})

const authRouters = require('./routers/authroute.js');
app.use('/auth',authRouters);

const userRouters = require('./routers/userroute.js');
app.use('/api/users',userRouters);

const productRouters = require('./routers/productroute.js');
app.use('/api/products',productRouters);

const adminProductRouters = require('./routers/adminProductroute.js');
app.use('/api/admin/products',adminProductRouters);

const cartRouters = require('./routers/cartroute.js');
app.use('/api/cart',cartRouters);


const cartItemRouters = require('./routers/cartItemroute.js');
app.use('/api/cart_items',cartItemRouters);

const orderRouters = require('./routers/orderroutes.js');
app.use('/api/orders',orderRouters);

const adminOrderRouters = require('./routers/adminOrderroute.js');
app.use('/api/admin/orders',adminOrderRouters);

const reviewRouters = require('./routers/reviewroute.js');
app.use('/api/reviews',reviewRouters);

const ratingRouters = require('./routers/ratingroute.js');
app.use('/api/ratings',ratingRouters);

module.exports = app;