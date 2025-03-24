import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getNumerologyData } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const NumerologyForm = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleNames: [""],
    birthDate: "",
    maritalName: "",
    usedFirstName: "",
    carriedNameFor25Years: false,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMiddleNameChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newMiddleNames = [...prev.middleNames];
      newMiddleNames[index] = value;
      return { ...prev, middleNames: newMiddleNames };
    });
  };

  const addMiddleName = () => {
    setFormData((prev) => ({
      ...prev,
      middleNames: [...prev.middleNames, ""],
    }));
  };

  const removeMiddleName = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      middleNames: prev.middleNames.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please log in to calculate numerology",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await getNumerologyData(token, formData);
      setResult(data);
      toast({
        title: "Success",
        description: "Numerology calculation completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate numerology",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Numerology Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Middle Names</Label>
          {formData.middleNames.map((name, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => handleMiddleNameChange(index, e.target.value)}
                placeholder={`Middle name ${index + 1}`}
              />
              {formData.middleNames.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeMiddleName(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addMiddleName}
            className="mt-2"
          >
            Add Middle Name
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange("birthDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalName">Marital Name (Optional)</Label>
          <Input
            id="maritalName"
            value={formData.maritalName}
            onChange={(e) => handleInputChange("maritalName", e.target.value)}
            placeholder="Enter marital name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="usedFirstName">Used First Name (Optional)</Label>
          <Input
            id="usedFirstName"
            value={formData.usedFirstName}
            onChange={(e) => handleInputChange("usedFirstName", e.target.value)}
            placeholder="Enter used first name"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="carriedNameFor25Years"
            checked={formData.carriedNameFor25Years}
            onCheckedChange={(checked: boolean) =>
              handleInputChange("carriedNameFor25Years", checked)
            }
          />
          <Label htmlFor="carriedNameFor25Years">
            Carried name for 25 years or more
          </Label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Calculating..." : "Calculate"}
        </Button>

        {result && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Life Path</p>
                <p className="text-2xl font-bold">{result.lifePath}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Expression</p>
                <p className="text-2xl font-bold">{result.expression}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Intimate</p>
                <p className="text-2xl font-bold">{result.intimate}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Realization</p>
                <p className="text-2xl font-bold">{result.realization}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NumerologyForm;