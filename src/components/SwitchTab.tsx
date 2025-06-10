// Render switch tab (Manual/Auto)
const SwitchTab = ({ active, options, disabled, onChange, type }: { disabled?: boolean, active: number, options?: string[], onChange: (e: number) => void, type?: string }) => (
    <div className={`flex flex-row p-1 ${type === "sub" ? "" : "rounded-full "} bg-[#0f212e] mt-3`}>
        {(options || ["Manual", "Auto"]).map((label, index) => (
            <button
                key={index}
                className={`w-full ${type === "sub" ? "" : "rounded-full "} font-semibold text-sm hover:bg-[#557086] py-2 ${disabled ? "text-[#879097]" : "text-white"
                    } ${active === index ? "bg-[#2f4553]" : "bg-transparent"}`}
                onClick={() => !disabled && onChange(index)}
            >
                {label}
            </button>
        ))}
    </div>
);


export default SwitchTab;