const Order = require('../models/order');
const User = require('../models/user');
const { createOrder, getOrderPayments } = require('../services/cashFreeService');

const purchasePremium = async (req, res) => {
    try {
        const orderId = 'order_' + Date.now();
        const amount = 99;

        const cashfreeOrder = await createOrder(orderId, amount, req.user.userId);

        await Order.create({
            orderId: orderId,
            status: 'PENDING',
            userId: req.user.userId
        });

        return res.status(201).json({
            payment_session_id: cashfreeOrder.payment_session_id,
            order_id: orderId
        });
    } catch (error) {
        console.error('Purchase Premium Error:', error.response ? error.response.data : error);
        return res.status(500).json({ message: 'Something went wrong creating order' });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { order_id } = req.body;

        const order = await Order.findOne({ where: { orderId: order_id } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
            let payments = [];
        try {
            payments = await getOrderPayments(order_id);
        } catch (cfError) {
            console.log('Cashfree fetch error on failed payment:', cfError.message);
        }
        const successfulPayment = payments.find(
            (payment) => payment.payment_status === 'SUCCESS'
        );

        if (successfulPayment) {
            await Promise.all([
                order.update({
                    paymentId: String(successfulPayment.cf_payment_id),
                    status: 'SUCCESSFUL'
                }),
                User.update(
                    { isPremium: true },
                    { where: { id: req.user.userId } }
                )
            ]);

            return res.status(202).json({
                success: true,
                message: 'Transaction Successful'
            });
        } else {
            
            await order.update({ status: 'FAILED' });
            return res.status(400).json({
                success: false,
                message: 'Transaction Failed'
            });
        }
    } catch (error) {
        console.error('Update Transaction Error:', error.response ? error.response.data : error);
        return res.status(500).json({ message: 'Failed to update transaction status' });
    }
};

module.exports = { purchasePremium, updateTransactionStatus };
