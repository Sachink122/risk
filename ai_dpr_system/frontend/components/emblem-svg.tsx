// This is a placeholder SVG version of the Indian government emblem
// We'll create an SVG that resembles the emblem in a simple form

const EmblemSvg = () => {
  return (
    <svg
      width="60"
      height="80"
      viewBox="0 0 60 80"
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-auto"
    >
      {/* A simplified version of the Indian government emblem */}
      <circle cx="30" cy="40" r="22" fill="#00008B" />
      <circle cx="30" cy="40" r="20" fill="#FFF" />
      <circle cx="30" cy="40" r="17" fill="#00008B" />
      <circle cx="30" cy="40" r="15" fill="#FFF" />
      
      {/* Simplified Ashoka Chakra */}
      <circle cx="30" cy="40" r="10" fill="#00008B" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="30" cy="40" r="8" fill="#00008B" stroke="#FFF" strokeWidth="0.5" />
      
      {/* Spokes of the wheel */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="30"
          y1="40"
          x2={30 + 10 * Math.cos((i * 15 * Math.PI) / 180)}
          y2={40 + 10 * Math.sin((i * 15 * Math.PI) / 180)}
          stroke="#FFF"
          strokeWidth="0.8"
        />
      ))}
      
      {/* Lion capitals - simplified representation */}
      <ellipse cx="30" cy="20" rx="12" ry="7" fill="#00008B" />
      <ellipse cx="30" cy="20" rx="10" ry="5" fill="#FFF" />
      
      {/* Motto */}
      <rect x="12" y="65" width="36" height="5" rx="1" fill="#00008B" />
      <rect x="15" y="65" width="30" height="5" rx="1" fill="#FFF" />
    </svg>
  );
};

export default EmblemSvg;