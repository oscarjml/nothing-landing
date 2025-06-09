export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#F4F1EB' }}>
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-wider select-none"
            style={{ 
              fontFamily: '"Times New Roman", Times, serif',
              color: '#1E2A45',
              lineHeight: '1',
              letterSpacing: '0.02em',
            }}
          >
            Nothing
          </h1>
        </div>
      </div>
    </div>
  );
}
