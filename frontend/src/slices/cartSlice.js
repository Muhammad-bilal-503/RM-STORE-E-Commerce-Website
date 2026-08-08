import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : '';

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

// Helper function to calculate prices
const calculatePrices = (cartItems) => {
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice,
    totalPrice: Number(totalPrice.toFixed(2)),
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id && x.selectedVariant === item.selectedVariant);

      if (existItem) {
        existItem.qty = item.qty;
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      // Recalculate prices
      const prices = calculatePrices(state.cartItems);
      Object.assign(state, prices);
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => !(x._id === productId && x.selectedVariant === variantId)
      );
      
      // Recalculate prices
      const prices = calculatePrices(state.cartItems);
      Object.assign(state, prices);
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, variantId, qty } = action.payload;
      const item = state.cartItems.find(
        (x) => x._id === productId && x.selectedVariant === variantId
      );
      
      if (item) {
        item.qty = qty;
        
        // Recalculate prices
        const prices = calculatePrices(state.cartItems);
        Object.assign(state, prices);
        
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.taxPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
    },
    // Initialize prices on app load
    initializePrices: (state) => {
      const prices = calculatePrices(state.cartItems);
      Object.assign(state, prices);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  initializePrices,
} = cartSlice.actions;

export default cartSlice.reducer; 