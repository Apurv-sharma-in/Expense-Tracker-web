const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    "TEST430329ae80e0f32e41a393d78b923034",
    "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"
);

const createOrder = async (orderId, amount, customerId) => {
    const request = {
        order_amount: amount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: String(customerId),
            customer_phone: "9876543210"
        },
        order_meta: {
            return_url: `http://127.0.0.1:5500/04_Build_Expense_Tracker/public/HTML/dashboard.html?${orderId}`
        }
    };

    const response = await cashfree.PGCreateOrder(request);
    return response.data;
};

const getOrderPayments = async (orderId) => {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    return response.data;
};

module.exports = { createOrder, getOrderPayments };
