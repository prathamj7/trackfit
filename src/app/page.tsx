"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, BarChart, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Track Your Fitness, <br /> Stay Ahead 🚀
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 text-lg md:text-xl max-w-2xl mx-auto"
        >
          A modern way to stay consistent, measure progress, and achieve your fitness goals.  
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all flex items-center mx-auto"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-6 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Why Choose TrackFit?
        </h2>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center"
          >
            <Activity className="h-10 w-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold">Track Workouts</h3>
            <p className="mt-2 text-gray-600">
              Log your daily exercises and monitor your consistency like never before.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center"
          >
            <BarChart className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold">See Progress</h3>
            <p className="mt-2 text-gray-600">
              Visualize your journey with charts and insights that keep you motivated.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center"
          >
            <Users className="h-10 w-10 text-pink-500 mb-4" />
            <h3 className="text-xl font-semibold">Stay Connected</h3>
            <p className="mt-2 text-gray-600">
              Join a community of fitness enthusiasts and keep each other accountable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-20 px-6 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Crush Your Goals?
        </h2>
        <p className="mt-4 text-lg">
          Sign up today and take the first step toward your best self.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all"
        >
          Join Now
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-900 text-gray-400 text-center">
        <p>© {new Date().getFullYear()} TrackFit. All rights reserved.</p>
      </footer>
    </main>
  );
}
