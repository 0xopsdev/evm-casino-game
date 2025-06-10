'use client'
import { useEffect, useState } from "react";
import { PercentSvg } from "../svgs";

const MineCustomInput = ({
  disabled,
  onChange,
  value,
  label,
}: {
  disabled: boolean;
  onChange: (e: number) => void;
  value: number;
  label: string;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [inputValue, seInputValue] = useState(value);
  const handleChange = (v: number) => {
    seInputValue(v);
  };

  useEffect(() => {
    if (!visible) onChange(0);
    else onChange(inputValue);
  }, [visible, inputValue]);
  return (
    <div className="mt-2 flex flex-col">
      {label && (
        <p className={`text-sm ${disabled ? "text-[#879097]" : "text-white"}`}>
          {label}
        </p>
      )}
      <div className="flex bg-[#2f4553] overflow-hidden p-[1px] rounded-full">
        <button
          className={`px-2 text-[#879097] rounded-l-full focus:outline-none rounded-md text-[.75rem] hover:bg-[#557086] ${visible == false && "bg-[#0f212e]"
            }`}
          onClick={() => !disabled && setVisible(false)}
        >
          Rest
        </button>
        <button
          onClick={() => !disabled && setVisible(true)}
          className={`px-2 text-[#879097] focus:outline-none  rounded-md text-[.75rem] text-nowrap hover:bg-[#557086] ${visible && "bg-[#0f212e]"
            }`}
        >
          Increase By:
        </button>
        <div
          className={`flex ${!visible || disabled ? "bg-[#172c38]" : "bg-[#0f212e]"
            }  rounded-r-full border-[#2f4553] hover:border-[#557086] w-full`}
        >
          <input
            type="number"
            value={visible ? inputValue : value}
            min={0}
            disabled={disabled || !visible}
            onChange={(e) => handleChange(Number(e.target.value))}
            className=" px-3 py-1 text-white bg-[#0f212e00] w-[80%] focus:outline-none"
          />
          <div className="flex items-center justify-center pl-2 pr-1.5 w-[35px] ">
            <PercentSvg />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MineCustomInput