<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModelRequest;
use App\Models\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = Model::select(
            "id",
            "author_id",
            "title",
            "description",
            "price",
            "preview_image_url",
            "file_url",
            "created_at",
            "end_date",
            "category_id"
        )->with(['author', 'category']) // Включить отношения с автором и категорией
        ->orderByDesc("id")
            ->cursorPaginate(20);

        return response()->json($models);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModelRequest $request)
    {
        $payload = $request->validated();
        try {
            $user = $request->user();
            $payload["author_id"] = $user->id;

            // Создаем модель без путей
            $model = Model::create($payload);

            // Формируем путь к папке
            $folderPath = "user_{$user->id}/model_{$model->id}";

            // Сохраняем файлы и обновляем пути
            $this->handleFileUpload($request, $folderPath, $model);

            // Загружаем связанные данные
            $model->load(['author', 'category']);

            return response()->json([
                "message" => "Модель успешно создана!",
                "model" => $model
            ], 201);
        } catch (\Exception $err) {
            Log::error("model-error => " . $err->getMessage());
            return response()->json([
                "message" => "Что-то пошло не так. Пожалуйста, попробуйте еще раз!"
            ], 500);
        }
    }

    /**
     * Обрабатывает загрузку файлов и обновляет модель.
     */
    private function handleFileUpload(Request $request, string $folderPath, Model $model)
    {
        $fileUrls = [];

        // Сохраняем архив модели
        if ($request->hasFile('file')) {
            $fileName = 'archive.' . $request->file('file')->getClientOriginalExtension();
            $filePath = $request->file('file')->storeAs($folderPath, $fileName, 'public');
            $fileUrls['file_url'] = Storage::disk('public')->url($filePath);
        } else {
            return response()->json(['errors' => ['file' => ['Архив модели обязателен']]], 422);
        }

        // Сохраняем превью изображения
        if ($request->hasFile('preview_image_url')) {
            $previewName = 'preview.' . $request->file('preview_image_url')->getClientOriginalExtension();
            $previewPath = $request->file('preview_image_url')->storeAs($folderPath, $previewName, 'public');
            $fileUrls['preview_image_url'] = Storage::disk('public')->url($previewPath);
        } else {
            return response()->json(['errors' => ['preview_image_url' => ['Превью изображения обязательно и должно быть файлом.']]], 422);
        }

        // Сохраняем текстуру
        if ($request->hasFile('texture_url')) {
            $textureName = 'texture.' . $request->file('texture_url')->getClientOriginalExtension();
            $texturePath = $request->file('texture_url')->storeAs($folderPath, $textureName, 'public');
            $fileUrls['texture_url'] = Storage::disk('public')->url($texturePath);
        }

        // Сохраняем FBX модель
        if ($request->hasFile('model_fbx')) {
            $fbxName = 'model.fbx';
            $fbxPath = $request->file('model_fbx')->storeAs($folderPath, $fbxName, 'public');
            $fileUrls['model_fbx_url'] = Storage::disk('public')->url($fbxPath);
        }

        // Обновляем модель с путями
        $model->update($fileUrls);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
