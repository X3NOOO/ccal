// i feel like i need to explain myself, see - this thing was first written as a python app, then it was rewriten to a webapp by ai, and then it was rewritten by ai again, sorry

// https://www.fao.org/3/y5686e/y5686e07.htm
// for some reason these seem to be the most widely used multipliers? i cant find any sources but i'll trust the internet i guess
const multipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};

const timetable = {
  days: 1,
  weeks: 7,
  months: 31,
  years: 365,
};

function formSerialize(form) {
  return new URLSearchParams(form).toString();
}

function formDeserialize(form, data) {
  const entries = new URLSearchParams(data).entries();
  for (const [key, val] of entries) {
    //http://javascript-coder.com/javascript-form/javascript-form-value.phtml
    const input = form.elements[key];
    if (input === undefined) {
      continue;
    }
    switch (input.type) {
      case "checkbox":
        input.checked = !!val;
        break;
      default:
        input.value = val;
        break;
    }
  }
}

class Person {
  constructor(weight, height, age, gender, activity_level) {
    this.weight = weight;
    this.height = height;
    this.age = age;
    this.gender = gender;
    this.activity_level = activity_level;
  }

  bmi() {
    return (
      Math.round(
        (this.weight / ((this.height / 100) * (this.height / 100)) +
          Number.EPSILON) *
        10
      ) / 10
    );
  }

  bmi_normal_weight_range() {
    let min =
      Math.round(
        18.5 * (this.height / 100) * (this.height / 100) * 100 + Number.EPSILON
      ) / 100;
    let max =
      Math.round(
        24.9 * (this.height / 100) * (this.height / 100) * 100 + Number.EPSILON
      ) / 100;
    return { min, max };
  }

  bmi_description() {
    // sos: wikipedia
    // Underweight (Severe thinness)	  < 16.0
    // Underweight (Moderate thinness)	16.0 - 16.9
    // Underweight (Mild thinness)	    17.0 - 18.4
    // Normal range	                    18.5 - 24.9
    // Overweight (Pre-obese)	          25.0 - 29.9
    // Obese (Class I)	                30.0 - 34.9
    // Obese (Class II)	                35.0 - 39.9
    // Obese (Class III)	              ≥ 40.0

    let bmi = this.bmi();

    if (bmi < 16) {
      return "Underweight (Severe thinness)";
    } else if (bmi < 17) {
      return "Underweight (Moderate thinness)";
    } else if (bmi < 18.5) {
      return "Underweight (Mild thinness)";
    } else if (bmi < 25) {
      return "Normal weight";
    } else if (bmi < 30) {
      return "Overweight (Pre-obese)";
    } else if (bmi < 35) {
      return "Obese (Class I)";
    } else if (bmi < 40) {
      return "Obese (Class II)";
    }
    return "Obese (Class III)";
  }

  ibw() {
    // Devine formula
    // Male = 50 + 0.9 * (height − 152)
    // Female = 45.5 + 0.9 * (height − 152

    let ibw = 0.9 * (this.height - 152);
    this.gender === "male" ? (ibw += 50) : (ibw += 45.5);

    return Math.round((ibw + Number.EPSILON) * 100) / 100;
  }

  bmr() {
    // Mifflin St Jeor equation
    let bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age;
    this.gender === "male" ? (bmr += 5) : (bmr -= 161);
    return bmr;
  }

  tdee() {
    return this.bmr() * multipliers[this.activity_level];
  }
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  let fd = new FormData(e.target);
  localStorage.removeItem("person");
  localStorage.setItem("person", formSerialize(fd));

  const p = new Person(
    fd.get("weight"),
    fd.get("height"),
    fd.get("age"),
    fd.get("gender"),
    fd.get("activity_level")
  );

  let only_pounds = document.getElementById("pounds_only").checked;

  document.getElementById("bmi").innerText = p.bmi();
  document.getElementById("bmi_category").innerText = p.bmi_description();
  let normal_bmi_range = p.bmi_normal_weight_range();
  document.getElementById("bmi_healthy_weight_range").innerText =
    normal_bmi_range.min + " kg - " + normal_bmi_range.max + " kg";
  normal_bmi_range_imperial = {
    min: kg_to_imperial(normal_bmi_range.min, only_pounds),
    max: kg_to_imperial(normal_bmi_range.max, only_pounds),
  };
  document.getElementById("bmi_healthy_weight_range_imperial").innerText =
    only_pounds
      ? normal_bmi_range_imperial.min.pounds +
      " pounds - " +
      normal_bmi_range_imperial.max.pounds +
      " pounds"
      : normal_bmi_range_imperial.min.stones +
      " stone " +
      normal_bmi_range_imperial.min.pounds +
      " pounds - " +
      normal_bmi_range_imperial.max.stones +
      " stone " +
      normal_bmi_range_imperial.max.pounds +
      " pounds";

  document.getElementById("ibw").innerText = p.ibw() + " kg";
  let ibw_imperial = kg_to_imperial(p.ibw(), only_pounds);
  document.getElementById("ibw_imperial").innerText =
    only_pounds
      ? ibw_imperial.pounds + " pounds"
      : ibw_imperial.stones + " stone " + ibw_imperial.pounds + " pounds";
  document.getElementById("bmr").innerText =
    Math.round(p.bmr() + Number.EPSILON) + " kcal";
  document.getElementById("tdee").innerText =
    Math.round(p.tdee() + Number.EPSILON) + " kcal";
  let calorie_per_day = p.tdee();
  let weight_diff = p.weight - parseInt(fd.get("desired_weight"));
  let calories_to_the_goal = weight_diff * CALORIES_IN_KG_OF_FAT;
  let calories_diff;
  switch (fd.get("desired_method")) {
    case "deficit":
      calories_diff = parseFloat(fd.get("desired_deficit"));
      break;
    case "time":
      let days_to_the_goal =
        parseInt(fd.get("desired_time")) * timetable[fd.get("desired_time_unit")];
      calories_diff = calories_to_the_goal / days_to_the_goal;
      break;
    default:
      alert("error, unknown deficit method");
      throw new Error("unknown deficit method");
  }
  let calorie_per_cheatday = calorie_per_day;
  if (p.weight > fd.get("desired_weight")) {
    document.getElementById("surplus_or_deficit").innerText = "deficit";
    calorie_per_day -= calories_diff;
    if (fd.has("cheatday") && fd.get("cheatday_value") > 0) {
      calorie_per_day -= fd.get("cheatday_value");
      calorie_per_cheatday += fd.get("cheatday_value") * 7;
    }
  } else {
    document.getElementById("surplus_or_deficit").innerText = "surplus";
    calorie_per_day = calorie_per_day + calories_diff;
    if (fd.has("cheatday") && fd.get("cheatday_value") > 0) {
      calorie_per_day += fd.get("cheatday_value");
      calorie_per_cheatday -= fd.get("cheatday_value") * 7;
    }
  }
  document.getElementById("calorie_diff").innerText = Math.abs(calories_diff);
  document.getElementById("overcalorie_warning").hidden = !(
    calorie_per_cheatday > p.tdee() && p.weight > fd.get("desired_weight")
  );
  document.getElementById("calories_per_day").innerText =
    Math.round(calorie_per_day) + " kcal";
  document.getElementById("calories_per_cheatday").innerText =
    Math.round(calorie_per_cheatday) + " kcal";
  let days_to_the_goal = Math.round(
    calories_to_the_goal / (p.tdee() - calorie_per_day)
  );
  let today = new Date();
  let time_to_the_goal = new Date(
    today.setDate(today.getDate() + days_to_the_goal)
  );
  document.getElementById("time_to_goal").innerText =
    time_to_the_goal.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  document.getElementById("cheatdays").hidden = !fd.has("cheatday") || fd.get("cheatday_value") <= 0;
  document.getElementById("output").hidden = false;
});

window.addEventListener("load", () => {
  let p = localStorage.getItem("person");
  let f = document.querySelector("form");
  if (p) {
    formDeserialize(f, p);
  }
  disable_other_method();
  show_cheatday();
  update_desired_deficit(document.getElementById("desired_deficit").value);

  hide_stones(document.getElementById("pounds_only").checked);
});
