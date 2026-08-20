import { Group } from "./svg/group";
import { Heart } from "./svg/heart";

const icons = {
  group: Group,
  heart: Heart,
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
