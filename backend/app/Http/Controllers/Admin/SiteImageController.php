<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteImage;
use Illuminate\Http\Request;

class SiteImageController extends Controller
{
    public function update(Request $request, string $key)
    {
        $data = $request->validate([
            'url' => ['required', 'string', 'max:100000'],
        ]);

        abort_unless(preg_match('/^[a-zA-Z0-9_-]{1,80}$/', $key), 422, 'Invalid image key.');

        $image = SiteImage::updateOrCreate(['key' => $key], ['url' => $data['url']]);

        return response()->json(['key' => $image->key, 'url' => $image->url]);
    }
}
