"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fallbackUrl =
        typeof window !== "undefined"
          ? `${window.location.protocol}//${window.location.hostname}:5000`
          : process.env.NEXT_PUBLIC_API_BASE;

      const API = process.env.NEXT_PUBLIC_API_BASE;

      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Email atau password salah!");
        return;
      }

      const data = await res.json();
      if (data?.token) {
        // Simpan token ke localStorage agar bisa digunakan untuk auth
        localStorage.setItem("admin_token", data.token);
        // Set cookie admin_id agar middleware bisa cek auth
        document.cookie = `admin_id=${data.token}; path=/; max-age=86400; samesite=lax`;
        router.push("/admin/dashboard");
      } else {
        alert("Login gagal: token tidak diterima dari server.");
      }
    } catch (err) {
      console.error("Login admin gagal", err);
      alert("Tidak bisa terhubung ke backend. Pastikan backend jalan dan CORS mengizinkan origin ini.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/Background.png')]">
      <div className="bg-white/95 p-10 rounded-3xl shadow-xl w-full max-w-[520px] text-center">

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Masuk sebagai Admin
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 rounded-full px-4 py-3 border text-gray-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 rounded-full px-4 py-3 border text-gray-700"
          />

          <button
            type="submit"
            className="w-full bg-[#FFF000] text-gray-900 font-bold py-3 rounded-full hover:bg-[#f7ca00] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}