import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api";
// Importa motion per animazioni da framer-motion
import { motion } from "framer-motion";

export default function CreatePost() {
  // Definisce le categorie disponibili per il post
  const categories = [
    "Technology",
    "Science",
    "Politics",
    "Health",
    "Business",
    "Entertainment",
  ];

  const navigate = useNavigate();

  // Stato per memorizzare i dati del nuovo post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  // Stato per memorizzare il file di copertura
  const [coverFile, setCoverFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Effetto per recuperare l'email dell'utente al momento del montaggio del componente
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        // Recupera i dati dell'utente
        const userData = await getMe();
        // Aggiorna il campo 'author' con l'email dell'utente
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        setPost((prevPost) => ({
          ...prevPost,
          author: "Email non disponibile",
        }));
      }
    };
    fetchUserEmail();
  }, [navigate]);

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      // Gestisce il campo 'readTime' del post
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Aggiornamento degli altri campi
      setPost({ ...post, [name]: value });
    }
  };

  // Gestore per il cambiamento del file (immagine)
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Creazione di un oggetto FormData per inviare i dati del post e il file
      const formData = new FormData();

      // Aggiunge i campi del post al FormData
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      // Aggiunge il file di copertura se presente
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Invia i dati del post al backend
      const response = await createPost(formData);

      setPost({
        title: "",
        category: "",
        content: "",
        readTime: { value: 0, unit: "minutes" },
        author: post.author, // Mantieni l'email dell'autore
      });

      alert("Post creato con successo!");
      // Naviga alla home page dopo la creazione del post
      navigate("/home");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
      alert(
        "Errore nella creazione del post. Controlla la console per i dettagli."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Immagine di copertura del post */}
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-64 object-cover sm:h-48"
        />

        <div className="p-6">
          {/* Titolo del post */}
          <h1 className="text-3xl font-bold mb-4 sm:text-2xl">{post.title}</h1>

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
                  className="bg-gray-300 p-4 rounded-lg mb-4 flex flex-col sm:flex-row sm:w-full"
                >
                  <AvatarProfilo
                    userData={userData}
                    className="mr-4 mb-4 sm:mb-0"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{comment.name}</h3>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="mt-2 sm:mt-0 sm:ml-4 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
                  >
                    <TrashIcon className="h-6 w-6 text-[#153448]" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Ancora nessun commento</p>
            )}
            <div className="flex justify-between mt-3">
              {/* Pulsante per aprire la modale dei commenti */}
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

      {/* Modal per modificare il post */}
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
