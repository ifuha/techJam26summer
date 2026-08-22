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
import { GraduationCap } from "./svg/graduation-cap";
import { Calendar } from "./svg/calendar";
import { Document } from "./svg/document";
import { Clock } from "./svg/clock";
import { Lock } from "./svg/lock";
import { Leaf } from "./svg/leaf";
import { Star } from "./svg/star";
import { Pro } from "./svg/Pro";
import { Plus } from "./svg/plus";
import { Chart } from "./svg/chart";

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
  "graduation-cap": GraduationCap,
  calendar: Calendar,
  document: Document,
  clock: Clock,
  lock: Lock,
  leaf: Leaf,
  star: Star,
  pro: Pro,
  plus: Plus,
  chart: Chart,
} as const;
export type IconName = keyof typeof icons;

export type IconProps = {
  size: number;
  name: IconName;
};

export function Icon({ size, name }: IconProps) {
  const IconComponent = icons[name];
  return (
    <div
      className="inline-flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <IconComponent />
    </div>
  );
}
