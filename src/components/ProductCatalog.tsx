
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import ProductCard from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";

const ProductCatalog = () => {
  const { products, categories } = useApp();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = 
      searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    
    // Filter by status
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-card p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">{t('catalog.searchProducts')}</Label>
            <Input
              id="search"
              type="text"
              placeholder={t('catalog.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="category">{t('catalog.category')}</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder={t('catalog.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('catalog.allCategories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">{t('catalog.status')}</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder={t('catalog.allStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('catalog.allStatus')}</SelectItem>
                <SelectItem value="available">{t('product.available')}</SelectItem>
                <SelectItem value="reserved">{t('product.reserved')}</SelectItem>
                <SelectItem value="sold">{t('product.sold')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-muted-foreground">{t('catalog.noProducts')}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
