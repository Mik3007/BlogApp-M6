import express from "express";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/claudinaryConfig.js"; // Import dell'uploader di Cloudinary

const router = express.Router();

// GET /authors: ritorna la lista degli autori
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find(); // Recupera tutti gli autori dal database
    res.json(authors); // Invia la lista degli autori come risposta JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // In caso di errore, invia una risposta di errore
  }
});

// GET /authors/:id: ritorna il singolo autore
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id); // Cerca un autore specifico per ID
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'autore non viene trovato, invia una risposta 404
    }
    res.json(author); // Invia l'autore trovato come risposta JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // In caso di errore, invia una risposta di errore
  }
});

// POST /authors: crea un nuovo autore
router.post("/", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    const { nome, cognome, email, password, dataDiNascita } = req.body;
    if (!nome || !cognome || !email || !password || !dataDiNascita) {
      return res
        .status(400)
        .json({ message: "Tutti i campi sono obbligatori" }); // Verifica che tutti i campi siano presenti
    }

    const authorData = { nome, cognome, email, password, dataDiNascita };
    if (req.file) {
      authorData.avatar = req.file.path; // Aggiungi l'avatar se presente
    }

    const author = new Author(authorData);
    const newAuthor = await author.save(); // Salva il nuovo autore nel database

    const authorResponse = newAuthor.toObject();
    delete authorResponse.password; // Rimuove la password dalla risposta

    res.status(201).json(authorResponse); // Invia la risposta con il nuovo autore
  } catch (err) {
    console.error("Errore durante la registrazione:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res
      .status(500)
      .json({ message: "Errore del server durante la registrazione" }); // In caso di errore, invia una risposta di errore
  }
});

// PUT /authors/:id: modifica l'autore con l'id associato
router.put("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); // Trova e aggiorna l'autore
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'autore non viene trovato, invia una risposta 404
    }
    res.json(updatedAuthor); // Invia l'autore aggiornato come risposta JSON
  } catch (err) {
    res.status(400).json({ message: err.message }); // In caso di errore, invia una risposta di errore
  }
});

// DELETE /authors/:id: cancella l'autore con l'id associato
router.delete("/:id", async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id); // Trova e elimina l'autore
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'autore non viene trovato, invia una risposta 404
    }
    res.json({ message: "Autore eliminato" }); // Invia un messaggio di conferma
  } catch (err) {
    res.status(500).json({ message: err.message }); // In caso di errore, invia una risposta di errore
  }
});

// GET /authors/:id/blogPosts: ricevi tutti i blog post di uno specifico autore
router.get("/:id/blogPosts", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id); // Cerca l'autore specifico per ID
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'autore non viene trovato, invia una risposta 404
    }
    const blogPosts = await BlogPost.find({ author: author.email }); // Cerca tutti i blog post dell'autore usando la sua email
    res.json(blogPosts); // Invia la lista dei blog post come risposta JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // In caso di errore, invia una risposta di errore
  }
});

// PATCH /authors/:authorId/avatar: carica un'immagine avatar per l'autore specificato
router.patch(
  "/:authorId/avatar",
  cloudinaryUploader.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" }); // Verifica se è stato caricato un file
      }

      const author = await Author.findById(req.params.authorId); // Cerca l'autore nel database
      if (!author) {
        return res.status(404).json({ message: "Autore non trovato" }); // Se l'autore non viene trovato, invia una risposta 404
      }

      author.avatar = req.file.path; // Aggiorna l'URL dell'avatar dell'autore

      await author.save(); // Salva le modifiche nel database

      res.json(author); // Invia la risposta con l'autore aggiornato
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'avatar:", error);
      res.status(500).json({ message: "Errore interno del server" }); // In caso di errore, invia una risposta di errore
    }
  }
);

export default router;
