import React from 'react';
import { FiUsers, FiAward, FiGlobe, FiCode, FiHeart, FiTrendingUp, FiUser } from 'react-icons/fi';
// import teamImage from '../assets/logo.png'; // Replace with your actual team image
// import officeImage from '../assets/FullLogo_Transparent-2.png'; // Replace with your actual office image
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TeamCarousel from '../components/TeamCarousel';
import officeWorking from '../assets/office-img.avif'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 px-4 sm:px-0">
          <div className="relative inline-block mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 relative z-10">
              About <span className="text-indigo-600">BharatVox</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 mx-auto w-3/4 h-3 bg-indigo-100 opacity-80 z-0"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-6">
              Revolutionizing voice technology with a <span className="font-semibold text-indigo-500">focus on Indian languages</span>,
              starting with our deep commitment to Odia language preservation and innovation.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                Voice Technology
              </span>
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                AI Innovation
              </span>
              <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                Language Preservation
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                Made in India
              </span>
            </div>
          </div>

          {/* <div className="mt-12 pt-8 border-t border-gray-200 max-w-2xl mx-auto">
            <p className="text-gray-500 italic">
              "Empowering communication through cutting-edge voice solutions that understand the richness of Indian languages."
            </p>
          </div> */}
        </div>

        {/* Our Story Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Created through the <a href="https://www.odishaai.org/initiatives/ai-foundation-series/" target='_blank' className='text-indigo-600 hover:underline'>AI Foundation Series</a> sponsored by <a href="https://deepsurge.ai/" target='_blank' className='text-indigo-600 hover:underline'>DeepSurge AI</a> in association with <a href="https://www.odishaai.org/" target='_blank' className='text-indigo-600 hover:underline'>Odisha AI</a>, BharatVox began as a passion project to bridge the communicational gap for regional Indian languages.
            </p>

            {/* <p className="text-gray-600 mb-4">
              BharatVox was founded with a mission to make technology more inclusive and accessible for India's diverse linguistic communities. Our founding team—comprised of passionate language advocates and AI experts from Odisha—came together to address a critical gap: the lack of high-quality voice technology for regional languages, especially Odia.
            </p> */}

            <p className="text-gray-600 mb-4">
              We believe that every language is a vessel of identity, culture, and opportunity. By building voice-first AI solutions for underrepresented languages, we aim to empower millions who are often left behind in the digital age.
            </p>

            <p className="text-gray-600 mb-6">
              At its core, BharatVox is not just a technology project—it's a movement toward linguistic equity and social inclusion. We are committed to building a future where everyone, regardless of the language they speak, can access, engage with, and benefit from the power of technology.
            </p>

            {/* <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                <FiTrendingUp className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Growing Fast</h3>
                <p className="text-sm text-gray-600">10x user growth in the last year</p>
              </div>
            </div> */}
          </div>

          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src={officeWorking}
              alt="BharatVox team working on voice technology"
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
              }}
            />
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-indigo-50 rounded-2xl shadow-lg p-8">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FiHeart className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
            <p className="text-gray-600">
              To democratize voice technology for all Indian languages, starting with Odia. We're committed to creating
              accessible, accurate, and affordable solutions that empower individuals and businesses to communicate
              effectively in their native languages.
            </p>
          </div>

          <div className="bg-purple-50 rounded-2xl shadow-lg p-8">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FiGlobe className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
            <p className="text-gray-600">
              To become the leading voice technology platform for Indian languages by 2026. We envision a future where
              language is no longer a barrier to accessing technology, education, or economic opportunities in India's
              digital landscape.
            </p>
          </div>
        </div>


        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FiUsers className="text-2xl" />,
                title: "Inclusivity",
                description: "We believe technology should serve all language communities equally"
              },
              {
                icon: <FiAward className="text-2xl" />,
                title: "Excellence",
                description: "We strive for the highest accuracy and performance in our solutions"
              },
              {
                icon: <FiCode className="text-2xl" />,
                title: "Innovation",
                description: "We continuously push boundaries in voice technology"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team - Carousel Version */}
        <TeamCarousel />

        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Whether you're interested in our technology, want to collaborate, or join our team, we'd love to hear from you.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition duration-300" onClick={() => window.location.href = '/contact'}>
              Contact Us
            </button>
            {/* <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold py-3 px-6 rounded-lg transition duration-300">
              Careers
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;