'use client';

import { useEffect, useState } from 'react';
// import axios from 'axios';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger,DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import { useFetchData, usePostData, useUpdateData, useDeleteData } from '@/hooks/useApi';
import { showToastSuccess } from '@/utils/sonner';
interface Supplier {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
}

type FormData = {
    name: string;
  email: string;
  contactNumber: string;
  address: string;
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
  
  
export default function SupplierPage() {
  
  const [form, setForm] = useState({ name: '', email: '', contactNumber: '', address: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: createSupplier, isPending: isCreating } = usePostData<FormData, ApiResponse>('/api/supplier/createSupplier');
const { mutate: updateSupplier, isPending: isUpdating } = useUpdateData<FormData, ApiResponse>(`/api/supplier/updateSupplier/${editId}`);
    const { mutate: removeCategory, isPending: isDeleting } = useDeleteData<ApiResponse>(`/api/supplier/deleteSupplier/${deleteId}`);
  const { data, isLoading, error, refetch } = useFetchData<FetchResponse<Supplier[]>>('/api/supplier/getSuppliers', 'getSuppliers');

  const suppliers = Array.isArray(data?.data?.data) ? data.data.data : [];
  


  const handleSubmit = async () => {
    const mutation = isEditing && editId ? updateSupplier : createSupplier;
        mutation(form, {
          onSuccess: () => {
            showToastSuccess(isEditing ? 'Supplier updated successfully' : 'Supplier added successfully');
            setForm({ name: '', email: '', contactNumber: '', address: '' });
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

  const handleEdit = (supplier: Supplier) => {
    setForm({
      name: supplier.name,
      email: supplier.email,
      contactNumber: supplier.contactNumber,
      address: supplier.address,
    });
    setIsEditing(true);
    setEditId(supplier._id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    removeCategory(undefined, {
      onSuccess: () => {
        showToastSuccess('Category deleted successfully');
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
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4">
              <DialogTitle>{isEditing ? 'Edit' : 'Add'} Supplier</DialogTitle>
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-2"
                />
              </div>
              <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                  ? isEditing ? 'Updating...' : 'Creating...'
                  : isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>Are you sure you want to delete this supplier? This action cannot be undone.</p>
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-muted-foreground">
                No data available.
              </TableCell>
            </TableRow>
          ) : (suppliers.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.contactNumber}</TableCell>
              <TableCell>{s.address}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(s)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {
                      setDeleteId(s._id);
                      setDeleteDialogOpen(true);
                    }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </div>
  );
}
