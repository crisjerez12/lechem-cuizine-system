"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Reservation {
  reservationId: string;
  name: string;
  time: string;
  amountDue: number;
}

interface DateStatus {
  date: string;
  isOpen: boolean;
  reservation: Reservation | null;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateStatuses, setDateStatuses] = useState<{
    [key: string]: DateStatus;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Calculate the days in the current month
  const daysInMonth = useMemo(() => {
    console.log(isLoading);
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Mock function to simulate fetching date statuses
  const fetchDateStatuses = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const statuses: { [key: string]: DateStatus } = {};
      daysInMonth.forEach((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const hasReservation = Math.random() > 0.7;

        statuses[dateStr] = {
          date: dateStr,
          isOpen: !hasReservation && date >= new Date(),
          reservation: hasReservation
            ? {
                reservationId: `${dateStr}-1`,
                name: `Guest Reservation`,
                time: `${Math.floor(Math.random() * 12 + 9)}:00`,
                amountDue: Math.floor(Math.random() * 500 + 100),
              }
            : null,
        };
      });
      setDateStatuses(statuses);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch calendar data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDateStatuses();
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleToggleStatus = async (date: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setDateStatuses((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          isOpen: !prev[date].isOpen,
        },
      }));

      toast.success(
        `Status updated for ${format(new Date(date), "MMM dd, yyyy")}`
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update date status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-lg p-4 rounded-lg">
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

      <div className="grid grid-cols-1  gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {daysInMonth.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const status = dateStatuses[dateStr];
            const hasReservation = status?.reservation !== null;

            return (
              <Card
                key={dateStr}
                className={`
                  cursor-pointer transition-all duration-200
                 
                  ${date < new Date() ? "opacity-50" : ""}
                  ${status?.isOpen ? "bg-emerald-50" : "bg-white/70"}
                `}
                onClick={() => date >= new Date()}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {format(date, "MMM dd")}
                      </span>
                      {date >= new Date() && (
                        <Switch
                          checked={status?.isOpen ?? false}
                          onCheckedChange={() => handleToggleStatus(dateStr)}
                          className="data-[state=checked]:bg-emerald-500"
                          disabled={hasReservation}
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {hasReservation ? "1 reservation" : "Available"}
                    </div>
                    <div
                      className={`h-1 rounded-full ${
                        date < new Date()
                          ? "bg-gray-300"
                          : status?.isOpen
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
