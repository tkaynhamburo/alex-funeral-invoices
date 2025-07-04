
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
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const total = calculateTotal();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quotation ${quotationData.quotationNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
          .logo-section { display: flex; align-items: center; }
          .logo { width: 120px; height: 80px; margin-right: 20px; }
          .logo img { width: 100%; height: 100%; object-fit: contain; }
          .company-info { }
          .company-name { font-size: 24px; font-weight: bold; margin: 0; color: #1e3a8a; }
          .company-details { color: #666; margin-top: 5px; }
          .quotation-info { text-align: right; }
          .quotation-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #2563eb; }
          .client-section { margin: 30px 0; }
          .quote-to { font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .amount { text-align: right; }
          .totals { margin-top: 20px; }
          .totals table { width: 300px; margin-left: auto; }
          .total-row { font-weight: bold; font-size: 18px; color: #2563eb; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
          .footer-text { color: #666; font-size: 14px; }
          .total-amount { background-color: #eff6ff; padding: 15px; text-align: center; 
                         font-size: 20px; font-weight: bold; margin: 20px 0; color: #2563eb; }
          .validity { background-color: #fef3c7; padding: 10px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <div class="logo">
              <img src="/lovable-uploads/eab12e6f-5e51-43d5-9782-de9ca5919f56.png" alt="Alex's Funeral Services Logo" />
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
            <div style="margin-top: 20px;">
              <strong>DATE</strong><br>
              ${new Date(quotationData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="margin-top: 15px;">
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
              <th>DESCRIPTION</th>
              <th class="amount">RATE</th>
              <th class="amount">QTY</th>
              <th class="amount">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${quotationData.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td class="amount">R${item.rate.toFixed(2)}</td>
                <td class="amount">${item.qty}</td>
                <td class="amount">R${item.amount.toFixed(2)}</td>
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
          <div style="text-align: center; margin-top: 30px; font-weight: bold; color: #2563eb;">
            Ready To Serve The Community
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);

    toast({
      title: "PDF Generated",
      description: "Quotation PDF has been generated and is ready for download",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Quotation Generator</h1>
            </div>
            <Button onClick={generatePDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quotationNumber">Quotation Number</Label>
                <Input
                  id="quotationNumber"
                  value={quotationData.quotationNumber}
                  onChange={(e) => setQuotationData({...quotationData, quotationNumber: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={quotationData.date}
                  onChange={(e) => setQuotationData({...quotationData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={quotationData.validUntil}
                  onChange={(e) => setQuotationData({...quotationData, validUntil: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={quotationData.clientName}
                onChange={(e) => setQuotationData({...quotationData, clientName: e.target.value})}
                placeholder="Enter client name"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {quotationData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
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
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
