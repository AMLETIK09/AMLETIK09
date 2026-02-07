import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Добро пожаловать в Marketplace</h1>
        <p className="text-center text-lg mb-8">Покупайте и продавайте товары легко и быстро.</p>

        <div className="flex justify-center gap-6">
          <a
            href="/farmers"
            className="w-56 h-20 flex items-center justify-center bg-green-600 text-white text-xl font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Фермеры
          </a>

          <a
            href="/products"
            className="w-56 h-20 flex items-center justify-center bg-blue-600 text-white text-xl font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Товары
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}