<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageAdminController extends Controller
{
    public function index()
    {
        return MessageResource::collection(Message::latest()->get());
    }

    public function update(Request $request, Message $message)
    {
        $data = $request->validate([
            'read' => ['required', 'boolean'],
        ]);

        $message->update($data);

        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}
