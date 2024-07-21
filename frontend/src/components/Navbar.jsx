import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import { getPosts, getUserData } from "../services/api";
import { motion } from "framer-motion";
import { DarkThemeToggle } from "flowbite-react";

// Componente per visualizzare l'avatar dell'utente
function Avatar({ user }) {
  // Se l'utente ha un avatar, visualizzalo
  if (user?.avatar) {
    return (
      <img src={user.avatar} alt={user.nome} className="w-8 h-8 rounded-full" />
    );
  }

  // Se non c'è un avatar, mostra l'iniziale del nome dell'utente
  const iniziale = user?.nome ? user.nome[0].toUpperCase() : "?";
  return (
    <div className="w-8 h-8 rounded-full bg-[#DFD0B8] flex items-center justify-center text-[#153448] font-bold">
      {iniziale}
    </div>
  );
}

export default function Navbar({ setPosts, setFilteredPosts }) {
  // Stati per gestire l'autenticazione dell'utente e i dati relativi
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per verificare se l'utente è loggato
  const [user, setUser] = useState(null); // Stato per memorizzare i dati dell'utente
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); // Stato per il termine di ricerca
  const [allPosts, setAllPosts] = useState([]); // Stato per memorizzare tutti i post recuperati

  // Effetto per controllare lo stato di login e recuperare i dati dell'utente
  useEffect(() => {
    // Funzione per verificare se l'utente è loggato e recuperare i dati utente
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token"); // Ottieni il token dall'archivio locale
      setIsLoggedIn(!!token); // Imposta lo stato di login in base alla presenza del token

      if (token) {
        try {
          // Se l'utente è loggato, recupera i dati dell'utente e i post
          const userData = await getUserData();
          setUser(userData);
          fetchPosts(); // Recupera i post
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
        }
      } else {
        setUser(null); // Se non c'è token, l'utente non è loggato
      }
    };

    checkLoginStatus();

    // Aggiunge un listener per l'evento di storage per gestire il logout da altre finestre
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      // Rimuove il listener quando il componente viene smontato
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []); // L'effetto viene eseguito solo una volta al montaggio del componente

  // Funzione per gestire il logout dell'utente
  const handleLogout = () => {
    localStorage.removeItem("token"); // Rimuove il token dall'archivio locale
    setIsLoggedIn(false); // Imposta lo stato di login su falso
    setUser(null); // Rimuove i dati dell'utente
    navigate("/"); // Reindirizza alla home page
  };

  // Funzione per recuperare i post dal server
  const fetchPosts = async () => {
    try {
      const response = await getPosts(); // Richiede i post dal server
      setPosts(response.data); // Imposta i post nel contesto padre
      setFilteredPosts(response.data); // Imposta i post filtrati nel contesto padre
      setAllPosts(response.data); // Memorizza tutti i post
    } catch (error) {
      console.error("Errore nel recupero dei post:", error);
    }
  };

  // Effetto per filtrare i post in base al termine di ricerca
  useEffect(() => {
    if (search === "") {
      // Se non c'è termine di ricerca, mostra tutti i post
      setFilteredPosts(allPosts);
    } else {
      // Filtra i post in base al termine di ricerca
      setFilteredPosts(
        allPosts.filter((post) =>
          post.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, allPosts, setFilteredPosts]); // Effetto dipendente dai cambiamenti di ricerca e post

  // Funzione per gestire il cambiamento del termine di ricerca
  const handleSearch = (e) => setSearch(e.target.value);

  return (
    <nav className="bg-[#153448] text-[#DFD0B8] sticky top-0 z-50 dark:bg-gradient-to-r from-black to-gray-600">
      <div className="container mx-auto px-4 h-28 flex items-center justify-between">
        {/* Link per tornare alla home page */}
        <Link to="/home" className="flex items-center text-4xl">
          <img src="/pngwing.com(1).png" alt="" className="h-16 w-auto" />
          <span className="flex items-center">
            <HomeIcon className="text-[#DFD0B8] w-8 mx-2 dark:text-[#33FF33]" />{" "}
            Home
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* Campo di ricerca animato */}
              <motion.input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                initial={{ background: "#fff" }}
                whileFocus={{
                  background: [
                    "linear-gradient(to right, #A38D68 0%, #DFD0B8 50%, #F0E5D3 100%)",
                    "linear-gradient(to right, #DFD0B8 0%, #F0E5D3 50%, #A38D68 100%)",
                    "linear-gradient(to right, #F0E5D3 0%, #A38D68 50%, #DFD0B8 100%)",
                  ],
                }}
                animate={{ background: "#fff" }} // Colore di sfondo animato
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-64 md:w-80 h-10 rounded-md text-[#153448] focus:outline-none px-4 py-2 dark-search"
              />
              <div className="flex items-center space-x-4">
                {/* Mostra l'avatar dell'utente o un'icona se non è presente */}
                {user ? (
                  <Avatar user={user} />
                ) : (
                  <UserIcon className="w-8 h-8 text-[#DFD0B8]" />
                )}
                {/* Pulsante per il logout */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded dark:bg-[#33FF33]"
                >
                  Logout
                </button>
              </div>
              {/* Pulsante per attivare/disattivare il tema scuro */}
              <DarkThemeToggle className="rounded-full" />
            </>
          ) : (
            <div className="flex space-x-4">
              {/* Link per la pagina di login e registrazione */}
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Registrati
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
