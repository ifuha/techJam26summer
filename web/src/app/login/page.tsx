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
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <div className="max-w-sm mx-auto px-4 pt-10 pb-16">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
        </div>

        <div className="mt-6 text-[20px] font-bold text-[#000000]">ログイン</div>
        <p className="mt-1 text-[13px] text-gray-500">
          メールアドレスとパスワードを入力してください。
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.25">
          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              メールアドレス
            </div>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>

          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              パスワード
            </div>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded-full bg-[#5E7231] text-white text-[14px] font-bold disabled:opacity-50"
          >
            ログイン
          </button>
        </form>

        <div className="mt-6 flex justify-center text-[13px]">
          <Link href="/register" className="text-[#5E7231] underline">
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
