"use client";

import { useMemo, useState } from "react";

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

export default function CheckoutPage({
  donation,
  embedded = false,
  onClose
}) {
  const [customAmount, setCustomAmount] = useState(
    donation.numericAmount ? String(donation.numericAmount) : ""
  );
  const [needs80G, setNeeds80G] = useState(false);
  const [wantsPrasadam, setWantsPrasadam] = useState(false);
  const [prasadamSameAddress, setPrasadamSameAddress] = useState(true);

  const displayAmount = useMemo(() => {
    if (donation.numericAmount > 0) {
      return donation.amount;
    }

    const parsed = Number(customAmount.replace(/[^\d]/g, ""));
    return parsed ? `Rs. ${parsed.toLocaleString("en-IN")}` : "Enter amount";
  }, [customAmount, donation.amount, donation.numericAmount]);

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
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="checkout-field-grid">
              <label className="checkout-field">
                <input type="text" placeholder="Donor Name" required />
              </label>
              <label className="checkout-field">
                <input type="tel" placeholder="Mobile Number" required />
              </label>
            </div>

            <div className="checkout-field-grid">
              <label className="checkout-field">
                <input type="email" placeholder="E-Mail ID" required />
              </label>
              <label className="checkout-field">
                <input
                  type="text"
                  placeholder="PAN Number"
                  required={needs80G}
                />
              </label>
            </div>

            <div className="checkout-field-grid">
              <label className="checkout-field">
                <input type="text" placeholder="Seva In The Name Of" />
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
                    required={needs80G}
                  />
                </label>

                <div className="checkout-field-grid">
                  <label className="checkout-field">
                    <input type="text" placeholder="City" required={needs80G} />
                  </label>
                  <label className="checkout-field">
                    <select defaultValue="" required={needs80G}>
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
                    <input type="text" placeholder="Pincode" required={needs80G} />
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
                            required={wantsPrasadam && !prasadamSameAddress}
                          />
                        </label>

                        <div className="checkout-field-grid">
                          <label className="checkout-field">
                            <input
                              type="text"
                              placeholder="City"
                              required={wantsPrasadam && !prasadamSameAddress}
                            />
                          </label>
                          <label className="checkout-field">
                            <select
                              defaultValue=""
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

            <button type="submit" className="checkout-submit">
              Continue To Razorpay
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
