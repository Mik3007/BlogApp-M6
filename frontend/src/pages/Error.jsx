import { useNavigate } from "react-router-dom";

export default function Error() {
    let navigate = useNavigate();
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center font-bold text-red-600 text-4xl sm:text-5xl md:text-6xl mb-8">
          Hai Sbagliato a Cercare
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl mb-8 text-center max-w-md">
          Ops! Non ti perdere...
        </p>
        <button 
          type="button" 
          onClick={() => navigate("/home")} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Torna alla Home
        </button>
      </div>
    );
  }