import React, { memo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
  } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

const InvoiceTable = ({tableData, products, handleEdit, handleDelete}) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Net Amount</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{products.find(product => product._id === row.productId)?.productName}</TableCell>
                <TableCell>{row.rate}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.discount}</TableCell>
                <TableCell>{row.netAmount.toFixed(2)}</TableCell>
                <TableCell>{row.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}

export default memo(InvoiceTable);
