import express from "express";
import Author from "../models/Author.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const router = express.Router();

// POST /login => restituisce token di accesso
router.post("/login", async (req, res) => {
  try {
    // Estrae email e password dal corpo della richiesta
    const { email, password } = req.body;

    // Cerca l'autore nel database usando l'email
    const author = await Author.findOne({ email });
    if (!author) {
      // Se l'autore non viene trovato, restituisce un errore 401
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // Verifica la password usando il metodo comparePassword definito nel modello Author
    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      // Se la password non corrisponde, restituisce un errore 401
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // Se le credenziali sono corrette, genera un token JWT
    const token = await generateJWT({ id: author._id });

    // Restituisce il token e un messaggio di successo
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    // Gestisce eventuali errori del server
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore del server" });
  }
});

// GET /me => restituisce l'autore collegato al token di accesso
router.get("/me", authMiddleware, (req, res) => {
  // Converte il documento Mongoose in un oggetto JavaScript semplice
  const authorData = req.author.toObject();
  // Rimuove il campo password per sicurezza
  delete authorData.password;
  // Invia i dati dell'autore come risposta
  res.json(authorData);
});

// Rotta per iniziare il processo di autenticazione Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Rotta di callback per l'autenticazione Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/login` }),
  async (req, res) => {
    try {
      // Genera un JWT (JSON Web Token) per l'utente autenticato
      const token = await generateJWT({ id: req.user._id });

      // Reindirizza l'utente al frontend, passando il token come parametro URL
      res.redirect(`${FRONTEND_URL}/?token=${token}`);
    } catch (error) {
      // Se c'è un errore nella generazione del token, lo logghiamo
      console.error("Errore nella generazione del token:", error);
      // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
      res.redirect("/login?error=auth_failed");
    }
  }
);

export default router;
