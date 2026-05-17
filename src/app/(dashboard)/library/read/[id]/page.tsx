"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Document, Page, pdfjs } from "react-pdf"
import * as Popover from "@radix-ui/react-popover"
import { 
  ArrowLeft, Loader2, VolumeX, 
  ChevronLeft, ChevronRight, Minus, Plus, 
  Settings2, CloudRain, Flame, Trees, Library as LibraryIcon,
  Hash
} from "lucide-react"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type AmbientSound = 'rain' | 'forest' | 'fireplace' | 'library' | 'off';
type ReadingMode = 'Yoritgich' | 'Tun' | 'Kun';

interface IPageFlip {
  loadFromHTML: (items: NodeListOf<Element> | HTMLElement[]) => void;
  on: (event: string, callback: (e: { data: number }) => void) => void;
  flipNext: () => void;
  flipPrev: () => void;
  flip: (pageIndex: number, corner?: 'top' | 'bottom') => void;
  destroy: () => void;
}

export default function BookReaderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pdfId = searchParams.get("pdf_id")
  
  const bookRef = useRef<IPageFlip | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef<boolean>(true);

  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pdfLoading, setPdfLoading] = useState<boolean>(true)
  const [zoom, setZoom] = useState<number>(1)
  const [readingMode, setReadingMode] = useState<ReadingMode>('Yoritgich');
  const [activeAmbient, setActiveAmbient] = useState<AmbientSound>('off');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.3);
  const [isFlippingSound, setIsFlippingSound] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const [jumpPage, setJumpPage] = useState<string>("");

  const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/file/${pdfId}`

  useEffect(() => {
    soundEnabledRef.current = isFlippingSound;
  }, [isFlippingSound]);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 768) {
        const w = width - 40;
        setDimensions({ width: w, height: w * 1.4 });
      } else if (width < 1280) {
        const w = (width / 2) - 60;
        setDimensions({ width: w, height: w * 1.4 });
      } else {
        const w = Math.min(width * 0.35, 550);
        setDimensions({ width: w, height: w * 1.41 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (activeAmbient === 'off') {
      audioRef.current?.pause();
      return;
    }
    if (audioRef.current) {
      audioRef.current.src = `/sounds/${activeAmbient}.mp3`;
      audioRef.current.loop = true;
      audioRef.current.volume = ambientVolume;
      audioRef.current.play().catch(() => {});
    }
  }, [activeAmbient, ambientVolume]);

  useEffect(() => {
    if (!numPages) return;
    let pageFlipInstance: IPageFlip | null = null;

    const initFlip = async () => {
      try {
        // @ts-expect-error (Ochrvorma jaska error line berad)
        const { PageFlip } = await import("page-flip");
        const htmlElement = document.getElementById("book-flip");
        
        if (htmlElement) {
          pageFlipInstance = new PageFlip(htmlElement, {
            width: dimensions.width,
            height: dimensions.height,
            size: "fixed",
            drawShadow: true,
            flippingTime: 1000,
            usePortrait: window.innerWidth < 1024,
            startPage: 0,
            showCover: true,
            mobileDefaultOnInit: true,
            clickEventForward: true,
          }) as unknown as IPageFlip;

          const pages = document.querySelectorAll(".page-container");
          if (pages.length > 0) {
            pageFlipInstance.loadFromHTML(pages);
            bookRef.current = pageFlipInstance;
          }

          pageFlipInstance.on("flip", (e: { data: number }) => {
            setCurrentPage(e.data);
            if (soundEnabledRef.current && flipSoundRef.current) {
              flipSoundRef.current.currentTime = 0;
              flipSoundRef.current.play().catch(() => {});
            }
          });
        }
      } catch (error) {
        console.error("PageFlip loading error:", error);
      }
    };

    const timer = setTimeout(initFlip, 600);
    return () => {
      clearTimeout(timer);
      if (pageFlipInstance) pageFlipInstance.destroy();
    }
  }, [numPages, dimensions]);

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pNum = parseInt(jumpPage);
    if (bookRef.current && pNum > 0 && pNum <= (numPages || 0)) {
      bookRef.current.flip(pNum - 1);
      setJumpPage("");
    }
  };

  const modeConfig = useMemo(() => {
    const configs = {
      Yoritgich: {
        bg: "bg-[#1a1612]",
        overlay: "radial-gradient(circle at 50% -20%, rgba(255, 230, 150, 0.15) 0%, transparent 70%)",
        lampColor: "rgba(255, 200, 100, 0.2)",
        pageFilter: "sepia(0.2) contrast(1.05)",
        paperColor: "#fdfbf7"
      },
      Tun: {
        bg: "bg-[#05070a]",
        overlay: "radial-gradient(circle at 50% -30%, rgba(150, 200, 255, 0.1) 0%, transparent 60%)",
        lampColor: "rgba(100, 150, 255, 0.1)",
        pageFilter: "brightness(0.8) grayscale(0.2)",
        paperColor: "#e5e7eb"
      },
      Kun: {
        bg: "bg-[#1c100b]",
        overlay: "radial-gradient(circle at 50% -20%, rgba(255, 100, 0, 0.12) 0%, transparent 80%)",
        lampColor: "rgba(255, 80, 0, 0.15)",
        pageFilter: "sepia(0.4) saturate(1.2)",
        paperColor: "#fff4e6"
      }
    };
    return configs[readingMode];
  }, [readingMode]);

  return (
    <div className={`fixed inset-0 ${modeConfig.bg} flex flex-col z-50 overflow-hidden transition-all duration-1000`}>
      <audio ref={audioRef} />
      <audio ref={flipSoundRef} src="/sounds/page-flip.mp3" preload="auto" />
      
      <div className="absolute inset-0 pointer-events-none z-10 transition-all duration-1000" style={{ background: modeConfig.overlay }} />

      <div className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold ml-2">ZUKKOMA KUTUBXONASI</div>
        </div>

        <div className="flex items-center bg-white/5 rounded-full px-3 py-1 border border-white/10 gap-3">
          <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="text-white/40 hover:text-white"><Minus className="h-4 w-4" /></button>
          <span className="text-[11px] font-mono text-amber-500 w-10 text-center">{Math.round(zoom * 100)}%</span>  
          <button onClick={() => setZoom(z => Math.min(z + 0.1, 3))} className="text-white/40 hover:text-white"><Plus className="h-4 w-4" /></button>
        </div>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all">
              <Settings2 className="h-5 w-5" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="w-72 bg-[#121212]/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-2xl z-100 outline-none" sideOffset={10}>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold block mb-3 text-center">Yoruqlik</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Yoritgich', 'Tun', 'Kun'] as const).map((m) => (
                      <button key={m} onClick={() => setReadingMode(m)} className={`py-2 text-[9px] rounded border transition-all uppercase ${readingMode === m ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/5 text-white/40 hover:bg-white/5'}`}>{m}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3 text-[10px] uppercase tracking-widest text-amber-500 font-bold"><span>Muhit ovozlari</span></div>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    <button onClick={() => setActiveAmbient('rain')} className={`p-2 rounded-lg border transition-all ${activeAmbient === 'rain' ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-white/5 text-white/30 hover:bg-white/5'}`}><CloudRain className="h-4 w-4 mx-auto" /></button>
                    <button onClick={() => setActiveAmbient('forest')} className={`p-2 rounded-lg border transition-all ${activeAmbient === 'forest' ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-white/5 text-white/30 hover:bg-white/5'}`}><Trees className="h-4 w-4 mx-auto" /></button>
                    <button onClick={() => setActiveAmbient('fireplace')} className={`p-2 rounded-lg border transition-all ${activeAmbient === 'fireplace' ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'border-white/5 text-white/30 hover:bg-white/5'}`}><Flame className="h-4 w-4 mx-auto" /></button>
                    <button onClick={() => setActiveAmbient('library')} className={`p-2 rounded-lg border transition-all ${activeAmbient === 'library' ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-white/5 text-white/30 hover:bg-white/5'}`}><LibraryIcon className="h-4 w-4 mx-auto" /></button>
                    <button onClick={() => setActiveAmbient('off')} className={`p-2 rounded-lg border transition-all ${activeAmbient === 'off' ? 'border-white/20 text-white' : 'border-white/5 text-white/30 hover:bg-white/5'}`}><VolumeX className="h-4 w-4 mx-auto" /></button>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={ambientVolume} onChange={(e) => setAmbientVolume(parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase text-white/40 tracking-wider">Sahifa ovozi</span>
                  <button onClick={() => setIsFlippingSound(!isFlippingSound)} className={`w-9 h-5 rounded-full p-1 transition-colors ${isFlippingSound ? 'bg-amber-600' : 'bg-white/10'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isFlippingSound ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4 scrollbar-hide">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-600 pointer-events-none z-20 blur-[120px] opacity-60 transition-all duration-1000"
          style={{ background: `radial-gradient(circle at 50% 0%, ${modeConfig.lampColor} 0%, transparent 70%)` }}
        />

        <div 
          className="transition-all duration-500 ease-out flex items-center justify-center z-10" 
          style={{ transform: `scale(${zoom})`, minWidth: dimensions.width }}
        >
          {pdfLoading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
              <p className="text-white/20 text-[10px] tracking-widest uppercase">Sahifalar yuklanmoqda...</p>
            </div>
          )}
          
          <Document file={pdfUrl} onLoadSuccess={({ numPages: total }) => { setNumPages(total); setPdfLoading(false); }}>
            {numPages && (
              <div id="book-flip" className="mx-auto shadow-[0_60px_120px_-30px_rgba(0,0,0,1)]">
                {Array.from(new Array(numPages), (_, index) => (
                  <div key={`page_${index + 1}`} className="page-container overflow-hidden" style={{ backgroundColor: modeConfig.paperColor }}>
                    <Page 
                      pageNumber={index + 1} 
                      width={dimensions.width} 
                      height={dimensions.height}
                      renderAnnotationLayer={false} 
                      renderTextLayer={false} 
                      loading={<div style={{ width: dimensions.width, height: dimensions.height }} className="bg-white/5" />}
                    />
                    <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-15 bg-linear-to-r from-black/20 via-transparent to-black/20" />
                  </div>
                ))}
              </div>
            )}
          </Document>
        </div>

        <div className="fixed inset-y-0 left-0 right-0 hidden md:flex justify-between items-center px-6 pointer-events-none z-40">
          <button onClick={() => bookRef.current?.flipPrev()} className="h-14 w-14 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/5 pointer-events-auto transition-all flex items-center justify-center group"><ChevronLeft className="h-6 w-6 text-white/20 group-hover:text-white" /></button>
          <button onClick={() => bookRef.current?.flipNext()} className="h-14 w-14 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/5 pointer-events-auto transition-all flex items-center justify-center group"><ChevronRight className="h-6 w-6 text-white/20 group-hover:text-white" /></button>
        </div>
      </div>

      <div className="h-14 bg-black/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center gap-6 z-30 px-6">
        <div className="flex items-center gap-3">
          <form onSubmit={handleJumpToPage} className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2 py-1">
            <Hash className="h-3 w-3 text-white/20 mr-1" />
            <input 
              type="text"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value.replace(/\D/g, ''))}
              placeholder={`${currentPage + 1}`}
              className="w-10 bg-transparent text-[10px] font-mono text-white focus:outline-none placeholder:text-white/40"
            />
          </form>
          <span className="text-[10px] text-white/20 font-mono">/</span>
          <span className="text-[10px] text-white/40 font-mono">{numPages || 0}</span>
        </div>
        
        <div className="flex-1 max-w-md h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-amber-900 to-amber-500 transition-all duration-500" style={{ width: `${((currentPage + 1) / (numPages || 1)) * 100}%` }} />
        </div>
        <div className="w-12 hidden sm:block" />
      </div>

      <style jsx global>{`
        canvas { 
          max-width: 100% !important; 
          height: auto !important; 
          filter: ${modeConfig.pageFilter};
          transition: filter 1.5s ease;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .stPageFlip { background-color: transparent !important; }
        .page-container { position: relative; }
        @media (max-width: 768px) { .page-container { cursor: pointer; } }
      `}</style>
    </div>
  )
}