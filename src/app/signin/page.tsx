"use client";

import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebaseConfig";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userEmail) {
      router.push("/");
    }
  }, [userEmail, router]);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUserEmail(userCredential.user.email);

      setError("");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserEmail(null);
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {userEmail ? (
        <>
          <p>Signed in as: {userEmail}</p>
          <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1 rounded">
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h2>Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mt-2"
          />
          <br />
          <button onClick={handleSignIn} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
            Sign In
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
