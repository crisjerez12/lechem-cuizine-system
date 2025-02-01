import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Reservation } from "@/lib/types/reservationType";
import { getReservations } from "@/actions/reservations";
import { toast } from "sonner";

// Define styles for PDF
const styles = StyleSheet.create({
  page: { padding: 30, flexDirection: "column" },
  title: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: {
    width: "11.11%",
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "11.11%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 500 },
  tableCell: { margin: 5, fontSize: 8 },
});

// PDF Document component
const ReservationsPDF: React.FC<{
  reservations: Reservation[];
  startDate: string;
  endDate: string;
}> = ({ reservations, startDate, endDate }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text
        style={styles.title}
      >{`Reservations (${startDate} - ${endDate})`}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {[
            "ID",
            "Name",
            "Location",
            "Mobile",
            "Date",
            "Price",
            "Pax",
            "Package",
            "Type",
          ].map((header) => (
            <View style={styles.tableColHeader} key={header}>
              <Text style={styles.tableCellHeader}>{header}</Text>
            </View>
          ))}
        </View>
        {reservations.map((reservation) => (
          <View style={styles.tableRow} key={reservation.id}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{reservation.id}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{reservation.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{reservation.location}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{reservation.mobile_number}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Date(reservation.reservation_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {reservation.total_price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{reservation.pax}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{reservation.package}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{reservation.type}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const DownloadReservations: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const { success, data, error } = await getReservations(
        1,
        1000,
        startDate,
        endDate
      );
      if (!success || error) {
        toast.error("Failed to fetch reservations");
      }
      if (!data.length) toast.error("No existing reservations on this date");
      setReservations(data || []);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Download Reservations</Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Reservations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {isLoading ? (
              <Button className="bg-orange-400 hover:bg-orange-700" disabled>
                Loading...
              </Button>
            ) : reservations.length > 0 ? (
              <PDFDownloadLink
                document={
                  <ReservationsPDF
                    reservations={reservations}
                    startDate={startDate}
                    endDate={endDate}
                  />
                }
                fileName={`Reservations_${startDate}_${
                  endDate ? endDate : "onwards"
                }.pdf`}
              >
                <Button className="bg-orange-400 hover:bg-orange-700 mt-4">
                  Download PDF
                </Button>
              </PDFDownloadLink>
            ) : (
              <Button
                className="bg-emerald-400 hover:bg-emerald-700"
                onClick={handleDownload}
                disabled={startDate === "" || endDate === ""}
              >
                Generate PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DownloadReservations;
