
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesPage = () => {
  const { salesReport } = useApp();
  const [periodTab, setPeriodTab] = useState("weekly");
  
  const formatCurrency = (value: number | string): string => {
    // Convert to number if it's a string, or use as is if already a number
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    // Check if it's a valid number
    if (isNaN(numericValue)) return 'C$ 0';
    return `C$ ${numericValue.toLocaleString()}`;
  };
  
  // Function to get appropriate data based on selected period
  const getChartData = () => {
    switch (periodTab) {
      case "daily":
        return salesReport.daily;
      case "weekly":
        return salesReport.weekly;
      case "monthly":
        return salesReport.monthly;
      case "yearly":
        return salesReport.yearly;
      default:
        return salesReport.weekly;
    }
  };
  
  // Calculate total sales and average
  const currentData = getChartData();
  const totalSales = currentData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalCount = currentData.reduce((sum, item) => sum + item.count, 0);
  const averageSale = totalCount > 0 ? totalSales / totalCount : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sales Analytics</h1>
        <p className="text-gray-500">Track sales performance over time</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              Based on {periodTab} data
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              Total products sold
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageSale)}</div>
            <p className="text-xs text-muted-foreground">
              Per product
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            Track sales performance over different time periods
          </CardDescription>
          <Tabs value={periodTab} onValueChange={setPeriodTab}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => formatCurrency(value as number | string)} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#8884d8"
                  name="Sales Amount"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="count"
                  stroke="#82ca9d"
                  name="Units Sold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Comparison</CardTitle>
          <CardDescription>
            Compare sales and units sold
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === "totalSales") return formatCurrency(value as number | string);
                  return value;
                }}/>
                <Legend />
                <Bar dataKey="totalSales" name="Sales Amount" fill="#8884d8" />
                <Bar dataKey="count" name="Units Sold" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
