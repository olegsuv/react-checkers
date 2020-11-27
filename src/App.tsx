import React from 'react';
import './App.css';

type Cell = {
    id: number,
    row: number,
    column: number,
    color: string,
    isUnitFocused: boolean,
    isCellMoveFocused: boolean,
    isCellAttackFocused: boolean,
    canAttack: boolean,
    teamA: boolean,
    teamB: boolean
}

type CurrentTurn = 'teamA' | 'teamB'

const brainLessAI = true

class App extends React.Component {
    public state = {
        field: [] as Cell[],
        currentTurn: 'teamA' as CurrentTurn,
        teamWon: null,
    }

    private generateField(): void {
        let generatedField = [...this.state.field]
        for (let i = 0; i < 64; i++) {
            const color = (i + Math.floor(i / 8)) % 2 ? 'dark' : 'light'
            generatedField.push({
                id: i,
                row: Math.floor(i / 8),
                column: i % 8,
                color,
                isUnitFocused: false,
                isCellMoveFocused: false,
                isCellAttackFocused: false,
                canAttack: false,
                teamA: i < 24 && color === 'dark',
                teamB: i >= 40 && color === 'dark'
            })
        }
        this.setState({field: generatedField})
    }

    public componentDidMount(): void {
        this.generateField()
    }

    private getFieldCell(cell: Cell) {
        let unitClass = 'team '
        if (cell.teamA) {
            unitClass += 'teamA '
        }
        if (cell.teamB) {
            unitClass += 'teamB '
        }
        if (cell.isUnitFocused) {
            unitClass += 'focused '
        }
        if (cell.canAttack) {
            unitClass += 'attack '
        }

        let cellClass = `cell ${cell.color} `
        if (cell.isCellMoveFocused) {
            cellClass += 'focused '
        }
        if (cell.isCellAttackFocused) {
            cellClass += 'attack '
        }

        return (
            <div key={cell.id} className={cellClass} onClick={() => this.onCellClick(cell)}>
                {(cell.teamA || cell.teamB) && (
                    <div className={unitClass} onClick={() => this.onUnitClick(cell)}/>
                )}
            </div>
        )
    }

    public render() {
        return (
            <main className="App">
                <header className="App-header">
                    <h1>Checkers</h1>
                </header>
                <section className="game">
                    <h2>Current turn: {this.state.currentTurn}</h2>
                    <div className="board">
                        {this.state.field.map(this.getFieldCell.bind(this))}
                    </div>
                </section>
            </main>
        )
    }

    private getMoveField(field: Cell[], clickedUnit: Cell, horizontalDirectionIndex: number) {
        const temporaryField = [...field]
        const verticalDirectionIndex = clickedUnit.teamA ? 1 : -1

        let moveIndex = temporaryField.findIndex((cell) =>
            cell.row === clickedUnit.row + verticalDirectionIndex &&
            cell.column === clickedUnit.column + horizontalDirectionIndex &&
            !cell.teamA &&
            !cell.teamB
        )
        if (moveIndex !== -1) {
            temporaryField[moveIndex].isCellMoveFocused = true
            return temporaryField
        }

        return temporaryField
    }

    private getAttackedField(field: Cell[], checkingCell: Cell, horizontalDirectionIndex: number, mode: 'unit' | 'cell') {
        const temporaryField = [...field]
        const verticalDirectionIndex = checkingCell.teamA ? 1 : -1

        //check attack
        const currentTeam = this.state.currentTurn
        const enemyTeam = this.state.currentTurn === 'teamA' ? 'teamB' : 'teamA'
        let checkingNearCellIndex = temporaryField.findIndex((cell) =>
            cell.row === checkingCell.row + verticalDirectionIndex &&
            cell.column === checkingCell.column + horizontalDirectionIndex
        )
        if (checkingNearCellIndex !== -1 && temporaryField[checkingNearCellIndex][enemyTeam]) {
            let checkingFarCellIndex = temporaryField.findIndex((cell) =>
                cell.row === checkingCell.row + verticalDirectionIndex * 2 &&
                cell.column === checkingCell.column + horizontalDirectionIndex * 2
            )
            if (checkingFarCellIndex !== -1 &&
                !temporaryField[checkingFarCellIndex][currentTeam] &&
                !temporaryField[checkingFarCellIndex][enemyTeam]) {
                if (mode === 'unit') {
                    temporaryField[checkingCell.id].canAttack = true
                }
                if (mode === 'cell') {
                    temporaryField[checkingFarCellIndex].isCellAttackFocused = true
                }
                return temporaryField
            }
        }

        return temporaryField
    }

    private checkAllTargets() {
        let field = [...this.state.field]
        const currentTeam = field.filter(cell => cell[this.state.currentTurn])
        for (let i = 0; i < currentTeam.length; i++) {
            field = this.getAttackedField(field, currentTeam[i], 1, 'unit')
            field = this.getAttackedField(field, currentTeam[i], -1, 'unit')
        }

        this.setState({field}, this.brainLessAIMoves)
    }

    private brainLessAIMoves() {
        if (!brainLessAI || this.state.currentTurn === 'teamA') {
            return false
        }

        let field = [...this.state.field]
        let units = field.filter(cell => cell.teamB)
        let attackingUnits = units.filter(unit => unit.canAttack)
        if (attackingUnits.length) {
            const attackedCell = this.getFieldWithPossibleCells(attackingUnits[0]).find(cell => cell.isCellAttackFocused)
            // @ts-ignore
            this.processAttack(attackedCell)
        } else {
            for (let unit of units) {
                const movingCell = this.getFieldWithPossibleCells(unit).find(cell => cell.isCellMoveFocused)
                if (movingCell) {
                    this.processMove(movingCell)
                    break;
                }
            }
        }
    }

    private processTurn(field: Cell[]) {
        const newTurn = this.state.currentTurn === 'teamA' ? 'teamB' : 'teamA'
        for (let i = 0; i < field.length; i++) {
            field[i].isUnitFocused = false
            field[i].isCellMoveFocused = false
            field[i].isCellAttackFocused = false
            field[i].canAttack = false
        }
        this.setState({field, currentTurn: newTurn}, this.checkAllTargets)
    }

    private processMove(clickedCell: Cell) {
        const field = [...this.state.field]
        const clickedTeamID = field.findIndex((cell) => cell.isUnitFocused)
        const clickedCellID = field.findIndex((cell) => cell.id === clickedCell.id)
        field[clickedTeamID][this.state.currentTurn] = false
        field[clickedCellID][this.state.currentTurn] = true
        this.processTurn(field)
    }

    private processAttack(clickedCell: Cell) {
        const field = [...this.state.field]
        const clickedTeamID = field.findIndex((cell) => cell.isUnitFocused)
        const clickedCellID = field.findIndex((cell) => cell.id === clickedCell.id)
        const enemyTeam = this.state.currentTurn === 'teamA' ? 'teamB' : 'teamA'
        const victimID = (clickedTeamID + clickedCell.id) / 2
        field[clickedTeamID][this.state.currentTurn] = false
        field[clickedCellID][this.state.currentTurn] = true
        field[victimID][enemyTeam] = false
        this.processTurn(field)
    }

    private onCellClick(clickedCell: Cell) {
        if (clickedCell.isCellMoveFocused) {
            this.processMove(clickedCell)
        }
        const isUnitFocused = this.state.field.filter((cell) => cell.isUnitFocused).length
        if (isUnitFocused && clickedCell.isCellAttackFocused) {
            this.processAttack(clickedCell)
        }
    }

    private getFieldWithPossibleCells(clickedUnit: Cell) {
        let field = [...this.state.field]
        for (let i = 0; i < field.length; i++) {
            field[i].isUnitFocused = false
            field[i].isCellMoveFocused = false
            field[i].isCellAttackFocused = false
        }
        field[clickedUnit.id].isUnitFocused = true

        if (clickedUnit.canAttack) {
            field = this.getAttackedField(field, clickedUnit, 1, 'cell')
            field = this.getAttackedField(field, clickedUnit, -1, 'cell')
        } else {
            field = this.getMoveField(field, clickedUnit, 1)
            field = this.getMoveField(field, clickedUnit, -1)
        }

        return field
    }

    private onUnitClick(clickedUnit: Cell) {
        if (!clickedUnit[this.state.currentTurn]) {
            return false
        }
        const isAnyoneCanAttack = this.state.field.filter((cell) => cell.canAttack).length
        if (isAnyoneCanAttack && !clickedUnit.canAttack) {
            return false
        }

        const newField = this.getFieldWithPossibleCells(clickedUnit)

        this.setState({field: newField})
    }
}

export default App;
