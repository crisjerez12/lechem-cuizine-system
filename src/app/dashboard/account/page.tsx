"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditCredentialDialog } from "@/components/edit-credential-dialog";
import { getUserCredentials, updateCredential } from "@/actions/account";
import { toast } from "sonner";
type Credential = {
  fullName: string;
  email: string | undefined;
};
export default function Account() {
  const [openDialog, setOpenDialog] = useState<
    "display_name" | "email" | "password" | null
  >(null);
  const [userInfo, setUserInfo] = useState<Credential>({
    fullName: "",
    email: "",
  });

  const handleEdit = (field: "display_name" | "email" | "password") => {
    setOpenDialog(field);
  };
  useEffect(() => {
    async function fetchCredentials() {
      const res = await getUserCredentials();
      if (!res.success) toast.error("Failed to fetch current Credentials");
      setUserInfo(res.data);
    }
    fetchCredentials();
  }, []);

  const handleUpdate = async (field: string, value: string) => {
    try {
      await updateCredential(field, value);
      setUserInfo((prev) => ({ ...prev, [field]: value }));
      setOpenDialog(null);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-white/70 backdrop-blur-lg shadow-lg border-emerald-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credential</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>{userInfo.fullName}</TableCell>
                <TableCell>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-xl h-12 font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                    onClick={() => handleEdit("display_name")}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>{userInfo.email}</TableCell>
                <TableCell>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-xl h-12 font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                    onClick={() => handleEdit("email")}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Password</TableCell>
                <TableCell>********</TableCell>
                <TableCell>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-xl h-12 font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                    onClick={() => handleEdit("password")}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditCredentialDialog
        open={openDialog !== null}
        onOpenChange={() => setOpenDialog(null)}
        credentialType={openDialog}
        onSubmit={(value) => handleUpdate(openDialog!, value)}
      />
    </div>
  );
}
