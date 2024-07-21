// Importa gli hook necessari da React
import { useState, useEffect } from "react";
// Importa useParams per accedere ai parametri dell'URL
import { useParams } from "react-router-dom";

// NEW: Aggiungiamo getComments e addComment alle importazioni
import {
  getPost,
  getComments,
  addComment,
  deletePost,
  getUserData,
  deleteComment,
  updatePost,
} from "../services/api";

import { useNavigate } from "react-router-dom";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/24/solid";

//creo una funzione, che se l'immagine di profilo non c'è prende la prima lettera del nome e la usa come avatar.
function AvatarProfilo({ userData }) {
  const iniziale = userData?.nome ? userData.nome[0].toUpperCase() : "?";

  return (
    <div className="w-10 h-10 rounded-full me-3 flex items-center justify-center bg-white border border-gray-300">
      {userData?.avatar ? (
        <img
          className="w-full h-full rounded-full object-cover"
          src={userData.avatar}
          alt="immagine profilo"
        />
      ) : (
        <span className="text-black font-bold">{iniziale}</span>
      )}
    </div>
  );
}

export default function PostDetail() {
  // Stato per memorizzare i dati del post
  const [post, setPost] = useState(null);
  // NEW: Stato per memorizzare i commenti
  const [comments, setComments] = useState([]);
  // NEW: Stato per il nuovo commento
  const [newComment, setNewComment] = useState({ content: "" });
  // Stato per verificare se l'utente è loggato
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Stato per memorizzare i dati dell'utente
  const [userData, setUserData] = useState(null);
  // Estrae l'id del post dai parametri dell'URL
  const { id } = useParams();
  // stato per aprire e chiudere la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  // stato per aprire e chiudere la modale per la modifica del post
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  // Effettua il fetch dei dati del post e dei commenti al caricamento del componente
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id); // Ottiene i dati del post dall'API
        setPost(postData); // Imposta i dati del post nello stato
        setEditedPost(postData);
      } catch (error) {
        console.error("Errore nel caricamento del post:", error); // Logga l'errore in console
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id); // Ottiene i commenti del post dall'API
        setComments(commentsData); // Imposta i commenti nello stato
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error); // Logga l'errore in console
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token"); // Recupera il token di autenticazione dalla memoria locale
      if (token) {
        setIsLoggedIn(true); // Imposta lo stato di autenticazione a true
        try {
          const data = await getUserData(); // Ottiene i dati dell'utente autenticato dall'API
          setUserData(data); // Imposta i dati dell'utente nello stato
          fetchComments(); // Carica i commenti del post
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error); // Logga l'errore in console
          setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
        }
      } else {
        setIsLoggedIn(false); // Imposta lo stato di autenticazione a false
      }
    };

    fetchPost(); // Carica i dati del post al caricamento del componente
    checkAuthAndFetchUserData(); // Verifica l'autenticazione e carica i dati dell'utente
  }, [id]); // Effettua nuovamente l'effetto quando l'ID del post cambia

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prevComment) => ({
      ...prevComment,
      [name]: value,
    }));
  };

  // Gestore per l'invio di un nuovo commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      console.error("Devi effettuare il login per commentare."); // Logga un messaggio di errore se l'utente non è loggato
      return;
    }
    try {
      const commentData = {
        content: newComment.content, // Contenuto del nuovo commento
        name: `${userData.nome} ${userData.cognome}`, // Nome dell'utente
        email: userData.email, // Email dell'utente
      };
      const newCommentData = await addComment(id, commentData); // Invia il nuovo commento all'API
      // Genera un ID temporaneo se l'API non restituisce un ID in tempo
      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]); // Aggiunge il nuovo commento alla lista dei commenti
      setNewComment({ content: "" });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return; // Controllo di sicurezza
    try {
      await deletePost(post._id);
      console.log(`Post eliminato con successo: ${post._id}`);
      // Reindirizza l'utente alla home page o alla lista dei post
      navigate("/home");
    } catch (error) {
      console.error(
        `Errore durante l'eliminazione del post ${post._id}:`,
        error
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(post._id, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      alert("Commento eliminato con successo");
    } catch (error) {
      console.error(
        `Errore durante l'eliminazione del post ${comments._id}:`,
        error
      );
    }
  };

  const handleEditClick = () => {
    setEditedPost({ ...post });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, editedPost);
      const updatedPostData = await getPost(id); // Ricarica il post dopo l'aggiornamento
      setPost(updatedPostData);
      setEditedPost(updatedPostData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Errore nell'aggiornamento del post:", error);
    }
  };

  // Se il post non è ancora stato caricato, mostra un messaggio di caricamento
  if (!post) return <div>Caricamento...</div>;

  // Rendering del componente
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Immagine di copertina del post */}
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          {/* Titolo del post */}
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          {/* Dati del post */}
          <div className="flex flex-wrap text-sm text-gray-600 mb-4">
            <span className="mr-4">Categoria: {post.category}</span>
            <span className="mr-4">Autore: {post.author}</span>
            <span>
              Tempo di lettura: {post.readTime?.value ?? ""}{" "}
              {post.readTime?.unit ?? ""}
            </span>
          </div>

          {/* Contenuto del post */}
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Sezione commenti */}
          <div className="mt-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-300 p-4 rounded-lg mb-4 flex w-1/2"
                >
                  <AvatarProfilo userData={userData} />
                  <div>
                    <h3 className="font-semibold">{comment.name}</h3>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="mt-2 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full float-end"
                  >
                    <TrashIcon className="h-6 w-6 text-[#153448]" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Ancora nessun commento</p>
            )}

            {/* Div bottoni in flex per metterli in between */}
            <div className="flex justify-between mt-3">
              {/* Pulsante per aprire il modal dei commenti */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex"
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-8" />
              </button>

              {/* Pulsante per modificare il post */}
              <button
                onClick={handleEditClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-full"
              >
                <PencilIcon className="w-8" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Modal per aggiungere un commento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <ChatBubbleOvalLeftEllipsisIcon className="w-8" />
            </h3>
            <form onSubmit={handleCommentSubmit} className="mt-2">
              <textarea
                name="content"
                value={newComment.content}
                onChange={handleCommentChange}
                placeholder="Il tuo commento"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 h-24"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Chiudi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Invia commento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal per modificare il post */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Modifica Post
            </h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="title"
                value={editedPost.title}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded mb-3"
              />
              <textarea
                name="content"
                value={editedPost.content}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded mb-3 h-64"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleDeletePost}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Elimina Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
