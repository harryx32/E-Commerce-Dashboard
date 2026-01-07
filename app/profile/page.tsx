import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "user") {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 text-lg">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-lg">{user.email}</p>
        </div>
        {/* Add edit functionality if needed */}
      </div>
    </div>
  );
}