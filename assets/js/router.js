/**
 * DeenKart Lightweight Hash Router
 * Manages view transitions without full page reloads.
 */

const Router = {
  routes: {},
  currentRoute: "",

  init() {
    window.addEventListener("hashchange", () => this.handleRouting());
    // Initial route
    this.handleRouting();
  },

  register(hashPattern, handler) {
    this.routes[hashPattern] = handler;
  },

  navigate(hash) {
    window.location.hash = hash.startsWith("#") ? hash : `#${hash}`;
  },

  handleRouting() {
    let hash = window.location.hash || "#home";
    if (hash === "#" || hash === "") hash = "#home";
    
    // Check maintenance mode override
    if (CONFIG.maintenanceMode && hash !== "#maintenance") {
      this.navigate("#maintenance");
      return;
    }

    this.currentRoute = hash;

    // Parse path and params
    const [pathPart, queryPart] = hash.split("?");
    const pathSegments = pathPart.split("/").filter(Boolean); // e.g. ["#product", "prod-123"]

    // Dispatch view activation event
    window.dispatchEvent(new CustomEvent("deenkart:routeChanged", {
      detail: { hash, path: pathPart, segments: pathSegments, query: queryPart }
    }));

    // Scroll back to top on route change
    window.scrollTo({ top: 0, behavior: "instant" });
  }
};
