<?php

namespace Tests\Feature;

use App\Models\Tarefa;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TarefaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_tarefas_with_pending_first(): void
    {
        Tarefa::factory()->create(['title' => 'Estudar', 'completed' => true]);
        Tarefa::factory()->create(['title' => 'Comprar pão', 'completed' => false]);

        $response = $this->getJson('/api/tarefas');

        $response
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.title', 'Comprar pão')
            ->assertJsonPath('0.completed', false)
            ->assertJsonPath('1.title', 'Estudar')
            ->assertJsonPath('1.completed', true);
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

    public function test_completes_selected_tarefas(): void
    {
        $first = Tarefa::factory()->create(['title' => 'A', 'completed' => false]);
        $second = Tarefa::factory()->create(['title' => 'B', 'completed' => false]);
        $third = Tarefa::factory()->create(['title' => 'C', 'completed' => false]);

        $response = $this->postJson('/api/tarefas/concluir', [
            'ids' => [$first->id, $second->id],
        ]);

        $response
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $first->id, 'completed' => true])
            ->assertJsonFragment(['id' => $second->id, 'completed' => true]);

        $this->assertDatabaseHas('tarefas', ['id' => $first->id, 'completed' => true]);
        $this->assertDatabaseHas('tarefas', ['id' => $second->id, 'completed' => true]);
        $this->assertDatabaseHas('tarefas', ['id' => $third->id, 'completed' => false]);

        $this->getJson('/api/tarefas')
            ->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('0.id', $third->id)
            ->assertJsonPath('0.completed', false)
            ->assertJsonPath('1.completed', true)
            ->assertJsonPath('2.completed', true);
    }

    public function test_complete_requires_valid_ids(): void
    {
        $response = $this->postJson('/api/tarefas/concluir', [
            'ids' => [999],
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ids.0']);
    }

    public function test_complete_requires_ids(): void
    {
        $response = $this->postJson('/api/tarefas/concluir', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ids']);
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
