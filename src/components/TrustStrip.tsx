import { Shield, Truck, CreditCard, Award } from 'lucide-react';

const TrustStrip = () => {
  const trustItems = [
    { icon: Shield, text: '100% Authentic', subtext: 'Genuine products only' },
    { icon: Truck, text: 'Fast Delivery', subtext: 'Pan India shipping' },
    { icon: CreditCard, text: 'Secure Payment', subtext: 'COD & UPI available' },
    { icon: Award, text: 'Premium Quality', subtext: 'Best materials used' },
  ];

  return (
    <section className="py-4 bg-gradient-to-r from-elitos-brown via-elitos-brown/95 to-elitos-brown">
      <div className="container-custom">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-3">
          {trustItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <div className="w-8 h-8 bg-elitos-orange/20 rounded-lg flex items-center justify-center">
                <item.icon size={16} className="text-elitos-orange" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-white block leading-tight">{item.text}</span>
                <span className="text-[10px] text-white/60 hidden sm:block">{item.subtext}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;