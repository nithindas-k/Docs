"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, Car, FileText, Landmark, GraduationCap, 
  UserCheck, Info, X, Shield, Lock, Wallet, 
  Key, Globe, Briefcase, Heart, Home, Plane, Map, 
  Smartphone, Mail, Calendar, Star, Gift, 
  Database, Fingerprint, 
  PiggyBank, Receipt, Zap,
  Wifi, Umbrella, Activity,
  Link, Paperclip, Archive,
  FolderOpen, Cloud, Bell, Camera, Plus
} from "lucide-react";
import { cn } from "../../lib/utils";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const AVAILABLE_ICONS = [
  { id: 'file-text', icon: <FileText className="w-5 h-5" /> },
  { id: 'credit-card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'shield', icon: <Shield className="w-5 h-5" /> },
  { id: 'lock', icon: <Lock className="w-5 h-5" /> },
  { id: 'wallet', icon: <Wallet className="w-5 h-5" /> },
  { id: 'key', icon: <Key className="w-5 h-5" /> },
  { id: 'passport', icon: <Fingerprint className="w-5 h-5" /> },
  { id: 'landmark', icon: <Landmark className="w-5 h-5" /> },
  { id: 'graduation-cap', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 'user-check', icon: <UserCheck className="w-5 h-5" /> },
  { id: 'car', icon: <Car className="w-5 h-5" /> },
  { id: 'plane', icon: <Plane className="w-5 h-5" /> },
  { id: 'map', icon: <Map className="w-5 h-5" /> },
  { id: 'briefcase', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'heart', icon: <Heart className="w-5 h-5" /> },
  { id: 'home', icon: <Home className="w-5 h-5" /> },
  { id: 'globe', icon: <Globe className="w-5 h-5" /> },
  { id: 'piggy-bank', icon: <PiggyBank className="w-5 h-5" /> },
  { id: 'receipt', icon: <Receipt className="w-5 h-5" /> },
  { id: 'activity', icon: <Activity className="w-5 h-5" /> },
  { id: 'smartphone', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'mail', icon: <Mail className="w-5 h-5" /> },
  { id: 'calendar', icon: <Calendar className="w-5 h-5" /> },
  { id: 'zap', icon: <Zap className="w-5 h-5" /> },
  { id: 'wifi', icon: <Wifi className="w-5 h-5" /> },
  { id: 'star', icon: <Star className="w-5 h-5" /> },
  { id: 'gift', icon: <Gift className="w-5 h-5" /> },
  { id: 'archive', icon: <Archive className="w-5 h-5" /> },
  { id: 'folder-open', icon: <FolderOpen className="w-5 h-5" /> },
  { id: 'camera', icon: <Camera className="w-5 h-5" /> },
  { id: 'database', icon: <Database className="w-5 h-5" /> },
  { id: 'cloud', icon: <Cloud className="w-5 h-5" /> },
  { id: 'umbrella', icon: <Umbrella className="w-5 h-5" /> },
  { id: 'bell', icon: <Bell className="w-5 h-5" /> },
  { id: 'link', icon: <Link className="w-5 h-5" /> },
  { id: 'paperclip', icon: <Paperclip className="w-5 h-5" /> },
];

interface CategoryFormCardProps {
  initialData?: {
    name: string;
    icon: string;
  };
  onSubmit: (data: { name: string; icon: string }) => void;
  onCancel: () => void;
  className?: string;
}

export const CategoryFormCard: React.FC<CategoryFormCardProps> = ({
  initialData,
  onSubmit,
  onCancel,
  className,
}) => {
  const [name, setName] = React.useState(initialData?.name || "");
  const [selectedIcon, setSelectedIcon] = React.useState(initialData?.icon || "file-text");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), icon: selectedIcon });
  };

  const selectedIconComponent = AVAILABLE_ICONS.find(i => i.id === selectedIcon)?.icon || <FileText className="w-5 h-5" />;

  const ICON_GROUPS = [
    {
      title: "Security & Tech",
      icons: AVAILABLE_ICONS.filter(i => ['lock', 'shield', 'key', 'fingerprint', 'scan-face', 'database', 'cpu', 'hard-drive'].includes(i.id))
    },
    {
      title: "Finance",
      icons: AVAILABLE_ICONS.filter(i => ['wallet', 'credit-card', 'landmark', 'piggy-bank', 'receipt', 'receipt-indian-rupee', 'zap'].includes(i.id))
    },
    {
      title: "Personal",
      icons: AVAILABLE_ICONS.filter(i => ['user-check', 'home', 'heart', 'star', 'gift', 'mail', 'calendar'].includes(i.id))
    },
    {
      title: "Travel & Work",
      icons: AVAILABLE_ICONS.filter(i => ['briefcase', 'plane', 'car', 'map', 'globe', 'smartphone'].includes(i.id))
    },
    {
        title: "All Icons",
        icons: AVAILABLE_ICONS
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-black text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10",
        className
      )}
    >
      <div className="flex h-full min-h-[500px] flex-col md:flex-row">
        {/* --- Left Column: Selection & Identity --- */}
        <div className="flex flex-1 flex-col border-r border-white/5 p-8 md:max-w-xs">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight text-white/90">Add Category</h3>
            <button
              onClick={onCancel}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-8 flex-1">
            {/* Identity Group */}
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Category Identity</Label>
               </div>
               <div className="group relative">
                <Input
                  type="text"
                  placeholder="e.g. Identity"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/20 px-4 transition-all group-hover:bg-white/[0.05]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 transition-opacity group-focus-within:opacity-100">
                    {selectedIconComponent}
                </div>
               </div>
               <p className="text-[10px] text-white/20 px-1">Choose a unique name for your folder.</p>
            </div>

            {/* Selected View */}
            <div className="pt-4">
                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Preview Mode</Label>
                 <div className="aspect-square w-full rounded-3xl bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group transition-all hover:border-white/20">
                    <div className="p-6 rounded-[2rem] bg-white text-black shadow-2xl transition-transform group-hover:scale-110">
                        {React.cloneElement(selectedIconComponent as React.ReactElement, { className: "w-8 h-8" })}
                    </div>
                    <span className="text-[10px] font-bold text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">{name || 'Vault'}</span>
                 </div>
            </div>
          </div>

          <div className="pt-6">
            <button className="text-[11px] font-bold text-white/30 hover:text-white transition-colors flex items-center gap-2">
                <Info className="w-3 h-3" />
                Need help? <span className="underline">Support</span>
            </button>
          </div>
        </div>

        {/* --- Right Column: Icon Library Sections --- */}
        <div className="flex-[2] bg-neutral-900/40 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h4 className="text-xl font-bold text-white">Choose Icon</h4>
                    <p className="text-xs text-white/40">Select a visual marker for this category</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                    <Plus className="w-5 h-5" />
                </div>
            </div>

            <div className="h-[400px] space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                {ICON_GROUPS.map((group, idx) => (
                    <div key={idx} className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-1">{group.title}</Label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {group.icons.map((item) => (
                                <button
                                    key={`${group.title}-${item.id}`}
                                    type="button"
                                    onClick={() => setSelectedIcon(item.id)}
                                    className={cn(
                                        "h-12 w-full flex items-center justify-center rounded-2xl transition-all duration-300",
                                        selectedIcon === item.id 
                                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 z-10" 
                                            : "bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/10"
                                    )}
                                    title={item.id}
                                >
                                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-center justify-end gap-6 pt-6 border-t border-white/5">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="text-sm font-bold text-white/30 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <Button 
                    onClick={handleSubmit}
                    className="bg-white text-black hover:bg-[#eaeaea] rounded-2xl px-12 h-14 text-sm font-black transition-all shadow-[0_8px_16px_rgba(0,0,0,0.4)] active:scale-95"
                >
                    Create Category
                </Button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};
