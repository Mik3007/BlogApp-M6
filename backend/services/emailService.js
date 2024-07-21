// Importa il modulo mailgun-js per l'invio di email
import mailgun from "mailgun-js";

// Configura l'istanza di Mailgun con le credenziali dall'ambiente
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Funzione per inviare email
export const sendEmail = async (to, subject, htmlContent) => {
  // Prepara i dati dell'email
  const data = {
    from: "Strive Blog <noreply@yourdomain.com>", // Mittente dell'email
    to, // Destinatario
    subject, // Oggetto dell'email
    html: htmlContent, // Contenuto HTML dell'email
  };

  try {
    // Invia l'email usando Mailgun
    const response = await mg.messages().send(data);
    return response; // Restituisce la risposta di Mailgun
  } catch (error) {
    // Gestione degli errori
    throw new Error(`Errore nell'invio dell'email: ${error.message}`); // Rilancia l'errore con un messaggio chiaro
  }
};
