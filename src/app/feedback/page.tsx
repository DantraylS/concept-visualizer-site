export default function Feedback() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Feedback</h1>
      <p className="text-gray-600 max-w-md">
        Have ideas or suggestions? Email me directly at{" "}
        <a
          href="mailto:placeholder@email.com"
          className="text-blue-600 underline"
        >
          placeholder@email.com
        </a>
      </p>
    </main>
  );
}
