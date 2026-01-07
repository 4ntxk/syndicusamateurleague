'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import Image from 'next/image'
import { useLocale } from '../i18n/use-locale'
import { getTranslations } from '../i18n/translations'

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const locale = useLocale()
  const t = getTranslations(locale)

  const images = [
    {
      id: 1,
      src: '/1.webp',
      title: '',
      description: '',
    },
    {
      id: 2,
      src: '/3.webp',
      title: '',
      description: '',
    },
    {
      id: 3,
      src: '/4.webp',
      title: '',
      description: '',
    },
    {
      id: 4,
      src: '/2.webp',
      title: '',
      description: '',
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    )
  }

  const currentImage = images[currentIndex] ?? images[0]

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#1a0f2e] to-[#0f0a1a]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            {t.carousel.title}
          </h2>
          <p className="text-lg text-foreground/70">
            {t.carousel.subtitle}
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2815d3]/30 to-[#a83acd]/30 aspect-video border border-[#2815d3]/50">
          <Image
            src={currentImage?.src ?? "/placeholder.svg"}
            alt={currentImage?.title ?? ""}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-start p-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {currentImage?.title}
              </h3>
              <p className="text-foreground/70">
                {currentImage?.description}
              </p>
            </div>
          </div>

          <Button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#2815d3] hover:bg-[#a83acd] text-white rounded-full p-3 z-10 transition-colors cursor-pointer"
            size="icon"
            aria-label={t.carousel.prev}
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2815d3] hover:bg-[#a83acd] text-white rounded-full p-3 z-10 transition-colors cursor-pointer"
            size="icon"
            aria-label={t.carousel.next}
          >
            <ChevronRight size={24} />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[#a83acd] w-8'
                    : 'bg-[#2815d3]/40 hover:bg-[#2815d3]/60'
                }`}
                aria-label={`${t.carousel.goTo} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
