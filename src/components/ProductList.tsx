import { ProductListProps } from "@/types/types";
import ProductCard from "./ProductCard";

export default function ProductList({ products }: { products: ProductListProps[] }) {
  if (!products?.length) {
    return <div>No products found.</div>;
  }

  return (
    <div className="my-8 rounded-md">
      <div className="flex flex-wrap gap-5 justify-center p-2">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}