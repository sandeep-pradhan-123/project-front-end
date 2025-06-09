'use client';

import { useFetchData } from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Category {
  _id: string;
  name: string;
  description: string;
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

interface Transaction {
  _id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  description?: string;
}

interface FetchResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

// Extended color palette
const COLORS = ['#3b82f6', '#10b981', '#f97316', '#f43f5e', '#6366f1', '#14b8a6'];

export default function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [transactionStats, setTransactionStats] = useState<any[]>([]);

  const { data: categoryData } = useFetchData<FetchResponse<Category[]>>('/api/category/getCategories', 'getCategories');
  const { data: productsData } = useFetchData<FetchResponse<Product[]>>('/api/product/getProducts', 'getProducts');
  const { data: suppliersData } = useFetchData<FetchResponse<Supplier[]>>('/api/supplier/getSuppliers', 'getSuppliers');
  const { data: transactionData } = useFetchData<FetchResponse<Transaction[]>>('/api/transaction/getTransactions', 'getTransactions');

  const suppliers = Array.isArray(suppliersData?.data?.data) ? suppliersData.data.data : [];
  const categories = Array.isArray(categoryData?.data?.data) ? categoryData.data.data : [];
  const products = Array.isArray(productsData?.data?.data) ? productsData.data.data : [];
  const transactions = Array.isArray(transactionData?.data?.data) ? transactionData.data.data : [];

  useEffect(() => {
    setProductCount(products.length);
    setCategoryCount(categories.length);
    setSupplierCount(suppliers.length);
  }, [products, categories, suppliers]);

  useEffect(() => {
    const stats = transactions.reduce((acc: any, txn: Transaction) => {
      const type = txn.type || 'IN';
      acc[type] = (acc[type] || 0) + txn.quantity;
      return acc;
    }, {});

    const chartData = Object.keys(stats).map((type) => ({
      type: type === 'IN' ? 'Stock In' : 'Stock Out',
      quantity: stats[type],
    }));

    setTransactionStats(chartData);
  }, [transactions]);

  return (
    <main className="p-6 space-y-8">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm mb-1">Total Products in Inventory</p>
          <h2 className="text-3xl font-bold text-gray-800">{productCount}</h2>
          <p className="text-sm text-gray-400">Includes all stock entries</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm mb-1">Active Categories</p>
          <h2 className="text-3xl font-bold text-gray-800">{categoryCount}</h2>
          <p className="text-sm text-gray-400">Grouped by product type</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm mb-1">Registered Suppliers</p>
          <h2 className="text-3xl font-bold text-gray-800">{supplierCount}</h2>
          <p className="text-sm text-gray-400">All approved vendors</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Transactions Overview</h3>
          <p className="text-sm text-gray-400 mb-4">Tracks incoming and outgoing stock quantities</p>
          {transactionStats.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">No transaction data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transactionStats}>
                <XAxis dataKey="type" className="text-sm" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Transaction Breakdown</h3>
          <p className="text-sm text-gray-400 mb-4">Pie chart distribution of inventory movement</p>
          {transactionStats.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">No transaction data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={transactionStats}
                  dataKey="quantity"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {transactionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </main>
  );
}
