import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Calculator, Phone, Mail, MapPin } from 'lucide-react';

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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/eab12e6f-5e51-43d5-9782-de9ca5919f56.png" 
                alt="Alex's Funeral Services Logo" 
                className="w-32 h-24 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Alex's Funeral Services</h1>
                <p className="text-gray-600">Ready To Serve The Community</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/admin')}
              className="bg-blue-800 hover:bg-blue-900"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Access
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Compassionate Care in Your Time of Need
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            At Alex's Funeral Services, we understand the importance of honoring your loved ones 
            with dignity and respect. Our professional team is here to guide you through every step.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900">
              Our Services
            </Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 bg-white/90 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-800" />
                  Funeral Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Complete funeral planning services including transport, coffins, and ceremonial arrangements.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-blue-800" />
                  Professional Invoicing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Transparent pricing with detailed invoices and quotations for all services provided.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-800" />
                  24/7 Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Round-the-clock support to assist families during their most difficult times.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-gray-50/90 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Contact Information</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-blue-800 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
              <p className="text-gray-600">30 Suncity<br />Orchard, De Dorms<br />6840</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-blue-800 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600">067 333 4472</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-blue-800 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">anhamburo14@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/95 backdrop-blur-sm text-white py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Alex's Funeral Services. All rights reserved. | Registration Number: K2020920761
          </p>
          <p className="text-gray-400 mt-2">
            Account: AMN Funeral Services | Bank: FNB | Account Number: 63092451681
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
