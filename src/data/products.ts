export const products = [
  {
    slug: "metro-lounge-scratcher",
    name: "Metro Lounge Scratcher",
    tagline: "Curved & cozy for apartment living",
    price: 29.99,
    image: "/images/products-flatlay.jpg",
    category: "City Life",
    description:
      "A sleek curved cardboard scratcher designed for modern apartments. Doubles as a lounge spot so your cat can scratch, nap, and chill — all in one spot.",
  },
  {
    slug: "skyline-scratching-tower",
    name: "Skyline Scratching Tower",
    tagline: "Vertical playground for indoor cats",
    price: 49.99,
    image: "/images/product-brush.jpg",
    category: "City Life",
    description:
      "A tall scratching tower with multiple levels. Perfect for cats who love to climb, scratch, and perch — fits neatly in any urban home.",
  },
  {
    slug: "trail-blaze-scratcher",
    name: "Trail Blaze Scratcher",
    tagline: "Adventure-ready & portable",
    price: 24.99,
    image: "/images/product-clipper.jpg",
    category: "Wander Paws",
    description:
      "A lightweight, foldable scratcher that travels with you and your cat. Set it up anywhere — hotel, cabin, or campground.",
  },
  {
    slug: "wanderlust-play-mat",
    name: "Wanderlust Play Mat",
    tagline: "On-the-go enrichment",
    price: 19.99,
    image: "/images/product-mist.jpg",
    category: "Wander Paws",
    description:
      "A compact play mat with built-in scratch zones and dangling toys. Gives your cat a familiar spot wherever you roam.",
  },
  {
    slug: "touchdown-scratcher",
    name: "Touchdown Scratcher",
    tagline: "Game day, cat style",
    price: 34.99,
    image: "/images/product-spray.jpg",
    category: "Game Day",
    description:
      "A rugged double-sided scratcher built for intense play sessions. Stands up to the most energetic cats on game day and every day.",
  },
  {
    slug: "halftime-lounge-pad",
    name: "Halftime Lounge Pad",
    tagline: "Nap between the action",
    price: 22.99,
    image: "/images/products-flatlay.jpg",
    category: "Game Day",
    description:
      "A plush scratch pad that converts into a cozy nap spot. Perfect for cats who play hard and nap harder.",
  },
  {
    slug: "confetti-cat-scratcher",
    name: "Confetti Cat Scratcher",
    tagline: "Party vibes for your kitty",
    price: 27.99,
    image: "/images/product-comb.jpg",
    category: "Pawty Time",
    description:
      "A festive scratcher with playful shapes and bold colors. Makes every day feel like a celebration for your cat.",
  },
  {
    slug: "birthday-bash-tower",
    name: "Birthday Bash Tower",
    tagline: "Gift-worthy & irresistible",
    price: 39.99,
    image: "/images/product-mist.jpg",
    category: "Pawty Time",
    description:
      "A multi-level scratching tower that's also the perfect gift. Treat your cat to their own party palace.",
  },
];

export type Product = (typeof products)[number];