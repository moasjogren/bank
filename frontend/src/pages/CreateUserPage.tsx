import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  interface User {
    username: string;
    password: string;
  }

  interface Account {
    amount: number;
  }

  interface ResponseData {
    user: User;
    account: Account;
  }

  const handleSignUp = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users", {
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
        const data: ResponseData = await response.json();
        console.log(data);
        alert(`Användare och bankkonto skapat`);
        navigate("/login");
      } else {
        throw new Error("Fel användarnamn eller lösenord");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 className="mb-10 text-3xl">Registrera dig</h1>
      <form className="space-y-6">
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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
          />
        </label>
        <button
          onClick={handleSignUp}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Skapa användare
        </button>
      </form>
    </div>
  );
}

export default CreateUserPage;
