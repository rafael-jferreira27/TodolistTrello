<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">To do List</h2>

    <!-- Criar tarefa principal (título + categoria) -->
    <form class="mb-4" @submit.prevent="addMainTask">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-lg-7">
          <input
            v-model="newMainTitle"
            type="text"
            class="form-control form-control-lg"
            placeholder="Adicione uma tarefa e pressione Enter"
          />
        </div>

        <div class="col-8 col-lg-3">
          <input
            v-model="newMainCategory"
            class="form-control form-control-lg"
            list="categoryOptions"
            placeholder="Categoria (ex.: Leitura)"
          />
          <datalist id="categoryOptions">
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </datalist>
        </div>

        <div class="col-4 col-lg-2 d-grid">
          <button type="submit" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-plus me-2"></i>
          </button>
        </div>
      </div>
      <div class="form-text mt-1"></div>
    </form>

    <!-- ===== Seção de tarefas concluídas (100%) ===== -->
    <div v-if="completedMainTasks.length" class="mb-4">
      <div class="card border-success">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <span class="fw-bold">
            <i class="fa-solid fa-flag-checkered me-2"></i>
            Tarefas concluídas
          </span>
          <span class="badge bg-light text-success">{{ completedMainTasks.length }}</span>
        </div>
        <ul class="list-group list-group-flush">
          <li
            v-for="t in completedMainTasks"
            :key="t.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <span class="badge bg-secondary me-2">{{ t.category }}</span>
              {{ t.title }}
              <span v-if="t.completedAt" class="ms-2 small text-muted">
                — Concluída em {{ formatDateTime(t.completedAt) }}
              </span>
            </div>
            <span class="small text-muted">
              {{ completedCount(t) }} / {{ t.subtasks.length }} subtarefas
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Grid de tarefas -->
    <div v-if="mainTasks.length" class="row g-3 mb-4">
      <div v-for="task in mainTasks" :key="task.id" class="col-12 col-md-4">
        <div class="card border-secondary shadow-sm" :class="{ completed: isCompleted(task) }">
          <div
            class="card-header text-white d-flex justify-content-between align-items-center"
            :class="isCompleted(task) ? 'bg-success' : 'bg-secondary'"
          >
            <div class="d-flex align-items-center">
              <i class="fa-solid fa-layer-group me-2"></i>
              <span class="fw-bold">{{ task.title }}</span>
            </div>

            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-light text-secondary" :class="{'text-success': isCompleted(task)}">
                {{ task.category }}
              </span>

              <span
                v-if="isCompleted(task)"
                class="badge bg-light text-success"
                title="Esta tarefa está 100% concluída"
              >
                Concluída
              </span>

              <button
                type="button"
                class="btn btn-light btn-sm d-flex align-items-center"
                :class="isCompleted(task) ? 'text-success' : 'text-secondary'"
                @click.prevent="prepareSubModal(task)"
                data-bs-toggle="modal"
                :data-bs-target="`#subtaskModal-${task.id}`"
                :disabled="isCompleted(task)"
                :title="isCompleted(task) ? 'Tarefa concluída' : 'Adicionar subtarefa'"
              >
                <i class="fa-solid fa-plus me-1"></i> 
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- Barra de progresso -->
            <div v-if="task.subtasks.length" class="mb-3">
              <div class="d-flex justify-content-between small mb-1">
                <span>{{ completedCount(task) }} de {{ task.subtasks.length }} concluídas</span>
                <span>{{ progressPercent(task) }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div
                  class="progress-bar bg-success"
                  role="progressbar"
                  :style="{ width: progressPercent(task) + '%' }"
                  :aria-valuenow="progressPercent(task)"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <!-- Lista de subtarefas -->
            <ul v-if="task.subtasks.length" class="list-group list-group-flush mt-2">
              <li
                v-for="st in task.subtasks"
                :key="st.id"
                class="list-group-item px-0 d-flex align-items-start justify-content-between"
                :class="{ 'bg-subtask-done': st.done && isCompleted(task) }"
              >
                <div class="d-flex align-items-center">
                  <!-- IMPORTANTE: trocamos v-model por @change -->
                  <input
                    type="checkbox"
                    class="form-check-input me-2"
                    :checked="st.done"
                    @change="toggleSubtask(task, st)"
                  />
                  <span :class="{ 'text-decoration-line-through text-muted': st.done }">
                    {{ st.title }}
                  </span>
                </div>

                <!-- carimbo de data/hora da SUBTAREFA -->
                <span v-if="st.doneAt" class="small text-muted ms-2">
                  {{ formatDateTime(st.doneAt) }}
                </span>
              </li>
            </ul>

            <p v-else class="text-muted mb-0 small">Nenhuma subtarefa ainda.</p>
          </div>
        </div>

        <!-- Modal de subtarefa -->
        <div class="modal fade" :id="`subtaskModal-${task.id}`" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header" :class="isCompleted(task) ? 'bg-success text-white' : ''">
                <h5 class="modal-title">Adicionar subtarefa • {{ task.title }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div class="modal-body">
                <label class="form-label">Título da subtarefa</label>
                <input
                  v-model="newSubtaskTitle"
                  type="text"
                  class="form-control"
                  placeholder="Ex.: Ler 10 páginas"
                  @keyup.enter="addSubtask(task)"
                >
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button class="btn btn-primary" @click="addSubtask(task)" data-bs-dismiss="modal">Salvar</button>
              </div>
            </div>
          </div>
        </div>
        <!-- Fim Modal -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ===== Catálogo de categorias ===== */
const categories = ref(['Geral', 'Estudos', 'Trabalho', 'Casa', 'Saúde', 'Leitura', 'Compras'])

/* ===== Tarefas principais ===== */
const mainTasks = ref([])
const newMainTitle = ref('')
const newMainCategory = ref('')

function nextMainId() {
  return mainTasks.value.length ? Math.max(...mainTasks.value.map(t => t.id)) + 1 : 1
}

function addMainTask() {
  const title = newMainTitle.value.trim()
  if (!title) return

  const rawCat = newMainCategory.value.trim()
  const category = rawCat || 'Geral'

  if (rawCat && !categories.value.includes(rawCat)) {
    categories.value.push(rawCat)
  }

  mainTasks.value.push({ id: nextMainId(), title, category, subtasks: [], completedAt: null })

  newMainTitle.value = ''
  newMainCategory.value = ''
}

/* ===== Subtarefas ===== */
const newSubtaskTitle = ref('')
function prepareSubModal() { newSubtaskTitle.value = '' }
function nextSubId(task) { return task.subtasks.length ? Math.max(...task.subtasks.map(s => s.id)) + 1 : 1 }

function addSubtask(task) {
  const title = newSubtaskTitle.value.trim()
  if (!title) return
  task.subtasks.push({ id: nextSubId(task), title, done: false, doneAt: null })
  newSubtaskTitle.value = ''
}

/* >>> NOVO: alterna done e carimba data/hora; seta completedAt do card <<< */
function toggleSubtask(task, st) {
  st.done = !st.done
  st.doneAt = st.done ? new Date().toISOString() : null

  // atualiza carimbo da tarefa principal
  if (isCompleted(task)) {
    if (!task.completedAt) task.completedAt = new Date().toISOString()
  } else {
    // se voltou a ficar incompleta, remove o carimbo
    task.completedAt = null
  }
}

/* ===== Progresso ===== */
function completedCount(task) { return task.subtasks.filter(st => st.done).length }
function progressPercent(task) {
  if (!task.subtasks.length) return 0
  return Math.round((completedCount(task) / task.subtasks.length) * 100)
}
function isCompleted(task) { return progressPercent(task) === 100 }

/* Lista de tarefas principais concluídas (para a seção dedicada) */
const completedMainTasks = computed(() => mainTasks.value.filter(t => isCompleted(t)))

/* ===== Util: formatação de data/hora ===== */
function pad(n) { return n.toString().padStart(2, '0') }
function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const dd = pad(d.getDate())
  const mm = pad(d.getMonth() + 1)
  const yyyy = d.getFullYear()
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`
}
</script>

<style>
.container { max-width: 1100px; }

/* Card “verdinho” quando concluído */
.card.completed .card-header { background-color: #198754 !important; }
.card.completed .card-body   { background-color: #eaf7ee; }

/* Linha das subtarefas concluídas quando o card está 100% (sutil) */
.bg-subtask-done { background-color: #f2fbf5; }

/* Progress bar com transição suave */
.progress { background-color: #e9ecef; }
.progress-bar { transition: width 0.3s ease; }
.text-decoration-line-through { transition: color 0.3s ease; }
</style>
