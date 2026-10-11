import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export default function StockIcon({ size = 24, color = '#EF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 7.5L12 2.5L3 7.5M21 7.5L12 12.5M21 7.5V16.5L12 21.5M12 12.5L3 7.5M12 12.5V21.5M3 7.5V16.5L12 21.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
