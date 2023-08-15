import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { IDictionary } from "src/utils/types";

interface ITableProps {
    data: any[],
    fields: IDictionary<string>,
}

export default (props: ITableProps) => {
    // console.info(226, props.fields)
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {Object.keys(props.fields).map(
                            (header: string, k:number) => (<TableCell key={k}>{header}</TableCell>)
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((c: any) => (
                        <TableRow
                            key={c.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {Object.values(props.fields).map(
                                (f:string, k:number) => (<TableCell key={k}>{c[f]}</TableCell>)
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
