<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        // `mimes` checks real file content, not the extension. SVG is excluded
        // deliberately — it can carry embedded scripts.
        $request->validate([
            'image' => ['required', 'file', 'mimes:png,jpg,jpeg,webp,gif', 'max:5120'],
        ]);

        $path = $request->file('image')->store('uploads', 'public');

        return response()->json(['url' => Storage::disk('public')->url($path)], 201);
    }
}
