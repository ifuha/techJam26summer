"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCraft, getCrafts, register } from "@/lib/api";
import { setToken } from "@/lib/utils/access-token";
import { PREFECTURES } from "@/lib/utils/prefectures";

const OTHER_ADDRESS = "__other__";

const RegisterJob = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [address, setAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [bio, setBio] = useState("");
  const [productionAreas, setProductionAreas] = useState<string[]>([]);
  const [addressChoice, setAddressChoice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // When ProductName+Prefecture match an existing Craft, narrow the address
  // field to that craft's known production areas — this is exactly what the
  // backend now requires for auto-linking (ProductName+Prefecture alone was
  // matching e.g. 岐阜県高山市美濃焼 to the 多治見市 craft; now we only
  // auto-link when the city is one of the craft's ProductionAreas).
  useEffect(() => {
    if (!productName || !prefecture) {
      setProductionAreas([]);
      return;
    }
    let cancelled = false;
    getCrafts()
      .then((crafts) => {
        const match = crafts.find(
          (c) => c.productName === productName && c.prefecture === prefecture,
        );
        if (!match) return null;
        return getCraft(match.craftId);
      })
      .then((detail) => {
        if (cancelled) return;
        setProductionAreas(detail?.productionAreas ?? []);
      })
      .catch((err) => console.error("Failed to load craft:", err));
    return () => {
      cancelled = true;
    };
  }, [productName, prefecture]);

  useEffect(() => {
    setAddressChoice("");
    setAddress("");
  }, [productionAreas]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    register({
      name,
      email,
      password,
      jobOrCommonMan: true,
      avatar: null,
      address: address || null,
      prefecture: prefecture || null,
      productName: productName || null,
      bio: bio || null,
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
        <div className="text-center text-[20px] text-black">Logo</div>

        <div className="mt-6 text-[20px] font-bold text-[#000000]">
          継承者新規登録
        </div>
        <p className="mt-1 text-[13px] text-gray-500">
          伝統工芸の継承者として登録し、活動を発信します。
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
              伝統工芸品名
            </div>
            <input
              type="text"
              placeholder="例: 美濃焼"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>

          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              都道府県
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
            <div className="text-[13px] font-bold text-[#000000]">住所</div>
            {productionAreas.length > 0 ? (
              <>
                <select
                  value={addressChoice}
                  onChange={(event) => {
                    const value = event.target.value;
                    setAddressChoice(value);
                    setAddress(value === OTHER_ADDRESS ? "" : value);
                  }}
                  className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
                >
                  <option value="">住所(市区町村)を選択</option>
                  {productionAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                  <option value={OTHER_ADDRESS}>その他(自分で入力)</option>
                </select>
                {addressChoice === OTHER_ADDRESS && (
                  <input
                    type="text"
                    placeholder="住所(市区町村など)"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="mt-2 w-full border rounded-sm p-2 text-[14px] text-black"
                  />
                )}
                <p className="mt-1 text-[11px] text-gray-500">
                  {productName}は
                  {PREFECTURES.includes(prefecture as (typeof PREFECTURES)[number])
                    ? prefecture
                    : ""}
                  の中でも{productionAreas.join("・")}
                  が主な産地です。それ以外の市区町村を選ぶと、地図上ではこの伝統工芸に自動では紐付きません。
                </p>
              </>
            ) : (
              <input
                type="text"
                placeholder="住所(市区町村など)"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
              />
            )}
          </div>

          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              自己紹介・活動内容
            </div>
            <textarea
              placeholder="自己紹介・活動内容を入力してください。"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
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

export default RegisterJob;
