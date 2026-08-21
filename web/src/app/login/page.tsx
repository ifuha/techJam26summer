"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { setToken } from "@/lib/utils/access-token";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    login({ email, password })
      .then((result) => {
        setToken(result.token);
        router.push("/");
      })
      .catch((err) => setError(err.message ?? "ログインに失敗しました"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="border rounded p-2"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="border rounded p-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded p-2 disabled:opacity-50"
        >
          ログイン
        </button>
      </form>
      <div className="mt-4 text-sm flex flex-col gap-1">
        <Link href="/register/common" className="underline">
          一般ユーザーとして新規登録
        </Link>
        <Link href="/register/job" className="underline">
          継承者として新規登録
        </Link>
      </div>
    </div>
  );
};

export default Login;
