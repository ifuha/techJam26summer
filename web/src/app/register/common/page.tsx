"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api";
import { setToken } from "@/lib/utils/access-token";
import { PREFECTURES } from "@/lib/utils/prefectures";

const RegisterCommon = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    register({
      name,
      email,
      password,
      jobOrCommonMan: false,
      avatar: null,
      address: address || null,
      prefecture: prefecture || null,
      productName: null,
    })
      .then((result) => {
        setToken(result.token);
        router.push("/");
      })
      .catch((err) => setError(err.message ?? "登録に失敗しました"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">一般ユーザー新規登録</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="border rounded p-2"
        />
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
        <select
          value={prefecture}
          onChange={(event) => setPrefecture(event.target.value)}
          className="border rounded p-2"
        >
          <option value="">都道府県(任意)</option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="住所(任意)"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="border rounded p-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded p-2 disabled:opacity-50"
        >
          登録する
        </button>
      </form>
      <div className="mt-4 text-sm">
        <Link href="/login" className="underline">
          ログインはこちら
        </Link>
      </div>
    </div>
  );
};

export default RegisterCommon;
