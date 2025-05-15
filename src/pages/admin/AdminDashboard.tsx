
import { useApp } from "@/context/AppContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ShoppingBag, 
  CalendarClock, 
  Users, 
  DollarSign,
  Package
} from "lucide-react";

const AdminDashboard = () => {
  const { products, reservations, customerReport } = useApp();
  
  const availableProducts = products.filter(p => p.status === "available").length;
  const reservedProducts = products.filter(p => p.status === "reserved").length;
  const soldProducts = products.filter(p => p.status === "sold").length;
  const pendingReservations = reservations.filter(r => r.status === "pending").length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome to the admin dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {availableProducts} available, {reservedProducts} reserved, {soldProducts} sold
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reservations</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReservations}</div>
            <p className="text-xs text-muted-foreground">
              {pendingReservations} products waiting for processing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerReport.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {customerReport.newCustomers} new, {customerReport.returningCustomers} returning
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reserved Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              C$ {products
                .filter(p => p.status === "reserved")
                .reduce((sum, product) => sum + product.price, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {reservedProducts} products reserved
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
            <CardDescription>
              Latest product reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reservations yet</p>
            ) : (
              <div className="space-y-4">
                {reservations
                  .filter(r => r.status === "pending")
                  .slice(0, 5)
                  .map(reservation => {
                    const product = products.find(p => p.id === reservation.productId);
                    return (
                      <div key={reservation.id} className="flex items-center">
                        <Package className="h-9 w-9 text-muted-foreground mr-3" />
                        <div className="flex-1 space-y-1">
                          <p className="font-medium leading-none">
                            {product?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reserved by {reservation.customerName} • {new Date(reservation.reservationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="font-medium">
                          C$ {product?.price.toLocaleString() || "N/A"}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Most popular products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerReport.topProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No data available</p>
            ) : (
              <div className="space-y-4">
                {customerReport.topProducts.map((item, index) => (
                  <div key={item.productId} className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">
                        {item.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.count} {item.count === 1 ? 'reservation' : 'reservations'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
