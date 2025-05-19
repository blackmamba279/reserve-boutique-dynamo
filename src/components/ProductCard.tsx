
import { useState } from "react";
import { Product } from "@/models/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { settings, reserveProduct } = useApp();
  const { t } = useLanguage();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showReservationForm, setShowReservationForm] = useState(false);
  
  const dollarPrice = (product.price / settings.exchangeRate).toFixed(2);
  
  const handleReserveClick = () => {
    setShowReservationForm(true);
  };
  
  const handleSubmitReservation = () => {
    if (!customerName || !customerPhone) {
      toast.error(t('product.nameRequired'));
      return;
    }
    
    reserveProduct(product.id, customerName, customerPhone);
    setShowReservationForm(false);
    
    // Construct WhatsApp message with language support
    const messageTemplate = t('whatsapp.reservationMessage');
    const message = encodeURIComponent(
      messageTemplate
        .replace('{reference}', product.reference)
        .replace('{name}', product.name)
        .replace('{price}', product.price.toString())
        .replace('{dollarPrice}', dollarPrice)
        .replace('{customerName}', customerName)
        .replace('{customerPhone}', customerPhone)
    );
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}?text=${message}`, '_blank');
  };
  
  const renderStatusRibbon = () => {
    let bgColor = "bg-green-500";
    let text = t('product.available');
    
    if (product.status === "reserved") {
      bgColor = "bg-yellow-500";
      text = t('product.reserved');
    } else if (product.status === "sold") {
      bgColor = "bg-red-500";
      text = t('product.sold');
    }
    
    return (
      <div className="status-ribbon">
        <div className={`status-ribbon-content ${bgColor} animate-ribbon-wave`}>
          {text}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-boutique-accent">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="product-image-container">
                  <img 
                    src={image} 
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        {renderStatusRibbon()}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{t('product.reference')}: {product.reference}</p>
        <h3 className="text-xl font-serif font-semibold text-boutique-dark mb-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-boutique-primary text-lg">C$ {product.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500">($ {dollarPrice})</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        
        {product.status === "available" ? (
          !showReservationForm ? (
            <Button 
              onClick={handleReserveClick}
              className="w-full bg-boutique-primary hover:bg-boutique-dark"
            >
              {t('product.reserveNow')}
            </Button>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <input
                type="text"
                placeholder={t('product.yourName')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder={t('product.yourPhone')}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowReservationForm(false)}
                  variant="outline" 
                  className="flex-1"
                >
                  {t('product.cancel')}
                </Button>
                <Button 
                  onClick={handleSubmitReservation}
                  className="flex-1 bg-boutique-primary hover:bg-boutique-dark"
                >
                  {t('product.confirm')}
                </Button>
              </div>
            </div>
          )
        ) : (
          <Button disabled className="w-full bg-gray-300 cursor-not-allowed">
            {product.status === "reserved" ? t('product.reserved') : t('product.sold')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
