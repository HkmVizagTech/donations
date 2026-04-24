"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function CheckoutPage({
  donation,
  embedded = false,
  onClose
}) {
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState(
    donation.numericAmount ? String(donation.numericAmount) : ""
  );
  const [needs80G, setNeeds80G] = useState(false);
  const [wantsPrasadam, setWantsPrasadam] = useState(false);
  const [prasadamSameAddress, setPrasadamSameAddress] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [sevaInNameOf, setSevaInNameOf] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [prasadamAddress, setPrasadamAddress] = useState("");
  const [prasadamCity, setPrasadamCity] = useState("");
  const [prasadamState, setPrasadamState] = useState("");
  const [prasadamPincode, setPrasadamPincode] = useState("");

  const displayAmount = useMemo(() => {
    if (donation.numericAmount > 0) {
      return donation.amount;
    }

    const parsed = Number(customAmount.replace(/[^\d]/g, ""));
    return parsed ? `Rs. ${parsed.toLocaleString("en-IN")}` : "Enter amount";
  }, [customAmount, donation.amount, donation.numericAmount]);

  const finalAmount = useMemo(() => {
    if (donation.numericAmount > 0) {
      return donation.numericAmount;
    }
    return Number(customAmount.replace(/[^\d]/g, "")) || 0;
  }, [customAmount, donation.numericAmount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !mobile.trim() || !email.trim()) {
      setErrorMessage("Please fill in all required fields: name, mobile, and email.");
      return;
    }

    if (!finalAmount || finalAmount < 1) {
      setErrorMessage("Please enter a valid donation amount.");
      return;
    }

    if (needs80G) {
      if (!panNumber.trim()) {
        setErrorMessage("PAN number is required for 80G certificate.");
        return;
      }
      if (!address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
        setErrorMessage("Complete address is required for 80G certificate.");
        return;
      }
    }

    if (wantsPrasadam && !prasadamSameAddress) {
      if (!prasadamAddress.trim() || !prasadamCity.trim() || !prasadamState.trim() || !prasadamPincode.trim()) {
        setErrorMessage("Complete prasadam delivery address is required.");
        return;
      }
    }

    setErrorMessage("");
    setIsProcessing(true);

    try {
      // Create order on backend
      const orderResponse = await fetch(`${BACKEND_API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          Akshaya_tritiya: true,
          type: donation.title,
          sevaName: donation.title,
          occasion: "Akshaya Tritiya",
          sevaDate: new Date().toISOString().slice(0, 10),
          dob: new Date().toISOString().slice(0, 10),
          amount: finalAmount,
          certificate: needs80G,
          panNumber: needs80G ? panNumber.trim() : "",
          address: needs80G ? address.trim() : "",
          city: needs80G ? city.trim() : "",
          state: needs80G ? state.trim() : "",
          pincode: needs80G ? pincode.trim() : "",
          mahaprasadam: wantsPrasadam,
          prasadamAddressOption: wantsPrasadam ? (prasadamSameAddress ? "same" : "different") : "same",
          prasadamAddress: wantsPrasadam && !prasadamSameAddress ? prasadamAddress.trim() : "",
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: finalAmount * 100,
        currency: "INR",
        name: "ISKCON Gambheeram",
        description: `Donation for ${donation.title}`,
        order_id: orderData.orderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: mobile.trim(),
        },
        notes: {
          donationId: orderData.donationId,
          sevaType: donation.title,
        },
        theme: {
          color: "#FF9933",
        },
        handler: function (response) {
          // Payment successful
          router.push(`/thank-you?paymentId=${response.razorpay_payment_id}&amount=${finalAmount}&seva=${encodeURIComponent(donation.title)}`);
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error.message || "Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className={`checkout-page${embedded ? " checkout-page-embedded" : ""}`}>
      {embedded ? (
        <section className="container-wide embedded-checkout-header">
          <div>
            <p className="checkout-eyebrow">Fast Checkout</p>
            <h2 className="embedded-checkout-title">Complete your offering without leaving this page</h2>
          </div>
          {onClose ? (
            <button type="button" className="embedded-checkout-close" onClick={onClose}>
              Close
            </button>
          ) : null}
        </section>
      ) : null}

      <section className="checkout-hero">
        <div className="container-wide checkout-hero-inner">
          <div>
            <p className="checkout-eyebrow">Donation Checkout</p>
            <h1>Complete Your Seva Offering</h1>
            <p className="checkout-hero-text">
              Fill your donor details exactly once and continue with Razorpay to
              complete your offering for this seva.
            </p>
          </div>

          <div className={`checkout-summary-card checkout-summary-${donation.variant}`}>
            <span className="checkout-summary-tag">{donation.sectionTitle}</span>
            <h2>{donation.title}</h2>
            <p>Offering amount</p>
            <strong>{displayAmount}</strong>
          </div>
        </div>
      </section>

      <section className="container-wide checkout-grid">
        <div className="checkout-panel">
          <div className="checkout-panel-header">
            <p className="checkout-eyebrow">Donor Details</p>
            <h3>Donor information</h3>
          </div>

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            <div className="checkout-field-grid">
              <label className="checkout-field">
                <input 
                  type="text" 
                  placeholder="Donor Name" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="checkout-field">
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  required 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </label>
            </div>

            <div className="checkout-field-grid">
              <label className="checkout-field">
                <input 
                  type="email" 
                  placeholder="E-Mail ID" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="checkout-field">
                <input 
                  type="text" 
                  placeholder="PAN Number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  required={needs80G}
                />
              </label>
            </div>

            <div className="checkout-field-grid">
              <label className="checkout-field">
                <input 
                  type="text" 
                  placeholder="Seva In The Name Of"
                  value={sevaInNameOf}
                  onChange={(e) => setSevaInNameOf(e.target.value)}
                />
              </label>
              <label className="checkout-field">
                <input
                  type="text"
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                  placeholder="Donation Amount"
                  disabled={donation.numericAmount > 0}
                />
              </label>
            </div>

            <div className="checkout-panel-header compact">
              <p className="checkout-eyebrow">Payment Option</p>
              <h3>Only Indian citizens are accepted</h3>
            </div>

            <div className="checkout-payment-rule">
              <strong>Indian Citizens Only</strong>
              <p>We do not accept foreign funds through this donation flow.</p>
            </div>

            <div className="checkout-check-options">
              <label className="checkout-check-card">
                <input
                  type="checkbox"
                  checked={needs80G}
                  onChange={(event) => setNeeds80G(event.target.checked)}
                />
                <div>
                  <strong>80G required</strong>
                  <p>Enable this if you want 80G tax exemption details on the donation.</p>
                </div>
              </label>

              <label className="checkout-check-card">
                <input
                  type="checkbox"
                  checked={wantsPrasadam}
                  onChange={(event) => setWantsPrasadam(event.target.checked)}
                />
                <div>
                  <strong>Receive Maha Prasadam</strong>
                  <p>I would like to receive Maha Prasadam (Only within India).</p>
                </div>
              </label>
            </div>

            {needs80G ? (
              <div className="checkout-conditional-block">
                <div className="checkout-panel-header compact">
                  <p className="checkout-eyebrow">80G Details</p>
                  <h3>Billing address for 80G receipt</h3>
                </div>

                <p className="checkout-note">
                  80G will be there only for donations of Rs. 1000 and above.
                  PAN and address are mandatory for 80G processing.
                </p>

                <label className="checkout-field">
                  <textarea
                    rows="4"
                    placeholder="80G Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required={needs80G}
                  />
                </label>

                <div className="checkout-field-grid">
                  <label className="checkout-field">
                    <input 
                      type="text" 
                      placeholder="City" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required={needs80G} 
                    />
                  </label>
                  <label className="checkout-field">
                    <select 
                      defaultValue="" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required={needs80G}
                    >
                      <option value="" disabled>
                        State
                      </option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="checkout-field-grid single-compact">
                  <label className="checkout-field">
                    <input 
                      type="text" 
                      placeholder="Pincode" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required={needs80G} 
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {wantsPrasadam ? (
              <div className="checkout-conditional-block">
                <div className="checkout-panel-header compact">
                  <p className="checkout-eyebrow">Maha Prasadam</p>
                  <h3>Prasadam delivery details</h3>
                </div>

                {needs80G ? (
                  <>
                    <div className="checkout-inline-choice">
                      <label className="checkout-radio-card">
                        <input
                          type="radio"
                          name="prasadamAddressChoice"
                          checked={prasadamSameAddress}
                          onChange={() => setPrasadamSameAddress(true)}
                        />
                        <span>Address same as above</span>
                      </label>

                      <label className="checkout-radio-card">
                        <input
                          type="radio"
                          name="prasadamAddressChoice"
                          checked={!prasadamSameAddress}
                          onChange={() => setPrasadamSameAddress(false)}
                        />
                        <span>Use different address</span>
                      </label>
                    </div>

                    {!prasadamSameAddress ? (
                      <>
                        <label className="checkout-field">
                          <textarea
                            rows="4"
                            placeholder="Prasadam Address"
                            value={prasadamAddress}
                            onChange={(e) => setPrasadamAddress(e.target.value)}
                            required={wantsPrasadam && !prasadamSameAddress}
                          />
                        </label>

                        <div className="checkout-field-grid">
                          <label className="checkout-field">
                            <input
                              type="text"
                              placeholder="City"
                              value={prasadamCity}
                              onChange={(e) => setPrasadamCity(e.target.value)}
                              required={wantsPrasadam && !prasadamSameAddress}
                            />
                          </label>
                          <label className="checkout-field">
                            <select
                              defaultValue=""
                              value={prasadamState}
                              onChange={(e) => setPrasadamState(e.target.value)}
                              required={wantsPrasadam && !prasadamSameAddress}
                            >
                              <option value="" disabled>
                                State
                              </option>
                              {indianStates.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="checkout-field-grid single-compact">
                          <label className="checkout-field">
                            <input
                              type="text"
                              placeholder="Pincode"
                              value={prasadamPincode}
                              onChange={(e) => setPrasadamPincode(e.target.value)}
                              required={wantsPrasadam && !prasadamSameAddress}
                            />
                          </label>
                        </div>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <label className="checkout-field">
                      <textarea
                        rows="4"
                        placeholder="Prasadam Address"
                        required={wantsPrasadam}
                      />
                    </label>

                    <div className="checkout-field-grid">
                      <label className="checkout-field">
                        <input
                          type="text"
                          placeholder="City"
                          required={wantsPrasadam}
                        />
                      </label>
                      <label className="checkout-field">
                        <select defaultValue="" required={wantsPrasadam}>
                          <option value="" disabled>
                            State
                          </option>
                          {indianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="checkout-field-grid single-compact">
                      <label className="checkout-field">
                        <input
                          type="text"
                          placeholder="Pincode"
                          required={wantsPrasadam}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            ) : null}

            <div className="checkout-payment-box">
              <div>
                <p className="checkout-eyebrow">Payment Method</p>
                <h4>Razorpay</h4>
                <p>
                  Cards, UPI, net banking, wallets, and other supported payment methods
                </p>
              </div>
              <span className="checkout-payment-tag">Secure</span>
            </div>

            {errorMessage && (
              <div className="checkout-error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="checkout-submit"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Continue To Razorpay"}
            </button>
          </form>
        </div>

        <aside className="checkout-sidebar">
          <div className={`checkout-sidebar-card checkout-sidebar-${donation.variant}`}>
            <p className="checkout-eyebrow">Order Summary</p>
            <h3>{donation.title}</h3>
            <ul>
              <li>
                <span>Seva Category</span>
                <strong>{donation.sectionTitle}</strong>
              </li>
              <li>
                <span>Offering Amount</span>
                <strong>{displayAmount}</strong>
              </li>
              <li>
                <span>Payment Method</span>
                <strong>Razorpay</strong>
              </li>
              <li>
                <span>Payment Option</span>
                <strong>Indian Citizen</strong>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
