<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModelRequest;
use App\Models\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
            $payload["author_id"] = $user->id; // Использовать author_id вместо user_id
            $model = Model::create($payload)->with(['author', 'category'])->orderByDesc("id")->first();
            return response()->json(["message" => "Модель успешно создана!", "model" => $model]);
        } catch (\Exception $err) {
            Log::info("model-error => " . $err->getMessage());
            return response()->json(["message" => "Что-то пошло не так. Пожалуйста, попробуйте еще раз!"], 500);
        }
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
