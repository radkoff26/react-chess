import {Figure} from "../models/figures/figure";
import {Empty} from "../models/figures/empty";
import {Coords} from "../logic/logic_functions";

export function checkBounds(...indices: number[]): boolean {
    for (const index of indices) {
        if (!(index >= 0 && index < 8)) {
            return false;
        }
    }
    return true;
}

export function checkBoundsAndEmptiness(field: Figure[][], x: number, y: number): boolean {
    return checkBounds(x, y) && field[x][y] instanceof Empty;
}

export function checkBoundsAndEnemy(field: Figure[][], x: number, y: number, color: string): boolean {
    return checkBounds(x, y) && color !== field[x][y].color && !(field[x][y] instanceof Empty);
}

export function checkBoundsAndEmptinessAndEnemy(field: Figure[][], x: number, y: number, color: string): boolean {
    return checkBounds(x, y) && (color !== field[x][y].color || field[x][y] instanceof Empty);
}

export function includes(coords: Coords, steps: Coords[]): boolean {
    for (let step of steps) {
        if (coords.x === step.x && coords.y === step.y) {
            return true;
        }
    }
    return false;
}