export default function Header({ title = "Xtrawrkx Suite" }) {
  return (
    <header className="p-4 border-b bg-white shadow-sm">
      <div className="container mx-auto">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>
    </header>
  );
}
