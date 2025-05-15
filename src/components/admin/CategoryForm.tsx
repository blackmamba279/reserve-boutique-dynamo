
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/models/types";
import { toast } from "@/components/ui/sonner";

interface CategoryFormProps {
  initialCategory?: Category;
  onSave: () => void;
  onCancel: () => void;
}

const CategoryForm = ({ initialCategory, onSave, onCancel }: CategoryFormProps) => {
  const { addCategory, updateCategory } = useApp();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  
  // Initialize form with category data if editing
  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setCode(initialCategory.code);
    }
  }, [initialCategory]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !code) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (code.length < 2 || code.length > 4) {
      toast.error("Code must be between 2-4 characters");
      return;
    }
    
    const categoryData = {
      name,
      code: code.toUpperCase()
    };
    
    if (initialCategory) {
      updateCategory(initialCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    
    onSave();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="code">
          Category Code (2-4 characters, used for reference numbers)
        </Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. DRS, TOP"
          maxLength={4}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-boutique-primary hover:bg-boutique-dark">
          {initialCategory ? "Update" : "Create"} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
