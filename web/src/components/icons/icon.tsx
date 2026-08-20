import { Group } from "./svg/group";
import { Heart } from "./svg/heart";
import { Menu } from "./svg/menu";
import { Bell } from "./svg/bell";
import { ChevronRight } from "./svg/chevron-right";
import { Home } from "./svg/home";
import { Search } from "./svg/search";
import { Bookmark } from "./svg/bookmark";
import { Settings } from "./svg/settings";
import { Help } from "./svg/help";
import { Logout } from "./svg/logout";

const icons = {
  group: Group,
  heart: Heart,
  menu: Menu,
  bell: Bell,
  "chevron-right": ChevronRight,
  home: Home,
  search: Search,
  bookmark: Bookmark,
  settings: Settings,
  help: Help,
  logout: Logout,
} as const;
export type IconProps = {
  size: number;
  name: keyof typeof icons;
};

export function Icon({ size, name }: IconProps) {
  const IconComponent = icons[name];
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
    >
      <IconComponent />
    </div>
  );
}
