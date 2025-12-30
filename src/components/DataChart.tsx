interface UsageGaugeProps {
  remaining?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
}

const DataChart = ({
                     remaining = 0,
                     max = 1,
                     size = 125,
                     strokeWidth = 10,
                   }: UsageGaugeProps) => {
  const value = max - remaining;
  const cx = size / 2;
  const cy = size / 2;
  const pct = Math.max(0, Math.min(1, value / max));
  
  // geometry
  const startAngle = 225; // bắt đầu bên trái-dưới
  const angleSpan = 270;  // chiếm 270° (75% vòng)
  const endAngle = startAngle + angleSpan;
  const radius = Math.min(cx, cy) - strokeWidth - 6;
  
  const polarToCartesian = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad)};
  };
  
  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const largeArcFlag = angleSpan > 180 ? 1 : 0;
  const sweepFlag = 1; // vẽ theo chiều "tới trên" để hở ở dưới
  
  const arcPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
  
  // arc length (chu vi cung) = r * angle(rad)
  const angleRad = (angleSpan * Math.PI) / 180;
  const arcLength = radius * angleRad;
  const dashOffset = arcLength * (1 - pct);
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        {remaining > 0 ?
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#067290"/>
            <stop offset="60%" stopColor="#28AFD4"/>
          </linearGradient>
          :
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DCA103"/>
            <stop offset="60%" stopColor="#FFDD82"/>
          </linearGradient>
        }
      </defs>
      
      {/* nền (chưa dùng) */}
      <path
        d={arcPath}
        fill="transparent"
        stroke="#e7f3f6"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      
      {/* phần đã dùng (gradient) */}
      <path
        d={arcPath}
        fill="transparent"
        stroke="url(#gaugeGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={arcLength}
        strokeDashoffset={dashOffset}
        style={{transition: "stroke-dashoffset 800ms ease"}}
      />
      
      {/* nội thất trắng để giống mẫu */}
      <circle
        cx={cx}
        cy={cy}
        r={radius - strokeWidth / 2 - 6}
        fill="white"
      />
      
      {/* text chính giữa: số lớn + GB */}
      <text x={cx} y={cy - 2} textAnchor="middle">
        <tspan
          fontSize={16}
          fontWeight={700}
          fill={value > max ? "#DCA103" : "#006885"}
          dominantBaseline="middle"
        >
          {value > max && ">"}{value || 0}
        </tspan>
        <tspan
          fontSize={16}
          fontWeight={700}
          fill={value > max ? "#DCA103" : "#006885"}
          dx="8"
          dominantBaseline="middle"
        >
          MB
        </tspan>
      </text>
      
      {/* mốc 0 và max (đưa gần vị trí đầu/cuối cung) */}
      {(() => {
        const left = (() => {
          const p = polarToCartesian(startAngle - 8); // hơi dịch để khớp
          return {x: p.x - 4, y: p.y + 15};
        })();
        const right = (() => {
          const p = polarToCartesian(endAngle + 8);
          return {x: p.x + 4, y: p.y + 15};
        })();
        return (
          <>
            <text
              x={left.x}
              y={left.y}
              textAnchor="middle"
              fontSize={12}
              fill="#0f6b73"
            >
              0
            </text>
            <text
              x={right.x}
              y={right.y}
              textAnchor="middle"
              fontSize={12}
              fill="#0f6b73"
            >
              {max} MB
            </text>
          </>
        );
      })()}
    </svg>
  
  );
};

export default DataChart;
