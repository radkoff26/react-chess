import {Figure} from "../models/figures/figure";
import {Pawn} from "../models/figures/pawn";
import {Direction, PlayerSide} from "../helpers/enums";
import {Empty} from "../models/figures/empty";
import {Rook} from "../models/figures/rook";
import {Knight} from "../models/figures/knight";
import {
    checkBounds,
    checkBoundsAndEmptiness,
    checkBoundsAndEmptinessAndEnemy,
    checkBoundsAndEnemy, includes
} from "../helpers/function_helpers";
import {Bishop} from "../models/figures/bishop";
import {Queen} from "../models/figures/queen";
import {King} from "../models/figures/king";
import {HasStep} from "../models/figures/has_step";

// Interface to store coordinates of some cell
export interface Coords {
    x: number
    y: number
}

export function findDirection(color: PlayerSide): Direction {
    return color === PlayerSide.W ? Direction.DOWN : Direction.UP;
}

function getCastlingIfPossible(field: Figure[][], i: number, j: number): Coords[] {
    if (!(field[i][j] instanceof King) && !(field[i][j] as unknown as HasStep).hasStepped) {
        return [] as Coords[]
    }

    const side: PlayerSide = field[i][j].side
    const rooksCoords: Coords[] = []
    const possibleCastling: Coords[] = []

    for (let k = 0; k < 8; k++) {
        for (let l = 0; l < 8; l++) {
            if (field[k][l] instanceof Rook && field[k][l].side === side) {
                rooksCoords.push({x: k, y: l})
            }
        }
    }

    for (let rookCoords of rooksCoords) {
        if (!(field[rookCoords.x][rookCoords.y] as unknown as HasStep).hasStepped) {
            let start = Math.min(rookCoords.y, j)
            let end = Math.max(rookCoords.y, j)
            for (let k = start + 1; k < end; k++) {
                if (!(field[i][k] instanceof Empty)) {
                    break
                }
                if (k === end - 1) {
                    possibleCastling.push(rookCoords)
                }
            }
        }
    }

    return possibleCastling
}

// Function to calculate possible steps for Rook
function calculateRook(field: Figure[][], i: number, j: number, steps: Coords[]): void {
    // Vertical down check
    for (let k = i + 1; k < 8; k++) {
        if (!(field[k][j] instanceof Empty)) {
            if (field[k][j].side !== field[i][j].side) {
                steps.push({x: k, y: j})
            }
            break;
        }
        steps.push({x: k, y: j})
    }

    // Vertical up check
    for (let k = i - 1; k >= 0; k--) {
        if (!(field[k][j] instanceof Empty)) {
            if (field[k][j].side !== field[i][j].side) {
                steps.push({x: k, y: j})
            }
            break;
        }
        steps.push({x: k, y: j})
    }

    // Horizontal right check
    for (let k = j + 1; k < 8; k++) {
        if (!(field[i][k] instanceof Empty)) {
            if (field[i][k].side !== field[i][j].side) {
                steps.push({x: i, y: k})
            }
            break;
        }
        steps.push({x: i, y: k})
    }

    // Horizontal left check
    for (let k = j - 1; k >= 0; k--) {
        if (!(field[i][k] instanceof Empty)) {
            if (field[i][k].side !== field[i][j].side) {
                steps.push({x: i, y: k})
            }
            break;
        }
        steps.push({x: i, y: k})
    }
}

// Function to calculate steps for Bishop
function calculateBishop(field: Figure[][], i: number, j: number, steps: Coords[]): void {
    // Diagonal to right bottom
    for (let k = i + 1, l = j + 1; k < 8 && l < 8; k++, l++) {
        if (!(field[k][l] instanceof Empty)) {
            if (field[k][l].side !== field[i][j].side) {
                steps.push({x: k, y: l})
            }
            break;
        }
        steps.push({x: k, y: l})
    }

    // Diagonal to right top
    for (let k = i - 1, l = j + 1; k >= 0 && l < 8; k--, l++) {
        if (!(field[k][l] instanceof Empty)) {
            if (field[k][l].side !== field[i][j].side) {
                steps.push({x: k, y: l})
            }
            break;
        }
        steps.push({x: k, y: l})
    }

    // Diagonal to left bottom
    for (let k = i + 1, l = j - 1; k < 8 && l >= 0; k++, l--) {
        if (!(field[k][l] instanceof Empty)) {
            if (field[k][l].side !== field[i][j].side) {
                steps.push({x: k, y: l})
            }
            break;
        }
        steps.push({x: k, y: l})
    }

    // Diagonal to left top
    for (let k = i - 1, l = j - 1; k >= 0 && l >= 0; k--, l--) {
        if (!(field[k][l] instanceof Empty)) {
            if (field[k][l].side !== field[i][j].side) {
                steps.push({x: k, y: l})
            }
            break;
        }
        steps.push({x: k, y: l})
    }
}

// Function to check if the king is not under a shah (safe)
export function checkIfKingIsSafe(field: Figure[][], color: PlayerSide): boolean {
    const kingSignature = color + 'K';

    let i: number = -1, j: number = -1

    // Here certain king is found
    for (let k = 0; k < 8; k++) {
        for (let l = 0; l < 8; l++) {
            if (field[k][l].signature === kingSignature) {
                i = k
                j = l
                break
            }
        }
    }

    const enemyColor = color === PlayerSide.W ? PlayerSide.B : PlayerSide.W
    const possibleStepsOfEnemies: Set<Coords> = new Set<Coords>()

    let temp: Coords[]

    // Calculate all possible steps of enemies
    for (let k = 0; k < 8; k++) {
        for (let l = 0; l < 8; l++) {
            if (field[k][l].side === enemyColor) {
                temp = calculateSteps(field, k, l, findDirection(enemyColor))
                for (let c of temp) {
                    possibleStepsOfEnemies.add(c)
                }
            }
        }
    }

    const array = Array.from(possibleStepsOfEnemies)

    // It returns true if the king's coords are in the array of all possible steps of enemies
    // Consequently, it means that the king is under a shah (not safe)
    return !includes({x: i, y: j}, array);
}

export function calculateSteps(field: Figure[][], i: number, j: number, direction: Direction): Coords[] {
    if (!checkBounds(i, j)) throw new Error("Index is out of bounds of the field!")
    const figure: Figure = field[i][j]
    const steps: Coords[] = []
    // PAWN LOGIC
    if (figure instanceof Pawn) {
        if (direction === Direction.UP) {
            if (checkBoundsAndEmptiness(field, i - 1, j)) {
                steps.push({x: i - 1, y: j})
                if (i === 6) {
                    if (checkBoundsAndEmptiness(field, i - 2, j)) {
                        steps.push({x: i - 2, y: j})
                    }
                }
            }
            if (checkBoundsAndEnemy(field, i - 1, j - 1, figure.side)) {
                steps.push({x: i - 1, y: j - 1})
            }
            if (checkBoundsAndEnemy(field, i - 1, j + 1, figure.side)) {
                steps.push({x: i - 1, y: j + 1})
            }
        } else {
            if (checkBoundsAndEmptiness(field, i + 1, j)) {
                steps.push({x: i + 1, y: j})
                if (i === 1) {
                    if (checkBoundsAndEmptiness(field, i + 2, j)) {
                        steps.push({x: i + 2, y: j})
                    }
                }
            }
            if (checkBoundsAndEnemy(field, i + 1, j + 1, figure.side)) {
                steps.push({x: i + 1, y: j + 1})
            }
            if (checkBoundsAndEnemy(field, i + 1, j - 1, figure.side)) {
                steps.push({x: i + 1, y: j - 1})
            }
        }
    }
    // ROOK LOGIC
    else if (figure instanceof Rook) {
        calculateRook(field, i, j, steps)
    }
    // KNIGHT LOGIC
    else if (figure instanceof Knight) {
        if (checkBoundsAndEmptinessAndEnemy(field, i + 1, j + 2, figure.side)) {
            steps.push({x: i + 1, y: j + 2})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i + 1, j - 2, figure.side)) {
            steps.push({x: i + 1, y: j - 2})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i - 1, j + 2, figure.side)) {
            steps.push({x: i - 1, y: j + 2})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i - 1, j - 2, figure.side)) {
            steps.push({x: i - 1, y: j - 2})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i + 2, j + 1, figure.side)) {
            steps.push({x: i + 2, y: j + 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i + 2, j - 1, figure.side)) {
            steps.push({x: i + 2, y: j - 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i - 2, j + 1, figure.side)) {
            steps.push({x: i - 2, y: j + 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i - 2, j - 1, figure.side)) {
            steps.push({x: i - 2, y: j - 1})
        }
    }
    // BISHOP LOGIC
    else if (figure instanceof Bishop) {
        calculateBishop(field, i, j, steps)
    }
    // QUEEN LOGIC
    else if (figure instanceof Queen) {
        calculateRook(field, i, j, steps)
        calculateBishop(field, i, j, steps)
    }
    // KING LOGIC
    else if (figure instanceof King) {
        if (checkBoundsAndEmptinessAndEnemy(field, i - 1, j + 1, figure.side)) {
            steps.push({x: i - 1, y: j + 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i + 1, j + 1, figure.side)) {
            steps.push({x: i + 1, y: j + 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i + 1, j - 1, figure.side)) {
            steps.push({x: i + 1, y: j - 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i - 1, j - 1, figure.side)) {
            steps.push({x: i - 1, y: j - 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i, j + 1, figure.side)) {
            steps.push({x: i, y: j + 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i, j - 1, figure.side)) {
            steps.push({x: i, y: j - 1})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i + 1, j, figure.side)) {
            steps.push({x: i + 1, y: j})
        }
        if (checkBoundsAndEmptinessAndEnemy(field, i - 1, j, figure.side)) {
            steps.push({x: i - 1, y: j})
        }

        steps.push(...getCastlingIfPossible(field, i, j))
    }
    return steps;
}