## Установка и запуск

**Требования:**

*   Python 3.10+ (рекомендуется 3.12)
*   Node.js 20+ (из-за требований `react-router-dom` v7) и npm/yarn
*   Git

**Инструкции (из корня монорепозитория `full_CryptoWatcher`):**

1.  **Клонировать репозиторий:**
    ```bash
    git clone https://github.com/monlaf-sfk/full_CryptoWatcher.git
    cd full_CryptoWatcher
    ```

2.  **Настроить Backend (FastAPI):**
    ```bash
    cd backend # Перейти в папку бэкенда

    # Создать и активировать виртуальное окружение (рекомендуется)
    python3 -m venv venv
    # Windows: venv\Scripts\activate
    # macOS/Linux: source venv/bin/activate

    # Установить зависимости
    pip install -r requirements.txt

    # Создать файл .env из .env.example и заполнить его
    # cp .env.example .env
    # Отредактировать .env, указав ваш API_COINGECKO и FRONTEND_URL (для локального CORS)
    # API_COINGECKO=CG-...
    # FRONTEND_URL=http://localhost:5173

    # Запустить backend сервер для разработки
    cd .. # Вернуться в корень репо
    cd backend/src # Перейти в src бэкенда
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    cd ../.. # Вернуться в корень репо
    ```
    API будет доступен по адресу `http://localhost:8000`. Документация: `http://localhost:8000/docs`.

3.  **Настроить Frontend (React):**
    ```bash
    cd frontend # Перейти в папку фронтенда

    # Установить зависимости
    npm install
    # или yarn install


    # Запустить frontend приложение в режиме разработки
    npm run dev
    # или yarn dev
    ```
    Приложение будет доступно в браузере по адресу `http://localhost:5173` (или другому порту, указанному Vite).
