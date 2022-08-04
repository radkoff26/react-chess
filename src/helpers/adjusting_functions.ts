import {Figure} from "../models/figures/figure";
import {SIGNATURES_TO_OBJECTS} from "../models/definitions";

const initialField: string[][] = [
    ['R', 'KN', 'B', 'K', 'Q', 'B', 'KN', 'R'],
    ['P', 'P',  'P', 'P', 'P', 'P', 'P',  'P'],
    ['',   '',  '',   '',  '',  '',  '',   ''],
    ['',   '',  '',   '',  '',  '',  '',   ''],
    ['',   '',  '',   '',  '',  '',  '',   ''],
    ['',   '',  '',   '',  '',  '',  '',   ''],
    ['P', 'P',  'P', 'P', 'P', 'P', 'P',  'P'],
    ['R', 'KN', 'B', 'K', 'Q', 'B', 'KN', 'R']
]

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

function convertField(field: string[][]): Figure[][] {
    const newField: Figure[][] = []
    for (let i = 0; i < field.length; i++) {
        newField.push([])
        for (let j = 0; j < field[i].length; j++) {
            //@ts-ignore
            newField[i][j] = SIGNATURES_TO_OBJECTS[field[i][j]].callback()
        }
    }
    return newField;
}

export function getInitialField(colorSignatureOfPlayer1: string, colorSignatureOfPlayer2: string): Figure[][] {
    return convertField(adjustField(colorSignatureOfPlayer1, colorSignatureOfPlayer2, initialField))
}