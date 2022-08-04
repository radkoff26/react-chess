import {Figure} from "../models/figures/figure";
import {SIGNATURES_TO_OBJECTS} from "../models/definitions";

// Initial field arrangement made of strings
// It will be processed in "adjustField" method below
const initialField: string[][] = [
    ['R', 'KN', 'B', 'K', 'Q', 'B', 'KN', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'KN', 'B', 'K', 'Q', 'B', 'KN', 'R']
]

// Function that processes initial field - it fills it according to the colors of players
// "p1" and "p2" stand for "player1" and "player2"
function adjustField(p1: string, p2: string, field: string[][]): string[][] {
    const newField: string[][] = JSON.parse(JSON.stringify(field))
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
            newField[i][j] = p1 + newField[i][j]
        }
    }
    for (let i = 6; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            newField[i][j] = p2 + newField[i][j]
        }
    }
    return newField;
}

// Function that is made in JS-style
// It returns final initial array of Figure objects by iterating over all the elements of the string initial array
// According to elements of this array it constructs new array
function convertField(field: string[][]): Figure[][] {
    const newField: Figure[][] = []
    for (let i = 0; i < field.length; i++) {
        newField.push([])
        for (let j = 0; j < field[i].length; j++) {
            // SIGNATURE_TO_OBJECTS is just a simplification for initial array processing
            //@ts-ignore
            newField[i][j] = SIGNATURES_TO_OBJECTS[field[i][j]].callback()
        }
    }
    return newField;
}

// Function that combines two functions above and returns complete initial array of Figure objects
export function getInitialField(colorSignatureOfPlayer1: string, colorSignatureOfPlayer2: string): Figure[][] {
    return convertField(adjustField(colorSignatureOfPlayer1, colorSignatureOfPlayer2, initialField))
}