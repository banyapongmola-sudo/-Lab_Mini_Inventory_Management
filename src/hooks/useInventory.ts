import { useState, useEffect } from 'react';
import { Product } from '../types';

export const useInventory = () => {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('inventory_data');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('inventory_data', JSON.stringify(products));
    }, [products]);

    const addProduct = (name: string, price: number, quantity: number) => {
        const newProduct: Product = {
            id: Date.now(),
            name,
            price,
            quantity
        };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateQuantity = (id: number, delta: number) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const newQuantity = Math.max(0, p.quantity + delta);
                return { ...p, quantity: newQuantity };
            }
            return p;
        }));
    };

    const deleteProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    return {
        products,
        addProduct,
        updateQuantity,
        deleteProduct
    };
};
