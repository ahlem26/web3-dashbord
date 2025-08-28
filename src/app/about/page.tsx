export default function AboutPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Section principale */}
      <div className="w-full max-w-4xl px-6 py-12">
        {/* En-tête */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          About Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Learn more about our mission, vision, and the team behind this dashboard.
        </p>

        {/* Carte principale */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We aim to provide real-time cryptocurrency insights with a clean and intuitive interface.
            Our goal is to empower traders, analysts, and enthusiasts by providing reliable data and tools.
          </p>
        </div>

        {/* Carte secondaire */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            The Team
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This project is built by a passionate team of developers and designers who believe in 
            open finance, transparency, and making data accessible to everyone.
          </p>
        </div>
      </div>
    </main>
  );
}
