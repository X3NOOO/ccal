// https://www.fao.org/3/y5686e/y5686e07.htm
// for some reason these seem to be the most widely used multipliers? i cant find any sources but i'll trust the internet i guess
const multipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
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
  constuctor(weight, height, age, gender, activity_level) {
    console.log("chuj")
    this.weight = weight;
    this.height = height;
    this.age = age;
    this.gender = gender;
    this.activity_level = activity_level;
    console.log(weight)
    console.log(this)
  }

  bmi() {
    return (
      Math.round(
        (this.weight / this.height / this.height + Number.EPSILON) * 100
      ) / 100
    );
  }

  bmi_normal_weight_range() {
    let min = 18.5 * this.height * this.height;
    let max = 24.9 * this.height * this.height;
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

    return ibw;
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
  fd = new FormData(e.target);
  // store in local storage
  localStorage.removeItem("person");
  localStorage.setItem("person", formSerialize(fd));

  p = new Person(
    fd.get("weight"),
    fd.get("height"),
    fd.get("age"),
    fd.get("gender"),
    fd.get("activity_level")
  );
  console.log(p);
  document.getElementById("bmi").innerHTML = p.bmi();
  document.getElementById("bmi_category").innerHTML = p.bmi_description();

  document.getElementById("output").hidden = false;
});

// bind to load event
window.addEventListener("load", () => {
  let p = localStorage.getItem("person");
  let f = document.querySelector("form");
  if (p) {
    formDeserialize(f, p);
  }
  disable_other_method();
  show_cheatday();
  update_desired_deficit(document.getElementById("desired_deficit").value);
});
