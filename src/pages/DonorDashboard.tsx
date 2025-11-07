import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Award, Package } from "lucide-react";

export default function DonorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [donorName, setDonorName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(profileData);

    // Fetch donations
    const { data: donationsData } = await supabase
      .from("donations")
      .select("*")
      .eq("donor_id", user.id)
      .order("donation_date", { ascending: false });
    setDonations(donationsData || []);

    // Fetch certificates
    const { data: certificatesData } = await supabase
      .from("certificates")
      .select("*")
      .eq("donor_id", user.id)
      .order("issued_date", { ascending: false });
    setCertificates(certificatesData || []);
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("donations").insert({
        donor_id: user.id,
        donor_name: donorName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        food_item: foodItem,
        quantity: parseInt(quantity),
        expiry_date: expiryDate || null,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your donation has been recorded.",
      });

      setDialogOpen(false);
      setDonorName("");
      setContactPhone("");
      setContactEmail("");
      setFoodItem("");
      setQuantity("");
      setExpiryDate("");
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("certificates").insert({
        donor_id: user.id,
        donor_name: profile?.full_name || profile?.email,
        certificate_type: "self-generated",
      });

      if (error) throw error;

      toast({
        title: "Certificate Generated!",
        description: "Your certificate has been created successfully.",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const printCertificate = (cert: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Appreciation</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              text-align: center;
              padding: 50px;
              background: linear-gradient(to bottom, #f9f9f9, #e9e9e9);
            }
            .certificate {
              border: 10px solid #d4af37;
              padding: 50px;
              background: white;
              max-width: 800px;
              margin: 0 auto;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h1 {
              color: #d4af37;
              font-size: 48px;
              margin-bottom: 20px;
            }
            h2 {
              font-size: 32px;
              margin: 30px 0;
              color: #333;
            }
            p {
              font-size: 18px;
              line-height: 1.8;
              color: #555;
            }
            .signature {
              margin-top: 50px;
              border-top: 2px solid #333;
              padding-top: 10px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>Certificate of Appreciation</h1>
            <p>This is to certify that</p>
            <h2>${cert.donor_name}</h2>
            <p>has been a valued donor of</p>
            <h2>Project Nourish</h2>
            <p>Their generous contributions have helped feed those in need and make our community a better place.</p>
            <p>Issued on: ${new Date(cert.issued_date).toLocaleDateString()}</p>
            <div class="signature">
              <strong>Project Nourish Team</strong>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || profile?.email}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Donated</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.reduce((sum, d) => sum + d.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total quantity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">Earned certificates</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your donations and certificates</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Record New Donation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record a New Donation</DialogTitle>
                <DialogDescription>Fill in the details of your donation</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddDonation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donorName">Your Name</Label>
                  <Input
                    id="donorName"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foodItem">Food Item</Label>
                  <Input
                    id="foodItem"
                    value={foodItem}
                    onChange={(e) => setFoodItem(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Donation"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleGenerateCertificate}>
            Generate Certificate
          </Button>
        </CardContent>
      </Card>

      {/* My Donations */}
      <Card>
        <CardHeader>
          <CardTitle>My Donations</CardTitle>
          <CardDescription>History of your contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Food Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    {new Date(donation.donation_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{donation.food_item}</TableCell>
                  <TableCell>{donation.quantity}</TableCell>
                  <TableCell>
                    {donation.expiry_date
                      ? new Date(donation.expiry_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* My Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <CardDescription>Your earned certificates of appreciation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issued Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>
                    {new Date(cert.issued_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="capitalize">{cert.certificate_type}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printCertificate(cert)}
                    >
                      Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
