import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getPosts } from "../services/api";
import { motion } from "framer-motion"; // Importa motion per animazioni

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function Login() {
  // Stato per memorizzare i dati login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    // Effetto per gestire il token presente nell'URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Se è presente un token nell'URL, salvalo nel localStorage e naviga alla home page
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("storage"));
      navigate("/home");
    }
  }, [navigate]); // Esegui l'effetto quando cambia navigate

  // Gestore per il cambiamento degli input del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Aggiorna lo stato del form
  };

  // Gestore per l'invio del login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form
    try {
      const response = await loginUser(formData); // Effettua il login
      localStorage.setItem("token", response.token); // Salva il token nel localStorage
      window.dispatchEvent(new Event("storage"));
      alert("Login effettuato con successo!");

      // Recupera i post dopo il login
      try {
        const postsResponse = await getPosts();
        console.log("Post recuperati dopo il login:", postsResponse.data); // Stampa i post recuperati nella console
      } catch (error) {
        console.error("Errore nel recupero dei post dopo il login:", error);
      }

      navigate("/home"); // Naviga alla home page
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga eventuali errori durante il login
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };

  // Gestore per il login con Google
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Rendering del componente
  return (
    <section className="bg-[linear-gradient(to_bottom,#153448,#DFD0B8)] dark:bg-gray-900 dark:bg-gradient-to-r from-black to-gray-600">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account yet?
              <button
                onClick={() => navigate("/register")}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1"
              >
                Sign up
              </button>
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in with Google
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
