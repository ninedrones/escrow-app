'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: number; // Unix timestamp
  onExpired?: () => void;
  className?: string;
}

export function CountdownTimer({ deadline, onExpired, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const difference = deadline - now;

      if (difference <= 0) {
        setIsExpired(true);
        onExpired?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (24 * 60 * 60));
      const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((difference % (60 * 60)) / 60);
      const seconds = difference % 60;

      return { days, hours, minutes, seconds };
    };

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    // 初期計算
    updateTimer();

    // 1秒ごとに更新
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpired]);

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-2xl font-bold text-red-600 mb-2">
          ⏰ 期限切れ
        </div>
        <p className="text-sm text-gray-600">
          Refundが可能になりました
        </p>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`text-center ${className}`}>
      <div className="text-sm text-gray-600 mb-3">
        Refund可能まで
      </div>
      
      <div className="flex justify-center space-x-4">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(timeLeft.days)}
            </div>
            <div className="text-xs text-gray-500">日</div>
          </div>
        )}
        
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(timeLeft.hours)}
          </div>
          <div className="text-xs text-gray-500">時間</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(timeLeft.minutes)}
          </div>
          <div className="text-xs text-gray-500">分</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(timeLeft.seconds)}
          </div>
          <div className="text-xs text-gray-500">秒</div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.max(0, Math.min(100, ((deadline - Math.floor(Date.now() / 1000)) / (deadline - timeLeft.days * 24 * 60 * 60 - timeLeft.hours * 60 * 60 - timeLeft.minutes * 60 - timeLeft.seconds)) * 100))}%`
            }}
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        期限: {new Date(deadline * 1000).toLocaleString()}
      </p>
    </div>
  );
}
