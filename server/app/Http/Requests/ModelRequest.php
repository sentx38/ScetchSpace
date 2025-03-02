<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'end_date' => 'nullable|date|after:today',
            'file' => 'required|file|mimes:zip,rar|max:10240', // Архив
            'preview_image_url' => 'required|file|mimes:png,jpg,jpeg|max:2048', // Превью
            'texture_url' => 'nullable|file|mimes:png,jpg,jpeg|max:2048', // Текстура
            'model_fbx' => 'nullable|file|mimes:fbx|max:10240', // FBX
        ];
    }


}
