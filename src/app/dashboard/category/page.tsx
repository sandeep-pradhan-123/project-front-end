'use client';

import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import { useFetchData, usePostData, useUpdateData, useDeleteData } from '@/hooks/useApi';
import { showToastSuccess } from '@/utils/sonner';

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface FetchResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

type FormData = {
  name: string;
  description: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: any;
};

export default function Page() {
  const [form, setForm] = useState<FormData>({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: createCategory, isPending: isCreating } = usePostData<FormData, ApiResponse>('/api/category/createCategory');
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateData<FormData, ApiResponse>(`/api/category/updateCategory/${editId}`);
  const { mutate: removeCategory, isPending: isDeleting } = useDeleteData<ApiResponse>(`/api/category/deleteCategory/${deleteId}`);
  const { data, isLoading, error, refetch } = useFetchData<FetchResponse<Category[]>>('/api/category/getCategories', 'getCategories');
  const categories = Array.isArray(data?.data?.data) ? data.data.data : [];

  const handleSubmit = () => {
    const mutation = isEditing && editId ? updateCategory : createCategory;

    mutation(form, {
      onSuccess: () => {
        showToastSuccess(isEditing ? 'Category updated successfully' : 'Category added successfully');
        setForm({ name: '', description: '' });
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

  const handleEdit = (category: Category) => {
    setForm({ name: category.name, description: category.description });
    setIsEditing(true);
    setEditId(category._id);
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
        <h1 className="text-2xl font-bold">Categories</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>{isEditing ? 'Edit Category' : 'Add Category'}</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4">
              <DialogTitle>{isEditing ? 'Edit' : 'Add'} Category</DialogTitle>
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2"
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
          <p>Are you sure you want to delete this category? This action cannot be undone.</p>
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
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No data available.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cat)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteId(cat._id);
                      setDeleteDialogOpen(true);
                    }}
                  >
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
