import { Ruler, Info } from 'lucide-react';
import { CONTACT } from '../config/contact';

const footwearSizes = [
  { uk: '6', us: '7', eu: '40', cm: '24.5' },
  { uk: '7', us: '8', eu: '41', cm: '25.4' },
  { uk: '8', us: '9', eu: '42', cm: '26.2' },
  { uk: '9', us: '10', eu: '43', cm: '27.1' },
  { uk: '10', us: '11', eu: '44', cm: '27.9' },
  { uk: '11', us: '12', eu: '45', cm: '28.8' },
];

const winterwearSizes = [
  { size: 'S', chest: '36-38"', waist: '30-32"', length: '26"' },
  { size: 'M', chest: '38-40"', waist: '32-34"', length: '27"' },
  { size: 'L', chest: '40-42"', waist: '34-36"', length: '28"' },
  { size: 'XL', chest: '42-44"', waist: '36-38"', length: '29"' },
  { size: 'XXL', chest: '44-46"', waist: '38-40"', length: '30"' },
];

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-elitos-cream rounded-full flex items-center justify-center mx-auto mb-4">
            <Ruler size={32} className="text-elitos-orange" />
          </div>
          <h1 className="text-4xl font-bold text-elitos-brown mb-4">
            Size Guide
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide. 
            When in doubt, we recommend going half a size up for footwear.
          </p>
        </div>

        {/* Footwear Size Chart */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-elitos-brown mb-6">
            👟 Footwear Size Chart
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-elitos-cream">
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">UK Size</th>
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">US Size</th>
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">EU Size</th>
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                {footwearSizes.map((size, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-6 py-4">{size.uk}</td>
                    <td className="border border-gray-200 px-6 py-4">{size.us}</td>
                    <td className="border border-gray-200 px-6 py-4">{size.eu}</td>
                    <td className="border border-gray-200 px-6 py-4">{size.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure */}
        <div className="mb-16 bg-elitos-cream rounded-xl p-8">
          <h2 className="text-2xl font-bold text-elitos-brown mb-6">
            📏 How to Measure Your Foot
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-elitos-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <p>Place a piece of paper on the floor against a wall.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-elitos-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <p>Stand on the paper with your heel against the wall.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-elitos-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <p>Mark the longest part of your foot on the paper.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-elitos-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
                  <p>Measure the distance from the wall to the mark in cm.</p>
                </li>
              </ol>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Info size={24} className="text-elitos-orange mb-2" />
                <p className="text-sm text-gray-600">
                  <strong>Pro Tip:</strong> Measure your feet in the evening when they're 
                  slightly larger. If you're between sizes, go for the larger size.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Winterwear Size Chart */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-elitos-brown mb-6">
            🧥 Winterwear Size Chart
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-elitos-cream">
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">Size</th>
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">Chest</th>
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">Waist</th>
                  <th className="border border-gray-200 px-6 py-4 text-left font-semibold">Length</th>
                </tr>
              </thead>
              <tbody>
                {winterwearSizes.map((size, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-6 py-4 font-medium">{size.size}</td>
                    <td className="border border-gray-200 px-6 py-4">{size.chest}</td>
                    <td className="border border-gray-200 px-6 py-4">{size.waist}</td>
                    <td className="border border-gray-200 px-6 py-4">{size.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Need Help */}
        <div className="text-center bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-elitos-brown mb-4">
            Still Not Sure?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help you find the perfect fit.
          </p>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hi! I need help with sizing.')}`}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
