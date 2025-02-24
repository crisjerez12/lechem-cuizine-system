"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Info,
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  reservationSchema,
  type Reservation,
  type ReservationForm,
} from "@/lib/types/reservationType";
import {
  getReservations,
  addReservation,
  updateReservation,
  deleteReservation,
} from "@/actions/reservations";
import DownloadReservations from "@/components/DownloadReservations";
import { Checkbox } from "@/components/ui/checkbox";

export default function Reservations() {
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPastReservations, setShowPastReservations] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    const { success, data, count, error } = await getReservations(currentPage);
    if (!success || error) {
      toast.error("Failed to fetch reservations");
      return;
    }
    setReservations(data || []);
    if (count !== null) {
      setTotalPages(Math.ceil(count / 10));
    }
  }

  const onSubmit = async (data: ReservationForm) => {
    setShowAddDialog(false);
    try {
      const reservationData = {
        ...data,
        type: "Walk-in",
      };
      const { success, reservation, error } = await addReservation(
        reservationData
      );
      if (success && reservation) {
        setReservations((prev) => [reservation, ...prev.slice(0, 9)]);
        toast.success("Reservation added successfully");
        reset();
        fetchReservations();
      } else {
        toast.error(`Failed to save reservation: ${error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save reservation");
    }
  };

  const handleDelete = async (reservationId: number) => {
    const { success, error } = await deleteReservation(reservationId);
    if (success) {
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      setShowDeleteDialog(false);
      toast.success("Reservation deleted successfully");
      fetchReservations();
    } else {
      toast.error(`Failed to delete reservation: ${error}`);
    }
  };

  const handleUpdate = async (data: ReservationForm) => {
    if (!selectedReservation) return;
    setShowEditDialog(false);

    try {
      const { success, reservation, error } = await updateReservation(
        selectedReservation.id,
        data
      );
      if (success && reservation) {
        setReservations((prev) =>
          prev.map((r) => (r.id === selectedReservation.id ? reservation : r))
        );
        toast.success("Reservation updated successfully");
        reset();
        fetchReservations();
      } else {
        toast.error(`Failed to update reservation: ${error}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update reservation");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReservations = reservations
    .filter((reservation) => {
      const reservationDate = new Date(reservation.reservation_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return (
        (showPastReservations || reservationDate >= today) &&
        reservation.name.toLowerCase().includes(searchName.toLowerCase()) &&
        reservation.location
          .toLowerCase()
          .includes(searchLocation.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.reservation_date).getTime();
      const dateB = new Date(b.reservation_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const ReservationDialog = ({ isEdit = false }) => {
    return (
      <Dialog
        open={isEdit ? showEditDialog : showAddDialog}
        onOpenChange={(open) => {
          if (!open) {
            reset();
          }
          isEdit ? setShowEditDialog(open) : setShowAddDialog(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[60vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Reservation" : "Add New Reservation"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(isEdit ? handleUpdate : onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  {...register("name")}
                  defaultValue={selectedReservation?.name}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile</label>
                <Input
                  {...register("mobile_number")}
                  type="number"
                  defaultValue={selectedReservation?.mobile_number || "639"}
                  max={639999999999}
                  min={639000000000}
                  pattern="\63[0-9]{9}"
                  placeholder="639XXXXXXXXX"
                />
                {errors.mobile_number && (
                  <p className="text-sm text-red-500">
                    {errors.mobile_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  {...register("location")}
                  defaultValue={selectedReservation?.location}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Package</label>
                <Input
                  {...register("package")}
                  defaultValue={selectedReservation?.package}
                />
                {errors.package && (
                  <p className="text-sm text-red-500">
                    {errors.package.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reservation Date</label>
                <Input
                  type="date"
                  {...register("reservation_date")}
                  min={new Date().toISOString().split("T")[0]}
                  defaultValue={
                    selectedReservation?.reservation_date
                      ? new Date(selectedReservation.reservation_date)
                          .toISOString()
                          .split("T")[0]
                      : undefined
                  }
                />
                {errors.reservation_date && (
                  <p className="text-sm text-red-500">
                    {errors.reservation_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Due</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("total_price", { valueAsNumber: true })}
                  defaultValue={selectedReservation?.total_price}
                />
                {errors.total_price && (
                  <p className="text-sm text-red-500">
                    {errors.total_price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Guests</label>
                <Input
                  type="number"
                  {...register("pax", { valueAsNumber: true })}
                  defaultValue={selectedReservation?.pax}
                />
                {errors.pax && (
                  <p className="text-sm text-red-500">{errors.pax.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                {...register("notes")}
                defaultValue={selectedReservation?.notes}
                className="w-full h-24 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Food Choices</label>
              <textarea
                {...register("choices")}
                defaultValue={selectedReservation?.choices}
                className="w-full h-24 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  isEdit ? setShowEditDialog(false) : setShowAddDialog(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
              >
                {isEdit ? "Save Changes" : "Add Reservation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-4 relative min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/70 backdrop-blur-lg p-4 rounded-lg">
        <div className="flex items-center  gap-x-2">
          <Checkbox
            id="showPastReservations"
            checked={showPastReservations}
            onCheckedChange={(checked) =>
              setShowPastReservations(checked === true)
            }
          />
          <label
            htmlFor="showPastReservations"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show past reservations
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Input
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="max-w-xs"
          />
          <Button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
          onClick={() => {
            setSelectedReservation(null);
            setShowAddDialog(true);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Reservation
        </Button>
        <DownloadReservations />
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
              {filteredReservations.map((reservation) => (
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
                    &#8369;{reservation.total_price.toLocaleString()}
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
                          setShowEditDialog(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
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
              </div>
              <div>
                <h4 className="font-semibold">Allergies/Notes:</h4>
                <p>{selectedReservation.notes}</p>
              </div>
              <div>
                <h4 className="font-semibold">Food Choices:</h4>
                <p>{selectedReservation.choices}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this reservation? This action cannot
            be undone.
          </p>
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

      <ReservationDialog isEdit={false} />
      <ReservationDialog isEdit={true} />
    </div>
  );
}
