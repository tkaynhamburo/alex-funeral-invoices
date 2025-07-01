import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const total = calculateTotal();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
          .logo-section { display: flex; align-items: center; }
          .logo { width: 120px; height: 80px; margin-right: 20px; }
          .logo img { width: 100%; height: 100%; object-fit: contain; }
          .company-info { }
          .company-name { font-size: 24px; font-weight: bold; margin: 0; color: #1e3a8a; }
          .company-details { color: #666; margin-top: 5px; }
          .invoice-info { text-align: right; }
          .invoice-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
          .client-section { margin: 30px 0; }
          .bill-to { font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .amount { text-align: right; }
          .totals { margin-top: 20px; }
          .totals table { width: 300px; margin-left: auto; }
          .total-row { font-weight: bold; font-size: 18px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
          .footer-text { color: #666; font-size: 14px; }
          .balance-due { background-color: #f8f9fa; padding: 15px; text-align: center; 
                        font-size: 20px; font-weight: bold; margin: 20px 0; }
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
          <div class="invoice-info">
            <div class="invoice-title">ALEX'S FUNERAL SERVICE'S<br>${invoiceData.invoiceNumber}</div>
            <div style="margin-top: 20px;">
              <strong>DATE</strong><br>
              ${new Date(invoiceData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="margin-top: 15px;">
              <strong>DUE</strong><br>
              ${invoiceData.dueDate}
            </div>
            <div style="margin-top: 15px;">
              <strong>BALANCE DUE</strong><br>
              ZAR R${total.toFixed(2)}
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
              <th>DESCRIPTION</th>
              <th class="amount">RATE</th>
              <th class="amount">QTY</th>
              <th class="amount">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
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
              <td>BALANCE DUE</td>
              <td class="amount">ZAR R${total.toFixed(2)}</td>
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
          <div style="text-align: center; margin-top: 30px; font-weight: bold;">
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
      description: "Invoice PDF has been generated and is ready for download",
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
              <h1 className="text-xl font-bold text-gray-900">Invoice Generator</h1>
            </div>
            <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={invoiceData.clientName}
                onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
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
                {invoiceData.items.map((item, index) => (
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
                <Label htmlFor="discount">Discount (R)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={invoiceData.discount}
                  onChange={(e) => setInvoiceData({...invoiceData, discount: Number(e.target.value)})}
                />
              </div>
              <div className="flex items-end">
                <div className="text-right w-full">
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold text-gray-900">
                    R{calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
