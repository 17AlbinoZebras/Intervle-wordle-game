#!/bin/bash

input_file="guessOptions.txt"
output_file="guessOptions.js"

echo "const dictionary = new Set([" > "$output_file"
while IFS= read -r word || [[ -n "$word" ]]; do
  echo "\"$word\"," >> "$output_file"
  done < "$input_file"
  echo "]);" >> "$output_file"

  echo "Dictionary conversion completed. Output file: $output_file"


