
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Calculator, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 relative">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img 
          src="/lovable-uploads/eab12e6f-5e51-43d5-9782-de9ca5919f56.png" 
          alt="Background Logo" 
          className="w-96 h-72 object-contain opacity-5 scale-150 blur-[0.5px]"
        />
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <img 
                src="/lovable-uploads/eab12e6f-5e51-43d5-9782-de9ca5919f56.png" 
                alt="Alex's Funeral Services Logo" 
                className="w-24 h-18 sm:w-32 sm:h-24 object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Alex's Funeral Services</h1>
                <p className="text-sm sm:text-base text-gray-600">Ready To Serve The Community</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/admin')}
              className="bg-blue-800 hover:bg-blue-900 flex items-center gap-2 w-full sm:w-auto"
            >
              <img 
                src="/lovable-uploads/eab12e6f-5e51-43d5-9782-de9ca5919f56.png" 
                alt="Logo" 
                className="w-4 h-4 object-contain"
              />
              <Shield className="w-4 h-4" />
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Compassionate Care in Your Time of Need
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            At Alex's Funeral Services, we understand the importance of honoring your loved ones 
            with dignity and respect. Our professional team is here to guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900 w-full sm:w-auto">
              Our Services
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Caring Message Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-blue-50/90 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-blue-800" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">We Care</h3>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed px-2">
            At Alex's Funeral Services, we understand that losing a loved one is one of life's most difficult experiences. 
            Our compassionate team is dedicated to providing personalized care and support to help you honor your loved one's 
            memory with dignity and respect. We're here for you every step of the way.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white/90 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-800" />
                  Funeral Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Complete funeral planning services including transport, coffins, and ceremonial arrangements.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-800" />
                  Professional Invoicing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Transparent pricing with detailed invoices and quotations for all services provided.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-800" />
                  24/7 Support
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm sm:text-base">
                  Round-the-clock support to assist families during their most difficult times.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50/90 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-800 mb-3 sm:mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">Address</h4>
              <p className="text-gray-600 text-sm sm:text-base">30 Suncity<br />Orchard, De Dorms<br />6840</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-800 mb-3 sm:mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">Phone</h4>
              <p className="text-gray-600 text-sm sm:text-base">067 333 4472</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-blue-800 mb-3 sm:mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">Email</h4>
              <p className="text-gray-600 text-sm sm:text-base break-all">anhamburo14@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-sm text-white py-6 sm:py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2025 Alex's Funeral Services. All rights reserved. | Registration Number: K2020920761
          </p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Serving the community with compassion and dignity
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
