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

export default function CheckoutPage({ donation, embedded = false, onClose }) {
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
            <h2 className="embedded-checkout-title">Complete your offering here</h2>
          </div>
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
              <p className="checkout-eyebrow">Donation Checkout</p>
              <h3>{donation.title}</h3>
              <p className="checkout-compact-subtitle">{donation.sectionTitle}</p>
            </div>
            <div className={`checkout-compact-amount checkout-compact-${donation.variant}`}>
              <span>Amount</span>
              <strong>{displayAmount}</strong>
            </div>
          </div>

          <form className="checkout-form checkout-form-compact" onSubmit={(event) => event.preventDefault()}>
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
                <input type="date" required />
              </label>
              <label className="checkout-field">
                <input type="email" placeholder="E-Mail ID (Optional)" />
              </label>
            </div>

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
              <input type="text" placeholder="Seva In The Name Of" />
            </label>

            <div className="checkout-check-options">
              <label className="checkout-check-card">
                <input
                  type="checkbox"
                  checked={needs80G}
                  onChange={(event) => setNeeds80G(event.target.checked)}
                />
                <div>
                  <strong>80G required</strong>
                  <p>Enable this if you need a tax receipt.</p>
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
                  <p>We can send Maha Prasadam within India.</p>
                </div>
              </label>
            </div>

            {needs80G ? (
              <div className="checkout-conditional-block">
                <div className="checkout-panel-header compact">
                  <h3>80G receipt details</h3>
                </div>

                <div className="checkout-field-grid">
                  <label className="checkout-field">
                    <input type="text" placeholder="PAN Number" required={needs80G} />
                  </label>
                  <label className="checkout-field">
                    <input type="text" placeholder="City" required={needs80G} />
                  </label>
                </div>

                <label className="checkout-field">
                  <textarea rows="3" placeholder="80G Address" required={needs80G} />
                </label>

                <div className="checkout-field-grid">
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
                  <label className="checkout-field">
                    <input type="text" placeholder="Pincode" required={needs80G} />
                  </label>
                </div>
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

                        <label className="checkout-field">
                          <input
                            type="text"
                            placeholder="Pincode"
                            required={wantsPrasadam && !prasadamSameAddress}
                          />
                        </label>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <label className="checkout-field">
                      <textarea rows="3" placeholder="Prasadam Address" required={wantsPrasadam} />
                    </label>

                    <div className="checkout-field-grid">
                      <label className="checkout-field">
                        <input type="text" placeholder="City" required={wantsPrasadam} />
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

                    <label className="checkout-field">
                      <input type="text" placeholder="Pincode" required={wantsPrasadam} />
                    </label>
                  </>
                )}
              </div>
            ) : null}

            <button type="submit" className="checkout-submit">
              Pay Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
