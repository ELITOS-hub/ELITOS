import { useState, useEffect } from 'react';
import { X, MapPin, CreditCard, Truck, Shield, Plus, ChevronRight, AlertCircle, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCustomers } from '../context/CustomerContext';
import { ordersAPI, paymentAPI } from '../services/api';
import { CONTACT } from '../config/contact';
import AddressAutocomplete from '../components/AddressAutocomplete';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutProps {
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  verified?: boolean;
  locationConfirmed?: boolean;
}

type PaymentMethod = 'COD' | 'ONLINE';

const Checkout = ({ onClose, onSuccess }: CheckoutProps) => {
  const { cart, clearCart } = useCart();
  const { auth } = useAuth();
  const { addOrder } = useOrders();
  const { addOrUpdateCustomer } = useCustomers();
  
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('elitos_addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [selectedAddress, setSelectedAddress] = useState<string>(addresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [useBackendAPI, setUseBackendAPI] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: auth.user?.name || '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    verified: false,
    locationConfirmed: false,
  });
  const [isPincodeValid, setIsPincodeValid] = useState(false);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://elitosbackend.vercel.app/api';
        // Use /health endpoint (remove /api suffix as health is at root)
        const baseUrl = apiUrl.replace('/api', '');
        const response = await fetch(`${baseUrl}/health`);
        if (response.ok) {
          const data = await response.json();
          // Use backend if API is available and database is connected
          setUseBackendAPI(data.status === 'ok' && data.database === 'connected');
        }
      } catch {
        setUseBackendAPI(false);
      }
    };
    checkBackend();
  }, []);

  // Calculate totals
  const subtotal = cart.totalPrice;
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  const saveAddresses = (addrs: Address[]) => {
    localStorage.setItem('elitos_addresses', JSON.stringify(addrs));
    setAddresses(addrs);
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.street || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      setError('Please fill all required address fields');
      return;
    }

    if (!isPincodeValid) {
      setError('Please enter a valid pincode');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      name: newAddress.name,
      phone: newAddress.phone,
      street: newAddress.street + (newAddress.landmark ? ` (Near: ${newAddress.landmark})` : ''),
      landmark: newAddress.landmark,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      verified: newAddress.verified,
      locationConfirmed: newAddress.locationConfirmed,
      isDefault: addresses.length === 0,
    };
    
    const updated = [...addresses, address];
    saveAddresses(updated);
    setSelectedAddress(address.id);
    setShowAddAddress(false);
    setError(null);
    setNewAddress({
      name: auth.user?.name || '',
      phone: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      verified: false,
      locationConfirmed: false,
    });
    setIsPincodeValid(false);
  };


  // Load Razorpay script
  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (orderId: string, orderNumber: string) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      setError('Failed to load payment gateway. Please try again.');
      return false;
    }

    try {
      const paymentOrder = await paymentAPI.createOrder(orderId);
      
      return new Promise<boolean>((resolve) => {
        const options = {
          key: paymentOrder.key,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          name: 'ELITOS',
          description: `Order #${orderNumber}`,
          order_id: paymentOrder.orderId,
          handler: async (response: any) => {
            try {
              await paymentAPI.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              });
              resolve(true);
            } catch (err) {
              setError('Payment verification failed');
              resolve(false);
            }
          },
          prefill: {
            name: auth.user?.name || '',
            email: auth.user?.email || '',
            contact: addresses.find(a => a.id === selectedAddress)?.phone || '',
          },
          theme: {
            color: '#E65100',
          },
          modal: {
            ondismiss: () => {
              setError('Payment cancelled');
              resolve(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);

    const selectedAddr = addresses.find(a => a.id === selectedAddress);
    if (!selectedAddr) {
      setError('Please select a delivery address');
      setIsLoading(false);
      return;
    }

    try {
      // Try backend API first if available
      if (useBackendAPI) {
        const orderData = {
          items: cart.items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.selectedSize,
          })),
          customerName: selectedAddr.name,
          customerEmail: auth.user?.email || `guest-${Date.now()}@elitos.in`,
          customerPhone: selectedAddr.phone,
          shippingAddress: {
            name: selectedAddr.name,
            phone: selectedAddr.phone,
            addressLine1: selectedAddr.street,
            city: selectedAddr.city,
            state: selectedAddr.state,
            pincode: selectedAddr.pincode,
          },
          paymentMethod: paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
        };

        const order = await ordersAPI.create(orderData);

        // Handle online payment
        if (paymentMethod === 'ONLINE') {
          const paymentSuccess = await handleRazorpayPayment(order.id, order.orderNumber);
          if (!paymentSuccess) {
            setIsLoading(false);
            return;
          }
        }

        clearCart();
        onSuccess(order.orderNumber);
        return;
      }
    } catch (err: any) {
      console.log('Backend not available, using localStorage fallback');
    }

    // Fallback to localStorage
    const orderId = await addOrder({
      userId: auth.user?.id || 'guest',
      customerName: selectedAddr.name,
      customerEmail: auth.user?.email || '',
      customerPhone: selectedAddr.phone,
      items: cart.items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        image: item.image,
      })),
      total,
      status: 'pending',
      shippingAddress: {
        street: selectedAddr.street,
        city: selectedAddr.city,
        state: selectedAddr.state,
        pincode: selectedAddr.pincode,
      },
      paymentMethod,
    });

    // Update customer data
    addOrUpdateCustomer({
      id: auth.user?.id || 'guest-' + Date.now(),
      name: selectedAddr.name,
      email: auth.user?.email || '',
      phone: selectedAddr.phone,
      orderAmount: total,
    });

    // Send WhatsApp notification to admin
    const itemsList = cart.items.map(item => 
      `• ${item.name} (${item.selectedSize || 'N/A'}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const whatsappMessage = encodeURIComponent(
      `🛒 *NEW ORDER - ${orderId}*\n\n` +
      `👤 *Customer:* ${selectedAddr.name}\n` +
      `📱 *Phone:* ${selectedAddr.phone}\n` +
      `📧 *Email:* ${auth.user?.email || 'N/A'}\n\n` +
      `📦 *Items:*\n${itemsList}\n\n` +
      `💰 *Total:* ₹${total.toLocaleString()}\n` +
      `💳 *Payment:* ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}\n\n` +
      `📍 *Delivery Address:*\n${selectedAddr.street}\n${selectedAddr.city}, ${selectedAddr.state} - ${selectedAddr.pincode}`
    );
    
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMessage}`, '_blank');

    clearCart();
    setIsLoading(false);
    onSuccess(orderId);
  };

  const selectedAddressData = addresses.find(a => a.id === selectedAddress);


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-elitos-brown">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 p-4 bg-gray-50">
          {['address', 'payment', 'confirm'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-elitos-orange text-white' : 
                ['address', 'payment', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {/* Address Step */}
          {step === 'address' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin size={18} /> Delivery Address
              </h3>

              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedAddress === address.id ? 'border-elitos-orange bg-orange-50' : 'hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={() => setSelectedAddress(address.id)}
                    className="sr-only"
                  />
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      {/* Verification Badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {address.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                            <Check size={10} />
                            Courier-verified
                          </span>
                        )}
                        {address.locationConfirmed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                            <MapPin size={10} />
                            Location confirmed
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}

              {showAddAddress ? (
                <div className="border rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  
                  {/* India Post Pincode Verification + OpenStreetMap */}
                  <AddressAutocomplete
                    value={{
                      fullAddress: newAddress.street,
                      landmark: newAddress.landmark,
                      pincode: newAddress.pincode,
                      city: newAddress.city,
                      state: newAddress.state,
                      verified: newAddress.verified,
                      locationConfirmed: newAddress.locationConfirmed,
                    }}
                    onChange={(addr) => {
                      setNewAddress({
                        ...newAddress,
                        street: addr.fullAddress,
                        landmark: addr.landmark,
                        pincode: addr.pincode,
                        city: addr.city,
                        state: addr.state,
                        verified: addr.verified,
                        locationConfirmed: addr.locationConfirmed,
                      });
                    }}
                    onValidationChange={(isValid) => setIsPincodeValid(isValid)}
                  />
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddAddress}
                      disabled={!isPincodeValid}
                      className="flex-1 bg-elitos-orange text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 border rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="w-full p-4 border-2 border-dashed rounded-xl text-gray-500 hover:border-elitos-orange hover:text-elitos-orange transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add New Address
                </button>
              )}
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard size={18} /> Payment Method
              </h3>

              <label
                className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-elitos-orange bg-orange-50' : 'hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <Truck size={24} className="text-gray-600" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </div>
              </label>

              <label
                className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE' ? 'border-elitos-orange bg-orange-50' : 'hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <CreditCard size={24} className="text-gray-600" />
                  <div>
                    <p className="font-medium">Pay Online</p>
                    <p className="text-sm text-gray-500">UPI, Cards, Net Banking (Razorpay)</p>
                  </div>
                </div>
              </label>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                <Shield size={16} />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          )}

          {/* Confirm Step */}
          {step === 'confirm' && selectedAddressData && (
            <div className="space-y-4">
              <h3 className="font-semibold">Order Summary</h3>

              {/* Items */}
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id + (item.selectedSize || '')} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm">
                        ₹{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Delivering to:</p>
                <p className="font-medium">{selectedAddressData.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedAddressData.street}, {selectedAddressData.city} - {selectedAddressData.pincode}
                </p>
                <p className="text-sm text-gray-600">{selectedAddressData.phone}</p>
              </div>

              {/* Payment */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Payment:</p>
                <p className="font-medium">
                  {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          {/* Price Summary */}
          <div className="space-y-1 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {step !== 'address' && (
              <button
                onClick={() => setStep(step === 'confirm' ? 'payment' : 'address')}
                className="px-6 py-3 border rounded-lg font-medium"
                disabled={isLoading}
              >
                Back
              </button>
            )}
            
            {step === 'address' && (
              <button
                onClick={() => { setError(null); setStep('payment'); }}
                disabled={!selectedAddress}
                className="flex-1 bg-elitos-orange text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue to Payment <ChevronRight size={18} />
              </button>
            )}

            {step === 'payment' && (
              <button
                onClick={() => { setError(null); setStep('confirm'); }}
                className="flex-1 bg-elitos-orange text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                Review Order <ChevronRight size={18} />
              </button>
            )}

            {step === 'confirm' && (
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="flex-1 bg-elitos-orange text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Place Order • ₹${total.toLocaleString()}`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
