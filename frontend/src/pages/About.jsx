import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="bg-gray-50 w-full px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={assets.logo3}
              alt="Hikeazy Logo"
              className="w-80 h-auto rounded-lg shadow-lg object-contain"
            />
          </div>
          {/* About Us Text */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              About <span className="text-[#FF4500]">Hikeazy</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Welcome to Hikeazy, your trusted partner in creating seamless hiking adventures.
              We are committed to helping you book guided trails, rent equipment, and plan
              hiking trips—all in one convenient platform.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're a seasoned hiker or a beginner, Hikeazy offers tailored packages,
              professional guides, and secure bookings to ensure you have a stress-free
              experience.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Why Choose Hikeazy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">Easy Booking</p>
            <p className="text-gray-700">
              Streamline your hiking adventures with our user-friendly booking platform.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">Professional Guides</p>
            <p className="text-gray-700">
              Enjoy trails curated by experienced guides for a safe and memorable journey.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">Leaderboard</p>
            <p className="text-gray-700">
              Compete with fellow hikers and see how you rank on the Hikeazy leaderboard.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">Customizable Options</p>
            <p className="text-gray-700">
              Choose your meals, rental equipment, and stay options to personalize your trip.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">Secure Payments</p>
            <p className="text-gray-700">
              Make your transactions with confidence through our secure payment gateway.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">Transparent Policies</p>
            <p className="text-gray-700">
              We prioritize clarity with well-defined cancellation and refund policies.
            </p>
          </div>
        </div>
      </div>

      {/* Policy Section */}
      <div className="max-w-7xl mx-auto mt-16 bg-gray-100 rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Policy
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
          At Hikeazy, we value your trust and strive to make your experience worry-free.
          Here's our cancellation and refund policy:
        </p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Cancellation and Refund Policy
          </h3>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-3">
            <li>
              Cancel two weeks before the hiking date for a <strong>100% refund</strong>.
            </li>
            <li>
              Cancel one week before the hiking date for a <strong>70% refund</strong>.
            </li>
            <li>
              Cancel three days before the hiking date for a <strong>30% refund</strong>.
            </li>
            <li>
              Cancel the day before or on the day of the hike for <strong>no refund</strong>.
            </li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed mt-6">
            Refunds are processed within 5-7 business days. For questions or assistance,
            please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
