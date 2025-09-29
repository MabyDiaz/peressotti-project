import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Lista de tipos permitidos
const allowedMimeTypes = [
  // imágenes
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/bmp',
  'image/vnd.adobe.photoshop', // PSD
  // documentos
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // diseño
  'application/postscript', // AI (común)
  'application/illustrator', // AI (algunos programas)
  'application/coreldraw', // CDR (no oficial)
  'application/octet-stream', // fallback genérico (AI/CDR/otros)
];

// Filtros opcionales (ej: solo imágenes)
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
