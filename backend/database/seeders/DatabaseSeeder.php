<?php

namespace Database\Seeders;

use App\Models\Tarefa;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (Tarefa::query()->exists()) {
            return;
        }

        Tarefa::query()->create(['title' => 'Tarefa 1', 'completed' => false]);
        Tarefa::query()->create(['title' => 'Tarefa 2', 'completed' => true]);
        Tarefa::query()->create(['title' => 'Tarefa 3', 'completed' => false]);
    }
}
