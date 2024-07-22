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
        // Reindirizza alla home se c'è un errore
        navigate("/");
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

    try {
      console.log("Dati del post da inviare:", post);
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
      console.log("Risposta del server:", response);

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
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto my-8 text-[#000000] rounded-lg shadow-xl overflow-hidden bg-transparent"
    >
      <h1 className="text-3xl text-center py-6 italic text-red-600 font-semibold animate-pulse">
        New Post
      </h1>
      <form onSubmit={handleSubmit} className="px-4 sm:px-8 pb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          {/* Campo per il titolo del post */}
          <div className="flex-1">
            <label
              className="block text-[#DFD0B8] text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8]"
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo per la categoria del post (menu a tendina) */}
          <div className="w-full sm:w-1/3 mt-4 sm:mt-0">
            <label
              className="block text-[#DFD0B8] text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8] bg-white"
              id="category"
              name="category"
              value={post.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo per l'email dell'autore */}
        <div>
          <label
            className="block text-[#DFD0B8] text-sm font-bold mb-2"
            htmlFor="author"
          >
            Author email
          </label>
          <input
            className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8]"
            type="email"
            id="author"
            name="author"
            value={post.author}
            onChange={handleChange}
          />
        </div>

        {/* Campo per l'upload dell'immagine di copertura */}
        <div>
          <label
            className="block text-[#DFD0B8] text-sm font-bold mb-2"
            htmlFor="cover"
          >
            Cover Image
          </label>
          <input
            className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8]"
            type="file"
            id="cover"
            name="cover"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Campo per il contenuto del post */}
        <div>
          <label
            className="block text-[#DFD0B8] text-sm font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            className="w-full p-2 border border-gray-400 rounded h-32 focus:outline-none focus:border-[#DFD0B8]"
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo per il tempo di lettura del post */}
        <div>
          <label
            className="block text-[#DFD0B8] text-sm font-bold mb-2"
            htmlFor="readTimeValue"
          >
            Read time (minutes)
          </label>
          <input
            className="w-full sm:w-32 p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8]"
            type="number"
            id="readTimeValue"
            name="readTimeValue"
            value={post.readTime.value}
            onChange={handleChange}
            required
          />
        </div>

        {/* Pulsante per inviare il form */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#DFD0B8] text-[#153448] font-bold py-2 px-4 rounded focus:outline-none hover:bg-[#C0A58E] transition duration-300"
        >
          Create Post
        </motion.button>
      </form>
    </motion.div>
  );
}
