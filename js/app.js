// Main Dental App Engine
document.addEventListener("DOMContentLoaded", () => {
  // Determine which containers exist on the current page
  const servicesGrid = document.getElementById("services-grid");
  const homeServicesSnippet = document.getElementById("home-services-snippet");
  const homeReviewsSnippet = document.getElementById("home-reviews-snippet");
  const staffContainer = document.getElementById("staff-container"); // Target container on about.html
  const detailContainer = document.getElementById("dynamic-detail-target");
  const bookingForm = document.getElementById("appointment-form");
  const reviewsGrid = document.getElementById("reviews-container");

  // Homepage Service Component Injection
  if (homeServicesSnippet)
    fetchLimitAndRender(
      "./data/services.json",
      homeServicesSnippet,
      renderServiceCard,
      3,
    );

  // Homepage Top Reviews Filter Injections
  if (homeReviewsSnippet)
    fetchLimitAndRender(
      "./data/reviews.json",
      homeReviewsSnippet,
      renderReviewCard,
      2,
    );

  // Full Services List Page Injection
  if (servicesGrid)
    fetchLimitAndRender(
      "./data/services.json",
      servicesGrid,
      renderServiceCard,
    );

  if (reviewsGrid)
    fetchLimitAndRender("./data/reviews.json", reviewsGrid, renderReviewCard);

  // About Us Team Page Injection <-- THIS WAS MISSING
  if (staffContainer)
    fetchLimitAndRender("./data/staff.json", staffContainer, renderStaffCard);

  // Dynamic Individual Service Target router
  if (detailContainer) initDetailPage(detailContainer);

  // Booking Submission Form Management
  if (bookingForm) initBookingForm(bookingForm);
});

// Fetch function that accepts rendering item display limits
async function fetchLimitAndRender(url, container, templateFunc, limit = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Resource structural pull breakdown");
    let data = await response.json();

    container.innerHTML = "";
    if (limit) data = data.slice(0, limit);

    data.forEach((item) => {
      container.innerHTML += templateFunc(item);
    });
  } catch (err) {
    console.error("Renderer runtime error:", err);
    container.innerHTML = `<p style='color:red;'>Unable to pull digital catalog assets at this moment.</p>`;
  }
}

// Single Component Template Generators
function renderServiceCard(item) {
  // If we have long images array in json, find icon fallback or image
  const image =
    item.heroImage ||
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400";
  return `
        <div class="card">
            <img src="${image}" alt="${item.title}" class="card-img">
            <div class="card-body">
                <div>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <a href="service-detail.html?id=${item.id}" class="btn btn-outline" style="width:100%;">View Service Details</a>
            </div>
        </div>
    `;
}

function renderReviewCard(rev) {
  return `
        <div class="card review-card">
            <div class="rating">${"★".repeat(rev.rating)}</div>
            <p>"${rev.comment}"</p>
            <div class="review-meta">
                <strong>- ${rev.patientName}</strong><br>
                <small>Verified Client • ${rev.date}</small>
            </div>
        </div>
    `;
}

// Dynamic Individual Service Detail Router Lifecycle
async function initDetailPage(container) {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("id");

  if (!serviceId) {
    container.innerHTML =
      "<h2>Service Not Found</h2><p><a href='services.html'>Return to clinic structural catalogs.</a></p>";
    return;
  }

  try {
    const response = await fetch("./data/services.json");
    const services = await response.json();
    const matchedService = services.find((s) => s.id === serviceId);

    if (!matchedService) {
      container.innerHTML = "<h2>Service Entry Not Found</h2>";
      return;
    }

    // Complete structural layout configuration
    document.title = `${matchedService.title} | Apex Dental Care`;
    container.innerHTML = `
            <img src="${matchedService.heroImage}" alt="${matchedService.title}" class="detail-hero">
            <div class="detail-layout">
                <div>
                    <h2>${matchedService.title}</h2>
                    <p style="font-size:1.15rem; color:#4a5568; margin-bottom:2rem; line-height:1.8;">${matchedService.longDescription}</p>
                    
                    <h3>Key Procedure Offerings</h3>
                    <ul class="feature-list">
                        ${matchedService.features.map((f) => `<li>${f}</li>`).join("")}
                    </ul>
                </div>
                <div>
                    <div class="sidebar-box">
                        <h3>Ready for a Consultation?</h3>
                        <p style="margin-bottom:1.5rem; color:#e2e8f0; font-size:0.95rem;">Book an assessment window for ${matchedService.title} with our clinical leads today.</p>
                        <a href="book.html?service=${matchedService.id}" class="btn btn-primary" style="display:block;">Schedule Appointment</a>
                    </div>
                </div>
            </div>
        `;
  } catch (err) {
    container.innerHTML =
      "<p>Critical internal error loading service profiles.</p>";
  }
}

// Interactive Appointment Handling Simulation
function initBookingForm(form) {
  // Auto-select option matching URL parameters if applicable
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedService = urlParams.get("service");
  const serviceSelect = document.getElementById("booking-service");

  if (preselectedService && serviceSelect) {
    serviceSelect.value = preselectedService;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Form collection data modeling
    const appointmentData = {
      name: document.getElementById("booking-name").value,
      phone: document.getElementById("booking-phone").value,
      service: serviceSelect.value,
      date: document.getElementById("booking-date").value,
    };

    // UI success animation override
    form.innerHTML = `
            <div style="text-align:center; padding:3rem 0; color:#03045e;">
                <h3 style="margin-bottom:1rem; font-size:1.8rem;">✓ Appointment Request Received!</h3>
                <p style="color:#555; max-width:450px; margin:0 auto;">Thank you, <strong>${appointmentData.name}</strong>. Our Practice Management team will contact you shortly via phone to confirm your slot on <strong>${appointmentData.date}</strong>.</p>
                <a href="index.html" class="btn btn-outline" style="margin-top:2rem;">Return Home</a>
            </div>
        `;
  });
}
function renderStaffCard(member) {
  // If a local image doesn't exist, we fall back to a high-quality Unsplash avatar
  const image =
    member.image ||
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400";

  return `
        <div class="card">
            <div class="staff-img-wrapper">
                <img class="staff-img" src="${image}" alt="${member.name}">
            </div>
            <div style="padding-top: 1rem;">
                <h3>${member.name}</h3>
                <div class="staff-role">${member.role}</div>
                <p style="margin-top: 0.5rem; color: #555;">${member.bio}</p>
            </div>
        </div>
    `;
}
