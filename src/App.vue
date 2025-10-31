<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Coluna 1 -->
      <div class="col-12 col-md-4">
        <h5 class="text-center">A Fazer</h5>
        <Draggable v-model="todo" group="tasks" class="list-group">
          <div
            v-for="item in todo"
            :key="item.id"
            class="list-group-item"
          >
            {{ item.name }}
          </div>
        </Draggable>
      </div>

      <!-- Coluna 2 -->
      <div class="col-12 col-md-4">
        <h5 class="text-center">Em andamento</h5>
        <Draggable v-model="doing" group="tasks" class="list-group">
          <div
            v-for="item in doing"
            :key="item.id"
            class="list-group-item"
          >
            {{ item.name }}
          </div>
        </Draggable>
      </div>

      <!-- Coluna 3 -->
      <div class="col-12 col-md-4">
        <h5 class="text-center">Concluído</h5>
        <Draggable v-model="done" group="tasks" class="list-group">
          <div
            v-for="item in done"
            :key="item.id"
            class="list-group-item"
          >
            {{ item.name }}
          </div>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'

const todo = ref([
  { id: 1, name: 'Estudar Vue' },
  { id: 2, name: 'Ler documentação' },
])
const doing = ref([
  { id: 3, name: 'Testar grid Bootstrap' },
])
const done = ref([
  { id: 4, name: 'Instalar dependências' },
])
</script>

<style>
.list-group {
  min-height: 200px;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
}
</style>
