import { getChannelSchedule } from "./api.js";
const channels = [
  "Sony Six HD",
  "CNN NEWS 18",
  "Republic TV",
  "Discovery HD World",
];

const timelinesContainer = document.querySelector("#timelines-container");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const loader = document.querySelector(".loader");
const channelNames = document.querySelectorAll(".channel");
channelNames.forEach((channel, index) => {
  channel.textContent = channels[index];
});

const programDetails = document.querySelector("#program-details");
const programName = programDetails.querySelector("#program-name");
const programType = programDetails.querySelector("#program-type");
const programTime = programDetails.querySelector("#program-time");
const programRating = programDetails.querySelector("#program-rating");
const userProgramRating = programDetails.querySelector("#user-program-rating");
const programStarRating = programRating.querySelector(".stars-container");
const userProgramStarRating =
  userProgramRating.querySelector(".stars-container");
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

function createStarRating(container) {
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i");
    star.classList.add("fa-regular", "fa-star");
    container.appendChild(star);
  }
}
createStarRating(programStarRating);
createStarRating(userProgramStarRating);

function setProgramDetails(program, startTime, endTime, channel) {
  programName.textContent = program.name;
  programType.textContent = program.type;
  otherDetails.textContent = program["other-details"];
  programTime.innerHTML = `
    <span id="program-channel">${channel}</span>
    ${startTime} - ${endTime}
  `;

  if (program.isAdult) {
    programName.textContent += " (18+)";
  }

  if (program.isRebroadcast) {
    programType.textContent += " (Rebroadcast)";
  }
  removePreviousStarRating(programStarRating);
  fillStarRating(program.rating, programRating);

  if (!program?.userRating) {
    removePreviousStarRating(userProgramStarRating);
  } else {
    fillStarRating(program.userRating, userProgramRating);
  }
  userProgramRating.classList.remove("hidden");

  const userRatingStars = userProgramStarRating.querySelectorAll("i");

  userRatingStars.forEach((star, index) => {
    star.addEventListener("click", () => {
      removePreviousStarRating(userProgramStarRating);
      program.userRating = index + 1;
      fillStarRating(program.userRating, userProgramRating);
    });
  });
  programRating.classList.remove("hidden");
}

function removePreviousStarRating(container) {
  const stars = container.querySelectorAll("i");
  stars.forEach((star) => {
    star.classList.remove("filled-star");
  });
  const ratingExact = container.parentElement.querySelector("p.rating-exact");
  ratingExact.textContent = "";
}

function fillStarRating(rating, container) {
  const stars = container.querySelectorAll("i");
  for (let i = 0; i < 5; i++) {
    const ratingRounded = Math.round(rating);

    if (i + 1 <= ratingRounded) {
      stars[i].classList.add("filled-star");
    }
  }

  const ratingExact = container.querySelector("p.rating-exact");
  ratingExact.textContent = `Rating: ${rating}/5`;
  container.appendChild(ratingExact);
}

function createProgramContainers(program, startTime) {
  // Since the API does not provide data on whether the program is for adults or not, we generate a random value.
  program.isAdult = Math.round(Math.random() - 0.3) === 1 ? true : false;
  // same as for the isAdult propery
  program.isRebroadcast = Math.round(Math.random() - 0.1) === 1 ? true : false;
  program.rating = Math.floor(Math.random() * 5) + 1;

  if (program.isRebroadcast) program.name += " (R)";

  const ratingDiv = document.createElement("div");
  ratingDiv.textContent = `Rating: ${program.rating} / 5`;

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

function displaySchedule(scheduleArray, index, channel) {
  const timeline = document.querySelector(`#channel-${index} .timeline`);

  scheduleArray.forEach(([startTime, program], index) => {
    // remove seconds from the time
    startTime = startTime.slice(0, -3);
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
      setProgramDetails(program, startTime, endTime.slice(0, -3), channel);
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
    displaySchedule(scheduleArray, index + 1, channels[index]);
  });

  hideLoading();

  const currentHour = scrollToCurrentHours();
  const timelines = document.querySelectorAll(`.timeline`);
  styleLivePrograms(timelines, currentHour);
});
