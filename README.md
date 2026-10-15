# Banco de Ideas de Emprendimiento - Componente Práctico DW

Plataforma Web Fullstack desarrollada con **React (Vite)** en el Frontend y **Node.js (Express)** en el Backend, con almacenamiento persistente en archivo **JSON**, diseñada para publicar y consultar ideas de negocio innovadoras.

---

## 📌 Alcance del Proyecto

El sistema permite el ciclo completo (de extremo a extremo):
1. **Frontend (React SPA):** Formulario con validaciones en tiempo real para publicar ideas y catálogo interactivo para consultar todas las propuestas con filtrado por sector y búsqueda.
2. **Petición HTTP:** Comunicación asíncrona mediante `fetch` (métodos `POST` y `GET`).
3. **Backend (Express):** API REST que valida datos, asigna un ID único (`crypto.randomUUID`) y gestiona las solicitudes.
4. **Persistencia (JSON):** Almacenamiento seguro en archivo `backend/data/ideas.json` sin pérdida de registros tras reinicios.
5. **Visualización (React):** Despliegue de tarjetas de registro responsivas con estados de carga, lista vacía, confirmación de éxito y manejo de errores.

---

## 🏗️ Estructura del Repositorio

```text
Componente Practico DW/
├── .gitignore
├── README.md
├── backend/
│   ├── data/
│   │   └── ideas.json        # Almacenamiento persistente en JSON
│   ├── server.js             # API REST con Express y CORS
│   ├── package.json          # Dependencias y scripts del backend
│   └── package-lock.json
└── frontend/
    ├── index.html            # Plantilla HTML base
    ├── vite.config.js        # Configuración de Vite
    ├── package.json          # Dependencias y scripts del frontend
    ├── package-lock.json
    └── src/
        ├── App.jsx           # Enrutador principal (React Router)
        ├── main.jsx          # Punto de entrada de React
        ├── index.css         # Estilos y diseño responsivo
        ├── components/
        │   ├── Navbar.jsx        # Menú de navegación
        │   ├── IdeaCard.jsx      # Tarjeta reutilizable de idea
        │   └── AlertMessage.jsx  # Mensajes de éxito y error
        └── pages/
            ├── Home.jsx          # Ruta / (Bienvenida y navegación)
            ├── Registro.jsx      # Ruta /registro (Formulario con validación)
            └── Lista.jsx         # Ruta /lista (Consulta y visualización)
```

---

## ⚙️ Requisitos Previos

- **Node.js:** Versión 18.x, 20.x o superior.
- **npm:** Versión 9.x o superior.
- **Navegador web moderno:** Chrome, Firefox, Edge o Safari.

---

## 🚀 Instalación y Puesta en Marcha

Para ejecutar el proyecto de extremo a extremo se deben levantar ambos servidores en terminales separadas.

### 1. Iniciar el Backend (API Express)

Abra una terminal en la carpeta del proyecto:

```bash
cd backend
npm install
npm start
```
* **Puerto:** `http://localhost:4000`
* **Modo desarrollo (con auto-recarga):** `npm run dev`

### 2. Iniciar el Frontend (React + Vite)

Abra una segunda terminal en la carpeta del proyecto:

```bash
cd frontend
npm install
npm run dev
```
* **Puerto:** `http://localhost:5173`
* Abra en su navegador: `http://localhost:5173`

---

## 📡 Documentación de la API REST

### Endpoints Principales

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| **GET** | `/registros` | Consulta todas las ideas registradas | `200 OK`, `500 Internal Error` |
| **POST** | `/registros` | Registra una nueva idea de emprendimiento | `201 Created`, `400 Bad Request`, `500 Error` |

---

### Ejemplo de Petición: `POST /registros`

**Cabeceras:**
```http
Content-Type: application/json
```

**Cuerpo (Payload JSON):**
```json
{
  "proponente": "María Paula Gómez",
  "email": "maria.gomez@emprende.com",
  "titulo": "EcoEmpaques Biodegradables",
  "sector": "Sostenibilidad",
  "fecha": "2026-10-13",
  "descripcion": "Desarrollo de empaques a base de almidón de yuca para reemplazar plásticos de un solo uso en restaurantes locales.",
  "etapa": "Prototipo"
}
```

**Respuesta Exitosa (`201 Created`):**
```json
{
  "exito": true,
  "mensaje": "Idea de emprendimiento registrada exitosamente.",
  "datos": {
    "id": "c1f7a0b3-9e4a-4e47-8a6a-d99f2b385e01",
    "proponente": "María Paula Gómez",
    "email": "maria.gomez@emprende.com",
    "titulo": "EcoEmpaques Biodegradables",
    "descripcion": "Desarrollo de empaques a base de almidón de yuca para reemplazar plásticos de un solo uso en restaurantes locales.",
    "fecha": "2026-10-13",
    "sector": "Sostenibilidad",
    "etapa": "Prototipo",
    "creadoEn": "2026-10-13T23:55:00.000Z"
  }
}
```

**Respuesta con Datos Inválidos (`400 Bad Request`):**
```json
{
  "exito": false,
  "mensaje": "Datos inválidos en la solicitud.",
  "errores": [
    "El email del proponente es obligatorio y debe tener un formato válido (ejemplo: usuario@correo.com).",
    "La descripción de la idea es obligatoria y debe tener al menos 10 caracteres."
  ]
}
```

---

### Ejemplo de Petición: `GET /registros`

**Respuesta Exitosa (`200 OK`):**
```json
{
  "exito": true,
  "total": 1,
  "datos": [
    {
      "id": "c1f7a0b3-9e4a-4e47-8a6a-d99f2b385e01",
      "proponente": "María Paula Gómez",
      "email": "maria.gomez@emprende.com",
      "titulo": "EcoEmpaques Biodegradables",
      "descripcion": "Desarrollo de empaques a base de almidón de yuca para reemplazar plásticos de un solo uso en restaurantes locales.",
      "fecha": "2026-10-13",
      "sector": "Sostenibilidad",
      "etapa": "Prototipo",
      "creadoEn": "2026-10-13T23:55:00.000Z"
    }
  ]
}
```

---

## 🧪 Verificación de Persistencia y Casos de Prueba

1. **Creación:** Diligencie el formulario en `http://localhost:5173/registro` y pulse "Publicar Idea".
2. **Consulta:** Verifique que la idea aparece de inmediato en `http://localhost:5173/lista`.
3. **Rechazo de datos inválidos:** Intente enviar el formulario con campos vacíos o correo sin `@`. Observe que tanto React como Express bloquean la operación y notifican el error.
4. **Persistencia tras reinicio:**
   - Detenga el backend con `Ctrl + C`.
   - Vuelva a ejecutar `npm start` en la carpeta `backend/`.
   - Recargue la página del frontend y compruebe que los registros se siguen visualizando correctamente desde `backend/data/ideas.json`.

---

## 👥 Integrantes del Equipo
- Fernando Zavala
- Kevin Naranjo
