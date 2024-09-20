import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({})

export function CartContextProvider({ children }) {
    const localStorage = typeof window !== "undefined" ? window.localStorage : null
    const [cartProducts, setCartProducts] = useState([])
    useEffect(() => {
        if (cartProducts?.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cartProducts));
        }
    }, [cartProducts])

    useEffect(() => {
        if (localStorage && localStorage.getItem("cart")) {
            setCartProducts(JSON.parse(localStorage.getItem("cart")));
        }
    }, [])

    function addProduct(productId) {
        setCartProducts(prev => ([...prev, productId]))
    }
 
    function removeProducts(productId) {
        setCartProducts(prev => {
            const position = prev.indexOf(productId);
            if (position !== -1) {
                return prev.filter((value, index) => index !== position)
            }
            return prev
        })
    }

    function clearCart() {
        if (localStorage) {
            localStorage.removeItem("cart")
        }
        setCartProducts([])
    }

    return <>
        <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, removeProducts, clearCart }}>
            {children}
        </CartContext.Provider>
    </>
}