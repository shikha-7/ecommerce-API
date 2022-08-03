const { StatusCodes } = require("http-status-codes");
const OrderSchema = require("../models/Order");
const ProdutSchema = require("../models/Product");
const { checkpermission } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'somerandomvalue';
    return { client_secret, amount }
    // console.log(amount, client_secret)

}


const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!tax || !shippingFee) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `please provide tax , and shippingFee` })
    }

    if (!cartItems || cartItems.length < 1) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `There is no Item in the cart` })
    }

    let orderItems = [];
    let subTotal = 0;

    for (items of cartItems) {
        const dbProduct = await ProdutSchema.findOne({ _id: items.product });
        // console.log(dbProduct)
        if (!dbProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: `No product found with id ${items.product}` })
        }
        const { name, price, image, _id } = dbProduct;

        const singleOrderItem = {
            amount: items.amount,
            price,
            name,
            image,
            product: _id
        }
        orderItems = [...orderItems, singleOrderItem];
        // calculate subtotal
        subTotal += items.amount * price;
        //calculate total
        const total = subTotal + tax + shippingFee;
        // get client secret
        const paymentIntent = await fakeStripeAPI({
            amount: total,
            currency: 'usd'
        });
        // console.log(paymentIntent.client_secret)
        const order = await OrderSchema.create({
            tax,
            shippingFee,
            subTotal,
            total,
            orderItems,
            user: req.user.UserId,
            clientSecret: paymentIntent.client_secret,

        })


        res.status(StatusCodes.CREATED).json({ order, clientSecret: paymentIntent.client_secret })
    }
}


const getsingleOrder = async (req, res) => {
    const { params: { id: OrderId } } = req;
    const order = await OrderSchema.findOne({ _id: OrderId });
    if (!order) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `no order with id ${OrderId}` })
    }
    checkpermission(req.user, order.user)
    return res.status(StatusCodes.OK).json({ order })
}


const getAllOrders = async (req, res) => {
    const orders = await OrderSchema.find({});
    return res.status(StatusCodes.OK).json({ orders })
}


const showAllMyOrders = async (req, res) => {
    const orders = await OrderSchema.findOne({ user: req.user.UserId });
    return res.status(StatusCodes.OK).json({ orders })
}


const updateOrder = async (req, res) => {
    const { params: { id: OrderId } } = req;
    const { paymentIntentId } = req.body;

    const orders = await OrderSchema.findOne({ _id: OrderId });
    if (!orders) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `no order with id ${OrderId}` })
    }
    checkpermission(req.user, orders.user);
    orders.paymentIntentId = "somerandomvalues";
    orders.status = "paid";
    await orders.save();

    return res.status(StatusCodes.OK).json({ orders })
}




module.exports = { createOrder, getsingleOrder, showAllMyOrders, getAllOrders, updateOrder }