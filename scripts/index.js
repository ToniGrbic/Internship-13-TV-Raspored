import { getChannelSchedule } from "./api.js";
const channels = [
  "Sony Six HD",
  "CNN NEWS 18",
  "Republic TV",
  "Discovery HD World",
];

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const timelinesContainer = document.querySelector("#timelines-container");

let translateWidth = 0;
let boxScrollPct = 0;
let ignoreScroll = false;
let timeOutId = null;

function displaySchedule(schedule, index) {
  const timeline = document.querySelector(`#channel-${index} .timeline`);

  const scheduleArray = Object.entries(schedule);

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

function getProgramContainerWidth() {
  const programContainer = timelinesContainer.querySelector(".time-slot");
  return programContainer.offsetWidth + 15;
}

prevButton.addEventListener("click", () => {
  const containerWidth = getProgramContainerWidth();
  translateWidth -= containerWidth;

  if (translateWidth < 0) {
    translateWidth = 0;
  }
  timelinesContainer.scroll({ left: translateWidth, behavior: "smooth" });
});

nextButton.addEventListener("click", () => {
  const containerWidth = getProgramContainerWidth();
  translateWidth += containerWidth;

  const scrollWidth = timelinesContainer.scrollWidth;
  if (translateWidth > scrollWidth) {
    translateWidth = scrollWidth;
  }
  timelinesContainer.scroll({ left: translateWidth, behavior: "smooth" });
});

// prevent scroll position changing on window resize
timelinesContainer.addEventListener("scroll", ({ target: t }) => {
  if (ignoreScroll) return;
  boxScrollPct = t.scrollLeft / (t.scrollWidth - t.clientWidth);
});

window.addEventListener("resize", (e) => {
  ignoreScroll = true;
  const { scrollWidth, clientWidth } = timelinesContainer;
  timelinesContainer.scrollLeft = boxScrollPct * (scrollWidth - clientWidth);

  clearTimeout(timeOutId);
  timeOutId = setTimeout(() => {
    ignoreScroll = false;
  }, 50);
});

(async () => {
  let channelSchedules = [];
  for (const channel of channels) {
    channelSchedules.push(getChannelSchedule(channel));
  }
  const schedules = await Promise.all(channelSchedules);

  schedules.forEach((schedule, index) => {
    displaySchedule(schedule, index + 1);
  });
})();
