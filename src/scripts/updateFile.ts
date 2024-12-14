import fs from "fs";

const merge = (a: string[], b: string[], i = 0) => {
  return a.slice(0, i).concat(b, a.slice(i));
};

const CleanTasks = async () => {
  fs.promises.readdir("changelog").then((filenames) => {
    return filenames.map((filename) => {
      return fs.unlinkSync(`changelog/${filename}`);
    });
  });
};

const UnreleaseTasks = async () => {
  const lines: string[] = [];

  const readdir = async (dirname: string) => {
    const items = fs.promises.readdir(dirname).then((filenames) => {
      return filenames.map((filename) => {
        return fs
          .readFileSync(`changelog/${filename}`, "utf8")
          .split(String.fromCharCode(10));
      });
    });

    return items;
  };

  await readdir("changelog").then((data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].map((line) => {
        if (line !== "") {
          lines.push(line);
        }

        return line;
      });
    }
  });

  return lines;
};

const RemountChangelog = async () => {
  const items = await UnreleaseTasks();

  const data = fs.readFileSync("./CHANGELOG.md", "utf8").split(/\r?\n/);
  const regex = /^## \[Unreleased]$/;
  let ref;

  data.forEach((line, idx) => {
    if (regex.test(line)) {
      ref = idx + 1;
    }
  });

  const finalArray = merge(data, items, ref);

  const newChangelog = finalArray.join("\n");

  fs.writeFileSync("./CHANGELOG.md", newChangelog, { encoding: "utf-8" });
};

export = async function updateFile() {
  RemountChangelog();
  CleanTasks();
};
