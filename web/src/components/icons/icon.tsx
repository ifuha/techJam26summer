import { Group } from "./svg/group";

const icons = {
  group: Group,
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
