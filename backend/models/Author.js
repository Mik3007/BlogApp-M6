import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definizione dello schema per l'autore
const authorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true }, // Campo nome, obbligatorio
    cognome: { type: String, required: true }, // Campo cognome, obbligatorio
    email: { type: String, required: true, unique: true }, // Campo email, obbligatorio e unico
    dataDiNascita: { type: String }, // Campo data di nascita
    avatar: { type: String }, // Campo avatar (URL)
    password: { type: String }, // Campo password
    googleId: { type: String }, // Campo ID di Google (per login con Google)
  },
  {
    timestamps: true, // Aggiunge createdAt e updatedAt
    collection: "authors", // Nome della collezione nel database
  }
);

// Metodo per confrontare le password
authorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware per l'hashing delle password prima del salvataggio
authorSchema.pre("save", async function (next) {
  // Esegui l'hashing solo se la password è stata modificata (o è nuova)
  if (!this.isModified("password")) return next();

  try {
    // Genera un salt e hash la password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Author", authorSchema);
