import { cookies } from "next/headers";

export default async function DebugPage() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const connectSid = cookieStore.get('connect.sid');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Cookies</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">connect.sid Cookie:</h2>
        {connectSid ? (
          <div className="bg-green-100 p-4 rounded">
            <p><strong>Value:</strong> {connectSid.value}</p>
          </div>
        ) : (
          <div className="bg-red-100 p-4 rounded">
            <p>❌ No connect.sid cookie found</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">All Cookies:</h2>
        <div className="bg-gray-100 p-4 rounded">
          {allCookies.length > 0 ? (
            <ul className="space-y-2">
              {allCookies.map((cookie, index) => (
                <li key={index} className="border-b pb-2">
                  <strong>{cookie.name}:</strong> {cookie.value.substring(0, 50)}...
                </li>
              ))}
            </ul>
          ) : (
            <p>No cookies found</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <a 
          href="/test-auth" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
        >
          Set Working Cookie
        </a>
        <a 
          href="/files" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Files Page
        </a>
      </div>
    </div>
  );
}
