import { useRef } from "react";

export default ({ isOpen, children, onClose }: any) => {
    const mask = useRef<any>(null);

    if (!isOpen) return <></>;
    return <div ref={mask} className=" fixed  top-0 z-[150] left-0 bg-[#1b1b1b4b] w-screen h-screen" onClick={(e) => (e.target === mask.current) && onClose()}>
        <div className="absolute z-[150] bg-panel w-[350px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {children}
        </div>
    </div>
}