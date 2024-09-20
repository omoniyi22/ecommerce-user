import Success from "@/components/Success";
import { CartContext } from "@/lib/CartContext";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Cart() {

    const { cartProducts, removeProduct, addProduct, clearCart } = useContext(CartContext);
    const [isSuccess, setIsSuccess] = useState(false);
    const [products, setProducts] = useState([]);
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [zip, setZip] = useState("")
    const [state, setState] = useState("")

    const { data: session } = useSession()

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post("/api/cart", { ids: cartProducts }).then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([]);
        }

        console.log({ session })
    }, [cartProducts])


    useEffect(() => {
        if (typeof window === "undefined") {
            return
        }

        if (window?.location.href.includes("checkout-success")) {
            setIsSuccess(true)
            clearCart();
            toast.success("Order placed successfully!!")
        }
    }, [])


    function increaseProduct(id) {
        addProduct(id)
        toast.success("item added!!")
    }

    function decreaseProduct(id) {
        removeProduct(id)
        toast.success("item removed!!")
    }

    function deleteCart(id) {
        clearCart(id)
        toast.success("Cart Cleared!!")
    }

    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    async function stripeCheckout() {
        try {
            console.log({
                data: {
                    email: session.user.email,
                    name: session.user.name, address, state, city, zip, cartProducts
                }
            })
            const response = await axios.post("/api/checkout", {
                email: session.user.email,
                name: session.user.name, address, state, city, zip, cartProducts
            })
            if (response.data.url) {
                window.location = response.data.url
            } else {
                toast.error("An error occured!")
            }
        } catch (err) {
            console.log({ err: err.response.message })
        }
    }

    if (isSuccess) {
        return <>
            <Success />
        </>
    }

    if (session) {
        return <>
            <section className="flex justify-between max-md:flex-col space-x-4">
                <div className="md:w-2/3 px-4">
                    <div className="mt-16 md:mt-6">
                        <header className="text-center flex justify-between w-full">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-left-3xl">
                                Your Cart
                            </h1>
                        </header>

                        {products?.length < 1 ? (
                            <p className="my-6 text-center"> Your cart is Empty </p>
                        ) :
                            (
                                <>
                                    {products?.length > 0 && products.map(product => (
                                        <div className="mt-8" key={product._id}>
                                            <ul className="space-y-4">
                                                <li className="flex items-center gap-4 justify-between">
                                                    <img src={product.images[0]} alt="cart image" className="h-16 w-16 object-cover" />
                                                    <div className="border mr-auto ml-7">
                                                        <h3 className="text-md text-text max-w-md">
                                                            {product.title}
                                                        </h3>
                                                        <dl className="mt-1 space-y-px text-sm text-text">
                                                            <p>Ksh {cartProducts.find(id => id === product._id).length} * {product.price}</p>
                                                        </dl>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="Quantity" className="sr-only"> Qunatity </label>
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => decreaseProduct(product._id)}
                                                                type="button" className="h-10 w-10 leading-10 text-gray-60 transition hover:opacity-75 border">
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                id="Quantity"
                                                                value={cartProducts.filter(id => id === product._id).length}
                                                                className="h-10 w-16 rounded border text-primary text-lg 
                                                            font-bold border-gray-200 text-center 
                                                             [-moz-appearance:_textfield] sm:text-sm [&
                                                             ::-webkit-inner-spin-button]:m-0 [&
                                                             ::-webkit-inner-spin-button]:m-0 [&
                                                             ::-webkit-inner-spin-button]:appearance-none [&
                                                             ::-webkit-outer-spin-button]:m-0 [&
                                                             ::-webkit-outer-spin-button]: appearance-none pl-3.5"
                                                            />

                                                            <button onClick={() => increaseProduct(product._id)}
                                                                type="button" className="h-10 w-10 leading-10 text-gray-60 transition hover:opacity-75 border">
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    ))}

                                    <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                                        <div className="max-w-md space-y-4">
                                            <dl className="space-y-1 text-md text-text">
                                                <div className="flex justify-end text-red-500 border-b mb-3">

                                                    <button onClick={deleteCart}>Clear Cart</button>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt>Total</dt>
                                                    <dd>Ksh. {formatPrice(total)}</dd>
                                                </div>
                                            </dl>
                                            <div className="flex justify-end">

                                                <Link
                                                    className="group flex items-center justify-between gap-4 rounded-lg border border-primary bg-primary px-5 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"
                                                    href="/products"
                                                >
                                                    <span
                                                        className="font-medium text-white transition-colors group-hover:text-primary group-active:text-primary-500"
                                                    >
                                                        Continue Shopping
                                                    </span>

                                                    <span
                                                        className="shrink-0 rounded-full border border-current bg-white p-2 text-primary group-active:text-indigo-500"
                                                    >
                                                        <svg
                                                            className="size-5 rtl:rotate-180"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </span>
                                                </Link> 
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
                {!products?.length ? (
                    ""
                ) :
                    (
                        <div className="md:1/3 mt-16 md:mt-6">
                            <header className="text-start flex flex-col w-full">
                                <h1 className="text-xl font-bold text-gray-900 sm:text-left-3xl">
                                    Shipping Details
                                </h1>

                                <p className="mt-2"> We use Your Account details for shipping.</p>
                            </header>
                            <div className="mx-auto max-w-xl p-4 border shadow-xl h-[400px] my-3">
                                <div class="space-y-5">
                                    <div class="grid grid-cols-12 gap-5">
                                        <div class="col-span-6">
                                            <label for="example1" className="mb-1 block text-md font-medium text-gray-700"> Email</label>

                                            <input type="email" id="example1"
                                                className="block w-full rounded-md p-3 border border-gray-300 
                                            shadow-sm focus:border-primary-400 focus-ring
                                            focus:ring-primary-200 focus:ring-opacity-50 
                                            disabled:cursor-not-allowed disabled:bg-gray-50
                                            disabled:text-gray-500"
                                                value={session.user.email}
                                                onChange={ev => setEmail(ev.target.value)}
                                                placeholder="your@email.com" />
                                        </div>
                                        <div className="col-span-6">
                                            <label for="example2" className="mb-1 block text-md font-medium text-gray-700"> Full Name </label>
                                            <input type="email" id="example2"
                                                className="block w-full rounded-md p-3 border border-gray-300 
                                            shadow-sm focus:border-primary-400 focus-ring
                                            focus:ring-primary-200 focus:ring-opacity-50 
                                            disabled:cursor-not-allowed disabled:bg-gray-50
                                            disabled:text-gray-500"
                                                value={session.user.name}
                                                onChange={ev => setFullName(ev.target.value)}
                                                placeholder="" />
                                        </div>

                                        <div className="col-span-12">
                                            <label for="example3" className="mb-1 block text-md font-medium text-gray-700"> Address </label>
                                            <input type="email" id="example3"
                                                className="block w-full rounded-md p-3 border border-gray-300 
                                            shadow-sm focus:border-primary-400 focus-ring
                                            focus:ring-primary-200 focus:ring-opacity-50 
                                            disabled:cursor-not-allowed disabled:bg-gray-50
                                            disabled:text-gray-500"
                                                value={address}
                                                onChange={ev => setAddress(ev.target.value)}
                                                placeholder="" />
                                        </div>

                                        <div className="col-span-6">
                                            <label for="example4" className="mb-1 block text-md font-medium text-gray-700"> City </label>
                                            <input type="email" id="example4"
                                                className="block w-full rounded-md p-3 border border-gray-300 
                                            shadow-sm focus:border-primary-400 focus-ring
                                            focus:ring-primary-200 focus:ring-opacity-50 
                                            disabled:cursor-not-allowed disabled:bg-gray-50
                                            disabled:text-gray-500"
                                                value={city}
                                                onChange={ev => setCity(ev.target.value)} placeholder="" />
                                        </div>

                                        <div className="col-span-4">
                                            <label for="example5" className="mb-1 block text-md font-medium text-gray-700"> State </label>
                                            <input type="email" id="example5"
                                                className="block w-full rounded-md p-3 border border-gray-300 
                                            shadow-sm focus:border-primary-400 focus-ring
                                            focus:ring-primary-200 focus:ring-opacity-50 
                                            disabled:cursor-not-allowed disabled:bg-gray-50
                                            disabled:text-gray-500"
                                                value={state}
                                                onChange={ev => setState(ev.target.value)}
                                                placeholder="" />
                                        </div>

                                        <div className="col-span-2">
                                            <label for="example6" className="mb-1 block text-md font-medium text-gray-700"> Zip </label>
                                            <input type="email" id="example6"
                                                className="block w-full rounded-md p-3 border border-gray-300 
                                            shadow-sm focus:border-primary-400 focus-ring
                                            focus:ring-primary-200 focus:ring-opacity-50 
                                            disabled:cursor-not-allowed disabled:bg-gray-50
                                            disabled:text-gray-500"
                                                value={zip}
                                                onChange={ev => setZip(ev.target.value)}
                                                placeholder="" />
                                        </div>

                                        <div className="col-span-12 text-ecnter w-full">
                                            <button onClick={stripeCheckout} className="block rounded bg-secondary px-5 py-3 text-md text-text transition hover:g-purple-300 w-full">Checkout</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

            </section >
        </>
    }
    else
        return <>
            <div className="grid h-screen px-4 bg-white place-content-center">
                <div className="text-center">
                    <p className="mt-4 text-text text-2xl">
                        You should Sign Up to view cart items
                    </p>
                    <button
                        className="inline-block rounded border border-primary bg-primary px-12 py-3 text-md mt-6 font-medium text-white hover:bg-transparent hover:text-primary focus:outline-none focus:ring active:text-indigo-500"
                        onClick={() => signIn("google")}
                        href="#"
                    >
                        Continue with google
                    </button>

                    {/* Border */}


                </div>
            </div>
        </>
}       