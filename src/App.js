import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Check, X, Grid, List, LayoutGrid, User } from 'lucide-react';
import { RAZORPAY_CONFIG } from './razorpay-config.js';
import { OrderService } from './firebase-service';
import { AuthServiceNew } from './auth-service-new';
import AuthLanding from './components/AuthLanding';
import AuthLogin from './components/AuthLogin';
import AuthRegister from './components/AuthRegister';
import MyAccount from './components/MyAccount';

const menuData = {
  burgers: [
    { id: 1, name: 'Classic Burger', price: 299, image: '🍔', category: 'burgers', description: 'Juicy beef patty with fresh veggies' },
    { id: 2, name: 'Cheese Burger', price: 349, image: '🍔', category: 'burgers', description: 'Double cheese goodness' },
    { id: 3, name: 'Chicken Burger', price: 329, image: '🍔', category: 'burgers', description: 'Crispy chicken fillet' },
    { id: 4, name: 'Veggie Burger', price: 279, image: '🍔', category: 'burgers', description: 'Garden fresh vegetables' },
  ],
  sides: [
    { id: 5, name: 'French Fries', price: 1, image: '🍟', category: 'sides', description: 'Crispy golden fries (TEST PRICE)' },
    { id: 6, name: 'Onion Rings', price: 2, image: '🧅', category: 'sides', description: 'Crunchy onion rings (TEST PRICE)' },
    { id: 7, name: 'Chicken Nuggets', price: 149, image: '🍗', category: 'sides', description: '6 piece nuggets' },
  ],
  drinks: [
    { id: 8, name: 'Coca Cola', price: 1, image: '🥤', category: 'drinks', description: 'Chilled soft drink (TEST PRICE)' },
    { id: 9, name: 'Lemonade', price: 2, image: '🍋', category: 'drinks', description: 'Fresh lemonade (TEST PRICE)' },
    { id: 10, name: 'Milkshake', price: 149, image: '🥤', category: 'drinks', description: 'Creamy milkshake' },
  ],
  desserts: [
    { id: 11, name: 'Ice Cream', price: 2, image: '🍦', category: 'desserts', description: 'Vanilla ice cream (TEST PRICE)' },
    { id: 12, name: 'Apple Pie', price: 119, image: '🥧', category: 'desserts', description: 'Warm apple pie' },
  ]
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('auth-landing');
  const [cart, setCart] = useState([]);
  const [layoutMode, setLayoutMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tableNumber, setTableNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [user, setUser] = useState(null);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authentication effect
  useEffect(() => {
    const unsubscribe = AuthServiceNew.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        setCurrentPage('menu');
      } else {
        setCurrentPage('auth-landing');
      }
    });

    return () => unsubscribe();
  }, []);

  // Authentication handlers
  const handleLoginSuccess = (user) => {
    setUser(user);
    setCurrentPage('menu');
  };

  const handleRegisterSuccess = (user) => {
    setUser(user);
    setCurrentPage('menu');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('auth-landing');
    setShowMyAccount(false);
  };

  const generateOrderNumber = () => {
    return 'ORD' + Date.now().toString().slice(-8);
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    // Trigger cart animation
    setCartAnimation(true);
    setAddedItemId(item.id);
    setTimeout(() => {
      setCartAnimation(false);
      setAddedItemId(null);
    }, 600);
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalQuantity = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find(c => c.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleTableNumberChange = useCallback((e) => {
    setTableNumber(e.target.value);
  }, []);

  // Razorpay Payment Functions
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const initiateRazorpayPayment = async (amount) => {
    try {
      console.log('Checking Razorpay availability...');
      console.log('window.Razorpay:', window.Razorpay);
      console.log('RAZORPAY_CONFIG:', RAZORPAY_CONFIG);
      
      const razorpay = window.Razorpay;
      
      if (!razorpay) {
        throw new Error('Razorpay not loaded');
      }

      const options = {
        key: RAZORPAY_CONFIG.key_id,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.name,
        description: `${RAZORPAY_CONFIG.description} - Order #${Date.now()}`,
        image: RAZORPAY_CONFIG.image,
        handler: async function (response) {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Save order to Firebase
          const orderData = {
            orderNumber: generateOrderNumber(),
            tableNumber: tableNumber,
            items: cart.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            total: Math.round(calculateTotal() * 1.05)
          };
          
          try {
            const result = await OrderService.saveOrder(orderData, user?.uid);
            if (result.success) {
              setOrderNumber(result.orderNumber);
              console.log('Order saved to Firebase:', result);
            } else {
              console.error('Failed to save order:', result.error);
            }
          } catch (error) {
            console.error('Error saving order to Firebase:', error);
          }
          
          setOrderStatus('success');
          setCart([]);
          setTimeout(() => {
            setOrderStatus(null);
            setOrderNumber(null);
            setCurrentPage('menu');
            setShowCart(false);
          }, 5000); // Increased timeout to show order number
        },
        prefill: {
          name: 'Omkar Waghmare',
          email: 'omkarwaghmare843@gmail.com',
          contact: '+919518920577'
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setOrderStatus('failure');
            setTimeout(() => setOrderStatus(null), 3000);
          }
        }
      };

      console.log('Opening Razorpay with options:', options);
      console.log('Amount in paise:', amount * 100);
      
      const paymentObject = new razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setOrderStatus('failure');
        setTimeout(() => setOrderStatus(null), 3000);
      });
      
      paymentObject.open();
      
    } catch (error) {
      console.error('Razorpay payment error:', error);
      alert('Payment initialization failed: ' + error.message);
      setOrderStatus('failure');
      setTimeout(() => setOrderStatus(null), 3000);
    }
  };

  const processPayment = async () => {
    if (!tableNumber) {
      alert('Please enter table number');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const totalAmount = Math.round(calculateTotal() * 1.05); // Including 5% GST
    const orderNumber = generateOrderNumber();
    
    const orderData = {
      orderNumber,
      tableNumber,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: totalAmount,
      timestamp: new Date().toISOString()
    };

    console.log('Processing payment for order:', orderData);

    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        console.log('Loading Razorpay script...');
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load payment gateway. Please try again.');
          return;
        }
      }

      console.log('Razorpay script loaded, initiating payment...');
      
      // Initiate payment directly (no order creation needed for frontend testing)
      await initiateRazorpayPayment(totalAmount);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
      setOrderStatus('failure');
      setTimeout(() => setOrderStatus(null), 3000);
    }
  };

  const getMenuItems = () => {
    if (selectedCategory === 'all') {
      return Object.values(menuData).flat();
    }
    return menuData[selectedCategory] || [];
  };


  const GridMenuCard = ({ item }) => {
    const quantity = getItemQuantity(item.id);
    const isAdded = addedItemId === item.id;
    
    return (
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 ${isAdded ? 'ring-2 ring-orange-400 ring-opacity-50' : ''}`}>
        <div className="bg-gradient-to-br from-orange-400 to-red-500 h-48 flex items-center justify-center text-8xl relative">
          {item.image}
          {quantity > 0 && (
            <div className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold animate-quantity-pop">
              {quantity}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-600">₹{item.price}</span>
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(item)}
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-white border-2 border-gray-300 rounded-full p-1 hover:border-red-600 transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-lg min-w-[24px] text-center">{quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ListMenuCard = ({ item }) => {
    const quantity = getItemQuantity(item.id);
    const isAdded = addedItemId === item.id;
    
      return (
      <div className={`bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all flex items-center gap-4 ${isAdded ? 'ring-2 ring-orange-400 ring-opacity-50' : ''}`}>
        <div className="bg-gradient-to-br from-orange-400 to-red-500 w-24 h-24 rounded-xl flex items-center justify-center text-5xl flex-shrink-0 relative">
          {item.image}
          {quantity > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-quantity-pop">
              {quantity}
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
          <span className="text-xl font-bold text-red-600">₹{item.price}</span>
        </div>
        {quantity === 0 ? (
          <button
            onClick={() => addToCart(item)}
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <Plus size={18} /> Add
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 flex-shrink-0">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="bg-white border-2 border-gray-300 rounded-full p-1 hover:border-red-600 transition-all"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-lg min-w-[24px] text-center">{quantity}</span>
            <button
              onClick={() => addToCart(item)}
              className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const CompactMenuCard = ({ item }) => {
    const quantity = getItemQuantity(item.id);
    const isAdded = addedItemId === item.id;
    
      return (
      <div className={`bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-all ${isAdded ? 'ring-2 ring-orange-400 ring-opacity-50' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 relative">
            {item.image}
            {quantity > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold animate-quantity-pop">
                {quantity}
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-sm truncate">{item.name}</h3>
            <span className="text-lg font-bold text-red-600">₹{item.price}</span>
          </div>
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(item)}
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all flex-shrink-0"
            >
              <Plus size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 flex-shrink-0">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="bg-white border border-gray-300 rounded-full p-1 hover:border-red-600 transition-all"
              >
                <Minus size={12} />
              </button>
              <span className="font-bold text-sm min-w-[16px] text-center">{quantity}</span>
              <button
                onClick={() => addToCart(item)}
                className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MenuPage = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">☕</div>
              <h1 className="text-2xl font-bold">Classic Cafe</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMyAccount(true)}
                className="bg-white text-red-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <User size={20} />
                My Account
              </button>
              <button
                onClick={() => setShowCart(true)}
                className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2 relative group"
              >
                <ShoppingCart size={20} className={`transition-transform ${cartAnimation ? 'scale-110' : ''}`} />
                <span>Cart</span>
                {getTotalQuantity() > 0 && (
                  <span className={`absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${cartAnimation ? 'scale-125 animate-pulse' : ''}`}>
                    {getTotalQuantity()}
                  </span>
                )}
                {cartAnimation && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-2 border-orange-400 rounded-full animate-ping"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {['all', 'burgers', 'sides', 'drinks', 'desserts'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 rounded-lg ${layoutMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                title="Grid View"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-2 rounded-lg ${layoutMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                title="List View"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setLayoutMode('compact')}
                className={`p-2 rounded-lg ${layoutMode === 'compact' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                title="Compact View"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {layoutMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getMenuItems().map(item => (
              <GridMenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
        {layoutMode === 'list' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {getMenuItems().map(item => (
              <ListMenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
        {layoutMode === 'compact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getMenuItems().map(item => (
              <CompactMenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={() => setShowCart(false)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-red-600 font-bold">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-white border-2 border-gray-300 rounded-full p-1 hover:border-red-600"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <Plus size={16} />
                          </button>
                          <span className="ml-auto font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block font-bold mb-2">Table Number</label>
                    <input
                      key="table-number-input"
                      type="text"
                      value={tableNumber}
                      onChange={handleTableNumberChange}
                      placeholder="Enter table number"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-600 focus:outline-none transition-colors text-lg"
                      autoComplete="off"
                      autoFocus
                    />
                  </div>

                  <div className="bg-gray-100 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold">₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">GST (5%)</span>
                      <span className="font-bold">₹{Math.round(calculateTotal() * 0.05)}</span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">Total</span>
                        <span className="text-2xl font-bold text-red-600">₹{Math.round(calculateTotal() * 1.05)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={processPayment}
                    disabled={orderStatus !== null}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {orderStatus === null ? (
                      <>
                        💳 Pay with Razorpay
                      </>
                    ) : (
                      'Processing Payment...'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {orderStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            {orderStatus === 'success' ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
                <p className="text-gray-600 mb-4">Your order has been placed successfully. We'll prepare it right away!</p>
                {orderNumber && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-lg font-bold text-green-800">Order Number: {orderNumber}</p>
                    <p className="text-sm text-green-600">Please keep this number for reference</p>
                  </div>
                )}
                <p className="text-sm text-gray-500">Table: {tableNumber}</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X size={48} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-4">Something went wrong with your payment. Please try again.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">☕</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Classic Cafe...</p>
        </div>
      </div>
    );
  }

        // Route to different pages based on currentPage state
        switch (currentPage) {
          case 'auth-landing':
            return <AuthLanding onNavigate={setCurrentPage} />;

          case 'login':
            return (
              <AuthLogin
                onBack={() => setCurrentPage('auth-landing')}
                onSuccess={handleLoginSuccess}
              />
            );

          case 'register':
            return (
              <AuthRegister
                onBack={() => setCurrentPage('auth-landing')}
                onSuccess={handleRegisterSuccess}
              />
            );

          case 'menu':
            return (
              <>
                <MenuPage />
                {showMyAccount && (
                  <MyAccount
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setShowMyAccount(false)}
                  />
                )}
              </>
            );

          default:
            return <AuthLanding onNavigate={setCurrentPage} />;
        }
};

export default App;