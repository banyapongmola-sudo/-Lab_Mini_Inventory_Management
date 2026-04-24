/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  Boxes 
} from 'lucide-react';
import { useInventory } from './hooks/useInventory';

// --- Components ---

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Boxes size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">InvenExpert</span>
        </div>
        
        <div className="flex gap-1">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              location.pathname === '/' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/products" 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              location.pathname === '/products' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Manage Products
          </Link>
        </div>
      </div>
    </nav>
  );
};

// --- Pages ---

const DashboardPage = () => {
  const { products } = useInventory();
  
  const totalItems = products.length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const outOfStock = products.filter(p => p.quantity === 0).length;

  const stats = [
    { 
      label: 'Total Products', 
      value: totalItems, 
      icon: <Package className="text-indigo-600" />, 
      color: 'bg-indigo-50' 
    },
    { 
      label: 'Inventory Value', 
      value: `฿${totalValue.toLocaleString()}`, 
      icon: <TrendingUp className="text-emerald-600" />, 
      color: 'bg-emerald-50' 
    },
    { 
      label: 'Out of Stock', 
      value: outOfStock, 
      icon: <AlertCircle className="text-rose-600" />, 
      color: 'bg-rose-50' 
    }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time stats of your inventory performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            id={`stat-${idx}`}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Stock Breakdown</h2>
        {totalItems > 0 ? (
           <div className="flex items-center gap-2 text-sm text-slate-600">
             <div className="h-4 bg-indigo-500 rounded-full" style={{ width: `${(1 - outOfStock/totalItems) * 100}%` }}></div>
             <div className="h-4 bg-rose-400 rounded-full" style={{ width: `${(outOfStock/totalItems) * 100}%` }}></div>
             <span className="ml-2">{Math.round((1 - outOfStock/totalItems) * 100)}% In Stock</span>
           </div>
        ) : (
          <p className="text-slate-400 text-center py-8 italic">Add basic products to see analytics</p>
        )}
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { products, addProduct, updateQuantity, deleteProduct } = useInventory();
  const [search, setSearch] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [qtyInput, setQtyInput] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !priceInput || !qtyInput) return;
    addProduct(nameInput, Number(priceInput), Number(qtyInput));
    setNameInput('');
    setPriceInput('');
    setQtyInput('');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Inventory</h1>
          <p className="text-slate-500 mt-1">Control and track your products efficiently.</p>
        </div>
      </header>

      {/* Add Form */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Plus size={18} className="text-indigo-600" />
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
            <input 
              type="text" 
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="e.g. Premium Coffee"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price (฿)</label>
            <input 
              type="number" 
              value={priceInput}
              onChange={e => setPriceInput(e.target.value)}
              placeholder="120"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Initial Qty</label>
            <input 
              type="number" 
              value={qtyInput}
              onChange={e => setQtyInput(e.target.value)}
              placeholder="50"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* Product List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Items List
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-normal">
              {filteredProducts.length}
            </span>
          </h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                id={`product-${p.id}`}
                className={`p-5 rounded-2xl border transition-all ${
                  p.quantity === 0 
                    ? 'bg-rose-50 border-rose-200' 
                    : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{p.name}</h3>
                    <p className="text-emerald-600 font-bold mt-1">฿{p.price.toLocaleString()}</p>
                  </div>
                  {p.quantity === 0 && (
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                      Out of stock
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center bg-slate-100 rounded-full p-1 gap-3">
                    <button 
                      onClick={() => updateQuantity(p.id, -1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={p.quantity === 0}
                    >
                      <Minus size={14} className="text-slate-600" />
                    </button>
                    <span className="font-bold text-slate-700 min-w-[1.5rem] text-center">{p.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(p.id, 1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <Plus size={14} className="text-slate-600" />
                    </button>
                  </div>

                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-2.5 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors group"
                  >
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <LayoutDashboard className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No results found matching your search</p>
          </div>
        )}
      </section>
    </div>
  );
};

// --- App ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
