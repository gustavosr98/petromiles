module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:5000/"],
      startServerCommand: "npm run start",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
