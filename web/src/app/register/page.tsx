"use client";

import Link from "next/link";
import { Icon } from "@/components/icons/icon";

const RegisterSelect = () => {
  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <div className="max-w-sm mx-auto px-4 pt-10 pb-16">
        <div className="text-center text-[16px] font-bold text-[#000000]">
          新規登録
        </div>

        <div className="mt-8 text-center text-[20px] font-bold text-[#000000] leading-snug">
          アカウントの種類を
          <br />
          選択してください
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/register/common"
            className="flex items-center justify-between rounded-lg border-2 border-[#5E7231] bg-[#F3F5EB] p-4 cursor-pointer"
          >
            <div>
              <div className="text-[16px] font-bold text-[#000000]">
                一般として登録
              </div>
              <div className="mt-1 text-[12px] text-gray-500">
                継承者を応援したり、
                <br />
                工芸の情報を受け取る方
              </div>
            </div>
            <div className="text-[#000000] shrink-0">
              <Icon name="chevron-right" size={20} />
            </div>
          </Link>

          <Link
            href="/register/job"
            className="flex items-center justify-between rounded-lg border-2 border-[#171717] bg-white p-4 cursor-pointer"
          >
            <div>
              <div className="text-[16px] font-bold text-[#000000]">
                継承者として登録
              </div>
              <div className="mt-1 text-[12px] text-gray-500">
                工芸の作り手・伝統を受け継ぎ、
                <br />
                活動している方
              </div>
            </div>
            <div className="text-[#000000] shrink-0">
              <Icon name="chevron-right" size={20} />
            </div>
          </Link>
        </div>

        <div className="mt-6 flex justify-center text-[13px]">
          <Link href="/login" className="text-[#5E7231] underline">
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelect;
