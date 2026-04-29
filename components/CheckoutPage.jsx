"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { trackMetaCustomEvent, trackMetaEvent } from "@/lib/metaPixel";

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

function getStoredUtm() {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get("utm_source"),
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    content: params.get("utm_content"),
    term: params.get("utm_term")
  };

  if (Object.values(utm).some(Boolean)) {
    window.localStorage.setItem("utm", JSON.stringify(utm));
    return utm;
  }

  try {
    return JSON.parse(window.localStorage.getItem("utm"));
  } catch {
    return null;
  }
}

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage({ donation, embedded = false, onClose }) {
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState(
    donation.numericAmount ? String(donation.numericAmount) : ""
  );
  const [needs80G, setNeeds80G] = useState(false);
  const [wantsPrasadam, setWantsPrasadam] = useState(false);
  const [prasadamSameAddress, setPrasadamSameAddress] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dobInputType, setDobInputType] = useState("text");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
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

  const canShow80G = finalAmount >= 1000;
  const canShowPrasadam = finalAmount >= 1000;

  useEffect(() => {
    setCustomAmount(donation.numericAmount ? String(donation.numericAmount) : "");
    setNeeds80G(false);
    setWantsPrasadam(false);
    setPrasadamSameAddress(true);
    setIsProcessing(false);
    setErrorMessage("");
    setDobInputType("text");

    setName("");
    setMobile("");
    setDob("");
    setEmail("");
    setPanNumber("");
    setSevaInNameOf("");
    setAddress("");
    setCity("");
    setState("");
    setPincode("");
    setPrasadamAddress("");
    setPrasadamCity("");
    setPrasadamState("");
    setPrasadamPincode("");

    if (donation.numericAmount > 0) {
      trackMetaEvent("ViewContent", {
        content_name: donation.title,
        content_category: donation.sectionTitle,
        content_type: "donation",
        currency: "INR",
        value: donation.numericAmount
      });
      trackMetaCustomEvent("DonationCheckoutOpened", {
        content_name: donation.title,
        content_category: donation.sectionTitle,
        currency: "INR",
        value: donation.numericAmount
      });
    }
  }, [donation]);

  useEffect(() => {
    if (!canShow80G && needs80G) {
      setNeeds80G(false);
    }
  }, [canShow80G, needs80G]);

  useEffect(() => {
    if (!canShowPrasadam && wantsPrasadam) {
      setWantsPrasadam(false);
      setPrasadamSameAddress(true);
      setPrasadamAddress("");
      setPrasadamCity("");
      setPrasadamState("");
      setPrasadamPincode("");
    }
  }, [canShowPrasadam, wantsPrasadam]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!BACKEND_API_URL) {
      setErrorMessage("Backend API URL is missing. Please configure NEXT_PUBLIC_BACKEND_API_URL.");
      return;
    }

    if (!name.trim() || !mobile.trim()) {
      setErrorMessage("Please enter donor name and mobile number.");
      return;
    }

    if (!finalAmount || finalAmount < 1) {
      setErrorMessage("Please enter a valid donation amount.");
      return;
    }

    if (needs80G) {
      if (!panNumber.trim()) {
        setErrorMessage("PAN number is required for 80G.");
        return;
      }

      if (!address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
        setErrorMessage("Please complete the full 80G address details.");
        return;
      }
    }

    if (wantsPrasadam) {
      const needsSeparatePrasadamAddress = !needs80G || !prasadamSameAddress;

      if (
        needsSeparatePrasadamAddress &&
        (!prasadamAddress.trim() ||
          !prasadamCity.trim() ||
          !prasadamState.trim() ||
          !prasadamPincode.trim())
      ) {
        setErrorMessage("Please complete the prasadam delivery address.");
        return;
      }
    }

    setErrorMessage("");
    setIsProcessing(true);

    try {
      trackMetaEvent("AddPaymentInfo", {
        content_name: donation.title,
        content_category: donation.sectionTitle,
        content_type: "donation",
        currency: "INR",
        value: finalAmount
      });

      const finalPrasadamAddress =
        wantsPrasadam && needs80G && prasadamSameAddress ? address.trim() : prasadamAddress.trim();
      const finalPrasadamCity =
        wantsPrasadam && needs80G && prasadamSameAddress ? city.trim() : prasadamCity.trim();
      const finalPrasadamState =
        wantsPrasadam && needs80G && prasadamSameAddress ? state.trim() : prasadamState.trim();
      const finalPrasadamPincode =
        wantsPrasadam && needs80G && prasadamSameAddress ? pincode.trim() : prasadamPincode.trim();
      const utm = getStoredUtm();

      const orderResponse = await fetch(`${BACKEND_API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          dob,
          Akshaya_tritiya: true,
          type: donation.sectionTitle,
          sevaName: donation.sectionTitle,
          occasion: donation.sectionTitle,
          sevaDate: new Date().toISOString().slice(0, 10),
          amount: finalAmount,
          certificate: needs80G,
          panNumber: needs80G ? panNumber.trim() : "",
          address: needs80G ? address.trim() : "",
          city: needs80G ? city.trim() : "",
          state: needs80G ? state.trim() : "",
          pincode: needs80G ? pincode.trim() : "",
          inTheNameOf: sevaInNameOf.trim(),
          mahaprasadam: wantsPrasadam,
          prasadamAddressOption: wantsPrasadam
            ? needs80G && prasadamSameAddress
              ? "same"
              : "different"
            : "same",
          prasadamAddress: wantsPrasadam ? finalPrasadamAddress : "",
          prasadamCity: wantsPrasadam ? finalPrasadamCity : "",
          prasadamState: wantsPrasadam ? finalPrasadamState : "",
          prasadamPincode: wantsPrasadam ? finalPrasadamPincode : "",
          ...(utm ? { utm } : {})
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create payment order.");
      }

      const orderData = await orderResponse.json();
      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: finalAmount * 100,
        currency: "INR",
        name: "Hare Krishna Movement Vizag",
        description: `Donation for ${donation.sectionTitle}`,
        order_id: orderData.orderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: mobile.trim()
        },
        notes: {
          donationId: orderData.donationId,
          sevaType: donation.sectionTitle
        },
        theme: {
          color: "#d86d24"
        },
        async handler(response) {
          const paymentId = response.razorpay_payment_id || response.razorpay_subscription_id;

          try {
            const verificationResponse = await fetch(`${BACKEND_API_URL}/api/payment/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verificationResponse.ok) {
              const verificationPayload = await verificationResponse.json().catch(() => null);
              console.error("Payment verification failed:", verificationPayload || verificationResponse.status);
            }
          } catch (verificationError) {
            console.error("Payment verification request failed:", verificationError);
          }

          trackMetaEvent(
            "Purchase",
            {
              content_name: donation.title,
              content_category: donation.sectionTitle,
              content_type: "donation",
              currency: "INR",
              value: finalAmount,
              content_ids: paymentId ? [paymentId] : undefined
            },
            { eventID: paymentId }
          );

          router.push(
            `/thank-you?paymentId=${response.razorpay_payment_id}&amount=${finalAmount}&seva=${encodeURIComponent(
              donation.sectionTitle
            )}`
          );
        },
        modal: {
          ondismiss() {
            trackMetaCustomEvent("PaymentAbandoned", {
              content_name: donation.title,
              content_category: donation.sectionTitle,
              currency: "INR",
              value: finalAmount
            });
            setIsProcessing(false);
          }
        }
      });

      rzp.open();
      trackMetaEvent("InitiateCheckout", {
        content_name: donation.title,
        content_category: donation.sectionTitle,
        content_type: "donation",
        currency: "INR",
        value: finalAmount
      });
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
          <div />
          {onClose ? (
            <button type="button" className="embedded-checkout-close" onClick={onClose}>
              Close
            </button>
          ) : null}
        </section>
      ) : null}

      <section className="container-wide checkout-compact-wrap">
        <div className="checkout-panel checkout-panel-compact">
          <div className="checkout-compact-top">
            <div>
              <h3>{donation.title}</h3>
            </div>
            <div className={`checkout-compact-amount checkout-compact-${donation.variant}`}>
              <span>Amount</span>
              <strong>{displayAmount}</strong>
            </div>
          </div>

          <form className="checkout-form checkout-form-compact" onSubmit={handleSubmit}>
            <label className="checkout-field">
              <input
                type="text"
                placeholder="Donor Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label className="checkout-field">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                required
              />
            </label>

            <label className="checkout-field">
              <input
                type={dobInputType}
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                onFocus={() => setDobInputType("date")}
                onBlur={(event) => {
                  if (!event.target.value) {
                    setDobInputType("text");
                  }
                }}
                placeholder="Date of Birth (Optional)"
              />
            </label>

            <label className="checkout-field">
              <input
                type="email"
                placeholder="E-Mail ID (Optional)"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="checkout-field checkout-amount-field">
              <span className="checkout-field-caption">Donation Amount</span>
              <input
                type="text"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder="Enter Donation Amount"
                disabled={donation.numericAmount > 0}
                className="checkout-amount-input"
              />
            </label>

            <label className="checkout-field">
              <input
                type="text"
                placeholder="Seva In The Name Of"
                value={sevaInNameOf}
                onChange={(event) => setSevaInNameOf(event.target.value)}
              />
            </label>

            <div className="checkout-check-options">
              {canShow80G ? (
                <label className="checkout-check-card checkout-check-card-minimal">
                  <input
                    type="checkbox"
                    checked={needs80G}
                    onChange={(event) => setNeeds80G(event.target.checked)}
                  />
                  <div>
                    <strong>80G Required</strong>
                  </div>
                </label>
              ) : null}

              {canShowPrasadam ? (
                <label className="checkout-check-card checkout-check-card-minimal">
                  <input
                    type="checkbox"
                    checked={wantsPrasadam}
                    onChange={(event) => setWantsPrasadam(event.target.checked)}
                  />
                  <div>
                    <strong>Receive Maha Prasadam</strong>
                  </div>
                </label>
              ) : null}
            </div>

            {needs80G ? (
              <div className="checkout-conditional-block">
                <div className="checkout-panel-header compact">
                  <h3>80G receipt details</h3>
                </div>

                <label className="checkout-field">
                  <input
                    type="text"
                    placeholder="PAN Number"
                    value={panNumber}
                    onChange={(event) => setPanNumber(event.target.value)}
                    required={needs80G}
                  />
                </label>

                <label className="checkout-field">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    required={needs80G}
                  />
                </label>

                <label className="checkout-field">
                  <textarea
                    rows="3"
                    placeholder="80G Address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    required={needs80G}
                  />
                </label>

                <label className="checkout-field">
                  <select
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    required={needs80G}
                  >
                    <option value="" disabled>
                      State
                    </option>
                    {indianStates.map((stateItem) => (
                      <option key={stateItem} value={stateItem}>
                        {stateItem}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="checkout-field">
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(event) => setPincode(event.target.value)}
                    required={needs80G}
                  />
                </label>
              </div>
            ) : null}

            {wantsPrasadam ? (
              <div className="checkout-conditional-block">
                <div className="checkout-panel-header compact">
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
                        <span>Same address</span>
                      </label>

                      <label className="checkout-radio-card">
                        <input
                          type="radio"
                          name="prasadamAddressChoice"
                          checked={!prasadamSameAddress}
                          onChange={() => setPrasadamSameAddress(false)}
                        />
                        <span>Different address</span>
                      </label>
                    </div>

                    {!prasadamSameAddress ? (
                      <>
                        <label className="checkout-field">
                          <textarea
                            rows="3"
                            placeholder="Prasadam Address"
                            value={prasadamAddress}
                            onChange={(event) => setPrasadamAddress(event.target.value)}
                            required={wantsPrasadam && !prasadamSameAddress}
                          />
                        </label>

                        <label className="checkout-field">
                          <input
                            type="text"
                            placeholder="City"
                            value={prasadamCity}
                            onChange={(event) => setPrasadamCity(event.target.value)}
                            required={wantsPrasadam && !prasadamSameAddress}
                          />
                        </label>

                        <label className="checkout-field">
                          <select
                            value={prasadamState}
                            onChange={(event) => setPrasadamState(event.target.value)}
                            required={wantsPrasadam && !prasadamSameAddress}
                          >
                            <option value="" disabled>
                              State
                            </option>
                            {indianStates.map((stateItem) => (
                              <option key={stateItem} value={stateItem}>
                                {stateItem}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="checkout-field">
                          <input
                            type="text"
                            placeholder="Pincode"
                            value={prasadamPincode}
                            onChange={(event) => setPrasadamPincode(event.target.value)}
                            required={wantsPrasadam && !prasadamSameAddress}
                          />
                        </label>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <label className="checkout-field">
                      <textarea
                        rows="3"
                        placeholder="Prasadam Address"
                        value={prasadamAddress}
                        onChange={(event) => setPrasadamAddress(event.target.value)}
                        required={wantsPrasadam}
                      />
                    </label>

                    <label className="checkout-field">
                      <input
                        type="text"
                        placeholder="City"
                        value={prasadamCity}
                        onChange={(event) => setPrasadamCity(event.target.value)}
                        required={wantsPrasadam}
                      />
                    </label>

                    <label className="checkout-field">
                      <select
                        value={prasadamState}
                        onChange={(event) => setPrasadamState(event.target.value)}
                        required={wantsPrasadam}
                      >
                        <option value="" disabled>
                          State
                        </option>
                        {indianStates.map((stateItem) => (
                          <option key={stateItem} value={stateItem}>
                            {stateItem}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="checkout-field">
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={prasadamPincode}
                        onChange={(event) => setPrasadamPincode(event.target.value)}
                        required={wantsPrasadam}
                      />
                    </label>
                  </>
                )}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="checkout-error-message">
                <p>{errorMessage}</p>
              </div>
            ) : null}

            <div className="checkout-submit-bar">
              <div className="checkout-submit-summary">
                <span>Donation Amount</span>
                <strong>{displayAmount}</strong>
              </div>
              <button type="submit" className="checkout-submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
