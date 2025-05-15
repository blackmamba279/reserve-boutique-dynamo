
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const ReportsPage = () => {
  const { products, customerReport } = useApp();
  
  // Product status distribution data
  const productStatusData = [
    { name: "Available", value: products.filter(p => p.status === "available").length },
    { name: "Reserved", value: products.filter(p => p.status === "reserved").length },
    { name: "Sold", value: products.filter(p => p.status === "sold").length },
  ];
  
  // Category distribution data
  const categoryData = products.reduce((acc, product) => {
    const category = acc.find(c => c.id === product.categoryId);
    if (category) {
      category.count += 1;
    } else {
      acc.push({ id: product.categoryId, name: `Category ${product.categoryId}`, count: 1 });
    }
    return acc;
  }, [] as { id: string; name: string; count: number }[]);
  
  // Customer data
  const customerData = [
    { name: "New Customers", value: customerReport.newCustomers },
    { name: "Returning Customers", value: customerReport.returningCustomers },
  ];
  
  // Top products data for bar chart
  const topProductsData = customerReport.topProducts.map(item => ({
    name: item.productName.length > 15 
      ? item.productName.substring(0, 15) + "..." 
      : item.productName,
    reservations: item.count
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Customer Reports</h1>
        <p className="text-gray-500">Analysis of customer data and product performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Overview</CardTitle>
            <CardDescription>
              New vs returning customers
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {customerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
            <CardDescription>
              Distribution of product availability
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {productStatusData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? "#82ca9d" : index === 1 ? "#ffc658" : "#ff8042"} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Most popular products by reservation count
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Products by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
