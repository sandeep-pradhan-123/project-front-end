'use client';

import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from "date-fns"
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import { useFetchData, usePostData, useUpdateData, useDeleteData } from '@/hooks/useApi';
import { showToastSuccess } from '@/utils/sonner';

interface Product {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
}

interface Transaction {
  _id: string;
  productId: Product;
  type: 'stock-in' | 'stock-out';
  quantity: number;
  description?: string;
  createdAt: string;
  userId: User;
}

type FormData = {
  productId: string;
  type: 'stock-in' | 'stock-out';
  quantity: number;
  description?: string;
};

interface FetchResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

type ApiResponse = {
  success: boolean;
  message: string;
  data: any;
};

export default function TransactionPage() {
  // Form state
  const [form, setForm] = useState<FormData>({
    productId: '',
    type: 'stock-in',
    quantity: 0,
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch all transactions
  const { data, isLoading, error, refetch } = useFetchData<FetchResponse<Transaction[]>>(
    '/api/transaction/getTransactions',
    'getTransactions'
  );

  // Fetch all products for product dropdown select
  const { data: productsData } = useFetchData<FetchResponse<Product[]>>('/api/product/listProducts', 'getProducts');
  const products = productsData?.data?.data || [];

  // Create, update, delete mutations
  const { mutate: createTransaction, isPending: isCreating } = usePostData<FormData, ApiResponse>(
    '/api/transaction/createTransaction'
  );
  const { mutate: updateTransaction, isPending: isUpdating } = useUpdateData<FormData, ApiResponse>(
    `/api/transaction/updateTransaction/${editId}`
  );
  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteData<ApiResponse>(
    `/api/transaction/deleteTransaction/${deleteId}`
  );

  // Prepare list or empty array
  const transactions = Array.isArray(data?.data?.data) ? data.data.data : [];
  

  // Submit handler for add/edit
  const handleSubmit = () => {
    const mutation = isEditing && editId ? updateTransaction : createTransaction;
    mutation(form, {
      onSuccess: () => {
        showToastSuccess(isEditing ? 'Transaction updated successfully' : 'Transaction added successfully');
        setForm({ productId: '', type: 'stock-in', quantity: 0, description: '' });
        setIsEditing(false);
        setEditId(null);
        setDialogOpen(false);
        refetch();
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  // Edit button clicked - prefill form
  const handleEdit = (txn: Transaction) => {
    setForm({
      productId: txn.productId._id,
      type: txn.type,
      quantity: txn.quantity,
      description: txn.description || '',
    });
    setIsEditing(true);
    setEditId(txn._id);
    setDialogOpen(true);
  };

  // Confirm delete handler
  const confirmDelete = () => {
    if (!deleteId) return;

    deleteTransaction(undefined, {
      onSuccess: () => {
        showToastSuccess('Transaction deleted successfully');
        setDeleteDialogOpen(false);
        setDeleteId(null);
        refetch();
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
<div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4">
              <DialogTitle>{isEditing ? 'Edit' : 'Add'} Transaction</DialogTitle>

              <div>
                <Label>Product</Label>
                <select
                  className="mt-2 w-full border rounded px-3 py-2"
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Type</Label>
                <select
                  className="mt-2 w-full border rounded px-3 py-2 capitalize"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'stock-in' | 'stock-out' })}
                >
                  <option value="stock-in">Stock In</option>
                  <option value="stock-out">Stock Out</option>
                </select>
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="mt-2"
                  min={1}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No data available.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((txn) => (
              <TableRow key={txn._id}>
                <TableCell>{txn.productId?.name || 'N/A'}</TableCell>
                <TableCell className="capitalize">{txn.type}</TableCell>
                <TableCell>{txn.quantity}</TableCell>
                <TableCell>{txn.description || '-'}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(txn.createdAt), { addSuffix: true })}</TableCell>
                <TableCell>{txn?.userId?.name || 'N/A'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(txn)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => {
                    setDeleteId(txn._id);
                    setDeleteDialogOpen(true);
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
