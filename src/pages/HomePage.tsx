
import Header from "@/components/Header";
import ProductCatalog from "@/components/ProductCatalog";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-boutique-light">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductCatalog />
      </main>
    </div>
  );
};

export default HomePage;
