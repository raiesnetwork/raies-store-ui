export type Plan = {
    type: string;
    description: string;
    price: string;
    amount: string;
    includes: string[];
    plan: string;
    FreeIncludes?: string[];
    dollar: string;
    priceInDollars: string;
    name:string
  };
  
  export type Plans = {
    [key: string]: Plan[];
  };
  
  export const plans: Plans = {
    Individuals: [
      {
        name:"Free",
        type: "Free",
        description: "Best for exploration",
        price: "14 Days free trail",
        priceInDollars: "14 Days free trail",
        amount: "0",
        dollar: "0",
        includes: [
          "Community management",
          "Collaboration",
          "User management",
          "Career Development",
          
        ],
        plan: "Individuals"
      },
      {
        name:"Individual",
        type: "Premium",
        description: "Best for advanced features",
        price: "₹254/month",
        priceInDollars: "$2.99/month",
        amount: "254",
        dollar: "2.99",
        includes: [
          "All Free plan features",
          "ASK NEWA",
          "Analytics",
        ],
        FreeIncludes: [
          "Community management",
          "Collaboration",
          "User management",
          "Career Development",
          
  
        ],
        plan: "Individuals"
      },
    ],
    "Consultants/Service providers/Influencers": [
      
      {
        name:"Consultants",
        plan: "Consultants",
        type: "Premium",
        description: "Best for advanced tools",
        price: "₹849/month",
        priceInDollars: "$9.99/month",
        amount: "849",
  
        dollar: "9.99",
        includes: [
          "All Free plan features",
          "Service management",
          "Campaign management",
          "Announcement Desk",
          "ASK NEWA",
          "Analytics",
        ],
        FreeIncludes: [
          "Community management",
          "Collaboration",
          "User management",
          "Career Development",
          
  
        ],
      },
    ],
    Businesses: [
      
      {
        name:"Businesses",
        plan: "Businesses",
        type: "Premium",
        description: "Best for scaling teams",
        price: "₹2,549/month",
        amount: "2549",
        dollar: "29.99",
        priceInDollars: "$29.99/month",
        includes: [
          "All Services provide by IXES",
  
        ],
        FreeIncludes: [
          "Community management",
          "Collaboration",
          "User management",
          "Career Development",
          
          "E-Store",
          "Service management",
          "Campaign management",
          "Announcement Desk",
          "File Manager",
          "Task Manager",
          "ASK NEWA",
          "Analytics",
          "Financial Management",
          "Administration Tools",
          "Customization (Talk to us for more)"
        ],
      },
    ],
  };
  