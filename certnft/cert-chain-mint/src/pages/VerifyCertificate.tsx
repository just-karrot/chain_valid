import Navigation from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, CheckCircle, AlertCircle } from "lucide-react";
import { getCertificateById, getOwnedCertificateIDs, getTotalSupply } from "@/integrations/flow/api";

const VerifyCertificate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [searchType, setSearchType] = useState<"id" | "address">("id");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setCertificate(null);
    
    try {
      if (searchType === "id") {
        // Search by certificate ID
        const id = parseInt(searchQuery);
        if (isNaN(id)) {
          throw new Error("Invalid certificate ID");
        }
        const certData = await getCertificateById(id);
        if (certData) {
          setCertificate({
            id: id.toString(),
            metadataURI: certData.metadataURI,
            revoked: certData.revoked,
            issuedAt: new Date(Number(certData.issuedAt) * 1000).toLocaleDateString(),
            status: certData.revoked ? "revoked" : "valid",
            type: "id_search"
          });
        }
      } else {
        // Search by wallet address
        const ids = await getOwnedCertificateIDs(searchQuery);
        if (ids.length > 0) {
          setCertificate({
            address: searchQuery,
            certificateIds: ids,
            count: ids.length,
            type: "address_search"
          });
        }
      }
    } catch (error) {
      console.error("Error searching certificate:", error);
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Auto-detect search type
    if (e.target.value.startsWith("0x")) {
      setSearchType("address");
    } else if (!isNaN(parseInt(e.target.value))) {
      setSearchType("id");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Verify Certificate</h1>
              <p className="text-muted-foreground">Search by certificate ID or wallet address on the Flow blockchain</p>
            </div>

            <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Certificate Lookup
                </CardTitle>
                <CardDescription>
                  Enter a certificate ID or wallet address to verify credentials
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge 
                      variant={searchType === "id" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSearchType("id")}
                    >
                      Certificate ID
                    </Badge>
                    <Badge 
                      variant={searchType === "address" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSearchType("address")}
                    >
                      Wallet Address
                    </Badge>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search" className="sr-only">Search</Label>
                      <Input
                        id="search"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder={searchType === "id" ? "Enter certificate ID (e.g., 1, 2, 3...)" : "Enter Flow wallet address (0x...)"}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? "Searching..." : "Verify"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {certificate && (
              <Card className="shadow-lg border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-6 h-6" />
                    {certificate.type === "id_search" ? "Certificate Verified" : "Wallet Found"}
                  </CardTitle>
                  <CardDescription>
                    {certificate.type === "id_search" 
                      ? "This certificate is valid and verified on the Flow blockchain"
                      : `Found ${certificate.count} certificate(s) for this wallet`
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {certificate.type === "id_search" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Certificate ID</Label>
                        <p className="text-lg font-semibold">{certificate.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <Badge variant={certificate.revoked ? "destructive" : "default"}>
                          {certificate.revoked ? "Revoked" : "Valid"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                        <p className="text-lg">{certificate.issuedAt}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Metadata URI</Label>
                        <p className="text-sm text-muted-foreground break-all">{certificate.metadataURI}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Wallet Address</Label>
                        <p className="text-lg font-mono">{certificate.address}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Certificate Count</Label>
                        <p className="text-2xl font-bold text-green-600">{certificate.count}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Certificate IDs</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {certificate.certificateIds.map((id: number) => (
                            <Badge key={id} variant="outline">{id}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!certificate && !isLoading && searchQuery && (
              <Card className="shadow-lg border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-6 h-6" />
                    Certificate Not Found
                  </CardTitle>
                  <CardDescription>
                    No certificate found with the provided {searchType === "id" ? "ID" : "wallet address"}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;