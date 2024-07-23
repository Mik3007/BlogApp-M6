Blog App
Questa applicazione di blog offre una piattaforma completa per la creazione e la gestione di contenuti, utilizzando React per il frontend e un'API backend personalizzata per la gestione dei dati.
Caratteristiche Dettagliate

Autenticazione Utente

- Registrazione utente con email e password
- Login con credenziali locali
- Autenticazione OAuth con Google
- Gestione delle sessioni utente con token JWT

Gestione dei Post

- Creazione di nuovi post con titolo, contenuto, categoria e immagine di copertina
- Visualizzazione di tutti i post nella homepage con layout a griglia
- Pagina di dettaglio per ogni post
- Modifica dei post da parte dell'autore
- Eliminazione dei post da parte dell'autore
- Upload di immagini di copertina su Cloudinary

Sistema di Commenti

- Aggiunta di commenti ai post da parte degli utenti autenticati
- Visualizzazione dei commenti nella pagina di dettaglio del post
- Possibilità di eliminare i propri commenti

Funzionalità di Ricerca

- Barra di ricerca nella navbar per filtrare i post per titolo
- Aggiornamento dinamico dei risultati di ricerca

Design e UI

- Layout responsive adattabile a desktop, tablet e mobile
- Utilizzo di Tailwind CSS per uno stile moderno e personalizzabile
- Animazioni fluide con Framer Motion per migliorare l'esperienza utente

Struttura del Progetto

- src/components: Contiene componenti riutilizzabili come Navbar e Footer
- src/pages: Pagine principali dell'applicazione (Home, CreatePost, PostDetail, etc.)
- src/services: Servizi per le chiamate API e la gestione dell'autenticazione
- src/utils: Funzioni di utilità e helpers

Flusso di Lavoro Dettagliato

Autenticazione:

- Gli utenti possono registrarsi fornendo nome, cognome, email, password e data di nascita
- Login possibile con email/password o tramite Google OAuth
- Dopo il login, viene generato un token JWT per mantenere la sessione


Visualizzazione Post:

- La homepage mostra una griglia di post con immagini di copertina e dettagli base
- Cliccando su un post si accede alla pagina di dettaglio


Creazione Post:

- Gli utenti autenticati possono creare nuovi post
- Il form di creazione include campi per titolo, contenuto, categoria e upload dell'immagine


Interazione con i Post:

- Nella pagina di dettaglio, gli utenti possono leggere il post completo
- Gli autori possono modificare o eliminare i propri post
- Gli utenti autenticati possono aggiungere commenti


Ricerca:

- La barra di ricerca nella navbar filtra i post in tempo reale mentre l'utente digita



Tecnologie e Librerie Principali

- React: Libreria per la costruzione dell'interfaccia utente
- React Router: Gestione del routing lato client
- Axios: Gestione delle chiamate HTTP al backend
- Tailwind CSS: Framework CSS per uno stile rapido e responsivo
- Cloudinary: Servizio per l'hosting e la gestione delle immagini
- Framer Motion: Libreria per animazioni fluide e reattive
- Heroicons: Set di icone SVG per migliorare l'interfaccia utente

Questo progetto dimostra l'implementazione di un'applicazione full-stack moderna, combinando un frontend React interattivo con un backend robusto, offrendo un'esperienza di blogging completa e user-friendly.

STRUTTURA DEL PROGETTO -- LINK PER VISUALIZZARLO "https://blogapp-omega-vert.vercel.app/" --

blog-app/
│
├── backend/
│   ├── config/
│   │   ├── claudinaryConfig.js  // Configurazione per l'upload di immagini su Cloudinary
│   │   └── passportConfig.js    // Configurazione per l'autenticazione OAuth con Google
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js    // Middleware per la verifica dell'autenticazione
│   │   ├── controlloMail.js     // Middleware per il controllo delle email autorizzate
│   │   ├── errorHandlers.js     // Gestori degli errori per l'applicazione
│   │   └── upload.js            // Configurazione per l'upload di file
│   │
│   ├── models/
│   │   ├── Author.js            // Schema del modello per gli autori
│   │   └── BlogPost.js          // Schema del modello per i post del blog
│   │
│   ├── routes/
│   │   ├── authorRoutes.js      // Rotte per la gestione degli autori
│   │   ├── authRoutes.js        // Rotte per l'autenticazione
│   │   └── blogPostRoutes.js    // Rotte per la gestione dei post del blog
│   │
│   ├── utils/
│   │   └── jwt.js               // Utility per la gestione dei token JWT
│   │
│   ├── .env                     // File per le variabili d'ambiente
│   └── server.js                // Entry point del server backend
│
└── frontend/
    ├── public/
    │   └── vite.svg             // Logo di Vite
    │
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       // Componente per la barra di navigazione
    │   │   └── Navbar.css       // Stili per la barra di navigazione
    │   │
    │   ├── pages/
    │   │   ├── CreatePost.jsx   // Pagina per la creazione di nuovi post
    │   │   ├── Home.jsx         // Pagina principale dell'applicazione
    │   │   ├── Login.jsx        // Pagina di login
    │   │   ├── PostDetail.jsx   // Pagina di dettaglio per un singolo post
    │   │   └── Register.jsx     // Pagina di registrazione
    │   │
    │   ├── services/
    │   │   └── api.js           // Servizio per le chiamate API
    │   │
    │   ├── App.jsx              // Componente principale dell'applicazione
    │   └── main.jsx             // Entry point dell'applicazione React
    │
    ├── index.html               // File HTML principale
    └── vite.config.js           // Configurazione di Vite
