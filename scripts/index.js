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
const channelNames = document.querySelectorAll(".channel");
/* const contentWrapper = document.querySelector("#content-wrapper"); */
const loader = document.querySelector(".loader");
channelNames.forEach((channel, index) => {
  channel.textContent = channels[index];
});

let scrollPos = 0;
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

function scrollToCurrentHours() {
  const currentHour = new Date().getHours();
  const containerWidth = getProgramContainerWidth();
  scrollPos = containerWidth * (currentHour + 1);
  console.log(scrollPos);
  timelinesContainer.scroll({ left: scrollPos, behavior: "smooth" });
  return currentHour;
}

function styleLivePrograms(timelines, currentHour) {
  timelines.forEach((timeline) => {
    const programs = timeline.querySelectorAll(".program");
    for (const program of programs) {
      const programTime =
        program.previousElementSibling.textContent.split(":")[0];

      if (programTime == currentHour) {
        program.style.backgroundColor = "green";
        program.style.color = "white";
        break;
      }
    }
  });
}

function getProgramContainerWidth() {
  const programContainer = timelinesContainer.querySelector(".time-slot");
  return programContainer.offsetWidth + 15;
}

prevButton.addEventListener("click", () => {
  const containerWidth = getProgramContainerWidth();
  scrollPos -= containerWidth;

  if (scrollPos < 0) {
    scrollPos = 0;
  }
  timelinesContainer.scroll({ left: scrollPos, behavior: "smooth" });
});

nextButton.addEventListener("click", () => {
  const containerWidth = getProgramContainerWidth();
  scrollPos += containerWidth;

  const scrollWidth = timelinesContainer.scrollWidth;
  if (scrollPos > scrollWidth) {
    scrollPos = scrollWidth;
  }
  timelinesContainer.scroll({ left: scrollPos, behavior: "smooth" });
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

// Fetch data and display schedules
document.addEventListener("DOMContentLoaded", async () => {
  let channelSchedules = [];

  loader.classList.remove("hidden");
  loader.classList.add("show");

  for (const channel of channels) {
    channelSchedules.push(getChannelSchedule(channel));
  }
  const schedules = await Promise.all(channelSchedules);

  schedules.forEach((schedule, index) => {
    displaySchedule(schedule, index + 1);
  });

  loader.classList.remove("show");
  loader.classList.add("hidden");

  const currentHour = scrollToCurrentHours();
  const timelines = document.querySelectorAll(`.timeline`);
  styleLivePrograms(timelines, currentHour);
});
