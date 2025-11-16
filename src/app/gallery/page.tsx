'use client'

import Sidebar from '../../components/sidebar'
import Footer from '../../components/footer'
import { Button } from '../../components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav="gallery" setActiveNav={() => {}} />
      
      <main className="flex-1 flex flex-col">
        {/* Header Section */}
        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-[#2815d3] to-[#a83acd]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Galeria
            </h1>
            <p className="text-lg text-white/90">
              Odkryj momenty z naszych turniejów i wydarzeń
            </p>
          </div>
        </section>

        {/* Work In Progress Section */}
        <section className="w-full py-32 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] flex-1 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-[#2815d3] to-[#a83acd] bg-clip-text text-transparent mb-6">
                Wkrótce
              </div>
              <p className="text-xl text-foreground/80 mb-8">
                Nasza galeria jest obecnie w trakcie tworzenia. W międzyczasie zapraszamy do obejrzenia zdjęć z turniejów i najważniejszych wydarzeń na Google Drive.
              </p>
            </div>

            <a 
              href="https://drive.google.com/drive/folders/1RPsjaBlYmf39H4XtujPRFgWk5IMcpjA4?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-[#2815d3] hover:bg-[#a83acd] text-white px-8 py-6 text-lg">
                View on Google Drive
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
