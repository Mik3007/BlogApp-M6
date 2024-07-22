import axios from "axios";

// Definiamo l'url di base
const API_URL = "https://blogapp-m6-rjaf.onrender.com/api"

// Configura un'istanza di axios con l'URL di base
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Header di autorizzazione inviato:", config.headers["Authorization"]);
    } else {
      console.log("Nessun token trovato nell'interceptor");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funzioni per le operazioni CRUD sui post
export const getPosts = () => api.get("/blogPosts");
// NEW: modifico per praticità la funzione getPost:id
export const getPost = (id) =>
  api.get(`/blogPosts/${id}`).then((response) => response.data);
export const createPost = async (postData) => {
  try {
    const response = await api.post("/blogPosts", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Errore dettagliato nella chiamata API createPost:", error.response?.data || error);
    throw error;
  }
};
export const updatePost = (id, postData) =>
  api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// NEW: Funzioni per gestire i commenti

// Recupera tutti i commenti per un post specifico
export const getComments = (postId) =>
  api.get(`/blogPosts/${postId}/comments`).then((response) => response.data);

// Aggiunge un nuovo commento a un post specifico
export const addComment = (postId, commentData) =>
  api
    .post(`/blogPosts/${postId}/comments`, commentData)
    .then((response) => response.data);

// Funzione per recuperare un commento specifico
export const getComment = (postId, commentId) =>
  api
    .get(`/blogPosts/${postId}/comments/${commentId}`)
    .then((response) => response.data);

// Funzione per aggiornare un commento specifico
export const updateComment = (postId, commentId, commentData) =>
  api
    .put(`/blogPosts/${postId}/comments/${commentId}`, commentData)
    .then((response) => response.data);

// Funzione per eliminare un commento specifico
export const deleteComment = (postId, commentId) =>
  api.delete(`/blogPosts/${postId}/comments/${commentId}`)

// Funzione per registrare un nuovo utente
export const registerUser = (userData) => {
  console.log("Dati inviati a registerUser:", userData);
  return api.post("/authors", userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
    console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () => api.get("/auth/me");

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me"); // Effettua la richiesta per ottenere i dati dell'utente
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// Se un domani aggiungiamo le operazioni per gli autori, possiamo definirle qua

// Infine, esportiamo api
export default api;
