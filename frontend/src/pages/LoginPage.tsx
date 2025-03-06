// Importera nödvändiga hooks och komponenter från React och React Router
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

// Definiera LoginPage-komponenten
function LoginPage() {
  // Definiera state-variabler för användarnamn och lösenord
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Hämta login-kontexten
  const loginContext = useContext(LoginContext);

  // Initiera navigate-funktionen från React Router
  let navigate = useNavigate();

  // Definiera handleLogin-funktionen för att hantera formulärets inskickning
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Förhindra standardbeteendet för formulärinskickning

    try {
      // Skicka en POST-förfrågan till login-endpointen med användarnamn och lösenord
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Loggas nu in som: ${username}`);

        // Spara token, användar-ID och användarnamn i localStorage
        localStorage.setItem("token", data.newSession.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.username);

        // Navigera till konto-sidan
        loginContext?.logIn();
        navigate(`/account/${data.user.id}`);
      } else {
        alert("Login NOT successful");
        throw new Error("Wrong username or password");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 className="mb-10 text-3xl">Logga in</h1>
      <form className="space-y-6" autoComplete="off">
        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
          Användarnamn:
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </label>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          Lösenord:
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </label>
        <button
          onClick={handleLogin}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
