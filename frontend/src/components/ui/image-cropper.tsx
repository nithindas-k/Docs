"use client";

import * as React from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "./button";
import { Slider } from "./slider";
import { getCroppedImg } from "../../lib/cropImage";

interface ImageCropperProps {
  imageSrc: string | null;
  onCropComplete?: (croppedImage: string) => void;
  onCancel?: () => void;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
  const [aspect, setAspect] = React.useState<number | undefined>(undefined);

  const onCropDone = React.useCallback((_: Area, pixelCrop: Area) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (onCropComplete) onCropComplete(cropped);
    } catch (e) {
      console.error("Failed to apply crop:", e);
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="flex flex-col w-full h-full gap-8">
      {/* 1. Cropper Box: Flat and Clean */}
      <div
        style={{ height: '360px', width: '100%', minHeight: '360px' }}
        className="relative bg-black rounded-lg overflow-hidden border border-border"
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropDone}
          classes={{ containerClassName: "cursor-move" }}
        />
      </div>

      {/* 2. Flat Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-10">Zoom</span>
          <Slider
            value={[zoom]}
            onValueChange={(v: number[]) => setZoom(v[0] || 1)}
            min={1}
            max={3}
            step={0.01}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-10">Ratio</span>
          <div className="flex flex-1 items-center gap-1 border border-border/40 rounded-md p-0.5">
            {[
              { label: "1:1", val: 1 },
              { label: "4:3", val: 4 / 3 },
              { label: "16:9", val: 16 / 9 },
              { label: "Free", val: undefined },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAspect(opt.val)}
                className={`flex-1 py-1.5 rounded text-[10px] font-bold transition-all ${aspect === opt.val
                    ? "bg-accent text-foreground shadow-sm"
                    : "text-muted-foreground/60 hover:text-foreground"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Flat Action Row */}
      <div className="mt-4 flex gap-2">
        <Button onClick={onCancel} variant="ghost" className="h-10 text-[10px] font-bold uppercase tracking-widest px-6">
          Cancel
        </Button>
        <Button onClick={() => onCropComplete?.(imageSrc)} variant="outline" className="h-10 text-[10px] font-bold uppercase tracking-widest px-6 border-border/60 hover:bg-accent/30">
          Use Full Image
        </Button>
        <div className="flex-1" />
        <Button onClick={handleApply} className="h-10 px-8 rounded-md text-[10px] font-bold uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all">
          Apply & Save
        </Button>
      </div>
    </div>
  );
}
