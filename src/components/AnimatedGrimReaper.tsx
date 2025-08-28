import React, { useEffect, useState } from 'react';
import { useLifeClock } from '@/contexts/LifeClockContext';
import { cn } from '@/lib/utils';

interface AnimatedGrimReaperProps {
  timeRemaining: {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  todayContribution: number;
}

export const AnimatedGrimReaper: React.FC<AnimatedGrimReaperProps> = ({ 
  timeRemaining, 
  todayContribution 
}) => {
  const [isGripping, setIsGripping] = useState(false);
  const [handAnimation, setHandAnimation] = useState('idle');
  
  const isGainingTime = todayContribution > 0;
  const isCriticallyLow = timeRemaining.years < 1 && timeRemaining.months < 6;
  
  useEffect(() => {
    // Trigger hand animations based on time changes
    if (Math.abs(todayContribution) > 0) {
      setIsGripping(true);
      setHandAnimation(isGainingTime ? 'frustrated' : 'pleased');
      
      const timer = setTimeout(() => {
        setIsGripping(false);
        setHandAnimation('idle');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [todayContribution, isGainingTime]);

  return (
    <div className="relative flex justify-center items-center">
      {/* Life Clock Bar */}
      <div className="relative w-64 h-8 bg-gradient-to-r from-red-900 via-red-700 to-red-500 rounded-full border-2 border-red-800 shadow-lg overflow-hidden">
        {/* Time Progress Fill */}
        <div 
          className={cn(
            "absolute left-0 top-0 h-full transition-all duration-1000 ease-out",
            "bg-gradient-to-r from-green-600 via-yellow-500 to-red-600",
            isCriticallyLow && "animate-pulse"
          )}
          style={{ 
            width: `${Math.max(5, Math.min(95, (timeRemaining.years / 80) * 100))}%` 
          }}
        />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        
        {/* Time Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold text-shadow-lg">
            {timeRemaining.years}y {timeRemaining.months}m
          </span>
        </div>
      </div>

      {/* Animated Grim Reaper */}
      <div className={cn(
        "absolute inset-0 flex justify-center items-center transition-all duration-500",
        isGripping && "animate-grip-tighter"
      )}>
        {/* Reaper Body */}
        <div className={cn(
          "relative transition-all duration-700",
          isCriticallyLow ? "animate-death-dance" : "animate-death-hover",
          isGainingTime && "animate-frustrated-shake"
        )}>
          {/* Hood & Head */}
          <div className="relative w-20 h-24 mx-auto">
            {/* Hood */}
            <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-gray-900 to-black rounded-t-full border border-gray-700" />
            
            {/* Eyes */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                isCriticallyLow ? "bg-red-500 animate-pulse" : "bg-red-400",
                isGainingTime && "bg-yellow-400 animate-bounce"
              )} />
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                isCriticallyLow ? "bg-red-500 animate-pulse" : "bg-red-400",
                isGainingTime && "bg-yellow-400 animate-bounce"
              )} />
            </div>
            
            {/* Mouth */}
            <div className={cn(
              "absolute top-10 left-1/2 transform -translate-x-1/2 w-4 h-1 transition-all duration-300",
              isGainingTime ? "bg-red-600 rounded-t-full" : "bg-gray-600 rounded-b-sm"
            )} />
          </div>

          {/* Robe */}
          <div className="w-16 h-20 mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-800 rounded-b-xl border-x border-b border-gray-700" />

          {/* Left Hand - Gripping the bar */}
          <div className={cn(
            "absolute -left-8 top-12 w-6 h-8 transition-all duration-300",
            handAnimation === 'frustrated' && "animate-hand-frustrated",
            handAnimation === 'pleased' && "animate-hand-pleased",
            handAnimation === 'idle' && "animate-hand-idle"
          )}>
            {/* Hand/Glove */}
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black rounded-lg border border-gray-600">
              {/* Fingers gripping */}
              <div className="absolute -bottom-1 left-1 w-1 h-3 bg-gray-700 rounded-full transform rotate-12" />
              <div className="absolute -bottom-1 left-2 w-1 h-4 bg-gray-700 rounded-full" />
              <div className="absolute -bottom-1 left-3 w-1 h-3 bg-gray-700 rounded-full transform -rotate-12" />
              <div className="absolute top-1 left-0 w-1 h-2 bg-gray-700 rounded-full transform rotate-45" />
            </div>
            
            {/* Grip effect lines */}
            {isGripping && (
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-px bg-red-400 animate-pulse" />
                <div className="w-3 h-px bg-red-400 animate-pulse mt-1" />
                <div className="w-2 h-px bg-red-400 animate-pulse mt-1" />
              </div>
            )}
          </div>

          {/* Right Hand - Also gripping */}
          <div className={cn(
            "absolute -right-8 top-12 w-6 h-8 transition-all duration-300",
            handAnimation === 'frustrated' && "animate-hand-frustrated-right",
            handAnimation === 'pleased' && "animate-hand-pleased-right", 
            handAnimation === 'idle' && "animate-hand-idle-right"
          )}>
            {/* Hand/Glove */}
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black rounded-lg border border-gray-600">
              {/* Fingers gripping */}
              <div className="absolute -bottom-1 right-1 w-1 h-3 bg-gray-700 rounded-full transform -rotate-12" />
              <div className="absolute -bottom-1 right-2 w-1 h-4 bg-gray-700 rounded-full" />
              <div className="absolute -bottom-1 right-3 w-1 h-3 bg-gray-700 rounded-full transform rotate-12" />
              <div className="absolute top-1 right-0 w-1 h-2 bg-gray-700 rounded-full transform -rotate-45" />
            </div>
            
            {/* Grip effect lines */}
            {isGripping && (
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-px bg-red-400 animate-pulse" />
                <div className="w-3 h-px bg-red-400 animate-pulse mt-1" />
                <div className="w-2 h-px bg-red-400 animate-pulse mt-1" />
              </div>
            )}
          </div>

          {/* Scythe */}
          <div className={cn(
            "absolute -right-12 -top-4 w-1 h-32 bg-gradient-to-b from-amber-900 to-amber-800 rounded-full transition-all duration-500",
            isGainingTime && "animate-scythe-angry"
          )}>
            {/* Scythe Blade */}
            <div className="absolute -top-2 -right-3 w-8 h-6 bg-gradient-to-r from-gray-400 to-gray-300 rounded-l-full border border-gray-500 shadow-lg" />
            <div className="absolute -top-1 -right-2 w-6 h-4 bg-gradient-to-r from-gray-300 to-white rounded-l-full" />
          </div>
        </div>
      </div>

      {/* Emotional State Indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold transition-all duration-500",
          isGainingTime ? "bg-red-900 text-red-200" : "bg-green-900 text-green-200",
          "border border-gray-600"
        )}>
          {isGainingTime ? "😠 Frustrated" : "😈 Pleased"}
        </div>
      </div>
    </div>
  );
};