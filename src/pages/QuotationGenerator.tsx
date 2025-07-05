import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newItems = [...quotationData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'rate' || field === 'qty') {
      newItems[index].amount = newItems[index].rate * newItems[index].qty;
    }
    
    setQuotationData({ ...quotationData, items: newItems });
  };

  const addItem = () => {
    setQuotationData({
      ...quotationData,
      items: [...quotationData.items, { description: '', rate: 0, qty: 1, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = quotationData.items.filter((_, i) => i !== index);
    setQuotationData({ ...quotationData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = quotationData.items.reduce((sum, item) => sum + item.amount, 0);
    return subtotal - quotationData.discount;
  };

  const generatePDF = () => {
    console.log('Starting PDF generation for quotation');
    
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('Failed to open print window - popup blocked');
        toast({
          title: "PDF Generation Failed",
          description: "Please allow popups for this site and try again",
          variant: "destructive"
        });
        return;
      }

      const pdfContent = generatePDFContent();
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = () => {
        console.log('Print window loaded, initiating print');
        setTimeout(() => {
          try {
            printWindow.print();
            console.log('Print dialog opened successfully');
            
            // Close window after a delay to allow printing
            setTimeout(() => {
              printWindow.close();
              console.log('Print window closed');
            }, 1000);
            
            toast({
              title: "PDF Generated",
              description: "Quotation PDF has been generated and is ready for download",
            });
          } catch (printError) {
            console.error('Print error:', printError);
            toast({
              title: "Print Error",
              description: "There was an issue with the print dialog. Please try again.",
              variant: "destructive"
            });
          }
        }, 500);
      };

      printWindow.onerror = (error) => {
        console.error('Print window error:', error);
        toast({
          title: "PDF Generation Error",
          description: "There was an issue generating the PDF. Please try again.",
          variant: "destructive"
        });
      };

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
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
          .totals { margin-top: 15px; }
          .totals table { width: 100%; max-width: 250px; margin-left: auto; }
          .total-row { font-weight: bold; font-size: 14px; color: #2563eb; }
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
            ${quotationData.discount > 0 ? `
            <tr>
              <td>DISCOUNT</td>
              <td class="amount">-R${quotationData.discount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td>TOTAL QUOTE AMOUNT</td>
              <td class="amount">ZAR R${total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="total-amount">
          Total Quotation Amount: ZAR R${total.toFixed(2)}
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
            <Button onClick={generatePDF} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Generate </span>PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quotation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add </span>Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {quotationData.items.map((item, index) => (
                  <Card key={index} className="p-3 sm:p-0">
                    <div className="space-y-3 sm:space-y-0">
                      {/* Mobile layout */}
                      <div className="sm:hidden space-y-3">
                        <div>
                          <Label className="text-xs text-gray-600">Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
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
                              onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                              placeholder="Rate"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">Qty</Label>
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
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
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center sm:p-4">
                        <div className="col-span-5">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Description"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                            placeholder="Rate"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                            placeholder="Qty"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={`R${item.amount.toFixed(2)}`}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Enter discount amount to reduce total
                </p>
              </div>
              <div className="flex items-end">
                <div className="text-right w-full">
                  <div className="text-sm text-gray-600">Total Quote Amount</div>
                  <div className="text-2xl font-bold text-blue-600">
                    R{calculateTotal().toFixed(2)}
                  </div>
                  {quotationData.discount > 0 && (
                    <div className="text-sm text-green-600">
                      Discount Applied: -R{quotationData.discount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotationGenerator;
