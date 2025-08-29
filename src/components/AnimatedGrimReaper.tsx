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

      {/* PROPER GRIM REAPER - Tall, Menacing Death Figure */}
      <div className={cn(
        "absolute -top-32 flex justify-center items-center transition-all duration-700",
        isGripping && "scale-105",
        isCriticallyLow ? "animate-death-dance" : "animate-death-hover",
        isShaking && "animate-frustrated-shake"
      )}>
        
        {/* Death's Imposing Figure */}
        <div className="relative scale-100">
          {/* Large Death Hood */}
          <div className="relative w-32 h-40 mx-auto">
            {/* Deep Shadowy Hood */}
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black via-gray-950 to-gray-900 shadow-2xl"
                 style={{
                   clipPath: "polygon(15% 0%, 85% 0%, 95% 40%, 90% 80%, 75% 95%, 25% 95%, 10% 80%, 5% 40%)",
                 }}>
              {/* Deep hood shadows */}
              <div className="absolute inset-4 bg-gradient-radial from-transparent via-black/60 to-black/90" />
              <div className="absolute inset-8 bg-gradient-radial from-transparent to-black/80" />
            </div>
            
            {/* Menacing Skull Face */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-24">
              {/* Skull base */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 opacity-15"
                   style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 70%, 90% 100%, 10% 100%, 0% 70%)" }} />
              
              {/* Glowing Red Eye Sockets */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                <div className="relative">
                  <div className="w-4 h-6 bg-black rounded-full" />
                  <div className={cn(
                    "absolute top-1 left-1 w-2.5 h-3 rounded-full transition-all duration-300",
                    isCriticallyLow ? "bg-red-400 animate-pulse shadow-lg shadow-red-400/70" : "bg-red-500 shadow-lg shadow-red-500/50",
                    isGainingTime && "bg-orange-400 animate-bounce shadow-lg shadow-orange-400/70"
                  )} />
                  {/* Inner glow */}
                  <div className="absolute top-1.5 left-1.5 w-1.5 h-2 bg-red-300 rounded-full opacity-80" />
                </div>
                <div className="relative">
                  <div className="w-4 h-6 bg-black rounded-full" />
                  <div className={cn(
                    "absolute top-1 left-1 w-2.5 h-3 rounded-full transition-all duration-300",
                    isCriticallyLow ? "bg-red-400 animate-pulse shadow-lg shadow-red-400/70" : "bg-red-500 shadow-lg shadow-red-500/50",
                    isGainingTime && "bg-orange-400 animate-bounce shadow-lg shadow-orange-400/70"
                  )} />
                  <div className="absolute top-1.5 left-1.5 w-1.5 h-2 bg-red-300 rounded-full opacity-80" />
                </div>
              </div>
              
              {/* Nasal Cavity */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-black"
                   style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
              
               {/* Menacing Jaw - Smiles normally, frowns when gaining time */}
               {!isGainingTime ? (
                 // Smiling mouth (curved upward)
                 <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                   <div className="w-8 h-2 bg-black rounded-b-full" />
                   {/* Smile curve */}
                   <div className="absolute top-0 left-1 w-6 h-1 bg-gray-600 rounded-b-full" />
                 </div>
               ) : (
                 // Frowning mouth (straight/downward)
                 <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black"
                      style={{ clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)" }}>
                 </div>
               )}
            </div>
          </div>

          {/* Flowing Death Robe */}
          <div className="relative w-28 h-32 mx-auto -mt-8">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-gray-800 shadow-2xl"
                 style={{
                   clipPath: "polygon(10% 0%, 90% 0%, 95% 20%, 100% 100%, 0% 100%, 5% 20%)",
                 }}>
              {/* Robe texture and folds */}
              <div className="absolute left-4 top-8 w-1 h-20 bg-gray-800 rounded-full opacity-60" />
              <div className="absolute right-4 top-12 w-1 h-16 bg-gray-800 rounded-full opacity-40" />
              <div className="absolute left-1/2 top-16 w-px h-12 bg-gray-700 opacity-50" />
              <div className="absolute left-8 top-20 w-px h-8 bg-gray-700 opacity-30" />
              <div className="absolute right-8 top-18 w-px h-10 bg-gray-700 opacity-30" />
            </div>
          </div>

          {/* MASSIVE Death Scythe */}
          <div className={cn(
            "absolute -right-20 -top-16 transition-all duration-500 z-10",
            isGripping && isGainingTime && "animate-scythe-angry scale-110 rotate-6",
            isCriticallyLow && "animate-pulse"
          )}>
            {/* Long Scythe Handle */}
            <div className="relative w-3 h-52 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-600 rounded-full border-2 border-gray-500 shadow-2xl">
            </div>
            
            {/* CLASSIC CURVED SCYTHE BLADE */}
            <div className="absolute -top-4 -right-4 w-28 h-16">
              {/* Main curved blade - classic scythe shape */}
              <div className="absolute top-4 left-0 w-24 h-8 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 border-2 border-gray-500 shadow-2xl"
                   style={{
                     borderRadius: "0 30px 30px 0",
                     transform: "rotate(-20deg)",
                     transformOrigin: "left center"
                   }}>
                {/* Blade shine */}
                <div className="absolute top-1 left-2 w-16 h-2 bg-gradient-to-r from-white/90 to-transparent rounded-r-full opacity-90" />
                {/* Sharp cutting edge */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-r-full shadow-lg shadow-white/70" />
                {/* Inner edge detail */}
                <div className="absolute top-2 left-1 w-20 h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded-r-full opacity-60" />
              </div>
              
              {/* Blade-to-handle connection */}
              <div className="absolute top-2 -left-2 w-4 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded border-2 border-gray-500" />
              
              {/* Scythe tip */}
              <div className="absolute top-0 right-2 w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-400 transform rotate-45 border border-gray-500" />
            </div>
            
            {/* Death Aura around Scythe */}
            {isGripping && powerLevel > 0.3 && (
              <div className="absolute -top-8 -right-8 w-20 h-12">
                <div className="absolute inset-0 bg-red-600/40 blur-md animate-pulse rounded-full" />
                <div className="absolute inset-2 bg-red-500/30 blur-lg animate-pulse rounded-full" />
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