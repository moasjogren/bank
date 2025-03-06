import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const loginContext = useContext(LoginContext);
  let navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    loginContext?.logOut();
    navigate("/");
  };

  if (!loginContext) {
    return null;
  }

  const { isLoggedIn } = loginContext;
  const userId = localStorage.getItem("userId");

  return (
    <nav>
      <ul className="flex justify-between list-none gap-5">
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/signup">Registrera dig</Link>
            </li>
            <li>
              <Link to="/login">Logga in</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to={`/account/${userId}`}>{userId && userId.length <= 13 ? "Mitt konto" : " "}</Link>
            </li>
            <li>
              <button onClick={logOut}>Logga ut</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
