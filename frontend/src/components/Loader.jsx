/**
 * Loader — gradient ring spinner with pulsing center dot
 */

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-surface-700 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary-400 glow-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
