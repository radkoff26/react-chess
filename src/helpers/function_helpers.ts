import {Figure} from "../models/figures/figure";
import {Empty} from "../models/figures/empty";
import {Coords} from "../logic/logic_functions";
import {PlayerSide} from "./enums";

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
export function checkBoundsAndEnemy(field: Figure[][], x: number, y: number, color: PlayerSide): boolean {
    return checkBounds(x, y) && color !== field[x][y].side && !(field[x][y] instanceof Empty);
}

// Function that provides checking of bounds and checks if on the particular cell there is no figure or there is an enemy
export function checkBoundsAndEmptinessAndEnemy(field: Figure[][], x: number, y: number, color: PlayerSide): boolean {
    return checkBounds(x, y) && (color !== field[x][y].side || field[x][y] instanceof Empty);
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

// Function that converts seconds to minutes and seconds
export function convertSecondsToMinutesAndSeconds(secondsOverall: number): string {
    let minutes = Math.floor(secondsOverall / 60)
    let seconds = secondsOverall % 60

    let stringMinutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString()
    let stringSeconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString()

    return stringMinutes + ':' + stringSeconds;
}

// Function that converts Coords object to coordinates of the field
export function convertCoordsToFieldCoords(coords: Coords): string {
    return ('ABCDEFGH'.charAt(coords.y)).toString() + '' + (coords.x + 1).toString()
}

export function copyArray<T>(array: T[]): T[] {
    let newArray: T[] = []
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i])
    }
    return newArray
}

export function copyDoubleArray<T>(array: T[][]): T[][] {
    let newArray: T[][] = []
    let i: number = 0
    for (let j = 0; j < array.length; j++) {
        newArray.push([])
        for (let k = 0; k < array.length; k++) {
            newArray[i].push(array[j][k])
        }
        i++
    }
    return newArray
}