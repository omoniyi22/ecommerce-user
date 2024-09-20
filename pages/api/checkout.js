import { CartContext } from "@/lib/CartContext";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product"

const stripe = require("stripe")(process.env.STRIPE_KEY)

// Define the default functionfro handling reuests;
export default async function handler(req, res) {
    //Check if the request methof is not POST
    if (req.method !== "POST") {

        res.json("Should be a post request"); // Respond with a message intiating the
        // request shoild be POST
        return;
    }

    // Destructure data fro the request body
    const { email, name, address, city, state, zip, cartProducts } = req.body;

    // Connect to MongoDB using Mongoose
    await mongooseConnect();

    //Extract unique product IDs from the cart products
    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];

    // Retrive information about products from the database using their IDs
    const productsInfo = await Product.find({ _id: uniqueIds });



    //Initialize an array to store line items for the Strip session
    let line_items = []

    // Loop through with unique product ID
    for (const productId of uniqueIds) {
        // Find product information based on its ID
        const productInfo = productsInfo.find(p => p._id.toString() === productId);

        // Calculate the quantity of the product in the cart
        const quantity = productIds.filter(id => id === productId)?.length || 0;

        // If the quantiry is greater tha 0 and productInfo exists
        if (quantity > 0 && productInfo)
            // Push line item information to the line_items array
            line_items.push({
                quantity,
                price_data: {
                    currency: "KES",
                    product_data: { name: productInfo.title },
                    unit_amount: quantity * productInfo.price * 100
                },

            })
    }

    // Create a new order document in the database
    const orderDoc = await Order.create({
        line_items,
        email,
        name,
        address,
        city,
        state,
        zip,
        // country,
        paid: false,
    })


    console.log({ orderDoc })

    // Create a new Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: process.env.SUCCESS_URL + "cart?checkout-success",
        cancel_url: process.env.SUCCESS_URL + "cart?checkout-cancel",
        metadata: { orderId: orderDoc._id.toString(), test: "ok" }
    })

    res.json({
        url: session.url,
    })
}