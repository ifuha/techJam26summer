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
      bio: null,
    })
      .then((result) => {
        setToken(result.token);
        router.push("/");
      })
      .catch((err) => setError(err.message ?? "登録に失敗しました"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <div className="max-w-sm mx-auto px-4 pt-10 pb-16">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
        </div>

        <div className="mt-6 text-[20px] font-bold text-[#000000]">
          一般ユーザー新規登録
        </div>
        <p className="mt-1 text-[13px] text-gray-500">
          伝統工芸の継承者を応援する側として登録します。
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.25">
          <div>
            <div className="text-[13px] font-bold text-[#000000]">名前</div>
            <input
              type="text"
              placeholder="名前"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>

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

          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              都道府県(任意)
            </div>
            <select
              value={prefecture}
              onChange={(event) => setPrefecture(event.target.value)}
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            >
              <option value="">選択されていません</option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              住所(任意)
            </div>
            <input
              type="text"
              placeholder="住所"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded-full bg-[#5E7231] text-white text-[14px] font-bold disabled:opacity-50"
          >
            登録する
          </button>
        </form>

        <div className="mt-6 flex justify-center text-[13px]">
          <Link href="/login" className="text-[#5E7231] underline">
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterCommon;
