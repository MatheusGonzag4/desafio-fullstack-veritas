package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

const dbFile = "tasks.json"

var (
	store = make(map[string]Task)
	mu    sync.Mutex
)

func loadTasks() {
	mu.Lock()
	defer mu.Unlock()

	file, err := os.Open(dbFile)
	if err != nil {
		if os.IsNotExist(err) {
			log.Println("Arquivo tasks.json não encontrado. Começando com store vazio.")
			return
		}
		log.Fatalf("Erro ao abrir arquivo %s: %v", dbFile, err)
	}
	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf("Erro ao ler arquivo %s: %v", dbFile, err)
	}

	if err := json.Unmarshal(bytes, &store); err != nil {
		log.Fatalf("Erro ao decodificar JSON: %v", dbFile, err)
	}
	log.Printf("Carregadas %d tarefas do arquivo %s", len(store), dbFile)
}

func saveTasks() {

	data, err := json.MarshalIndent(store, "", "  ")
	if err != nil {
		log.Printf("Erro ao codificar tarefas para JSON: %v", err)
		return
	}

	if err := ioutil.WriteFile(dbFile, data, 0644); err != nil {
		log.Printf("Erro ao salvar tarefas no arquivo %s: %v", dbFile, err)
	}
	log.Println("Tarefas salvas no arquivo.")
}

func GetTasksHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	tasks := make([]Task, 0, len(store))
	for _, task := range store {
		tasks = append(tasks, task)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if task.Title == "" {
		http.Error(w, "O título (title) é obrigatório", http.StatusBadRequest)
		return
	}

	if task.Status == "" {
		task.Status = "A Fazer" 
	}

	task.ID = uuid.New().String()
	store[task.ID] = task

	saveTasks() 

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func UpdateTaskHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	vars := mux.Vars(r)
	id := vars["id"]

	_, ok := store[id]
	if !ok {
		http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	var updatedTask Task
	if err := json.NewDecoder(r.Body).Decode(&updatedTask); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if updatedTask.Title == "" {
		http.Error(w, "O título (title) é obrigatório", http.StatusBadRequest)
		return
	}
	if updatedTask.Status != "A Fazer" && updatedTask.Status != "Em Progresso" && updatedTask.Status != "Concluídas" {
		http.Error(w, "O status deve ser 'A Fazer', 'Em Progresso' ou 'Concluídas'", http.StatusBadRequest)
		return
	}

	updatedTask.ID = id
	store[id] = updatedTask

	saveTasks()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedTask)
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()

	vars := mux.Vars(r)
	id := vars["id"]

	if _, ok := store[id]; !ok {
		http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	delete(store, id)

	saveTasks() 

	w.WriteHeader(http.StatusNoContent)
}