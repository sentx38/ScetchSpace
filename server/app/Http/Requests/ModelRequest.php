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
    public function rules(): array
    {
        return [
            'title' => 'required|string|min:2|max:255', // varchar, предполагаем разумную длину
            'description' => 'nullable|string', // text, без конкретного ограничения длины, но может быть опциональным
            'price' => 'required|numeric|min:0', // numeric, гарантируем неотрицательные значения
            'preview_image_url' => 'nullable|url', // varchar, опциональный URL для изображения
            'texture_url' => 'nullable|url', // varchar, опциональный URL для текстуры
            'model_fbx_url' => 'nullable|url', // varchar, опциональный URL для модели FBX
            'file_url' => 'required|url', // varchar, обязательный URL для файла модели
            'category_id' => 'required|integer|exists:categories,id', // int8, должен существовать в таблице categories
            'end_date' => 'nullable|date', // date, опциональная дата окончания
        ];
    }
}
