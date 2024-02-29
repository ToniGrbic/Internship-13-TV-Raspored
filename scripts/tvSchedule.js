import { setProgramDetails } from "./programDetails.js";
import { inputParentPIN } from "./input.js";
import { userRatings } from "./programDetails.js";

let currentProgramDetails;
let programRatings = new Map();
let areProgramsAdult = new Map();
let areProgramsRebroadcast = new Map();

function displaySchedule(scheduleArray, channelIndex, channel) {
  const timeline = document.querySelector(`#channel-${channelIndex} .timeline`);

  scheduleArray.forEach(([startTime, program], index) => {
    // remove seconds from the time
    startTime = startTime.slice(0, -3);
    // Since the API does not provide some data, we generate random values.
    setMissingProgramProperties(program);
    const { timeSlotDiv, programDiv } = createProgramContainers(
      program,
      startTime
    );

    const programDetailsProps = {
      program,
      startTime,
      channel,
      index,
    };

    programDiv.addEventListener("click", (e) =>
      handleProgramClick(e, scheduleArray, programDetailsProps)
    );
    timeSlotDiv.appendChild(programDiv);
    timeline.appendChild(timeSlotDiv);
  });
}

function handleProgramClick(e, scheduleArray, programDetails) {
  const { program, startTime, channel, index } = programDetails;

  if (program.isAdult && !inputParentPIN()) return;

  if (currentProgramDetails) {
    currentProgramDetails.style.border = "2px solid #ddd";
  }
  currentProgramDetails = e.currentTarget;
  currentProgramDetails.style.border = "2px solid green";

  // get the programs end time
  let currentIndex = index + 1;
  if (currentIndex > scheduleArray.length - 1) {
    currentIndex = 0;
  }
  let [endTime, _] = scheduleArray[currentIndex];
  endTime = endTime.slice(0, -3);

  setProgramDetails(program, startTime, endTime, channel);
}

function styleLivePrograms(timelines, currentHour) {
  timelines.forEach((timeline) => {
    const programs = timeline.querySelectorAll(".program");
    for (const program of programs) {
      const programTime =
        program.previousElementSibling.textContent.split(":")[0];

      if (programTime == currentHour) {
        program.classList.add("linear-gradient-orange");
        program.style.color = "white";
        break;
      }
    }
  });
}

function checkMapValueExists(map, key) {
  return map.get(key) !== undefined;
}

function setIsAdult() {
  return Math.round(Math.random() - 0.3) === 1 ? true : false;
}

function setRating() {
  return Math.floor(Math.random() * 5) + 1;
}

function setIsRebroadcast() {
  return Math.round(Math.random() - 0.1) === 1 ? true : false;
}

function setMissingProgramProperties(program) {
  if (checkMapValueExists(programRatings, program.name))
    program.rating = programRatings.get(program.name);
  else {
    program.rating = setRating();
    programRatings.set(program.name, program.rating);
  }

  if (checkMapValueExists(areProgramsRebroadcast, program.name))
    program.isRebroadcast = areProgramsRebroadcast.get(program.name);
  else {
    program.isRebroadcast = setIsRebroadcast();
    areProgramsRebroadcast.set(program.name, program.isRebroadcast);
  }

  if (checkMapValueExists(areProgramsAdult, program.name))
    program.isAdult = areProgramsAdult.get(program.name);
  else {
    program.isAdult = setIsAdult();
    areProgramsAdult.set(program.name, program.isAdult);
  }

  if (checkMapValueExists(userRatings, program.name)) {
    console.log(userRatings.get(program.name));
    program.userRating = userRatings.get(program.name);
  } else program.userRating = null;
}

function createProgramContainers(program, startTime) {
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

export { displaySchedule, createProgramContainers, styleLivePrograms };
