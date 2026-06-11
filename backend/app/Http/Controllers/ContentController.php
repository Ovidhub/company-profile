<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\HeroSlideResource;
use App\Http\Resources\PaymentMethodPublicResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Category;
use App\Models\HeroSlide;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\SiteImage;
use App\Models\Testimonial;

class ContentController extends Controller
{
    /** Everything the public site needs for first paint, in one round-trip. */
    public function index()
    {
        return response()->json([
            'heroSlides' => HeroSlideResource::collection(HeroSlide::orderBy('sort_order')->get()),
            'testimonials' => TestimonialResource::collection(Testimonial::all()),
            'images' => SiteImage::pluck('url', 'key'),
            'categories' => CategoryResource::collection(Category::orderBy('sort_order')->get()),
            'products' => ProductResource::collection(Product::with('category')->get()),
            'paymentMethods' => PaymentMethodPublicResource::collection(
                PaymentMethod::where('enabled', true)->orderBy('sort_order')->get()
            ),
        ]);
    }
}
