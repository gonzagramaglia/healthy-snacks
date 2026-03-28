"use client";

import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors">
      {/* Background Wallpaper */}
      <div 
        className="fixed inset-0 z-[-1] opacity-40 dark:opacity-20 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/wallpaper.png")' }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
