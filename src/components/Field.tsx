import React, {useState} from 'react';
import Cell, {CellProps} from "./Cell";
import {Figure} from "../models/figures/figure";
import {SIGNATURES_TO_OBJECTS} from "../models/definitions";
import '../scss/field.scss'
import {calculateSteps, Coords} from "../logic/logic_functions";
import {Direction} from "../helpers/enums";
import {getInitialField} from "../helpers/adjusting_functions";
import {Empty} from "../models/figures/empty";
import {Pawn} from "../models/figures/pawn";
import {includes} from "../helpers/function_helpers";

const Field = () => {
    const [field, setField] = useState<Figure[][]>(getInitialField('W', 'B'))
    const [steps, setSteps] = useState<Coords[]>([])
    const [pickedFigureCoords, setPickedFigureCoords] = useState<Coords>({x: -1, y: -1})

    const chooseFigure = (i: number, j: number) => {
        setPickedFigureCoords({x: i, y: j})
        setSteps(calculateSteps(field, i, j, Direction.UP))
    }

    const toSwap = (field: Figure[][], i1: number, j1: number, i2: number, j2: number) => {
        let temp: Figure = field[i1][j1]
        field[i1][j1] = field[i2][j2];
        field[i2][j2] = temp;
        setField(field)
    }

    const toBeat = (field: Figure[][], i1: number, j1: number, i2: number, j2: number) => {
        field[i1][j1] = field[i2][j2];
        field[i2][j2] = new Empty();
        setField(field)
    }

    const makeStep = (i: number, j: number) => {
        if (includes({x: i, y: j}, steps) && pickedFigureCoords) {
            if (!(field[i][j] instanceof Empty)) {
                toBeat(field, i, j, pickedFigureCoords.x, pickedFigureCoords.y)
            } else {
                toSwap(field, i, j, pickedFigureCoords.x, pickedFigureCoords.y)
            }
            setSteps([])
        }
    }

    return (
        <div className='field'>
            {field.map((array, i) => {
                return array.map((value: Figure, j: number) => {
                    let props: CellProps = new class implements CellProps {
                        cellColor: string = '';
                        figure: Figure = value;
                        i: number = i;
                        isPossibleToStep: boolean = includes({x: i, y: j}, steps);
                        j: number = j;
                        //@ts-ignore
                        url: string = SIGNATURES_TO_OBJECTS[value.signature].url;

                        callbackToChoose(i: number, j: number): void {
                            chooseFigure(i, j)
                        }

                        callbackToMakeStep(i: number, j: number): void {
                            makeStep(i, j)
                        }
                    }
                    if ((j + (i % 2)) % 2 === 0) {
                        props.cellColor = 'B'
                    } else {
                        props.cellColor = 'W'
                    }
                    return <Cell
                        key={i + '' + j}
                        cellColor={props.cellColor}
                        url={props.url}
                        figure={props.figure}
                        isPossibleToStep={props.isPossibleToStep}
                        i={props.i}
                        j={props.j}
                        callbackToChoose={chooseFigure}
                        callbackToMakeStep={makeStep}
                    />
                })
            })}
        </div>
    );
};

export default Field;
