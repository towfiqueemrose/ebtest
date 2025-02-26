import FilterProduct from "@/components/FilterProduct";
import ProductList from "@/components/ProductList";
import { getAllProducts } from "@/lib/actions";
import { PageProps } from "@/types/types";
import { Suspense } from "react";

export default async function Page({ searchParams }: PageProps) {

  const params = await searchParams;
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