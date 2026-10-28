"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    id: "scene-1",
    number: "01",
    label: "ELBAPH",
    eyebrow: "THE ISLAND ABOVE THE CLOUDS",
    title: ["A DREAM ABOVE", "THE CLOUDS"],
    description: "Beyond the clouds, a legendary island waits to be found.",
    folder: "assets/op1",
    frameCount: 180,
    imageAlt: "A mysterious island rising above the clouds",
    imagePosition: "center 55%",
    theme: "ocean",
    action: "DISCOVER ELBAPH",
    actionTarget: "#scene-2",
  },
  {
    id: "scene-2",
    number: "02",
    label: "VOYAGE",
    eyebrow: "THE STRAW HAT VOYAGE",
    title: ["SAIL THE", "GRAND LINE"],
    description: "The Thousand Sunny carries every dream toward the horizon.",
    folder: "assets/op2",
    frameCount: 240,
    imageAlt: "The Thousand Sunny sailing across the Grand Line",
    imagePosition: "center 55%",
    theme: "harbor",
    action: "MEET THE CAPTAIN",
    actionTarget: "#scene-3",
  },
  {
    id: "scene-3",
    number: "03",
    label: "THE CREW",
    eyebrow: "STRAW HAT PIRATES",
    title: ["ONE CREW", "ONE DREAM"],
    description: "",
    folder: "assets/op3",
    frameCount: 214,
    imageAlt: "The Straw Hat Pirates crew",
    imagePosition: "center 58%",
    theme: "giants",
    action: "",
    actionTarget: "#scene-4",
  },
  {
    id: "scene-4",
    number: "04",
    label: "ADVENTURE",
    eyebrow: "THE GRAND LINE AWAITS",
    title: ["ENDLESS", "ADVENTURE"],
    description: "Every island tells a story. Every battle forges a legend.",
    folder: "assets/op4",
    frameCount: 240,
    imageAlt: "Epic adventures across the Grand Line",
    imagePosition: "center 50%",
    theme: "adventure",
    action: "JOIN THE CREW",
    actionTarget: "#scene-5",
  },
  {
    id: "scene-5",
    number: "05",
    label: "TREASURE",
    eyebrow: "THE ULTIMATE DREAM",
    title: ["FIND THE", "ONE PIECE"],
    description: "The greatest treasure awaits at the end of the Grand Line.",
    folder: "assets/op5",
    frameCount: 240,
    imageAlt: "The legendary One Piece treasure",
    imagePosition: "center 50%",
    theme: "treasure",
    action: "START JOURNEY",
    actionTarget: "#footer",
  },
];

export default function OnePieceExperience() {
  const experienceRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef<(HTMLCanvasElement | null)[]>([]);
  const activeSceneRef = useRef(0);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const lenisRef = useRef<Lenis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Preload semua gambar di awal
  useEffect(() => {
    const imageCache = imageCacheRef.current;
    let loadedCount = 0;
    const totalFrames = scenes.reduce((sum, scene) => sum + scene.frameCount, 0);

    const preloadImages = async () => {
      const loadPromises: Promise<void>[] = [];

      scenes.forEach((scene, sceneIndex) => {
        for (let frameIndex = 0; frameIndex < scene.frameCount; frameIndex++) {
          const key = `${sceneIndex}:${frameIndex}`;
          const frameName = String(frameIndex + 1).padStart(3, "0");

          const promise = new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = "async";
            
            // All scenes use webp format
            const imagePath = `/${scene.folder}/ezgif-frame-${frameName}.webp`;
            
            img.onload = () => {
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
              imageCache.set(key, img);
              resolve();
            };

            img.onerror = () => {
              console.error(`Failed to load: ${imagePath}`);
              loadedCount++;
              setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
              resolve();
            };

            img.src = imagePath;
          });

          loadPromises.push(promise);
        }
      });

      await Promise.all(loadPromises);
      setIsLoading(false);
      console.log(`✅ Loaded ${imageCache.size} frames into cache`);
    };

    preloadImages();
  }, []);

  // Audio setup
  useEffect(() => {
    if (!isLoading) {
      const audio = new Audio('/assets/sound.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [isLoading]);

  // Toggle play/pause
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.log('Play failed:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const experience = experienceRef.current;
    const imageCache = imageCacheRef.current;
    const lenis = lenisRef.current;
    if (!experience || isLoading) return;

    // Connect GSAP ScrollTrigger with Lenis
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    const sectionElements = gsap.utils.toArray<HTMLElement>(".voyage-scene", experience);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeFrame = 0;

    const drawFrame = (sceneIndex: number, image: HTMLImageElement) => {
      const canvas = canvasesRef.current[sceneIndex];
      const context = canvas?.getContext("2d", { 
        alpha: false,
        desynchronized: true,
        willReadFrequently: false
      });
      if (!canvas || !context || !image.naturalWidth) return;

      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * pixelRatio);
      const height = Math.round(bounds.height * pixelRatio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);
      const scale = Math.max(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      
      // Use image smoothing for better quality
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      
      context.drawImage(
        image,
        (bounds.width - drawWidth) / 2,
        (bounds.height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
    };

    const requestFrame = (sceneIndex: number, frameIndex: number) => {
      const key = `${sceneIndex}:${frameIndex}`;
      const image = imageCache.get(key);
      
      if (image && image.complete) {
        activeFrame = frameIndex;
        drawFrame(sceneIndex, image);
      }
    };

    const updateScene = (sceneIndex: number, progress: number) => {
      const scene = scenes[sceneIndex];
      const frameIndex = Math.round(progress * (scene.frameCount - 1));
      requestFrame(sceneIndex, frameIndex);
    };

    const context = gsap.context(() => {
      requestFrame(0, 0);

      ScrollTrigger.create({
        trigger: experience,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (progressRef.current) {
            gsap.set(progressRef.current, { scaleX: self.progress });
          }
        },
      });

      sectionElements.forEach((section, index) => {
        const image = section.querySelector<HTMLElement>(".scene-image");
        const haze = section.querySelector<HTMLElement>(".scene-haze");
        const foreground = section.querySelector<HTMLElement>(".scene-foreground");
        const copy = section.querySelector<HTMLElement>(".scene-copy");
        const titleLines = section.querySelectorAll<HTMLElement>(".scene-title-line");

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: reduceMotion ? false : 1,
          onEnter: () => {
            activeSceneRef.current = index;
            setActiveScene(index);
          },
          onEnterBack: () => {
            activeSceneRef.current = index;
            setActiveScene(index);
          },
          onUpdate: (self) => {
            activeSceneRef.current = index;
            setActiveScene((current) => current === index ? current : index);
            if (!reduceMotion) updateScene(index, self.progress);
          },
        });

        if (reduceMotion) return;

        // Image animation timeline
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        timeline.fromTo(
          image,
          { scale: 1.14, xPercent: index % 2 === 0 ? 3 : -3 },
          { scale: 1, xPercent: 0, duration: 1, ease: "none" },
          0
        );
        if (haze) {
          timeline.fromTo(
            haze,
            { xPercent: index % 2 === 0 ? -8 : 8, yPercent: 12, opacity: 0.3 },
            { xPercent: 0, yPercent: -12, opacity: 0.75, duration: 1, ease: "none" },
            0
          );
        }
        if (foreground) {
          timeline.fromTo(
            foreground,
            { yPercent: -10, xPercent: index % 2 ? -4 : 4 },
            { yPercent: 10, xPercent: 0, duration: 1, ease: "none" },
            0
          );
        }
        
        // Text elements - add to same timeline with staggered timing
        const eyebrow = section.querySelector<HTMLElement>(".scene-eyebrow");
        const headline = section.querySelector<HTMLElement>(".scene-copy h1");
        const description = section.querySelector<HTMLElement>(".scene-description");
        const button = section.querySelector<HTMLElement>(".scene-action");
        
        // Eyebrow - starts at 5% of timeline
        if (eyebrow) {
          timeline.fromTo(
            eyebrow,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
            0.05
          );
        }
        
        // Headline - starts at 10% of timeline
        if (headline) {
          timeline.fromTo(
            headline,
            { opacity: 0 },
            { opacity: 1, duration: 0.1, ease: "none" },
            0.1
          );
        }
        
        // Title lines animation
        if (titleLines.length) {
          timeline.fromTo(
            titleLines,
            { yPercent: 110, rotate: 3 },
            { yPercent: 0, rotate: 0, duration: 0.2, stagger: 0.03, ease: "power3.out" },
            0.1
          );
        }
        
        // Description - starts at 25% of timeline
        if (description) {
          timeline.fromTo(
            description,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
            0.25
          );
        }
        
        // Button - starts at 35% of timeline
        if (button) {
          timeline.fromTo(
            button,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
            0.35
          );
        }
      });
    }, experience);

    const handleResize = () => {
      const sceneIndex = activeSceneRef.current;
      const image = imageCacheRef.current.get(`${sceneIndex}:${activeFrame}`);
      if (image?.complete) drawFrame(sceneIndex, image);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      context.revert();
    };
  }, [isLoading]);

  const scrollToScene = (index: number) => {
    const lenis = lenisRef.current;
    const targetElement = document.getElementById(scenes[index].id);
    
    if (lenis && targetElement) {
      lenis.scrollTo(targetElement, {
        offset: 0,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      targetElement?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  };

  return (
    <main ref={experienceRef} className="voyage-experience">
      {isLoading && (
        <div className="voyage-preloader" role="status" aria-live="polite">
          <span className="voyage-preloader__mark" aria-hidden="true">
            <img src="/assets/logo.png" alt="One Piece Logo" />
          </span>
          <span className="voyage-preloader__label">LOADING ASSETS... {loadProgress}%</span>
          <span className="voyage-preloader__track" aria-hidden="true">
            <span style={{ width: `${loadProgress}%` }} />
          </span>
        </div>
      )}
      <div className="voyage-progress" aria-hidden="true">
        <div ref={progressRef} className="voyage-progress__fill" />
      </div>
      <Navbar />

      {/* Music Visualizer Button - Bottom Right */}
      {!isLoading && (
        <button
          type="button"
          onClick={toggleAudio}
          className={`music-visualizer ${isPlaying ? 'is-playing' : ''}`}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          title={isPlaying ? "Pause" : "Play"}
        >
          <div className="visualizer-bar" style={{ animationDelay: '0s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.1s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.2s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.3s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.15s' }}></div>
        </button>
      )}

      <nav className="scene-nav" aria-label="Navigasi bagian cerita">
        <span className="scene-nav__counter" aria-live="polite">
          {String(activeScene + 1).padStart(2, "0")} <span>/</span> 05
        </span>
        <ol>
          {scenes.map((scene, index) => (
            <li key={scene.id}>
              <button
                type="button"
                className={`scene-nav__item${activeScene === index ? " is-active" : ""}`}
                onClick={() => scrollToScene(index)}
                aria-label={`Ke bagian ${scene.number}: ${scene.label}`}
                aria-current={activeScene === index ? "step" : undefined}
              >
                <span className="scene-nav__number">{scene.number}</span>
                <span className="scene-nav__label">{scene.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {scenes.map((scene, index) => (
        <section
          id={scene.id}
          key={scene.id}
          className={`voyage-scene scene--${scene.theme}`}
          aria-label={`${scene.number} — ${scene.label}`}
        >
          <div className="voyage-scene__stage">
              <div className="scene-image-layer" aria-hidden="true">
                <canvas
                  ref={(canvas) => {
                    canvasesRef.current[index] = canvas;
                  }}
                  className="scene-image scene-canvas"
                  role="img"
                  aria-label={scene.imageAlt}
                  style={{ backgroundImage: `url("/${scene.folder}/ezgif-frame-001.webp")` }}
                />
              </div>
              <div className="scene-shade" aria-hidden="true" />
              <div className="scene-haze" aria-hidden="true" />
              <div className="scene-foreground" aria-hidden="true">
                <span className="scene-foreground__line" />
                <span className="scene-foreground__mark">{scene.number}</span>
              </div>

              {index === 2 ? null : (
                <div className="scene-copy">
                  <p className="scene-eyebrow">
                    <span className="scene-eyebrow__rule" />
                    {scene.eyebrow}
                  </p>
                  <h1 aria-label={scene.title.join(" ")}>
                    {scene.title.map((line, lineIndex) => (
                      <span
                        key={line}
                        className={`scene-title-mask${lineIndex === 1 ? " scene-title-mask--secondary" : ""}`}
                        aria-hidden="true"
                      >
                        <span className="scene-title-line">{line}</span>
                      </span>
                    ))}
                  </h1>
                  <p className="scene-description">{scene.description}</p>
                  {scene.action && (
                    <a className="scene-action" href={scene.actionTarget}>
                      <span>{scene.action}</span>
                      <span className="scene-action__arrow" aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              )}

              {index < scenes.length - 1 && (
                <button
                  className="scroll-cue"
                  type="button"
                  onClick={() => window.scrollBy({
                    top: window.innerHeight * 0.75,
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                  })}
                  aria-label="Lanjutkan menggulir"
                >
                  <span>SCROLL TO CONTINUE</span>
                  <span className="scroll-cue__line" aria-hidden="true" />
                </button>
              )}

              <div className="scene-index" aria-hidden="true">
                <span>{scene.number}</span>
                <span className="scene-index__rule" />
                <span>{String(scenes.length).padStart(2, "0")}</span>
              </div>
          </div>
        </section>
      ))}

      <footer id="footer" className="voyage-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/assets/logo1.png" alt="One Piece" className="footer-logo" />
            <p className="footer-tagline">The Grand Line Awaits</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>Explore</h3>
              <ul>
                <li><a href="#scene-1">Elbaph</a></li>
                <li><a href="#scene-2">Voyage</a></li>
                <li><a href="#scene-3">The Crew</a></li>
                <li><a href="#scene-4">Adventure</a></li>
                <li><a href="#scene-5">Treasure</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Follow</h3>
              <ul>
                <li><a href="#" target="_blank">Twitter</a></li>
                <li><a href="#" target="_blank">Instagram</a></li>
                <li><a href="#" target="_blank">YouTube</a></li>
                <li><a href="#" target="_blank">Discord</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Connect</h3>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Newsletter</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 One Piece Experience. All rights reserved.</p>
          <p className="footer-disclaimer">This is a fan-made tribute website. One Piece is created by Eiichiro Oda.</p>
        </div>
      </footer>
    </main>
  );
}
