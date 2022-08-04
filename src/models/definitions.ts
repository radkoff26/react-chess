import {Pawn} from "./figures/pawn";
import {Rook} from "./figures/rook";
import {Knight} from "./figures/knight";
import {Bishop} from "./figures/bishop";
import {Queen} from "./figures/queen";
import {King} from "./figures/king";
import {Empty} from "./figures/empty";

import blackPawn from '../assets/black_pawn.svg'
import whitePawn from '../assets/white_pawn.svg'
import blackRook from '../assets/black_rook.svg'
import whiteRook from '../assets/white_rook.svg'
import blackKnight from '../assets/black_knight.svg'
import whiteKnight from '../assets/white_knight.svg'
import blackBishop from '../assets/black_bishop.svg'
import whiteBishop from '../assets/white_bishop.svg'
import blackQueen from '../assets/black_queen.svg'
import whiteQueen from '../assets/white_queen.svg'
import blackKing from '../assets/black_king.svg'
import whiteKing from '../assets/white_king.svg'

export const SIGNATURES_TO_OBJECTS = {
    'BP': {
        callback: () => new Pawn('B'),
        url: blackPawn
    },
    'WP': {
        callback: () => new Pawn('W'),
        url: whitePawn
    },
    'BR': {
        callback: () => new Rook('B'),
        url: blackRook
    },
    'WR': {
        callback: () => new Rook('W'),
        url: whiteRook
    },
    'BKN': {
        callback: () => new Knight('B'),
        url: blackKnight
    },
    'WKN': {
        callback: () => new Knight('W'),
        url: whiteKnight
    },
    'BB': {
        callback: () => new Bishop('B'),
        url: blackBishop
    },
    'WB': {
        callback: () => new Bishop('W'),
        url: whiteBishop
    },
    'BQ': {
        callback: () => new Queen('B'),
        url: blackQueen
    },
    'WQ': {
        callback: () => new Queen('W'),
        url: whiteQueen
    },
    'BK': {
        callback: () => new King('B'),
        url: blackKing
    },
    'WK': {
        callback: () => new King('W'),
        url: whiteKing
    },
    '': {
        callback: () => new Empty(),
        url: ''
    }
}