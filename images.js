const { connection } = require("./src/db/mysql");
let imageManifest = {};
const setEntryToManifest = (imgPath) => {
  const isExist = Object.keys(imageManifest).includes(imgPath);
  if (isExist) return;
  const timestamp = new Date().getTime() + Math.floor(Math.random() * 1000000);
  imageManifest[imgPath] = `${imgPath}?t=${timestamp}`;
};

const updateManifestEntry = (path) => {
  const keys = Object.keys(imageManifest);
  const emailList = keys.map((key, i) => {
    const email = getEmailFromImagePath(key);
    return email;
  });
  const pathEmail = getEmailFromImagePath(path);
  if (emailList.includes(pathEmail)) {
    const timestamp =
      new Date().getTime() + Math.floor(Math.random() * 1000000);
    imageManifest[path] = `${path}?t=${timestamp}`;
  } else {
    return;
  }
};

const getEmailFromImagePath = (path) => {
  const dotIndex = path.lastIndexOf(".");
  const email = key.slice(0, dotIndex);
  return email;
};

const getImageManifestList = () => {
  return imageManifest;
};

const getManifestValue = (path) => {
  const isExist = Object.keys(imageManifest).includes(path);

  if (isExist) {
    return imageManifest[path];
  } else {
    return path;
  }
};

const loadManifest = () => {
  const sql = `select img from USERS;`;
  connection.query(sql, (err, rows) => {
    console.log("start");
    if (err) {
      console.log("err");
      console.log("frailed to load image");
    }

    if (rows && rows.length) {
      console.log("exist");
      rows.map((row, i) => {
        const path = row.img;
        setEntryToManifest(path);
      });
    }
  });
};

module.exports = {
  setEntryToManifest,
  loadManifest,
  getImageManifestList,
  getManifestValue,
  updateManifestEntry,
};
