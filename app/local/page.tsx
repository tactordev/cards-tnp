"use client";
import { createContext, useState, useEffect, useReducer, useContext } from "react";
import Image from "next/image";
import Game, { Card, cv, User } from "@/components/game";
import Toasts, { ToastsC } from "@/components/toasts";
import { AnimatePresence, motion } from "motion/react";
import { 
    ChevronLeft,
    ChevronRight,
    ChevronRightCircle,
    Circle,
    CircleSlash,
    CircleUser
} from "lucide-react";
import { parse } from "path";

type gcType = {
    game: Game | null,
    playerId: number,
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

function parseCardPath(card: Card) {
    return `/cards/playing_cards/${card.value === 1 ? "A_of_diamonds" : card.value === 10 ? "T_of_diamonds" : card.value === 0 ? "red_joker" : `${card.value}_of_diamonds`}.png`
}

function Prompt() {
    const gc = useGameC();

    function sendToast() {
        if (!gc.game) return;
        gc.game.tm.send("Why'd you click here? You need something?");
    }

    if (!gc || !gc.game) return;
    return (
        <div className="w-160">
            <div className="hand-background rounded-md px-4 py-2 flex flex-row items-center justify-center" onClick={sendToast}>
                <AnimatePresence>
                    <motion.p initial={{opacity: 0}} exit={{opacity: 0}} animate={{opacity: 1}} className="opacity-100">
                        Waiting for {gc.game.players[gc.game.stateAgent].name} to {
                            gc.game.state === "pickup" ? "pick up a card from the deck."
                            : gc.game.state === "discard" ? `use a card from ${gc.game.stateAgent === 1 ? "your" : "their"} hand.`
                            : `complete ${gc.game.stateAgent === 1 ? "your" : "their"} card's action.`
                        }
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    )
}

function Hand({ id }: { id: number; }) {
    const gc = useGameC();

    const playCard = (card: Card) => {
        return gc.game!.playCard(id, card);
    }
    
    return (
        gc.game ?
            gc.game.deck.length === 0 ? 
                <div>Handing out cards...</div>
            : (
                <div className={`hand-background rounded-md py-4 px-8 flex flex-col items-center justify-center ${gc.game.stateAgent === id ? "!bg-blue-300/20 !border-blue-300/60" : ""} w-72`}>
                    <div className="flex flex-row items-center justify-center gap-2 font-semibold text-lg mb-2">
                        <CircleUser />
                        <p className="select-none">{id === 0 ? "Opponent's hand" : "Your hand"} [{gc.game.players[id].hand.length}]</p>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        {
                            gc.game.players[id].hand.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    layoutId={card.id}
                                >
                                    <Image src={parseCardPath(card)} alt={`${card.value}`} width={256} height={256} className="w-28 h-auto hover:cursor-pointer border-1 border-transparent hover:border-yellow-500 rounded-md transition-all duration-200 select-none" key={index} onClick={() => {playCard(card)}} />
                                </motion.div>
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

function DiscardedHand({ id }: { id: number; }) {
    const gc = useGameC();

    return (
        gc && gc.game && (
            <div>
                <div className={`hand-background rounded-md py-4 px-8 flex flex-col items-center justify-center w-78 h-full ${gc.game.stateAgent === id ? "!bg-blue-300/20 !border-blue-300/60" : ""}`}>
                    <div className="flex flex-row items-center justify-center gap-2 font-semibold text-lg mb-2">
                        <CircleUser />
                        <p className="flex items-center min-w-0 overflow-hidden select-none"><span className="inline-block truncate mr-1">{id === 0 ? "Opponent's" : "Your"}</span><span className="shrink-0">discards [{gc.game.players[id].discarded.length}]</span></p>    
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        {
                            gc.game.players[id].discarded.length === 0 ? <div className="w-24 h-38" />
                            : 
                                <div className="flex flex-row *[&>*:not(:only-child)]:bg-white">
                                  { gc.game.players[id].discarded.map((card: Card, index: number) => <motion.div key={card.id} layoutId={card.id} className="not-first:-ml-22 hover:-translate-y-8 hover:not-last:pr-11 hover:z-0 z-0 transition-all duration-200"><Image src={parseCardPath(card)} key={index} alt={`${card.value}`} width={256} height={256} className="w-28 h-auto" /></motion.div>) }  
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    )
}

function Deck() {
    const gc = useGameC();


    function deckClick(e: React.MouseEvent) {
        if (!gc.game || !gc.game.tm) return;
        if (gc.game.state !== "pickup" && gc.game.stateAgent !== 0) {
            gc.game.tm.send("You cannot pick up a card right now.", "warning", 3000);
            return;
        }
        const top = gc.game.deck.pop();
        if (!top) return;

        gc.game.players[gc.playerId].draw(top);

        gc.game.increment();
        gc.game.frender();
        return;
    }

    return (
        <GameContext.Provider value={gc}>
            <div className="hand-background rounded-md py-4 px-8 flex items-center justify-center flex-col h-full">
                <Image src="/cards/back.png" width={256} height={256} alt="card deck" className="w-28 h-auto" onClick={deckClick} />
                <p className="text-white/60 pt-4 select-none">Cards left: { gc.game ? gc.game.deck.length : "game loading..." }</p>
            </div>
        </GameContext.Provider>
    )
}

function ActionBoard() {
    const gc = useGameC();

    function guess(card: Card) {
        if (!gc.game) return;
        if (card.value === 1) { gc.game.tm.send("You cannot guess a 1.", "warning"); gc.game.frender(); return; };

        console.log(gc.game.players);
        console.log(gc.game.stateAgent);
        if (card.value === gc.game.players[gc.game.stateAgent === 0 ? 1 : 0].hand[0].value) {
            gc.game.finish(gc.game.players[gc.game.stateAgent], "Guessed the other person's card correctly.");
            gc.game.frender();
            return;
        } else {
            gc.game.tm.send("Incorrect guess.", "warning", 1000);
            gc.game.increment();
            gc.game.frender();
        }
    }


    function CardUse() {
        switch (gc.game!.playing!.value) {
            case 1:
                const [card, setCard] = useState<Card>(new Card(1, "//", "//", "guessing-1"));

                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-row items-center justify-center">
                            <p className="text-white/60 text-xl font-semibold mb-2">Guess a card</p>
                        </div>
                        <div>
                            <Image src={parseCardPath(card)} width={256} height={256} alt="1" className="w-28 h-auto select-none" />
                        </div>
                        <div className="flex flex-row items-center justify-center mt-2 gap-2">
                            <div className="flex flex-row hand-background rounded-md hover:!bg-blue-300/30 hover:!border-blue-300/60 hover:cursor-pointer duration-200 transition-all" onClick={() => {setCard(card.value === 1 ? new Card(10, "//", "//", "guessing-10") : new Card(card.value - 1 as cv, "//", "//", `guessing-${card.value - 1}`))}}>
                                <ChevronLeft width={48} height={48} className="w-8 h-auto text-white pointer-events-none" />
                            </div>
                            <p className={`text-lg text-white/80 hand-background rounded-md px-2 h-full hover:!bg-blue-300/30 hover:!border-blue-300/60 select-none ${card.value === 1 ? "hover:cursor-not-allowed pointer-events-hover" : "hover:cursor-pointer"} duration-200 transition-all`} onClick={() => {guess(card)}}>Guess</p>
                            <div className="flex flex-row hand-background rounded-md hover:!bg-blue-300/30 hover:!border-blue-300/60 hover:cursor-pointer duration-200 transition-all" onClick={() => {setCard(card.value === 10 ? new Card(1, "//", "//", "guessing-1") : new Card(card.value + 1 as cv, "//", "//", `guessing-${card.value + 1}`))}} >
                                <ChevronRight width={48} height={48} className="w-8 h-auto text-white pointer-events-none" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                const [position, setPosition] = useState<number>(1);
                const c2 = gc.game!.deck.pop();
                return (
                    <div>
                        <p>2</p>
                    </div>
                );
            case 3:
            case 6:
            
            default:
                return (
                    <div className="flex flex-col w-full items-center justify-center">
                        <CircleSlash width={48} height={48} className="w-12 h-auto text-white/80" />
                        <p className="text-white/80 pt-4 text-lg">Waiting...</p>
                    </div>
                )
        }
    }

    return (
        <GameContext.Provider value={gc}>
            <div className="hand-background rounded-md py-4 px-8 h-full flex flex-col items-center justify-center min-w-64">
                {
                    gc.game ?
                        gc.game.playing ? 
                            <CardUse />
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
    
    const [gc, setGc] = useState<gcType>({game: null, playerId: 0});
    const [_, fupdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        setGc({game: new Game("1", fupdate, new Toasts(fupdate)), playerId: 1})
    }, []);

    return (
        <GameContext.Provider value={gc}>
            <main className="fixed top-0 left-0 w-screen h-screen boarded-background flex items-center justify-center">
                {gc.game && (
                    
                    gc.game.finished ?
                        (
                            <div>
                                <p>game finished</p>
                            </div>
                        )
                    : 
                        (<div className="flex flex-col gap-12 items-center justify-center w-full relative">
                            <Prompt />
                            <div className="flex flex-row gap-4"> {/* opponent hand */}
                                <Hand id={0} />
                                <DiscardedHand id={0} />
                            </div>

                            <div className="flex flex-row gap-4">
                                <div> {/* deck */}
                                    <Deck />
                                </div>
                                <div> {/* area of play */}
                                    <ActionBoard />
                                </div>
                            </div>

                            <div className="flex flex-row gap-4"> {/* player hand */}
                                <Hand id={1} />
                                <DiscardedHand id={1} />
                            </div>
                            <div className="absolute top-full overflow-hidden pb-8 px-4">{gc.game && (<ToastsC tm={gc.game!.tm} />)}</div>
                        </div>)
                )}
            </main>
        </GameContext.Provider>
    )
}