export const PullToRefreshIndicator = ({isPulling, pullDistance, isReady}: any) => {
  if (!isPulling) return null;
  
  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 z-50 pointer-events-none"
      style={{
        height: `${pullDistance}px`,
        opacity: isPulling ? 1 : 0,
        background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.1), transparent)'
      }}
    >
      <div className="bg-white rounded-full p-3 shadow-lg">
        <svg
          className={`w-6 h-6 transition-all duration-300 ${
            isReady ? 'text-green-500' : 'text-indigo-500'
          }`}
          style={{
            transform: isReady ? 'rotate(180deg)' : `rotate(${(pullDistance / 80) * 180}deg)`
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    </div>
  );
};