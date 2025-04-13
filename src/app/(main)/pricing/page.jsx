"use client";
import { Context } from "@/context/Context";
import React, { useContext, useState } from "react";

const pricingPlans = [
  {
    name: "Pro",
    monthly: 20,
    annual: 16.67,
    tokens: "10M tokens",
    description: "Ideal for hobbyists and casual users for light, exploratory use.",
  },
  {
    name: "Pro 50",
    monthly: 50,
    annual: 41.67,
    tokens: "26M tokens",
    strikethroughTokens: "25M tokens",
    description: "Designed for professionals who need to use Bolt a few times per week.",
  },
  {
    name: "Pro 100",
    monthly: 100,
    annual: 83.33,
    tokens: "55M tokens",
    strikethroughTokens: "50M tokens",
    description: "Perfect for heavy users looking to enhance daily workflows.",
  },
  {
    name: "Pro 200",
    monthly: 200,
    annual: 166.67,
    tokens: "120M tokens",
    strikethroughTokens: "100M tokens",
    description: "Best for power users relying on Bolt as a core tool for continuous use.",
  },
];

export default function Pricing() {
  const [billingType, setBillingType] = useState("monthly");
  const {UserDetails} = useContext(Context)
  return (
    <div className="bg-black text-white w-full p-6">
      <div className="w-full">
        <h2 className="text-4xl font-bold text-center mb-4">Pricing</h2>
        <p className="text-center text-gray-400 mb-6">
          Start with a free account to speed up your workflow on public projects or boost your entire team with instantly-opening production environments.
        </p>

        <div className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center mb-8 w-full">
          <span className="text-white mb-2 sm:mb-0">🔒 {UserDetails?.token} tokens left.</span>
          <span className="text-gray-300 text-sm">
            Need more tokens? <a href="#" className="underline">Upgrade your plan below</a>
          </span>
        </div>

        <div className="flex justify-center items-center space-x-4 mb-6">
          <button
            onClick={() => setBillingType("monthly")}
            className={`px-4 py-2 rounded-full font-medium ${
              billingType === "monthly" ? "bg-white text-black" : "bg-gray-700 text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingType("annual")}
            className={`px-4 py-2 rounded-full font-medium ${
              billingType === "annual" ? "bg-white text-black" : "bg-gray-700 text-white"
            }`}
          >
            Annual Billing <span className="text-green-400 text-sm ml-1">(Save 20%)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {pricingPlans.map((plan, index) => {
            const price = billingType === "monthly" ? plan.monthly : plan.annual;
            return (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-2xl shadow-md flex flex-col justify-between w-full"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold mb-1">{plan.tokens}</p>
                  {plan.strikethroughTokens && (
                    <p className="text-gray-500 line-through text-sm mb-2">{plan.strikethroughTokens}</p>
                  )}
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">
                    ${price.toFixed(2)} <span className="text-sm text-gray-400">/{billingType}</span>
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                    Upgrade to {plan.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
