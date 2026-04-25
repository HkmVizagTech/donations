export function trackMetaEvent(eventName, params = {}, options = {}) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  if (options.eventID) {
    window.fbq("track", eventName, params, { eventID: options.eventID });
    return;
  }

  window.fbq("track", eventName, params);
}

export function trackMetaCustomEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  window.fbq("trackCustom", eventName, params);
}
