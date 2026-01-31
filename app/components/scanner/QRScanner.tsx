"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Loader2, Camera, CameraOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // 1. تهيئة الماسح الضوئي عند تحميل المكون
    scannerRef.current = new Html5Qrcode("reader");

    // تشغيل الكاميرا تلقائياً
    startScanner();

    // 2. تنظيف الكاميرا عند إغلاق الصفحة (مهم جداً)
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // البدء باستخدام الكاميرا الخلفية (Environment)
      await scannerRef.current?.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // في حال النجاح
          onScanSuccess(decodedText);
          // اختيارياً: إيقاف المسح مؤقتاً لتجنب التكرار
          // stopScanner();
        },
        (errorMessage) => {
          // أخطاء البحث عن كود (نتجاهلها لكي يستمر المسح)
        },
      );
    } catch (err) {
      console.log("خطأ في تشغيل الكاميرا:", err);
      setError("تعذر الوصول إلى الكاميرا. تأكد من إعطاء الصلاحية.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("فشل إيقاف الكاميرا:", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* حاوية الكاميرا مع لمسة تصميمية */}
      <div className="relative w-full max-w-sm aspect-square overflow-hidden rounded-[40px] border-4 border-white shadow-2xl bg-gray-900">
        {/* العنصر الذي ستظهر فيه الكاميرا */}
        <div id="reader" className="w-full h-full"></div>

        {/* غطاء بصري (Scanner Overlay) */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20">
            <div className="w-full h-full border-2 border-blue-500 rounded-2xl animate-pulse flex items-center justify-center">
              <div className="w-full h-0.5 bg-blue-500 absolute top-1/2 left-0 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-line"></div>
            </div>
          </div>
        )}

        {/* شاشة الخطأ */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
            <CameraOff className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-sm font-bold">{error}</p>
            <Button
              onClick={startScanner}
              variant="outline"
              className="mt-4 rounded-xl border-white/20"
            >
              إعادة المحاولة
            </Button>
          </div>
        )}
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-4">
        {!isScanning && !error && (
          <Button
            onClick={startScanner}
            className="bg-blue-600 rounded-2xl px-8 py-6 font-bold gap-2"
          >
            <Camera className="w-5 h-5" /> تشغيل الكاميرا
          </Button>
        )}
        {isScanning && (
          <Button
            onClick={stopScanner}
            variant="destructive"
            className="rounded-2xl px-8 py-6 font-bold gap-2"
          >
            <RefreshCw className="w-5 h-5" /> إيقاف الكاميرا
          </Button>
        )}
      </div>

      <style jsx global>{`
        /* إخفاء واجهة المكتبة الافتراضية القبيحة */
        #reader__dashboard,
        #reader__status_span {
          display: none !important;
        }
        #reader video {
          object-fit: cover !important;
          border-radius: 36px;
        }
        @keyframes scan-line {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
