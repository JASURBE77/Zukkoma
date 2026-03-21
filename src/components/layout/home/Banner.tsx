"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Taqvim from "../../../assets/ramazon_taqvimi_2026.jpg"
import { Clock, Timer as TimerIcon } from "lucide-react"
import { Button } from '@/components/ui/button'

const Banner = () => {
  const iftorVaqti = "18:45:00"; 
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const hozir = new Date();
      const bugunStr = hozir.toISOString().split('T')[0];
      const target = new Date(`${bugunStr}T${iftorVaqti}`);
      const farq = target.getTime() - hozir.getTime();

      if (farq <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(timer);
      } else {
        const soat = Math.floor((farq / (1000 * 60 * 60)) % 24);
        const minut = Math.floor((farq / 1000 / 60) % 60);
        const sekund = Math.floor((farq / 1000) % 60);
        setTimeLeft(
          `${soat.toString().padStart(2, '0')}:${minut.toString().padStart(2, '0')}:${sekund.toString().padStart(2, '0')}`
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [iftorVaqti]);

  return (
    // 'flex flex-col lg:flex-row' - katta ekranlarda yonma-yon, kichikda ustma-ust
    <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
      
      {/* 1. Rasm qismi (Kenglikni 40% qildik) */}
      <div className="relative overflow-hidden rounded-[2rem] shadow-xl border border-slate-100 flex-1 lg:max-w-[40%]">
        <Image 
          src={Taqvim} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
          alt="Ramazon taqvimi 2026" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
      </div>

      {/* 2. Timer Kartasi (Kenglikni 60% qildik) */}
      <div className="flex-[1.5] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 flex flex-col justify-between gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <TimerIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Iftorlikka qoldi</h3>
              <p className="text-sm text-slate-500 font-medium">Bugungi vaqt: <span className="text-blue-600 font-bold">{iftorVaqti.slice(0,5)}</span></p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-widest">
              Ramazon 2026
            </span>
          </div>
        </div>

        {/* Timer Raqamlari (Katta va chiroyli) */}
        <div className="flex items-center justify-center lg:justify-start gap-4 py-4">
          {timeLeft.split(":").map((unit, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 lg:w-24 lg:h-24 rounded-[1.5rem] flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner">
                  <span className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tabular-nums">
                    {unit}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                  {index === 0 ? "Soat" : index === 1 ? "Minut" : "Sekund"}
                </span>
              </div>
              {index < 2 && (
                <span className="text-3xl font-light text-slate-300 mb-6">:</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4 pt-2">
            <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25">
           
             O'giz ochish duosi
            </Button>
        </div>
      </div>
    </div>
  )
}

export default Banner