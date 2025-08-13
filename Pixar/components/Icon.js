import * as OutlineIcons from 'react-native-heroicons/outline';
import * as SolidIcons from 'react-native-heroicons/solid';
import { fontSize } from '../app/theme/scale';

const Icon = ({
  name,
  size = fontSize(24),
  color = 'currentColor',
  variant = 'outline',
  ...rest
}) => {
  const IconSet = variant === 'solid' ? SolidIcons : OutlineIcons;
  const IconComponent = IconSet[name];
  if (!IconComponent) return null;

  return (
    <IconComponent
      width={size}
      height={size}
      color={color}
      style={{ color }}
      {...rest}
    />
  );
};

export default Icon;
