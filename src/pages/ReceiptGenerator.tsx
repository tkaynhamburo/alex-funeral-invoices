import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, Printer, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface ReceiptData {
  receiptNumber: string;
  receiptDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  description: string;
  amount: string;
  paymentMethod: string;
}

const STORAGE_KEY = 'receiptFormData';

const ReceiptGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ReceiptData>({
    receiptNumber: '',
    receiptDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    description: '',
    amount: '',
    paymentMethod: 'Cash',
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        toast({
          title: "Data Restored",
          description: "Your previous receipt data has been loaded.",
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data whenever form changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData({
        receiptNumber: '',
        receiptDate: new Date().toISOString().split('T')[0],
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        customerEmail: '',
        description: '',
        amount: '',
        paymentMethod: 'Cash',
      });
      toast({
        title: "Data Cleared",
        description: "All receipt data has been cleared.",
      });
    }
  };

  const handleInputChange = (field: keyof ReceiptData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateReceiptHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .receipt-container { max-width: 800px; margin: 0 auto; border: 2px solid #1e40af; padding: 30px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
            .company-name { color: #1e40af; font-size: 28px; font-weight: bold; margin: 0 0 10px 0; }
            .company-details { color: #666; font-size: 12px; line-height: 1.6; }
            .receipt-title { text-align: center; font-size: 24px; font-weight: bold; color: #1e40af; margin: 20px 0; }
            .receipt-info { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f8fafc; }
            .info-group { flex: 1; }
            .info-label { font-weight: bold; color: #333; font-size: 12px; }
            .info-value { color: #666; font-size: 12px; margin-top: 5px; }
            .customer-section { margin: 20px 0; padding: 15px; background: #f8fafc; }
            .section-title { font-weight: bold; color: #1e40af; font-size: 14px; margin-bottom: 10px; }
            .customer-details { color: #666; font-size: 12px; line-height: 1.8; }
            .payment-details { margin: 20px 0; padding: 20px; background: #f8fafc; }
            .payment-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; }
            .payment-label { font-weight: bold; color: #333; }
            .payment-value { color: #666; }
            .total-row { border-top: 2px solid #1e40af; padding-top: 15px; margin-top: 15px; }
            .total-amount { font-size: 20px; font-weight: bold; color: #1e40af; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #1e40af; text-align: center; color: #666; font-size: 11px; }
            .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; }
            .signature-line { border-top: 2px solid #333; width: 200px; margin: 0 auto 10px; }
            .signature-label { color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1 class="company-name">ALEX'S FUNERAL SERVICES</h1>
              <div class="company-details">
                30 Suncity<br>
                Orchard, De Doorns<br>
                6840<br>
                067 333 4472<br>
                anhamburo14@gmail.com
              </div>
            </div>

            <div class="receipt-title">RECEIPT</div>

            <div class="receipt-info">
              <div class="info-group">
                <div class="info-label">Receipt Number:</div>
                <div class="info-value">${formData.receiptNumber}</div>
              </div>
              <div class="info-group">
                <div class="info-label">Date:</div>
                <div class="info-value">${new Date(formData.receiptDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div class="customer-section">
              <div class="section-title">RECEIVED FROM:</div>
              <div class="customer-details">
                <strong>${formData.customerName}</strong><br>
                ${formData.customerAddress}<br>
                ${formData.customerPhone}<br>
                ${formData.customerEmail}
              </div>
            </div>

            <div class="payment-details">
              <div class="section-title">PAYMENT DETAILS</div>
              <div class="payment-row">
                <span class="payment-label">Description:</span>
                <span class="payment-value">${formData.description}</span>
              </div>
              <div class="payment-row">
                <span class="payment-label">Payment Method:</span>
                <span class="payment-value">${formData.paymentMethod}</span>
              </div>
              <div class="payment-row total-row">
                <span class="payment-label">TOTAL AMOUNT RECEIVED:</span>
                <span class="total-amount">R ${parseFloat(formData.amount || '0').toFixed(2)}</span>
              </div>
            </div>

            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Customer Signature</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Authorized Signature</div>
              </div>
            </div>

            <div class="footer">
              <p><strong>Thank you for your payment</strong></p>
              <p>This is an official receipt from Alex's Funeral Services</p>
              <p>Registration Number: K2020920761</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = () => {
    if (!formData.receiptNumber || !formData.customerName || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in receipt number, customer name, and amount.",
        variant: "destructive",
      });
      return;
    }

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header - Company Info
    pdf.setFillColor(30, 64, 175);
    pdf.rect(0, 0, pageWidth, 100, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text("ALEX'S FUNERAL SERVICES", pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('30 Suncity', pageWidth / 2, 55, { align: 'center' });
    pdf.text('Orchard, De Doorns', pageWidth / 2, 68, { align: 'center' });
    pdf.text('6840 | 067 333 4472 | anhamburo14@gmail.com', pageWidth / 2, 81, { align: 'center' });

    // Receipt Title
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECEIPT', pageWidth / 2, 130, { align: 'center' });

    // Receipt Info Box
    pdf.setFillColor(248, 250, 252);
    pdf.rect(50, 150, pageWidth - 100, 50, 'F');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Receipt Number:', 70, 170);
    pdf.text('Date:', 350, 170);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(102, 102, 102);
    pdf.text(formData.receiptNumber, 70, 185);
    pdf.text(new Date(formData.receiptDate).toLocaleDateString(), 350, 185);

    // Received From Section
    pdf.setFillColor(248, 250, 252);
    pdf.rect(50, 220, pageWidth - 100, 80, 'F');
    
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECEIVED FROM:', 70, 240);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(formData.customerName, 70, 260);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(102, 102, 102);
    pdf.text(formData.customerAddress, 70, 275);
    pdf.text(`${formData.customerPhone} | ${formData.customerEmail}`, 70, 288);

    // Payment Details Section
    pdf.setFillColor(248, 250, 252);
    pdf.rect(50, 320, pageWidth - 100, 120, 'F');
    
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT DETAILS', 70, 340);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description:', 70, 365);
    pdf.text('Payment Method:', 70, 390);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(102, 102, 102);
    pdf.text(formData.description, 180, 365);
    pdf.text(formData.paymentMethod, 180, 390);

    // Total Amount
    pdf.setDrawColor(30, 64, 175);
    pdf.setLineWidth(2);
    pdf.line(70, 405, pageWidth - 70, 405);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL AMOUNT RECEIVED:', 70, 425);
    
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(16);
    pdf.text(`R ${parseFloat(formData.amount || '0').toFixed(2)}`, pageWidth - 70, 425, { align: 'right' });

    // Signature Section
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Customer Signature
    pdf.line(70, 520, 220, 520);
    pdf.text('Customer Signature', 70, 535);
    
    // Authorized Signature
    pdf.line(pageWidth - 220, 520, pageWidth - 70, 520);
    pdf.text('Authorized Signature', pageWidth - 220, 535);

    // Footer
    pdf.setDrawColor(30, 64, 175);
    pdf.setLineWidth(2);
    pdf.line(50, 580, pageWidth - 50, 580);
    
    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Thank you for your payment', pageWidth / 2, 600, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('This is an official receipt from Alex\'s Funeral Services', pageWidth / 2, 615, { align: 'center' });
    pdf.text('Registration Number: K2020920761', pageWidth / 2, 630, { align: 'center' });

    pdf.save(`Receipt-${formData.receiptNumber}.pdf`);
    toast({
      title: "Success",
      description: "Receipt PDF has been generated successfully.",
    });
  };

  const handlePrint = () => {
    if (!formData.receiptNumber || !formData.customerName || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in receipt number, customer name, and amount.",
        variant: "destructive",
      });
      return;
    }

    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write(generateReceiptHTML());
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="destructive"
            onClick={clearData}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Receipt Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receiptNumber">Receipt Number *</Label>
                <Input
                  id="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                  placeholder="RCP-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptDate">Receipt Date *</Label>
                <Input
                  id="receiptDate"
                  type="date"
                  value={formData.receiptDate}
                  onChange={(e) => handleInputChange('receiptDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="067 333 4472"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Address</Label>
                <Input
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                  placeholder="123 Main Street, City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payment Information</h3>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Payment for funeral services"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (R) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={generatePDF}
                className="flex-1 bg-blue-800 hover:bg-blue-900"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptGenerator;