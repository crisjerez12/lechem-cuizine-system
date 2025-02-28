"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSaturday,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getCalendarData } from "@/actions/calendar";
import type { DateType } from "@/lib/types/calendar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Reservation = {
  reservation_date: Date;
  name: string;
  location: string;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateType>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const fetchDateStatuses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCalendarData();
      setReservations(data);

      const statuses: Record<string, DateType> = {};
      daysInMonth.forEach((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const reservationsCount = data.filter(
          (reservation) =>
            format(reservation.reservation_date, "yyyy-MM-dd") === dateStr
        ).length;
        statuses[dateStr] = {
          date: dateStr,
          isOpen: !isSaturday(date) && date >= new Date(),
          reservationsCount,
        };
      });
      setDateStatuses(statuses);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch calendar data");
    } finally {
      setIsLoading(false);
    }
  }, [daysInMonth]);

  useEffect(() => {
    fetchDateStatuses();
  }, [fetchDateStatuses]);

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleDateClick = (dateStr: string) => {
    const status = dateStatuses[dateStr];
    if (status && status.reservationsCount > 0) {
      setSelectedDate(dateStr);
      setIsDialogOpen(true);
    }
  };

  const selectedReservations = useMemo(() => {
    if (!selectedDate) return [];
    return reservations.filter(
      (reservation) =>
        format(reservation.reservation_date, "yyyy-MM-dd") === selectedDate
    );
  }, [selectedDate, reservations]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-background/70 backdrop-blur-lg p-4 rounded-lg">
        <Button variant="outline" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button variant="outline" onClick={handleNextMonth}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {daysInMonth.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const status = dateStatuses[dateStr];
            const hasReservation = status?.reservationsCount > 0;
            const isClosed = isSaturday(date) || !status?.isOpen;

            return (
              <Card
                key={dateStr}
                className={cn(
                  "transition-all duration-200 cursor-pointer",
                  date < new Date() && "opacity-20",
                  isClosed
                    ? "bg-red-600 text-white"
                    : hasReservation
                    ? "bg-orange-600 text-white"
                    : "bg-emerald-600 text-white"
                )}
                onClick={() => handleDateClick(dateStr)}
              >
                <CardHeader className="p-2 bg-muted">
                  <div className="text-sm font-semibold text-muted-foreground text-black ">
                    {format(date, "EEEE")}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-lg">
                      {format(date, "dd")}
                    </span>
                    <div className="text-sm text-muted-foreground text-white">
                      {isSaturday(date)
                        ? "Closed"
                        : hasReservation
                        ? `Reserved (${status.reservationsCount})`
                        : isClosed
                        ? "Closed"
                        : "Available"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservations for {selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {selectedReservations.map((reservation, index) => (
              <div key={index} className="mb-2 p-2 bg-muted rounded-md">
                <p>
                  <strong>Name:</strong> {reservation.name}
                </p>
                <p>
                  <strong>Location:</strong> {reservation.location}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
