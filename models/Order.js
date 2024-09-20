const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    zip: String,
    name: String,
    address: String,
    paid: Boolean,
    city: String,
    state: String,
}, {
    timestamps: true,
})

export const Order = models?.Order || model("Order", OrderSchema)