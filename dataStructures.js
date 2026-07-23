class EfficientDataStructure {
  constructor() {
    this.set = new Set();
    this.array = [];
  }

  add(element) {
    if (!this.set.has(element)) {
      this.set.add(element);
      this.array.push(element);
    }
  }

  has(element) {
    return this.set.has(element);
  }

  getRandomElement(isDaily = false) {
    if (this.array.length === 0) {
      return undefined;
    }

    let randomIndex;
    if (isDaily) {
      randomIndex = Math.floor(Math.random() * this.array.length);
    } else {
      const millisecondsInADay = 24 * 60 * 60 * 1000;
      const timeZoneOffsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000;
      const daysSinceEpoch = Math.floor((Date.now() - timeZoneOffsetInMilliseconds) / millisecondsInADay);
      //alert("Date.now() is " + Date.now() + " ; seed is " + daysSinceEpoch);
      const randomGenerator = customRandomSeed(daysSinceEpoch * daysSinceEpoch);

      randomIndex = randomGenerator.randomInt(0, this.array.length);
    }

    return this.array[randomIndex];
  }
}
