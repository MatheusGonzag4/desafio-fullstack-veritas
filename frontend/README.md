# Desafio Fullstack - Mini Kanban (Veritas Consultoria)

[cite_start]Este projeto é uma solução para o Desafio Técnico Fullstack [cite: 2] [cite_start]da Veritas Consultoria Empresarial, que consiste em um "Mini Kanban de Tarefas" [cite: 4] [cite_start]utilizando React no frontend e Go no backend[cite: 3].

[cite_start]O sistema permite ao usuário gerenciar tarefas através de três colunas fixas: **A Fazer**, **Em Progresso** e **Concluídas**.

## 🚀 Instruções para Rodar o Projeto

Você precisará de dois terminais para executar o backend e o frontend simultaneamente.

### Backend (Go)

1.  **Navegue até a pasta:**
    ```bash
    cd backend
    ```

2.  **Inicialize o Go Modules (se for a primeira vez):**
    ```bash
    go mod init backend
    go mod tidy
    ```

3.  **Instale as dependências (se necessário):**
    ```bash
    go get [github.com/gorilla/mux](https://github.com/gorilla/mux)
    go get [github.com/gorilla/handlers](https://github.com/gorilla/handlers)
    go get [github.com/google/uuid](https://github.com/google/uuid)
    ```

4.  **Execute o servidor:**
    ```bash
    go run .
    ```
    O servidor estará rodando em `http://localhost:8080`.

### Frontend (React)

1.  **Navegue até a pasta:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências (se for a primeira vez):**
    ```bash
    npm install
    ```

3.  **Execute o cliente React:**
    ```bash
    npm start
    ```
    A aplicação abrirá automaticamente no seu navegador em `http://localhost:3000`.

---

## 🛠️ Decisões Técnicas

Algumas escolhas foram feitas durante o desenvolvimento para atender aos requisitos do desafio:

* **Backend (Go):**
    * [cite_start]**Roteamento:** Foi utilizada a biblioteca `gorilla/mux` por ser uma solução robusta e popular no ecossistema Go para criar rotas HTTP (endpoints)[cite: 13].
    * [cite_start]**CORS:** A biblioteca `gorilla/handlers` foi usada para implementar o CORS[cite: 16], permitindo que o frontend (`localhost:3000`) se comunique com o backend (`localhost:8080`) de forma segura.
    * [cite_start]**Persistência (Bônus):** Implementada a persistência de dados em um arquivo `tasks.json`[cite: 42, 14]. Um `sync.Mutex` foi utilizado para garantir que as operações de leitura e escrita no arquivo (e no mapa em memória) sejam *thread-safe*, evitando condições de corrida.
    * [cite_start]**Validação:** Validações básicas foram implementadas no backend para garantir a integridade dos dados, como a obrigatoriedade do título[cite: 15].

* **Frontend (React):**
    * **Gerenciamento de Estado:** O estado principal (lista de tarefas) é gerenciado no componente `App.js` (levantamento de estado). Isso permite que os componentes filhos (`KanbanBoard`, `TaskCard`) sejam mais simples e recebam os dados e funções via *props*.
    * **Comunicação API:** A biblioteca `Axios` foi usada e centralizada em um arquivo `api.js`. Isso facilita a manutenção da URL base da API e futuras implementações (como *interceptors* para tokens de autenticação).
    * [cite_start]**Modal:** A criação e edição de tarefas são feitas através de um único componente de modal (`TaskModal.js`), que se adapta se está recebendo uma tarefa para edição ou `null` para criação[cite: 8, 9].
    * [cite_start]**Feedbacks:** Feedbacks visuais mínimos para carregamento e erros foram implementados  para melhorar a experiência do usuário.

---

## ⚠️ Limitações e Melhorias Futuras

Com base no escopo atual, algumas melhorias poderiam ser implementadas:

* **Limitações Conhecidas:**
    * O feedback de erro é genérico (ex: "Falha ao salvar tarefa"). Não exibe a mensagem específica vinda da API.
    * A aplicação não possui autenticação.
    * [cite_start]O *Drag and Drop* (Bônus) [cite: 41] não foi implementado; o movimento é feito por botões.

* **Melhorias Futuras:**
    * Implementar *Drag and Drop* usando uma biblioteca como `react-beautiful-dnd`.
    * Substituir o armazenamento em memória/JSON por um banco de dados (ex: PostgreSQL ou SQLite) para uma solução mais escalável.
    * [cite_start]Implementar testes unitários e de integração (Bônus) [cite: 43] no backend (Go) e testes de componentes no frontend (React).
    * Adicionar *WebSockets* para que as mudanças feitas por um usuário sejam refletidas em tempo real para outros usuários.