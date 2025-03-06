import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

function AccountPage() {
  const { userId } = useParams<{ userId: string }>();
  const [balance, setBalance] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  let navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  const name = localStorage.getItem("userName");
  const firstUpperCaseName = name ? name.charAt(0).toLocaleUpperCase() + name.slice(1) : "User";

  useEffect(() => {
    fetchAccountBalance();
  }, [userId]);

  // Hämta saldo
  const fetchAccountBalance = async () => {
    try {
      const sessionToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!sessionToken || !userId) {
        throw new Error("No session token or user ID");
      }

      const response = await fetch(`http://localhost:3000/account/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.amount);
        setTimeout(() => {
          loginContext?.logOut();
          localStorage.clear();
          navigate("/login");
        }, 120000);
      } else {
        setError("Kunde inte hämta saldo");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Ett fel uppstod vid hämtning av konto.");
    }
  };

  // Lägga in pengar
  const depositMoney = async () => {
    try {
      const sessionToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!sessionToken || !userId) {
        throw new Error("No session token or user ID");
      }

      const response = await fetch(`http://localhost:3000/account/${userId}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          userId: userId,
          amount: depositAmount,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`${data.message}`);
        setDepositAmount(0);
        fetchAccountBalance();
      } else {
        alert(data.error);
        setDepositAmount(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 className="mb-10 text-3xl">Konto för {firstUpperCaseName} </h1>
      <div className="flex flex-col gap-5 text-lg">
        <p>
          <span>Saldo:</span> {balance} SEK
        </p>

        <div className="bg-stone-200 flex flex-col gap-10 p-5 rounded-md">
          <h2 className="text-2xl">Insättning:</h2>
          <div>
            <label htmlFor="depositAmount">Belopp (SEK):</label>
            <input
              type="number"
              id="depositAmount"
              placeholder="0"
              value={depositAmount === 0 ? "" : depositAmount}
              onChange={(e) => {
                const value = e.target.value;
                setDepositAmount(value === "" ? 0 : parseFloat(value));
              }}
              className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <button
            onClick={depositMoney}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-3"
          >
            Sätt in
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
