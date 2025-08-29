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
  const [isBlinking, setIsBlinking] = useState(false);
  
  const isGainingTime = todayContribution > 0;
  const isCriticallyLow = timeRemaining.years < 1 && timeRemaining.months < 6;
  
  useEffect(() => {
    // Eye blinking every 5 seconds
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200); // Blink for 200ms
    }, 5000);

    return () => clearInterval(blinkInterval);
  }, []);

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
      {/* TERRIFYING Dark Aura/Energy Field - MUCH MORE INTENSE */}
      <div className={cn(
        "absolute inset-0 transition-all duration-1000",
        isGripping && "animate-pulse"
      )}>
        <div className="absolute inset-0 bg-gradient-radial from-red-900/40 via-black/60 to-transparent rounded-full blur-xl" />
        <div className="absolute inset-0 bg-gradient-radial from-black/80 via-red-950/30 to-transparent rounded-full blur-2xl animate-pulse" />
        {powerLevel > 0.5 && (
          <div className="absolute inset-0 bg-gradient-radial from-red-500/50 via-transparent to-transparent animate-pulse" />
        )}
        {/* Dark energy waves */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-red-800/20 to-transparent animate-pulse rounded-full scale-125" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-transparent animate-pulse rounded-full scale-150 animation-delay-1000" />
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
        
        {/* Death's Imposing Figure - SMALLER SIZE */}
        <div className="relative scale-75">
          {/* MENACING DEATH HOOD - CURVED AND FLOWING */}
          <div className="relative w-36 h-44 mx-auto">
            {/* Outer Hood Shape - Natural curved hood */}
            <div className="absolute top-0 w-full h-36 bg-black shadow-2xl border-2 border-gray-900"
                 style={{
                   clipPath: "polygon(25% 0%, 75% 0%, 90% 15%, 95% 35%, 90% 55%, 85% 75%, 75% 90%, 25% 90%, 15% 75%, 10% 55%, 5% 35%, 10% 15%)",
                 }}>
              {/* Deep hood interior shadows */}
              <div className="absolute inset-4 bg-gradient-radial from-transparent via-black/80 to-black rounded-full" />
              <div className="absolute inset-6 bg-gradient-radial from-transparent to-black opacity-90" />
              
              {/* Hood opening - creates depth */}
              <div className="absolute top-8 left-6 right-6 bottom-4 bg-black rounded-t-full opacity-95" />
            </div>
          </div>
            
            {/* Menacing Skull Face - CLEAN WITHOUT SILVER */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-22 h-26">
              {/* SKELETAL Skull base - no silver elements */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 opacity-20 border-2 border-gray-700"
                   style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 65%, 95% 85%, 85% 100%, 15% 100%, 5% 85%, 0% 65%)" }} />
              
              {/* TERRIFYING Glowing Red Eye Sockets */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                <div className="relative">
                  <div className="w-5 h-7 bg-black rounded-full border-2 border-gray-800" />
                   <div className={cn(
                     "absolute top-0.5 left-0.5 w-4 h-5 rounded-full transition-all duration-300",
                     isCriticallyLow ? "bg-red-600 animate-pulse shadow-2xl shadow-red-600/90" : "bg-red-500 shadow-2xl shadow-red-500/80",
                     isGainingTime && "bg-orange-500 animate-bounce shadow-2xl shadow-orange-500/90",
                     isBlinking && "opacity-0"
                   )} />
                  {/* Intense inner glow */}
                  <div className="absolute top-1 left-1 w-3 h-3 bg-red-300 rounded-full opacity-90" />
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-white rounded-full opacity-60" />
                  {/* Eye glow effect */}
                  <div className="absolute -inset-2 bg-red-500/40 rounded-full blur-md animate-pulse" />
                </div>
                <div className="relative">
                  <div className="w-5 h-7 bg-black rounded-full border-2 border-gray-800" />
                   <div className={cn(
                     "absolute top-0.5 left-0.5 w-4 h-5 rounded-full transition-all duration-300",
                     isCriticallyLow ? "bg-red-600 animate-pulse shadow-2xl shadow-red-600/90" : "bg-red-500 shadow-2xl shadow-red-500/80",
                     isGainingTime && "bg-orange-500 animate-bounce shadow-2xl shadow-orange-500/90",
                     isBlinking && "opacity-0"
                   )} />
                  <div className="absolute top-1 left-1 w-3 h-3 bg-red-300 rounded-full opacity-90" />
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-white rounded-full opacity-60" />
                  <div className="absolute -inset-2 bg-red-500/40 rounded-full blur-md animate-pulse" />
                </div>
              </div>
              
              {/* Nasal Cavity */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-black"
                   style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
              
               {/* DRAMATIC Facial Expression Changes - SILVER MOUTH */}
               {!isGainingTime ? (
                 // BIG HAPPY SMILE WITH TEETH - SILVER MOUTH
                 <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                   {/* SILVER Smiling mouth opening */}
                   <div className="w-12 h-4 bg-gray-400 rounded-full border-2 border-gray-500" />
                   {/* Visible white teeth */}
                   <div className="absolute top-1 left-2 w-8 h-2 bg-white rounded-sm flex gap-0.5">
                     <div className="w-1 h-full bg-white rounded-sm" />
                     <div className="w-1 h-full bg-white rounded-sm" />
                     <div className="w-1 h-full bg-white rounded-sm" />
                     <div className="w-1 h-full bg-white rounded-sm" />
                     <div className="w-1 h-full bg-white rounded-sm" />
                   </div>
                 </div>
               ) : (
                 // DEEP ANGRY SILVER FROWN
                 <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                   {/* SILVER Frowning mouth - inverted curve */}
                   <div className="w-10 h-3 bg-gray-500 transform rotate-180 rounded-b-full border-2 border-gray-600" />
                 </div>
               )}
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

          {/* MASSIVE Death Scythe - COMPLETELY BLACK, NO GREY */}
          <div className={cn(
            "absolute -right-20 -top-16 transition-all duration-500 z-10",
            isGripping && isGainingTime && "animate-scythe-angry scale-110 rotate-6",
            isCriticallyLow && "animate-pulse"
          )}>
            {/* Long BLACK Scythe Handle - NO GREY */}
            <div className="relative w-3 h-52 bg-gradient-to-b from-black via-black to-black rounded-full border-2 border-black shadow-2xl">
            </div>
            
            {/* CLASSIC CURVED SCYTHE BLADE - PURE SILVER METAL, NO GREY */}
            <div className="absolute -top-4 -right-4 w-28 h-16">
              {/* Main curved blade - classic scythe shape - PURE SILVER */}
              <div className="absolute top-4 left-0 w-24 h-8 bg-gradient-to-br from-slate-200 via-white to-slate-300 border-2 border-black shadow-2xl"
                   style={{
                     borderRadius: "0 30px 30px 0",
                     transform: "rotate(-20deg)",
                     transformOrigin: "left center"
                   }}>
                {/* Blade shine */}
                <div className="absolute top-1 left-2 w-16 h-2 bg-gradient-to-r from-white/90 to-transparent rounded-r-full opacity-90" />
                {/* Sharp cutting edge */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-r-full shadow-lg shadow-white/70" />
                {/* Inner edge detail - WHITE */}
                <div className="absolute top-2 left-1 w-20 h-4 bg-gradient-to-r from-white to-slate-200 rounded-r-full opacity-60" />
              </div>
              
              {/* Blade-to-handle connection - PURE BLACK */}
              <div className="absolute top-2 -left-2 w-4 h-8 bg-gradient-to-r from-black to-black rounded border-2 border-black" />
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

      {/* ULTIMATE TERROR AURA - Death Energy Emanating */}
      {isCriticallyLow && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-radial from-red-700/30 via-black/50 to-transparent animate-pulse rounded-full scale-200 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-radial from-red-600/20 to-transparent animate-pulse rounded-full scale-175 animation-delay-700" />
          {/* Death whispers effect */}
          <div className="absolute top-0 left-1/4 w-2 h-20 bg-red-500/20 blur-sm animate-pulse transform rotate-12" />
          <div className="absolute top-0 right-1/4 w-2 h-20 bg-red-500/20 blur-sm animate-pulse transform -rotate-12 animation-delay-300" />
        </div>
      )}
    </div>
  );
};