import React from "react";

type props = { icon?: any, type?: string, value: string | number, onChange?: Function, disabled?: boolean, className?: string }
const Input: React.FC<props> = ({ icon, type, onChange, value, disabled, className }) => {
    return <div className={`flex ${disabled ? "bg-inputborader" : "bg-panel"
        } rounded-full outline-none border border-white/10 hover:border-input_hover w-full ${className || ""}`}>
        <input
            disabled={disabled}
            type={type || "number"} onChange={(e) => onChange && onChange(e.target.value)} value={value} min={0} step={0.01} className="outline-none h-full w-full p-[7px] px-2 focus:outline-none bg-transparent text-white" />
        {icon &&
            <div className="flex items-center justify-center p-1 w-[30px] ">
                {icon}
            </div>
        }
    </div>
}

export default Input;