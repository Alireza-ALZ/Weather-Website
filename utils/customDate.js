function dayIndex(dt) {
  return new Date(dt * 1000).getDay();
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export { dayIndex, DAYS };
