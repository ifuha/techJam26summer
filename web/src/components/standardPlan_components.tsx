import { Icon } from "@/components/icons/icon"

export function StandardPlan(){
    return(
        <div
        className="min-h-screen w-full"
        >
            <div
            className="w-full max-w-sm border border-[#BBBBBB] rounded-md bg-[#FFFFFF]"
            >
                <div
                className="mx-2.5 mt-2.5 mb-1.5 flex items-center"
                >
                    <div
                    className="mr-4.5 w-full max-w-15 aspect-square flex items-center justify-center  rounded-full bg-[#C9DAA5] shrink-0"
                    >
                        <Icon name="star" size={25}></Icon>
                    </div>

                    <div
                    className="mr-7.75"
                    >
                        <p
                        className="text-[#000000] text-[18px] font-bold"
                        >
                            スタンダードプラン
                        </p>
                        <p
                        className="text-[#5E7231] text-[14px] font-bold"
                        >
                            月額 1000円
                        </p>
                        <p
                        className="text-[#000000] text-[12px]"
                        >
                            テキストが入ります。テキストが入ります。
                        </p>
                    </div>
                    
                    <input
                    type="radio"
                    name="plan"
                    value="light"
                    ></input>
                </div>
                <div
                className="mx-2.5 mb-2.5 rounded-[5px] bg-[#C9DAA5]"
                >
                    <div
                    className="mx-3.75 my-1.75 gap-1.5"
                    >
                        <p
                        className="mb-1.5 text-[#5E7231] text-[14px]"
                        >
                            特典
                        </p>
                        <div
                        className="mb-1 flex"
                        >
                            <div
                            className="mr-[1.5px] w-full max-w-3.5 h-auto max-h-3.5 flex items-center justify-center  rounded-full bg-[#5E7231] shrink-0"
                            >
                                <Icon name="check" size={6}></Icon>
                            </div>

                            <p
                            className="text-[#000000] text-[12px]"
                            >
                                活動記録の閲覧(限定コンテンツ含む)
                            </p>
                        </div>

                        <div
                        className="flex"
                        >
                            <div
                            className="mr-[1.5px] w-full max-w-3.5 h-auto max-h-3.5 flex items-center justify-center  rounded-full bg-[#5E7231] shrink-0"
                            >
                                <Icon name="check" size={6}></Icon>
                            </div>

                            <p
                            className="text-[#000000] text-[12px]"
                            >
                                テキストが入ります。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}