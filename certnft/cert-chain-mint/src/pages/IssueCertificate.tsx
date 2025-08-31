import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { setupMyCollection, mintCertificate } from "@/integrations/flow/api";
import { useFlow } from "@/hooks/use-flow";

const IssueCertificate = () => {
  const { toast } = useToast();
  const { currentUser, login } = useFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentWallet: "",
    institutionName: "",
    courseName: "",
    completionDate: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.addr) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Flow wallet first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First, ensure the user has a collection set up
      await setupMyCollection();
      
      // Then mint the certificate
      const txId = await mintCertificate();
      
      toast({
        title: "Certificate Issued Successfully!",
        description: `The NFT certificate has been minted! Transaction ID: ${txId}`,
      });
      
      setFormData({
        studentName: "",
        studentWallet: "",
        institutionName: "",
        courseName: "",
        completionDate: "",
        description: ""
      });
    } catch (error) {
      console.error("Error minting certificate:", error);
      toast({
        title: "Error Minting Certificate",
        description: "There was an error minting the certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!currentUser?.addr) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Connect Wallet First</h1>
              <p className="text-muted-foreground mb-8">
                You need to connect your Flow wallet to issue certificates
              </p>
              <Button onClick={login} size="lg">
                Connect Flow Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Issue New Certificate</h1>
              <p className="text-muted-foreground">Create and mint a new NFT certificate on the Flow blockchain</p>
              <p className="text-sm text-muted-foreground mt-2">
                Connected: {currentUser.addr.slice(0, 6)}...{currentUser.addr.slice(-4)}
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Certificate Details</CardTitle>
                <CardDescription>
                  Fill in the information below to issue a new certificate NFT
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name *</Label>
                      <Input
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="Enter student's full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="studentWallet">Student Wallet Address *</Label>
                      <Input
                        id="studentWallet"
                        name="studentWallet"
                        value={formData.studentWallet}
                        onChange={handleInputChange}
                        placeholder="0x..."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="institutionName">Institution Name *</Label>
                      <Input
                        id="institutionName"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        placeholder="University/Institution name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="courseName">Course/Degree Name *</Label>
                      <Input
                        id="courseName"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleInputChange}
                        placeholder="e.g., Bachelor of Computer Science"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Completion Date *</Label>
                    <Input
                      id="completionDate"
                      name="completionDate"
                      type="date"
                      value={formData.completionDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Details</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Any additional information about the certificate..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Minting Certificate..." : "Issue Certificate NFT"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;