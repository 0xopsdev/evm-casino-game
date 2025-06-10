"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";


import { API_URL } from "@/config";
import useIsMobile from "@/hooks/useIsMobile";
import SwitchTab from "@/components/SwitchTab";
import AmountInput from "@/components/AmountInput";
import { Button } from "@heroui/react";
import MultiPlierInput from "@/components/MultiplierInput";
import CurrentBets from "@/components/CurrentBets";
import Slider, { findTile } from "@/components/Slider";
import Layout from "@/layout/layout";
const socket: Socket = io(`${API_URL}/slide`);

enum STATUS {
    WAITTING,
    STARTING,
    BETTING,
    PLAYING
}

type Player = {
    playerId: string,
    betAmount: number;
    currencyId: string;
    target: number;
    status: string;
}


const useAudio = () => {
    const betAudioRef = useRef<HTMLAudioElement | null>(null);
    const slidingAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        betAudioRef.current = new Audio("/assets/audio/bet.DUx2OBl3.mp3");
        slidingAudioRef.current = new Audio("/assets/audio/sliding.pgFKr6A8.mp3");
    }, []);

    const playAudio = (key: string) => {
        const audio = key === "bet" ? betAudioRef.current : slidingAudioRef.current;
        if (!audio) return;

        try {
            audio.muted = true;
            audio.play().then(() => {
                setTimeout(() => {
                    audio.muted = false;
                }, 1000);
            }).catch((error) => {
                console.error("Failed to autoplay audio:", error);
            });
        } catch (error) {
            console.log(error);
        }
    };

    return { playAudio };
};


const SlideGame = () => {
    const isMobile = useIsMobile();

    const [activeTab, setActiveTab] = useState<number>(0);
    const [betAmount, setBetAmount] = useState<number>(0);
    const [target, setTarget] = useState<number>(0);
    const betCount = useRef<number>(0);
    const [autobet, setAutobet] = useState<boolean>(false);
    const [bets, setBets] = useState<any[]>([]);

    const [history, setHistory] = useState<any[]>([]);

    const [result, setResult] = useState({
        numbers: [1.903584107931594,
            7.289733272636531,
            1.3637520028046712,
            2.1687325855871227,
            2.4933819106663493,
            1.498308102164589,
            1.4985860487052827,
            21.750156733109126,
            1.0372314374834941,
            4.866700181583145,
            1.3724955280886675,
            6.029560018920336,
            1.0303612131867523,
            1.790765019475776,
            1.0509659303212602,
            1.3427846331361688,
            1.043602614826846,
            1,
            1.7554225649186417,
            1.9452640717656329,
            1.9146219934302606,
            4.869526482116821,
            1.6029811093702553,
            1.2435240630267617,
            17.437289699821303,
            1.276313397368619,
            1.618755824614112,
            9.886094186702175,
            1.5709471875430103,
            1.0521788401854846,
            1.3911934025482007,
            1.3252738435995668,
            1.906647723872426,
            1.090347584906667,
            1.2848101589784566,
            1.007087172210973,
            11.548618542693777,
            1.3578319475086218,
            4.639070394589904,
            1.8465654390716766,
            2.653733488076682,
            4.923510038032103,
            4.921580919662703,
            1.3178708730473734,
            1.7319504108869979,
            1.511790731631906,
            1.415210820644928,
            5.80904104812333,
            1.1317336828287066,
            1.322065143934753,
            7.242526244532375,
            2.5955453056761604,
            1.168085793132742,
            3.2424142021519637,
            6.723184381982699,
            10.76300946407673,
            1.3864677993193353,
            1.550989717093865,
            1.0660077023468517,
            3.363056173638654,
            2.679747580002418,
            4.034726347339524,
            5.715358587221796,
            21.046970995887037,
            2.593111595629966,
            1.3907866095722856,
            8.08699725169305,
            2.3378138615475215,
            1.8070323153254058,
            1.9535634982554118,
            7.573343939658181,
            1.253450763655036,
            8.003569610632168,
            2.5789112031547177,
            2.7480245233718996,
            2.2153270662421325,
            1.7588492912318467,
            1.310647410959055,
            2.629692012488445,
            1.7299793236036611,
            2.671240918732696,
            18.872152846456686,
            1.0117321367489212,
            5.7415093107764905,
            5.9960418900001295,
            1.8347721783099589,
            1.027356841602837,
            75.45281444815788,
            1.646594016671491,
            1.337322225052752], multiplier: 1
    });

    const savedBet = useRef<any | undefined>(null);
    const elapsedTime = 5;
    const inputDisable = useRef<boolean>(false);

    const [privateHash, setPriviateHash] = useState<string>("");
    const [publichSeed, setPublicSeed] = useState<string>("");

    const [status, setStatus] = useState(STATUS.WAITTING);
    const [betting, setBetting] = useState(false);
    const [planedbet, setPlanedBet] = useState<boolean>(false);
    const [betcount, setBetCount] = useState(0);

    const [stopProfitA, setStopPorfitA] = useState<number>(0);
    const [stopLossA, setStopLossA] = useState<number>(0);
    const [amountInputFlag, setAmountInputFlag] = useState(true);

    const stopOnProfit = useRef(0);
    const stopOnLoss = useRef(0);
    const { playAudio } = useAudio();
    const createbet = () => {
        console.log(status, STATUS.BETTING);

        stopOnProfit.current = stopProfitA;
        stopOnLoss.current = stopLossA;

        if (Number(betAmount) <= 0) {
            setAmountInputFlag(false);
            // toast.success("Please input your bet amount!", {
            //     style: {
            //         border: "1px solid #713200",
            //         padding: "14px",
            //         color: "#713200",
            //     },
            //     iconTheme: {
            //         primary: "#713200",
            //         secondary: "#FFFAEE",
            //     },
            // });
            return;
        };

        if (status !== STATUS.BETTING) {

            savedBet.current = {
                target,
                betAmount,
                currencyId: "",
                infinity: autobet && betcount > 0
            }

            if (autobet && betcount > 0) {
                betCount.current = betcount;
                betCount.current--;
                setBetCount(betCount.current);
            } else {
                betCount.current = 0;
            }

            console.log(target, savedBet.current)
            setPlanedBet(true);
        } else {
            socket?.emit("join-game", target, betAmount, "");
            setBetting(true);
            inputDisable.current = true;
            console.log('join-game')
            if (autobet) {
                betCount.current = betcount;
                savedBet.current = {
                    target,
                    betAmount,
                    currencyId: "",
                    infinity: betcount > 0
                }
                setPlanedBet(true);
            }
        }
    }


    const startBetting = () => {
        if (autobet) {
            if (planedbet) {

                if (stopProfitA !== 0 && stopOnProfit.current <= 0) {
                    setPlanedBet(false)
                    return;
                }
                // check stop on loss amount
                if (stopLossA !== 0 && stopOnLoss.current <= 0 && Math.abs(stopOnLoss.current) > Math.abs(stopOnProfit.current)) {
                    setPlanedBet(false)
                }

                if (savedBet.current.infinity && betCount.current > 0) {
                    betCount.current--;
                    setBetCount(betCount.current);
                    socket?.emit("join-game", savedBet.current.target, savedBet.current.betAmount, savedBet.current.currencyId);
                    setBetting(true);
                    inputDisable.current = true;
                } else if (!savedBet.current.infinity) {
                    socket?.emit("join-game", savedBet.current.target, savedBet.current.betAmount, savedBet.current.currencyId);
                    setBetting(true);
                    inputDisable.current = true;
                } else {
                    savedBet.current = undefined;
                    setPlanedBet(false);
                }
            }
        } else {
            if (planedbet) {
                socket?.emit("join-game", savedBet.current.target, savedBet.current.betAmount, savedBet.current.currencyId);
                inputDisable.current = true;
                setBetting(true);
                savedBet.current = undefined;
                setPlanedBet(false);
            }
        }
    }

    const joinSuccess = (data: any) => {
        console.log("join betting")

        setBetting(false);
        playAudio("bet");

        if (planedbet && stopLossA !== 0) {
            stopOnLoss.current -= savedBet.current.betAmount;
        }
    }

    const joinFailed = (data: any) => {
        setBetting(false);
    }


    const handleStatus = (data: any) => {
        if (data.status === STATUS.STARTING) {
            setBets([]);
            setPublicSeed(data.publicSeed);
            setPriviateHash(data.privateHash);
            setStatus(STATUS.STARTING);
            inputDisable.current = false;
            if (data._id) {
                addGameToHistory({ _id: data._id, resultpoint: data.crashPoint })
            }
        } else if (data.status === STATUS.BETTING) {
            setStatus(STATUS.BETTING);
            startBetting();
        } else if (data.status === STATUS.PLAYING) {
            setStatus(STATUS.PLAYING);
            playAudio("sliding");
            inputDisable.current = false;
            if (planedbet && savedBet.current.target <= data.crashPoint && stopProfitA !== 0) {
                stopOnProfit.current -= savedBet.current.betAmount;
            }

            setTimeout(() => {
                setBets(data.players);
            }, 3000)
            setResult({ numbers: data.numbers, multiplier: data.crashPoint });
        }
    };

    const addGameToHistory = (game: any) => {
        setHistory((state) =>
            state.length >= 6
                ? [...state.slice(1, state.length), game]
                : [...state, game]
        );
    };

    const getButtonContent = () => {
        if (betting)
            return "Betting..."

        if (status === STATUS.PLAYING) {
            if (planedbet) {
                if (autobet)
                    return "Stop Autobet";
                else
                    return "Cancel Bet"
            } else {
                if (autobet)
                    return "Start Autobet";
                return "Bet (Next Round)"
            }
        } else if (status === STATUS.BETTING) {
            if (autobet) {
                if (inputDisable.current)
                    return "Waiting..."
                if (planedbet)
                    return "Stop Autobet";
                return "Start Autobet";
            }
            if (planedbet)
                return "Cancel Bet";
            if (inputDisable.current)
                return "Waiting.."
            return "Bet"
        }

        return "Starting..."
    }

    const joinBet = (_bets: any[]) => {
        setBets([...bets, ..._bets])
    }

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Server connected");
        })

        socket.on("disconnect", () => {
            console.log("Server disconnected");
        })

        socket.on("game-join-error", joinFailed)

        socket.on("game-join-sucess", joinSuccess)

        socket.on("slide-track", handleStatus)

        socket.on("bet", joinBet);

        socket.on("history", (data) => {
            setHistory(data.reverse().slice(0, 6));
        })

        if (history.length == 0) {
            socket.emit("games");
        }
        return () => {
            socket.off("connection");
            socket.off("disconnect");
            socket.off("game-join-error");

            socket.off("game-join-sucess");

            socket.off("slide-track");
            socket.off("history");
            socket.off("bet");
        }
    }, [target, betAmount, status, history, planedbet, autobet]);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        return () => {
            if (!socket.disconnected)
                socket.disconnect()
        }
    }, [])

    const disable = inputDisable.current || planedbet;

    useEffect(() => {
        setAutobet(activeTab == 1)
    }, [activeTab])

    return (
        <Layout>
            <div className={`max-w-[1300px] ${isMobile ? "w-full p-1" : ""} `}>
                <div className="grid grid-cols-1 sm:grid-cols-4 rounded-md overflow-hidden  bg-panel border-[1px] border-[#020202bb]  shadow-md h-full">
                    <div className="col-span-3 flex items-center justify-center">
                        <div className={`  gap-2 ${isMobile ? "min-h-[350px] " : "min-h-[300px] "
                            }   relative h-full overflow-hidden flex items-center justify-center`}>
                            <div className="flex absolute right-1/2 translate-x-1/2 top-5 z-20 w-[300px] space-x-1">
                                {history.slice(history.length - 10, history.length).map((h: any, index) => {
                                    return <Button onClick={() => { }}
                                        className="p-[3px] w-10  text-sm font-medium text-white"
                                        key={index}
                                        style={{
                                            background: findTile(h.resultpoint).color,
                                            color: findTile(h.resultpoint).text
                                        }}>
                                        {h.resultpoint}x
                                    </Button>
                                })}
                                <Button onClick={() => { }} className="p-[3px] w-10 text-sm font-medium text-white" style={{ background: "#50e3c2" }}>Fairness</Button>
                            </div>
                            <div className="w-full h-full flex items-center" >
                                <Slider multiplier={result.multiplier} elapsedTime={elapsedTime} numbers={result.numbers} />
                            </div>
                            <div className="absolute bottom-10 left-5 z-20">
                                <div className="flex space-x-1 w-20 items-center">
                                    <div className="w-3 h-3 rounded-full bg-bet_button"></div>
                                    <div className="text-white text-sm">Bets: {bets.length}</div>
                                </div>
                            </div>
                            <div className="w-full absolute bottom-0 z-20">
                                <StatusBar status={status} />
                            </div>
                            <div className="absolute z-10 top-0 left-0 w-full h-full" style={{ background: "linear-gradient(90deg,#071824,transparent,#071824)" }} />
                        </div>
                    </div>
                    {isMobile &&
                        <div className="col-span-1 p-2 min-h-[560px] bg-sider_panel shadow-[0px_0px_15px_rgba(0,0,0,0.25)] flex flex-col justify-between">
                            <Button disabled={disable} onClick={() => {
                                if (betting || inputDisable.current)
                                    return;
                                if (status === STATUS.PLAYING) {
                                    if (planedbet) {
                                        savedBet.current = undefined;
                                        setPlanedBet(false);
                                    } else {
                                        createbet();
                                    }
                                } else if (status === STATUS.BETTING) {
                                    createbet();
                                }
                            }}>{getButtonContent()}
                            </Button>
                            <AmountInput onChange={setBetAmount} value={betAmount} disabled={disable} />
                            <MultiPlierInput onChange={setTarget} value={target} disabled={disable} />
                            <SwitchTab onChange={setActiveTab} active={activeTab} disabled={disable} />
                            <CurrentBets bets={bets.map((b) => {
                                if (status === STATUS.PLAYING) {
                                    return { ...b, isWinner: false }
                                } else {
                                    return { ...b, isWinner: result.multiplier > b.target }
                                }
                            })} />
                        </div>
                    }
                    {!isMobile &&
                        <div className="col-span-1 p-2 min-h-[560px] bg-sider_panel shadow-[0px_0px_15px_rgba(0,0,0,0.25)] flex flex-col gap-4">
                            <SwitchTab onChange={setActiveTab} active={activeTab} disabled={disable} />
                            <AmountInput onChange={setBetAmount} value={betAmount} disabled={disable} />
                            <MultiPlierInput onChange={setTarget} value={target} disabled={disable} />
                            <Button className="bg-[#00e701] hover:bg-[#00d600] rounded-full uppercase font-bold" disabled={disable} onPress={() => {
                                if (betting || inputDisable.current)
                                    return;
                                if (status === STATUS.PLAYING) {
                                    if (planedbet) {
                                        savedBet.current = undefined;
                                        setPlanedBet(false);
                                    } else {
                                        createbet();
                                    }
                                } else if (status === STATUS.BETTING) {
                                    createbet();
                                }
                            }}>{
                                    getButtonContent()
                                }</Button>
                            <CurrentBets bets={bets.map((b) => {
                                if (status === STATUS.PLAYING) {
                                    return { ...b, isWinner: false }
                                } else {
                                    return { ...b, isWinner: result.multiplier > b.target }
                                }
                            })} />
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}

export default SlideGame;


const StatusBar = ({ status }: { status: STATUS }) => {
    const time = useRef<number>(-1);
    const [statustime, setstatustime] = useState(0);
    useEffect(() => {
        let interval: any;
        switch (status) {
            case STATUS.BETTING:
                time.current = 2000;
                setstatustime(2000);
                interval = setInterval(() => {
                    if (time.current > 0) {
                        time.current--;
                        setstatustime(time.current);
                    }
                }, 10)
                break;
            case STATUS.PLAYING:
                time.current = -1;
                setstatustime(-1);
                break;
            case STATUS.STARTING:
                break;
            case STATUS.WAITTING:
                break;
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [status])


    return <div className="w-full h-2 flex-col justify-between">
        {statustime === -1 && <></>}
        {statustime === 0 && <div className="text-white">Starting...</div>}
        {statustime > 0 && <div className="h-2 bg-cyan-600" style={{
            width: (100 / 2000) * statustime + "%"
        }} ></div>}
    </div >

}