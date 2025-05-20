
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Phone } from "lucide-react";
import { Reservation } from "@/models/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const ReservationsPage = () => {
  const { reservations, products, completeReservation, cancelReservation } = useApp();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleCompleteReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsCompleteDialogOpen(true);
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsCancelDialogOpen(true);
  };

  const confirmCompleteReservation = () => {
    if (selectedReservation) {
      try {
        completeReservation(selectedReservation.id);
        toast.success("Reservation completed successfully");
      } catch (error) {
        console.error("Error completing reservation:", error);
        toast.error("Failed to complete reservation");
      }
    }
    setIsCompleteDialogOpen(false);
  };

  const confirmCancelReservation = () => {
    if (selectedReservation) {
      try {
        // Ensure we're passing a valid UUID string
        if (typeof selectedReservation.id !== 'string' || !selectedReservation.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          console.error("Invalid UUID format:", selectedReservation.id);
          toast.error("Invalid reservation ID format");
          return;
        }
        
        cancelReservation(selectedReservation.id);
        toast.success("Reservation cancelled successfully");
      } catch (error) {
        console.error("Error cancelling reservation:", error);
        toast.error("Failed to cancel reservation");
      }
    }
    setIsCancelDialogOpen(false);
  };

  const openWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\+/g, '')}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const getProductInfo = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  // Filter reservations to show pending first, then completed, then cancelled
  const sortedReservations = [...reservations].sort((a, b) => {
    const statusOrder = { pending: 0, completed: 1, cancelled: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reservations</h1>
        <p className="text-gray-500">Manage customer reservations</p>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No reservations found</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReservations.map(reservation => {
                const product = getProductInfo(reservation.productId);
                return (
                  <TableRow key={reservation.id}>
                    <TableCell>{formatDate(reservation.reservationDate)}</TableCell>
                    <TableCell>
                      {product ? (
                        <div className="flex flex-col">
                          <span className="font-semibold">{product.name}</span>
                          <span className="text-xs text-gray-500">{product.reference}</span>
                        </div>
                      ) : (
                        "Unknown Product"
                      )}
                    </TableCell>
                    <TableCell>
                      {product ? `C$ ${product.price.toLocaleString()}` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{reservation.customerName}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>{reservation.customerPhone}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-boutique-primary"
                            onClick={() => openWhatsApp(reservation.customerPhone)}
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell>
                      {reservation.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCompleteReservation(reservation)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelReservation(reservation)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Complete Reservation Dialog */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the reservation as completed and the product as sold.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCompleteReservation}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Reservation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the reservation and make the product available again.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelReservation}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReservationsPage;
