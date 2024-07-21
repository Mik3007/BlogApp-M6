import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import { getPosts, getUserData } from "../services/api";
import { motion } from "framer-motion";
import { DarkThemeToggle } from "flowbite-react";

// Componente per l'avatar dell'utente
function Avatar({ user }) {
  if (user?.avatar) {
    return (
      <img src={user.avatar} alt={user.nome} className="w-8 h-8 rounded-full" />
    );
  }
  const iniziale = user?.nome ? user.nome[0].toUpperCase() : "?";
  return (
    <div className="w-8 h-8 rounded-full bg-[#DFD0B8] flex items-center justify-center text-[#153448] font-bold">
      {iniziale}
    </div>
  );
}

export default function Navbar({ setPosts, setFilteredPosts }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allPosts, setAllPosts] = useState([]);

  // Effetto per controllare lo stato di login e recuperare i dati dell'utente
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (token) {
        try {
          const userData = await getUserData();
          setUser(userData);
          fetchPosts();
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Funzione per il logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  // Funzione per recuperare i post
  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
      setFilteredPosts(response.data);
      setAllPosts(response.data);
    } catch (error) {
      console.error("Errore nel recupero dei post:", error);
    }
  };

  // Effetto per filtrare i post in base alla ricerca
  useEffect(() => {
    if (search === "") {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(
        allPosts.filter((post) =>
          post.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, allPosts, setFilteredPosts]);

  // Funzione per gestire la ricerca
  const handleSearch = (e) => setSearch(e.target.value);

  return (
    <nav className="bg-[#153448] text-[#DFD0B8] sticky top-0 z-50 dark:bg-gradient-to-r from-black to-gray-600">
      <div className="container mx-auto px-4 h-28 flex items-center justify-between">
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
                animate={{ background: "#fff" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-64 md:w-80 h-10 rounded-md text-[#153448] focus:outline-none px-4 py-2 dark-search"
              />
              <div className="flex items-center space-x-4">
                {user ? (
                  <Avatar user={user} />
                ) : (
                  <UserIcon className="w-8 h-8 text-[#DFD0B8]" />
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded dark:bg-[#33FF33]"
                >
                  Logout
                </button>
              </div>
              <DarkThemeToggle className="rounded-full" />
            </>
          ) : (
            <div className="flex space-x-4">
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
