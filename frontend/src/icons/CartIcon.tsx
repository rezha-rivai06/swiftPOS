import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export default function CartIcon({ size = 24, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3H5L6.68 14.39C6.77 15.01 7.31 15.47 7.94 15.47H18.06C18.69 15.47 19.23 15.01 19.32 14.39L20.5 6.5H5.21"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 20.5C9.32843 20.5 10 19.8284 10 19C10 18.1716 9.32843 17.5 8.5 17.5C7.67157 17.5 7 18.1716 7 19C7 19.8284 7.67157 20.5 8.5 20.5Z"
        fill={color}
      />
      <Path
        d="M17.5 20.5C18.3284 20.5 19 19.8284 19 19C19 18.1716 18.3284 17.5 17.5 17.5C16.6716 17.5 16 18.1716 16 19C16 19.8284 16.6716 20.5 17.5 20.5Z"
        fill={color}
      />
    </Svg>
  );
}
