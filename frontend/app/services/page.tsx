import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Services</h1>
          </div>
        </section>

        {/* Our Services Intro */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">Our Services</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Great research starts with the right partner. At <span className="text-blue-600 font-semibold">Insights Elite</span>, we combine expertise, innovation, and precision-driven data to deliver insights that matter. Our industry-trained professionals are committed to quality, ensure you get accurate, actionable, and intelligent insights that drive better data with <span className="text-blue-600 font-semibold">Insights Elite</span>, where research meets excellence.
            </p>
          </div>
        </section>

        {/* Programming/Hosting Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Programming/Hosting:</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Precision-Driven Survey Programming for Seamless Research Execution</h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              At <span className="text-blue-600 font-semibold">Insights Elite</span>, we believe that exceptional research starts with flawless programming. Our highly skilled programming team specializes in designing and executing interactive, intuitive, and fully customized surveys that deliver seamless experiences for respondents and accurate, high-quality data for clients.
            </p>

            {/* Advanced Solutions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/bg.jpg"
                  alt="Advanced Solutions"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Advanced, Custom-Built Solutions</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our programmers leverage state-of-the-art survey technologies to develop B2B and B2C studies with unparalleled precision. From longitudinal tracking study or complex multi-market research, we create dynamic, engaging, and user-friendly survey interfaces and drive completion rates and enhance respondent experience.
                </p>
              </div>
            </div>

            {/* Smart Survey Programming */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Smart Survey Programming Techniques</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We ensure precision with a wide range of programming techniques to maximize efficiency, data quality, and respondent engagement, including:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Advanced Survey Logic Sequences:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Random question skips, rotations, and branching patterns
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Adaptive survey logic tailored to respondent behavior
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Rotational/random attribute appearance to minimize bias
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Random block rotations for concept testing
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Hidden skip logic & variable piping for seamless survey flow
                    </li>
                  </ul>
                </div>

                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/bg.jpg"
                    alt="Survey Programming"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Quality Control & Validation */}
            <div className="mb-12">
              <h4 className="font-semibold text-gray-800 mb-3">Quality Control & Validation Measures:</h4>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Error trapping and forced answering to maintain data integrity
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Digital fingerprinting & IP checks to prevent duplicate responses
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Straight-lining prevention to filter low-quality responses
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Human review for enhanced data accuracy
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Captcha & systematic response rotation for fraud prevention
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Prevent backing up/skipping to ensure honest answers
                </li>
              </ul>
            </div>

            {/* Enhanced Capabilities */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Enhanced Capabilities for Deeper Insights:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Real-time reporting & dashboards for instant data visualization
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Complex data tabulation & open-end coding for rich insights
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Multi-lingual surveys & translation to reach global audiences
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Advanced heat-mapping & eye-tracking for user experience studies
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Image projection & external content embedding for advanced stimuli testing
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Geo-location tracking & mobile-optimized surveys for seamless accessibility
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  API integration & numerical/mathematical checks for high-functioning survey execution
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Panel Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-8">Panel</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/bg.jpg"
                  alt="Global Panel"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Unparalleled Global Panel Reach for Exceptional Market Insights</h3>
                <p className="text-gray-700 leading-relaxed">
                  At <span className="text-blue-600 font-semibold">Insights Elite</span>, we take pride in offering one of the most comprehensive and diverse global panels in the research industry. Our highly engaged and pre-qualified members span across industries, demographics, and geographic regions, ensuring faster, more reliable, and deeply targeted data collection for every research study.
                </p>
              </div>
            </div>

            {/* Three Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Global Reach, Hyper-Targeted Insights</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Whether you're looking for C-level executives in North America, IT decision-makers in Europe, healthcare professionals in Asia, or everyday consumers in Latin America, our panel includes niche and hard-to-reach audiences worldwide.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Fast, Flexible, and Scalable Solutions</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Need results in a short turnaround time? Our data panel network is highly responsive. Whether you're conducting ad hoc studies, longitudinal tracking, or large-scale global consumer studies, we ensure seamless execution and actionable insights.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Your Research, Powered by Insights Elite</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  With our global reach, niche-targeting expertise, and rigorous quality assurance, <span className="text-blue-600 font-semibold">Insights Elite</span> is the partner of choice for companies looking to make data-backed decisions with confidence.
                </p>
              </div>
            </div>

            {/* Additional Sections */}
            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Precision Profiling & Deep Targeting Capabilities</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Our panel members are carefully recruited, double-opted in, and continuously validated to ensure data quality. We offer unmatched targeting capabilities based on:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-sm">
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Business Size & Revenue Segmentation</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Healthcare & Talent Panels (Doctors, Nurses, Patients with specific conditions, etc.)</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>B2B & B2C Niche-level (IT, Economics, Manufacturing, and beyond)</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Specific Industry Targeting (Hyper-local, National, and Global reach)</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Geographical Targeting (Hyper-local, National, and Global reach)</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Tech Usage & Product Ownership</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Consumer Lifestyles & Purchase Behavior</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Firmographics (Industry & Job Role, Financial Decision Makers, Supply Chain Managers, and More)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Data Integrity & Quality Control at Our Core</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">At <span className="text-blue-600 font-semibold">Insights Elite</span>, quality is not just a priority—it's the foundation of everything we do. Our panel quality control processes ensure you receive only the most accurate, reliable, and actionable data.</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-sm">
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Behavioral Tracking & Engagement Scoring to optimize response accuracy</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Fraud Detection with AI-Powered Machine Learning</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Manual & Automated Real-time Screening for error-free insights</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Digital Fingerprinting & IP Verification to prevent fraud and duplicate responses</li>
                  <li className="flex items-start"><span className="text-blue-600 mr-2">✓</span>Ongoing Panelist Engagement for high participation rates and honest feedback</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* B2B/B2C/Healthcare Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-4">B2B</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  At <span className="text-blue-600 font-semibold">Insights Elite</span>, We specialize in high-quality consumer research, collecting data for thousands of ad-hoc B2C studies each year. Whether it's brand perception, product testing, must use, food delivery feedback, or gig economy insights, we provide a reliable, data-driven approach to understanding consumer behavior and product.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-4">B2C</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  With our deep expertise in longitudinal studies, we understand the importance of consistent, autonomously trending data that accurately captures consumer behaviors, tracking brand performance, and shaping future marketing strategies with unparalleled consistency and depth.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Healthcare</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  With real-time response validation, rigorous quality control, and a global reach, <span className="text-blue-600 font-semibold">Insights Elite</span> is your trusted partner in understanding consumer behavior, tracking brand performance, and shaping future marketing strategies with unparalleled consistency and depth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">API</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At <span className="text-blue-600 font-semibold">Insights Elite</span>, we go beyond traditional sampling by offering seamless API integration to maximize efficiency, scalability, and respondent reach. While we specialize in delivering real-time sampling solutions that drive higher engagement and faster data collection. Our API solutions ensure that panelists are dynamically matched with relevant studies, enhancing higher feasibility, better targeting, and more diverse respondent pools across multiple industries.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              By leveraging automation and intelligent routing, we connect your research with the right audience more effectively ensuring higher-quality data through automated API solutions, <span className="text-blue-600 font-semibold">Insights Elite</span> empowers businesses to conduct research with greater precision, broader reach, and seamless execution—driving real impact for brands, products, and services.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg mb-6">
              At Insights Elite, we don't just manage projects, we drive research success with expert guidance, proactive problem-solving, and a relentless focus on quality. Partner with us for seamless execution, powerful insights, and research that delivers real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition">
                Let's make your next research project a success - efficiently and flawlessly!
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">
                Let's talk!
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
              