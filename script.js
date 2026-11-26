"use strict";

// Each successive scene is half a stop darker; scene 1 is EV 11 at ISO 100.
const scenes = [
  ["Ice shows", "Multiple white spotlights. For colored spotlights, try scene 4."],
  ["Burning buildings & fires", "For more detail around the fire, try scene 5."],
  ["Bright stages & boxing rings", "For subdued stage lighting, try scene 6; for nearby spectators, try scene 5."],
  ["Neon signs & theater marquees", "For more detail in the surroundings, try scene 7."],
  ["Campfires, screens & circus spotlights", "For color screens, try scene 8. Screens call for 1/25 or 1/30 second; for ground-level circus acts, try scene 7."],
  ["Bright shop windows & gas stations", "Brightly illuminated displays and gas stations."],
  ["Indoor holiday lights & bright interiors", "Includes portraits near bright displays. Holiday decorations and people may need additional fill light."],
  ["Bright main streets & floodlit sports", "Includes race tracks. For rain-wet street reflections, try scene 6."],
  ["Fireworks, amusement parks & light trails", "For fireworks or lightning, use the aperture for a one-second exposure and time each burst. Light trails need longer exposures."],
  ["Gymnasiums, exhibitions & lamp-lit portraits", "Average brightly lit arenas and indoor sporting events, or portraits by a 150-watt table lamp."],
  ["Floodlit monuments & dim gas stations", "For floodlit subjects farther away, try scene 13. Colored or subdued lighting may need one or two extra stops."],
  ["Medium-lit interiors", "Includes lobbies, terminals, homes, offices, and shops."],
  ["Outdoor holiday lights & candlelight", "Close-ups by candle or match light. Outdoor decorations may need fill light at night; at dusk, ambient light may suffice."],
  ["Medium-lit transit interiors", "Moderately illuminated trains, buses, and aircraft."],
  ["Side streets & city skylines at dusk", "Moderately lit street corners or city views at dusk."],
  ["Waterfalls in white light", "A brightly illuminated waterfall at night."],
  ["Dim subway stations", "Platforms, stations, and stairways."],
  ["Dim nightclubs & ballrooms", "Interiors with subdued artificial light."],
  ["Rail yards & dim industrial sites", "For rain or fog, try scene 17; with snow on the ground, try scene 21."],
  ["Waterfalls in colored light", "A waterfall illuminated with colored lights."],
  ["Distant city skylines", "Buildings and bridges with scattered illuminated windows."],
  ["Dim boatyards & docks", "For rain or fog, try scene 24."],
  ["Dim small towns & villages", "Scattered window lights and street lamps at night."],
  ["Snow or ice under a full moon", "A moonlit winter landscape."],
  ["Sea or sand under a full moon", "A moonlit seascape or sandy landscape."],
  ["Landscape under a full moon", "A landscape lit by a full moon."]
];

const isos = [6, 12, 25, 50, 100, 200, 400, 800, 1600, 3200, 6400];
const apertures = ["32", "27", "22", "19", "16", "13", "11", "9.5", "8", "6.7", "5.6", "4.8", "4", "3.4", "2.8", "2.4", "2", "1.7", "1.4", "1.2", "1"];
const speeds = [
  "2 hr", "90 min", "1 hr", "45 min", "30 min", "20 min", "15 min", "10 min",
  "8 min", "6 min", "4 min", "3 min", "2 min", "90 s", "60 s", "45 s",
  "30 s", "20 s", "15 s", "10 s", "8 s", "6 s", "4 s", "3 s", "2 s",
  "1.5 s", "1 s", "1/1.5", "1/2", "1/3", "1/4", "1/6", "1/8", "1/10",
  "1/15", "1/20", "1/30", "1/45", "1/60", "1/90", "1/125", "1/180",
  "1/250", "1/350", "1/500", "1/750", "1/1000", "1/1500", "1/2000",
  "1/3000", "1/4000"
];

const sceneSelect = document.querySelector("#scene");
const isoSelect = document.querySelector("#iso");
const apertureSelect = document.querySelector("#aperture");
const table = document.querySelector("#exposure-table");

function addOptions(select, values, label) {
  values.forEach((value, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = label(value, index);
    select.append(option);
  });
}

addOptions(sceneSelect, scenes, (scene, index) => `${String(index + 1).padStart(2, "0")} — ${scene[0]}`);
addOptions(isoSelect, isos, iso => `ISO ${iso}`);
addOptions(apertureSelect, apertures, aperture => `f/${aperture}`);
isoSelect.value = "4";
apertureSelect.value = "8";

function exposure(sceneIndex, isoIndex, apertureIndex) {
  // At scene 1, ISO 100 and f/32, the printed slide reads 1/2 second.
  const index = speeds.indexOf("1/2") - sceneIndex + (isoIndex - 4) * 2 + apertureIndex;
  return speeds[index] ?? null;
}

function render() {
  const sceneIndex = Number(sceneSelect.value);
  const isoIndex = Number(isoSelect.value);
  const apertureIndex = Number(apertureSelect.value);
  const speed = exposure(sceneIndex, isoIndex, apertureIndex);
  const parts = speed ? speed.split(" ") : [];
  document.querySelector("#scene-detail").textContent = scenes[sceneIndex][1];
  document.querySelector("#shutter").textContent = speed ? parts[0] : "Outside scale";
  document.querySelector("#shutter").classList.toggle("out-of-range", !speed);
  document.querySelector("#shutter-unit").textContent = !speed ? "Try another aperture or film speed." : parts[1] === "hr" ? "HOURS" : parts[1] === "min" ? "MINUTES" : "SECONDS";
  document.querySelector("#result-iso").textContent = `ISO ${isos[isoIndex]}`;
  document.querySelector("#result-aperture").textContent = `f/${apertures[apertureIndex]}`;
  document.querySelector("#result-ev").textContent = 11 - sceneIndex / 2;

  table.replaceChildren();
  apertures.forEach((aperture, index) => {
    const row = document.createElement("tr");
    const speedValue = exposure(sceneIndex, isoIndex, index);
    if (index === apertureIndex) row.classList.add("selected-row");
    const apertureCell = document.createElement("td");
    const speedCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const button = document.createElement("button");
    apertureCell.textContent = `f/${aperture}`;
    speedCell.textContent = speedValue ? (speedValue.includes(" ") ? speedValue : `${speedValue} s`) : "Outside scale";
    button.type = "button";
    button.textContent = index === apertureIndex ? "Selected" : "Select";
    button.setAttribute("aria-label", `Select aperture f/${aperture}`);
    button.setAttribute("aria-pressed", String(index === apertureIndex));
    button.addEventListener("click", () => {
      apertureSelect.value = String(index);
      render();
      apertureSelect.focus();
    });
    actionCell.append(button);
    row.append(apertureCell, speedCell, actionCell);
    table.append(row);
  });
}

[sceneSelect, isoSelect, apertureSelect].forEach(select => select.addEventListener("change", render));
render();
