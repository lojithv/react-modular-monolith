import { useState } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import type { Product } from '../types.ts';
import { productService } from '../services/product.service.ts';

/** Route loader — fetches the product to edit via the service layer */
export async function loader({ params }: LoaderFunctionArgs) {
  const product = await productService.getById(params.productId!);
  return { product };
}

export function Component() {
  const { product } = useLoaderData<typeof loader>();
  const p = product as Product;
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      await productService.update(p.id, {
        name: form.get('name') as string,
        category: form.get('category') as string,
        price: `$${form.get('price')}`,
        stock: Number(form.get('stock') || 0),
      });
      navigate(`/products/${p.id}`);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Edit {p.name}</h2>
      <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input name="name" type="text" defaultValue={p.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" defaultValue={p.category} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Clothing</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input name="price" type="number" step="0.01" defaultValue={parseFloat(p.price.replace('$', ''))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input name="stock" type="number" defaultValue={p.stock} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/products/${p.id}`} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
