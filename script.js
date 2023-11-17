// https://www.fao.org/3/y5686e/y5686e07.htm
// for some reason these seem to be the most widely used multipliers? i cant find any sources but i'll trust the internet i guess
const multipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};
const CALORIES_IN_KG_OF_FAT = 7700;

class Person {
  constuctor(weight, height, age, gender, activity_level) {
    self.weight = weight;
    self.height = height;
    self.age = age;
    self.gender = gender;
    self.activity_level = activity_level;
  }

  bmi() {
    return self.weight / (self.height * self.height);
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

    let bmi = self.bmi();

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

  bmr() {
    // Mifflin St Jeor equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    gender === "male" ? (bmr += 5) : (bmr -= 161);
    return bmr;
  }

  tdee() {
    return self.bmr() * multipliers[self.activity_level];
  }
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  fd = new FormData(e.target);

  p = new Person(
    fd.get("weight"),
    fd.get("height"),
    fd.get("age"),
    fd.get("gender"),
    fd.get("activity_level")
  );
  // sleep https://www.pnas.org/doi/abs/10.1073/pnas.1216951110


});
