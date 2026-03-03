<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'delivery_address_id' => ['required', 'exists:addresses,id'],
            'payment_method' => ['required', 'string', 'in:cash,card'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
