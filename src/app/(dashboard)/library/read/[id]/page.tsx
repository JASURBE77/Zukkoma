"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Document, Page, pdfjs } from "react-pdf"
import { ArrowLeft, Loader2, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface IPageFlip {
  loadFromHTML: (items: NodeListOf<Element>) => void;
  on: (event: string, callback: (e: { data: number }) => void) => void;
  flipNext: () => void;
  flipPrev: () => void;
  destroy: () => void;
}

export default function BookReaderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pdfId = searchParams.get("pdf_id")
  
  const bookRef = useRef<IPageFlip | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [pdfLoading, setPdfLoading] = useState<boolean>(true)

  const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/file/${pdfId}`
  const [dimensions, setDimensions] = useState({ width: 450, height: 635 });

  const soundRef = useRef(soundEnabled);
  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const w = window.innerWidth - 40;
        setDimensions({ width: w, height: w * 1.41 });
      } else {
        setDimensions({ width: 450, height: 635 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!numPages) return;

    let pageFlipInstance: IPageFlip | null = null;

    const initFlip = async () => {
      // @ts-expect-error (Ochrvorma jaska error line berad)
      const { PageFlip } = await import("page-flip");
      const htmlElement = document.getElementById("book-flip");
      
      if (htmlElement) {
        pageFlipInstance = new PageFlip(htmlElement, {
          width: dimensions.width,
          height: dimensions.height,
          size: "stretch", 
          minWidth: 280,
          maxWidth: 1000,
          minHeight: 400,
          maxHeight: 1400,
          drawShadow: true,
          flippingTime: 800,
          usePortrait: window.innerWidth < 768,
          startPage: 0,
          showCover: true,
          mobileDefaultOnInit: true,
          clickEventForward: true,
        }) as IPageFlip;

        const pages = document.querySelectorAll(".page-container");
        if (pages.length > 0) {
          pageFlipInstance.loadFromHTML(pages);
          bookRef.current = pageFlipInstance;
        }

        pageFlipInstance.on("flip", (e: { data: number }) => {
          setCurrentPage(e.data);
          if (soundRef.current) {
            const audio = new Audio("/sounds/page-flip.mp3")
            audio.volume = 0.2
            audio.play().catch(() => {});
          }
        });
      }
    };

    const timer = setTimeout(() => {
      initFlip();
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (pageFlipInstance) pageFlipInstance.destroy();
    };
  }, [numPages, dimensions]); 

  const onDocumentLoadSuccess = ({ numPages: total }: { numPages: number }) => {
    setNumPages(total);
    setPdfLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#121212] flex flex-col z-50 overflow-hidden select-none">
      
      <div className="h-14 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 flex items-center justify-between z-30">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/60">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="text-[11px] font-mono font-bold text-white/80 bg-white/10 px-3 py-1 rounded-md border border-white/10">
          {currentPage + 1} / {numPages || 0}
        </div>

        <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} className="text-white/60">
          {soundEnabled ? <Volume2 className="h-4 w-4 text-blue-400" /> : <VolumeX className="h-4 w-4 text-red-400" />}
        </Button>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-2 sm:p-8 bg-[#1a1a1a] overflow-hidden">
        {pdfLoading && (
          <div className="flex flex-col items-center gap-4 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        )}

        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages && (
            <div id="book-flip" className="mx-auto shadow-2xl shadow-black">
              {Array.from(new Array(numPages), (_, index) => (
                <div key={`page_${index + 1}`} className="page-container bg-white">
                  <div className="absolute inset-y-0 left-0 w-full h-full pointer-events-none z-10 bg-linear-to-r from-black/5 via-transparent to-black/5" />
                  <Page 
                    pageNumber={index + 1} 
                    width={dimensions.width}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading=""
                  />
                </div>
              ))}
            </div>
          )}
        </Document>
      </div>

      <div className="fixed bottom-6 inset-x-0 flex justify-between px-6 z-40 pointer-events-none">
        <Button 
          onClick={() => bookRef.current?.flipPrev()} 
          className="h-12 w-12 rounded-full bg-black/50 backdrop-blur-lg border border-white/10 text-white pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button 
          onClick={() => bookRef.current?.flipNext()} 
          className="h-12 w-12 rounded-full bg-black/50 backdrop-blur-lg border border-white/10 text-white pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <style jsx global>{`
        .page-container {
          overflow: hidden;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        canvas {
          max-width: 100% !important;
          height: auto !important;
        }
        .stPageFlip {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  )
}