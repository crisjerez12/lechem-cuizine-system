"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

// Form schemas
const attributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
});

const cateringSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  standardPrice: z.number().min(0, "Standard price must be positive"),
  minimumPrice: z.number().min(0, "Minimum price must be positive"),
  category: z.enum(["Any Occasion", "Seminars", "Government"]),
  image: z.instanceof(File).optional(),
  attributes: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  image: z.instanceof(File).optional(),
});

type CateringForm = z.infer<typeof cateringSchema>;
type MenuItemForm = z.infer<typeof menuItemSchema>;
type AttributeForm = z.infer<typeof attributeSchema>;

interface CateringItem extends Omit<CateringForm, "image"> {
  id: string;
  imageUrl: string;
  standardPrice: number;
  minimumPrice: number;
  isFeatured: boolean;
}

interface MenuItem extends Omit<MenuItemForm, "image"> {
  id: string;
  imageUrl: string;
  price: number;
}

export default function Offers() {
  const [activeTab, setActiveTab] = useState("catering");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Any Occasion");
  const [newAttribute, setNewAttribute] = useState("");
  const [attributes, setAttributes] = useState<string[]>([]);
  console.log(attributeSchema);
  // Mock data
  const [cateringItems, setCateringItems] = useState<CateringItem[]>([
    {
      id: "1",
      title: "Wedding Package",
      description: "Complete catering service for weddings",
      standardPrice: 8000,
      minimumPrice: 5000,
      category: "Any Occasion",
      imageUrl:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop",
      attributes: ["100 pax", "5-course meal", "Full service"],
      isFeatured: true,
    },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Adobo",
      price: 800,
      imageUrl:
        "https://images.unsplash.com/photo-1542365887-1149961dccc7?w=800&auto=format&fit=crop",
    },
  ]);

  const {
    register: registerCatering,
    handleSubmit: handleSubmitCatering,
    reset: resetCatering,
    formState: { errors: cateringErrors },
  } = useForm<CateringForm>({
    resolver: zodResolver(cateringSchema),
  });

  const {
    register: registerMenuItem,
    handleSubmit: handleSubmitMenuItem,
    reset: resetMenuItem,
    formState: { errors: menuErrors },
  } = useForm<MenuItemForm>({
    resolver: zodResolver(menuItemSchema),
  });

  const handleAddAttribute = () => {
    if (newAttribute.trim()) {
      setAttributes((prev) => [...prev, newAttribute.trim()]);
      setNewAttribute("");
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = async (data: any) => {
    try {
      // Simulate file upload
      let imageUrl =
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop";

      if (data.image?.[0]) {
        // In a real app, you would upload the file here
        imageUrl = URL.createObjectURL(data.image[0]);
      }

      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        imageUrl,
        attributes: attributes,
      };

      if (activeTab === "catering") {
        setCateringItems((prev) => [...prev, newItem]);
      } else {
        setMenuItems((prev) => [...prev, newItem]);
      }

      toast.success("Item added successfully");
      setShowAddDialog(false);
      resetCatering();
      resetMenuItem();
      setAttributes([]);
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleEdit = async (data: any) => {
    try {
      let imageUrl = selectedItem.imageUrl;

      if (data.image?.[0]) {
        // In a real app, you would upload the file here
        imageUrl = URL.createObjectURL(data.image[0]);
      }

      if (activeTab === "catering") {
        setCateringItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, ...data, imageUrl, attributes }
              : item
          )
        );
      } else {
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id ? { ...item, ...data, imageUrl } : item
          )
        );
      }

      toast.success("Item updated successfully");
      setShowEditDialog(false);
      setSelectedItem(null);
      setAttributes([]);
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleDelete = () => {
    try {
      if (activeTab === "catering") {
        setCateringItems((prev) =>
          prev.filter((item) => item.id !== selectedItem.id)
        );
      } else {
        setMenuItems((prev) =>
          prev.filter((item) => item.id !== selectedItem.id)
        );
      }

      toast.success("Item deleted successfully");
      setShowDeleteDialog(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const renderMenuSection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {menuItems.map((item) => (
        <Card
          key={item.id}
          className="bg-white/70 backdrop-blur-lg overflow-hidden"
        >
          <div className="flex flex-col">
            <div className="h-48 relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <h3 className="text-lg font-display">{item.name}</h3>
                <p className="text-xl font-semibold text-emerald-600">
                  ₱{item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-orange-500"
                  onClick={() => {
                    setSelectedItem(item);
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
                    setSelectedItem(item);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderCateringSection = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {["Any Occasion", "Seminars", "Government"].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={`${
              selectedCategory === category ? "bg-emerald-600" : ""
            } font-display`}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cateringItems
          .filter((item) => item.category === selectedCategory)
          .map((item) => (
            <Card
              key={item.id}
              className={`bg-white/70 backdrop-blur-lg overflow-hidden ${
                item.isFeatured ? "border-2 border-orange-500" : ""
              }`}
            >
              <div className="flex flex-col">
                <div className="h-48 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  {item.isFeatured && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-display">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-display">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.attributes.map((attr, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="font-sans"
                        >
                          {attr}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Standard Price: ₱{item.standardPrice.toLocaleString()}
                      </p>
                      <p className="text-lg font-semibold text-emerald-600">
                        Minimum Price: ₱{item.minimumPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-orange-500"
                        onClick={() => {
                          setSelectedItem(item);
                          setAttributes(item.attributes);
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
                          setSelectedItem(item);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/70 backdrop-blur-lg">
          <TabsTrigger value="catering">Catering</TabsTrigger>
          <TabsTrigger value="viand">Viand</TabsTrigger>
          <TabsTrigger value="dessert">Dessert</TabsTrigger>
        </TabsList>

        <TabsContent value="catering" className="mt-6">
          {renderCateringSection()}
        </TabsContent>

        <TabsContent value="viand" className="mt-6">
          {renderMenuSection()}
        </TabsContent>

        <TabsContent value="dessert" className="mt-6">
          {renderMenuSection()}
        </TabsContent>
      </Tabs>

      <Button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-full shadow-lg"
        size="lg"
        onClick={() => {
          setAttributes([]);
          setShowAddDialog(true);
        }}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add {activeTab === "catering" ? "Package" : "Item"}
      </Button>

      {/* Add/Edit Dialog */}
      <Dialog
        open={showAddDialog || showEditDialog}
        onOpenChange={() => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setSelectedItem(null);
          setAttributes([]);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showAddDialog ? "Add New" : "Edit"}{" "}
              {activeTab === "catering" ? "Package" : "Item"}
            </DialogTitle>
          </DialogHeader>

          {activeTab === "catering" ? (
            <form
              onSubmit={handleSubmitCatering(handleAdd)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  {...registerCatering("image")}
                />
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  {...registerCatering("title")}
                  defaultValue={selectedItem?.title}
                />
                {cateringErrors.title && (
                  <p className="text-sm text-red-500">
                    {cateringErrors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Description"
                  {...registerCatering("description")}
                  defaultValue={selectedItem?.description}
                />
                {cateringErrors.description && (
                  <p className="text-sm text-red-500">
                    {cateringErrors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Standard Price (₱)"
                  {...registerCatering("standardPrice", {
                    valueAsNumber: true,
                  })}
                  defaultValue={selectedItem?.standardPrice}
                />
                {cateringErrors.standardPrice && (
                  <p className="text-sm text-red-500">
                    {cateringErrors.standardPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Minimum Price (₱)"
                  {...registerCatering("minimumPrice", { valueAsNumber: true })}
                  defaultValue={selectedItem?.minimumPrice}
                />
                {cateringErrors.minimumPrice && (
                  <p className="text-sm text-red-500">
                    {cateringErrors.minimumPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add attribute"
                    value={newAttribute}
                    onChange={(e) => setNewAttribute(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddAttribute())
                    }
                  />
                  <Button type="button" onClick={handleAddAttribute}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {attributes.map((attr, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {attr}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(index)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  {...registerCatering("isFeatured")}
                  defaultChecked={selectedItem?.isFeatured}
                />
                <label className="text-sm font-medium">Featured Package</label>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setShowEditDialog(false);
                    setSelectedItem(null);
                    setAttributes([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
                >
                  {showAddDialog ? "Add" : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitMenuItem(handleAdd)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  {...registerMenuItem("image")}
                />
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Name"
                  {...registerMenuItem("name")}
                  defaultValue={selectedItem?.name}
                />
                {menuErrors.name && (
                  <p className="text-sm text-red-500">
                    {menuErrors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Price (₱)"
                  {...registerMenuItem("price", { valueAsNumber: true })}
                  defaultValue={selectedItem?.price}
                />
                {menuErrors.price && (
                  <p className="text-sm text-red-500">
                    {menuErrors.price.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setShowEditDialog(false);
                    setSelectedItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
                >
                  {showAddDialog ? "Add" : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
