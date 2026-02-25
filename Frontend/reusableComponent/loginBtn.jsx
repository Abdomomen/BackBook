"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useToken } from "../context.jsx";

export default function LoginBtn({ email, password }) {
  const { token, setToken } = useToken();
  const router = useRouter();
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        toast.error("Please fill all the fields");
        return;
      }

      const loginPromise = fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      toast.promise(loginPromise, {
        loading: "Signing in...",
        success: (res) => {
          if (!res.ok) throw new Error("Invalid credentials");
          return "Welcome back!";
        },
        error: (err) => err.message || "Login failed",
      });

      const res = await loginPromise;
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        router.push("/main");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all transform duration-150"
      onClick={() => {
        login(email, password);
      }}
    >
      Sign In
    </button>
  );
}
