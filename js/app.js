// Omar Dental Care - Application Processing Engine
document.addEventListener("DOMContentLoaded", () => {
  // Structural DOM Hook targets
  const homeServicesSnippet = document.getElementById("home-services-snippet");
  const servicesGrid = document.getElementById("services-grid");
  const homeReviewsSnippet = document.getElementById("home-reviews-snippet");
  const reviewsGrid =
    document.getElementById("reviews-container") ||
    document.getElementById("reviews-grid");
  const staffContainer = document.getElementById("staff-container");
  const detailContainer = document.getElementById("dynamic-detail-target");
  const bookingForm = document.getElementById("appointment-form");

  // Execution pipelines
  if (homeServicesSnippet)
    runFetchAndInject(
      "./data/services.json",
      homeServicesSnippet,
      makeServiceBootstrapCard,
      3,
    );
  if (servicesGrid)
    runFetchAndInject(
      "./data/services.json",
      servicesGrid,
      makeServiceBootstrapCard,
    );
  if (homeReviewsSnippet)
    runFetchAndInject(
      "./data/reviews.json",
      homeReviewsSnippet,
      makeReviewBootstrapCard,
      2,
    );
  if (reviewsGrid)
    runFetchAndInject(
      "./data/reviews.json",
      reviewsGrid,
      makeReviewBootstrapCard,
    );
  if (staffContainer)
    runFetchAndInject(
      "./data/staff.json",
      staffContainer,
      makeStaffBootstrapCard,
    );
  if (detailContainer) buildDynamicDetailPage(detailContainer);
  if (bookingForm) setupFormBookingHandler(bookingForm);
});

// Primary Fetch & Loop Interface Engine
async function runFetchAndInject(
  dataPath,
  htmlContainer,
  markupBlueprint,
  displayLimit = null,
) {
  try {
    const fetchStream = await fetch(dataPath);
    if (!fetchStream.ok)
      throw new Error("Data stream lookup connection anomaly");
    let activeRecords = await fetchStream.json();

    htmlContainer.innerHTML = "";
    if (displayLimit) activeRecords = activeRecords.slice(0, displayLimit);

    activeRecords.forEach((entry) => {
      htmlContainer.innerHTML += markupBlueprint(entry);
    });
  } catch (err) {
    console.error("Asynchronous processing breakdown:", err);
    htmlContainer.innerHTML = `<div class="col-12 text-center text-danger py-4"><i class="fa-solid fa-triangle-exclamation fa-lg me-2"></i>Unable to parse content profiles at this time.</div>`;
  }
}

// Bootstrap Template Generation Filters
function makeServiceBootstrapCard(obj) {
  return `
        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
            <div class="card custom-card w-100 d-flex flex-column">
                <img src="${obj.heroImage}" class="card-img-top crop-img-320" alt="${obj.title}">
                <div class="card-body d-flex flex-column justify-content-between p-4">
                    <div>
                        <h3 class="h5 mb-2">${obj.title}</h3>
                        <p class="text-muted small mb-4">${obj.description}</p>
                    </div>
                    <a href="service-detail.html?id=${obj.id}" class="btn btn-outline-vibrant w-100 py-2">Explore Treatment Options</a>
                </div>
            </div>
        </div>
    `;
}

function makeReviewBootstrapCard(obj) {
  return `
        <div class="col-md-6 d-flex align-items-stretch">
            <div class="testimonial-bubble w-100 shadow-sm d-flex flex-column justify-content-between">
                <p class="text-secondary fst-italic mb-3">"${obj.comment}"</p>
                <div>
                    <div class="text-gold mb-1">${'<i class="fa-solid fa-star"></i>'.repeat(obj.rating)}</div>
                    <strong class="text-dark d-block">${obj.patientName}</strong>
                    <small class="text-muted text-uppercase tracking-wider" style="font-size:0.75rem;">Verified Patient • ${obj.date}</small>
                </div>
            </div>
        </div>
    `;
}

function makeStaffBootstrapCard(obj) {
  return `
        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
            <div class="card custom-card w-100 d-flex flex-column">
                <img src="${obj.image}" class="staff-img-frame" alt="${obj.name}">
                <div class="card-body p-4">
                    <h3 class="h5 mb-1">${obj.name}</h3>
                    <span class="text-info fw-bold small text-uppercase tracking-wide d-block mb-2">${obj.role}</span>
                    <p class="text-muted small mb-0">${obj.bio}</p>
                </div>
            </div>
        </div>
    `;
}

// Bootstrap Dynamic Single Page Router Config
async function buildDynamicDetailPage(targetDiv) {
  const routingParameters = new URLSearchParams(window.location.search);
  const serviceLookupKey = routingParameters.get("id");

  if (!serviceLookupKey) {
    targetDiv.innerHTML = `<div class="container text-center py-5"><h3>No Treatment Identity Specified</h3><a href="services.html" class="btn btn-vibrant mt-3">View Matrix Catalog</a></div>`;
    return;
  }

  try {
    const catalogFetch = await fetch("./data/services.json");
    const treatmentArray = await catalogFetch.json();
    const targetedObj = treatmentArray.find(
      (item) => item.id === serviceLookupKey,
    );

    if (!targetedObj) {
      targetDiv.innerHTML = `<div class="container text-center py-5"><h3>Target Treatment Profile Does Not Exist</h3></div>`;
      return;
    }

    document.title = `${targetedObj.title} | Omar Dental Care`;
    targetDiv.innerHTML = `
            <div class="container py-4">
                <div class="row g-5 align-items-start">
                    <div class="col-lg-7">
                        <img src="${targetedObj.heroImage}" class="img-fluid rounded-4 shadow mb-4 w-100" style="max-height: 400px; object-fit: cover;" alt="${targetedObj.title}">
                        <h1 class="display-5 mb-3">${targetedObj.title}</h1>
                        <p class="lead text-secondary mb-4">${targetedObj.longDescription}</p>
                        
                        <h4 class="mb-3">Advanced Technical Offerings Inside This Track</h4>
                        <div class="row g-3">
                            ${targetedObj.features
                              .map(
                                (feat) => `
                                <div class="col-sm-6">
                                    <div class="p-3 bg-white border-start border-3 border-info rounded shadow-sm d-flex align-items-center">
                                        <i class="fa-solid fa-circle-check text-info me-2"></i> <span class="fw-semibold small">${feat}</span>
                                    </div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                    <div class="col-lg-5 position-sticky" style="top: 110px;">
                        <div class="p-4 p-xl-5 text-white rounded-4 shadow-lg" style="background: linear-gradient(135deg, #004b57 0%, #00b4d8 100%);">
                            <h3 class="text-gold mb-3">Schedule Your Care Consultation</h3>
                            <p class="small text-light-emphasis mb-4">Book a diagnostic evaluation session for this specific treatment tracking path with our operations directors today.</p>
                            <a href="book.html?service=${targetedObj.id}" class="btn btn-vibrant w-100 btn-lg">Request Priority Booking Window</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
  } catch (err) {
    targetDiv.innerHTML = `<div class="container text-center py-5 text-danger">An internal database system connectivity loop error occurred.</div>`;
  }
}

// Booking Interactivity Matrix Setup
function setupFormBookingHandler(formElement) {
  const parameters = new URLSearchParams(window.location.search);
  const selectedFlag = parameters.get("service");
  const systemSelector = document.getElementById("booking-service");

  if (selectedFlag && systemSelector) {
    systemSelector.value = selectedFlag;
  }

  formElement.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const inputName = document.getElementById("booking-name").value;
    const inputDate = document.getElementById("booking-date").value;

    formElement.parentElement.innerHTML = `
            <div class="text-center py-5 px-3">
                <div class="display-3 text-success mb-3"><i class="fa-solid fa-circle-check"></i></div>
                <h3 class="mb-2">Appointment Order Initiated!</h3>
                <p class="text-muted mx-auto" style="max-width: 420px;">Thank you, <strong>${inputName}</strong>. Our clinical routing staff will dial your contact line directly within 2 business hours to finalize your calendar slot for <strong>${inputDate}</strong>.</p>
                <a href="index.html" class="btn btn-outline-vibrant mt-3">Return to Main Dashboard</a>
            </div>
        `;
  });
}
