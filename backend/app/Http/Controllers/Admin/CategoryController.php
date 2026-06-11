<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:80'],
            'icon' => ['sometimes', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:200'],
            'active' => ['sometimes', 'boolean'],
        ]);

        $slug = Str::slug($data['label']);
        if (Category::where('slug', $slug)->exists()) {
            $slug .= '-'.now()->timestamp;
        }

        $category = Category::create($data + [
            'slug' => $slug,
            'sort_order' => (int) Category::max('sort_order') + 1,
        ]);

        return new CategoryResource($category);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'label' => ['sometimes', 'string', 'max:80'],
            'icon' => ['sometimes', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:200'],
            'active' => ['sometimes', 'boolean'],
        ]);

        $category->update($data);

        return new CategoryResource($category);
    }

    public function destroy(Category $category)
    {
        abort_if($category->slug === 'all', 422, "The 'All Products' category cannot be deleted.");

        // products.category_id nullifies on delete; null serializes as 'other'.
        $category->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    /** Body: { ids: [slug, ...] } in the desired display order. */
    public function reorder(Request $request)
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['string', 'exists:categories,slug'],
        ]);

        foreach ($data['ids'] as $index => $slug) {
            Category::where('slug', $slug)->update(['sort_order' => $index]);
        }

        return CategoryResource::collection(Category::orderBy('sort_order')->get());
    }
}
