export type Data = {
  id: number;
  image: any;
  title: string;
  text: string;
};

export const data: Data[] = [
  {
    id: 1,
    image: require("@/assets/images/lottie/discover.json"),
    title: "Discover Amazing Restaurants",
    text: "Explore top-rated local and international cuisines near you. Find the perfect dining experience for any occasion, from casual lunches to special celebrations.",
  },
  {
    id: 2,
    image: require("@/assets/images/lottie/reserve2.json"),
    title: "Easy Reservations",
    text: "Book your table in just a few taps. Select your preferred date, time, and party size with real-time availability. Say goodbye to long waits and uncertainty.",
  },
  {
    id: 3,
    image: require("@/assets/images/lottie/favourite.json"),
    title: "Create Your Collection",
    text: "Build and organize your personalized list of favorite restaurants. Save dining experiences you love and discover new recommendations based on your preferences.",
  },
];
