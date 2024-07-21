import multer from "multer";
import path from "path";

// Configurazione dello storage per multer
const storage = multer.diskStorage({
  // Imposta la cartella di destinazione per i file caricati
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Definisce il nome del file caricato
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Crea l'istanza di multer con la configurazione dello storage
const upload = multer({ storage: storage });

export default upload;
