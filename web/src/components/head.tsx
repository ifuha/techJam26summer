import { Icon } from "./icons/icon";

export function Head() {
  return (
    <div className="w-full bg-[#FAF9F6] flex items-center justify-between px-4 py-3">
      <div className="cursor-pointer">
        <Icon name="menu" size={22} />
      </div>
      <div className="text-[20px] text-black">Logo</div>
      <div className="cursor-pointer">
        <Icon name="bell" size={22} />
      </div>
    </div>
  );
}
