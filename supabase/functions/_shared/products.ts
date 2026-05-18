export type CheckoutProduct = {
  slug: string;
  name: string;
  price: number;
  image: string;
};

export const products: CheckoutProduct[] = [
  {
    slug: "metro-lounge-scratcher",
    name: "Metro Lounge Scratcher",
    price: 29.99,
    image: "/images/products-flatlay.jpg",
  },
  {
    slug: "skyline-scratching-tower",
    name: "Skyline Scratching Tower",
    price: 49.99,
    image: "/images/product-brush.jpg",
  },
  {
    slug: "trail-blaze-scratcher",
    name: "Trail Blaze Scratcher",
    price: 24.99,
    image: "/images/product-clipper.jpg",
  },
  {
    slug: "wanderlust-play-mat",
    name: "Wanderlust Play Mat",
    price: 19.99,
    image: "/images/product-mist.jpg",
  },
  {
    slug: "touchdown-scratcher",
    name: "Touchdown Scratcher",
    price: 34.99,
    image: "/images/product-spray.jpg",
  },
  {
    slug: "halftime-lounge-pad",
    name: "Halftime Lounge Pad",
    price: 22.99,
    image: "/images/products-flatlay.jpg",
  },
  {
    slug: "confetti-cat-scratcher",
    name: "Confetti Cat Scratcher",
    price: 27.99,
    image: "/images/product-comb.jpg",
  },
  {
    slug: "birthday-bash-tower",
    name: "Birthday Bash Tower",
    price: 39.99,
    image: "/images/product-mist.jpg",
  },
];

export const productBySlug = new Map(products.map((product) => [product.slug, product]));

export function toCents(price: number) {
  return Math.round(price * 100);
}
