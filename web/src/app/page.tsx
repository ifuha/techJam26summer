"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Head } from "@/components/head";
import { getUserId } from "@/lib/utils/access-token";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getUserId() !== null);
  }, []);

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <div className="w-full fixed z-20 top-0">
        <Head />
      </div>
      <span className="h-13.5 block" />
      <div className="px-4 pt-10 pb-8">
        <div className="relative z-10">
          <div className="w-fit px-3 py-1 rounded-full bg-[#5E7231] text-white text-[12px]">
            日本各地の伝統工芸・後継者を探す
          </div>

          <div className="mt-3 text-[26px] font-bold leading-tight text-[#000000]">
            地域から見つける、
            <br />
            未来の担い手。
          </div>

          <Link
            href="/search"
            className="mt-2 block text-[13px] leading-relaxed text-[#000000] w-fit"
          >
            伝統の技を受け継ぎ、
            <br />
            未来へつなぐ人たちがいます。
          </Link>
        </div>

        <Link
          href="/search"
          className="relative z-0 -mt-32 pt-5 block w-full max-w-107.5 mx-auto aspect-375/470"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/japan-map.svg"
            alt="日本地図"
            className="w-full h-full object-contain"
          />
        </Link>

        <Link
          href="/search"
          className="mt-4 flex items-center justify-center gap-1.5 w-full py-3.5 rounded-full bg-[#F47A65] text-white text-[15px] font-bold"
        >
          継承者を探してみる
          <span className="inline-block text-[20px] leading-none animate-arrow-bounce">
            →
          </span>
        </Link>

        {!isLoggedIn && (
          <div className="mt-4 flex justify-center text-[13px]">
            <Link href="/login" className="text-[#000000] underline">
              ログイン・新規登録
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
