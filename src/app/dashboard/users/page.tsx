// app/(dashboard)/transactions/page.tsx
'use client';

import { useEffect, useState } from 'react';
// import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { showToastSuccess } from '@/utils/sonner';

export default function TransactionListPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ productId: '', type: 'stock-in', quantity: 0, description: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  const router = useRouter();

  const fetchTransactions = async () => {
    // const res = await axios.get('/api/transactions');
    const dumy = [
    {
      "_id": "684560faef1234567890abcd",
      "name": "Sidharth Rawat",
      "email": "sidharth@example.com",
      "role": "admin",
      "createdAt": "2025-06-08T10:00:00.000Z"
    },
    {
      "_id": "684560faef1234567890abce",
      "name": "Aisha Kapoor",
      "email": "aisha@example.com",
      "role": "manager",
      "createdAt": "2025-06-07T09:15:00.000Z"
    }]
    setTransactions(dumy);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
    //   await axios.delete(`/api/transactions/${id}`);
      fetchTransactions();
    }
  };

  const handleCreate = async () => {
    // await axios.post('/api/transactions', form);
    fetchTransactions();
    setDialogOpen(false);
    setForm({ productId: '', type: 'stock-in', quantity: 0, description: '' });
  };

  const openPasswordDialog = (user: any) => {
    setSelectedUser(user);
    setPasswordDialogOpen(true);
  };

  const handlePasswordChange = async () => {
    if (!selectedUser?._id || !newPassword) return;

    // await axios.post('/api/users/change-password', {
    //   userId: selectedUser._id,
    //   newPassword,
    // });

    showToastSuccess('Password updated successfully');
    setPasswordDialogOpen(false);
    setNewPassword('');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Transaction</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Transaction</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
              <Input
                placeholder="Product ID"
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
              />
              <select
                className="w-full border rounded p-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="stock-in">Stock In</option>
                <option value="stock-out">Stock Out</option>
              </select>
              <Input
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn._id}>
                <TableCell>{txn.productId?.name || 'N/A'}</TableCell>
                <TableCell className="capitalize">{txn.type}</TableCell>
                <TableCell>{txn.quantity}</TableCell>
                <TableCell>{txn.description || '-'}</TableCell>
                <TableCell>{new Date(txn.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>{txn.createdBy?.name || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/transactions/edit/${txn._id}`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openPasswordDialog(txn.createdBy)}
                    >
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(txn._id)}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
