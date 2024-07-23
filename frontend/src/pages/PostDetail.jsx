import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Importa le funzioni API necessarie
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
// Import delle icone da heroIcons
import {
  ChatBubbleOvalLeftEllipsisIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

// Funzione per visualizzare l'avatar dell'utente
function AvatarProfilo({ userData }) {
  // Usa la prima lettera del nome come avatar se l'immagine non è disponibile
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

export default function PostDetail({ posts, setPosts }) {
  // Stati per memorizzare i dati del post, dei commenti e dell'utente
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Stati per la gestione delle modali
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: "", content: "" });
  const [isAuthor, setIsAuthor] = useState(false);

  // Ottieni l'ID del post dai parametri dell'URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Effettua il fetch dei dati del post, dei commenti e dei dati dell'utente
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
        setEditedPost(postData);

        const token = localStorage.getItem("token");
        if (token) {
          // Verifica se l'email dell'autore del post corrisponde all'email dell'utente loggato
          setIsAuthor(postData.authorEmail === userData.email);
        }
      } catch (error) {
        console.error("Errore nel caricamento del post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error);
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const data = await getUserData();
          setUserData(data);
          fetchComments();
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchPost();
    checkAuthAndFetchUserData();
  }, [id]);

  // Gestore per il cambiamento del contenuto del commento
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
      console.error("Devi effettuare il login per commentare.");
      return;
    }
    try {
      const commentData = {
        content: newComment.content,
        name: `${userData.nome} ${userData.cognome}`,
        email: userData.email,
      };
      const newCommentData = await addComment(id, commentData);
      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment({ content: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  // Gestore per l'eliminazione del post
  const handleDeletePost = async () => {
    if (!post || !isAuthor) return;
    try {
      await deletePost(post._id);
      alert(`Post eliminato con successo: ${post._id}`);
      setPosts((prevPosts) =>
        prevPosts.filter((currentPost) => currentPost._id !== post._id)
      );
      navigate("/home");
    } catch (error) {
      console.error(
        `Errore durante l'eliminazione del post ${post._id}:`,
        error
      );
    }
  };

  // Gestore per l'eliminazione di un commento
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(post._id, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      alert("Commento eliminato con successo");
    } catch (error) {
      console.error(
        `Errore durante l'eliminazione del commento ${commentId}:`,
        error
      );
    }
  };

  // Gestore per aprire la modale di modifica del post
  const handleEditClick = () => {
    setEditedPost({ ...post });
    setIsEditModalOpen(true);
  };

  // Gestore per il cambiamento dei dati del post durante la modifica
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  // Gestore per l'invio delle modifiche al post
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, editedPost);
      const updatedPostData = await getPost(id);
      setPost(updatedPostData);
      setEditedPost(updatedPostData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Errore nell'aggiornamento del post:", error);
    }
  };

  // Se il post non è stato caricato, mostra un messaggio di caricamento
  if (!post)
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    );

  // Rendering del componente
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-64 object-cover sm:h-48"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 sm:text-2xl">{post.title}</h1>

          <div className="flex flex-wrap text-sm text-gray-600 mb-4">
            <span className="mr-4">Categoria: {post.category}</span>
            <span className="mr-4">Autore: {post.author}</span>
            <span>
              Tempo di lettura: {post.readTime?.value ?? ""}{" "}
              {post.readTime?.unit ?? ""}
            </span>
          </div>

          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-300 p-4 rounded-lg mb-4 flex flex-col sm:flex-row sm:items-start"
                >
                  <div className="flex-grow">
                    <h3 className="font-semibold">{comment.name}</h3>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  {isAuthor && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="mt-2 sm:mt-0 sm:ml-4 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
                    >
                      <TrashIcon className="h-6 w-6 text-[#153448]" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">Ancora nessun commento</p>
            )}
            <div className="flex justify-between mt-3">
              {isAuthor && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-full"
                  >
                    <PencilIcon className="w-8" />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full"
                  >
                    <TrashIcon className="w-8" />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex"
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-8" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
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

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
