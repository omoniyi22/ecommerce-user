import Header from '@/components/Header'
import { CartContextProvider } from "@/lib/CartContext"
import '@/styles/globals.css'
import { Poppins } from "next/font/google"
import { Toaster } from 'react-hot-toast'

import { SessionProvider } from "next-auth/react";

const inter = Poppins({ subsets: ["latin"], weight: "400" })

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    return (<>
        <SessionProvider session={session}>
            <CartContextProvider>
                <main className={`${inter.className}  min-h-screen px-4 max-w-screen-2xl bg-background mx-auto text-accent`}>
                    <Header />
                    <Component {...pageProps} />
                </main>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
            </CartContextProvider>
        </SessionProvider>
    </>)
}