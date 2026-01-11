"use client";

import { motion } from "framer-motion";
import { Download, Share, Smartphone, Zap, Shield, Globe, Check } from "lucide-react";
import { useOS } from "@/hooks/use-os";
import { useEffect, useState } from "react";

export default function Home() {
  const os = useOS();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone === true
      );
    }
  }, []);

  if (isStandalone) {
    // This is what users see when they open the installed PWA
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
         <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Welcome to KoshPay</h1>
          <p className="text-gray-400">Secure. Fast. Global.</p>
          <div className="mt-8 p-4 bg-zinc-900 rounded-lg">
             <p>Please log in to continue.</p>
             <button className="mt-4 w-full bg-white text-black font-semibold py-3 px-6 rounded-full">
               Login / Signup
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden selection:bg-purple-500/30">
      
      {/* Navbar Placeholder */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter">KoshPay.</div>
          <div className="hidden md:flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <div className="flex-[1.2] space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Now Live for Android & iOS Web
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
              The Future of <br /> Digital Payments.
            </h1>
            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              Experience lightning-fast transactions, military-grade security, and a seamless global payment network. 
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {os === "android" && (
              <a 
                href="/download/koshpay.apk" // Placeholder path
                className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>Download APK</span>
              </a>
            )}

            {os === "ios" && (
               <div className="flex flex-col gap-4">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl max-w-sm">
                    <div className="flex items-start gap-4">
                       <div className="p-2 bg-zinc-800 rounded-lg">
                          <Share className="w-6 h-6 text-blue-500" />
                       </div>
                       <div>
                          <h3 className="font-semibold text-sm">Install on iOS</h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Tap the Share button below, then scroll down and tap <span className="text-white font-medium">"Add to Home Screen"</span>.
                          </p>
                       </div>
                    </div>
                  </div>
               </div>
            )}

            {(os === "other" || os === "undetermined") && (
               <div className="flex flex-col sm:flex-row gap-4">
                 <button className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all">
                    Get Started
                 </button>
                 <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold border border-zinc-800 hover:bg-zinc-900 transition-all">
                    Learn More
                 </button>
               </div>
            )}
          </motion.div>
        </div>

        {/* Visual / Abstract Art */}
        <div className="flex-1 relative h-[500px] w-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-[100px] rounded-full" />
            <motion.div 
              initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-64 h-[500px] bg-zinc-900 border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden"
            >
               {/* Phone Mockup Screen */}
               <div className="w-full h-full bg-black relative">
                  <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-purple-900/50 to-transparent" />
                  <div className="p-6 pt-12 space-y-4">
                      <div className="h-20 w-full bg-zinc-800/50 rounded-2xl animate-pulse" />
                      <div className="h-32 w-full bg-zinc-800/30 rounded-2xl" />
                      <div className="h-12 w-full bg-zinc-800/20 rounded-xl" />
                      <div className="h-12 w-full bg-zinc-800/20 rounded-xl" />
                  </div>
                  {/* Bottom Nav */}
                   <div className="absolute bottom-6 left-0 w-full px-6 flex justify-between text-zinc-600">
                      <Smartphone className="w-6 h-6 text-white" />
                      <Globe className="w-6 h-6" />
                      <Zap className="w-6 h-6" />
                   </div>
               </div>
            </motion.div>
        </div>

      </section>

       {/* Features Grid */}
       <section className="py-24 bg-neutral-950">
          <div className="max-w-6xl mx-auto px-6">
             <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Shield, title: "Bank-Grade Security", desc: "Your data is protected by AES-256 encryption and biometric authentication." },
                  { icon: Zap, title: "Instant Transfers", desc: "Send and receive money globally in milliseconds, not days." },
                  { icon: Smartphone, title: "Mobile First", desc: "Designed for the modern world. Manage your finances on the go." }
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-black border border-white/5 hover:border-white/10 transition-colors">
                     <feature.icon className="w-10 h-10 text-purple-500 mb-4" />
                     <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                     <p className="text-gray-400">{feature.desc}</p>
                  </div>
                ))}
             </div>
          </div>
       </section>

       {/* Release Notes / What's New */}
       <section className="py-20 bg-black border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
             <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-gray-400 mb-6">
                Latest Version: v1.0.0 (MVP)
             </div>
             <h2 className="text-3xl md:text-5xl font-bold mb-12">What's New in KoshPay</h2>
             
             <div className="space-y-4 text-left max-w-2xl mx-auto">
                {[
                  "🚀 Full UPI Integration (Mock Mode for Testing)",
                  "💰 Custodial Wallet with Real-time Balance",
                  "🔒 Enhanced Security with Biometric Login",
                  "⚡ Instant Crypto Withdrawals to Devnet",
                ].map((item, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     key={i} 
                     className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border-b border-white/5"
                   >
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="text-lg text-gray-300">{item}</span>
                   </motion.div>
                ))}
             </div>
          </div>
       </section>

       <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
          <p>© 2026 KoshPay Inc. All rights reserved.</p>
          <p>Developed by Kunal Parmar</p>
       </footer>
    </main>
  );
}
