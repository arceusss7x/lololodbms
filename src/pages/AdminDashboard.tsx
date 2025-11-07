import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Users, Package, Award, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [donors, setDonors] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch all profiles
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*, user_roles!inner(*)")
      .eq("user_roles.role", "donor")
      .order("created_at", { ascending: true });
    setDonors(profilesData || []);

    // Fetch all donations
    const { data: donationsData } = await supabase
      .from("donations")
      .select("*")
      .order("donation_date", { ascending: false });
    setDonations(donationsData || []);

    // Fetch all certificates
    const { data: certificatesData } = await supabase
      .from("certificates")
      .select("*")
      .order("issued_date", { ascending: false });
    setCertificates(certificatesData || []);
  };

  const getDonorTenure = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = diffDays / 365;

    if (diffYears >= 1) {
      return `${diffYears.toFixed(1)} years`;
    } else {
      return `${diffDays} days`;
    }
  };

  const canGenerateCertificate = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 365;
  };

  const handleGenerateCertificate = async (donor: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("certificates").insert({
        donor_id: donor.id,
        donor_name: donor.full_name || donor.email,
        issued_by: user.id,
        certificate_type: "annual",
      });

      if (error) throw error;

      toast({
        title: "Certificate Generated!",
        description: `Certificate created for ${donor.full_name || donor.email}`,
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
            <p>For over one year of dedicated service and generous contributions, helping to feed those in need and make our community a better place.</p>
            <p>Issued on: ${new Date(cert.issued_date).toLocaleDateString()}</p>
            <div class="signature">
              <strong>Project Nourish Administration</strong>
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

  const totalDonors = donors.length;
  const totalDonations = donations.length;
  const totalItems = donations.reduce((sum, d) => sum + d.quantity, 0);
  const totalCertificates = certificates.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage donors and generate certificates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonors}</div>
            <p className="text-xs text-muted-foreground">Active donors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
            <p className="text-xs text-muted-foreground">All-time donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Donated</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Total quantity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
            <p className="text-xs text-muted-foreground">Total certificates</p>
          </CardContent>
        </Card>
      </div>

      {/* Donors Management */}
      <Card>
        <CardHeader>
          <CardTitle>Donor Management</CardTitle>
          <CardDescription>
            View donor tenure and generate certificates for those who have been members for over a year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor) => {
                const eligible = canGenerateCertificate(donor.created_at);
                return (
                  <TableRow key={donor.id}>
                    <TableCell>{donor.full_name || "N/A"}</TableCell>
                    <TableCell>{donor.email}</TableCell>
                    <TableCell>
                      {new Date(donor.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={eligible ? "text-green-600 font-semibold" : ""}>
                        {getDonorTenure(donor.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={eligible ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGenerateCertificate(donor)}
                        disabled={!eligible}
                      >
                        {eligible ? "Generate Certificate" : "Not Eligible Yet"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Latest donations from all donors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Food Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.slice(0, 10).map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.donor_name}</TableCell>
                  <TableCell>{donation.food_item}</TableCell>
                  <TableCell>{donation.quantity}</TableCell>
                  <TableCell>
                    {new Date(donation.donation_date).toLocaleDateString()}
                  </TableCell>
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

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Certificates</CardTitle>
          <CardDescription>All certificates issued to donors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>{cert.donor_name}</TableCell>
                  <TableCell className="capitalize">{cert.certificate_type}</TableCell>
                  <TableCell>
                    {new Date(cert.issued_date).toLocaleDateString()}
                  </TableCell>
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
