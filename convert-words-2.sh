#!/bin/bash

input_file="targetOptions.txt"
output_file="targetOptions.js"

echo "class EfficientDataStructure {
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

  getRandomElement() {
    if (this.array.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * this.array.length);
    return this.array[randomIndex];
  }
}

const dictionary = new EfficientDataStructure();" > "$output_file"

while IFS= read -r word || [[ -n "$word" ]]; do
  echo "dictionary.add(\"$word\");" >> "$output_file"
done < "$input_file"

echo "Dictionary conversion completed. Output file: $output_file"
