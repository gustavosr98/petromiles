const axios = require("axios");
const fs = require("fs");

const baseDomain = process.env.VUE_APP_PETROMILES_API_URL;

// Don't forget to add your tags
// IMPORTANT! Each tag must have the name of the component
const LANGS = ["en", "es"];

const httpClient = axios.create({
  baseURL: baseDomain || "http://localhost:3000/api/v1",
  crossDomain: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: parseInt(process.env.VUE_APP_PETROMILES_API_TIMEOUT) || 30000,
});
httpClient.interceptors.response.use(response => response.data);

async function loadLocalesRemotelly() {
  LANGS.map(lang => {
    httpClient
      .get(`/language/${lang}`)
      .then(terms => {
        let termsGroupedByTags = groupTermsByTags(terms);
        fs.writeFile(
          __dirname + `/${lang}.json`,
          JSON.stringify(termsGroupedByTags),
          err => {
            if (err) console.log(`Error writing file ${lang}.json:`, err);
            else console.log(`Got ${lang}.json locale`);
          }
        );
      })
      .catch(err => {
        console.log(
          `Error writing file ${lang}.json | Please SERVE FIRST BACKEND !!`
        );
        console.log(err);
      });
  });
}

function groupTermsByTags(terms) {
  let termsGroupedByTags = {};
  const tags = getTags(terms);

  tags.map(tag => {
    termsGroupedByTags[tag] = {};
    terms
      .filter(term => !!term.tags.includes(tag))
      .map(term => {
        termsGroupedByTags[tag][term.term] =
          term.plural.length > 0
            ? `${term.translation.content.one} | ${term.translation.content.other} | {count} ${term.translation.content.other}`
            : term.translation.content;
      });
  });

  return termsGroupedByTags;
}

function getTags(terms) {
  return mergeArrays(...terms.map(term => term.tags));
}

function mergeArrays(...arrays) {
  let jointArray = [];

  arrays.forEach(array => {
    jointArray = [...jointArray, ...array];
  });
  const uniqueArray = jointArray.reduce((newArray, item) => {
    if (newArray.includes(item)) {
      return newArray;
    } else {
      return [...newArray, item];
    }
  }, []);
  return uniqueArray;
}

loadLocalesRemotelly();
