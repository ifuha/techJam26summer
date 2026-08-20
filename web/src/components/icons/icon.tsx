import { Group } from "./svg/group";
import { Heart } from "./svg/heart";
import { Leaf } from "./svg/leaf";
import { Check } from "./svg/check";
import { Star } from "./svg/star";
import { Crown } from "./svg/crown";

const icons = {
  group: Group,
  heart: Heart,
  leaf: Leaf,
  check: Check,
  star:Star,
  crown:Crown,
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
