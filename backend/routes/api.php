<?php

use App\Http\Controllers\Api\TarefaController;
use Illuminate\Support\Facades\Route;

Route::get('/tarefas', [TarefaController::class, 'index']);
Route::post('/tarefas', [TarefaController::class, 'store']);
Route::post('/tarefas/concluir', [TarefaController::class, 'complete']);
Route::delete('/tarefas/{tarefa}', [TarefaController::class, 'destroy']);
