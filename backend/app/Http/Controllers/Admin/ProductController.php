<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $data = $this->validated($request);
        $product = Product::create($data);

        return new ProductResource($product->load('category'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validated($request, partial: true);
        $product->update($data);

        return new ProductResource($product->fresh('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    /** Accepts the SPA's camelCase Product shape; category arrives as a slug. */
    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $data = $request->validate([
            'name' => [$required, 'string', 'max:150'],
            'category' => [$required, 'string', 'exists:categories,slug'],
            'price' => [$required, 'numeric', 'min:0', 'max:99999999'],
            'originalPrice' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'image' => [$required, 'string', 'max:100000'],
            'description' => [$required, 'string', 'max:2000'],
            'features' => ['sometimes', 'array', 'max:20'],
            'features.*' => ['string', 'max:200'],
            'inStock' => ['sometimes', 'boolean'],
            'rating' => ['sometimes', 'numeric', 'min:0', 'max:5'],
            'reviews' => ['sometimes', 'integer', 'min:0'],
            'badge' => ['nullable', 'in:new,sale,hot,limited'],
        ]);

        $mapped = [];
        foreach ($data as $key => $value) {
            match ($key) {
                'category' => $mapped['category_id'] = Category::where('slug', $value)->value('id'),
                'originalPrice' => $mapped['original_price'] = $value,
                'inStock' => $mapped['in_stock'] = $value,
                default => $mapped[$key] = $value,
            };
        }

        return $mapped;
    }
}
