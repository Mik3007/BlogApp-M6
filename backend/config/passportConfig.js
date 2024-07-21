import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";

// Configurazione della strategia Google OAuth
passport.use(
  new GoogleStrategy(
    {
      // Credenziali OAuth da variabili d'ambiente
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // L'URL a cui Google reindizzerà dopo l'autenticazione
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    // Funzione di callback post-autenticazione Google
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerca un autore esistente o ne crea uno nuovo
        let author = await Author.findOne({ googleId: profile.id });

        if (!author) {
          author = new Author({
            googleId: profile.id,
            nome: profile.name.givenName,
            cognome: profile.name.familyName,
            email: profile.emails[0].value,
            dataDiNascita: null, // Non fornita da Google
          });
          await author.save();
        }

        // Passa l'autore a Passport
        done(null, author);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// memorizza l'ID nella sessione
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// recupera l'utente completo dall'ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Author.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
