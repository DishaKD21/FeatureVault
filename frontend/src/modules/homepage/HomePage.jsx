import React from "react";
import Hero from "./hero-section/Hero";
import Feature from "./features/Feature";
import GetStarted from "./get-started/GetStarted";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <Feature />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;