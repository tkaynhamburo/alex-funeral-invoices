import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Plus, Trash2, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface QuotationItem {
  description: string;
  rate: number;
  qty: number;
  amount: number;
}

interface QuotationData {
  quotationNumber: string;
  date: string;
  validUntil: string;
  clientName: string;
  items: QuotationItem[];
  discount: number;
}

const QuotationGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  
  const [quotationData, setQuotationData] = useState<QuotationData>({
    quotationNumber: `QUO${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: '',
    items: [
      { description: 'Transport', rate: 13500, qty: 1, amount: 13500 },
      { description: 'Coffin', rate: 2500, qty: 1, amount: 2500 }
    ],
    discount: 0
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('quotationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setQuotationData(parsedData);
        toast({
          title: "Data Restored",
          description: "Your previous quotation data has been restored.",
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [toast]);

  // Save data to localStorage whenever quotationData changes
  useEffect(() => {
    localStorage.setItem('quotationData', JSON.stringify(quotationData));
  }, [quotationData]);

  // Clear saved data function
  const clearSavedData = () => {
    localStorage.removeItem('quotationData');
    setQuotationData({
      quotationNumber: `QUO${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clientName: '',
      items: [
        { description: 'Transport', rate: 13500, qty: 1, amount: 13500 },
        { description: 'Coffin', rate: 2500, qty: 1, amount: 2500 }
      ],
      discount: 0
    });
    toast({
      title: "Data Cleared",
      description: "All quotation data has been cleared.",
    });
  };

  const calculateTotal = () => {
    const subtotal = quotationData.items.reduce((sum, item) => sum + item.amount, 0);
    return subtotal - quotationData.discount;
  };

  const generatePDFContent = () => {
    const total = calculateTotal();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quotation ${quotationData.quotationNumber}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media print {
            body { margin: 0 !important; }
            .no-print { display: none !important; }
            @page { margin: 0.5in; }
          }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 10px; 
            font-size: 12px;
            line-height: 1.3;
            background: white;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          @media (max-width: 600px) {
            body { padding: 5px; font-size: 11px; }
            .header { flex-direction: column; text-align: center; }
            .quotation-info { text-align: center; margin-top: 15px; }
            .logo { width: 60px; height: 45px; }
            .company-name { font-size: 16px; }
            table { font-size: 10px; }
            th, td { padding: 6px 2px; }
          }
          .logo-section { display: flex; align-items: center; flex-wrap: wrap; }
          .logo { width: 80px; height: 60px; margin-right: 15px; }
          .logo img { width: 100%; height: 100%; object-fit: contain; }
          .company-name { font-size: 18px; font-weight: bold; margin: 0; color: #1e3a8a; }
          .company-details { color: #666; margin-top: 5px; font-size: 11px; }
          .quotation-info { text-align: right; }
          .quotation-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #2563eb; }
          .client-section { margin: 20px 0; }
          .quote-to { font-weight: bold; margin-bottom: 8px; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
            font-size: 11px;
          }
          th, td { 
            padding: 8px 4px; 
            text-align: left; 
            border-bottom: 1px solid #ddd; 
            word-wrap: break-word;
          }
          th { background-color: #f8f9fa; font-weight: bold; }
          .amount { text-align: right; }
          .totals { margin-top: 20px; }
          .totals table { width: 100%; max-width: 280px; margin-left: auto; }
          .totals table td { padding: 12px 8px; border-bottom: 1px solid #e5e7eb; }
          .total-row { font-weight: bold; font-size: 16px; color: #2563eb; background-color: #eff6ff; }
          .total-row td { padding: 15px 8px; }
          .footer { 
            margin-top: 30px; 
            padding-top: 15px; 
            border-top: 1px solid #ddd; 
            font-size: 10px;
          }
          .footer-text { color: #666; }
          .total-amount { 
            background-color: #eff6ff; 
            padding: 10px; 
            text-align: center; 
            font-size: 16px; 
            font-weight: bold; 
            margin: 15px 0; 
            color: #2563eb; 
          }
          .validity { 
            background-color: #fef3c7; 
            padding: 10px; 
            border-radius: 5px; 
            margin: 15px 0; 
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <div class="logo">
              <img src="/lovable-uploads/eab12e6f-5e51-43d5-9782-de9ca5919f56.png" alt="Alex's Funeral Services Logo" onerror="this.style.display='none'" />
            </div>
            <div class="company-info">
              <h1 class="company-name">ALEX'S FUNERAL SERVICES</h1>
              <div class="company-details">
                30 Suncity<br>
                Orchard, De Dorms<br>
                6840<br>
                067 333 4472<br>
                anhamburo14@gmail.com
              </div>
            </div>
          </div>
          <div class="quotation-info">
            <div class="quotation-title">QUOTATION<br>${quotationData.quotationNumber}</div>
            <div style="margin-top: 15px;">
              <strong>DATE</strong><br>
              ${new Date(quotationData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="margin-top: 10px;">
              <strong>VALID UNTIL</strong><br>
              ${new Date(quotationData.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div class="client-section">
          <div class="quote-to">QUOTE TO</div>
          <div>${quotationData.clientName || 'Prospective Client'}</div>
        </div>

        <div class="validity">
          <strong>Note:</strong> This quotation is valid until ${new Date(quotationData.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. 
          Prices may be subject to change after this date.
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40%;">DESCRIPTION</th>
              <th class="amount" style="width: 20%;">RATE</th>
              <th class="amount" style="width: 15%;">QTY</th>
              <th class="amount" style="width: 25%;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${quotationData.items.map(item => `
              <tr>
                <td>${item.description || 'N/A'}</td>
                <td class="amount">R${(item.rate || 0).toFixed(2)}</td>
                <td class="amount">${item.qty || 0}</td>
                <td class="amount">R${(item.amount || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td><strong>SUBTOTAL</strong></td>
              <td class="amount"><strong>R${quotationData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong></td>
            </tr>
            ${quotationData.discount > 0 ? `
            <tr>
              <td><strong>DISCOUNT</strong></td>
              <td class="amount"><strong>-R${quotationData.discount.toFixed(2)}</strong></td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td><strong>TOTAL QUOTE AMOUNT</strong></td>
              <td class="amount"><strong>ZAR R${total.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>

        <div class="total-amount">
          <strong>Total Quotation Amount: ZAR R${total.toFixed(2)}</strong>
        </div>

        <div class="footer">
          <div class="footer-text">
            <strong>Terms & Conditions:</strong><br>
            • This quote is valid for 30 days from the date of issue<br>
            • Payment terms: As agreed upon acceptance<br>
            • All prices are inclusive of applicable taxes<br><br>
            
            Registration Number K2020920761<br>
            Payment Details<br>
            Account Name: AMN Funeral Services<br>
            Bank: FNB<br>
            Account number: 63092451681
          </div>
          <div style="text-align: center; margin-top: 20px; font-weight: bold; color: #2563eb;">
            Ready To Serve The Community
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadPDF = async () => {
    console.log('Starting PDF download for quotation');
    
    try {
      const pdf = new jsPDF();
      const total = calculateTotal();
      
      // Add logo
      try {
        const logoUrl = '/lovable-uploads/eab12e6f-5e51-43d5-9782-de9ca5919f56.png';
        pdf.addImage(logoUrl, 'PNG', 15, 15, 30, 22);
      } catch (error) {
        console.log('Logo not loaded, continuing without it');
      }

      // Company header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 58, 138);
      pdf.text("ALEX'S FUNERAL SERVICES", 50, 25);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(102, 102, 102);
      pdf.text('30 Suncity', 50, 32);
      pdf.text('Orchard, De Dorms', 50, 37);
      pdf.text('6840', 50, 42);
      pdf.text('067 333 4472', 50, 47);
      pdf.text('anhamburo14@gmail.com', 50, 52);

      // Quotation info (right side)
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text('QUOTATION', 140, 25);
      pdf.text(quotationData.quotationNumber, 140, 32);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text('DATE', 140, 42);
      pdf.text(new Date(quotationData.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), 140, 47);
      
      pdf.text('VALID UNTIL', 140, 57);
      pdf.text(new Date(quotationData.validUntil).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), 140, 62);

      // Quote to section
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUOTE TO', 15, 90);
      pdf.setFont('helvetica', 'normal');
      pdf.text(quotationData.clientName || 'Prospective Client', 15, 97);

      // Validity notice
      pdf.setFillColor(254, 243, 199);
      pdf.rect(15, 105, 180, 12, 'F');
      pdf.setFontSize(9);
      pdf.text('Note: This quotation is valid until ' + 
        new Date(quotationData.validUntil).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) + '. Prices may be subject to change after this date.', 20, 111);

      // Items table header
      let yPos = 125;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(248, 249, 250);
      pdf.rect(15, yPos, 180, 8, 'F');
      pdf.text('DESCRIPTION', 20, yPos + 5);
      pdf.text('RATE', 110, yPos + 5);
      pdf.text('QTY', 135, yPos + 5);
      pdf.text('AMOUNT', 160, yPos + 5);

      // Items
      yPos += 12;
      pdf.setFont('helvetica', 'normal');
      quotationData.items.forEach((item) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.text(item.description || 'N/A', 20, yPos);
        pdf.text(`R${(item.rate || 0).toFixed(2)}`, 110, yPos);
        pdf.text(String(item.qty || 0), 135, yPos);
        pdf.text(`R${(item.amount || 0).toFixed(2)}`, 160, yPos);
        yPos += 8;
      });

      // Totals section with better spacing
      yPos += 15;
      
      // Subtotal
      pdf.setFont('helvetica', 'normal');
      pdf.text('SUBTOTAL', 120, yPos);
      pdf.text(`R${quotationData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`, 170, yPos);
      yPos += 10;
      
      // Discount if applicable
      if (quotationData.discount > 0) {
        pdf.text('DISCOUNT', 120, yPos);
        pdf.text(`-R${quotationData.discount.toFixed(2)}`, 170, yPos);
        yPos += 10;
      }
      
      // Line separator
      pdf.setLineWidth(0.5);
      pdf.line(120, yPos + 2, 195, yPos + 2);
      yPos += 8;
      
      // Total with better formatting
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('TOTAL QUOTE AMOUNT', 120, yPos);
      pdf.text(`ZAR R${total.toFixed(2)}`, 170, yPos);

      // Total amount highlight box with better spacing
      yPos += 20;
      pdf.setFillColor(239, 246, 255);
      pdf.rect(15, yPos, 180, 15, 'F');
      pdf.setFontSize(16);
      pdf.setTextColor(37, 99, 235);
      const totalText = `Total Quotation Amount: ZAR R${total.toFixed(2)}`;
      const textWidth = pdf.getTextWidth(totalText);
      const centerX = (210 - textWidth) / 2;
      pdf.text(totalText, centerX, yPos + 10);

      // Footer
      yPos += 25;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Terms & Conditions:', 15, yPos);
      pdf.text('• This quote is valid for 30 days from the date of issue', 15, yPos + 5);
      pdf.text('• Payment terms: As agreed upon acceptance', 15, yPos + 10);
      pdf.text('• All prices are inclusive of applicable taxes', 15, yPos + 15);
      
      pdf.text('Registration Number K2020920761', 15, yPos + 25);
      pdf.text('Payment Details', 15, yPos + 30);
      pdf.text('Account Name: AMN Funeral Services', 15, yPos + 35);
      pdf.text('Bank: FNB', 15, yPos + 40);
      pdf.text('Account number: 63092451681', 15, yPos + 45);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text('Ready To Serve The Community', 70, yPos + 55);

      // Save the PDF
      pdf.save(`Quotation_${quotationData.quotationNumber}.pdf`);
      
      toast({
        title: "Download Complete",
        description: `Quotation ${quotationData.quotationNumber} PDF has been downloaded successfully`,
      });
      
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the quotation PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Quotation</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={clearSavedData} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Clear </span>Data
              </Button>
              <Button onClick={() => setShowPreview(!showPreview)} size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} </span>Preview
              </Button>
              <Button onClick={downloadPDF} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download </span>PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quotation Form */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Quotation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotationNumber" className="text-sm font-medium">Quotation Number</Label>
                  <Input
                    id="quotationNumber"
                    value={quotationData.quotationNumber}
                    onChange={(e) => setQuotationData({...quotationData, quotationNumber: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={quotationData.date}
                    onChange={(e) => setQuotationData({...quotationData, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validUntil" className="text-sm font-medium">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={quotationData.validUntil}
                    onChange={(e) => setQuotationData({...quotationData, validUntil: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="clientName" className="text-sm font-medium">Client Name</Label>
                  <Input
                    id="clientName"
                    value={quotationData.clientName}
                    onChange={(e) => setQuotationData({...quotationData, clientName: e.target.value})}
                    placeholder="Enter client name"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <Button onClick={() => setQuotationData({
                    ...quotationData,
                    items: [...quotationData.items, { description: '', rate: 0, qty: 1, amount: 0 }]
                  })} size="sm">
                    <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add </span>Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {quotationData.items.map((item, index) => (
                    <Card key={index} className="p-3">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-600">Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...quotationData.items];
                              newItems[index] = { ...newItems[index], description: e.target.value };
                              setQuotationData({ ...quotationData, items: newItems });
                            }}
                            placeholder="Description"
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs text-gray-600">Rate</Label>
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => {
                                const newItems = [...quotationData.items];
                                const rate = Number(e.target.value);
                                newItems[index] = { ...newItems[index], rate, amount: rate * newItems[index].qty };
                                setQuotationData({ ...quotationData, items: newItems });
                              }}
                              placeholder="Rate"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Qty</Label>
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) => {
                                const newItems = [...quotationData.items];
                                const qty = Number(e.target.value);
                                newItems[index] = { ...newItems[index], qty, amount: newItems[index].rate * qty };
                                setQuotationData({ ...quotationData, items: newItems });
                              }}
                              placeholder="Qty"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Amount</Label>
                            <Input
                              type="number"
                              value={item.amount}
                              onChange={(e) => {
                                const newItems = [...quotationData.items];
                                newItems[index] = { ...newItems[index], amount: Number(e.target.value) };
                                setQuotationData({ ...quotationData, items: newItems });
                              }}
                              placeholder="Amount"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newItems = quotationData.items.filter((_, i) => i !== index);
                              setQuotationData({ ...quotationData, items: newItems });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
                    Discount Amount (R)
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={quotationData.discount}
                    onChange={(e) => setQuotationData({...quotationData, discount: Number(e.target.value)})}
                    placeholder="Enter discount amount"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <div className="text-right w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Subtotal</div>
                      <div className="text-lg font-semibold text-gray-800">
                        R{quotationData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                      </div>
                      {quotationData.discount > 0 && (
                        <>
                          <div className="text-sm text-green-600">Discount Applied</div>
                          <div className="text-lg font-semibold text-green-600">
                            -R{quotationData.discount.toFixed(2)}
                          </div>
                        </>
                      )}
                      <hr className="border-blue-300" />
                      <div className="text-sm text-blue-700 font-medium">Total Quote Amount</div>
                      <div className="text-3xl font-bold text-blue-600">
                        R{calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={downloadPDF} 
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Quotation
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {showPreview && (
            <Card className="lg:sticky lg:top-20 lg:h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Quotation Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border rounded-lg p-4 bg-white text-xs overflow-auto max-h-96"
                  dangerouslySetInnerHTML={{ __html: generatePDFContent() }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationGenerator;
