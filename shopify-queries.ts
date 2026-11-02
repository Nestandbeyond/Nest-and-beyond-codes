import { queryOptions } from "@tanstack/react-query";
import { fetchCollection, fetchCollections, fetchProductByHandle, fetchProducts } from "./shopify";

export const productsQuery = (q?: string, first = 24) =>
  queryOptions({ queryKey: ["shopify", "products", q ?? "", first], queryFn: () => fetchProducts(first, q), staleTime: 60_000 });

export const collectionsQuery = () =>
  queryOptions({ queryKey: ["shopify", "collections"], queryFn: () => fetchCollections(20), staleTime: 60_000 });

export const collectionQuery = (handle: string) =>
  queryOptions({ queryKey: ["shopify", "collection", handle], queryFn: () => fetchCollection(handle), staleTime: 60_000 });

export const productQuery = (handle: string) =>
  queryOptions({ queryKey: ["shopify", "product", handle], queryFn: () => fetchProductByHandle(handle), staleTime: 60_000 });
