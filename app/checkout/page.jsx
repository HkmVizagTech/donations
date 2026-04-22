import CheckoutPage from "@/components/CheckoutPage";
import { getDonationBySevaId } from "@/data/donations";

export const metadata = {
  title: "Checkout | Hare Krishna Vizag",
  description:
    "Frontend donation checkout flow for Akshaya Tritiya seva offerings."
};

export default async function CheckoutRoute({ searchParams }) {
  const params = await searchParams;
  const donation = getDonationBySevaId(params?.seva ?? "11");

  return <CheckoutPage donation={donation} />;
}
