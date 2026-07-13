<?php

namespace Tests\Feature;

use App\Models\Tarefa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TarefaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_tarefas(): void
    {
        Tarefa::factory()->create(['title' => 'Comprar pão', 'completed' => false]);
        Tarefa::factory()->create(['title' => 'Estudar', 'completed' => true]);

        $response = $this->getJson('/api/tarefas');

        $response
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment(['title' => 'Comprar pão', 'completed' => false])
            ->assertJsonFragment(['title' => 'Estudar', 'completed' => true]);
    }

    public function test_creates_a_tarefa(): void
    {
        $response = $this->postJson('/api/tarefas', [
            'title' => 'Nova tarefa',
        ]);

        $response
            ->assertCreated()
            ->assertJson([
                'title' => 'Nova tarefa',
                'completed' => false,
            ]);

        $this->assertDatabaseHas('tarefas', [
            'title' => 'Nova tarefa',
            'completed' => false,
        ]);
    }

    public function test_create_requires_title(): void
    {
        $response = $this->postJson('/api/tarefas', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    public function test_deletes_a_tarefa(): void
    {
        $tarefa = Tarefa::factory()->create();

        $response = $this->deleteJson("/api/tarefas/{$tarefa->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('tarefas', ['id' => $tarefa->id]);
    }

    public function test_delete_returns_not_found_for_unknown_id(): void
    {
        $response = $this->deleteJson('/api/tarefas/999');

        $response->assertNotFound();
    }
}
