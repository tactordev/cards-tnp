import { ActionDispatch } from "react";




function shuffle(array: any[]) { // Credits: Fisher-Yates
    let curIndex = array.length;

    while (curIndex != 0) {
        let randomIndex = Math.floor(Math.random() * curIndex)
        curIndex--;

        [ array[curIndex], array[randomIndex] ] = [ array[randomIndex], array[curIndex] ];


    }

}

const details: Record<cv, { name: string; description: string; }> = {
    1: { name: "//", description: "Guess the card in a player's hand." },
    2: { name: "Chirping Sterling", description: "Look at the top card of the deck and put it back anywhere." },
    3: { name: "Stubborn bucks", description: "Compare card values, the lower is out." },
    4: { name: "//", description: "You are protected until your next turn." },
    5: { name: "//", description: "Make a player flip over the card in their hand. If it's a 10, they're out. If it's not, they get a new card." },
    6: { name: "//", description: "Look at the card in the grave and choose one of your cards to put back anywhere in the deck." },
    7: { name: "//", description: "All unprotected players shuffle the cards in their hand back into the deck. They then receive new cards." },
    8: { name: "//", description: "Choose a player to swap cards with." },
    9: { name: "//", description: "If an unprotected player has a 10, they swap cards with you." },
    10: { name: "//", description: "If this card gets flipped over for any reason, you're out." },
    0: { name: "//", description: "Wins against a 10 in battle and at the end of the game." }

}
export type cv = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export class Card {
    constructor ( public readonly value: cv, public readonly name: string, public readonly description: string ) { }

    execute(game: Game, agent: User, instrument: User, value?: cv) {
        // execute action, implement later
    }
}



export class User {
    public hand: Card[] = [];
    public eliminated: boolean = false;
    public protected: boolean = false;

    constructor(public readonly id: string, public name: string) { };

    draw(card: Card) {
        return this.hand.push(card);
    }

    play(value: number): Card | boolean {
        const index = this.hand.findIndex(card => card.value === value);
        if (index === -1) return false;
        return this.hand.splice(index, 1)[0];
    }   
}

export default class Game {
    public deck: Card[] = [];
    public players: User[] = [];
    public grave: Card | null = null;
    public turn: User | null = null;
    public playing: Card | null = null;

    constructor (public readonly id: string, public frender: ActionDispatch<[]>) {
        this.players = [];
        this.initialise([new User("1", "user"), new User("2", "computer")]);

    }

    private randomiseDeck() {
        console.log("Randomising deck...");
        const deckPool: cv[] = [
            1, 1, 1, 1, 1,
            2, 2, 2,
            3, 3, 3,
            4, 4,
            5, 5,
            6,
            7,
            8,
            9,
            10,
            0
        ]
        shuffle(deckPool);
        
        this.deck = deckPool.map((value) => {
            const info = details[value] || { name: "//", descrpition: "??" };
            return new Card(value, info.name, info.description);
        });

        this.frender();
    }

    initialise(players: User[]): void {
        this.randomiseDeck();
        
        const top = this.deck.pop();
        const second = this.deck.pop();
        
        this.players.push(players[0]);
        this.players.push(players[1]);
        
        if (top) this.players[0].hand.push(top);
        if (second) this.players[1].hand.push(second);

        this.frender();
    }

    nextTurn(): void {

    }

    checkEnd(): boolean {
        return false;
    }


}
