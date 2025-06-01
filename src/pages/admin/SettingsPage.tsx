
import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Settings, Upload } from "lucide-react";
import Logo from "@/components/Logo";

const SettingsPage = () => {
  const { settings, updateSettings } = useApp();
  const [storeName, setStoreName] = useState(settings.storeName);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [exchangeRate, setExchangeRate] = useState(settings.exchangeRate.toString());
  const [previewLogo, setPreviewLogo] = useState(settings.logoUrl);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSaveSettings = () => {
    if (!storeName || !slogan || !whatsappNumber || !exchangeRate) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const rateValue = parseFloat(exchangeRate);
    if (isNaN(rateValue) || rateValue <= 0) {
      toast.error("Exchange rate must be a positive number");
      return;
    }
    
    updateSettings({
      storeName,
      slogan,
      whatsappNumber,
      exchangeRate: rateValue,
      logoUrl: previewLogo
    });
    
    toast.success("Settings saved successfully");
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewLogo(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Store Settings</h1>
        <p className="text-gray-500">Configure your store settings for production</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Update your store details that will appear to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slogan">Store Slogan</Label>
              <Input
                id="slogan"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Enter your store slogan"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Store Logo</CardTitle>
            <CardDescription>
              Upload your store logo (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-40 h-40">
                <Logo size="lg" withText={false} />
              </div>
            </div>
            
            <div className="flex justify-center">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button onClick={triggerFileUpload} className="bg-boutique-primary hover:bg-boutique-dark">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Logo
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Business Configuration</CardTitle>
            <CardDescription>
              Configure business operational settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Business Number</Label>
                <Input
                  id="whatsappNumber"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. +1234567890"
                />
                <p className="text-sm text-gray-500">
                  Include country code. This will be used for customer communication.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exchangeRate">Exchange Rate (Local Currency to USD)</Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="e.g. 36.5"
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-gray-500">
                  Set to 1.0 if you're using USD as your primary currency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          className="bg-boutique-primary hover:bg-boutique-dark"
        >
          <Settings className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
