<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GoogleCallbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'error' => 'nullable|string',
            'code' => 'required_without:error|string',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required_without' => 'Authorization code is required.',
        ];
    }

    public function getShopDomain(): ?string
    {
        $shop = $this->query('shop'); // CORRECT

        return $shop;
    }
}
