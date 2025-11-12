import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Storage() {
  const { toast } = useToast();
  
  const { data: storages = [], isLoading } = useQuery({
    queryKey: ["storage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("storage")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load storage facilities",
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Storage</h2>
          <p className="text-muted-foreground">Manage storage facilities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Storage
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : storages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No storage facilities found</TableCell>
                </TableRow>
              ) : (
                storages.map((storage) => (
                  <TableRow key={storage.storage_id}>
                    <TableCell className="font-medium">{storage.location}</TableCell>
                    <TableCell>{storage.capacity}</TableCell>
                    <TableCell>{storage.current_stock}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
