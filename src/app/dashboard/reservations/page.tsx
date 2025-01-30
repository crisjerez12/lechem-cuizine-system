"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Info, Pencil, Trash2, Plus, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Reservation } from "@/lib/types/reservationType";
import { getReservations } from "@/actions/reservations";

const reservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z
    .string()
    .regex(/^\+639\d{9}$/, "Mobile number must be in format: +639XXXXXXXXX"),
  location: z.string().min(1, "Location is required"),
  package: z.string().optional(),
  notes: z.string().optional(),
  pax: z.number(),
  reservationDate: z.string().min(1, "Date is required"),
  amountDue: z.number().min(0, "Amount must be positive"),
});

type ReservationForm = z.infer<typeof reservationSchema>;

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

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  });
  useEffect(() => {
    async function fetchReservation() {
      const { data, error } = await getReservations();
      if (error) return;
      setReservations(data);
    }
    fetchReservation();
  }, []);
  const onSubmit = async (data: ReservationForm) => {
    console.log(data);
    try {
      toast.success("Reservation added successfully");
      setShowEditDialog(false);
      setShowAddDialog(false);
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save reservation");
    }
  };

  const handleDelete = (reservationId: number) => {
    setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    setShowDeleteDialog(false);
    toast.success("Reservation deleted successfully");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReservations = reservations
    .filter(
      (reservation) =>
        reservation.name.toLowerCase().includes(searchName.toLowerCase()) &&
        reservation.location
          .toLowerCase()
          .includes(searchLocation.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.reservation_date).getTime();
      const dateB = new Date(b.reservation_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const ReservationDialog = ({ isEdit = false }) => (
    <Dialog
      open={isEdit ? showEditDialog : showAddDialog}
      onOpenChange={isEdit ? setShowEditDialog : setShowAddDialog}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Reservation" : "Add New Reservation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register("mobile")}
                defaultValue={selectedReservation?.mobile_number || "+639"}
                placeholder="+639XXXXXXXXX"
              />
              {errors.mobile && (
                <p className="text-sm text-red-500">{errors.mobile.message}</p>
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
              <label className="text-sm font-medium">Reservation Date</label>
              <Input
                type="date"
                {...register("reservationDate")}
                defaultValue={
                  selectedReservation?.reservation_date.split("Z")[0]
                }
              />
              {errors.reservationDate && (
                <p className="text-sm text-red-500">
                  {errors.reservationDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Due</label>
              <Input
                type="number"
                step="0.01"
                {...register("amountDue", { valueAsNumber: true })}
                defaultValue={selectedReservation?.total_price}
              />
              {errors.amountDue && (
                <p className="text-sm text-red-500">
                  {errors.amountDue.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expected Guests</label>
              <Input
                type="number"
                step="0.01"
                {...register("pax", { valueAsNumber: true })}
                defaultValue={selectedReservation?.pax}
              />
              {errors.pax && (
                <p className="text-sm text-red-500">{errors.pax.message}</p>
              )}
            </div>
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

  return (
    <div className="space-y-4 relative min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/70 backdrop-blur-lg p-4 rounded-lg">
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

      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Created At:</h4>
                <p>{formatDate(selectedReservation.created_at)}</p>
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

      <ReservationDialog isEdit={true} />
      <ReservationDialog isEdit={false} />

      <Button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-full shadow-lg"
        size="lg"
        onClick={() => {
          setSelectedReservation(null);
          setShowAddDialog(true);
        }}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Reservation
      </Button>
    </div>
  );
}
