
import { useApp } from "@/context/AppContext";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./HomePage";

const Index = () => {
  return (
    <>
      <HomePage />
      <Toaster />
    </>
  );
};

export default Index;
