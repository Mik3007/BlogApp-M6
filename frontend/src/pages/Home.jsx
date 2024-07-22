import { useEffect } from "react";
// Importa Link e useLocation da react-router-dom per la navigazione e l'accesso alla posizione corrente
import { Link, useLocation } from "react-router-dom";
import { getPosts } from "../services/api";
// Importa motion per animazioni da framer-motion
import { motion } from "framer-motion";

// Varianti animazione frameMotion
const heroVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Varianti animazione frameMotion
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

// Componente per visualizzare una card del post
function PostCard({ post }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.1 }}
      className="w-full"
    >
      <Link
        to={`/post/${post._id}`}
        className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-400 h-full hover:scale-[1.1] hover:duration-700"
      >
        <img
          src={post.cover}
          alt={post.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2
            className="text-2xl font-semibold mb-3 truncate"
            title={post.title}
          >
            {post.title}
          </h2>
          <p
            className="text-gray-600 truncate"
            title={`Autore: ${post.author}`}
          >
            Autore: {post.author}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home({ posts, setPosts }) {
  const location = useLocation();
  // Effetto per recuperare i post quando il componente viene montato
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Recupera tutti i post dal backend
        const response = await getPosts();
        // Aggiorna lo stato con i dati dei post
        setPosts(response.data);
      } catch (error) {
        // Logga eventuali errori nella console
        console.error("Errore nella fetch dei post:", error);
      }
    };
    fetchPosts();
  }, [location, setPosts]);

  // Rendering del componente
  return (
    <div className="font-serif min-h-screen">
      <motion.div
        className="bg-gradient-to-b from-[#153448] to-[#DFD0B8] dark:bg-gradient-to-r dark:from-black dark:to-gray-600 py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold italic mb-4 sm:mb-6 text-white dark:text-white">
            Blog App
          </h1>
          <h3 className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white dark:text-white">
            "Connect, share, inspire. Add your post to our collection of ideas."
          </h3>
          <Link
            to="/create"
            className="inline-block border-2 py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-[#153448] text-white transition duration-300 hover:bg-[#0f2430] dark:bg-green-600 dark:hover:bg-[#33FF33] dark:text-black text-sm sm:text-base"
          >
            Add Post
          </Link>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {posts.map((post) => (
            <div key={post._id} className="flex justify-center">
              <div className="w-full">
                <PostCard post={post} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
