import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { useNavigate, Navigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { ScannerCardStream } from '../components/ui/scanner-card-stream';
import { Shield, Lock, Smartphone, Zap } from 'lucide-react';
import { Theme } from '../components/ui/theme';
import { useAppSelector } from '../features/hooks';

export function Landing() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  if (token) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground transition-colors duration-700 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg font-mono tracking-tight">DOCS</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Theme variant="tabs" size="sm" />
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
          <Button size="sm" onClick={() => navigate('/login')} className="rounded-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
            <Zap className="h-3 w-3" /> Next-Gen Secure Vault
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Secure your documents <br className="hidden md:block" />
            <span className="text-primary">with military-grade </span> precision.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto font-medium">
            Encrypt, store, and manage your sensitive data—Aadhar, PAN, Driving Licenses, and more—in a highly secure digital vault.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/login')} className="h-11 px-6 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              Start Your Vault
            </Button>
          </div>
        </motion.div>
      </section>

      {/* MID PART: Interactive Scanner Stream */}
      <section className="relative py-12 md:py-16 bg-card/40 border-y shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 mb-8 flex flex-col items-center text-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Real-time Document Scanning</h2>
          <p className="text-sm text-muted-foreground font-medium max-w-md">Watch as your sensitive records are digitized and encrypted with state-of-the-art precision.</p>
        </div>
        <ScannerCardStream />
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-4 max-w-5xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { icon: Shield, title: "Pure Security", text: "Every file is encrypted with AES-256 before it ever touches our storage." },
            { icon: Lock, title: "Member Controlled", text: "Exclusive access via Google-backed biometric and passkey authentication." },
            { icon: Smartphone, title: "Mobile Ready", text: "Access your vault from anywhere with the ultra-responsive web dashboard." }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-card border flex items-center justify-center shadow-sm transition-all group-hover:scale-105 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-primary/5">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-medium max-w-[250px]">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 px-4 border-t text-center bg-card/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary/40" />
            <span className="font-bold text-sm text-primary/40 tracking-tight">DOCS</span>
          </div>
          <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">© 2026 Docs Digital Security Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
