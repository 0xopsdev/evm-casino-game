'use client'
import React, { useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile"
import { Image as HImage } from "@heroui/react";

interface SliderProps {
    multiplier: number;
    elapsedTime: number;
    numbers: number[];
}



const Effect: React.FC<any> = ({ color }) => {
    const canvasRef = useRef<any>(null);
    useEffect(() => {

        if (color) {
            const audio = color.audio;
            if (audio) {
                // Play audio muted initially
                audio.muted = true;
                audio.play().then(() => {
                    // Unmute after a small delay
                    setTimeout(() => {
                        audio.muted = false;
                    }, 1000); // Adjust delay as needed
                }).catch((error: any) => {
                    console.error("Failed to autoplay audio:", error);
                });
            }

            if (canvasRef.current) {
                const canvas = document.createElement("canvas");
                canvas.width = canvasRef.current.offsetWidth;
                canvas.height = canvasRef.current.offsetHeight;

                const heximg: any = color.hex;
                const w = heximg.width / color.w;
                const h = heximg.height / color.h;
                const ctx = canvas.getContext("2d");
                const width = canvas.width * 1.05;

                let wc = 0;
                let hc = 0;
                let s = false;
                const draw = () => {
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    ctx?.save();
                    ctx?.translate(canvas.width / 2, canvas.height / 2)
                    ctx?.drawImage(heximg, w * wc, h * hc, w, h, -width / 2, -width / 2, width, width);
                    if (!s) wc++;
                    if (wc === color.w - 1) {
                        if (hc < color.h - 1) {
                            wc = 0;
                            hc++;
                        } else {
                            s = true;
                        }
                    }
                    ctx?.restore();
                };
                const interval = setInterval(draw, 60);
                canvasRef.current.appendChild(canvas);

                return () => {
                    clearInterval(interval);
                    if (canvasRef.current) {
                        canvasRef.current.removeChild(canvas);
                    }
                }
            }
        }
    }, [color]);


    return <div className="absolute w-full h-full left-0 top-0 z-20" ref={canvasRef} />
};

const Slider: React.FC<SliderProps> = ({ multiplier, elapsedTime, numbers = [] }) => {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [displayNumbers, setDisplayNumbers] = useState<number[]>([]);
    const isMobile = useIsMobile();

    const [animationEnded, setAnimationEnded] = useState<boolean>(false); // New state to track animation end

    useEffect(() => {
        // Check if numbers is an array  
        if (!numbers.length || !multiplier) {
            return;
        }
        // Insert the multiplier into the numbers array at a fixed position
        const fixedIndex = 70; // Fixed index where the multiplier will be inserted
        let updatedNumbers = numbers;

        if (!updatedNumbers.includes(multiplier)) {
            if (fixedIndex < updatedNumbers.length) {
                updatedNumbers.splice(fixedIndex, 0, multiplier);
            } else {
                updatedNumbers.push(multiplier); // Append if index is out of bounds
            }
        }
        setDisplayNumbers(updatedNumbers);
        setAnimationEnded(false);
    }, [multiplier, numbers]);


    useEffect(() => {
        // Find the index of the multiplier
        const targetCardIndex = displayNumbers.indexOf(multiplier);


        if (sliderRef.current && targetCardIndex !== null) {

            const slider = sliderRef.current;
            slider.style.transition = ``;
            slider.style.transform = `translateX(0px)`;

            const cards = slider.children;

            if (cards.length === 0) return;

            // Calculate card dimensions
            const cardWidth = (cards[0] as HTMLElement).offsetWidth;
            const containWidth = slider.offsetWidth;
            const cardMarginRight = parseFloat(getComputedStyle(cards[0] as HTMLElement).marginRight);

            // Calculate the position to stop at
            const cardOffset = Math.random() * cardWidth; // Random offset within card width
            const targetPosition = -(
                targetCardIndex * (cardWidth + cardMarginRight) - containWidth / 2 + cardOffset
            );

            // Apply transform for the sliding animation
            slider.style.transition = `transform ${elapsedTime * 1000}ms cubic-bezier(0.24, 0.78, 0.15, 1)`;
            slider.style.transform = `translateX(${targetPosition}px)`;

            // Add event listener for animation end
            const handleTransitionEnd = () => {
                setAnimationEnded(true);
            };
            slider.addEventListener('transitionend', handleTransitionEnd);

            // Cleanup function to remove the event listener
            return () => {
                slider.removeEventListener('transitionend', handleTransitionEnd);
            };
        }

    }, [displayNumbers])
    return (
        <div className="relative overflow-hidden w-full h-full">
            <div ref={sliderRef} className="flex transition-transform duration-0 items-center h-full">
                {displayNumbers.map((number, index) => {
                    let tile = findTile(number);
                    let isCrashedpoint = number === multiplier;
                    return (
                        <div
                            key={index}
                            className={`${isMobile ? "min-w-[80px] h-40" : "min-w-[100px] h-44"} rounded-md  mr-2 flex-col overflow-clip`}>
                            <div
                                className={`border-[3px] border-b-0 text-xl h-[85%] p-1 flex justify-center bg-[#213743]`}
                                style={{
                                    borderColor: animationEnded && isCrashedpoint ? tile?.color : '#213743'
                                }}
                            >
                                <div className="relative flex justify-center items-center p-3 z-0">
                                    <HImage src={`/assets/image/hexagon.svg`} alt="hex" />
                                    {(animationEnded && isCrashedpoint) && <Effect color={tile} />}
                                    <div
                                        className="z-10 absolute top-1/2 left-1/2 text-[1rem] text-white transform -translate-x-1/2 -translate-y-1/2"
                                    >
                                        {Number(number || 1).toFixed(2)}x
                                    </div>
                                </div>
                            </div>
                            <div className={`flex h-[15%]`}
                                style={{ backgroundColor: tile?.color }} // Apply dynamic background color
                            />
                        </div>
                    )
                })}
            </div>
            <div className="absolute left-1/2 bottom-20 rounded-full h-1/3 border-l-2 border-white transform -translate-x-1/2 pointer-events-none"></div>
            <div className="w-3 h-3 rounded-full bg-white absolute left-1/2 bottom-20 -translate-x-1/2" />
        </div>
    );
};

export default Slider;



export const findTile = (number: number): any => {
    const getImage = (hex: string): HTMLImageElement | null => {
        
        if (typeof window === "undefined") return null; // SSR-safe
        const srcMap: Record<string, string> = {
            "hex-dark": "/assets/image/hex-dark.webp",
            "hex-white": "/assets/image/hex-white.webp",
            "hex-blue": "/assets/image/hex-blue.webp",
            "hex-orange": "/assets/image/hex-orange.webp",
            "hex-green": "/assets/image/hex-green.webp",
            "hex-diamond": "/assets/image/hex-diamond.webp",
        };

        const src = srcMap[hex];
        if (!src) return null;

        const img = new Image();
        img.src = src;
        return img;
    };


    const getAudio = (hex: string): HTMLAudioElement | null => {
        if (typeof window === "undefined") return null; // Safe for SSR

        const audioMap: Record<string, string> = {
            "hex-dark": "/assets/audio/0x.BzN2b_8B.mp3",
            "hex-white": "/assets/audio/2x.BtB9MhZT.mp3",
            "hex-blue": "/assets/audio/5x.ByO3bsqL.mp3",
            "hex-orange": "/assets/audio/10x.D5SU6N7w.mp3",
            "hex-green": "/assets/audio/100x.Dqw08101.mp3",
            "hex-diamond": "/assets/audio/1000x.Pp2_A4z-.mp3",
        };

        const src = audioMap[hex];
        if (!src) return null;

        const audio = new Audio(src);
        return audio;
    };

    const colors = [
        {
            color: "#2d4454",
            text: "white",
            point: 0,
            hex: getImage("hex-dark"),
            w: 11,
            h: 3,
            audio: getAudio("hex-dark")
        },
        {
            color: "#dcdfe4",
            text: "black",
            point: 2,
            hex: getImage("hex-white"),
            w: 10,
            h: 4,
            audio: getAudio("hex-white")
        },
        {
            color: "#017bff",
            text: "white",
            point: 5,
            hex: getImage("hex-blue"),
            w: 10,
            h: 4,
            audio: getAudio("hex-blue")
        },
        {
            color: "#ff9d00",
            text: "black",
            point: 10,
            hex: getImage("hex-orange"),
            w: 10,
            h: 4,
            audio: getAudio("hex-orange")
        },
        {
            color: "#00e701",
            text: "white",
            point: 100,
            hex: getImage("hex-green"),
            w: 10,
            h: 4,
            audio: getAudio("hex-green")
        },
        {
            color: "#50e3c2",
            text: "white",
            point: 1000,
            hex: getImage("hex-diamond"),
            w: 7,
            h: 7,
            audio: getAudio("hex-diamond")
        },
    ];
    // Sort the colors array by point value (ensure it's sorted only once)
    const sortedColors = colors.slice().sort((a, b) => a.point - b.point);

    // Find the tile with the first point greater than the number
    for (let i = 0; i < sortedColors.length; i++) {
        if (!sortedColors[i + 1] || sortedColors[i].point <= number && sortedColors[i + 1].point > number) {
            return sortedColors[i];
        }
    }

    // Return undefined if no suitable tile is found
    return colors[0];
};
