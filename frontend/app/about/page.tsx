import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          </div>
        </section>

        {/* Insights Introduction */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-8">Insights Introduction</h2>
            
            <h3 className="text-2xl font-semibold text-gray-700 mb-8">
              Welcome to Insights Elite – Your Trusted Partner in Market Research
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 text-gray-700">
                <p className="leading-relaxed">
                  At <strong>Insights Elite</strong>, we specialize in delivering high-quality <strong>B2B and B2C</strong> research with global reach. Our online panels connect businesses with hard-to-reach audiences, from <strong>moms, small business owners, and IT decision-makers to freelancers, smokers, and geo-targeted consumer segments</strong>.
                </p>
                
                <p className="leading-relaxed">
                  Based in <strong>India</strong>, we possess deep expertise in the <strong>local and global markets</strong>, capturing the <strong>diverse nuances of consumer behaviour, industry trends, and competitive landscapes</strong>. Whether it's the bustling streets of <strong>Mumbai</strong>, the tech hubs of <strong>Japan</strong>, or international markets, we provide research solutions tailored for <strong>start-ups and multinational corporations alike</strong>.
                </p>
              </div>

              <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold">Market Research Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Insights Elite */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12">Why Choose Insights Elite?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Precision & Quality</h3>
                    <p className="text-gray-600">
                      We leverage cutting-edge methodologies and rigorous data validation to ensure accuracy and reliability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Actionable Intelligence</h3>
                    <p className="text-gray-600">
                      We go beyond data, providing actionable insights and strategic recommendations for measurable impact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Tailored Research Solutions</h3>
                    <p className="text-gray-600">
                      Every business is unique, so we design custom research plans that align with your specific goals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborative Approach</h3>
                    <p className="text-gray-600">
                      We partner with you at every step, ensuring seamless communication and a deep understanding of your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-12">Our Expertise</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Expertise Includes:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Consumer Research</strong> – Understand your audience's needs and buying behaviours.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Competitive Analysis</strong> – Identify opportunities by analysing your competitors.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Market Segmentation</strong> – Define and target high-value market segments.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Brand Tracking</strong> – Measure awareness, perception, and loyalty.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Product Testing</strong> – Gather real-world feedback to optimize your offering.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>When in doubt, turn to the Elites.</strong>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative h-64 lg:h-full min-h-[300px] rounded-lg overflow-hidden shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Expert Team</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 italic">
                At <strong>Insights Elite</strong>, we don't just collect data—we <strong>transform it into a powerful tool for growth</strong>. Whether you're launching a new product, expanding into a new market, or refining your strategy, our insights pave the way for your success.
              </p>
            </div>
          </div>
        </section>

        {/* Insights Speciality */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-8">Insights Speciality</h2>
            
            <p className="text-center text-gray-700 text-lg mb-12 max-w-4xl mx-auto">
              At <strong>Insights Elite</strong>, we are more than a research firm—we are your <strong>strategic partner</strong> in unlocking <strong>market intelligence</strong>. Our expertise lies in <strong>delivering high-quality, actionable insights</strong> through innovative methodologies, precision-driven data collection, and an unwavering commitment to excellence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Women-Led, Vision-Driven',
                  description: 'As a women-founded and women-led company, we champion diversity, inclusivity, and empowerment in research and business leadership. Our success reflects the power of women entrepreneurs in driving impactful solutions.'
                },
                {
                  title: '24/7 Global Support',
                  description: 'With around-the-clock support, our team ensures seamless research execution across time zones, so your projects never face delays.'
                },
                {
                  title: 'Niche & Hard-to-Reach Audiences',
                  description: 'We specialize in highly targeted research panels, including: Small business owners, IT & financial decision-makers, Freelancers & gig economy professionals, Geo-targeted consumer segments, Moms, web developers, and unique lifestyle groups'
                },
                {
                  title: 'One-on-One Client Consultations',
                  description: 'We go beyond standard service by offering personalized meetings with clients. Our experts take the time to understand your challenges, discuss strategies, and craft tailored solutions that maximize impact.'
                },
                {
                  title: 'Agile & Scalable Research Solutions',
                  description: 'Whether you need a quick-turn study or a large-scale, multi-country analysis, our research capabilities are fully flexible to accommodate your business size, industry, and project scope.'
                },
                {
                  title: 'Uncompromising Data Quality',
                  description: 'Our commitment to data integrity is unmatched. We employ: Real-time quality inspections to prevent fraud & ensure validity, AI-powered data validation for enhanced accuracy, Multi-layered verification to authenticate responses'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700">
                At Insights Elite, we don't just provide research—we <strong>empower businesses with the knowledge they need to make confident, strategic decisions in a competitive landscape</strong>.
              </p>
              <p className="text-xl font-bold text-blue-600 mt-4">
                Partner with us and gain the insights that fuel success!
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-4">Core Values</h2>
            <p className="text-center text-gray-600 mb-12">Core Values of Insights Elite</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Synergy',
                  description: 'We believe in the power of collaboration. By bringing together diverse talents, perspectives, and expertise, we create stronger solutions and deliver meaningful insights that drive impactful decisions.'
                },
                {
                  title: 'Agility',
                  description: 'The world evolves, and so do we. Adaptability is at our core—we embrace change, refine strategies, and stay ahead of industry trends to provide innovative research solutions.'
                },
                {
                  title: 'Curiosity',
                  description: 'Questions fuel progress. We are driven by a passion for learning, exploring new ideas, and pushing the boundaries of market research to uncover insights that matter.'
                },
                {
                  title: 'Authenticity',
                  description: 'Trust is built on honesty. We uphold transparency in our processes, communications, and partnerships, ensuring reliability and integrity in every interaction.'
                },
                {
                  title: 'Empowerment',
                  description: 'Knowledge is power. We strive to equip our clients, partners, and team members with the tools, data, and confidence to make informed decisions and achieve success.'
                },
                {
                  title: 'Impact-Driven',
                  description: 'Insights should lead to action. Our mission is to provide research that not only informs but also empowers businesses to make strategic moves with confidence.'
                },
                {
                  title: 'Inclusivity',
                  description: 'Different perspectives drive better outcomes. We champion diversity, equity, and inclusion in our workforce and research, ensuring every voice is valued and represented.'
                },
                {
                  title: 'Precision',
                  description: 'Excellence is in the details. We are committed to accuracy, reliability, and delivering high-quality data that businesses can depend on to shape their strategies.'
                },
                {
                  title: 'Future-Focused',
                  description: 'Innovation is in our DNA. We continuously seek new technologies, methodologies, and industry advancements to ensure we stay at the forefront of market research.'
                }
              ].map((value, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}

              <div className="bg-blue-600 text-white p-6 rounded-lg md:col-span-2 lg:col-span-3">
                <h3 className="text-xl font-bold mb-3">Women-Led Success</h3>
                <p className="text-blue-100 leading-relaxed">
                  Founded by women, built for success—Insights Elite is a testament to the power of women entrepreneurs in business. We are proud to be a women-led, profit-driven company that inspires and uplifts future female leaders while delivering exceptional market research solutions.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 mb-4">
                At Insights Elite, we don't just provide research—we <strong>empower businesses with the knowledge they need to make confident, strategic decisions in a competitive landscape</strong>.
              </p>
              <p className="text-xl font-bold text-blue-600">
                Partner with us and gain the insights that fuel success!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
