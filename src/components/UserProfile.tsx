
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { UserData } from "@/pages/Index";

interface UserProfileProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const UserProfile = ({ userData, setUserData }: UserProfileProps) => {
  const updateUserData = (field: keyof UserData, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  return (
    <Card className="glass-card accent-glow">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Your Death Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight" className="text-card-foreground">Weight *</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter weight"
              value={userData.weight}
              onChange={(e) => updateUserData("weight", e.target.value)}
              className="bg-input border-border text-card-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="weightUnit" className="text-card-foreground">Unit</Label>
            <Select value={userData.weightUnit} onValueChange={(value: "lbs" | "kg") => updateUserData("weightUnit", value)}>
              <SelectTrigger className="bg-input border-border text-card-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lbs">lbs</SelectItem>
                <SelectItem value="kg">kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="text-card-foreground">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Age (optional)"
              value={userData.age}
              onChange={(e) => updateUserData("age", e.target.value)}
              className="bg-input border-border text-card-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="gender" className="text-card-foreground">Gender</Label>
            <Select value={userData.gender} onValueChange={(value) => updateUserData("gender", value)}>
              <SelectTrigger className="bg-input border-border text-card-foreground">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="unspecified">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="allergies" className="text-card-foreground">Known Allergies</Label>
          <Input
            id="allergies"
            placeholder="e.g., peanuts, shellfish, or 'none'"
            value={userData.allergies}
            onChange={(e) => updateUserData("allergies", e.target.value)}
            className="bg-input border-border text-card-foreground placeholder:text-muted-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};
