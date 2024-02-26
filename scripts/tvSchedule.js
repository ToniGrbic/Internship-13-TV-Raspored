import { setProgramDetails } from "./programDetails.js";
import { parentPIN, inputParentPIN } from "./input.js";
let currentProgramDetails;

function displaySchedule(scheduleArray, channelIndex, channel) {
  const timeline = document.querySelector(`#channel-${channelIndex} .timeline`);

  scheduleArray.forEach(([startTime, program], index) => {
    // remove seconds from the time
    startTime = startTime.slice(0, -3);
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

function handleProgramClick(
  e,
  scheduleArray,
  { program, startTime, channel, index }
) {
  if (program.isAdult && !inputParentPIN()) return;

  if (currentProgramDetails) {
    currentProgramDetails.style.border = "2px solid #ddd";
  }
  currentProgramDetails = e.currentTarget;
  currentProgramDetails.style.border = "2px solid green";

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
        program.style.backgroundColor = "green";
        program.style.color = "white";
        break;
      }
    }
  });
}

function createProgramContainers(program, startTime) {
  // Since the API does not provide data on whether the program is for adults or not, we generate a random value.
  program.isAdult = Math.round(Math.random() - 0.3) === 1 ? true : false;
  // same as for the isAdult propery
  program.isRebroadcast = Math.round(Math.random() - 0.1) === 1 ? true : false;
  program.rating = Math.floor(Math.random() * 5) + 1;
  program.userRating = null;

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

  const typeDiv = document.createElement("div");
  typeDiv.textContent = program.type;
  programDiv.appendChild(typeDiv);

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

  return { timeSlotDiv, programDiv };
}

export { displaySchedule, createProgramContainers, styleLivePrograms };
