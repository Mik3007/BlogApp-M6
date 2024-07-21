import Author from "../models/Author.js";
import { verifyJWT } from "../utils/jwt.js";

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Estrai il token dall'header Authorization
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("Token mancante");
    }

    // Verifica e decodifica il token usando la funzione verifyJWT
    const decoded = await verifyJWT(token);

    // Trova l'autore nel database usando l'ID dal token
    const author = await Author.findById(decoded.id).select("-password");
    if (!author) {
      return res.status(401).send("Autore non trovato");
    }

    // Rendi i dati dell'autore disponibili per le route successive
    req.author = author;

    next();
  } catch (error) {
    console.error("Errore nel middleware di autenticazione:", error);
    res.status(401).send("Token non valido");
  }
};
