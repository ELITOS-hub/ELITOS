import { Sparkles, Award, Snowflake, Truck } from 'lucide-react';

const WhyUsSection = () => {
  const features = [
    { 
      icon: Sparkles, 
      title: 'Thoughtfully Designed', 
      desc: 'Every stitch, every detail crafted for daily comfort' 
    },
    { 
      icon: Award, 
      title: 'Premium Quality', 
      desc: 'Materials that last, comfort that stays' 
    },
    { 
      icon: Snowflake, 
      title: 'Authentic Footwear', 
      desc: 'Genuine branded essentials for every season' 
    },
    { 
      icon: Truck, 
      title: 'Fast Delivery', 
      desc: 'Quick shipping, always on time' 
    },
  ];

  return (
    <section className="py-8 bg-elitos-cream/30">
      <div className="container-custom">
        {/* Mobile: 2x2 Grid, Desktop: 4 in a row */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-2.5 px-3 md:px-4 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 text-center md:text-left"
            >
              <div className="w-10 h-10 md:w-9 md:h-9 bg-elitos-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <feature.icon size={18} className="text-elitos-orange md:w-4 md:h-4" />
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-elitos-brown leading-tight">{feature.title}</h3>
                <p className="text-[10px] md:text-[11px] text-gray-500 hidden md:block">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;