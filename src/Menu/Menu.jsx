import React, { useState, useEffect, useRef } from "react";
import "./menu.css";
import axios from "axios";
import Person_icon from "../assets/person.svg";

const Menu = ({ setView }) => {
  const [isLogIn, setIsLogIn] = useState(() => {
    const savedLogInStatus = localStorage.getItem("isLogIn");
    return savedLogInStatus === "true";
  });
  const [showReg, setShowReg] = useState(false);
  const [correctPassword, setCorrectPassword] = useState(false);
  const [response, setResponse] = useState("");
  const [isRegistered, setIsRegistered] = useState(true);
  const [users, setUsers] = useState([]);
  const [view, setview] = useState("");

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const conPasswordInputRef = useRef();

  // Datenabruf beim Mounten der Komponente
  useEffect(() => {
    axios
      .get("http://localhost:5000/get_users")
      .then((response) => {
        setUsers(response.data.data);
        console.log("Users loaded:", response.data.data);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der User!", err);
      });
  }, []); // Leer: Nur einmal beim Mount ausgeführt

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Eingabewerte abrufen
    const name = nameInputRef.current?.value || "";
    const email = emailInputRef.current?.value || "";
    const password = passwordInputRef.current?.value || "";
    const confirmPassword = conPasswordInputRef.current?.value || "";

    if (isRegistered) {
      const foundUser = users.some((item) => item.name === name);
      const currentUser = users.find((item) => item.name === name);
      if (foundUser && currentUser.password === password) {
        localStorage.setItem("isLogIn", true);
        setResponse("Erfolgreich angemeldet!");
        setCorrectPassword(true);
      } else {
        setResponse("Bitte überprüfen sie ihre Anmeldedaten!");
        setCorrectPassword(false);
      }
    } else {
      // neuen Nutzer vorbereiten
      const newUser = { name, email, password };

      if (password === confirmPassword) {
        try {
          const response = await axios.post(
            "http://localhost:5000/add_user",
            newUser
          );
          console.log(response.data.message);
          setResponse("Success!");
          setCorrectPassword(true);
          setIsRegistered(true);
        } catch (error) {
          console.error("Fehler beim Hinzufügen!", error);
          setResponse("Fehler bei der Registration!");
          setCorrectPassword(false);
        }
      } else {
        setResponse("Bitte überprüfe dein Passwort!");
        setCorrectPassword(false);
      }
    }
  };

  useEffect(() => {
    setResponse("");
    nameInputRef.current && (nameInputRef.current.value = "");
    emailInputRef.current && (emailInputRef.current.value = "");
    passwordInputRef.current && (passwordInputRef.current.value = "");
    conPasswordInputRef.current && (conPasswordInputRef.current.value = "");
  }, [isRegistered]);

  useEffect(() => {
    setIsLogIn(localStorage.getItem("isLogIn") === "true");
    console.log(isLogIn);
    if (showReg && isLogIn) {
      setView(view);
    }
  }, [showReg, isLogIn, setView, view]);

  return (
    <div>
      <div className="menu">
        <div className="menu-img">
          <img src={Person_icon} alt="" />
          <button
            className="logOutBtn"
            onClick={() => localStorage.setItem("isLogIn", false)}
          >
            Log Out
          </button>
        </div>
        <div id="jobMenu">
          <div
            onClick={() => {
              setShowReg(true);
              setview("orders");
            }}
            id="getJob"
          >
            Get Work
          </div>
          <div
            onClick={() => {
              setShowReg(true);
              setview("createOrder");
            }}
            id="giveJob"
          >
            Give Work
          </div>
        </div>
      </div>
      {showReg && !isLogIn && (
        <div id="regDialog">
          <div id="regDialog-content">
            <span className="close" onClick={() => setShowReg(false)}>
              &times;
            </span>
            <h3 style={{ marginBottom: 20 }} id="reg">
              {isRegistered ? "LogIn" : "Registration"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  ref={nameInputRef}
                  required
                />
              </div>
              {!isRegistered && (
                <div>
                  <label htmlFor="email">Email Adresse:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={emailInputRef}
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  ref={passwordInputRef}
                  required
                />
              </div>
              {!isRegistered && (
                <div>
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    ref={conPasswordInputRef}
                    required
                  />
                </div>
              )}
              <div>
                <button
                  type="button"
                  className="btnToA"
                  onClick={() => setIsRegistered(!isRegistered)}
                >
                  {isRegistered ? "Don't have an account yet" : "Back to LogIn"}
                </button>
                <button type="submit" className="btnSubmit">
                  {isRegistered ? "LogIn" : "Register"}
                </button>
                <p
                  style={{
                    color: correctPassword ? "green" : "red",
                  }}
                >
                  {response}
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
