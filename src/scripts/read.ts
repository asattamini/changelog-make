import path from "path";
import fs from "fs";

export = function read() {
  const fullPath = path.dirname(require.main?.filename || "");
  const regexResp = /^(.*?)node_modules/.exec(fullPath);
  const rootPath = regexResp ? regexResp[1] : fullPath;

  const directoryPath = path.join(rootPath, "/changelog");

  fs.readdir(directoryPath, function (err, files) {
    let output = "";
    if (files) {
      const totalFiles = files.length;
      files.forEach(function (file, firstIndex) {
        const data = fs
          .readFileSync(directoryPath + "/" + file, "utf8")
          .split(/\r?\n/);
        const totalItems = data.length;
        data.forEach((item, index) => {
          output += item;
          const islastItem =
            firstIndex + 1 === totalFiles && index + 1 === totalItems;
          if (!islastItem) output += "\r\n";
        });
      });
    }
    console.log(output);
  });
};
