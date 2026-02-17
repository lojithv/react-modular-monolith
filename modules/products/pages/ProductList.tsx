import { Link, useLoaderData } from 'react-router';
import type { Product } from '../types.ts';
import { productService } from '../services/product.service.ts';

/** Route loader — fetches products via the service layer */
export async function loader() {
  const result = await productService.list();
  return { products: result.data };
}

export function Component() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">All Products</h2>
        <Link to="/products/new" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
          + New Product
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Category</th>
            <th className="px-6 py-3 font-medium">Price</th>
            <th className="px-6 py-3 font-medium">Stock</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product: Product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.price}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
              <td className="px-6 py-4 flex gap-2">
                <Link to={`/products/${product.id}`} className="text-blue-600 text-sm hover:underline">View</Link>
                <Link to={`/products/${product.id}/edit`} className="text-gray-500 text-sm hover:underline">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
