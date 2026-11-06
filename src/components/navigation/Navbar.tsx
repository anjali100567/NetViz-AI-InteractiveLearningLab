'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Network, 
  Layers, 
  Eye,
  Route,
  Cpu, 
  CheckCircle2, 
  Search, 
  TrendingUp, 
  Settings, 
  Sparkles,
  Flame
} from 'lucide-react';
import { useUserProgress } from '@/lib/store/userProgressStore';

export function Navbar() {
  const pathname = usePathname();
  const { progress } = useUserProgress();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: TrendingUp },
    { href: '/learn', label: 'Layer Map', icon: Layers },
    { href: '/layer-visualizer', label: 'Layer Visualizer', icon: Eye, highlight: true },
    { href: '/network-journey', label: 'Network Journey', icon: Route },
    { href: '/labs', label: 'Guided Labs', icon: Cpu },
    { href: '/practice', label: 'Practice', icon: CheckCircle2 },
    { href: '/packet-analyzer', label: 'Packet Analyzer', icon: Search },
    { href: '/progress', label: 'Progress', icon: Sparkles },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-navy-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Network className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                NetViz <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-1 font-mono tracking-wider">COMPUTER NETWORKS LEARNING LAB</p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30'
                      : link.highlight
                      ? 'text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1 text-xs font-mono">
            <span className="text-slate-400">Streak:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-current" />
              {progress.practiceStats.streakDays}d
            </span>
          </div>

          <Link
            href="/layer-visualizer"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Open Layer Visualizer</span>
          </Link>
        </div>
      </div>

      {/* Horizontal Nav Bar for Medium/Small Screens */}
      <div className="flex xl:hidden overflow-x-auto border-t border-slate-800/80 px-2 py-1.5 gap-1 scrollbar-none">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap rounded-md ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
