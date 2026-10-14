import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 48, showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs transition-transform hover:scale-105 duration-200"
      >
        {/* Outer Circle Container */}
        <circle cx="250" cy="250" r="240" fill="#FFFFFF" stroke="#222222" strokeWidth="6" />

        {/* Inner Grey Circle */}
        <circle cx="250" cy="180" r="145" fill="#D3D0CD" stroke="#222222" strokeWidth="8" />

        {/* Gothic Stylized 'Shu' in Red */}
        <g id="shu-text">
          <text
            x="250"
            y="215"
            textAnchor="middle"
            fill="#E11D2A"
            stroke="#18181B"
            strokeWidth="3"
            style={{
              fontFamily: "'UnifrakturMaguntia', serif, 'Old English Text MT', Georgia",
              fontSize: "148px",
              fontWeight: "900",
              letterSpacing: "-2px"
            }}
          >
            Shu
          </text>
        </g>

        {/* Gothic Stylized 'Brend' in Black underneath */}
        <g id="brend-text">
          <text
            x="250"
            y="410"
            textAnchor="middle"
            fill="#18181B"
            style={{
              fontFamily: "'UnifrakturMaguntia', serif, 'Old English Text MT', Georgia",
              fontSize: "135px",
              fontWeight: "900",
              letterSpacing: "1px"
            }}
          >
            Brend
          </text>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-xl uppercase text-neutral-900 leading-none">
            SHU BREND
          </span>
          <span className="text-[10px] tracking-widest text-neutral-500 uppercase mt-0.5 font-medium">
            Erkaklar Kiyimlari
          </span>
        </div>
      )}
    </div>
  );
};
