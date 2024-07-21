import jwt from "jsonwebtoken";

// Funzione per generare un token JWT
export const generateJWT = (payload) => {
  return new Promise((resolve, reject) =>
    jwt.sign(
      payload, // Dati inclusi nel token (es. ID utente)
      process.env.JWT_SECRET, // Chiave segreta per firmare il token
      { expiresIn: "1 day" }, // Scadenza del token
      (err, token) => {
        if (err) reject(err); // Rifiuta la Promise se c'è un errore
        else resolve(token); // Risolve la Promise con il token generato
      }
    )
  );
};

// Funzione per verificare un token JWT
export const verifyJWT = (token) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err); // Rifiuta la Promise se c'è un errore
      else resolve(decoded); // Risolve la Promise con il payload decodificato
    })
  );
};
