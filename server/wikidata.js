import axios from "axios";
import hashsum from "hashsum";
import crypto from "crypto";
import open from "open";
import { getAllUserUIDs } from "./fireBaseAdmin.js";
import pool from "./db.js";
import { celebrityNames } from "./celebName.js";
//main function
async function getCelebImages(celebName, uidIndex) {
  const celebId = await getCelebIdByName(celebName);
  //   console.log("id: ", celebId);
  try {
    // Query Wikidata for information about the celebrity
    const response = await axios.get(`https://www.wikidata.org/w/api.php`, {
      params: {
        action: "wbgetentities",
        format: "json",
        ids: celebId,
        props: "claims",
      },
    });

    const entities = response.data.entities;

    const entityId = Object.keys(entities)[0];
    // console.log("entityId: ", entityId);

    if (!entityId) {
      console.error("Celeb not found on Wikidata");
      return;
    }

    // Extract image information
    // Extract image information
    const claims = entities[entityId].claims;
    const imageValue = claims.P18[0].mainsnak.datavalue.value;
    const imageUrl = `https://commons.wikimedia.org/wiki/File:${imageValue}`;

    // Example usage with the place ID 'Q819170'
    // const placeId = "Q819170";
    // const placeId = "Q" + placeofBirth["numeric-id"];

    // Replace spaces with underscores
    const formattedImageValue = imageValue.replace(/\s/g, "_");

    const imgMD5Hash = getMD5Hash(formattedImageValue);
    //prettier-ignore
    const imgFileUrl = `https://upload.wikimedia.org/wikipedia/commons/${imgMD5Hash[0]}/${imgMD5Hash[0]+imgMD5Hash[1]}/${formattedImageValue}`;

    // open(imgFileUrl);

    const celebCategory = await getOccupation(celebId);
    const celebDescription = await getEntityDescription(celebId);
    const celebName = await getEntityName(celebId);

    const talentInfo = {
      name: celebName,
      category: categoryDict[celebCategory],
      email: celebName + "@gmail.com",
      description: celebDescription,
      reviews: 5,
      price: Math.floor(Math.random() * (250 - 20 + 1)) + 20,
      imgUrl: imgFileUrl,
      uid: a[uidIndex],
    };

    try {
      const result = await pool.query(
        "INSERT INTO celeb(displayName, username, category, price, email, description, uid, imgurl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          talentInfo.name,
          talentInfo.name,
          talentInfo.category,
          talentInfo.price,
          talentInfo.email,
          talentInfo.description,
          talentInfo.uid,
          talentInfo.imgUrl,
        ]
      );
      console.log("succefull");
    } catch (error) {
      console.log("error: ", error);
    }

    console.log(talentInfo);

    // console.log("url: ", imageValue);
  } catch (error) {
    console.error("Error querying Wikidata:", error.message);
  }
}

function getMD5Hash(imgValue) {
  let hash = crypto.createHash("md5").update(imgValue).digest("hex");
  return hash;
}

async function getCelebIdByName(celebName) {
  try {
    // Query Wikidata for the celebrity by name
    const response = await axios.get("https://www.wikidata.org/w/api.php", {
      params: {
        action: "wbsearchentities",
        format: "json",
        search: celebName,
        language: "en", // Set the language for search results
      },
    });

    // Check if there are search results
    if (response.data.search.length > 0) {
      // Extract the Wikidata ID of the first search result
      const celebId = response.data.search[0].id;
      //   console.log(`Wikidata ID for ${celebName}: ${celebId}`);
      return celebId;
    } else {
      console.error(`No results found for ${celebName}`);
    }
  } catch (error) {
    console.error("Error querying Wikidataxx:", error.message);
  }
}

async function getOccupation(entityId) {
  try {
    const response = await axios.get("https://www.wikidata.org/w/api.php", {
      params: {
        action: "wbgetentities",
        format: "json",
        ids: entityId,
        props: "claims",
      },
    });

    const claims = response.data.entities[entityId].claims;
    if (claims.P106 && claims.P106[0].mainsnak.datavalue.value.id) {
      const occupationId = claims.P106[0].mainsnak.datavalue.value.id;
      const occupationLabel = await getEntityLabel(occupationId);

      return occupationLabel;
    } else {
      return "Occupation not found";
    }
  } catch (error) {
    console.error("Error querying Wikidata:", error.message);
  }
}

async function getEntityLabel(entityId) {
  try {
    const response = await axios.get("https://www.wikidata.org/w/api.php", {
      params: {
        action: "wbgetentities",
        format: "json",
        ids: entityId,
        props: "labels",
      },
    });

    return response.data.entities[entityId].labels.en.value;
  } catch (error) {
    console.error("Error querying Wikidata:", error.message);
  }
}

async function getEntityDescription(entityId) {
  try {
    const response = await axios.get("https://www.wikidata.org/w/api.php", {
      params: {
        action: "wbgetentities",
        format: "json",
        ids: entityId,
        props: "descriptions",
      },
    });

    const descriptions = response.data.entities[entityId].descriptions;

    if (descriptions && descriptions.en && descriptions.en.value) {
      console.log(descriptions.en.value);
      return descriptions.en.value;
    } else {
      return "Description not found";
    }
  } catch (error) {
    console.error("Error querying Wikidata:", error.message);
  }
}

async function getEntityName(entityId) {
  try {
    const response = await axios.get("https://www.wikidata.org/w/api.php", {
      params: {
        action: "wbgetentities",
        format: "json",
        ids: entityId,
        props: "labels",
      },
    });

    const labels = response.data.entities[entityId].labels;
    if (labels && labels.en && labels.en.value) {
      return labels.en.value;
    } else {
      return "Name not found";
    }
  } catch (error) {
    console.error("Error querying Wikidata:", error.message);
  }
}

// Example usage
const celebName = "dick"; // Example ID for Barack Obama

const categoryDict = {
  "association football player": "Footballers",
  "film actor": "actors",
  entrepreneur: "business",
  politcian: "business",
  YouTuber: "reality-tv",
  boxer: "athletes",
  "athletics competitor": "athletes",
  "singer-songwriter": "actors",
  singer: "actors",
  songwrite: "actors",
  programmer: "business",
  comedian: "comedians",
  "tennis player": "athletes",
  "television presenter": "reality tv",
  "television actor": "actors",
  actor: "actors",
  "stage actor": "actors",
  screenwriter: "actors",
  model: "reality-tv",
  "basketball player": "athletes",
  "professional wrestler": "athletes",
  "artistic gymnast": "athletes",
  "film producer": "actors",
  investor: "business",
  socialite: "reality-tv",
  "film director": "actors",
  "fashion designer": "reality-tv",
};

// console.log(name);
// getCelebImages(celebName);
const a = await getAllUserUIDs();

console.log(a.length);

for (let i = 0; i < celebrityNames.length; i++) {
  getCelebImages(celebrityNames[i], i);
}

// console.dir(a, { maxArrayLength: null });
