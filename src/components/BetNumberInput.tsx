import React from "react";
import { InfinitySvg } from "./svgs";

// Render profit amount field
type props = {
    disabled: boolean,
    value: number;
    onChange: (v: number) => void;
    Icon?: any
}

const BetNumberInput: React.FC<props> = ({ disabled, value, onChange, Icon }) => (
    <div className="mt-2">
        <div className="d-flex justify-between">
            <p className={`text-sm ${disabled ? "text-[#879097]" : "text-[#d1d1d1]"} font-bold`}>
                Number of Bets
            </p>
        </div>
        <div
            className={`flex w-full rounded-full items-center  border-[2px] border-[#2f4553] hover:border-[#557086]  ${disabled ? "bg-[#172c38]" : "bg-[#0f212e]"
                } rounded p-1.5`}
        >
            <input
                disabled={disabled}
                type="number"
                value={value}
                min={0}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`${disabled ? "bg-[#172c38]" : "bg-[#0f212e]"
                    } text-white  w-[90%] flex-1 text-sm focus:outline-none`}
            />
            {value === 0 && (
                <div className="w-5">
                    <InfinitySvg />
                </div>
            )}
        </div>
    </div>
);

export default BetNumberInput;