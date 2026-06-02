

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

    constructor (public readonly id: string) { }


    initialise(players: User[]): void {

    }

    nextTurn(): void {

    }

    checkEnd(): boolean {
        return false;
    }

}
