import { useEffect, useState } from "react";
import CustomInput from "./Input";
import CurrentBets from "./CurrentBets";
import SwitchTab from "./SwitchTab";
import axiosServices from "@/util/axios";
import Modal from "./Modal";

const VerifyModal = ({ gameId, Label, setGameId }: any) => {
    const [verifyOpen, setVerifyOpen] = useState(false)

    const [loading, setLoading] = useState(false);
    const [showGame, setShowGame] = useState<any>({
        _id: "",
        privateHash: "",
        publicSeed: "",
        bets: "",
        crashPoint: 1,
        startedAt: new Date()
    });

    const [activeVerifyTab, setActiveVerifyTab] = useState(0);

    // get game hash
    const handleVeryfy = async (id: string) => {
        setLoading(true)
        try {
            const { data } = await axiosServices.get(`/${Label}/game/${id}`)
            setShowGame({
                privateSeed: data.privateSeed,
                publicSeed: data.publicSeed,
                _id: data._id,
                bets: data.players,
                crashPoint: data.crashPoint,
                startedAt: data.startedAt
            })
            setVerifyOpen(true)
        } catch (error) {
            // toast.error("Request failed")
        }
        setLoading(false)
    }

    //
    const copyToClipboard = async (value: any) => {
        try {
            await navigator.clipboard.writeText(value);
            // toast.success("Copied!")
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    useEffect(() => {
        if (gameId !== "") {
            handleVeryfy(gameId)
        }
    }, [gameId])


    return <Modal isOpen={verifyOpen} onClose={() => { setGameId(""); setVerifyOpen(false) }} className=" animate-zoomIn bg-[#2d2d2d] max-w-[530px] w-svw rounded-md border-[2px] border-[#ffe81a]">
        <div className="p-3">
            <div className="uppercase text-white font-bold">
                <span>{Label}</span> Game
            </div>
            <SwitchTab options={["Result", "Leaderboard"]} onChange={setActiveVerifyTab} disabled={false} active={activeVerifyTab} />
            {
                activeVerifyTab === 0 &&
                <>
                    <div className="flex justify-center mt-2">
                        {/* <div className="text-xs">on {moment(showGame.startedAt).format("MMMM D, YYYY [at] h:mm A")}</div> */}
                    </div>
                    <div className="flex justify-center mt-2 text-white">
                        {showGame.crashPoint < 1.2 ? (
                            <div>{parseCommasToThousands(
                                cutDecimalPoints(showGame.crashPoint.toFixed(2))
                            )}x</div>
                        ) : showGame.crashPoint >= 1.2 && showGame.crashPoint < 2 ? (
                            <div > {parseCommasToThousands(
                                cutDecimalPoints(showGame.crashPoint.toFixed(2))
                            )}x</div>
                        ) : showGame.crashPoint >= 2 && showGame.crashPoint < 100 ? (
                            <div >{parseCommasToThousands(
                                cutDecimalPoints(showGame.crashPoint.toFixed(2))
                            )}x</div>
                        ) : (
                            <div > {parseCommasToThousands(
                                cutDecimalPoints(showGame.crashPoint.toFixed(2))
                            )}x</div>
                        )}
                    </div>
                </>
            }
        </div>
        <div className="p-3 bg-[#000000]">
            {
                loading ? <div className="flex items-center justify-center h-full">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-400"></div>
                    </div>
                </div> : <div className="flex flex-col">
                    {activeVerifyTab === 0 ? <>
                        <div className="text-white text-sm">Server Seed</div>
                        <CustomInput disabled={true} value={showGame.privateSeed} type="string" icon={<button onClick={() => copyToClipboard(showGame.privateSeed)} className="px-1 py-2 w-full "></button>} />
                        <div className="text-white text-sm">Client Seed</div>
                        <CustomInput disabled={true} value={showGame.publicSeed} type="string" icon={<button onClick={() => copyToClipboard(showGame.publicSeed)} className="px-1 py-2 w-full "></button>} />
                    </> : <>
                        <CurrentBets bets={showGame.bets} />
                    </>}
                </div>
            }
        </div>
    </Modal>
}

export default VerifyModal;

const parseCommasToThousands = (value: string) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const cutDecimalPoints = (num: any) =>
    num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
