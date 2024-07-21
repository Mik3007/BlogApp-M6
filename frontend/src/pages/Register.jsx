import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { motion } from "framer-motion";

export default function Register() {
  // Stato per il file dell'avatar
  const [avatarFile, setAvatarFile] = useState(null);

  // Stato per i dati del form
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
  });

  const navigate = useNavigate();

  // Gestisce il cambio del file avatar
  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  // Gestisce il cambio dei campi del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestisce l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crea un oggetto FormData per inviare i dati
      const formDataToSend = new FormData();

      // Aggiunge i campi del form al FormData
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Aggiunge il file avatar se presente
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      // Invia i dati di registrazione
      await registerUser(formDataToSend);
      alert("Registrazione avvenuta con successo!");
      navigate("/");
    } catch (error) {
      alert("Errore durante la registrazione. Riprova.");
    }
  };

  return (
    <section className="bg-[linear-gradient(to_bottom,#153448,#DFD0B8)] dark:bg-gray-900 dark:bg-gradient-to-r from-black to-gray-600">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-600 dark:border-gray-700"
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full">
                  <label
                    htmlFor="nome"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="cognome"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="cognome"
                    id="cognome"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="surname"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full">
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
                <div className="w-full">
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
              </div>
              <div className="flex flex-col">
                <div className="w-full">
                  <label
                    htmlFor="dataDiNascita"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dataDiNascita"
                    id="dataDiNascita"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="avatar"
                    className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="border-2 border-gray-700 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign up
              </button>
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1 hover:text-red-600"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
