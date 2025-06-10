import React from "react";
import Input from "./Input";

type props = { onChange: Function, disabled?: boolean, value: number };

const MultiPlierInput: React.FC<props> = ({ onChange, disabled, value }) => {
    return <div className="mt-2 flex flex-col">
        <p className={`text-sm ${disabled ? "text-text_1" : "text-[#bdbcbc]"}  font-bold`}>
            Target Multiplier
        </p>
        <div className="flex bg-input_bg rounded overflow-hidden shadow-input">
            <Input onChange={onChange} value={value} disabled={disabled} />
            <div className="relative flex">
                <button
                    disabled={disabled}
                    onClick={() =>
                        onChange((value / 2).toFixed(2) || "0")
                    }
                    className={`px-2 text-text_1 w-8 focus:outline-none ${disabled ? "cursor-not-allowed" : "hover:bg-input_hover active:scale-90 transform"}`}
                >
                    <DownSvg />
                </button>
                <div className="absolute w-[2px] bg-panel left-[50%] top-[20%] bottom-[25%]  transform -translate-x-1/2" />
                <button
                    onClick={() =>
                        onChange((value * 2).toFixed(2) || "0")
                    }
                    disabled={disabled}
                    className={`px-2 text-text_1 w-8 focus:outline-none ${disabled ? "cursor-not-allowed" : "hover:bg-input_hover  active:scale-90 transform"}`}
                >
                    <UpSvg />
                </button>
            </div>
        </div>
    </div>
}

export default MultiPlierInput;


const DownSvg = () => {
    return <svg fill="currentColor" viewBox="0 0 64 64" >
        <title></title>
        <path
            d="M32.271 49.763 9.201 26.692l6.928-6.93 16.145 16.145 16.144-16.144 6.93 6.929-23.072 23.07h-.005Z"></path>
    </svg>
}

const UpSvg = () => {
    return <svg fill="currentColor" viewBox="0 0 64 64">
        <title></title>
        <path d="M32.271 17 9.201 40.071 16.128 47l16.145-16.145L48.418 47l6.93-6.929L32.275 17h-.005Z"></path>
    </svg>
}
