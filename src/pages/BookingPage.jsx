import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  ShieldIcon,
} from "lucide-react";
import { getCurrentUser } from "../lib/auth.js";
import {
  bookingsAPI,
  calculateNights,
  calculatePricing,
  roomsAPI,
} from "../lib/api.js";

const PAYMENT_METHODS = [
  { id: "CARD", label: "Credit/Debit Card", icon: "💳" },
  { id: "UPI", label: "UPI Payment", icon: "📱" },
  { id: "GPAY", label: "Google Pay", icon: "🟦" },
  { id: "PHONEPE", label: "PhonePe", icon: "🟣" },
  { id: "PAYTM", label: "Paytm", icon: "🔵" },
  { id: "CASH", label: "Cash at Hotel", icon: "💵" },
  { id: "BANK_TRANSFER", label: "Bank Transfer", icon: "🏦" },
];

export function BookingPage() {
  const e = useNavigate(),
    { roomId: t } = useParams(),
    [r] = useSearchParams(),
    [n, l] = useState("details"),
    [o, u] = useState(null),
    [d, m] = useState(false),
    [h, g] = useState(null),
    p = new Date().toISOString().split("T")[0],
    b = new Date(Date.now() + 864e5).toISOString().split("T")[0],
    [S, w] = useState(r.get("checkIn") || p),
    [N, j] = useState(r.get("checkOut") || b),
    [A, C] = useState(Number(r.get("guests")) || 2),
    [E, D] = useState(0),
    [P, k] = useState(""),
    [_, L] = useState(""),
    [M, H] = useState(""),
    [X, R] = useState(""),
    [$, J] = useState("India"),
    [ie, G] = useState("Aadhaar"),
    [te, se] = useState(""),
    [de, pe] = useState("CARD"),
    [z, Z] = useState(""),
    [ae, ce] = useState(""),
    [be, je] = useState(""),
    Ae = getCurrentUser();
  (useEffect(() => {
    Ae && (L(Ae.name), H(Ae.email));
  }, []),
    useEffect(() => {
      t ? ze() : le();
    }, [t]));
  const ze = async () => {
      if (!t) return;
      const ue = await roomsAPI.getById(t);
      ue && u(ue);
    },
    le = async () => {
      const ue = await roomsAPI.getAvailability(S, N);
      ue.length > 0 && u(ue[0]);
    },
    oe = o ? calculatePricing(o, S, N) : null,
    Ee = S && N ? calculateNights(S, N) : 0,
    ne = [
      { id: "details", label: "Room Details" },
      { id: "guest", label: "Guest Info" },
      { id: "payment", label: "Payment" },
      { id: "confirmation", label: "Confirmation" },
    ],
    _t = () => {
      if (!S || !N || new Date(N) <= new Date(S)) {
        toast.error("Please select valid check-in and check-out dates");
        return;
      }
      if (!Ae) {
        (sessionStorage.setItem(
          "booking_intent",
          JSON.stringify({
            roomId: o?.id,
            checkIn: S,
            checkOut: N,
            adults: A,
            children: E,
          }),
        ),
          e("/register?redirect=/book/" + o?.id));
        return;
      }
      l("guest");
    },
    ke = () => {
      if (!_ || !M || !X) {
        toast.error("Please fill in all required guest details");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(M)) {
        toast.error("Please enter a valid email address");
        return;
      }
      l("payment");
    },
    kt = async () => {
      if (!(!o || !oe)) {
        m(true);
        try {
          const ue = await bookingsAPI.create({
            guestData: {
              name: _,
              email: M,
              phone: X,
              country: $,
              idType: ie,
              idNumber: te,
            },
            roomId: o.id,
            checkIn: S,
            checkOut: N,
            adults: A,
            children: E,
            specialRequests: P,
            source: "Online",
            paymentMethod: de,
          });
          (g(ue), l("confirmation"), toast.success("Booking confirmed! 🎉"));
        } catch (ue) {
          toast.error(ue.message || "Booking failed. Please try again.");
        } finally {
          m(false);
        }
      }
    },
    wt = ne.findIndex((ue) => ue.id === n);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center gap-4">
        <button
          onClick={() => e("/")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-gray-900">Auralis</span>
        </div>
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="flex items-center gap-2">
            {ne.map((ue, dn) => (
              <div className="flex items-center gap-2" key={ue.id}>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${dn < wt ? "bg-green-100 text-green-700" : dn === wt ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}
                >
                  {dn < wt ? (
                    <CheckIcon className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center bg-current text-white text-xs">
                      {dn + 1}
                    </span>
                  )}
                  {ue.label}
                </div>
                {dn < ne.length - 1 && (
                  <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {n !== "confirmation" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {n === "details" && o && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {"Room Details & Dates"}
                  </h2>
                  <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                    <div className="h-40 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <span className="text-6xl">🏨</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">
                          {o.type}
                          {" Room "}
                          {o.number}
                        </h3>
                        <span className="text-amber-700 bg-amber-50 text-xs px-2 py-1 rounded-full font-medium">
                          {"Floor "}
                          {o.floor}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">
                        {o.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {o.amenities.slice(0, 6).map((ue) => (
                          <span
                            className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded"
                            key={ue}
                          >
                            {ue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-In Date
                      </label>
                      <input
                        type="date"
                        value={S}
                        min={p}
                        onChange={(ue) => w(ue.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-Out Date
                      </label>
                      <input
                        type="date"
                        value={N}
                        min={S}
                        onChange={(ue) => j(ue.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adults
                      </label>
                      <select
                        value={A}
                        onChange={(ue) => C(Number(ue.target.value))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white"
                      >
                        {[1, 2, 3, 4].map((ue) => (
                          <option value={ue} key={ue}>
                            {ue}
                            {" Adult"}
                            {ue > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Children
                      </label>
                      <select
                        value={E}
                        onChange={(ue) => D(Number(ue.target.value))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white"
                      >
                        {[0, 1, 2, 3].map((ue) => (
                          <option value={ue} key={ue}>
                            {ue}
                            {" Child"}
                            {ue !== 1 ? "ren" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={P}
                      onChange={(ue) => k(ue.target.value)}
                      placeholder="E.g., High floor, extra pillows, early check-in..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none"
                    />
                  </div>
                  <button
                    onClick={_t}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {"Continue to Guest Details "}
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                  {!Ae && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      You'll be asked to create an account to complete the
                      booking
                    </p>
                  )}
                </div>
              )}
              {n === "guest" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Guest Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        value={_}
                        onChange={(ue) => L(ue.target.value)}
                        placeholder="As per ID proof"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={M}
                        onChange={(ue) => H(ue.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        value={X}
                        onChange={(ue) => R(ue.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={$}
                        onChange={(ue) => J(ue.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white"
                      >
                        {[
                          "India",
                          "USA",
                          "UK",
                          "UAE",
                          "Singapore",
                          "Australia",
                          "Canada",
                          "Other",
                        ].map((ue) => (
                          <option value={ue} key={ue}>
                            {ue}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Type
                      </label>
                      <select
                        value={ie}
                        onChange={(ue) => G(ue.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white"
                      >
                        {[
                          "Aadhaar",
                          "PAN Card",
                          "Passport",
                          "Driving License",
                          "Voter ID",
                        ].map((ue) => (
                          <option value={ue} key={ue}>
                            {ue}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Number
                      </label>
                      <input
                        value={te}
                        onChange={(ue) => se(ue.target.value)}
                        placeholder="Enter ID number"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => l("details")}
                      className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={ke}
                      className="flex-2 flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      {"Continue to Payment "}
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              {n === "payment" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Payment
                  </h2>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {PAYMENT_METHODS.map((ue) => (
                      <button
                        onClick={() => pe(ue.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${de === ue.id ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-amber-300"}`}
                        key={ue.id}
                      >
                        <span className="text-2xl">{ue.icon}</span>
                        <span
                          className={`text-sm font-medium ${de === ue.id ? "text-amber-700" : "text-gray-700"}`}
                        >
                          {ue.label}
                        </span>
                        {de === ue.id && (
                          <CheckIcon className="w-4 h-4 text-amber-500 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  {de === "CARD" && (
                    <div className="space-y-3 mb-6">
                      <input
                        value={z}
                        onChange={(ue) =>
                          Z(ue.target.value.replace(/\D/g, "").slice(0, 16))
                        }
                        placeholder="Card Number (16 digits)"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                      <input
                        value={ae}
                        onChange={(ue) => ce(ue.target.value)}
                        placeholder="Cardholder Name"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="MM/YY"
                          className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                        />
                        <input
                          placeholder="CVV"
                          className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                        />
                      </div>
                    </div>
                  )}
                  {(de === "UPI" ||
                    de === "GPAY" ||
                    de === "PHONEPE" ||
                    de === "PAYTM") && (
                    <div className="mb-6">
                      <input
                        value={be}
                        onChange={(ue) => je(ue.target.value)}
                        placeholder="Enter UPI ID (e.g., name@upi)"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                      />
                    </div>
                  )}
                  {de === "CASH" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                      💡 Cash payment will be collected at the hotel front desk
                      during check-in.
                    </div>
                  )}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2 text-green-700 text-sm">
                    <ShieldIcon className="w-4 h-4 flex-shrink-0" />
                    Your payment is secured with 256-bit SSL encryption
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => l("guest")}
                      className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={kt}
                      disabled={d}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {d ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {" Processing..."}
                        </>
                      ) : (
                        <>
                          {"Confirm & Pay ₹"}
                          {oe?.netAmount.toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {o && oe && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-4">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Booking Summary
                  </h3>
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white mb-4">
                    <p className="text-amber-100 text-sm">
                      {"Room "}
                      {o.number}
                      {" • Floor "}
                      {o.floor}
                    </p>
                    <p className="font-bold text-lg mt-1">
                      {o.type}
                      {" Room"}
                    </p>
                    <p className="text-amber-100 text-sm">
                      {o.bedType}
                      {" Bed • "}
                      {o.area}
                      {" m²"}
                    </p>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Check-in</span>
                      <span className="font-medium">
                        {new Date(S + "T14:00").toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Check-out</span>
                      <span className="font-medium">
                        {new Date(N + "T12:00").toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium">
                        {Ee}
                        {" night"}
                        {Ee !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Guests</span>
                      <span className="font-medium">
                        {A}
                        {" adult"}
                        {A !== 1 ? "s" : ""}
                        {E > 0 ? `, ${E} child` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        ₹{o.pricePerNight.toLocaleString()}
                        {" × "}
                        {Ee}
                        {" nights"}
                      </span>
                      <span>₹{oe.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>GST (18%)</span>
                      <span>₹{oe.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-amber-600">
                        ₹{oe.netAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                      Free cancellation before check-in
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                      Instant booking confirmation
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                      Invoice generated automatically
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {n === "confirmation" && h && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-green-100">
                  Your reservation has been successfully created
                </p>
                <div className="mt-4 bg-white/20 rounded-xl px-6 py-3 inline-block">
                  <p className="text-sm text-green-100">Booking Number</p>
                  <p className="text-2xl font-bold">
                    {h.booking?.bookingNumber}
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Room</p>
                    <p className="font-bold text-gray-900">
                      {h.booking?.room?.type}
                      {" Room "}
                      {h.booking?.room?.number}
                    </p>
                    <p className="text-sm text-gray-500">
                      {"Floor "}
                      {h.booking?.room?.floor}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Guest</p>
                    <p className="font-bold text-gray-900">{_}</p>
                    <p className="text-sm text-gray-500">{M}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Check-In</p>
                    <p className="font-bold text-gray-900">
                      {new Date(S + "T00:00").toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">After 2:00 PM</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Check-Out</p>
                    <p className="font-bold text-gray-900">
                      {new Date(N + "T00:00").toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">Before 12:00 PM</p>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">
                      Payment Details
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      PAID
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Amount Paid</span>
                      <span className="font-bold text-gray-900">
                        ₹{h.booking?.netAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Method</span>
                      <span>{de}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Transaction ID</span>
                      <span className="font-mono text-xs">
                        {h.payment?.transactionId}
                      </span>
                    </div>
                    {h.invoice && (
                      <div className="flex justify-between text-gray-600">
                        <span>Invoice Number</span>
                        <span className="font-mono text-xs">
                          {h.invoice.invoiceNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => e("/my-bookings")}
                    className="border border-amber-500 text-amber-600 py-3 rounded-xl font-semibold hover:bg-amber-50"
                  >
                    View My Bookings
                  </button>
                  <button
                    onClick={() => e("/")}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90"
                  >
                    Back to Home
                  </button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 flex items-start gap-2">
                  <ClockIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">What's Next?</p>
                    <ul className="space-y-1 text-blue-600">
                      <li>
                        • A confirmation has been recorded in your account
                      </li>
                      <li>• Present your booking number at check-in</li>
                      <li>• Bring a valid government ID for verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
