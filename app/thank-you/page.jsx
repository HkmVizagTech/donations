"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const amount = searchParams.get("amount");
  const seva = searchParams.get("seva");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        textAlign: "center"
      }}>
        <div style={{
          backgroundColor: "#FF9933",
          padding: "2rem"
        }}>
          <div style={{
            margin: "0 auto 1rem",
            width: "80px",
            height: "80px",
            backgroundColor: "#FFD700",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg
              style={{ width: "40px", height: "40px", color: "#FF9933" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "white",
            margin: "0"
          }}>
            Thank You
          </h1>
          <p style={{
            margin: "0.5rem 0 0",
            color: "rgba(255, 255, 255, 0.9)"
          }}>
            {seva
              ? `Thank you for the ${seva} dana.`
              : "Your donation has been received for ISKCON Gambheeram Visakhapatnam."}
          </p>
        </div>

        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {seva && (
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "8px"
            }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "#6c757d" }}>
                Seva Type
              </p>
              <p style={{ margin: "0", fontSize: "1.25rem", fontWeight: "bold", color: "#212529" }}>
                {seva}
              </p>
            </div>
          )}

          {amount && (
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "8px"
            }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "#6c757d" }}>
                Amount Donated
              </p>
              <p style={{
                margin: "0",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#212529"
              }}>
                INR {parseInt(amount).toLocaleString("en-IN")}
              </p>
            </div>
          )}

          {paymentId && (
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "8px"
            }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "#6c757d" }}>
                Payment ID
              </p>
              <p style={{
                margin: "0",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                color: "#212529"
              }}>
                {paymentId}
              </p>
            </div>
          )}

          <p style={{
            margin: "1.5rem 0",
            lineHeight: "1.6",
            color: "rgba(33, 37, 41, 0.8)"
          }}>
            May Sri Sri Radha Gopinath and Srila Prabhupada bless you and your family.
            Your contribution supports seva activities in ISKCON Gambheeram Visakhapatnam.
          </p>

          <Link
            href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#FF9933",
              color: "white",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#e6892a"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#FF9933"}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        textAlign: "center",
        padding: "2rem"
      }}>
        <div style={{
          margin: "0 auto 1rem",
          width: "80px",
          height: "80px",
          backgroundColor: "#FFD700",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #FF9933",
            borderTop: "4px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
        </div>
        <p>Loading...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}