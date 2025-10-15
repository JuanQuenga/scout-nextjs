"use client";

import { useState } from "react";
import {
  Command,
  MousePointer,
  Gamepad2,
  Settings,
  Search,
  ExternalLink,
  Copy,
  CheckCircle,
  Github,
  TrendingUp,
  Barcode,
  Shield,
  Download,
  Pin,
  ArrowRight,
} from "lucide-react";
import { GradientBackground } from "../components/GradientBackground";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Component to render text with keyboard shortcuts
const renderTextWithKbd = (text: string) => {
  const parts = text.split(
    /(CMD\+Shift\+K|CTRL\+Shift\+K|CMD\+K|CTRL\+K|Tab|Enter|CMD|CTRL|Shift|K|eb|arrow keys)/
  );

  return parts.map((part, index) => {
    if (
      [
        "CMD+Shift+K",
        "CTRL+Shift+K",
        "CMD+K",
        "CTRL+K",
        "CMD",
        "CTRL",
        "Shift",
        "K",
        "Tab",
        "Enter",
        "ebay",
        "upc",
        "price charting",
        "arrow keys",
      ].includes(part)
    ) {
      return <kbd key={index}>{part}</kbd>;
    }
    return part;
  });
};

export default function HomePage() {
  // Updated Chrome Web Store URL
  const chromeWebStoreUrl =
    "https://chromewebstore.google.com/detail/scout/bmgghhmlflbhlnomgnoodpidekpaaifk?authuser=0&hl=en";

  const mainFeatures = [
    {
      id: 1,
      title: "Quick Actions",
      description:
        "Highlight text and instantly search for Sold Listings on eBay, MPN codes (Google), UPC codes (UPCItemDB & Google), or PriceCharting pricing data.",
      image: "/assets/images/quick-actions.png",
      icon: MousePointer,
      howToUse: [
        "Highlight/select the text for a product anywhere on the page.",
        "Right click the selection to open the context menu.",
        "Choose the search you need: Sold eBay Listings, UPC Item DB, Google UPC/MPN, or PriceCharting.",
      ],
    },
    {
      id: 2,
      title: "Command Menu",
      description:
        "Arc-style command palette for quick navigation, tab switching, and multi-provider search with 14 integrated search providers.",
      image: "/assets/images/command-menu.png",
      icon: Command,
      howToUse: [
        "Pin the Scout extension icon to your toolbar (or use CMD+Shift+K / CTRL+Shift+K).",
        "Click the Scout extension icon to open the command menu instantly.",
        "Type to filter through tabs, Scout Links, bookmarks, history, or search providers.",
        "Use Tab or arrow keys to navigate, hit Enter to select, or type a trigger word (like 'ebay' + Tab) to search.",
      ],
      subsections: [
        {
          title: "14 Search Providers",
          description:
            "Type a trigger word (like 'ebay', 'amazon', 'youtube') + Tab to activate a search provider, then type your query and hit Enter to search.",
          subSubsections: [
            {
              title: "E-commerce",
              description:
                "Amazon, Best Buy, eBay (sold listings), Home Depot, Lowe's, Menards, Micro Center, Price Charting",
            },
            {
              title: "General & Media",
              description: "Google, Scout Search, YouTube, GitHub, Twitter/X",
            },
            {
              title: "Product Data",
              description:
                "UPC Item DB (barcode lookup), eBay Taxonomy API (category suggestions)",
            },
          ],
        },
        {
          title: "Scout Links & Quick Navigation",
          description:
            "Access custom links from Google Sheets (30-min cache) with categories. Configure custom CSV URL in settings or download the template to create your own.",
        },
        {
          title: "Tab Switching & Bookmarks",
          description:
            "Switch between open tabs, access your 20 most recent bookmarks (with folder filtering), and browse last 30 visited pages.",
        },
        {
          title: "eBay Category API",
          description:
            "Live eBay category suggestions as you type. Click any category to copy the category ID to clipboard instantly.",
        },
      ],
    },
    {
      id: 3,
      title: "Built-In Controller Testing",
      description:
        "Real-time controller testing with visual feedback. Press CMD+J / CTRL+J to open the sidepanel and test any gamepad.",
      image: "/assets/images/controller-testing.png",
      icon: Gamepad2,
      features: [
        "Test all 20 buttons, analog sticks, and triggers with real-time visualization",
        "Color-coded feedback: Green (light input), Orange (medium input), Red (strong input)",
        "Customizable thresholds in settings for personalized sensitivity",
        "Auto-detects and connects to Xbox, PlayStation, and generic controllers",
        "SVG-based controller diagram with live input highlighting",
        "Automatically opens when a new controller is connected",
      ],
    },
    {
      id: 4,
      title: "eBay Price Summary",
      description:
        "Automatic price statistics displayed at the top of eBay sold listings pages. Get instant market insights without manual calculations.",
      image: "/assets/images/ebay-price-summary.png",
      icon: TrendingUp,
      features: [
        "Displays average, median, high, and low sale prices automatically",
        "Clickable metrics to jump to highest/lowest/latest sold items",
        "Quick filter buttons to view only new or used condition items",
        "Shows total item count for better market analysis",
        "Dismissible per search session to reduce clutter",
        "Toggle on/off in settings (enabled by default)",
      ],
    },
    {
      id: 5,
      title: "UPC Highlighter",
      description:
        "Automatically detects and highlights 12-digit UPC codes on any webpage. Click any highlighted code to copy it to your clipboard.",
      image: "/assets/images/upc-highlighter.png",
      icon: Barcode,
      features: [
        "Detects 12-digit UPC codes automatically across all websites",
        "Highlights codes with distinctive styling for easy identification",
        "Click-to-copy functionality with visual confirmation",
        "Hover tooltip shows 'Click to copy' instruction",
        "Works on dynamic content and AJAX-loaded pages",
        "Toggle on/off in settings (enabled by default)",
      ],
    },
    {
      id: 6,
      title: "Shopify Guardrails",
      description:
        "Automated validation checks for Shopify product pages to catch common errors before they cause problems.",
      image: "/assets/images/shopify-guardrails.png",
      icon: Shield,
      features: [
        "Condition Mismatch Check: Validates eBay condition ID matches Shopify condition",
        "Empty Google Fields Check: Alerts when required Google Shopping metafields are empty",
        "Visual indicators: Red border for condition mismatches, orange for empty fields",
        "Dismissible notifications with clear error descriptions",
        "Both checks can be toggled independently in settings",
        "Automatic refresh when settings are changed",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <img
                src="/assets/icons/dog.png"
                alt="Scout"
                className="w-8 h-8 rounded-lg invert"
              /> */}
              <span
                className={`${instrumentSerif.className} text-white text-5xl`}
              >
                scout
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={chromeWebStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-semibold uppercase text-sm"
              >
                TRY SCOUT
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Screen with gradient background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GradientBackground />

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <h1
            className={`${instrumentSerif.className} text-white text-center text-balance font-normal tracking-tight text-7xl md:text-8xl lg:text-9xl mb-8`}
          >
            reselling made easy
          </h1>

          <p className="text-white/80 text-center text-lg md:text-xl max-w-3xl mx-auto mb-8">
            A powerful Chrome extension built for resellers. Search multiple
            marketplaces instantly, test controllers in real-time, and access
            productivity tools designed to streamline your workflow.
          </p>

          <div className="flex justify-center">
            <a
              href="https://github.com/JuanQuenga/scout"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 flex items-center gap-3 group"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">Contribute on GitHub</span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 bg-gradient-to-b from-black via-gray-950 to-black"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Scout Features
            </h2>
          </div>

          {/* Main Features */}
          <div className="space-y-16 mb-16">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className="bg-gradient-to-br from-gray-900/80 via-gray-950/90 to-black/95 backdrop-blur-sm border border-blue-500/10 rounded-xl shadow-2xl p-8 hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <feature.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {feature.id}. {feature.title}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-300 mb-6">
                      {feature.description}
                    </p>

                    {/* How to Use, Subsections, or Features */}
                    <div className="space-y-4">
                      {feature.subsections ? (
                        <div className="space-y-4">
                          {feature.howToUse && (
                            <div>
                              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-blue-400" />
                                How To Use
                              </h4>
                              <ul className="space-y-2">
                                {feature.howToUse.map((step, stepIndex) => (
                                  <li
                                    key={stepIndex}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center justify-center mt-0.5 border border-blue-500/30">
                                      {stepIndex + 1}
                                    </span>
                                    <span className="text-gray-300 text-sm flex flex-wrap items-center gap-1">
                                      {renderTextWithKbd(step)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {feature.subsections.map((subsection, subIndex) => (
                            <div
                              key={subIndex}
                              className="border-l-2 border-blue-500/50 pl-4"
                            >
                              <h5 className="font-semibold text-white mb-2 text-sm">
                                {subsection.title}
                              </h5>
                              <p className="text-gray-300 text-sm flex flex-wrap items-center gap-1">
                                {renderTextWithKbd(subsection.description)}
                              </p>
                              {subsection.subSubsections && (
                                <div className="mt-3 ml-4 space-y-3">
                                  {subsection.subSubsections.map(
                                    (subSub, subSubIndex) => (
                                      <div
                                        key={subSubIndex}
                                        className="border-l-2 border-blue-400/40 pl-3"
                                      >
                                        <h6 className="font-medium text-gray-200 mb-1 text-xs">
                                          {subSub.title}
                                        </h6>
                                        <p className="text-gray-400 text-xs flex flex-wrap items-center gap-1">
                                          {renderTextWithKbd(
                                            subSub.description
                                          )}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : feature.howToUse ? (
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                            How To Use
                          </h4>
                          <ul className="space-y-2">
                            {feature.howToUse.map((step, stepIndex) => (
                              <li
                                key={stepIndex}
                                className="flex items-start gap-3"
                              >
                                <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center justify-center mt-0.5 border border-blue-500/30">
                                  {stepIndex + 1}
                                </span>
                                <span className="text-gray-300 text-sm flex flex-wrap items-center gap-1">
                                  {renderTextWithKbd(step)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-white mb-3">
                            Features
                          </h4>
                          <ul className="list-disc list-inside space-y-2">
                            {feature.features?.map(
                              (featureItem, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="text-gray-300 text-sm"
                                >
                                  {featureItem}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-blue-500/10">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto rounded-lg shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Open Source CTA Section */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-950/90 to-black/95 backdrop-blur-sm border border-blue-500/10 rounded-xl p-8 mb-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Github className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  Open Source & Open for Contributions
                </h3>
              </div>
              <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
                Scout is open source and built by the community. We welcome
                contributions from developers of all skill levels. Whether you
                want to fix a bug, add a feature, or improve documentation, we'd
                love your help.
              </p>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-left max-w-2xl mx-auto mb-6 border border-blue-500/10">
                <h4 className="text-xl font-semibold text-white mb-4">
                  Ways to Contribute
                </h4>
                <ul className="list-disc list-inside space-y-3 mb-6">
                  <li className="text-gray-300">
                    Report bugs or request features on GitHub Issues
                  </li>
                  <li className="text-gray-300">
                    Submit pull requests with bug fixes or new features
                  </li>
                  <li className="text-gray-300">
                    Help improve documentation and write guides
                  </li>
                  <li className="text-gray-300">
                    Share feedback and suggestions for improvement
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <a
                  href="https://github.com/JuanQuenga/scout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 border border-blue-500/30"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-blue-500/20 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/icons/dog.png"
                alt="Scout"
                className="w-8 h-8 rounded-lg invert"
              />
              <div>
                <p className="text-sm font-medium text-white">Scout</p>
                <p className="text-xs text-gray-400">Chrome Extension</p>
              </div>
            </div>
            <a
              href="https://github.com/JuanQuenga/scout"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>Made with ❤️ by Juan Quenga</span>
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
