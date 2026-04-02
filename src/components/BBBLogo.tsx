export function BBBLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue background circle */}
      <circle cx="50" cy="50" r="48" fill="#0066b2" />
      
      {/* White BBB text */}
      <text
        x="50"
        y="40"
        fontFamily="Arial Black, sans-serif"
        fontSize="28"
        fontWeight="900"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        BBB
      </text>
      
      {/* Registered trademark symbol */}
      <circle cx="80" cy="30" r="8" fill="white" />
      <text
        x="80"
        y="30"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fontWeight="bold"
        fill="#0066b2"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        ®
      </text>
      
      {/* White divider line */}
      <line x1="20" y1="55" x2="80" y2="55" stroke="white" strokeWidth="1.5" />
      
      {/* A+ Rating */}
      <text
        x="50"
        y="75"
        fontFamily="Arial Black, sans-serif"
        fontSize="22"
        fontWeight="900"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        A+
      </text>
    </svg>
  );
}
