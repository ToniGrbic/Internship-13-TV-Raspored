import { getChannelSchedule } from "./api.js";
const channels = [
  "Sony Six HD",
  "CNN NEWS 18",
  "Republic TV",
  "Discovery HD World",
];

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const timelineContainer = document.getElementById("timeline");
let pageNumber = 1;
let numberOfPages;

function updateSchedule(schedule) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = ""; // Clear the existing timeline

  const scheduleArray = Object.entries(schedule);
  numberOfPages = scheduleArray.length;

  for (const [startTime, program] of scheduleArray) {
    const timeSlotDiv = document.createElement("div");
    timeSlotDiv.className = "time-slot";

    const timeDiv = document.createElement("div");
    timeDiv.textContent = startTime;
    timeSlotDiv.appendChild(timeDiv);

    const programDiv = document.createElement("div");
    programDiv.className = "program";

    const nameDiv = document.createElement("div");
    nameDiv.textContent = program.name;
    programDiv.appendChild(nameDiv);

    const typeDiv = document.createElement("div");
    typeDiv.textContent = program.type;
    programDiv.appendChild(typeDiv);

    timeSlotDiv.appendChild(programDiv);
    timeline.appendChild(timeSlotDiv);
  }
}

function getProgramContainerWidth(pageNumber) {
  const programContainer = timelineContainer.querySelector(
    `.time-slot:nth-of-type(${pageNumber})`
  );
  return programContainer.offsetWidth;
}

prevButton.addEventListener("click", () => {
  if (pageNumber > 1) --pageNumber;
  else pageNumber = 1;

  const containerWidth = getProgramContainerWidth(pageNumber);
  timelineContainer.scrollLeft -= containerWidth + 20;
});

nextButton.addEventListener("click", () => {
  const containerWidth = getProgramContainerWidth(pageNumber);
  timelineContainer.scrollLeft += containerWidth + 20;

  if (pageNumber < numberOfPages) ++pageNumber;
  else pageNumber = numberOfPages;
});

(async () => {
  const channelSchedule = await getChannelSchedule("Discovery HD World");
  console.log(channelSchedule);

  updateSchedule(channelSchedule); // Update the schedule in the HTML
})();
