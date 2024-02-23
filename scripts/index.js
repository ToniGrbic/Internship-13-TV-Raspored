import { getChannelSchedule } from "./api.js";
const channels = [
  "Sony Six HD",
  "CNN NEWS 18",
  "Republic TV",
  "Discovery HD World",
];

function updateSchedule(schedule) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = ""; // Clear the existing timeline

  for (const [startTime, program] of Object.entries(schedule)) {
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

document.getElementById("prev").addEventListener("click", () => {
  document.getElementById("timeline-container").scrollLeft -= 100;
});

document.getElementById("next").addEventListener("click", () => {
  document.getElementById("timeline-container").scrollLeft += 100;
});

(async () => {
  const channelSchedule = await getChannelSchedule("Discovery HD World");
  console.log(channelSchedule);
  updateSchedule(channelSchedule); // Update the schedule in the HTML
})();
