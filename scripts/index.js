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
const loader = document.querySelector(".loader");

const programDetails = document.querySelector("#program-details");
const programName = programDetails.querySelector("#program-name");
const programType = programDetails.querySelector("#program-type");
const programTime = programDetails.querySelector("#program-time");
const otherDetails = programDetails.querySelector("#other-details");

let currentProgramDetails;
let scrollPos = 0;
let boxScrollPct = 0;
let ignoreScroll = false;
let timeOutId = null;
let parentPIN = 1234;

function setParentPIN() {
  const newParentPIN = prompt("please provide a new parent PIN. (4-8 digits)");
  if (
    isNaN(newParentPIN) ||
    newParentPIN.length < 4 ||
    newParentPIN.length > 8
  ) {
    alert("Invalid PIN format, please try again.");
    setParentPIN();
  } else {
    alert("Parent PIN set successfully.");
    parentPIN = newParentPIN;
  }
}

channelNames.forEach((channel, index) => {
  channel.textContent = channels[index];
});

function setProgramDetails(program, startTime, endTime) {
  programName.textContent = program.name;
  programType.textContent = program.type;
  otherDetails.textContent = program["other-details"];
  programTime.textContent = `${startTime} - ${endTime}`;
}

function createProgramContainers(program, startTime) {
  // Since the API does not provide data on whether the program is for adults or not, we generate a random value.
  program.isAdult = Math.round(Math.random() - 0.2) === 1 ? true : false;

  program.isRebroadcast = Math.round(Math.random() - 0.1) === 1 ? true : false;

  const timeSlotDiv = document.createElement("div");
  timeSlotDiv.className = "time-slot";

  const timeDiv = document.createElement("div");
  timeDiv.textContent = startTime;
  timeSlotDiv.appendChild(timeDiv);

  const programDiv = document.createElement("div");
  programDiv.className = "program";

  const nameDiv = document.createElement("div");
  nameDiv.textContent = program.name;
  nameDiv.className = "program-name";

  if (program.isAdult) {
    const isAdult = document.createElement("span");
    isAdult.textContent = "18+";
    isAdult.className = "adult";
    nameDiv.appendChild(isAdult);
  }
  programDiv.appendChild(nameDiv);

  const typeDiv = document.createElement("div");
  typeDiv.textContent = program.type;
  programDiv.appendChild(typeDiv);

  return { timeSlotDiv, programDiv };
}

function displaySchedule(scheduleArray, index) {
  const timeline = document.querySelector(`#channel-${index} .timeline`);

  scheduleArray.forEach(([startTime, program], index) => {
    const { timeSlotDiv, programDiv } = createProgramContainers(
      program,
      startTime
    );

    programDiv.addEventListener("click", (e) => {
      if (program.isAdult) {
        const pin = prompt("Please enter the parent PIN to view this program.");
        if (Number(pin) !== parentPIN) {
          alert("Invalid PIN. Access denied.");
          return;
        }
      }
      if (currentProgramDetails) {
        currentProgramDetails.style.border = "2px solid #ddd";
      }
      currentProgramDetails = e.currentTarget;
      currentProgramDetails.style.border = "2px solid green";

      let currentIndex = index + 1;
      if (currentIndex > scheduleArray.length - 1) {
        currentIndex = 0;
      }
      const [endTime, _] = scheduleArray[currentIndex];
      console.log(program);
      setProgramDetails(program, startTime, endTime);
    });
    timeSlotDiv.appendChild(programDiv);
    timeline.appendChild(timeSlotDiv);
  });
}

function scrollToCurrentHours() {
  const currentHour = new Date().getHours();
  const containerWidth = getProgramContainerWidth();
  scrollPos =
    containerWidth * (currentHour === 0 ? currentHour : currentHour + 3);

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

function showLoading() {
  loader.classList.remove("hidden");
  loader.classList.add("show");
}

function hideLoading() {
  loader.classList.remove("show");
  loader.classList.add("hidden");
}

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
    displaySchedule(scheduleArray, index + 1);
  });

  hideLoading();

  const currentHour = scrollToCurrentHours();
  const timelines = document.querySelectorAll(`.timeline`);
  styleLivePrograms(timelines, currentHour);
});
