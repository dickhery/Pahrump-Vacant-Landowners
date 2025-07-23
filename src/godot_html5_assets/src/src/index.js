import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory, canisterId } from "../assets/js/backend-idl.js";
import fetch from "isomorphic-fetch";

// Determine network based on environment
const isLocal = process.env.DFX_NETWORK !== "ic";
const host = isLocal ? "http://127.0.0.1:4943" : "https://icp-api.io";

// Initialize HttpAgent
const agent = new HttpAgent({ host, fetch });

// Fetch root key for local development
if (isLocal) {
  agent.fetchRootKey().catch((err) => {
    console.warn("Unable to fetch root key. Ensure local development environment is running.");
    console.error(err);
  });
}

// Create actor
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId || "meeck-xiaaa-aaaap-an2va-cai",
});

// Initialize AuthClient
async function initAuthClient() {
  try {
    const authClient = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 10, // 10 minutes
        disableDefaultIdleCallback: true,
      },
    });

    // Handle authentication
    if (!(await authClient.isAuthenticated())) {
      await authClient.login({
        identityProvider: isLocal
          ? "http://127.0.0.1:4943?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai"
          : "https://identity.ic0.app",
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          const identity = await authClient.getIdentity();
          agent.replaceIdentity(identity);
          console.log("Authentication successful");
        },
        onError: (err) => {
          console.error("Authentication failed:", err);
          alert("Authentication failed. Please try again.");
        },
      });
    }

    return authClient;
  } catch (err) {
    console.error("Failed to initialize AuthClient:", err);
    alert("Failed to initialize authentication. Please refresh the page.");
    throw err;
  }
}

// Handle form submissions
document.addEventListener("DOMContentLoaded", async () => {
  await initAuthClient();

  const contactForm = document.getElementById("contactForm");
  const lawsuitForm = document.getElementById("lawsuitForm");

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name-field").value;
      const email = document.getElementById("email-field").value;
      const subject = document.getElementById("subject-field").value;
      const message = document.getElementById("message-field").value;

      const submitButton = contactForm.querySelector("button[type=submit]");
      submitButton.disabled = true;
      const loading = document.createElement("div");
      loading.className = "loading";
      loading.textContent = "Sending...";
      contactForm.appendChild(loading);

      try {
        await actor.submitContactMessage(name, email, subject, message);
        const sentMessage = document.createElement("div");
        sentMessage.className = "sent-message";
        sentMessage.textContent = "Your message has been sent. Thank you!";
        contactForm.appendChild(sentMessage);
        contactForm.reset();
      } catch (err) {
        console.error("Contact form submission failed:", err);
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = "Failed to send message. Please try again later.";
        contactForm.appendChild(errorMessage);
      } finally {
        loading.remove();
        submitButton.disabled = false;
      }
    });
  }

  // Lawsuit Form Submission
  if (lawsuitForm) {
    lawsuitForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("lawsuit-name").value;
      const email = document.getElementById("lawsuit-email").value;
      const phone = document.getElementById("lawsuit-phone").value;
      const propertyAddress = document.getElementById("property-address").value;
      const propertyDetails = document.getElementById("property-details").value;
      const additionalInfo = document.getElementById("additional-info").value;

      const submitButton = lawsuitForm.querySelector("button[type=submit]");
      submitButton.disabled = true;
      const loading = document.createElement("div");
      loading.className = "loading";
      loading.textContent = "Submitting...";
      lawsuitForm.appendChild(loading);

      try {
        await actor.submitLawsuitInterest(name, email, phone, propertyAddress, propertyDetails, additionalInfo);
        const sentMessage = document.createElement("div");
        sentMessage.className = "sent-message";
        sentMessage.textContent = "Your interest has been submitted. Thank you!";
        lawsuitForm.appendChild(sentMessage);
        lawsuitForm.reset();
      } catch (err) {
        console.error("Lawsuit form submission failed:", err);
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = "Failed to submit interest. Please try again later.";
        lawsuitForm.appendChild(errorMessage);
      } finally {
        loading.remove();
        submitButton.disabled = false;
      }
    });
  }
});