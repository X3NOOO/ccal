const POUND_TO_KG = 0.45359237;
const STONE_TO_POUND = 14;
const STONE_TO_KG = POUND_TO_KG * STONE_TO_POUND;

const CM_TO_INCH = 0.393700787;
const INCH_TO_CM = 1 / CM_TO_INCH;
const FOOT_TO_INCH = 12;
const FOOT_TO_CM = FOOT_TO_INCH * INCH_TO_CM;
console.log(FOOT_TO_CM);

function hide_stones() {
  let checkbox = document.getElementById("only_pounds");
  let stones = document.getElementById("weight_stones");
  stones.disabled = checkbox.checked;
  stones.hidden = checkbox.checked;
  if (checkbox.checked) {
    stones.value = 0;
  }
}

function imperial_to_kg(stones, pounds) {
  return (
    Math.round(
      (stones * STONE_TO_KG + pounds * POUND_TO_KG + Number.EPSILON) * 100
    ) / 100
  );
}

function kg_to_imperial(kg, only_pounds) {
  let stones, pounds;

  if (only_pounds) {
    pounds = Math.round((kg / POUND_TO_KG + Number.EPSILON) * 100) / 100;
  } else {
    stones = Math.floor(kg / STONE_TO_KG);
    pounds =
      Math.round(((kg % STONE_TO_KG) / POUND_TO_KG + Number.EPSILON) * 100) /
      100;
  }

  return { stones, pounds };
}

function update_weight(e) {
  let only_pounds = document.getElementById("only_pounds");
  let weight = document.getElementById("weight");
  let weight_stones = document.getElementById("weight_stones");
  let weight_pounds = document.getElementById("weight_pounds");

  if (e.id == "weight") {
    w = kg_to_imperial(weight.value, only_pounds.checked);
    weight_stones.value = w.stones;
    weight_pounds.value = w.pounds;
  } else {
    weight.value = imperial_to_kg(weight_stones.value, weight_pounds.value);
  }
}

function imperial_to_cm(feet, inches) {
  return (
    Math.round(
      (feet * FOOT_TO_CM + inches * INCH_TO_CM + Number.EPSILON) * 100
    ) / 100
  );
}

function cm_to_imperial(cm) {
  let feet = Math.floor(cm / FOOT_TO_CM);
  let inches =
    Math.round(((cm % FOOT_TO_CM) / INCH_TO_CM + Number.EPSILON) * 100) / 100;
  return { feet, inches };
}

function update_height(e) {
  let height = document.getElementById("height");
  let height_feet = document.getElementById("height_feet");
  let height_inches = document.getElementById("height_inches");

  if (e.id == "height") {
    h = cm_to_imperial(height.value);
    height_feet.value = h.feet;
    height_inches.value = h.inches;
  } else {
    height.value = imperial_to_cm(height_feet.value, height_inches.value);
  }
}
