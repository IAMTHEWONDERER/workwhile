import { forwardRef } from 'react';

const StatisticsSection = forwardRef(({ isVisible }, ref) => {
  return (
    <section 
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: '#3c78e6' }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute w-64 h-64 rounded-full bg-white top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute w-96 h-96 rounded-full bg-white top-3/4 right-1/4 animate-pulse"></div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">87%</div>
            <p className="text-blue-100">Employment Rate</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
            <p className="text-blue-100">Career Opportunities</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">2.5K</div>
            <p className="text-blue-100">Mentor Network</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">92%</div>
            <p className="text-blue-100">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
});
export default StatisticsSection;
