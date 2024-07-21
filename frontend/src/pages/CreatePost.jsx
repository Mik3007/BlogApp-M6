// Importa useState hook da React
import { useState, useEffect } from "react";
// Importa useNavigate da react-router-dom per la navigazione programmatica
import { useNavigate } from "react-router-dom";
// Importo la funzione createPost dal mio file services/api
import { createPost, getMe } from "../services/api";
import { motion } from 'framer-motion';

export default function CreatePost() {

  const categories = ['Technology', 'Science', 'Politics', 'Health', 'Business', 'Entertainment'];
  // Hook per la navigazione
  const navigate = useNavigate();
    // Stato per memorizzare i dati del nuovo post
  const [post, setPost] = useState({
      title: "",
      category: "",
      content: "",
      readTime: { value: 0, unit: "minutes" },
      author: "",
    });
    
    const [coverFile, setCoverFile] = useState(null);

  // NEW! useEffect per l'autenticazione
  useEffect(() => {
    const fetchUserEmail = async () => {
      
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/");
      }
    };
    fetchUserEmail();
  }, [navigate]);


  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      // Gestiamo il "readTime" del post
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      // Aggiornamento generale per gli altri campi
      setPost({ ...post, [name]: value });
    }
  };

  // Nuovo gestore per il cambiamento del file di copertina
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Dati del post da inviare:", post);
      // Creiamo un oggetto FormData per inviare sia i dati del post che il file
      const formData = new FormData();

      // Aggiungiamo tutti i campi del post al FormData
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      // Aggiungiamo il file di copertina se presente
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // Invia i dati del post al backend
      await createPost(formData);
      // Naviga alla rotta della home dopo la creazione del post
      navigate("/home");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
    navigate("/home");
  };

  // Template del componente
  return (
    <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="container max-w-4xl mx-auto my-8  text-[#000000] rounded-lg shadow-xl overflow-hidden bg-transparent"
  >
    <h1 className="text-3xl text-center py-6 italic text-red-600 font-semibold animate-pulse">New Post</h1>
    <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
      <div className="flex space-x-4">
        {/* Campo per il titolo */}
        <div className="flex-1">
          <label className="block text-[#DFD0B8] text-sm font-bold mb-2" htmlFor="title">Title</label>
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

        {/* Campo per la categoria (menu a tendina) */}
        <div className="w-1/3">
          <label className="block text-[#DFD0B8] text-sm font-bold mb-2" htmlFor="category">Category</label>
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
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Campo per l'email dell'autore */}
      <div>
        <label className="block text-[#DFD0B8] text-sm font-bold mb-2" htmlFor="author">Author email</label>
        <input
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8]"
          type="email"
          id="author"
          name="author"
          value={post.author}
          onChange={handleChange}
        />
      </div>

      {/* Campo per l'upload del file di copertina */}
      <div>
        <label className="block text-[#DFD0B8] text-sm font-bold mb-2" htmlFor="cover">Cover Image</label>
        <input
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8]"
          type="file"
          id="cover"
          name="cover"
          onChange={handleFileChange}
          required
        />
      </div>

      {/* Campo per il contenuto HTML */}
      <div>
        <label className="block text-[#DFD0B8] text-sm font-bold mb-2" htmlFor="content">Content</label>
        <textarea
          className="w-full p-2 border border-gray-400 rounded h-32 focus:outline-none focus:border-[#DFD0B8]"
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          required
        />
      </div>

      {/* Campo per il tempo di lettura */}
      <div>
        <label className="block text-[#DFD0B8] text-sm font-bold mb-2" htmlFor="readTimeValue">Read time (minutes)</label>
        <input
          className="w-32 p-2 border border-gray-400 rounded focus:outline-none focus:border-[#DFD0B8]"
          type="number"
          id="readTimeValue"
          name="readTimeValue"
          value={post.readTime.value}
          onChange={handleChange}
          required
        />
      </div>

      {/* Pulsante di invio */}
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
