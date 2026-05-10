export default function Privacy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-600 mb-8">Last Updated: April 17, 2026</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Welcome to Productivity Maxing</h2>
          <p className="text-gray-700">
            We are committed to protecting your personal information and your right to privacy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect personal information that you voluntarily provide to us when you register on our platform.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Personal Information Provided by You:</strong> Names, email addresses, usernames, passwords.</li>
            <li><strong>Automatically Collected Information:</strong> IP address, browser and device characteristics, operating system, language preferences.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use personal information collected via our platform for a variety of business purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>To facilitate account creation and logon process.</li>
            <li>To send administrative information to you.</li>
            <li>To fulfill and manage your orders and subscriptions.</li>
            <li>To respond to user inquiries and offer support.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Will Your Information Be Shared?</h2>
          <p className="text-gray-700">
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Keeping Your Information Safe</h2>
          <p className="text-gray-700">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Your Privacy Rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on your location, you may have rights regarding your personal data, including:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>The right to request access to your data.</li>
            <li>The right to request correction or deletion of your data.</li>
            <li>The right to restrict the processing of your data.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Updates to This Policy</h2>
          <p className="text-gray-700">
            We may update this privacy notice from time to time. The updated version will be indicated by an updated &ldquo;Last Updated&rdquo; date and the updated version will be effective as soon as it is accessible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions or comments about this notice, you may email us at{' '}
            <a href="mailto:legal@productivitymaxing.com" className="text-blue-600 hover:underline">
              legal@productivitymaxing.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
