import { getChannelSchedule } from "./api.js";
import { createStarRating } from "./programDetails.js";
import { displaySchedule, styleLivePrograms } from "./tvSchedule.js";
import { setParentPIN, getParentPIN } from "./input.js";
import { filterSchedules } from "./settings.js";

const channels = [
  "Sony Six HD",
  "CNN NEWS 18",
  "Republic TV",
  "Discovery HD World",
];

const filterApplyButton = document.querySelector("#filter-btn-apply");
const filterDropdown = document.querySelector(".filter-dropdown");
const timelinesContainer = document.querySelector("#timelines-container");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const loader = document.querySelector(".loader");
const channelNames = document.querySelectorAll(".channel");
channelNames.forEach((channel, index) => {
  channel.textContent = channels[index];
});

const programDetails = document.querySelector("#program-details");
const programRating = programDetails.querySelector("#program-rating");
const userProgramRating = programDetails.querySelector("#user-program-rating");
const programStarRating = programRating.querySelector(".stars-container");
const userProgramStarRating =
  userProgramRating.querySelector(".stars-container");

createStarRating(programStarRating);
createStarRating(userProgramStarRating);

let schedulesArray = [];
let scrollPos = 0;
let boxScrollPct = 0;
let ignoreScroll = false;
let timeOutId = null;

function getProgramContainerWidth() {
  const programContainer = timelinesContainer.querySelector(".time-slot");
  return programContainer.offsetWidth + 15;
}

function scrollToCurrentHours() {
  const currentHour = new Date().getHours();
  const containerWidth = getProgramContainerWidth();
  scrollPos =
    containerWidth * (currentHour === 0 ? currentHour : currentHour + 3);

  timelinesContainer.scroll({ left: scrollPos, behavior: "smooth" });
  return currentHour;
}

function showLoading() {
  loader.classList.remove("hidden");
  loader.classList.add("show");
}

function hideLoading() {
  loader.classList.remove("show");
  loader.classList.add("hidden");
}

function setTVSchedulesToDefaultHTML() {
  timelinesContainer.innerHTML = `
    <div id="timelines-container">
    <div id="channel-1" class="tv-schedule">
      <div class="timeline">
      </div>
    </div>
    <div id="channel-2" class="tv-schedule">
      <div class="timeline">
      </div>
    </div>
    <div id="channel-3" class="tv-schedule">
      <div class="timeline">
      </div>
    </div>
    <div id="channel-4" class="tv-schedule">
      <div class="timeline">
      </div>
    </div>
  </div>
  `;
}

filterApplyButton.addEventListener("click", () => {
  filterDropdown.classList.add("hidden");
  const filteredSchedules = filterSchedules(schedulesArray);
  setTVSchedulesToDefaultHTML();

  filteredSchedules.forEach((schedule, index) => {
    displaySchedule(schedule, index + 1, channels[index]);
  });
  setTimeout(() => {
    scrollToCurrentHours();
  }, 500);
});

prevButton.addEventListener("click", () => {
  const containerWidth = getProgramContainerWidth();
  const { scrollWidth, clientWidth } = timelinesContainer;

  scrollPos = boxScrollPct * (scrollWidth - clientWidth);
  scrollPos -= containerWidth;

  if (scrollPos <= 0) {
    scrollPos = scrollWidth;
  }
  timelinesContainer.scroll({ left: scrollPos, behavior: "smooth" });
});

nextButton.addEventListener("click", () => {
  const containerWidth = getProgramContainerWidth();
  const { scrollWidth, clientWidth } = timelinesContainer;

  scrollPos = boxScrollPct * (scrollWidth - clientWidth);
  scrollPos += containerWidth;

  if (scrollPos + 15 >= scrollWidth) {
    scrollPos = 0;
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
  showLoading();

  for (const channel of channels) {
    channelSchedules.push(getChannelSchedule(channel));
  }
  const schedules = await Promise.all(channelSchedules);

  schedules.forEach((schedule, index) => {
    const scheduleArray = Object.entries(schedule);
    displaySchedule(scheduleArray, index + 1, channels[index]);
    schedulesArray.push(scheduleArray);
  });
  const currentHour = scrollToCurrentHours();
  hideLoading();

  const timelines = document.querySelectorAll(`.timeline`);
  styleLivePrograms(timelines, currentHour);

  if (getParentPIN()) return;

  setTimeout(() => {
    setParentPIN(
      "Welcome to TV Schedule! Please provide a parent PIN. (4-8 digits)"
    );
  }, 300);
});
