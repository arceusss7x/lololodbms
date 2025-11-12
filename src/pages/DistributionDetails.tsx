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

export default function DistributionDetails() {
  const { toast } = useToast();
  
  const { data: details = [], isLoading } = useQuery({
    queryKey: ["distribution_details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("distribution_details")
        .select(`
          *,
          distribution_events(event_date, location),
          food_items(item_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load distribution details",
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
          <h2 className="text-3xl font-bold text-foreground">Distribution Details</h2>
          <p className="text-muted-foreground">Track items distributed per event</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Detail
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Distribution Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Date</TableHead>
                <TableHead>Event Location</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity Distributed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : details.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No distribution details found</TableCell>
                </TableRow>
              ) : (
                details.map((detail) => (
                  <TableRow key={detail.detail_id}>
                    <TableCell>{detail.distribution_events?.event_date ? new Date(detail.distribution_events.event_date).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="font-medium">{detail.distribution_events?.location || "Unknown"}</TableCell>
                    <TableCell>{detail.food_items?.item_name || "Unknown"}</TableCell>
                    <TableCell>{detail.quantity_distributed}</TableCell>
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
