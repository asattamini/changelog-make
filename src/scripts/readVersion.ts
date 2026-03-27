import editJsonFile from "edit-json-file";
import path from "path";


export = function readVersion() {
  const fullPath = path.dirname(require.main?.filename || "");
  const regexResp = /^(.*?)node_modules/.exec(fullPath);
  const rootPath = regexResp ? regexResp[1] : fullPath;

 let data = editJsonFile(`${rootPath}/manifest.json`, {
    autosave: true,
  });

  console.log(data.get('version'))

};
