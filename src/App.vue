<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">To do List</h2>

    <!-- Campo de entrada (opcional, só pra digitar antes do modal) -->
    <div class="mb-4">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-md-8">
          <input
            v-model="newTask"
            type="text"
            class="form-control form-control-lg"
            placeholder="Descreva a tarefa..."
          />
        </div>
      </div>
    </div>

    <div class="row">
      <!-- A Fazer -->
      <div class="col-12 col-md-4">
        <div class="card border-primary shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
              <i class="fa-solid fa-list-check me-2"></i>
              <span class="fw-bold">A Fazer</span>
            </div>
            <button
              class="btn btn-light btn-sm text-primary d-flex align-items-center"
              @click="prepareModal('todo')"
              data-bs-toggle="modal"
              data-bs-target="#taskModal"
              title="Adicionar tarefa"
            >
              <i class="fa-solid fa-plus me-1"></i> Add
            </button>
          </div>

          <Draggable v-model="todo" group="tasks" class="card-body kanban-col" tag="div">
            <div v-for="item in todo" :key="item.id" class="card card-body mb-3 task-card">
              <p class="card-text mb-0">{{ item.name }}</p>
            </div>
          </Draggable>
        </div>
      </div>

      <!-- Em andamento -->
      <div class="col-12 col-md-4">
        <div class="card border-warning shadow-sm">
          <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
            <div>
              <i class="fa-solid fa-list-check me-2"></i>
              <span class="fw-bold">Em andamento</span>
            </div>
            <button
              class="btn btn-light btn-sm text-primary d-flex align-items-center"
              @click="prepareModal('doing')"
              data-bs-toggle="modal"
              data-bs-target="#taskModal"
              title="Adicionar tarefa"
            >
              <i class="fa-solid fa-plus me-1"></i> Add
            </button>
          </div>

          <Draggable v-model="doing" group="tasks" class="card-body kanban-col" tag="div">
            <div v-for="item in doing" :key="item.id" class="card card-body mb-3 task-card">
              <p class="card-text mb-0">{{ item.name }}</p>
            </div>
          </Draggable>
        </div>
      </div>

      <!-- Concluído -->
      <div class="col-12 col-md-4">
        <div class="card border-success shadow-sm">
          <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <div>
              <i class="fa-solid fa-list-check me-2"></i>
              <span class="fw-bold">Concluído</span>
            </div>
            <button
              class="btn btn-light btn-sm text-primary d-flex align-items-center"
              @click="prepareModal('done')"
              data-bs-toggle="modal"
              data-bs-target="#taskModal"
              title="Adicionar tarefa"
            >
              <i class="fa-solid fa-plus me-1"></i> Add
            </button>
          </div>

          <Draggable v-model="done" group="tasks" class="card-body kanban-col" tag="div">
            <div v-for="item in done" :key="item.id" class="card card-body mb-3 task-card">
              <p class="card-text mb-0">{{ item.name }}</p>
            </div>
          </Draggable>
        </div>
      </div>
    </div>

    <!-- Modal Bootstrap -->

    <div class="modal fade" id="taskModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Adicionar tarefa • {{ headerLabel(modalTarget) }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>

          <div class="modal-body">
            <label class="form-label">Título</label>
            <input
              v-model="newTask"
              type="text"
              class="form-control"
              placeholder="Ex.: Escreva a subtarefa"
            />
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button
              class="btn btn-primary"
              @click="addTaskTo(modalTarget)"
              data-bs-dismiss="modal"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Modal -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'

// colunas reativas
const todo = ref([])
const doing = ref([])
const done  = ref([])

const newTask = ref('')
const modalTarget = ref('todo') // coluna onde a tarefa será criada

const columns = { todo, doing, done }

// gera IDs únicos
function nextId() {
  const all = [...todo.value, ...doing.value, ...done.value]
  return all.length ? Math.max(...all.map(i => i.id)) + 1 : 1
}

// prepara modal com destino certo
function prepareModal(target) {
  modalTarget.value = target
  newTask.value = ''
}

// adiciona tarefa à coluna específica
function addTaskTo(col) {
  const name = newTask.value.trim()
  if (!name) return
  columns[col].value.push({ id: nextId(), name })
  newTask.value = ''
}

// traduz cabeçalho
function headerLabel(s) {
  return s === 'todo' ? 'A Fazer' : s === 'doing' ? 'Em andamento' : 'Concluído'
}
</script>

<style>
.container { max-width: 1100px; }

.task-card {
  border: 1px solid #eef0f3 !important;
  border-radius: 10px;
  background: #fff !important;
  cursor: grab;
}
.task-card:active { cursor: grabbing; }
</style>
