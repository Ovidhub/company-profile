<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderAdminController extends Controller
{
    public function index()
    {
        return OrderResource::collection(Order::with('items')->latest()->get());
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', Order::STATUSES)],
        ]);

        $order->update($data);

        return new OrderResource($order->load('items'));
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}
