import { setWorkingCookie } from "@/lib/set-working-cookie";
import { redirect } from "next/navigation";

export default function TestAuthPage() {
  async function handleSetCookie() {
    'use server';
    const result = await setWorkingCookie();
    if (result.success) {
      redirect('/files');
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Authentication</h1>
      <p className="mb-4">
        Click the button below to set the working session cookie from your curl command 
        and redirect to the files page.
      </p>
      <form action={handleSetCookie}>
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Set Working Cookie & Go to Files
        </button>
      </form>
    </div>
  );
}
