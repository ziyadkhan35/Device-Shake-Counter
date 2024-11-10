import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [shakeCount, setShakeCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!('Accelerometer' in window)) {
      setError('This device does not support motion sensors.');
      return;
    }

    let accelerometer: any;
    try {
      accelerometer = new (window as any).Accelerometer({ frequency: 60 });
      accelerometer.addEventListener('reading', () => {
        const { x, y, z } = accelerometer;
        if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
          setShakeCount((prev) => prev + 1);
          setIsShaking(true);
          
          setTimeout(() => setIsShaking(false), 300); // Animation timeout
        }
      });
      accelerometer.start();
    } catch (err) {
      setError('Unable to access motion sensors. Ensure permissions are granted.');
    }

    return () => {
      accelerometer?.stop();
    };
  }, []);

  const resetCounter = () => setShakeCount(0);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#171717] text-gray-100">
      <p className='text-gray-400 font-mono text-sm text-center px-2'>If there is a jump of more than 15 m/s² on any axis, the count will increase by 1 unit.</p>
      <div
        className={`text-6xl font-mono my-20 rounded-full border-2 border-blue-500 flex items-center p-1 justify-center w-44 h-44 ${isShaking ? 'animate-shadow' : ''}`}
      >
        <span className={`${isShaking ? 'animate-shake' : ''}`}>{shakeCount}</span>
      </div>
      <button
        onClick={resetCounter}
        className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900"
      >
        Reset Counter
      </button>
    </div>
  );
};

export default App;
