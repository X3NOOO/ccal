const POUND_TO_KG = 0.45359237;
const STONE_TO_POUND = 14;
const STONE_TO_KG = POUND_TO_KG * STONE_TO_POUND;

const CM_TO_INCH = 0.393700787;
const INCH_TO_CM = 1 / CM_TO_INCH;
const FOOT_TO_INCH = 12;
const FOOT_TO_CM = FOOT_TO_INCH * INCH_TO_CM;

const CALORIES_IN_KG_OF_FAT = 7700;

function hide_stones(hide) {
  document.querySelectorAll('.imperial-inputs').forEach(container => {
    container.classList.toggle('pounds-only-mode', hide);

    const stoneInputs = container.querySelectorAll('.weight_stones');
    stoneInputs.forEach(input => {
      input.style.display = hide ? 'none' : '';
    });

    stoneInputs.forEach(input => {
      const nextElement = input.nextElementSibling;
      if (nextElement && nextElement.tagName === 'LABEL') {
        nextElement.style.display = hide ? 'none' : '';
      }
    });
  });

  let weight = document.getElementById("weight");
  if (weight && weight.value) {
    let w = kg_to_imperial(weight.value, hide);
    document.getElementById("weight_stones").value = w.stones;
    document.getElementById("weight_pounds").value = w.pounds;
  }

  let desired_weight = document.getElementById("desired_weight");
  if (desired_weight && desired_weight.value) {
    let w = kg_to_imperial(desired_weight.value, hide);
    let desired_stones = document.getElementById("desired_weight_stones");
    let desired_pounds = document.getElementById("desired_weight_pounds");
    if (desired_stones) desired_stones.value = w.stones;
    if (desired_pounds) desired_pounds.value = w.pounds;
  }
}

function hide_desired_stones() {
  let checkbox = document.getElementById("desired_only_pounds");
  let stones = document.getElementById("desired_weight_stones");
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
  let pounds_only = document.getElementById("pounds_only").checked;
  let weight = document.getElementById("weight");
  let weight_stones = document.getElementById("weight_stones");
  let weight_pounds = document.getElementById("weight_pounds");

  if (e.id == "weight") {
    w = kg_to_imperial(weight.value, pounds_only);
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

function update_desired_weight(e) {
  let pounds_only = document.getElementById("pounds_only").checked;
  let weight = document.getElementById("desired_weight");
  let weight_stones = document.getElementById("desired_weight_stones");
  let weight_pounds = document.getElementById("desired_weight_pounds");

  if (e.id == "desired_weight") {
    w = kg_to_imperial(weight.value, pounds_only);
    weight_stones.value = w.stones;
    weight_pounds.value = w.pounds;
  } else {
    weight.value = imperial_to_kg(weight_stones.value, weight_pounds.value);
  }
}

function update_desired_deficit(value) {
  document.getElementById("desired_deficit").value = value;
  document.getElementById("desired_deficit_value").innerText = value;

  // only_pounds = document.getElementById("only_pounds").checked;
  weight_diff_e = document.getElementById("deficit_to_weight_per_week");

  weight_diff = (value * 7) / CALORIES_IN_KG_OF_FAT;
  weight_diff_imperial = kg_to_imperial(weight_diff, true);

  weight_diff_e.innerText = `${Math.round((weight_diff + Number.EPSILON) * 1000)}g per week / ${weight_diff_imperial.pounds} pound${weight_diff_imperial.pounds === 1 ? '' : 's'} per week`;
}

function __disable_other_method(disable, enable) {
  let to_disable = document.querySelectorAll('.' + disable);
  let to_enable = document.querySelectorAll('.' + enable);
  to_disable.forEach(e => {
    e.disabled = true;
  });
  to_enable.forEach(e => {
    e.disabled = false;
  });
}

function disable_other_method() {
  let using_deficit = document.getElementById("desired_method_deficit").checked;

  using_deficit ? __disable_other_method("for_desired_method_time", "for_desired_method_deficit") : __disable_other_method("for_desired_method_deficit", "for_desired_method_time");
}

function show_cheatday() {
  value = document.getElementById("cheatday").checked;
  document.getElementById("cheatday_options").hidden = !value;
  document.getElementById("cheatday_value").value = value ? document.getElementById("cheatday_value").value : 0;
}