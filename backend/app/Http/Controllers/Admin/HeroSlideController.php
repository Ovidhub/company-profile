<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\HeroSlideResource;
use App\Models\HeroSlide;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    public function store(Request $request)
    {
        $data = $this->validated($request);

        $slide = HeroSlide::create($data + ['sort_order' => (int) HeroSlide::max('sort_order') + 1]);

        return new HeroSlideResource($slide);
    }

    public function update(Request $request, HeroSlide $heroSlide)
    {
        $heroSlide->update($this->validated($request, partial: true));

        return new HeroSlideResource($heroSlide);
    }

    public function destroy(HeroSlide $heroSlide)
    {
        $heroSlide->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $data = $request->validate([
            'title' => [$required, 'string', 'max:200'],
            'subtitle' => [$required, 'string', 'max:500'],
            'image' => [$required, 'string', 'max:100000'],
            'tag' => [$required, 'string', 'max:80'],
            'iconName' => ['sometimes', 'string', 'max:60'],
        ]);

        if (array_key_exists('iconName', $data)) {
            $data['icon_name'] = $data['iconName'];
            unset($data['iconName']);
        }

        return $data;
    }
}
