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
  const [powerLevel, setPowerLevel] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  
  const isGainingTime = todayContribution > 0;
  const isCriticallyLow = timeRemaining.years < 1 && timeRemaining.months < 6;
  
  useEffect(() => {
    // Trigger hand animations based on time changes
    if (Math.abs(todayContribution) > 0) {
      setIsGripping(true);
      setHandAnimation(isGainingTime ? 'frustrated' : 'pleased');
      setPowerLevel(Math.min(Math.abs(todayContribution) / 100, 1));
      
      // Only shake when gaining time, and only for 3 seconds
      let shakeTimer: NodeJS.Timeout | null = null;
      if (isGainingTime) {
        setIsShaking(true);
        shakeTimer = setTimeout(() => setIsShaking(false), 3000);
      }
      
      const mainTimer = setTimeout(() => {
        setIsGripping(false);
        setHandAnimation('idle');
        setPowerLevel(0);
        setIsShaking(false); // Ensure shaking stops
      }, 3000);
      
      return () => {
        clearTimeout(mainTimer);
        if (shakeTimer) clearTimeout(shakeTimer);
      };
    }
  }, [todayContribution, isGainingTime]);

  const lifePercentage = Math.max(5, Math.min(95, (timeRemaining.years / 80) * 100));

  return (
    <div className="relative flex justify-center items-center h-48">
      {/* Dark Aura/Energy Field */}
      <div className={cn(
        "absolute inset-0 transition-all duration-1000",
        isGripping && "animate-pulse"
      )}>
        <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-black/40 to-transparent rounded-full blur-xl" />
        {powerLevel > 0.5 && (
          <div className="absolute inset-0 bg-gradient-radial from-red-500/30 via-transparent to-transparent animate-pulse" />
        )}
      </div>

      {/* Life Clock Bar - Enhanced */}
      <div className="relative w-80 h-12 bg-gradient-to-r from-red-950 via-red-800 to-red-600 rounded-full border-3 border-red-700 shadow-2xl overflow-hidden z-10">
        {/* Inner glow */}
        <div className="absolute inset-1 bg-gradient-to-r from-black/50 to-transparent rounded-full" />
        
        {/* Time Progress Fill */}
        <div 
          className={cn(
            "absolute left-0 top-0 h-full transition-all duration-1000 ease-out rounded-full",
            "bg-gradient-to-r from-green-400 via-yellow-400 to-red-500",
            isCriticallyLow && "animate-pulse shadow-lg shadow-red-500/50",
            isGripping && "shadow-2xl"
          )}
          style={{ width: `${lifePercentage}%` }}
        >
          {/* Progress glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full" />
        </div>
        
        {/* Crack effects when critical */}
        {isCriticallyLow && (
          <>
            <div className="absolute top-2 left-1/4 w-px h-8 bg-red-200 opacity-60 transform rotate-12" />
            <div className="absolute top-1 right-1/3 w-px h-10 bg-red-200 opacity-40 transform -rotate-6" />
          </>
        )}
        
        {/* Time Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-sm font-bold drop-shadow-lg">
            {timeRemaining.years}y {timeRemaining.months}m
          </span>
        </div>

        {/* Grip pressure indicators */}
        {isGripping && (
          <>
            <div className="absolute -top-1 left-16 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <div className="absolute -top-1 right-16 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <div className="absolute -bottom-1 left-20 w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse" />
            <div className="absolute -bottom-1 right-20 w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse" />
          </>
        )}

        {/* Left Hand - Gripping FROM ABOVE */}
        <div className={cn(
          "absolute -top-6 left-12 w-8 h-10 transition-all duration-300 z-20",
          handAnimation === 'frustrated' && "animate-hand-frustrated scale-110",
          handAnimation === 'pleased' && "animate-hand-pleased scale-105",
          handAnimation === 'idle' && "animate-hand-idle"
        )}>
          {/* Skeletal Hand gripping down */}
          <div className="relative w-full h-full">
            {/* Palm positioned above bar */}
            <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg border-2 border-gray-500 shadow-lg transform rotate-12">
              {/* Palm lines */}
              <div className="absolute top-1 left-1 w-4 h-px bg-gray-400" />
              <div className="absolute top-3 left-0.5 w-5 h-px bg-gray-400" />
            </div>
            
            {/* Fingers gripping down onto the bar */}
            <div className="absolute bottom-6 left-1 w-1.5 h-8 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform rotate-25 border border-gray-400" />
            <div className="absolute bottom-6 left-2.5 w-1.5 h-9 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform rotate-15 border border-gray-400" />
            <div className="absolute bottom-6 left-4 w-1.5 h-8 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform rotate-5 border border-gray-400" />
            <div className="absolute bottom-5 left-5.5 w-1 h-6 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform -rotate-10 border border-gray-400" />
            
            {/* Thumb wrapping around */}
            <div className="absolute bottom-2 -left-1 w-1.5 h-5 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform rotate-60 border border-gray-400" />
            
            {/* Knuckles */}
            <div className="absolute bottom-1 left-1.5 w-1 h-1 bg-gray-400 rounded-full" />
            <div className="absolute bottom-1 left-3 w-1 h-1 bg-gray-400 rounded-full" />
            <div className="absolute bottom-1 left-4.5 w-1 h-1 bg-gray-400 rounded-full" />
          </div>
          
          {/* Intense Grip Effects */}
          {isGripping && (
            <div className="absolute bottom-2 -right-2 transform">
              <div className="w-4 h-0.5 bg-red-400 animate-pulse shadow-lg shadow-red-400/50" />
              <div className="w-3 h-0.5 bg-red-300 animate-pulse mt-0.5 shadow-lg shadow-red-300/50" />
              <div className="w-2 h-0.5 bg-red-200 animate-pulse mt-0.5 shadow-lg shadow-red-200/50" />
            </div>
          )}
        </div>

        {/* Right Hand - Gripping FROM ABOVE */}
        <div className={cn(
          "absolute -top-6 right-12 w-8 h-10 transition-all duration-300 z-20",
          handAnimation === 'frustrated' && "animate-hand-frustrated-right scale-110",
          handAnimation === 'pleased' && "animate-hand-pleased-right scale-105", 
          handAnimation === 'idle' && "animate-hand-idle-right"
        )}>
          {/* Skeletal Hand gripping down (mirrored) */}
          <div className="relative w-full h-full">
            {/* Palm positioned above bar */}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg border-2 border-gray-500 shadow-lg transform -rotate-12">
              {/* Palm lines */}
              <div className="absolute top-1 right-1 w-4 h-px bg-gray-400" />
              <div className="absolute top-3 right-0.5 w-5 h-px bg-gray-400" />
            </div>
            
            {/* Fingers gripping down onto the bar (mirrored) */}
            <div className="absolute bottom-6 right-1 w-1.5 h-8 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform -rotate-25 border border-gray-400" />
            <div className="absolute bottom-6 right-2.5 w-1.5 h-9 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform -rotate-15 border border-gray-400" />
            <div className="absolute bottom-6 right-4 w-1.5 h-8 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform -rotate-5 border border-gray-400" />
            <div className="absolute bottom-5 right-5.5 w-1 h-6 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform rotate-10 border border-gray-400" />
            
            {/* Thumb wrapping around */}
            <div className="absolute bottom-2 -right-1 w-1.5 h-5 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full transform -rotate-60 border border-gray-400" />
            
            {/* Knuckles */}
            <div className="absolute bottom-1 right-1.5 w-1 h-1 bg-gray-400 rounded-full" />
            <div className="absolute bottom-1 right-3 w-1 h-1 bg-gray-400 rounded-full" />
            <div className="absolute bottom-1 right-4.5 w-1 h-1 bg-gray-400 rounded-full" />
          </div>
          
          {/* Intense Grip Effects */}
          {isGripping && (
            <div className="absolute bottom-2 -left-2 transform">
              <div className="w-4 h-0.5 bg-red-400 animate-pulse shadow-lg shadow-red-400/50" />
              <div className="w-3 h-0.5 bg-red-300 animate-pulse mt-0.5 shadow-lg shadow-red-300/50" />
              <div className="w-2 h-0.5 bg-red-200 animate-pulse mt-0.5 shadow-lg shadow-red-200/50" />
            </div>
          )}
        </div>
      </div>

      {/* Masterful Grim Reaper ABOVE the bar - Moved higher to avoid overlap */}
      <div className={cn(
        "absolute -top-24 flex justify-center items-center transition-all duration-700 scale-110",
        isGripping && "scale-115",
        isCriticallyLow ? "animate-death-dance" : "animate-death-hover",
        isShaking && "animate-frustrated-shake"
      )}>
        
        {/* Main Reaper Figure */}
        <div className="relative">
          {/* Hood & Skull */}
          <div className="relative w-24 h-28 mx-auto">
            {/* Deep Hood */}
            <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-gray-950 via-gray-900 to-black rounded-t-full border-2 border-gray-800 shadow-2xl">
              {/* Hood interior shadow */}
              <div className="absolute inset-2 bg-gradient-radial from-transparent to-black/80 rounded-t-full" />
            </div>
            
            {/* Skull Face */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16">
              {/* Skull outline */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full opacity-20" />
              
              {/* Eye Sockets */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <div className="relative">
                  <div className="w-3 h-4 bg-black rounded-full border border-gray-700" />
                  <div className={cn(
                    "absolute top-0.5 left-0.5 w-2 h-2 rounded-full transition-all duration-300",
                    isCriticallyLow ? "bg-red-400 animate-pulse shadow-lg shadow-red-400/50" : "bg-red-500",
                    isGainingTime && "bg-orange-400 animate-bounce"
                  )} />
                </div>
                <div className="relative">
                  <div className="w-3 h-4 bg-black rounded-full border border-gray-700" />
                  <div className={cn(
                    "absolute top-0.5 left-0.5 w-2 h-2 rounded-full transition-all duration-300",
                    isCriticallyLow ? "bg-red-400 animate-pulse shadow-lg shadow-red-400/50" : "bg-red-500",
                    isGainingTime && "bg-orange-400 animate-bounce"
                  )} />
                </div>
              </div>
              
              {/* Nasal Cavity */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-black rounded-full border border-gray-700" />
              
              {/* Jaw/Mouth */}
              <div className={cn(
                "absolute top-11 left-1/2 transform -translate-x-1/2 transition-all duration-300",
                isGainingTime ? "w-6 h-2 bg-red-700 rounded-t-xl" : "w-5 h-1 bg-gray-800 rounded"
              )}>
                {/* Teeth */}
                {isGainingTime && (
                  <div className="absolute -top-1 left-1 w-1 h-2 bg-gray-200 transform rotate-12" />
                )}
              </div>
            </div>
          </div>

          {/* Flowing Robe */}
          <div className="relative w-20 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-gray-900 rounded-b-2xl border-x-2 border-b-2 border-gray-800 shadow-2xl">
              {/* Robe folds */}
              <div className="absolute left-2 top-4 w-1 h-16 bg-gray-800 rounded-full opacity-60" />
              <div className="absolute right-2 top-6 w-1 h-12 bg-gray-800 rounded-full opacity-40" />
              <div className="absolute left-1/2 top-8 w-px h-10 bg-gray-700 opacity-50" />
            </div>
          </div>

          {/* Legendary Scythe */}
          <div className={cn(
            "absolute -right-16 -top-8 transition-all duration-500 z-5",
            isGainingTime && "animate-scythe-angry scale-110 rotate-12",
            isCriticallyLow && "animate-pulse"
          )}>
            {/* Scythe Handle */}
            <div className="relative w-2 h-40 bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 rounded-full border border-amber-700 shadow-lg">
              {/* Handle details */}
              <div className="absolute top-4 left-0 w-full h-1 bg-amber-700 rounded-full" />
              <div className="absolute top-20 left-0 w-full h-1 bg-amber-700 rounded-full" />
              <div className="absolute top-36 left-0 w-full h-1 bg-amber-700 rounded-full" />
              
              {/* Handle grip wrap */}
              <div className="absolute top-16 left-0 w-full h-8 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full border border-amber-600" />
            </div>
            
            {/* Scythe Blade */}
            <div className="absolute -top-4 -right-6 w-12 h-8 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 rounded-l-full border-2 border-gray-400 shadow-2xl">
              {/* Blade edge glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-l-full" />
              {/* Blade reflection */}
              <div className="absolute top-1 left-1 w-8 h-2 bg-gradient-to-r from-white/80 to-transparent rounded-l-full" />
              {/* Sharp edge */}
              <div className="absolute left-0 top-0 w-10 h-px bg-white shadow-lg shadow-white/50" />
            </div>
            
            {/* Mystical Scythe Effects */}
            {powerLevel > 0.3 && (
              <div className="absolute -top-2 -right-4 w-8 h-6">
                <div className="absolute inset-0 bg-red-500/30 blur-sm animate-pulse rounded-l-full" />
                <div className="absolute inset-1 bg-red-400/20 blur-md animate-pulse rounded-l-full" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Status Indicator */}
      {isGripping && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 backdrop-blur-sm",
            isGainingTime 
              ? "bg-red-950/80 text-red-200 border border-red-800/50" 
              : "bg-emerald-950/80 text-emerald-200 border border-emerald-800/50",
            "animate-fade-in"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isGainingTime ? "bg-red-400" : "bg-emerald-400"
            )} />
            <span className="uppercase tracking-wide">
              {isGainingTime ? "Frustrated" : "Pleased"}
            </span>
            {powerLevel > 0.3 && (
              <div className="text-xs opacity-70 ml-1">
                {Math.round(powerLevel * 100)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Power Aura Effects */}
      {powerLevel > 0.7 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-red-600/20 via-red-500/10 to-transparent animate-pulse rounded-full scale-150" />
          <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 to-transparent animate-pulse rounded-full scale-125 animation-delay-500" />
        </div>
      )}
    </div>
  );
};