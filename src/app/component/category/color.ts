export class Color {
    id: number;
    cor: string;
    selected: boolean

    constructor(id: number, cor: string, selected: boolean) {
        this.id = id;
        this.cor = cor;
        this.selected = selected;
    }
}