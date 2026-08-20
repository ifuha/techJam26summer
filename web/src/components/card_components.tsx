import { Icon } from "./icons/icon"

export function Card(){
    return(
            <div
            className="min-h-screen w-full"
            >
                <div
                className="w-full max-w-sm p-4 bg-[#FAF9F6]"
                >
                <div
                className="flex gap-2"
                >
                    <div        //アバター
                    className="w-17.5 h-17.5"
                    >
                    </div>
                    <div
                    className="min-w-0"
                    >
                        <p
                        className="px-1.5 py-0.5 rounded-2xl border w-fit text-[9px] text-[#000000]"
                        >
                            陶磁器     {/* 工芸ジャンルtext */}
                        </p>
                        <p
                        className="text-[20px] font-bold text-[#000000]">
                            名前 名前
                        </p>
                        <div
                        className="flex"
                        >
                            <p
                            className="pt-1 pr-2 border-r text-[12px] text-[#000000]"
                            >
                                美濃焼
                            </p>
                            <p
                            className="pt-1 pl-2 text-[12px] text-[#000000]"
                            >
                                岐阜県 多治見市
                            </p>
                        </div>
                    </div>
                </div>
    
                <div
                className="flex my-3.25 justify-between"
                >
                    <div
                    className=""
                    >
                        <div
                        className="flex gap-4 pb-2.75 border-b"
                        >
                            <div
                            className="flex items-center">
                                <div
                                className="flex justify-center items-center"
                                >
    
                                <Icon name="group" size={15}></Icon>
                                <p
                                className="pr-2 text-[#000000] text-[11px]"
                                >
                                    修行歴
                                </p>
                                </div>
                                <p
                                className="text-[#000000] text-[11px]"
                                >
                                    3年2ヶ月{/* 修行歴text */}
                                </p>
                            </div>
    
                            <div
                            className="flex items-center shrink-0">
                                <Icon name="heart" size={12}></Icon>
                                <p
                                className="pr-2 text-[#000000] text-[11px]"
                                >
                                    応援数
                                </p>
                                <p
                                className="text-[#000000] text-[11px]"
                                >
                                    120{/* 応援数text */}
                                </p>
                            </div>
                        </div>
                        <p
                        className=" mt-2.75 w-full max-w-54  text-[#000000] text-[11px]"
                        >
                            テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
                        </p>
                    </div>
    
                    <div
                    className="w-full max-w-31.75 h-full max-h-31.75"
                    >
                    </div>
                </div>
    
                <div
                className="flex justify-between"
                >
                    <button     //ボタンbutton
                    className="w-full max-w-41.25 h-10 rounded-sm border bg-[#FFFFFF] text-[#000000] text-[14px]"
                    >
                        詳細を見る
                    </button>
    
                    <button     //ボタンbutton
                    className="w-full max-w-41.25 h-10 rounded-sm bg-[#EE8978] text-[#FFFFFF] text-[14px]"
                    >
                        応援する
                    </button>
                </div>
                </div>
            </div>
        )
}