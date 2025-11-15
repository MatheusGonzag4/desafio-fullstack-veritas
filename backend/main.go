package main

import (
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	
	loadTasks()

	r := mux.NewRouter()

	r.HandleFunc("/tasks", GetTasksHandler).Methods("GET")
	
	r.HandleFunc("/tasks", CreateTaskHandler).Methods("POST")
	
	r.HandleFunc("/tasks/{id}", UpdateTaskHandler).Methods("PUT")
	
	r.HandleFunc("/tasks/{id}", DeleteTaskHandler).Methods("DELETE")

	allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})

	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	
	allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})

	log.Println("Servidor Go rodando na porta 8080...")
	
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(r)))
}