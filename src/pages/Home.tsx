import logo from "@/assets/logo.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Users, Warehouse, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
        <img src={logo} alt="Project Nourish Logo" className="w-32 h-32" />
        <div>
          <h1 className="text-5xl font-bold text-foreground mb-3">Project Nourish</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Empowering communities through efficient food bank management and distribution
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">Supporting our mission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Locations</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Active facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to key sections of the management system</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/donors">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              Manage Donors
            </Button>
          </Link>
          <Link to="/food-items">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              Food Inventory
            </Button>
          </Link>
          <Link to="/storage">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Warehouse className="h-6 w-6" />
              Storage Facilities
            </Button>
          </Link>
          <Link to="/distribution-events">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Distribution Events
            </Button>
          </Link>
          <Link to="/distribution-details">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              Distribution Details
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              View Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
