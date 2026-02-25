"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export default function TokenProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNewAccessToken = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/users/refresh-token",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (res.ok) {
          const data = await res.json();
          setToken(data.token);

          // Fetch user details immediately after getting token
          const userRes = await fetch("http://localhost:3000/api/users/me", {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData.user);
          }
        }
      } catch (err) {
        console.log("not logged in");
      } finally {
        setLoading(false);
      }
    };

    getNewAccessToken();
  }, []);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useToken = () => useContext(AppContext);
