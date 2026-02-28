export const getMissingOnboardingFields = (user) => {
  const missing = [];

  /* =========================
     BASIC REQUIRED FIELDS
  ========================= */

  if (!user.firstName || !user.firstName.trim()) {
    missing.push({
      field: "firstName",
      message: "First name is required.",
    });
  }

  if (!user.lastName || !user.lastName.trim()) {
    missing.push({
      field: "lastName",
      message: "Last name is required.",
    });
  }

  if (!user.gender) {
    missing.push({
      field: "gender",
      message: "Please select your gender.",
    });
  }

  /* =========================
     PREFERENCE REQUIRED
  ========================= */

  if (!user.preference?.interestedIn) {
    missing.push({
      field: "preference.interestedIn",
      message: "Please select who you are interested in.",
    });
  }

  /* =========================
     LOCATION REQUIRED
  ========================= */

  const coords = user.location?.coordinates?.coordinates;

  const hasValidCoordinates =
    Array.isArray(coords) &&
    coords.length === 2 &&
    !(coords[0] === 0 && coords[1] === 0);

  if (!hasValidCoordinates) {
    missing.push({
      field: "location.coordinates",
      message: "Please set your location.",
    });
  }

  return missing;
};
