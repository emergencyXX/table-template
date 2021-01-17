import React, {useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from "@material-ui/core/Container";
import {useStyles} from "./style";
import Button from "@material-ui/core/Button";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';


export default function CustomizedTables() {
    const classes = useStyles();
    const initTableState = {
        past: [],
        present: [
            {name: 'Peter', count: 6.0},
            {name: 'Bob', count: 3.0},
            {name: 'Tom', count: 2.0},
        ],
        future: []
    };


    const [tableState, setTableState] = useState(initTableState);
    const [tableSnapshot, setTableSnapshot] = useState(initTableState);

    const addItem = () => {
        setTableState({
            ...tableState,
            present: [...tableState.present, {name: '', count: ''}],
            past: [...tableState.past, tableState.present]
        })
    };

    const deleteItem = (index) => {
        setTableState({
            ...tableState,
            present: tableState.present.filter((item, itemIndex) => itemIndex !== index),
            past: [...tableState.past, tableState.present]
        });
    };

    const editItemField = (index, fieldName, value) => {
        const newTableState = JSON.parse(JSON.stringify(tableState));
        newTableState.present[index][fieldName] = value;
        newTableState.past = [...newTableState.past, tableState.present];
        setTableState(newTableState);
    };

    const saveTable = () => setTableSnapshot(
        {
            past: [],
            present: tableState.present,
            future: []
        }
    );
    const cancelTableChanges = () => setTableState(tableSnapshot);


    const resetTable = () => setTableState(initTableState);

    const history = (action) => {
        const {past, present, future} = tableState;

        switch (action) {
            case 'UNDO':
                const previous = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);
                setTableState({
                    past: newPast,
                    present: previous,
                    future: [present, ...future]
                });
                break;
            case 'REDO':
                const next = future[0];
                const newFuture = future.slice(1);
                setTableState({
                    past: [...past, present],
                    present: next,
                    future: newFuture
                });
                break;
            default:
                console.log('Unknown action');
        }
    };


    return (
        <Container maxWidth="lg">
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableState.present.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    <input placeholder="value..." type="text"
                                           onChange={(e) => editItemField(index, 'name', e.target.value)}
                                           value={row.name}/>
                                </TableCell>
                                <TableCell>
                                    <input placeholder="value..." type="number"
                                           onChange={(e) => editItemField(index, 'count', e.target.value)}
                                           value={row.count}/>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => deleteItem(index)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow className={classes.addBtn}>
                            <Button onClick={addItem}>+ Add item</Button>
                            <Button disabled={!tableState.past.length} onClick={() => history('UNDO')}>Undo</Button>
                            <Button disabled={!tableState.future.length} onClick={() => history('REDO')}>Redo</Button>
                            <Button onClick={resetTable}>Reset</Button>
                            <Button onClick={cancelTableChanges}>Cancel</Button>
                            <Button onClick={saveTable}>Save</Button>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <XYPlot
                width={300}
                height={300}>
                <HorizontalGridLines />
                <LineSeries
                    data={tableSnapshot.present.map((item,index)=>({x:index + 1,y:item.count}))}
                />
                <XAxis />
                <YAxis />
            </XYPlot>
        </Container>
    );
}