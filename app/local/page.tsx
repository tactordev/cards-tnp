"use client";
import { createContext, useState, useEffect, useReducer, useContext } from "react";
import Image from "next/image";
import Game, { Card, User } from "@/components/game";
import Toasts, { ToastsC } from "@/components/toasts";
import { 
    Circle,
    CircleSlash,
    CircleUser
} from "lucide-react";

type gcType = {
    game: Game | null,
    playerId: number,
    tm: Toasts | null
};

const GameContext = createContext<gcType | undefined>(undefined);

export { GameContext };

function useGameC() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame not in gc provider");
    }
    return context;
}

function Prompt() {
    const gc = useGameC();

    function sendToast() {
        if (!gc.tm) return;
        gc.tm.send("testing");
    }
    return (
        <div className="absolute top-4 left-4">
            <div className="hand-background rounded-md px-4 py-2" onClick={sendToast}>
                <p>Game loading...</p>
            </div>
            <ToastsC tm={gc.tm} />
        </div>
    )
}

function Hand({ id }: { id: number; }) {
    const gc = useGameC();
    
    return (
        gc.game ?
            gc.game.deck.length === 0 ? 
                <div>Handing out cards...</div>
            : (
                <div className="hand-background rounded-md py-4 px-8 flex flex-col items-center justify-center">
                    <div className="flex flex-row items-center justify-center gap-2 font-semibold text-lg mb-2">
                        <CircleUser />
                        <p>{id === 0 ? "Opponent's hand" : "Your hand"} [{gc.game.players[id].hand.length}]</p>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        {
                            gc.game.players[id].hand.map((card, index) => (
                                <Image src={`/cards/playing_cards/${card.value === 1 ? "A_of_diamonds" : card.value === 10 ? "T_of_diamonds" : card.value === 0 ? "red_joker" : `${card.value}_of_diamonds`}.png`}alt={`${card.value}`} width={256} height={256} className="w-28 h-auto" key={index} />
                            ))
                        }
                    </div>
                </div>
            )
        : (
            <div>
                Game loading...
            </div>
        )
    )
}

function Deck() {
    const gc = useGameC();


    function deckClick(e: React.MouseEvent) {
        if (!gc.game) return;
        const top = gc.game.deck.pop();
        if (!top) return;

        gc.game.players[gc.playerId].draw(top);
        gc.game.frender();
        return;
    }

    return (
        <GameContext.Provider value={gc}>
            <div className="hand-background rounded-md py-4 px-8 flex items-center justify-center flex-col">
                <Image src="/cards/back.png" width={256} height={256} alt="card deck" className="w-28 h-auto" onClick={deckClick} />
                <p className="text-white/60 pt-4">Cards left: { gc.game ? gc.game.deck.length : "game loading..." }</p>
            </div>
        </GameContext.Provider>
    )
}

function ActionBoard() {
    const gc = useGameC();

    return (
        <GameContext.Provider value={gc}>
            <div className="hand-background rounded-md py-4 px-8 h-full flex flex-col items-center justify-center">
                {
                    gc.game ?
                        gc.game.playing ? 
                            <div>
                                <Image src={`/cards/final_${gc.game.playing.value}.png`} width={120} height={256} alt="played card" className="w-full h-auto" />
                            </div>
                        :   <div className="flex flex-col w-full items-center justify-center">
                                <CircleSlash width={48} height={48} className="w-12 h-auto text-white/80" />
                                <p className="text-white/80 pt-4 text-lg">No card played</p>
                            </div>
                    :   <div className="flex flex-col w-full items-center justify-center">
                            <CircleSlash width={48} height={48} className="w-12 h-auto text-white/80" />
                            <p className="text-white/80 pt-4 text-lg">Game loading</p>
                        </div>
                }
            </div>
        </GameContext.Provider>
    )
}

export default function LocalGame() {
    
    const [gc, setGc] = useState<gcType>({game: null, playerId: 0, tm: null});
    const [_, fupdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        setGc({game: new Game("1", fupdate), playerId: 1, tm: new Toasts(fupdate)})
    }, []);

    return (
        <GameContext.Provider value={gc}>
            <main className="fixed top-0 left-0 w-screen h-screen boarded-background flex flex-col gap-12 items-center justify-center">
                <Prompt />
                <div className="flex flex-row"> {/* opponent hand */}
                    <Hand id={0} />
                </div>

                <div className="flex flex-row gap-4">
                    <div> {/* deck */}
                        <Deck />
                    </div>
                    <div> {/* area of play */}
                        <ActionBoard />
                    </div>
                </div>

                <div> {/* player hand */}
                    <Hand id={1} />
                </div>
            </main>
        </GameContext.Provider>
    )
}