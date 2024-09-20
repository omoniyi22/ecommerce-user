import Hero from "@/components/Hero";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import Products from "@/components/Products";
import Collection from "@/components/Collection";

export default function Home({ featuredProduct, newProducts, collectionProduct }) {
    return <>
        <Hero product={featuredProduct} />
        <hr className="my-4 h-px border-0 bg-gray-300 -mt-4" />
        <Products products={newProducts} />
        <hr className="my-4 h-px border-0 bg-gray-300 " />
        <Collection product={collectionProduct} />
    </>
}

export async function getServerSideProps() {
    await mongooseConnect();

    const featuredId = "66df95f780d87df688a0b934"

    const collectionId = "66e017b451a0b9b3f926fae9"
    const featuredProduct = await Product.findById(featuredId);
    const collectionProduct = await Product.findById(collectionId)
    const newProducts = await Product.find({}, null, { sort: { "_id": 1 }, limit: 5 })
    return {
        props: {
            featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
            collectionProduct: JSON.parse(JSON.stringify(collectionProduct))
        }
    }
}