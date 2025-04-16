'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseConfig"; // Ensure your alias is configured
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<null | object>(null);
  const router = useRouter();

  // Listen for authentication state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);// Redirect after sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-6">
        Motor Part Shop Software
      </h1>
      <h2 className="text-4xl font-bold text-cyan-900 mb-8">Select User</h2>
      <div className="flex space-x-6">
        <Link href="/accountant">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Accountant
          </button>
        </Link>
        <Link href="/shop-owner">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
            Shop Owner
          </button>
        </Link>
      </div>
      {user ? (
        <button
          onClick={handleSignOut}
          className="px-4 py-1 my-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      ) : (
        <Link href="/signin">
          <button className="px-4 py-1 my-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-800 transition">
            Sign In
          </button>
        </Link>
      )}
    </div>
  );
}
