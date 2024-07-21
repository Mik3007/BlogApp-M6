// Middleware per il controllo dell'autorizzazione via email
const controlloMail = (req, res, next) => {
  const emailAutorizzata = "autorizzato@mail.it";
  const mailUtente = req.headers["user-email"];

  if (mailUtente === emailAutorizzata) {
    // Email corrisponde: procedi al prossimo middleware
    next();
  } else {
    // Email non autorizzata: invia errore 403
    res
      .status(403)
      .json({ message: "ACCESSO NEGATO: Utente non autorizzato." });
  }
};

export default controlloMail;
