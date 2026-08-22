// Ongoing script: updates the "bible_translation" / "bible_translation_notes"
// columns (already present in churches-combined.csv) for whichever church ids
// have been researched so far. Safe to re-run repeatedly as KNOWN_TRANSLATIONS
// grows - it only overwrites the two translation columns for matched ids and
// leaves every other field untouched.
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

// Researched via web search + fetching each church's own site / diocesan or
// denominational records. translation: just the abbreviation, for the column
// itself. notes: source/confidence caveats, kept in the column to the right.
const KNOWN_TRANSLATIONS = {
  "9dc70048-7856-45e0-93ad-c5e9ba84f4f9": { translation: "", notes: "" }, // Anchorage Native New Life Fellowship - not publicly stated
  "f68376f8-47d8-4051-922a-aa3715cb45a3": { translation: "", notes: "" }, // Grace Evangelical Lutheran Church, Langruth MB - not publicly stated
  "b6e0ce3d-d8f2-4af9-b8ea-6cd8f3d3a228": {
    translation: "KJV",
    notes: "RCCG denominational standard (official Study Bible); not independently confirmed for this specific congregation",
  },
  "cec4fe92-3a7e-4cbd-b30d-bb8fbe0873f3": { translation: "", notes: "" }, // Antioch Church of Philadelphia - not publicly stated
  "2c029b79-0ff8-4c12-a8c9-3d16ad56dcbf": {
    translation: "NABRE",
    notes: "USCCB Lectionary for Mass, standard for U.S. Catholic parishes (confirmed via parish site)",
  },
  "f9b6e7d2-b0fb-4504-a8ba-77ee9ee1e089": {
    translation: "ESV",
    notes:
      "St. John's Anglican Church, Southampton PA - confirmed ACNA parish (acna.org/admin_units/519); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "09ae984b-170d-4ebe-b626-1319c917b0d0": {
    translation: "",
    notes:
      "All Saints' Anglican Church, Macon GA - this is Anglican Catholic Church (a Continuing Anglican jurisdiction), NOT ACNA, so the ACNA/ESV default does not apply; specific translation not publicly stated",
  },
  "98fdf071-468a-4d2f-baf0-e1e31c10d8af": {
    translation: "ESV",
    notes:
      "Holy Trinity Anglican Church, Charleston SC - confirmed ACNA parish, Diocese of South Carolina (acna.org/admin_units/1382); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "7cad55a4-d9d5-49cf-b296-03c41cc83739": {
    translation: "ESV",
    notes:
      "HopePointe Anglican Church, The Woodlands TX - confirmed ACNA parish (acna.org/admin_units/256); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "2f1b1905-ebaa-4093-8869-b7e74cabde01": {
    translation: "ESV",
    notes:
      "Christ Church Vienna VA - confirmed ACNA parish (acna.org/admin_units/620); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },

  // --- Batch 2: Lutheran/Presbyterian synod verification ---
  // LCMS's Commission on Worship officially adopted the ESV for all Lutheran
  // Service Book materials including the lectionary; ELCA officially
  // recommends the NRSV (its Lutheran Study Bible uses NRSV); PC(USA)
  // overwhelmingly uses NRSV in official worship resources/liturgy/curriculum.
  // WELS has no official translation (the EHV is produced by an affiliated-
  // but-independent group, not an official WELS mandate) and PCA has no
  // official mandate either (ESV is just the dominant informal choice) - so
  // those two are left blank even when the synod itself is confirmed.
  "ec8b3e51-ca91-4a2d-b38a-7c1a26414e9c": {
    translation: "",
    notes:
      "Anglo-Lutheran Catholic Church, Kansas City MO - this is a small independent Anglican/Lutheran hybrid denomination (founded 1997, ~11,000 members at peak), not LCMS/ELCA/WELS; no official translation found",
  },
  "f9a2b745-451a-4feb-adac-8d3995ce52db": {
    translation: "",
    notes:
      "Trinity Lutheran Church, Omak WA - confirmed WELS congregation; WELS has no official denominational translation (the EHV/Wartburg Project is affiliated but not an official WELS mandate)",
  },
  "720c97e4-8af1-4c19-9a50-6fa67f3546a4": {
    translation: "ESV",
    notes:
      "Saint John Lutheran Church, Newkirk OK - confirmed LCMS congregation (locator.lcms.org); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "2f0d22d4-68ba-40fa-a732-1fd1f29a6ec9": {
    translation: "",
    notes:
      "Christ the King Lutheran Church, Palatine IL - confirmed WELS congregation (uses the Christian Worship hymnal); WELS has no official denominational translation. Note: a separate, differently-named 'Christ Lutheran Church' also in Palatine IL is ELCA - do not confuse the two",
  },
  "18d7c4fb-ce01-496f-aa86-5b6e4280ee91": {
    translation: "ESV",
    notes:
      "St John's Lutheran Church, Beloit WI - confirmed LCMS congregation (locator.lcms.org); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "5ccaf981-0dc2-48bf-b85c-33c14bc33b51": {
    translation: "NRSV",
    notes:
      "Graham Presbyterian Church, North Vernon IN - confirmed PC(USA) congregation (pcusa.org congregation directory, Ohio Valley Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "ead7d8e7-2fd6-4a5d-9a5d-cbeae9ff1326": {
    translation: "NRSV",
    notes:
      "Mills River Presbyterian Church, Mills River NC - confirmed PC(USA) congregation (pcusa.org congregation directory, Presbytery of Western North Carolina); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "dd7b65a7-fb93-4ea2-a938-fce3fffbd4fa": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church, Pitman NJ - confirmed PC(USA) congregation (pcusa.org congregation directory, West Jersey Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "80845abd-5a8d-4574-a4e1-591df550a2fa": {
    translation: "",
    notes:
      "Memorial Presbyterian Church, Elizabethton TN - confirmed PCA congregation (pcahistory.org); PCA has no officially mandated Bible translation (ESV is the dominant informal choice, not a mandate) so no denominational default applies",
  },
  "a59d94eb-516a-4e00-876e-c0d91dcfbbc0": {
    translation: "NRSV",
    notes:
      "Grace Memorial Presbyterian Church, Pittsburgh PA - confirmed PC(USA) congregation (pcusa.org congregation directory, Pittsburgh Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },

  // --- Batch 3: sampling across Baptist, Methodist, Church of Christ,
  // Orthodox, Adventist, Congregational, Pentecostal, Assembly of God,
  // Disciples of Christ - none of these have a confirmed single
  // denominational default (Baptist/Church of Christ/Congregational are
  // congregationally autonomous by definition; UMC, AoG, SDA, and Disciples
  // were already checked in an earlier round and have no official mandate;
  // Orthodox jurisdictions vary too much and no per-parish info was found).
  // All left blank; notes record what was actually confirmed vs. not found.
  "f7a49042-a3a4-46a6-bff0-4b31324222ee": {
    translation: "",
    notes: "Fordsville Baptist Church, KY - Southern Baptist Convention affiliated; SBC has no denominational translation mandate; no church-specific info found",
  },
  "2c378a3d-7005-41ff-90a2-e5a63c428c68": {
    translation: "",
    notes: "Lakota Baptist Church, Pine Ridge SD - SBC affiliated (Dakota Baptist Convention); no denominational mandate; no church-specific info found",
  },
  "c3b4608a-dc86-474e-a345-19dec4efb481": {
    translation: "",
    notes: "Hyde Park United Methodist Church, NY - confirmed UMC.org has no official Bible translation (CEB/NRSVue are preferred for UMC curriculum only, not mandated for worship); no church-specific info found",
  },
  "b9d8426a-ae62-4f45-b139-246fe2901a4e": {
    translation: "",
    notes: "First United Methodist Church, New Ulm MN - same as other UMC entries: no official denominational translation; no church-specific info found",
  },
  "e8c8eb5f-8fc0-43be-b5c9-1f930a2c9732": {
    translation: "",
    notes: "Keenesburg church of Christ, CO - Churches of Christ (Restoration Movement) have no central governing body or translation mandate; no church-specific info found",
  },
  "e442dabd-7619-41f2-9088-b3af747ed3cf": {
    translation: "",
    notes: "Sts Constantine & Helen Orthodox Church, Rockford IL - Greek Orthodox; no jurisdiction-wide or parish-specific translation info found",
  },
  "d66108fa-06b7-4ac5-bda0-274d14e3686a": {
    translation: "",
    notes: "Holy Resurrection Carpatho-Russian Orthodox Church, Potomac MD - confirmed American Carpatho-Russian Orthodox Diocese; no translation info found",
  },
  "e07e58ab-de98-49d9-bca3-3473c80f1883": {
    translation: "",
    notes: "Pasadena Seventh-day Adventist Church, MD - SDA has no single confirmed official translation (checked in an earlier round); no church-specific info found",
  },
  "90ae0639-b2d6-4079-acd4-18e9387fc770": {
    translation: "",
    notes: "Waterville Seventh Day Adventist Church, Fairfield ME - same SDA reasoning; no church-specific info found",
  },
  "c6ea4b6d-37c4-4b1d-b477-cf7dbdb2b943": {
    translation: "",
    notes: "Winchester Center Congregational Church, Winsted CT - confirmed United Church of Christ (UCC); UCC congregations are autonomous with no translation mandate; no church-specific info found",
  },
  "3fb72d6f-7da1-444b-bdf6-3575ea642816": {
    translation: "",
    notes: "New Vision Congregational Holiness Church, Sycamore AL - this is Congregational Holiness Church, a small Pentecostal-holiness denomination distinct from UCC-style Congregationalism; no translation info found",
  },
  "854b73de-d797-4b99-81fd-4a0ffb2132d1": {
    translation: "",
    notes: "FIF Northeast USA, Arlington TX - confirmed Forward in Faith Ministries International (FIFMI), a global Pentecostal movement founded by Archbishop E.H. Guti; no translation info found",
  },
  "9aa9f63f-900b-4f30-ba52-e5a641c2f701": {
    translation: "",
    notes: "Truth Tabernacle of Overton, TX - confirmed United Pentecostal Church (Oneness Pentecostal/UPCI); no translation info found",
  },
  "5fe8b87f-eaf8-4120-9ab3-df14546e8041": {
    translation: "",
    notes: "Mount Horeb Assembly Of God, Irvington NJ - Assemblies of God has no denominational mandate (checked in an earlier round); no church-specific info found",
  },
  "148fc9c2-3037-47c9-aa2c-42fa651c8a7a": {
    translation: "",
    notes: "Sand Valley Assembly of God, Attalla AL - same AoG reasoning; no church-specific info found",
  },
  "b8553f35-66d3-4f4c-8a91-d4b7dd499d58": {
    translation: "",
    notes: "Whosoeverwill Church of Christ Disciples of Christ, Kinston NC - confirmed Disciples of Christ tradition (Kinston/Wilson/Rocky Mount NC corridor is a historic center of Black Disciples of Christ churches); no translation info found",
  },
  "acda78ab-e48b-4d48-afa8-ba03dbdcfef4": {
    translation: "",
    notes: "First Christian Church Disciples of Christ, McAllen TX - confirmed Disciples of Christ; no translation info found",
  },

  // --- Batch 4: more Lutheran/Presbyterian synod verification ---
  "77f90d7e-be3d-4e1d-8e11-2b3f4721b327": {
    translation: "",
    notes:
      "Living Word Lutheran Church, Milbank SD - confirmed LCMC (Lutheran Congregations in Mission for Christ, formed by former ELCA congregations that left over 2009 policy changes) - a third distinct Lutheran body from LCMS/ELCA/WELS; LCMC's official translation stance not yet researched",
  },
  "f3d823a9-8eb1-4b4e-8e9b-4453d4658659": {
    translation: "ESV",
    notes:
      "Zion Lutheran Church, Downs KS - confirmed LCMS congregation; LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "41111c8d-63b6-4fef-be23-7e76f2cc6827": {
    translation: "ESV",
    notes:
      "St. John's Lutheran Church, Wilcox NE - confirmed LCMS congregation (locator.lcms.org); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "66fe2ffd-b3f7-41d9-8756-a0fedb16fba9": {
    translation: "NRSV",
    notes:
      "Osakis Presbyterian Church (First Presbyterian Church, Osakis MN) - confirmed PC(USA) congregation (pcusa.org directory, Minnesota Valleys Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "78189583-d0c6-4d44-aa3c-711e272f05d2": {
    translation: "NRSV",
    notes:
      "Osceola Presbyterian Church, Osceola PA - confirmed PC(USA) congregation (pcusa.org directory, Northumberland Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "a0f6d943-62a0-4907-9ab0-383f2d48911f": {
    translation: "",
    notes:
      "Dry Fork Cumberland Presbyterian Church, Bethpage TN - confirmed Cumberland Presbyterian Church, a distinct denomination from PC(USA)/PCA; the denomination explicitly states it 'does not limit itself to any one translation of the Bible,' so no denominational default applies",
  },
  "72d2b5c3-af3e-4775-b895-7a192711549b": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church of DeFuniak Springs, FL - confirmed PC(USA) congregation (Presbytery of Florida, Synod of South Atlantic); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
};

// Minimal RFC-4180 CSV line parser/writer (handles quoted fields with commas).
function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function writeCsvField(value) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    crlfDelay: Infinity,
  });
  const out = fs.createWriteStream(outputPath);

  let isHeader = true;
  let idIndex = -1;
  let translationIndex = -1;
  let notesIndex = -1;
  let matched = 0;
  let rowCount = 0;

  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (isHeader) {
      idIndex = fields.indexOf("id");
      translationIndex = fields.indexOf("bible_translation");
      notesIndex = fields.indexOf("bible_translation_notes");
      if (idIndex === -1 || translationIndex === -1 || notesIndex === -1) {
        throw new Error("Expected columns not found in header: " + line);
      }
      isHeader = false;
    } else {
      rowCount++;
      const id = fields[idIndex];
      const entry = KNOWN_TRANSLATIONS[id];
      if (entry) {
        matched++;
        fields[translationIndex] = entry.translation;
        fields[notesIndex] = entry.notes;
      }
    }
    out.write(fields.map(writeCsvField).join(",") + "\n");
  }

  await new Promise((resolve) => out.end(resolve));

  // Back up the previous version before replacing it, then swap in the new one.
  fs.copyFileSync(inputPath, backupPath);
  fs.renameSync(outputPath, inputPath);

  console.log(
    `Matched ${matched} of ${Object.keys(KNOWN_TRANSLATIONS).length} known ids across ${rowCount} rows. Previous file backed up to ${backupPath}.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
