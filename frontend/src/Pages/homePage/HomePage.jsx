import HeroSection from './homecomponents/HeroSection';
import FeaturesSection from './homecomponents/FeaturesSection';
import BankingSection from './homecomponents/BankingSection';

const HomePage = () => {
  return (
    <div className="relative bg-modern-gradient min-h-screen overflow-hidden">
      {/* Enhanced Background Patterns with Animations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-hexagon-pattern opacity-15 animate-float"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-10 animate-bounce-slow"></div>
      
      {/* Multiple Animated Floating Elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-banking-accent/10 rounded-full animate-float blur-2xl"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-banking-lightBlue/8 rounded-full animate-bounce-slow blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-36 h-36 bg-banking-skyBlue/12 rounded-full animate-spin-slow blur-2xl"></div>
      <div className="absolute bottom-20 right-40 w-28 h-28 bg-banking-deepBlue/10 rounded-full animate-pulse-slow blur-lg"></div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-banking-accent/15 rounded-full animate-heartbeat blur-md"></div>
      <div className="absolute top-2/3 right-1/3 w-20 h-20 bg-banking-lightBlue/12 rounded-full animate-wiggle blur-sm"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-banking-skyBlue/20 rounded-full animate-swing blur-lg"></div>
      <div className="absolute bottom-1/3 right-10 w-22 h-22 bg-banking-deepBlue/15 rounded-full animate-wave blur-md"></div>
      
      {/* Animated Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-banking-accent/5 via-transparent to-banking-lightBlue/5 animate-gradient-shift bg-[length:200%_200%]"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-banking-skyBlue/3 via-transparent to-banking-deepBlue/3 animate-gradient-shift bg-[length:200%_200%]" style={{animationDelay: '1s'}}></div>
      
      {/* Animated Geometric Shapes */}
      <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-banking-accent/20 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-banking-lightBlue/25 animate-bounce-slow"></div>
      <div className="absolute top-3/4 right-1/5 w-10 h-10 bg-banking-skyBlue/15 rounded-full animate-pulse-slow"></div>
      <div className="absolute top-1/5 left-1/5 w-12 h-12 bg-banking-deepBlue/10 transform rotate-12 animate-wiggle"></div>
      
      {/* Floating Particles */}
      <div className="absolute top-16 left-1/2 w-2 h-2 bg-banking-accent rounded-full animate-float opacity-60"></div>
      <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-banking-lightBlue rounded-full animate-bounce-slow opacity-50" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-24 left-1/4 w-2.5 h-2.5 bg-banking-skyBlue rounded-full animate-pulse-slow opacity-70" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-48 right-1/4 w-1 h-1 bg-banking-deepBlue rounded-full animate-heartbeat opacity-40" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute top-2/5 left-3/4 w-3 h-3 bg-banking-accent/80 rounded-full animate-wave opacity-60" style={{animationDelay: '2s'}}></div>
      
      {/* Animated Lines/Streaks */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-banking-accent/30 to-transparent animate-slide-right"></div>
      <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-banking-lightBlue/25 to-transparent animate-slide-left" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-2/3 left-0 w-px h-full bg-gradient-to-b from-transparent via-banking-skyBlue/20 to-transparent animate-slide-down" style={{animationDelay: '2s'}}></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/6 right-1/6 w-6 h-6 bg-banking-accent/40 rounded-full animate-glow blur-sm"></div>
      <div className="absolute bottom-1/6 left-1/6 w-8 h-8 bg-banking-lightBlue/30 rounded-full animate-glow blur-md" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-5/6 right-2/3 w-4 h-4 bg-banking-skyBlue/50 rounded-full animate-glow blur-xs" style={{animationDelay: '2s'}}></div>
      
      {/* Main Content with Staggered Animations */}
      <div className="relative z-10 animate-fade-in-up">
        <div className="animate-slide-down" style={{animationDelay: '0.2s'}}>
          <HeroSection />
        </div>
        <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <FeaturesSection />
        </div>
        <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
          <BankingSection />
        </div>
      </div>
      
      {/* Interactive Hover Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-banking-accent/5 rounded-full animate-pulse-slow hover:animate-heartbeat transition-all duration-300"></div>
        <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-banking-lightBlue/8 rounded-full animate-float hover:animate-bounce-slow transition-all duration-300"></div>
        <div className="absolute top-3/4 left-1/2 w-24 h-24 bg-banking-skyBlue/6 rounded-full animate-spin-slow hover:animate-wiggle transition-all duration-300"></div>
      </div>
    </div>
  );
};

export default HomePage;