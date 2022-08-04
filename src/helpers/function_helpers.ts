import {Figure} from "../models/figures/figure";
import {Empty} from "../models/figures/empty";
import {Coords} from "../logic/logic_functions";

// Function that provides checking of bounds
export function checkBounds(...indices: number[]): boolean {
    for (const index of indices) {
        if (!(index >= 0 && index < 8)) {
            return false;
        }
    }
    return true;
}

// Function that provides checking of bounds and checks if on the particular cell there is no figure
export function checkBoundsAndEmptiness(field: Figure[][], x: number, y: number): boolean {
    return checkBounds(x, y) && field[x][y] instanceof Empty;
}

// Function that provides checking of bounds and checks if on the particular cell there is an enemy
export function checkBoundsAndEnemy(field: Figure[][], x: number, y: number, color: string): boolean {
    return checkBounds(x, y) && color !== field[x][y].color && !(field[x][y] instanceof Empty);
}

// Function that provides checking of bounds and checks if on the particular cell there is no figure or there is an enemy
export function checkBoundsAndEmptinessAndEnemy(field: Figure[][], x: number, y: number, color: string): boolean {
    return checkBounds(x, y) && (color !== field[x][y].color || field[x][y] instanceof Empty);
}

// Function that checks if there is given coords included in the array
// P.S. There is a method in Array.prototype (includes) that can do the same functionality but it doesn't work in this case
export function includes(coords: Coords, steps: Coords[]): boolean {
    for (let step of steps) {
        if (coords.x === step.x && coords.y === step.y) {
            return true;
        }
    }
    return false;
}