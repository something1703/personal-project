import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-50 to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Welcome To <span className="text-blue-600">Insights Elite</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Insights Elite providing quality in the research industry
              </p>
              <Link
                href="/login"
                className="inline-block px-8 py-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition text-lg"
              >
                Get Started Now
              </Link>
            </div>
            
            {/* Right Image */}
            <div className="hidden lg:block">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/bg.jpg"
                  alt="Research Quality"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Brands Know Us
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-12">
            They Trust Us. Get Samples Worldwide!
          </h3>
          
          {/* Country Flags Grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 mb-8">
            {[
              { name: 'China', img: 'china.png' },
              { name: 'India', img: 'india.png' },
              { name: 'Germany', img: 'germany.png' },
              { name: 'France', img: 'france.png' },
              { name: 'Denmark', img: 'denmark.png' },
              { name: 'Greece', img: 'greece.png' },
              { name: 'Cuba', img: 'cuba.png' },
              { name: 'Egypt', img: 'egypt.png' },
            ].map((country) => (
              <div key={country.name} className="text-center">
                <div className="relative w-20 h-14 mx-auto mb-2 rounded shadow-md overflow-hidden">
                  <Image
                    src={`/${country.img}`}
                    alt={country.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-gray-600">{country.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Description Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-8">
            We provide great services and ideas.
          </h2>
          <p className="text-center text-gray-700 text-lg max-w-5xl mx-auto mb-16 leading-relaxed">
            We are a fast-growing global Market Intelligence company, providing research solutions and strategic insights to help Asian companies expand globally. Specializing in market modelling, pricing, demand forecasting, and customer experience tracking, we lead in online research across Europe, the Middle East, and Asia Pacific. Our expertise spans qualitative and quantitative data collection, ensuring high-quality insights backed by advanced marketing science. With a commitment to accuracy and ethical research, we prevent misuse of technology and ensure reliable data.
          </p>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600">
              <div className="flex items-start mb-4">
                <div className="text-5xl font-bold text-blue-600 mr-4">1</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-3">Survey Programming</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Insights Elite provides for round the clock project monitoring and the programmed survey keeps collecting the requisite data from the relevant respondents during the course. The responses could be collected in a matrix or over a likert scale of points or multiple check box or unique radio button responses through applicable text box or text or audio- video means.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600">
              <div className="flex items-start mb-4">
                <div className="text-5xl font-bold text-blue-600 mr-4">2</div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-3">Data Analysis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Data analysis uncovers patterns in data using predictive techniques. These patterns play a crucial role in decision making because they reveal areas for process improvement. Using data analysis organisations can increase the profitability of their interactions with their customers, detect fraud and improve risk management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-blue-900 text-white relative">
        <div className="absolute inset-0 bg-blue-900 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h2>
              <p className="text-lg text-blue-100 mb-8">
                We do all types of data & science related work efficiently information from a predetermined set of questions that is given to a sample and is used to assess thoughts, opinions, and feelings
              </p>
              <Link
                href="/services"
                className="inline-block px-8 py-3 bg-white text-blue-900 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                View Audiences
              </Link>
            </div>

            {/* Right Side - Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Qualitative Research</h3>
                <p className="text-sm text-gray-600">
                  A method of inquiry employed in many different academic disciplines, traditionally in the social sciences but also in market research and further contexts.
                </p>
              </div>

              <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Survey Research</h3>
                <p className="text-sm text-gray-600">
                  Information from a predetermined set of questions that is given to a sample and is used to assess thoughts, opinions, and feelings
                </p>
              </div>

              <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg sm:col-span-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Marketing Research</h3>
                <p className="text-sm text-gray-600">
                  The function that links the consumers, customers, and public to the marketer through information. This information is used to identify and define marketing opportunities and problems; generate, refine, and evaluate marketing actions; monitor marketing performance; and improve understanding of marketing as a process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">Join hundreds of companies tracking their survey traffic efficiently.</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition text-lg"
          >
            Start Tracking Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
