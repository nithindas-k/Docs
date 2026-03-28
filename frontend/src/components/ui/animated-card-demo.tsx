import { useState } from "react";
import { AnimatedJobCard, JobCardProps } from "./animated-card";

import { FileText, Users, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- CORE FEATURE DATA ---
const initialJobs: JobCardProps[] = [
  {
    companyLogo: <FileText className="text-primary h-5 w-5" />,
    companyName: "Personal Vault",
    jobTitle: "Digitize Your Identity Docs",
    salary: "Military-Grade AES-256",
    tags: ["Aadhar", "PAN", "Passkey"],
    postedDate: "Core Module",
    variant: "blue",
  },
  {
    companyLogo: <Users className="text-primary h-5 w-5" />,
    companyName: "Family Archive",
    jobTitle: "Manage Family Records",
    salary: "Dynamic Profiles",
    tags: ["Linked Vaults", "Context-Aware"],
    postedDate: "Core Module",
    variant: "purple",
  },
  {
    companyLogo: <Share2 className="text-primary h-5 w-5" />,
    companyName: "Secure Sharing",
    jobTitle: "Invite & Share Safely",
    salary: "Zero-Knowledge Protocol",
    tags: ["Revocable Links", "Audit Log"],
    postedDate: "Core Module",
    variant: "pink",
  },
];


export function AnimatedJobCardDemo() {
  const [cards, setCards] = useState(initialJobs);

  const cardPositions = [
    { rotate: -8, x: "-30%", y: "10%", zIndex: 0 },
    { rotate: 0, x: "0%", y: "-5%", zIndex: 20 },
    { rotate: 8, x: "30%", y: "10%", zIndex: 10 },
  ];

  const handleCardClick = (index: number) => {
    if (index === 1) return;
    const newCards = [...cards];
    const clickedCard = newCards.splice(index, 1)[0];
    newCards.splice(1, 0, clickedCard);
    setCards(newCards);
  };

  return (
    <div className="relative flex h-[350px] sm:h-[400px] md:h-[500px] w-full items-center justify-center bg-transparent overflow-hidden">
      <div className="relative h-[500px] w-full max-w-3xl transform scale-[0.55] sm:scale-[0.8] md:scale-100 origin-center transition-transform duration-500" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="popLayout">
          {cards.map((job, index) => (
            <motion.div
              key={job.jobTitle + job.companyName}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: cardPositions[index].rotate,
                x: cardPositions[index].x,
                y: cardPositions[index].y,
                zIndex: cardPositions[index].zIndex,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute left-0 right-0 top-1/4 mx-auto w-96 cursor-pointer"
              onClick={() => handleCardClick(index)}
            >
              <AnimatedJobCard {...job} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
