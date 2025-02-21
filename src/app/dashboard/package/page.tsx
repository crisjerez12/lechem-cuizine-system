"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Info, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { CateringItem } from "@/lib/types/cateringType";
import {
  addCateringItem,
  deleteCateringItem,
  getOffers,
  updateCateringItem,
} from "@/actions/offers";
import Image from "next/image";
import Loading from "../loading";

export default function Packages() {
  const [packages, setPackages] = useState<CateringItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInclusions, setShowInclusions] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CateringItem | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);
  const [newPackage, setNewPackage] = useState<Omit<CateringItem, "id">>({
    title: "",
    description: "",
    attributes: [],
    foods: [],
    desserts: [],
    price: 0,
    min_price: 0,
    image: "",
  });
  const [newAttribute, setNewAttribute] = useState("");
  const [newFood, setNewFood] = useState("");
  const [newDessert, setNewDessert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const data = await getOffers();
        if (data) setPackages(data);
      } catch (error) {
        toast.error("Failed to fetch packages");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleAddItem = async () => {
    setIsSubmitting(true);
    try {
      const result = await addCateringItem(newPackage);
      if (result.success) {
        setPackages([...packages, result.item]);
        setShowAddDialog(false);
        setNewPackage({
          title: "",
          description: "",
          attributes: [],
          foods: [],
          desserts: [],
          price: 0,
          min_price: 0,
          image: "",
        });
        toast.success("Package added successfully");
      }
    } catch (error) {
      toast.error("Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          if (showAddDialog) {
            setNewPackage({ ...newPackage, image: base64String });
          } else if (selectedPackage) {
            setSelectedPackage({ ...selectedPackage, image: base64String });
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file (JPG, JPEG, or PNG)");
      }
    }
  };
  const handleUpdateItem = async () => {
    if (!selectedPackage?.id) return;
    setIsSubmitting(true);
    try {
      const result = await updateCateringItem(
        selectedPackage.id.toString(),
        selectedPackage
      );
      if (result.success) {
        setShowEditDialog(false);
        setSelectedPackage(null);
        toast.success("Package updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedPackage?.id) return;
    try {
      const result = await deleteCateringItem(selectedPackage.id.toString());
      if (result.success) {
        setPackages(packages.filter((pkg) => pkg.id !== selectedPackage.id));
        setShowDeleteDialog(false);
        setSelectedPackage(null);
        toast.success("Package deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading && <Loading />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className="overflow-hidden flex flex-col h-[400px]"
          >
            <div className="relative h-48">
              <Image
                src={pkg.image || "/placeholder.svg?height=200&width=400"}
                alt={pkg.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold">{pkg.title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                <Button
                  className="p-0 h-auto font-bold text-white   bg-orange-400  px-2 py-1 hover:bg-orange-500"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowDescription(true);
                  }}
                >
                  Show description
                </Button>
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  className="p-0 h-auto font-bold text-white  px-2 py-1 bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowInclusions(true);
                  }}
                >
                  Show attributes
                </Button>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowInclusions(true);
                  }}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2"
                >
                  <Info className="w-4 h-4 mr-1" />
                  This package includes
                </button>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ₱{pkg.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Starting from ₱{pkg.min_price.toLocaleString()}
                    </div>
                  </div>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setShowEditDialog(true);
                    }}
                  >
                    Edit Package
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600"
        size="lg"
        onClick={() => setShowAddDialog(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Package
      </Button>

      <Dialog open={showInclusions} onOpenChange={setShowInclusions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedPackage?.title} Inclusions
            </DialogTitle>
          </DialogHeader>
          {/* Replace the existing content with this scrollable version */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div>
              <h3 className="font-bold mb-2">Attributes:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPackage?.attributes.map((attr, index) => (
                  <li key={index}>{attr}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Foods:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPackage?.foods.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Desserts:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPackage?.desserts.map((dessert, index) => (
                  <li key={index}>{dessert}</li>
                ))}
              </ul>
            </div>
          </div>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 mt-4"
            onClick={() => setShowInclusions(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showDescription} onOpenChange={setShowDescription}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedPackage?.title} Description
            </DialogTitle>
          </DialogHeader>
          <p>{selectedPackage?.description}</p>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 mt-4"
            onClick={() => setShowDescription(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAddDialog || showEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setShowEditDialog(false);
            setSelectedPackage(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showAddDialog ? "Add New Package" : "Edit Package"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 ">
            <div className="space-y-4 ">
              <div>
                <label
                  htmlFor="image-upload"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept=".jpg,.jpeg,.png"
                  disabled={showEditDialog}
                  onChange={(e) => {
                    handleFileChange(e);
                    setFile(e.target.files ? e.target.files[0] : null);
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                {file && (
                  <p className="mt-1 text-sm text-gray-500">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
              <Input
                placeholder="Title"
                value={
                  showAddDialog
                    ? newPackage.title
                    : selectedPackage?.title || ""
                }
                onChange={(e) =>
                  showAddDialog
                    ? setNewPackage({ ...newPackage, title: e.target.value })
                    : setSelectedPackage((prev) =>
                        prev ? { ...prev, title: e.target.value } : prev
                      )
                }
              />
              <Textarea
                placeholder="Description"
                value={
                  showAddDialog
                    ? newPackage.description
                    : selectedPackage?.description || ""
                }
                onChange={(e) =>
                  showAddDialog
                    ? setNewPackage({
                        ...newPackage,
                        description: e.target.value,
                      })
                    : setSelectedPackage((prev) =>
                        prev ? { ...prev, description: e.target.value } : prev
                      )
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  placeholder="Price"
                  value={
                    showAddDialog
                      ? newPackage.price
                      : selectedPackage?.price || 0
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    showAddDialog
                      ? setNewPackage({ ...newPackage, price: value })
                      : setSelectedPackage((prev) =>
                          prev ? { ...prev, price: value } : prev
                        );
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Price
                </label>
                <Input
                  type="number"
                  placeholder="Minimum Price"
                  value={
                    showAddDialog
                      ? newPackage.min_price
                      : selectedPackage?.min_price || 0
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    showAddDialog
                      ? setNewPackage({ ...newPackage, min_price: value })
                      : setSelectedPackage((prev) =>
                          prev ? { ...prev, min_price: value } : prev
                        );
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attributes
                </label>
                <div className="flex items-center mb-2">
                  <Input
                    placeholder="Add attribute"
                    value={newAttribute}
                    onChange={(e) => setNewAttribute(e.target.value)}
                    className="mr-2"
                  />
                  <Button
                    onClick={() => {
                      if (newAttribute.trim()) {
                        const updatedAttributes = [
                          ...(showAddDialog
                            ? newPackage.attributes
                            : selectedPackage?.attributes || []),
                          newAttribute.trim(),
                        ];
                        showAddDialog
                          ? setNewPackage({
                              ...newPackage,
                              attributes: updatedAttributes,
                            })
                          : setSelectedPackage((prev) =>
                              prev
                                ? { ...prev, attributes: updatedAttributes }
                                : prev
                            );
                        setNewAttribute("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAddDialog
                    ? newPackage.attributes
                    : selectedPackage?.attributes || []
                  ).map((attr, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                    >
                      {attr}
                      <button
                        onClick={() => {
                          const updatedAttributes = (
                            showAddDialog
                              ? newPackage.attributes
                              : selectedPackage?.attributes || []
                          ).filter((_, i) => i !== index);
                          showAddDialog
                            ? setNewPackage({
                                ...newPackage,
                                attributes: updatedAttributes,
                              })
                            : setSelectedPackage((prev) =>
                                prev
                                  ? { ...prev, attributes: updatedAttributes }
                                  : prev
                              );
                        }}
                        className="ml-1 hover:text-orange-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foods
                </label>
                <div className="flex items-center mb-2">
                  <Input
                    placeholder="Add food"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                    className="mr-2"
                  />
                  <Button
                    onClick={() => {
                      if (newFood.trim()) {
                        const updatedFoods = [
                          ...(showAddDialog
                            ? newPackage.foods
                            : selectedPackage?.foods || []),
                          newFood.trim(),
                        ];
                        showAddDialog
                          ? setNewPackage({
                              ...newPackage,
                              foods: updatedFoods,
                            })
                          : setSelectedPackage((prev) =>
                              prev ? { ...prev, foods: updatedFoods } : prev
                            );
                        setNewFood("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAddDialog
                    ? newPackage.foods
                    : selectedPackage?.foods || []
                  ).map((food, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      {food}
                      <button
                        onClick={() => {
                          const updatedFoods = (
                            showAddDialog
                              ? newPackage.foods
                              : selectedPackage?.foods || []
                          ).filter((_, i) => i !== index);
                          showAddDialog
                            ? setNewPackage({
                                ...newPackage,
                                foods: updatedFoods,
                              })
                            : setSelectedPackage((prev) =>
                                prev ? { ...prev, foods: updatedFoods } : prev
                              );
                        }}
                        className="ml-1 hover:text-green-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desserts
                </label>
                <div className="flex items-center mb-2">
                  <Input
                    placeholder="Add dessert"
                    value={newDessert}
                    onChange={(e) => setNewDessert(e.target.value)}
                    className="mr-2"
                  />
                  <Button
                    onClick={() => {
                      if (newDessert.trim()) {
                        const updatedDesserts = [
                          ...(showAddDialog
                            ? newPackage.desserts
                            : selectedPackage?.desserts || []),
                          newDessert.trim(),
                        ];
                        showAddDialog
                          ? setNewPackage({
                              ...newPackage,
                              desserts: updatedDesserts,
                            })
                          : setSelectedPackage((prev) =>
                              prev
                                ? { ...prev, desserts: updatedDesserts }
                                : prev
                            );
                        setNewDessert("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAddDialog
                    ? newPackage.desserts
                    : selectedPackage?.desserts || []
                  ).map((dessert, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-pink-100 text-pink-800 hover:bg-pink-200"
                    >
                      {dessert}
                      <button
                        onClick={() => {
                          const updatedDesserts = (
                            showAddDialog
                              ? newPackage.desserts
                              : selectedPackage?.desserts || []
                          ).filter((_, i) => i !== index);
                          showAddDialog
                            ? setNewPackage({
                                ...newPackage,
                                desserts: updatedDesserts,
                              })
                            : setSelectedPackage((prev) =>
                                prev
                                  ? { ...prev, desserts: updatedDesserts }
                                  : prev
                              );
                        }}
                        className="ml-1 hover:text-pink-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setShowEditDialog(false);
                setSelectedPackage(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={showAddDialog ? handleAddItem : handleUpdateItem}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : showAddDialog
                ? "Add Package"
                : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this package? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
