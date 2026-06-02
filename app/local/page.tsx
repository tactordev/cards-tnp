"use client";
import { createContext, useState } from "react";
import Image from "next/image";
import Game, { Card, User } from "@/components/game";
import { 
    Circle,
    CircleSlash
} from "lucide-react";

const GameContext = createContext<Game | null>(null);
export { GameContext };

function Hand({ id }: { id: number; }) {
    const [game, setGame] = useState<Game | null>(null);

    return (
        <GameContext.Provider value={game}>
            <div className="hand-background rounded-md px-8 py-4">
                <p>hand</p>
            </div>
        </GameContext.Provider >
    )
}

function Deck() {
    const [game, setGame] = useState<Game | null>(null);

    return (
        <GameContext.Provider value={game}>
            <div className="hand-background rounded-md py-4 px-8 flex items-center justify-center flex-col">
                <Image src="/cards/back.png" width={120} height={256} alt="card deck" className="w-full h-auto" />
                <p className="text-white/60 pt-4">Cards left: { game ? game.deck.length : "game loading..." }</p>
            </div>
        </GameContext.Provider>
    )
}

function ActionBoard() {
    const [game, setGame] = useState<Game | null>(null);

    return (
        <GameContext.Provider value={game}>
            <div className="hand-background rounded-md py-4 px-8 h-full flex flex-col items-center justify-center">
                {
                    game ?
                        game.playing ? 
                            <div>
                                <Image src={`/cards/final_${game.playing.value}.png`} width={120} height={256} alt="played card" className="w-full h-auto" />
                            </div>
                        :   <div className="flex flex-col w-full items-center justify-center">
                                <CircleSlash className="text-white/80" />
                                <p className="text-white/80">Waiting for someone to play a card...</p>
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
    return (
        <main className="fixed top-0 left-0 w-screen h-screen boarded-background flex flex-col gap-12 items-center justify-center">
            <div className="flex flex-row"> {/* opponent hand */}
                <Hand id={1} />
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
                <Hand id={2} />
            </div>
        </main>
    )
}