import type { ReactNode } from 'react';
import { 
  Shield, 
  Users, 
  Zap, 
  Globe,
  MessageSquare,
  BarChart
} from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  type: 'login' | 'register';
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and secure authentication"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time collaboration with your entire team"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for performance and speed"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your tasks from anywhere, anytime"
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Integrated chat for seamless communication"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Detailed insights and productivity metrics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Panel - Brand & Info */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-300">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white mix-blend-overlay" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white mix-blend-overlay" />
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          {/* Brand Header */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <img src="./logo.png" alt="logo"/>
              </div>
              <div>
                <h1 className="text-3xl font-bold">CollabTask</h1>
                <p className="text-blue-100 text-sm">Enterprise Task Management</p>
              </div>
            </div>

            <div className="max-w-xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Streamline Your Team's
                <span className="block text-yellow-300">Productivity</span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-12 leading-relaxed">
                Join thousands of teams who trust CollabTask to manage their projects, 
                collaborate in real-time, and achieve their goals faster.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-blue-100 opacity-90">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile Brand Header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <img src="./logo.png" alt="logo"/>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CollabTask</h1>
                <p className="text-gray-600 text-sm">Enterprise Task Management</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;