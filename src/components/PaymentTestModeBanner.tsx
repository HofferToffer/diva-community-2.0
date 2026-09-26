import { useLang } from "@/lib/lang";
const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  const { l } = useLang();
  if (!clientToken) {
    return (
      <div className="w-full bg-red-100 border-b border-red-300 px-4 py-2 text-center text-sm text-red-800">
        {l("Platby v ostrej prevádzke zatiaľ nie sú nastavené.", "Live payments aren't set up yet.")}
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
        {l("Platby sú v testovacom režime — žiadne skutočné peniaze sa nestrhávajú.", "Payments are in test mode, so no real money is charged.")}
      </div>
    );
  }
  return null;
}
