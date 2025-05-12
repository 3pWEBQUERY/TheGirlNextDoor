"use client";

import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import { AuthProvider } from "@/contexts/AuthContext";

interface ClientLayoutProps {
  children: React.ReactNode;
  fontClass: string;
}

const ClientLayout = ({ children, fontClass }: ClientLayoutProps) => {
  return (
    <AuthProvider>
      <div className={`${fontClass} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default ClientLayout;
