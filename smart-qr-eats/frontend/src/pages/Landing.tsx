import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Users, 
  BarChart3, 
  Clock, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Orders",
      description: "Process orders in seconds with our optimized system"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-Restaurant Management",
      description: "Manage multiple restaurant locations from one dashboard"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Get insights into sales, popular items, and customer behavior"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Real-time Tracking",
      description: "Track orders from kitchen to customer in real-time"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Optimized",
      description: "Works perfectly on all devices - mobile, tablet, desktop"
    }
  ];

  const testimonials = [
    {
      name: "Raj Patel",
      restaurant: "Spice Garden",
      rating: 5,
      text: "FastAsFlash transformed our restaurant operations. Orders are processed 3x faster!"
    },
    {
      name: "Priya Sharma",
      restaurant: "Mumbai Kitchen",
      rating: 5,
      text: "The analytics dashboard helped us increase revenue by 40% in just 2 months."
    },
    {
      name: "Arjun Singh",
      restaurant: "Delhi Delights",
      rating: 5,
      text: "Best decision we made! Customer satisfaction has never been higher."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FastAsFlash
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/login">Existing Account</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/signup">Join FastAsFlash</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
            🎉 Now serving 1000+ restaurants across India
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Manage Your Restaurant
            <br />
            <span className="text-4xl md:text-6xl">As Fast As Flash</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your restaurant operations with our cutting-edge SaaS platform. 
            Manage orders, menus, and revenue easily with real-time analytics and seamless integration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
              asChild
            >
              <Link to="/signup">
                Join FastAsFlash
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50"
              asChild
            >
              <Link to="/login">
                Existing Account
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Restaurants Served</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50M+</div>
              <div className="text-gray-600">Orders Processed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose FastAsFlash?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a successful restaurant in the digital age
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-blue-600 group-hover:text-purple-600 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your restaurant. All plans include 3 easy installments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Basic</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹5,000</div>
                <div className="text-gray-600 mb-6">or ₹1,667/month for 3 months</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Menu Management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Basic Order Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Customer Support
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Choose Basic</Button>
              </CardContent>
            </Card>

            <Card className="relative border-2 border-blue-500 scale-105">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Advanced</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹8,000</div>
                <div className="text-gray-600 mb-6">or ₹2,667/month for 3 months</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Everything in Basic
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Advanced Order Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Basic Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Multi-location Support
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Advanced</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Premium</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹12,000</div>
                <div className="text-gray-600 mb-6">or ₹4,000/month for 3 months</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Everything in Advanced
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Full Analytics Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Priority Support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Custom Integrations
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Choose Premium</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of happy restaurant owners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.restaurant}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join FastAsFlash today and experience the future of restaurant management
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto"
              asChild
            >
              <Link to="/signup">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto"
              asChild
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FastAsFlash</span>
              </div>
              <p className="text-gray-400">
                Empowering restaurants with cutting-edge technology
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 support@fastasflash.com</p>
                <p>📞 +91 9876543210</p>
                <p>📍 Mumbai, India</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FastAsFlash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;