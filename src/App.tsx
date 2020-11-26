import React from 'react';
import './App.css';

type Cell = {
    id: number,
    row: number,
    column: number,
    color: string,
    isTeamFocused: boolean,
    isCellMoveFocused: boolean,
    isCellAttackFocused: boolean,
    teamA: boolean,
    teamB: boolean
}

type CurrentTurn = 'teamA' | 'teamB'

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
                isTeamFocused: false,
                isCellMoveFocused: false,
                isCellAttackFocused: false,
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
        let teamClass = 'team '
        if (cell.teamA) {
            teamClass += 'teamA '
        }
        if (cell.teamB) {
            teamClass += 'teamB '
        }
        if (cell.isTeamFocused) {
            teamClass += 'focused '
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
                    <div className={teamClass} onClick={() => this.onTeamClick(cell)}/>
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

    private onCellClick(clickedCell: Cell) {
        if (!clickedCell.isCellMoveFocused) {
            return false
        }

        const field = [...this.state.field]
        const clickedTeamID = field.findIndex((cell) => cell.isTeamFocused)
        const clickedCellID = field.findIndex((cell) => cell.id === clickedCell.id)
        if (clickedTeamID !== -1 && clickedCellID !== -1) {
            field[clickedTeamID][this.state.currentTurn] = false
            field[clickedCellID][this.state.currentTurn] = true
        }
        const newTurn = this.state.currentTurn === 'teamA' ? 'teamB' : 'teamA'
        for (let i = 0; i < field.length; i++) {
            field[i].isTeamFocused = false
            field[i].isCellMoveFocused = false
            field[i].isCellAttackFocused = false
        }
        this.setState({field, currentTurn: newTurn})
    }

    private getFocusedField(field: Cell[], clickedTeam: Cell, horizontalDirectionIndex: number) {
        const temporaryField = [...field]
        const verticalDirectionIndex = clickedTeam.teamA ? 1 : -1

        //check move
        let moveIndex = temporaryField.findIndex((cell) =>
            cell.row === clickedTeam.row + verticalDirectionIndex &&
            cell.column === clickedTeam.column + horizontalDirectionIndex &&
            !cell.teamA &&
            !cell.teamB
        )
        if (moveIndex !== -1) {
            temporaryField[moveIndex].isCellMoveFocused = true
            console.table(field)
            return temporaryField
        }

        //check attack
        const currentTeam = this.state.currentTurn
        const enemyTeam = this.state.currentTurn === 'teamA' ? 'teamB' : 'teamA'
        let checkingNearCellIndex = temporaryField.findIndex((cell) =>
            cell.row === clickedTeam.row + verticalDirectionIndex &&
            cell.column === clickedTeam.column + horizontalDirectionIndex
        )
        if (checkingNearCellIndex !== -1 && temporaryField[checkingNearCellIndex][enemyTeam]) {
            let checkingFarCellIndex = temporaryField.findIndex((cell) =>
                cell.row === clickedTeam.row + verticalDirectionIndex * 2 &&
                cell.column === clickedTeam.column + horizontalDirectionIndex * 2
            )
            if (checkingFarCellIndex !== -1 &&
                !temporaryField[checkingFarCellIndex][currentTeam] &&
                !temporaryField[checkingFarCellIndex][enemyTeam]) {
                temporaryField[checkingFarCellIndex].isCellAttackFocused = true
                console.table(field)
                return temporaryField
            }
        }

        console.table(field)
        return temporaryField
    }

    private onTeamClick(clickedTeam: Cell) {
        if (!clickedTeam[this.state.currentTurn]) {
            return false
        }

        let field = [...this.state.field]
        for (let i = 0; i < field.length; i++) {
            field[i].isTeamFocused = false
            field[i].isCellMoveFocused = false
        }
        field[clickedTeam.id].isTeamFocused = true

        field = this.getFocusedField(field, clickedTeam, 1)
        field = this.getFocusedField(field, clickedTeam, -1)

        this.setState({field})
    }
}

export default App;
