import Input from "./Input";

const StopProfitAmount = ({ disabled, onChange, value, Icon, Label }: any) => (
    <div className="mt-2">
        <p className={`text-sm ${disabled ? "text-[#879097]" : "text-[#bdbcbc]"} font-bold`}>
            {Label}
        </p>
        <div className={`w-full rounded shadow-input`}>
            <Input
                value={value}
                onChange={onChange}
                disabled={disabled}
                type={"number"}
                className={"rounded"}
                icon={Icon} />
        </div>
    </div>
);

export default StopProfitAmount;