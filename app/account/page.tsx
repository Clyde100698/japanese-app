import AccountPanel from "@/components/AccountPanel";

export const metadata = { title: "Account · Nihongo Reviewer" };

export default function AccountPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Account</h1>
      <AccountPanel />
    </div>
  );
}

