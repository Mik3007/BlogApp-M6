// Importa i componenti necessari da react-router-dom per gestire il routing
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importa i componenti personalizzati dell'applicazione
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";

// Importa il file CSS per gli stili dell'App
import MyFooter from "./components/MyFooter";
import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";

// Definisce il componente principale App
function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  return (
    // Router avvolge l'intera applicazione, abilitando il routing
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar è renderizzato in tutte le pagine */}
        <Navbar setPosts={setPosts} setFilteredPosts={setFilteredPosts} />

        {/* Il tag main contiene il contenuto principale che cambia in base al routing */}
        <main className="flex-grow mb-24">
          {/* Routes definisce le diverse rotte dell'applicazione */}
          <Routes>
            {/* rotta per la registrazione dell'utente */}
            <Route path="/register" element={<Register />} />

            {/* rotta per il login utente */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* Route per la home page */}
            <Route
              path="/home"
              element={<Home posts={filteredPosts} setPosts={setPosts} />}
            />

            {/* Route per la pagina di creazione di un nuovo post */}
            <Route path="/create" element={<CreatePost />} />

            {/* Route per la pagina di dettaglio di un post
                :id è un parametro dinamico che rappresenta l'ID del post */}
            <Route path="/post/:id" element={<PostDetail />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </main>
      </div>
      <MyFooter />
    </Router>
  );
}

// Esporta il componente App come default per essere utilizzato in altri file
export default App;
