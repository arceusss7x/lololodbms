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

export default function DistributionEvents() {
  const { toast } = useToast();
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["distribution_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("distribution_events")
        .select("*")
        .order("event_date", { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load distribution events",
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
          <h2 className="text-3xl font-bold text-foreground">Distribution Events</h2>
          <p className="text-muted-foreground">Schedule and manage distribution events</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Organized By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No distribution events found</TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.event_id}>
                    <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{event.location}</TableCell>
                    <TableCell>{event.organized_by || "N/A"}</TableCell>
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
