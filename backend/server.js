const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: '*', // Permitir solicitudes desde cualquier origen (React Vite u otros)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Ruta al archivo de almacenamiento persistente
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'ideas.json');
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');

/**
 * Asegura que el directorio y el archivo JSON existan.
 * Si el archivo no existe, lo inicializa con una lista vacía [].
 */
function ensureStorageExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      console.log('Archivo de persistencia inicializado con lista vacía en:', DATA_FILE);
    }
  } catch (error) {
    console.error('Error al inicializar el archivo de datos:', error.message);
  }
}

// Inicializar archivo de datos al iniciar el servidor
ensureStorageExists();

/**
 * Lee los registros desde el archivo JSON de forma segura.
 * @returns {Promise<Array>}
 */
async function leerRegistros() {
  ensureStorageExists();
  try {
    const rawData = await fs.promises.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(rawData.trim() || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error.message);
    throw new Error('No se pudo leer la base de datos de ideas.');
  }
}

/**
 * Escribe los registros en el archivo JSON de forma segura.
 * @param {Array} registros 
 * @returns {Promise<void>}
 */
async function guardarRegistros(registros) {
  ensureStorageExists();
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(registros, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar en el archivo JSON:', error.message);
    throw new Error('No se pudo persistir la idea en el archivo JSON.');
  }
}

/**
 * Validador de formato de correo electrónico
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validar campos obligatorios y formato para una idea de emprendimiento
 */
function validarIdea(data) {
  const errores = [];

  const { proponente, email, titulo, descripcion, fecha, sector, etapa } = data;

  if (!proponente || typeof proponente !== 'string' || proponente.trim().length < 2) {
    errores.push('El nombre del proponente es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (!email || typeof email !== 'string' || !validarEmail(email.trim())) {
    errores.push('El email del proponente es obligatorio y debe tener un formato válido (ejemplo: usuario@correo.com).');
  }

  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
    errores.push('El título de la idea es obligatorio y debe tener al menos 3 caracteres.');
  }

  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 10) {
    errores.push('La descripción de la idea es obligatoria y debe tener al menos 10 caracteres.');
  }

  if (!fecha || typeof fecha !== 'string' || isNaN(Date.parse(fecha))) {
    errores.push('La fecha es obligatoria y debe ser una fecha válida (formato YYYY-MM-DD).');
  }

  if (!sector || typeof sector !== 'string' || sector.trim().length === 0) {
    errores.push('El sector económico o categoría es obligatorio.');
  }

  return errores;
}

// ================= RUTAS API REST =================

// Ruta de estado / bienvenida de la API
app.get('/api', (req, res) => {
  res.json({
    mensaje: 'API REST - Banco de Ideas de Emprendimiento',
    estado: 'activo',
    endpoints: {
      consultarRegistros: 'GET /registros',
      crearRegistro: 'POST /registros'
    }
  });
});

app.get('/', (req, res, next) => {
  if (fs.existsSync(FRONTEND_DIST)) {
    return next();
  }
  res.json({
    mensaje: 'API REST - Banco de Ideas de Emprendimiento',
    estado: 'activo',
    endpoints: {
      consultarRegistros: 'GET /registros',
      crearRegistro: 'POST /registros'
    }
  });
});

/**
 * GET /registros
 * Consulta y devuelve todos los registros de ideas de emprendimiento.
 */
app.get('/registros', async (req, res) => {
  try {
    const registros = await leerRegistros();
    // Opcional: ordenar del más reciente al más antiguo
    const registrosOrdenados = [...registros].reverse();
    return res.status(200).json({
      exito: true,
      total: registros.length,
      datos: registrosOrdenados
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: error.message || 'Error interno del servidor al consultar registros.'
    });
  }
});

/**
 * POST /registros
 * Valida, genera un ID único y persiste una nueva idea de emprendimiento en el archivo JSON.
 */
app.post('/registros', async (req, res) => {
  try {
    const cuerpo = req.body || {};
    const errores = validarIdea(cuerpo);

    if (errores.length > 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Datos inválidos en la solicitud.',
        errores
      });
    }

    const { proponente, email, titulo, descripcion, fecha, sector, etapa, presupuesto } = cuerpo;

    // Crear el nuevo registro con ID único
    const nuevaIdea = {
      id: crypto.randomUUID ? crypto.randomUUID() : `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      proponente: proponente.trim(),
      email: email.trim().toLowerCase(),
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fecha: fecha.trim(),
      sector: sector.trim(),
      etapa: (etapa && typeof etapa === 'string' && etapa.trim()) || 'Idea inicial',
      presupuesto: presupuesto ? String(presupuesto).trim() : null,
      creadoEn: new Date().toISOString()
    };

    // Leer registros existentes
    const registros = await leerRegistros();

    // Agregar el nuevo registro
    registros.push(nuevaIdea);

    // Persistir sin perder los anteriores
    await guardarRegistros(registros);

    console.log(`[POST /registros] Nueva idea registrada con ID: ${nuevaIdea.id} por ${nuevaIdea.proponente}`);

    return res.status(201).json({
      exito: true,
      mensaje: 'Idea de emprendimiento registrada exitosamente.',
      datos: nuevaIdea
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: error.message || 'Error interno al procesar y guardar el registro.'
    });
  }
});

// Soporte para prefijo alternativo /api/registros por compatibilidad
app.get('/api/registros', (req, res) => res.redirect(307, '/registros'));
app.post('/api/registros', (req, res) => res.redirect(307, '/registros'));

// Servir archivos estáticos del frontend (React SPA) si existe la carpeta dist
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));

  // Cualquier ruta GET que no sea de la API sirve el index.html para React Router
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/registros') || req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Servidor Backend Express en ejecución `);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Endpoints disponibles:`);
  console.log(`   - GET  http://localhost:${PORT}/registros`);
  console.log(`   - POST http://localhost:${PORT}/registros`);
  console.log(`=================================================`);
});
