import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AwardIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  StarIcon,
  WifiIcon,
} from "lucide-react";
import { roomsAPI } from "../lib/api.js";
import {
  ROOM_TYPE_BADGE,
  ROOM_TYPE_EMOJI,
  ROOM_TYPE_GRADIENT,
} from "../lib/constants.js";

export function LandingPage() {
  const e = useNavigate(),
    [t, r] = useState(""),
    [n, l] = useState(""),
    [o, u] = useState(2),
    [d, m] = useState([]),
    [h, g] = useState([]),
    [p, b] = useState(false),
    [S, w] = useState(false),
    N = new Date().toISOString().split("T")[0],
    j = new Date(Date.now() + 864e5).toISOString().split("T")[0];
  useEffect(() => {
    (r(N), l(j), A());
  }, []);
  const A = async () => {
      const P = await roomsAPI.getAll();
      g(P.slice(0, 6));
    },
    C = async () => {
      if (!(!t || !n)) {
        b(true);
        try {
          const P = await roomsAPI.getAvailability(t, n);
          (m(P), w(true));
        } finally {
          b(false);
        }
      }
    },
    E = (P) => {
      e(`/book/${P.id}?checkIn=${t}&checkOut=${n}&guests=${o}`);
    },
    D = S ? d : h;
  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-none">
              Auralis
            </h1>
            <p className="text-amber-200 text-xs">{"Luxury Hotel & Resorts"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => e("/book")}
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            Browse Rooms
          </button>
          <button
            onClick={() => e("/login")}
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => e("/book")}
            className="bg-white text-amber-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-amber-50 transition-colors"
          >
            Book Now
          </button>
        </div>
      </nav>
      <div className="relative h-[85vh] bg-gradient-to-br from-slate-900 via-amber-900/40 to-slate-900 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 50 }).map((P, k) => (
            <div
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              key={k}
            />
          ))}
        </div>
        <div className="relative text-center px-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <StarIcon className="w-4 h-4 fill-current" />
            {" 5-Star Luxury Experience"}
          </div>
          <h1
            className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Where Every Stay
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Becomes a Memory
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Experience unparalleled luxury at Auralis. From intimate standard
            rooms to lavish penthouses, every space is crafted for extraordinary
            moments.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => e("/book")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-amber-500/30"
            >
              Explore Rooms
            </button>
            <button className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
              Virtual Tour
            </button>
          </div>
        </div>
        <div className="relative w-full max-w-4xl px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Check In
                </label>
                <input
                  type="date"
                  value={t}
                  min={N}
                  onChange={(P) => r(P.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Check Out
                </label>
                <input
                  type="date"
                  value={n}
                  min={t || N}
                  onChange={(P) => l(P.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Guests
                </label>
                <select
                  value={o}
                  onChange={(P) => u(Number(P.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((P) => (
                    <option value={P} key={P}>
                      {P} {P === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={C}
                disabled={p}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {p ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Check Availability</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Luxury Rooms", value: "38+" },
            { label: "Happy Guests", value: "25K+" },
            { label: "Years of Excellence", value: "15+" },
            { label: "Star Rating", value: "5 ⭐" },
          ].map((P) => (
            <div className="text-center text-white" key={P.label}>
              <div className="text-2xl font-bold">{P.value}</div>
              <div className="text-amber-100 text-sm">{P.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {S ? `${d.length} Rooms Available` : "Our Rooms & Suites"}
          </h2>
          <p className="text-gray-500 text-lg">
            {S
              ? `For ${t} to ${n} • ${o} guests`
              : "Each room is thoughtfully designed to provide comfort and elegance"}
          </p>
        </div>
        {S && d.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No rooms available
            </h3>
            <p className="text-gray-500 mb-6">
              Try different dates or number of guests
            </p>
            <button
              onClick={() => w(false)}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-600"
            >
              View All Rooms
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {D.map((P) => (
              <div
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                key={P.id}
              >
                <div
                  className={`h-48 bg-gradient-to-br ${ROOM_TYPE_GRADIENT[P.type]} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-30">
                      {ROOM_TYPE_EMOJI[P.type]}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ROOM_TYPE_BADGE[P.type]}`}
                    >
                      {P.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {"Floor "}
                      {P.floor}
                      {" • Room "}
                      {P.number}
                    </div>
                  </div>
                  {P.view && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white/80 text-xs">
                      <MapPinIcon className="w-3 h-3" />
                      {P.view}
                      {" View"}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {P.type}
                      {" Room"}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((k, _) => (
                        <StarIcon
                          className={`w-3.5 h-3.5 ${_ < 4 ? "text-amber-400 fill-current" : "text-gray-200"}`}
                          key={_}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {P.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span>
                      {"👥 "}
                      {P.maxOccupancy}
                      {" guests"}
                    </span>
                    <span>
                      {"🛏️ "}
                      {P.bedType}
                    </span>
                    <span>
                      {"📐 "}
                      {P.area}
                      {" m²"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {P.amenities.slice(0, 4).map((k) => (
                      <span
                        className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-lg"
                        key={k}
                      >
                        {k}
                      </span>
                    ))}
                    {P.amenities.length > 4 && (
                      <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-lg">
                        +{P.amenities.length - 4}
                        {" more"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{P.pricePerNight.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">/night</span>
                      <p className="text-xs text-gray-400">+ 18% GST</p>
                    </div>
                    <button
                      onClick={() => E(P)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-500/30"
                    >
                      {"Book Now "}
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!S && (
          <div className="text-center mt-10">
            <button
              onClick={() => e("/book")}
              className="border-2 border-amber-500 text-amber-600 px-8 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
            >
              {"View All Rooms & Suites"}
            </button>
          </div>
        )}
      </div>
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Why Choose Auralis?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldIcon,
                title: "Secure Booking",
                desc: "SSL encrypted & instant confirmation",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: AwardIcon,
                title: "5-Star Service",
                desc: "24/7 concierge & butler services",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: WifiIcon,
                title: "Smart Rooms",
                desc: "IoT automation & smart controls",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: ClockIcon,
                title: "Flexible Checkout",
                desc: "Late checkout available",
                color: "from-purple-500 to-pink-500",
              },
            ].map((P) => {
              const FeatureIcon = P.icon;
              return (
                <div
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                  key={P.title}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${P.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <FeatureIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{P.title}</h3>
                  <p className="text-gray-500 text-sm">{P.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-white font-bold text-lg">Auralis</span>
            </div>
            <p className="text-sm leading-relaxed">
              Luxury hotel management platform delivering world-class
              hospitality experiences.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => e("/book")}
                  className="hover:text-white transition-colors"
                >
                  Browse Rooms
                </button>
              </li>
              <li>
                <button
                  onClick={() => e("/login")}
                  className="hover:text-white transition-colors"
                >
                  Guest Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => e("/register")}
                  className="hover:text-white transition-colors"
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Room Service</li>
              <li>{"Spa & Wellness"}</li>
              <li>Fine Dining</li>
              <li>Event Hosting</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-amber-500" />
                <span>+91-1800-AURALIS</span>
              </div>
              <p>
                123 Luxury Avenue,
                <br />
                Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© 2024 Auralis Hotel Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
