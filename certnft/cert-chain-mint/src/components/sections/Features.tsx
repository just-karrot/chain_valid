import { Card, CardContent } from "@/components/ui/card";
import certificateIcon from "@/assets/certificate-icon.jpg";
import verifyIcon from "@/assets/verify-icon.jpg";
import institutionIcon from "@/assets/institution-icon.jpg";

const Features = () => {
  const features = [
    {
      icon: certificateIcon,
      title: "Issue NFT Certificates",
      description: "Create tamper-proof digital certificates as ERC-721 NFTs with permanent blockchain storage."
    },
    {
      icon: verifyIcon,
      title: "Instant Verification",
      description: "Verify certificate authenticity instantly through blockchain lookup with QR code scanning."
    },
    {
      icon: institutionIcon,
      title: "Institution Dashboard",
      description: "Complete management portal for educational institutions to issue and track certificates."
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose 
            <span className="bg-gradient-primary bg-clip-text text-transparent ml-3">
              CertChain?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leverage blockchain technology to create a new standard for digital credential verification
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-card">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;