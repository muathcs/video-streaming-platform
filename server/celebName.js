export const celebrityNames = [
  "Robert Downey Jr.",
  "Jennifer Aniston",
  "Chris Hemsworth",
  "Jim Carrey",
  "Will Ferrell",
  "Dave Chappelle",
  "Lionel Messi",
  "Cristiano Ronaldo",
  "Serena Williams",
  "Usain Bolt",
  "Elon Musk",
  "Oprah Winfrey",
  "Kylie Jenner",
  "Joey King",
  "Millie Bobby Brown",
  "Tom Holland",
  "Dwayne Johnson",
  "Tom Brady",
  "LeBron James",
  "Alex Morgan",
  "Simone Biles",
  "Bill Gates",
  "Mark Zuckerberg",
  "Warren Buffett",
  "Elon Musk",
  "Kendall Jenner",
  "North West",
  "Mason Disick",
  "Stormi Webster",
  "Khloé Kardashian",
  "Jimmy Fallon",
  "Ellen DeGeneres",
  "Stephen Colbert",
  "Trevor Noah",
  "John Oliver",
  "Amy Schumer",
  "Ricky Gervais",
  "Kevin Hart",
  "Seth Rogen",
  "Tommy Wiseau",
  "Will Smith",
  "Ryan Reynolds",
  "Blake Lively",
  "Emily Blunt",
  "Kristen Bell",
  "Chris Pratt",
  "Zach Galifianakis",
  "Tina Fey",
  "Amy Poehler",
  "Jonah Hill",
  "Chris Rock",
  "Drew Barrymore",
  "Julia Louis-Dreyfus",
  "Idris Elba",
  "Gal Gadot",
  "Brie Larson",
  "Jennifer Garner",
  "Chris Evans",
  "Bradley Cooper",
  "Eddie Murphy",
  "Robert Pattinson",
  "Scarlett Johansson",
  "Angelina Jolie",
  "Brad Pitt",
  "Leonardo DiCaprio",
  "Cate Blanchett",
  "Charlize Theron",
  "Nicole Kidman",
  "Reese Witherspoon",
  "Zendaya",
  "Gigi Hadid",
  "Ryan Gosling",
  "Emma Stone",
  "Mark Wahlberg",
  "Margot Robbie",
  "Emma Watson",
  "Keanu Reeves",
  "Harrison Ford",
  "Anne Hathaway",
  "Joaquin Phoenix",
  "Denzel Washington",
  "Viola Davis",
  "Willow Smith",
  "Kourtney Kardashian",
  "Kris Jenner",
  "Kim Kardashian",
  "Paris Hilton",
  "Chrissy Teigen",
  "Kobe Bryant",
  "Michael Jordan",
  "David Beckham",
  "Cristiano Ronaldo Jr.",
];

// Function to duplicate each name in the array and append a suffix
function duplicateNamesWithSuffix(names, duplicates, suffix) {
  // Create a new array to store the duplicated names
  const duplicatedNames = [];

  // Iterate over each name in the original array
  names.forEach((name) => {
    // Add the original name to the duplicated names array
    duplicatedNames.push(name);

    // Duplicate the name and append the suffix based on the number of duplications
    for (let i = 1; i <= duplicates; i++) {
      duplicatedNames.push(`${name} ${suffix}${i}`);
    }
  });

  // Return the array of duplicated names
  return duplicatedNames;
}
