import React from "react";
import { Cloud, ShoppingCart, Users, BookOpen, FileDown, Handshake } from "lucide-react";

export const BusinessModelIcons: Record<string, React.ReactNode> = {
  "cloud": <Cloud className="h-8 w-8 text-primary mb-2 mx-auto" />,
  "shopping-cart": <ShoppingCart className="h-8 w-8 text-primary mb-2 mx-auto" />,
  "users": <Users className="h-8 w-8 text-primary mb-2 mx-auto" />,
  "chalkboard": <BookOpen className="h-8 w-8 text-primary mb-2 mx-auto" />,
  "file-download": <FileDown className="h-8 w-8 text-primary mb-2 mx-auto" />,
  "hands-helping": <Handshake className="h-8 w-8 text-primary mb-2 mx-auto" />
};
