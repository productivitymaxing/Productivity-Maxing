export default function Terms() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-gray-600 mb-8">Last Updated: April 17, 2026</p>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-700">
            By accessing or using our platform, Productivity Maxing, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Intellectual Property Rights</h2>
          <p className="text-gray-700">
            Unless otherwise indicated, the platform and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the platform are our proprietary property.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. User Representations</h2>
          <p className="text-gray-700 mb-4">
            By using the platform, you represent and warrant that:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You will not access the platform through automated or non-human means, whether through a bot, script or otherwise.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Prohibited Activities</h2>
          <p className="text-gray-700">
            You may not access or use the platform for any purpose other than that for which we make the platform available. The platform may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Modifications and Interruptions</h2>
          <p className="text-gray-700">
            We reserve the right to change, modify, or remove the contents of the platform at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700">
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed by and defined following the laws of applicable jurisdictions, without regard to its conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
          <p className="text-gray-700">
            In order to resolve a complaint regarding the platform or to receive further information regarding use of the platform, please contact us at{' '}
            <a href="mailto:legal@productivitymaxing.com" className="text-blue-600 hover:underline">
              legal@productivitymaxing.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
