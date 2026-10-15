# Frontend - Banco de Ideas de Emprendimiento

Aplicación web Single Page Application (SPA) desarrollada con **React** y **Vite**, diseñada para registrar, validar y consultar propuestas de emprendimiento en interacción con una API REST en Node.js/Express.

---

## 🛠️ Tecnologías Utilizadas

- **React 18:** Biblioteca de interfaces de usuario mediante componentes funcionales y Hooks (`useState`, `useEffect`, `useNavigate`).
- **Vite 5:** Herramienta de compilación y servidor de desarrollo ultra rápido.
- **React Router DOM 6:** Enrutamiento del lado del cliente (`/`, `/registro`, `/lista`).
- **CSS3 Moderno:** Diseño responsivo con CSS Grid y Flexbox sin dependencias de frameworks pesados.
- **Fetch API:** Consumo asíncrono de servicios REST (`GET` y `POST`).

---

## 📁 Estructura del Proyecto

```text
frontend/
├── index.html            # Plantilla HTML principal
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
├── src/
│   ├── main.jsx          # Punto de entrada de la aplicación
│   ├── App.jsx           # Enrutador principal y layout
│   ├── index.css         # Estilos globales y diseño responsivo
│   ├── components/
│   │   ├── Navbar.jsx        # Barra de navegación principal
│   │   ├── IdeaCard.jsx      # Tarjeta reutilizable para cada idea
│   │   └── AlertMessage.jsx  # Notificaciones de error y éxito
│   └── pages/
│       ├── Home.jsx          # Vista de bienvenida e introducción
│       ├── Registro.jsx      # Formulario reactivo con validaciones
│       └── Lista.jsx         # Catálogo interactivo con búsqueda y filtros
```

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

### 3. Compilar para producción
```bash
npm run build
```

---

## 👥 Integrantes del Equipo
- Fernando Zavala
- Kevin Naranjo
