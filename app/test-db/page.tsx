import { connectDB } from "@/lib/db";

export default async function TestDBPage() {
  await connectDB();

  return (
    <div style={{ padding: "20px" }}>
      <h1>DB Connected Successfully ✅</h1>
    </div>
  );
}
