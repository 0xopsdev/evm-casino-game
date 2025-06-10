import axiosServices from "@/util/axios";
import { useCallback, useEffect, useState } from "react";
import Modal from "./Modal";
import { Button } from "@heroui/react";


const GameHistory = ({ Label, setGameId }: any) => {
    const [openModal, setOpenModal] = useState(false)
    const [histories, setHistory] = useState([])
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);

    // get game hash
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await axiosServices.get(`/${Label}/games`, {
                params: {
                    skip,
                    limit: 7
                }
            })
            setHistory(data)
            setOpenModal(true)
        } catch (error) {
            // toast.error("Request failed")
        }
        setLoading(false)
    }, [skip])

    const setVeifyGameId = (gameid: string) => {
        setGameId(gameid)
    }

    useEffect(() => {
        if (histories.length > 0) {
            fetchData()
        }
    }, [skip])

    useEffect(() => {
        if (openModal) {
            fetchData()
        }
    }, [openModal])

    return <>
        {Label === "crash" ?

            <div onClick={() => setOpenModal(true)} className="w-9 px-2 cursor-pointer mt-1">
                <div className="w-8 h-5">
                    {/* <Icon icon={"HistoryIcon"} /> */}
                </div>
            </div> :
            <button onClick={() => setOpenModal(true)}
                className="p-1 shadow-input rounded-sm text-[12px] transition active:scale-90 transform min-w-7 bg-[#ffbd16]" >
                {/* <Icon icon={"HistoryIcon"} /> */}
            </button>}
        <Modal isOpen={openModal} onClose={() => { setOpenModal(false) }} className=" animate-zoomIn bg-[#2d2d2d] max-w-[530px] w-svw rounded-md border-[2px] border-[#da9820]">
            <div className=" p-3">
                <div className="flex uppercase">{Label} Game</div>
            </div>
            <div className="relative bg-[#0a0a0a]">
                <div className="flex flex-col">
                    <div>
                        <div className="flex-col">
                            <div className="flex">
                                <div>Time</div>
                                <div>Multiplier</div>
                                <div>Details</div>
                            </div>
                            <div className="min-h-[500px] relative">
                                {loading && <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-400"></div>
                                    </div>
                                </div>}
                                {
                                    histories.map((game: any, key) => (
                                        <div className="flex justify-between" key={key} >
                                            <div className="p-0">
                                                <div className="flex items-center text-sm">
                                                    <span className="font-semibold ml-2">
                                                        {/* {moment(game.startedAt).format("h:m A D/M/YYYY")} */}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-0">
                                                {game.crashPoint < 1.2 ? (
                                                    <div>{parseCommasToThousands(
                                                        cutDecimalPoints(game.crashPoint.toFixed(2))
                                                    )}x</div>
                                                ) : game.crashPoint >= 1.2 && game.crashPoint < 2 ? (
                                                    <div > {parseCommasToThousands(
                                                        cutDecimalPoints(game.crashPoint.toFixed(2))
                                                    )}x</div>
                                                ) : game.crashPoint >= 2 && game.crashPoint < 100 ? (
                                                    <div >{parseCommasToThousands(
                                                        cutDecimalPoints(game.crashPoint.toFixed(2))
                                                    )}x</div >
                                                ) : (
                                                    <div > {parseCommasToThousands(
                                                        cutDecimalPoints(game.crashPoint.toFixed(2))
                                                    )}x</div >
                                                )}
                                            </div>
                                            <div className="p-0">
                                                <Button onClick={() => {
                                                    setOpenModal(false);
                                                    setVeifyGameId(game._id)
                                                }}>View</Button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <Button onClick={() => skip > 0 && setSkip(skip - 1)}>Previeus</Button>
                            <Button onClick={() => setSkip(skip + 1)}>Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}

export default GameHistory;

const parseCommasToThousands = (value: string) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const cutDecimalPoints = (num: any) =>
    num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
