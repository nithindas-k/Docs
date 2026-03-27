import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, Car, Landmark, GraduationCap, UserCheck, Book, FileText, BadgeCheck } from "lucide-react";
import { ResourceCardsGrid, ResourceCardItem } from "../components/ui/cards-grid";
import { ProfileHeaderCard } from "../components/ui/insurance-card";
import { Button } from "../components/ui/button";
import { useAppSelector } from "../features/hooks";

const personResourceData = (): ResourceCardItem[] => [
  {
    icon: <UserCheck className="w-5 h-5" />,
    title: "Aadhaar Card",
    lastUpdated: "Today",
    href: "#",
  },
  {
    icon: <Car className="w-5 h-5" />,
    title: "Driving Licence",
    lastUpdated: "Yesterday",
    href: "#",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "PAN Card",
    lastUpdated: "2 weeks ago",
    href: "#",
  },
  {
    icon: <Landmark className="w-5 h-5" />,
    title: "Bank Passbook",
    lastUpdated: "1 month ago",
    href: "#",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "SSLC Certificate",
    lastUpdated: "3 months ago",
    href: "#",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Passport",
    lastUpdated: "6 months ago",
    href: "#",
  },
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    title: "Voter ID",
    lastUpdated: "1 year ago",
    href: "#",
  },
  {
    icon: <Book className="w-5 h-5" />,
    title: "Marriage Certificate",
    lastUpdated: "Just now",
    href: "#",
  },
  {
    icon: <Landmark className="w-5 h-5" />,
    title: "Insurance Policy",
    lastUpdated: "Today",
    href: "#",
  },
];

export function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { persons, loading } = useAppSelector((state) => state.persons);

  const person = persons.find(p => p._id === id);
  const personName = person?.name || "Family Member";

  const resources = personResourceData();

  if (loading || (!person && loading)) {
    return (
        <div className="flex justify-center p-12 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );
  }

  if (!person && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-xl font-bold">Person not found</h2>
        <Button onClick={() => navigate("/persons")} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl pb-16">
      {/* Simplified Profile Header */}
      <ProfileHeaderCard 
        clientName={personName}
        expireDate="21 Sep 2025"
        expireDuration="2 years"
        avatarSrc={person?.imageUrl}
        onBack={() => navigate("/persons")}
      />
      
      {/* Documents Collection Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground uppercase italic">
              Documents Collection
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm font-medium">
              Securely organized archives for {personName}.
            </p>
          </div>
          <div className="w-fit flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary text-[10px] sm:text-xs font-black rounded-full uppercase tracking-widest border border-primary/10">
            <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
            {resources.length} Vault Categories
          </div>
        </div>
        
        <div className="mt-2">
            {/* 3x3 on laptop (lg:grid-cols-3) and 1x1 on mobile (grid-cols-1) */}
            <ResourceCardsGrid items={resources} />
        </div>
      </div>
    </div>
  );
}
