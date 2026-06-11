<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function store(Request $request)
    {
        $testimonial = Testimonial::create($this->validated($request));

        return new TestimonialResource($testimonial);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $testimonial->update($this->validated($request, partial: true));

        return new TestimonialResource($testimonial);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:100'],
            'role' => [$required, 'string', 'max:120'],
            'text' => [$required, 'string', 'max:1000'],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
        ]);
    }
}
