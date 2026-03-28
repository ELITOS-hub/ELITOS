import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, Loader2 } from 'lucide-react';
import { Address } from '../../types';
import { userAPI } from '../../services/api';

interface SavedAddressesProps {
  onBack: () => void;
}

const SavedAddresses = ({ onBack }: SavedAddressesProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const data = await userAPI.getAddresses();
        setAddresses(data);
      } catch (err) {
        setError('Failed to load addresses');
        setAddresses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({});

  const handleSave = async () => {
    try {
      if (editingId) {
        const updated = await userAPI.updateAddress(editingId, formData);
        setAddresses(addresses.map(a => a.id === editingId ? updated : a));
        setEditingId(null);
      } else {
        const newAddress = await userAPI.addAddress({
          name: formData.name || '',
          phone: formData.phone || '',
          addressLine1: formData.addressLine1 || '',
          addressLine2: formData.addressLine2,
          city: formData.city || '',
          state: formData.state || '',
          pincode: formData.pincode || '',
          isDefault: addresses.length === 0,
        });
        setAddresses([...addresses, newAddress]);
        setIsAdding(false);
      }
      setFormData({});
    } catch (err) {
      // Fallback to local state
      if (editingId) {
        setAddresses(addresses.map(a => a.id === editingId ? { ...a, ...formData } : a));
        setEditingId(null);
      } else {
        const newAddress: Address = {
          id: Date.now().toString(),
          name: formData.name || '',
          phone: formData.phone || '',
          addressLine1: formData.addressLine1 || '',
          addressLine2: formData.addressLine2,
          city: formData.city || '',
          state: formData.state || '',
          pincode: formData.pincode || '',
          isDefault: addresses.length === 0,
        };
        setAddresses([...addresses, newAddress]);
        setIsAdding(false);
      }
      setFormData({});
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userAPI.deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const setAsDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData(address);
  };

  const AddressForm = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4">
        {editingId ? 'Edit Address' : 'Add New Address'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            placeholder="10-digit mobile number"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <input
            type="text"
            value={formData.addressLine1 || ''}
            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            placeholder="House/Flat No., Building Name, Street"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
          <input
            type="text"
            value={formData.addressLine2 || ''}
            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            placeholder="Landmark, Area"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select
            value={formData.state || ''}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
          >
            <option value="">Select State</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            value={formData.pincode || ''}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            placeholder="6-digit pincode"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} className="btn-primary">
          {editingId ? 'Update Address' : 'Save Address'}
        </button>
        <button 
          onClick={() => {
            setIsAdding(false);
            setEditingId(null);
            setFormData({});
          }}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Account
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-elitos-brown">Saved Addresses</h1>
          {!isAdding && !editingId && (
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Address
            </button>
          )}
        </div>

        {(isAdding || editingId) && <AddressForm />}

        {isLoading ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-elitos-orange mx-auto mb-4" />
            <p className="text-gray-600">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 && !isAdding ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved addresses</h3>
            <p className="text-gray-500 mb-6">Add an address for faster checkout.</p>
            <button onClick={() => setIsAdding(true)} className="btn-primary">
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div 
                key={address.id}
                className={`bg-white rounded-xl shadow-sm p-6 relative ${
                  address.isDefault ? 'ring-2 ring-elitos-orange' : ''
                }`}
              >
                {address.isDefault && (
                  <span className="absolute top-4 right-4 bg-elitos-orange text-white text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={20} className="text-elitos-orange mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {address.addressLine1}
                      {address.addressLine2 && <><br />{address.addressLine2}</>}
                      <br />
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <button
                    onClick={() => startEdit(address)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-elitos-orange"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => setAsDefault(address.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 ml-auto"
                    >
                      <Check size={14} />
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;
