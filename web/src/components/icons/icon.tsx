import { Group } from "./svg/group";
import { Heart } from "./svg/heart";
import { Menu } from "./svg/menu";
import { Bell } from "./svg/bell";
import { ChevronRight } from "./svg/chevron-right";

const icons = {
  group: Group,
  heart: Heart,
  menu: Menu,
  bell: Bell,
  "chevron-right": ChevronRight,
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
