<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'variant_id' => ['nullable', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'addons' => ['nullable', 'array'],
            'addons.*.addon_id' => ['required', 'exists:addons,id'],
            'addons.*.addon_variant_id' => ['nullable', 'exists:addon_variants,id'],
            'addons.*.quantity' => ['required', 'integer', 'min:1'],
            'addons.*.price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
