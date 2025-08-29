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
  
  const isGainingTime = todayContribution > 0;
  const isCriticallyLow = timeRemaining.years < 1 && timeRemaining.months < 6;
  
  useEffect(() => {
    // Trigger hand animations based on time changes
    if (Math.abs(todayContribution) > 0) {
      setIsGripping(true);
      setHandAnimation(isGainingTime ? 'frustrated' : 'pleased');
      setPowerLevel(Math.min(Math.abs(todayContribution) / 100, 1));
      
      const timer = setTimeout(() => {
        setIsGripping(false);
        setHandAnimation('idle');
        setPowerLevel(0);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [todayContribution, isGainingTime]);

  const lifePercentage = Math.max(5, Math.min(95, (timeRemaining.years / 80) * 100));

  return (
    <div className="relative flex justify-center items-center h-40">
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
      <div className="relative w-80 h-12 bg-gradient-to-r from-red-950 via-red-800 to-red-600 rounded-full border-3 border-red-700 shadow-2xl overflow-hidden">
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
      </div>

      {/* Masterful Grim Reaper */}
      <div className={cn(
        "absolute inset-0 flex justify-center items-center transition-all duration-700 scale-110",
        isGripping && "scale-115",
        isCriticallyLow ? "animate-death-dance" : "animate-death-hover",
        isGainingTime && "animate-frustrated-shake"
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

          {/* Enhanced Left Hand */}
          <div className={cn(
            "absolute -left-12 top-16 w-8 h-10 transition-all duration-300 z-10",
            handAnimation === 'frustrated' && "animate-hand-frustrated scale-110",
            handAnimation === 'pleased' && "animate-hand-pleased scale-105",
            handAnimation === 'idle' && "animate-hand-idle"
          )}>
            {/* Skeletal Hand */}
            <div className="relative w-full h-full">
              {/* Palm */}
              <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border-2 border-gray-600 shadow-lg">
                {/* Palm lines */}
                <div className="absolute top-1 left-1 w-4 h-px bg-gray-500" />
                <div className="absolute top-3 left-0.5 w-5 h-px bg-gray-500" />
              </div>
              
              {/* Fingers - More detailed */}
              <div className="absolute -bottom-2 left-1 w-1.5 h-6 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-20 border border-gray-500" />
              <div className="absolute -bottom-2 left-2.5 w-1.5 h-7 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-5 border border-gray-500" />
              <div className="absolute -bottom-2 left-4 w-1.5 h-6 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform -rotate-5 border border-gray-500" />
              <div className="absolute -bottom-1 left-5.5 w-1 h-4 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform -rotate-20 border border-gray-500" />
              
              {/* Thumb */}
              <div className="absolute top-2 -left-1 w-1.5 h-4 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-45 border border-gray-500" />
              
              {/* Knuckles */}
              <div className="absolute bottom-2 left-1.5 w-1 h-1 bg-gray-500 rounded-full" />
              <div className="absolute bottom-2 left-3 w-1 h-1 bg-gray-500 rounded-full" />
              <div className="absolute bottom-2 left-4.5 w-1 h-1 bg-gray-500 rounded-full" />
            </div>
            
            {/* Intense Grip Effects */}
            {isGripping && (
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-0.5 bg-red-400 animate-pulse shadow-lg shadow-red-400/50" />
                <div className="w-4 h-0.5 bg-red-300 animate-pulse mt-1 shadow-lg shadow-red-300/50" />
                <div className="w-3 h-0.5 bg-red-200 animate-pulse mt-1 shadow-lg shadow-red-200/50" />
                {/* Energy crackling */}
                <div className="absolute -top-2 right-0 w-1 h-4 bg-red-400 animate-pulse transform rotate-45 opacity-60" />
              </div>
            )}
          </div>

          {/* Enhanced Right Hand */}
          <div className={cn(
            "absolute -right-12 top-16 w-8 h-10 transition-all duration-300 z-10",
            handAnimation === 'frustrated' && "animate-hand-frustrated-right scale-110",
            handAnimation === 'pleased' && "animate-hand-pleased-right scale-105", 
            handAnimation === 'idle' && "animate-hand-idle-right"
          )}>
            {/* Skeletal Hand (mirrored) */}
            <div className="relative w-full h-full">
              {/* Palm */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border-2 border-gray-600 shadow-lg">
                {/* Palm lines */}
                <div className="absolute top-1 right-1 w-4 h-px bg-gray-500" />
                <div className="absolute top-3 right-0.5 w-5 h-px bg-gray-500" />
              </div>
              
              {/* Fingers - More detailed (mirrored) */}
              <div className="absolute -bottom-2 right-1 w-1.5 h-6 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform -rotate-20 border border-gray-500" />
              <div className="absolute -bottom-2 right-2.5 w-1.5 h-7 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform -rotate-5 border border-gray-500" />
              <div className="absolute -bottom-2 right-4 w-1.5 h-6 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-5 border border-gray-500" />
              <div className="absolute -bottom-1 right-5.5 w-1 h-4 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-20 border border-gray-500" />
              
              {/* Thumb */}
              <div className="absolute top-2 -right-1 w-1.5 h-4 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform -rotate-45 border border-gray-500" />
              
              {/* Knuckles */}
              <div className="absolute bottom-2 right-1.5 w-1 h-1 bg-gray-500 rounded-full" />
              <div className="absolute bottom-2 right-3 w-1 h-1 bg-gray-500 rounded-full" />
              <div className="absolute bottom-2 right-4.5 w-1 h-1 bg-gray-500 rounded-full" />
            </div>
            
            {/* Intense Grip Effects */}
            {isGripping && (
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-0.5 bg-red-400 animate-pulse shadow-lg shadow-red-400/50" />
                <div className="w-4 h-0.5 bg-red-300 animate-pulse mt-1 shadow-lg shadow-red-300/50" />
                <div className="w-3 h-0.5 bg-red-200 animate-pulse mt-1 shadow-lg shadow-red-200/50" />
                {/* Energy crackling */}
                <div className="absolute -top-2 left-0 w-1 h-4 bg-red-400 animate-pulse transform -rotate-45 opacity-60" />
              </div>
            )}
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

      {/* Enhanced Emotional State */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-bold transition-all duration-500 border-2 shadow-lg",
          isGainingTime 
            ? "bg-gradient-to-r from-red-900 to-red-800 text-red-100 border-red-600 shadow-red-500/30" 
            : "bg-gradient-to-r from-green-900 to-green-800 text-green-100 border-green-600 shadow-green-500/30",
          isGripping && "scale-110 animate-pulse"
        )}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {isGainingTime ? "😠" : "😈"}
            </span>
            <span>
              {isGainingTime ? "FRUSTRATED" : "PLEASED"}
            </span>
            {powerLevel > 0.5 && (
              <span className="text-xs opacity-80">
                [{Math.round(powerLevel * 100)}%]
              </span>
            )}
          </div>
        </div>
      </div>

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