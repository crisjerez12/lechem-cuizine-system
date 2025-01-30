"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Info,
  Trash2,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  addToReservations,
  deleteLapsedReservations,
  deleteOnlineReservation,
  getOnlineReservations,
} from "@/actions/online";
import type { Reservation } from "@/lib/types/reservationType";

export default function Online() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchReservation() {
      const { data, error } = await getOnlineReservations();
      if (error) return;
      setReservations(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    }
    fetchReservation();
  }, []);

  const handleDeleteLapsedDates = async () => {
    const res = await deleteLapsedReservations();
    if (!res?.success || res.data === null) {
      toast.error("Something Went Wrong");
      return;
    }
    setReservations(res.data);
    setTotalPages(Math.ceil(res.data.length / itemsPerPage));
    toast.success("Lapsed reservations deleted successfully");
  };

  const handleDelete = async (reservationId: number) => {
    const res = await deleteOnlineReservation(reservationId);
    if (!res.success) {
      toast.error("Reservation failed to delete");
    } else {
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
      setTotalPages(Math.ceil((reservations.length - 1) / itemsPerPage));
      setShowDeleteDialog(false);
      toast.success("Reservation deleted successfully");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReservations = reservations.filter((reservation) =>
    reservation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddReservation = async (reservation: Reservation | null) => {
    const res = await addToReservations(reservation);
    if (!res.success) toast.error("Failed to Add Reservation");
    toast.success("Successfully Added to the Official Reservations");
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/70 backdrop-blur-lg p-4 rounded-lg">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleDeleteLapsedDates}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Lapsed
          </Button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50">
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Mobile Number
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell">
                  Amount Due
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">
                    {reservation.id}
                  </TableCell>
                  <TableCell>{reservation.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {reservation.mobile_number}
                  </TableCell>
                  <TableCell>{reservation.location}</TableCell>
                  <TableCell>
                    {formatDate(reservation.reservation_date)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    &#8369; {reservation.total_price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowInfoDialog(true);
                        }}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-orange-500"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowAddDialog(true);
                        }}
                      >
                        <CalendarPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold border-b-emerald-950 border-b-2 pb-2">
              Reservation Details
            </DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Selected Package:</h4>
                <p>{selectedReservation.package}</p>
              </div>
              <div>
                <h4 className="font-semibold">Expected Guest:</h4>
                <p>{selectedReservation.pax}</p>
              </div>
              <div>
                <h4 className="font-semibold">Created At:</h4>
                <p>{formatDate(selectedReservation.created_at)}</p>
              </div>{" "}
              <div>
                <h4 className="font-semibold">Allergies/Notes:</h4>
                <p>{selectedReservation.notes}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reservation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedReservation && handleDelete(selectedReservation.id)
              }
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Reservations</DialogTitle>
            <DialogDescription>
              This will add the online reservation to your confirmed
              reservations list.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
              onClick={() => {
                handleAddReservation(selectedReservation);
                setShowAddDialog(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
