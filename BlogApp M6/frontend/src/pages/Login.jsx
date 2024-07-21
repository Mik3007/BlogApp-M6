import { useState, useEffect } from "react"; // Importa il hook useState da React per gestire lo stato
import { useNavigate, useLocation } from "react-router-dom"; // Importa useNavigate da react-router-dom per navigare programmaticamente
import { loginUser, getPosts } from "../services/api"; // Importa la funzione API per effettuare il login
import { motion } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "", // Stato iniziale del campo email
    password: "", // Stato iniziale del campo password
  });
  const navigate = useNavigate(); // Inizializza il navigatore per cambiare pagina
  const location = useLocation(); // Per accedere ai parametri dell'URL corrente

  useEffect(() => {
    // Questo effect viene eseguito dopo il rendering del componente
    // e ogni volta che location o navigate cambiano

    // Estraiamo i parametri dall'URL
    const params = new URLSearchParams(location.search);
    // Cerchiamo un parametro 'token' nell'URL
    const token = params.get("token");

    if (token) {
      console.log("Token ricevuto:", token);
      // Se troviamo un token, lo salviamo nel localStorage
      localStorage.setItem("token", token);
      // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
      window.dispatchEvent(new Event("storage"));
      // Navighiamo alla home page
      navigate("/home");
    }
  }, [location, navigate]); // Questo effect dipende da location e navigate

  // Gestore del cambiamento degli input del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Aggiorna lo stato del form con i valori degli input
  };

  // Gestore dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      const response = await loginUser(formData); // Chiama la funzione loginUser per autenticare l'utente
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      console.log("Token salvato dopo il login:", response.token);
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      alert("Login effettuato con successo!"); // Mostra un messaggio di successo
      try {
        const postsResponse = await getPosts();
        console.log("Post recuperati dopo il login:", postsResponse.data);
      } catch (error) {
        console.error("Errore nel recupero dei post dopo il login:", error);
      }
      navigate("/home"); // Naviga alla pagina principale
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };

  const handleGoogleLogin = () => {
    // Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione Google
    window.location.href = "http://localhost:3001/api/auth/google";
  };

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
