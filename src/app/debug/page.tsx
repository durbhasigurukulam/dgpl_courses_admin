export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Cookies</h1>
      <p>Debug info is not available in static export mode.</p>

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
