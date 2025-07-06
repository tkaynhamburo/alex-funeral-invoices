import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Plus, Trash2, Eye, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface InvoiceItem {
  description: string;
  rate: number;
  qty: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  items: InvoiceItem[];
  discount: number;
}

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: 'On Receipt',
    clientName: '',
    items: [
      { description: 'Transport', rate: 13500, qty: 1, amount: 13500 },
      { description: 'Coffin', rate: 2500, qty: 1, amount: 2500 }
    ],
    discount: 0
  });

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'rate' || field === 'qty') {
      newItems[index].amount = newItems[index].rate * newItems[index].qty;
    }
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', rate: 0, qty: 1, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    return subtotal - invoiceData.discount;
  };

  const generatePDFContent = () => {
    const total = calculateTotal();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceData.invoiceNumber}</title>
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
            .invoice-info { text-align: center; margin-top: 15px; }
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
          .invoice-info { text-align: right; }
          .invoice-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
          .client-section { margin: 20px 0; }
          .bill-to { font-weight: bold; margin-bottom: 8px; }
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
          .totals { margin-top: 15px; }
          .totals table { width: 100%; max-width: 250px; margin-left: auto; }
          .total-row { font-weight: bold; font-size: 14px; }
          .footer { 
            margin-top: 30px; 
            padding-top: 15px; 
            border-top: 1px solid #ddd; 
            font-size: 10px;
          }
          .footer-text { color: #666; }
          .balance-due { 
            background-color: #f8f9fa; 
            padding: 10px; 
            text-align: center; 
            font-size: 16px; 
            font-weight: bold; 
            margin: 15px 0; 
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
          <div class="invoice-info">
            <div class="invoice-title">ALEX'S FUNERAL SERVICE'S<br>${invoiceData.invoiceNumber}</div>
            <div style="margin-top: 15px;">
              <strong>DATE</strong><br>
              ${new Date(invoiceData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="margin-top: 10px;">
              <strong>DUE</strong><br>
              ${invoiceData.dueDate}
            </div>
            <div style="margin-top: 10px;">
              <strong>BALANCE &nbsp;&nbsp;&nbsp; DUE</strong><br>
              R${total.toFixed(2)}
            </div>
          </div>
        </div>

        <div class="client-section">
          <div class="bill-to">BILL TO</div>
          <div>${invoiceData.clientName || 'Client'}</div>
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
            ${invoiceData.items.map(item => `
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
            ${invoiceData.discount > 0 ? `
            <tr>
              <td>DISCOUNT</td>
              <td class="amount">-R${invoiceData.discount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
              <td>TOTAL</td>
              <td class="amount">R${total.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>BALANCE &nbsp;&nbsp;&nbsp; DUE</td>
              <td class="amount">R${total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <div class="footer-text">
            Registration Number K2020920761<br>
            Payment Details<br>
            Account Name: AMN Funeral Services<br>
            Bank: FNB<br>
            Account number: 63092451681
          </div>
          <div style="text-align: center; margin-top: 20px; font-weight: bold;">
            Ready To Serve The Community
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadPDF = async () => {
    console.log('Starting PDF download for invoice');
    
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

      // Invoice info (right side)
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text("ALEX'S FUNERAL SERVICE'S", 140, 25);
      pdf.text(invoiceData.invoiceNumber, 140, 32);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('DATE', 140, 42);
      pdf.text(new Date(invoiceData.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), 140, 47);
      
      pdf.text('DUE', 140, 57);
      pdf.text(invoiceData.dueDate, 140, 62);
      
      pdf.text('BALANCE', 140, 72);
      pdf.text('DUE', 165, 72);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`R${total.toFixed(2)}`, 140, 77);

      // Bill to section
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO', 15, 90);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceData.clientName || 'Client', 15, 97);

      // Items table header
      let yPos = 110;
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
      invoiceData.items.forEach((item) => {
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

      // Totals
      yPos += 10;
      if (invoiceData.discount > 0) {
        pdf.text('DISCOUNT', 135, yPos);
        pdf.text(`-R${invoiceData.discount.toFixed(2)}`, 160, yPos);
        yPos += 8;
      }
      
      pdf.text('TOTAL', 135, yPos);
      pdf.text(`R${total.toFixed(2)}`, 160, yPos);
      yPos += 8;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('BALANCE', 135, yPos);
      pdf.text('DUE', 160, yPos);
      pdf.text(`R${total.toFixed(2)}`, 175, yPos);

      // Footer
      yPos += 20;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text('Registration Number K2020920761', 15, yPos);
      pdf.text('Payment Details', 15, yPos + 5);
      pdf.text('Account Name: AMN Funeral Services', 15, yPos + 10);
      pdf.text('Bank: FNB', 15, yPos + 15);
      pdf.text('Account number: 63092451681', 15, yPos + 20);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Ready To Serve The Community', 70, yPos + 30);

      // Save the PDF
      pdf.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
      
      toast({
        title: "Download Complete",
        description: `Invoice ${invoiceData.invoiceNumber} PDF has been downloaded successfully`,
      });
      
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the invoice PDF. Please try again.",
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
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Invoice</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowPreview(!showPreview)} size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} </span>Preview
              </Button>
              <Button onClick={downloadPDF} size="sm" className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download </span>PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice Form */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
                  <TabsTrigger value="items" className="text-xs sm:text-sm">Items</TabsTrigger>
                  <TabsTrigger value="summary" className="text-xs sm:text-sm">Summary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber" className="text-sm font-medium">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={invoiceData.date}
                        onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                      <Input
                        id="dueDate"
                        value={invoiceData.dueDate}
                        onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientName" className="text-sm font-medium">Client Name</Label>
                      <Input
                        id="clientName"
                        value={invoiceData.clientName}
                        onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
                        placeholder="Enter client name"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Items</h3>
                    <Button onClick={() => setInvoiceData({
                      ...invoiceData,
                      items: [...invoiceData.items, { description: '', rate: 0, qty: 1, amount: 0 }]
                    })} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {invoiceData.items.map((item, index) => (
                      <Card key={index} className="p-3">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-600">Description</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...invoiceData.items];
                                newItems[index] = { ...newItems[index], description: e.target.value };
                                setInvoiceData({ ...invoiceData, items: newItems });
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
                                  const newItems = [...invoiceData.items];
                                  const rate = Number(e.target.value);
                                  newItems[index] = { ...newItems[index], rate, amount: rate * newItems[index].qty };
                                  setInvoiceData({ ...invoiceData, items: newItems });
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
                                  const newItems = [...invoiceData.items];
                                  const qty = Number(e.target.value);
                                  newItems[index] = { ...newItems[index], qty, amount: newItems[index].rate * qty };
                                  setInvoiceData({ ...invoiceData, items: newItems });
                                }}
                                placeholder="Qty"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Amount</Label>
                              <Input
                                value={`R${item.amount.toFixed(2)}`}
                                readOnly
                                className="bg-gray-50 mt-1"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newItems = invoiceData.items.filter((_, i) => i !== index);
                                setInvoiceData({ ...invoiceData, items: newItems });
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
                </TabsContent>

                <TabsContent value="summary" className="space-y-6">
                  <div>
                    <Label htmlFor="discount" className="text-sm font-medium">Discount (R)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={invoiceData.discount}
                      onChange={(e) => setInvoiceData({...invoiceData, discount: Number(e.target.value)})}
                      className="mt-1 max-w-xs"
                    />
                  </div>
                  
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Total Invoice Amount</div>
                        <div className="text-3xl font-bold text-green-700">
                          R{calculateTotal().toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    onClick={downloadPDF} 
                    className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF Invoice
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {showPreview && (
            <Card className="lg:sticky lg:top-20 lg:h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Invoice Preview
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

export default InvoiceGenerator;
