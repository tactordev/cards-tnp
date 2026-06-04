"use client";
import { createContext, useState, useEffect, useReducer, useContext } from "react";
import Image from "next/image";
import Game, { Card, User } from "@/components/game";
import { 
    Circle,
    CircleSlash,
    CircleUser
} from "lucide-react";

type gcType = [Game | null, playerId: number];

const GameContext = createContext<gcType | undefined>(undefined);

export { GameContext };

function useGameC() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame not in gc provider");
    }
    return context;
}

function Hand({ id }: { id: number; }) {
    const game = useGameC();
    
    return (
        game[0] ?
            game[0].deck.length === 0 ? 
                <div>Handing out cards...</div>
            : (
                <div className="hand-background rounded-md py-4 px-8 flex flex-col items-center justify-center">
                    <div className="flex flex-row items-center justify-center gap-2 font-semibold text-lg mb-2">
                        <CircleUser />
                        <p>{id === 0 ? "Opponent's hand" : "Your hand"}</p>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        {
                            game[0].players[id].hand.map((card, index) => (
                                <Image src={`/cards/playing_cards/${card.value === 1 ? "A" : card.value}_of_diamonds.png`} alt={`${card.value}`} width={256} height={256} className="w-28 h-auto" key={index} />
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
    const game = useGameC();

    return (
        <GameContext.Provider value={game}>
            <div className="hand-background rounded-md py-4 px-8 flex items-center justify-center flex-col">
                <Image src="/cards/back.png" width={256} height={256} alt="card deck" className="w-28 h-auto" />
                <p className="text-white/60 pt-4">Cards left: { game[0] ? game[0].deck.length : "game loading..." }</p>
            </div>
        </GameContext.Provider>
    )
}

function ActionBoard() {
    const game = useGameC();

    return (
        <GameContext.Provider value={game}>
            <div className="hand-background rounded-md py-4 px-8 h-full flex flex-col items-center justify-center">
                {
                    game[0] ?
                        game[0].playing ? 
                            <div>
                                <Image src={`/cards/final_${game[0].playing.value}.png`} width={120} height={256} alt="played card" className="w-full h-auto" />
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
    
    const [game, setGame] = useState<[Game | null, playerId: number]>([null, 0]);
    const [_, fupdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        setGame([new Game("1", fupdate), 1])
    }, []);

    return (
        <GameContext.Provider value={game}>
            <main className="fixed top-0 left-0 w-screen h-screen boarded-background flex flex-col gap-12 items-center justify-center">
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