import AdminDashboardClient from "./_components/AdminDashboardClient";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          Dashboard
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Admin overview
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-zinc-600">
          Manage users, properties, and blog posts with pagination and CRUD.
        </p>
      </div>

      <AdminDashboardClient />
    </div>
  );
}
