<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\StoreAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Models\Address\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * Get all addresses for authenticated user
     */
    public function index(Request $request)
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'name' => $address->name,
                    'phone' => $address->phone,
                    'address_line' => $address->address_line_1, // For backward compatibility
                    'address_line_1' => $address->address_line_1,
                    'address_line_2' => $address->address_line_2,
                    'city' => $address->city,
                    'province' => $address->province,
                    'postal_code' => $address->postal_code,
                    'type' => $address->type,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude,
                    'is_default' => $address->is_default,
                ];
            });

        return response()->json(['data' => $addresses]);
    }

    /**
     * Store a new address
     */
    public function store(StoreAddressRequest $request)
    {
        $validated = $request->validated();

        // If this is set as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', $request->user()->id)
                ->update(['is_default' => false]);
        }

        $address = Address::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        // Format the address for frontend compatibility
        $formattedAddress = [
            'id' => $address->id,
            'name' => $address->name,
            'phone' => $address->phone,
            'address_line' => $address->address_line_1, // For backward compatibility
            'address_line_1' => $address->address_line_1,
            'address_line_2' => $address->address_line_2,
            'city' => $address->city,
            'province' => $address->province,
            'postal_code' => $address->postal_code,
            'type' => $address->type,
            'latitude' => $address->latitude,
            'longitude' => $address->longitude,
            'is_default' => $address->is_default,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully',
            'address' => $formattedAddress,
        ], 201);
    }

    /**
     * Update an address
     */
    public function update(UpdateAddressRequest $request, Address $address)
    {
        // Ensure user owns this address
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validated();

        // If this is set as default, unset other defaults
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => $address,
        ]);
    }

    /**
     * Delete an address
     */
    public function destroy(Request $request, Address $address)
    {
        // Ensure user owns this address
        if ($address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }
}
