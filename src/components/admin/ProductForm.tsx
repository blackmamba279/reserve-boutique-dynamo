
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Product } from "@/models/types";
import { toast } from "@/components/ui/sonner";

interface ProductFormProps {
  initialProduct?: Product;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm = ({ initialProduct, onSave, onCancel }: ProductFormProps) => {
  const { categories, addProduct, updateProduct } = useApp();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState("");
  
  // Initialize form with product data if editing
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setPrice(initialProduct.price.toString());
      setDescription(initialProduct.description);
      setCategoryId(initialProduct.categoryId);
      setImages(initialProduct.images);
    }
  }, [initialProduct]);

  const handleAddImage = () => {
    if (!newImage) return;
    
    setImages([...images, newImage]);
    setNewImage("");
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages([...images, event.target.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !description || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (images.length < 4) {
      toast.error("Please add at least 4 images");
      return;
    }
    
    const productData = {
      name,
      price: parseFloat(price),
      description,
      categoryId,
      images,
      status: "available" as const
    };
    
    if (initialProduct) {
      updateProduct(initialProduct.id, productData);
    } else {
      addProduct(productData);
    }
    
    onSave();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price (C$)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Images (at least 4 required)</Label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img 
                src={img} 
                alt={`Product ${index}`} 
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Add Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Enter image URL"
              />
              <Button 
                type="button" 
                onClick={handleAddImage}
                variant="outline"
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageFile">Or Upload Image</Label>
            <Input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-boutique-primary hover:bg-boutique-dark">
          {initialProduct ? "Update" : "Create"} Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
