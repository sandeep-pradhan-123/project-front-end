'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  useDeleteData,
  useFetchData,
  usePostData,
  useUpdateData,
} from '@/hooks/useApi';
import { showToastSuccess } from '@/utils/sonner';

interface Category {
  _id: string;
  name: string;
}

interface Supplier {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  categoryId: Category;
  supplierId: Supplier;
}

interface FetchResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

type FormData = {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  categoryId: string;
  supplierId: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: any;
};

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
    categoryId: '',
    supplierId: '',
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    mutate: createProduct,
    isPending: isCreating,
  } = usePostData<FormData, ApiResponse>('/api/product/createProduct');

  const {
    mutate: updateProduct,
    isPending: isUpdating,
  } = useUpdateData<FormData, ApiResponse>(
    `/api/product/updateProduct/${editId}`
  );

  const {
    mutate: deleteProduct,
    isPending: isDeleting,
  } = useDeleteData<ApiResponse>(`/api/product/deleteProduct/${deleteId}`);

  const {
    data,
    isLoading,
    refetch,
  } = useFetchData<FetchResponse<Product[]>>('/api/product/getProducts', 'getProducts');

  const {
    data: listSuppliers,
  } = useFetchData<FetchResponse<Supplier[]>>('/api/supplier/listSuppliers', 'listSuppliers');

  const {
    data: listCategories,
  } = useFetchData<FetchResponse<Category[]>>('/api/category/listCategories', 'listCategories');

  const products = Array.isArray(data?.data?.data) ? data.data.data : [];
  const suppliers = Array.isArray(listSuppliers?.data?.data) ? listSuppliers.data.data : [];
  const categories = Array.isArray(listCategories?.data?.data) ? listCategories.data.data : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = isEditing && editId ? updateProduct : createProduct;

    mutation(formData, {
      onSuccess: () => {
        showToastSuccess(isEditing ? 'Product updated successfully' : 'Product added successfully');
        setFormData({
          name: '',
          sku: '',
          quantity: 0,
          price: 0,
          categoryId: '',
          supplierId: '',
        });
        setEditId(null);
        setIsEditing(false);
        setDialogOpen(false);
        refetch();
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      price: product.price,
      categoryId: product.categoryId._id,
      supplierId: product.supplierId._id,
    });
    setEditId(product._id);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    deleteProduct(undefined, {
      onSuccess: () => {
        showToastSuccess('Product deleted successfully');
        refetch();
        setDeleteDialogOpen(false);
        setDeleteId(null);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>{isEditing ? 'Edit Product' : 'Add Product'}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Supplier</Label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit">{isEditing ? 'Update' : 'Create'} Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <p>Are you sure you want to delete this Product? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>

          </div>
        </DialogContent>
      </Dialog>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">No data available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p>SKU: {product.sku}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ₹{product.price}</p>
                <p>Category: {product.categoryId?.name || 'N/A'}</p>
                <p>Supplier: {product.supplierId?.name || 'N/A'}</p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(product)}>
                    Edit
                  </Button>
                  <Button variant="destructive"  onClick={() => {
                      setDeleteId(product._id);
                      setDeleteDialogOpen(true);
                    }}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
