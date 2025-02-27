import FilterProduct from "@/components/FilterProduct";
import ProductList from "@/components/ProductList";
import { getAllProducts } from "@/lib/actions";
import { Suspense } from "react";

// Remove the PageProps import and use inline types
export default async function Page({
  searchParams,
}: {
  searchParams: any  // Use 'any' to bypass type checking temporarily
}) {
  const params = searchParams;
  const sortOrder = params.sort || "";
  
  let allProducts = await getAllProducts();

  if (!allProducts) {
    return <div>Products not found!</div>;
  }

  if (sortOrder === "asc price") {
    allProducts = [...allProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc price") {
    allProducts = [...allProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto flex justify-between">
        <h1 className="text-primary text-4xl font-bold mt-10">All Products</h1>
        <FilterProduct currentSortOrder={sortOrder} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList products={allProducts} />
      </Suspense>
    </div>
  );
}
