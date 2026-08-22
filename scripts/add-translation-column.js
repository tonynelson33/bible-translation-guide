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
      "Living Word Lutheran Church, Milbank SD - confirmed LCMC (Lutheran Congregations in Mission for Christ, formed by former ELCA congregations that left over 2009 policy changes) - a third distinct Lutheran body from LCMS/ELCA/WELS; checked and LCMC has no designated official Bible translation (it's a deliberately loose, less hierarchical association)",
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

  // --- Batch 5: more Lutheran/Presbyterian, plus a directly-confirmed
  // individual-church fact (not a denominational default) ---
  "fa22a445-428d-41de-ad51-235a02548b35": {
    translation: "NRSV",
    notes:
      "Immanuel Lutheran Church, Bluefield WV - confirmed ELCA congregation; ELCA officially recommends the NRSV (its Lutheran Study Bible uses NRSV) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "24ec1c73-3ab3-4998-946a-083980fb5bdd": {
    translation: "ESV",
    notes:
      "St. Peter's Lutheran Church, Riceville IA - confirmed LCMS congregation (locator.lcms.org); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "8cb870c5-a286-420a-89d3-684afb769aa7": {
    translation: "ESV",
    notes:
      "Lamb of God Lutheran Church, Lithia FL - confirmed LCMS congregation; LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses. Note: a differently-located 'Lamb of God Lutheran Church' in Haines City FL is ELCA - do not confuse the two",
  },
  "2db7bd1c-55f2-48a0-b6a2-0f7775a55e56": {
    translation: "NRSV",
    notes:
      "Lutheran Church of Sunburst, MT - confirmed ELCA congregation (Montana Synod); ELCA officially recommends the NRSV (its Lutheran Study Bible uses NRSV) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "d41be968-cadb-4ed0-a02e-ad2d8017e2b2": {
    translation: "ESV",
    notes:
      "Immanuel Evangelical Lutheran Church, Buffalo NY - confirmed LCMS congregation (locator.lcms.org, joined 1892); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "0ce3f558-5a17-462c-990e-49bebf614217": {
    translation: "ESV",
    notes:
      "Lake Oconee Lutheran Church, Eatonton GA - confirmed LCMS congregation (locator.lcms.org); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "6629471a-343c-4bac-b290-e9291dd43638": {
    translation: "NRSV",
    notes:
      "Two Ridges Presbyterian Church, Steubenville OH (Wintersville) - confirmed PC(USA) congregation (pcusa.org directory, Upper Ohio Valley Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "ece07f6b-0581-48ef-80a6-09cf7793f0ec": {
    translation: "NRSV",
    notes:
      "Westminster United Presbyterian Church, Minden NE - confirmed PC(USA) congregation (pcusa.org directory, Presbytery of Central Nebraska); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "cd9266a5-bb8f-4674-bc55-c6449ad9d3cd": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church, Tonkawa OK - confirmed PC(USA) congregation (pcusa.org directory, Cimarron Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "03cdbc6b-42ae-48e6-81b1-925894a574af": {
    translation: "NRSV",
    notes:
      "United Presbyterian Church, Milford CT - confirmed PC(USA) congregation (pcusa.org directory); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "706f2d3a-b56c-433d-9226-12c386b9db1a": {
    translation: "NKJV",
    notes:
      "Thomas Road Baptist Church, Lynchburg VA (founded by Jerry Falwell, home of Liberty University) - directly confirmed via the church's own sermon materials, which cite Scripture as '(NKJV)'; founder Jerry Falwell was himself one of the NKJV's translators. This is a specific, individually-confirmed fact about this one congregation, not a Southern Baptist Convention-wide default (SBC has no denominational mandate)",
  },
  "0e8041ff-ed9d-40be-b33f-4f3ed4fa75ae": {
    translation: "",
    notes:
      "Ebenezer Baptist Church, Greenville SC - could not confirm which specific 'Ebenezer Baptist Church' this row refers to (multiple same-named SC churches found, e.g. Travelers Rest, Florence); no translation info found",
  },
  "b28b6c02-8754-4f5f-9ee6-f2879c89cd9c": {
    translation: "",
    notes: "First United Methodist Church, Aberdeen WA - same as other UMC entries: no official denominational translation; no church-specific info found",
  },

  // --- Batch 6: more Lutheran/Presbyterian, plus two more independent
  // Lutheran bodies discovered (LCMC again, and NALC) ---
  "9571f576-c190-4ec3-ab2e-2e9f7614c373": {
    translation: "",
    notes:
      "Bethlehem/West Elbow Lake Lutheran Church, Elbow Lake MN - confirmed LCMC (Lutheran Congregations in Mission for Christ); LCMC has no official denominational translation",
  },
  "09966afb-3752-420a-80ec-ae86e10af637": {
    translation: "ESV",
    notes:
      "Zion Lutheran Church, Edgeley ND - confirmed LCMS congregation (organized 1888); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "a5df1338-001d-4697-b62d-981bc1386358": {
    translation: "NRSV",
    notes:
      "Everett-Breezewood Lutheran Parish, Everett PA - confirmed ELCA (parish's own materials reference growing '1 million new people' engagement alongside the ELCA); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "9273bfa9-0102-4ad7-97d5-7fc7840de025": {
    translation: "",
    notes:
      "First Lutheran Church and School, Lake Geneva WI - confirmed WELS congregation (firstlutheranwels.org); WELS has no official denominational translation",
  },
  "d878d78c-7607-4ba1-a574-26500b3a994d": {
    translation: "ESV",
    notes:
      "First Lutheran Church, Ponca City OK - confirmed LCMS congregation (locator.lcms.org, Oklahoma District); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "20676b45-898e-4711-80c6-d655a64b70bf": {
    translation: "NRSV",
    notes:
      "Gloria Dei Lutheran Church, Wichita KS - confirmed ELCA congregation (established 1938); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "88321acc-172f-497e-8a82-19aa44ef1737": {
    translation: "",
    notes:
      "Grace Lutheran Church, Eaton OH - confirmed NALC (North American Lutheran Church, formed 2010 by congregations that left ELCA) - a fourth distinct Lutheran body from LCMS/ELCA/WELS/LCMC; checked and NALC has no designated official Bible translation beyond affirming biblical authority generally",
  },
  "031a0517-0d55-4e71-9c0b-83d273b9cb12": {
    translation: "NRSV",
    notes:
      "Highland (United) Presbyterian Church, Newport PA - confirmed PC(USA) congregation (pcusa.org directory, Carlisle Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "8ca89af5-4dd8-4f86-99e8-8c8b992330d5": {
    translation: "NRSV",
    notes:
      "Western Adirondack Presbyterian Church, Star Lake NY - confirmed PC(USA) congregation (pcusa.org directory, Presbytery of Northern New York); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "0e8010df-c2d0-4909-9f2e-6a036012e2e3": {
    translation: "",
    notes:
      "Temple Presbyterian Church, Clover SC - confirmed PCA congregation (pcahistory.org); PCA has no officially mandated Bible translation so no denominational default applies",
  },
  "bddcafa2-ccb9-4b1e-8fef-472a1e1dcd5c": {
    translation: "",
    notes:
      "First Presbyterian Church, Kings Mountain NC - IMPORTANT: this congregation is listed with ECO (Evangelical Covenant Order of Presbyterians, a body that split from PC(USA) in 2012), not PC(USA) itself - do not apply the PC(USA)/NRSV default here. ECO's own official translation stance has not been researched; no denominational default applied",
  },
  "531b5a43-0d8e-44fc-8483-99c6641b31cf": {
    translation: "",
    notes:
      "Sweet Pilgrim (Missionary) Baptist Church, Albany NY - independent Missionary Baptist tradition (historically Black Baptist, not SBC); no denominational mandate structure; no translation info found",
  },
  "20015904-5740-4f3c-be41-ca41786f6754": {
    translation: "",
    notes: "Unity Baptist Church, Fayette AL - confirmed SBC affiliated; SBC has no denominational translation mandate; no church-specific info found",
  },

  // --- Batch 7: more Lutheran/Presbyterian ---
  "c7526776-0203-48cc-a8c3-6ce23f57a3e1": {
    translation: "",
    notes:
      "Old Apostolic Lutheran Church, Sheridan WY - confirmed Old Apostolic Lutheran Church of America (small pietist Finnish-American Lutheran body, founded 1963 in the US, distinct from LCMS/ELCA/WELS); official translation stance not researched given small size",
  },
  "f0d94d0b-8b43-419c-9656-26b4436f2ffc": {
    translation: "NRSV",
    notes:
      "Christ & Emmanuel Lutheran Parish, Kittanning PA - confirmed ELCA congregation; ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "a4f69ae6-54af-4976-bab6-6d13c6f22cc9": {
    translation: "NRSV",
    notes:
      "Christ the King Lutheran Church, Cumming GA - confirmed ELCA congregation (established 1990); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "a401b024-4b75-4cd9-82e8-d5da393b257e": {
    translation: "",
    notes:
      "Peace Lutheran Church, Edgar WI - confirmed LCMC (Lutheran Congregations in Mission for Christ); LCMC has no official denominational translation",
  },
  "a4947900-92e7-45fb-a899-16a93e54130f": {
    translation: "",
    notes:
      "Crown of Life Lutheran Church, West St Paul MN - confirmed WELS congregation; WELS has no official denominational translation",
  },
  "f549c50a-d8d9-4a6d-9242-fbc506802164": {
    translation: "NRSV",
    notes:
      "St John Lutheran Church, Lakeside-Marblehead OH - confirmed ELCA congregation; ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "9cac4b7d-378c-41d3-afd4-078ce507027b": {
    translation: "NRSV",
    notes:
      "Trinity Lutheran Church, Worcester Twp PA (Fairview Village) - confirmed ELCA congregation; ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "bad59d9b-dfaa-4960-97f0-a93df046301e": {
    translation: "ESV",
    notes:
      "Good Shepherd Lutheran Church, Centralia MO - confirmed LCMS congregation (locator.lcms.org, joined 1958, Missouri District); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "7bebfa5b-f909-49ed-b7b3-0a20945f99a9": {
    translation: "NRSV",
    notes:
      "Trinity Presbyterian Church, Wilmington DE - confirmed PC(USA) congregation (pcusa.org directory, New Castle Presbytery); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "d5a56740-c79c-4ca2-91b1-76a6b49413ad": {
    translation: "NRSV",
    notes:
      "Spencer Presbyterian Church, Spencer NC - confirmed PC(USA) congregation (pcusa.org directory); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "b2e7672e-8a1c-4390-a7b1-f945dc4cb561": {
    translation: "",
    notes:
      "Lake Oconee Presbyterian Church, Eatonton GA - confirmed PCA congregation (lopc-pca.org, founded 1996); PCA has no officially mandated Bible translation so no denominational default applies. Note: a differently-named 'Lake Oconee LUTHERAN Church' also in Eatonton GA is LCMS - do not confuse the two",
  },
  "20f2db7c-0967-4240-8059-4abc9f46fee8": {
    translation: "NRSV",
    notes:
      "Grace Korean Presbyterian Church, Roswell GA - confirmed PC(USA) congregation (pcusa.org directory, Greater Atlanta Presbytery) - not a separate Korean-specific denomination; PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "656c533e-ba40-49bd-9cd4-69c457f5cb88": {
    translation: "NRSV",
    notes:
      "Washington Zion Presbyterian Church - confirmed PC(USA) congregation (faithstreet.com), but listed there as located in Silver Spring MD, not Columbia MD as in this dataset row - flagging this location discrepancy for awareness, though the distinctive name makes it very likely the same church; PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum",
  },

  // --- Batch 8: more Lutheran/Presbyterian ---
  "17dd43a9-e57d-4779-abe0-839c2daed681": {
    translation: "ESV",
    notes:
      "Grace Lutheran Church, Liberal KS - confirmed LCMS congregation (est. 1945); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "c491b77d-9908-43cd-bbe9-46ea5658ab4c": {
    translation: "NRSV",
    notes:
      "Salem Lutheran Church, Glendale CA - confirmed ELCA congregation; ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "b2e8e845-12e3-423c-8969-003bb5d4a349": {
    translation: "NRSV",
    notes:
      "Cedar Grove Lutheran Church, Batesburg-Leesville SC - confirmed ELCA congregation (NRHP-listed 1926-27 building); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "b5209649-3352-4437-b313-541b5f7ef837": {
    translation: "NRSV",
    notes:
      "Hoff Lutheran Church - confirmed ELCA congregation, but found listed as located in Adams ND, not Park River ND as in this dataset row - flagging this location discrepancy for awareness; ELCA officially recommends the NRSV",
  },
  "8d5bcc10-5002-44e6-b405-2d77ac6848af": {
    translation: "ESV",
    notes:
      "Our Redeemer Lutheran Church, Wahoo NE - confirmed LCMS congregation (locator.lcms.org, joined 1964, Nebraska District); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "5f42efd7-ff21-497b-b095-e8fb8d41f67e": {
    translation: "",
    notes:
      "Zion German Evangelical Lutheran Church, Brooklyn NY - CONFLICTING affiliation signals across sources: uses the LCMS's Lutheran Service Book per one source, but is separately listed as ELCA and also appears in the LCMC congregation directory - genuinely ambiguous, so no denominational default applied rather than guess",
  },
  "c0152933-4084-46f5-8201-c35198a372fa": {
    translation: "NRSV",
    notes:
      "Living Word (Evangelical) Lutheran Church, Abington PA - confirmed ELCA congregation (own domain is livingword-elca.org); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "9672ad2a-21cd-4a87-ba2d-aee4e01bffc6": {
    translation: "NRSV",
    notes:
      "St Peter Lutheran Church, Dillsboro IN - confirmed ELCA congregation. Note: a separately-named 'Saint John Lutheran Church' also in the Dillsboro area is LCMS - do not confuse the two; ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "b461a008-d752-48a0-b177-a4cfd8e982ff": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church, Montpelier OH - confirmed PC(USA) congregation (pcusa.org directory); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "584da9a6-54fe-4548-9932-93dc2b6a4375": {
    translation: "NRSV",
    notes:
      "St Luke Presbyterian Church, Warren MI - confirmed PC(USA) congregation; PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "42ae491b-27f3-43fb-a269-682ef0a5b20f": {
    translation: "",
    notes:
      "Thai Evangelical Presbyterian Church, Norwalk CA - could not confirm this specific congregation's denominational affiliation (search surfaced other, differently-named Presbyterian congregations in Norwalk instead); no translation info found",
  },
  "e0c39b14-81ce-40f5-b0ea-4a8943958bbe": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church, Buchanan MI - confirmed PC(USA) congregation; PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "fd912438-6515-46ae-874a-7fb64e228536": {
    translation: "",
    notes:
      "Reformation Orthodox Presbyterian Church, Apache Junction AZ (meets in Mesa) - confirmed OPC (Orthodox Presbyterian Church, a distinct small confessional Reformed denomination founded 1936, separate from PC(USA)/PCA); OPC explicitly has no single official Bible translation (NIV historically predominant, ESV growing) so no denominational default applies",
  },

  // --- Batch 9: more Lutheran/Presbyterian ---
  "14f7bedf-f0b5-4f82-9589-c0e6196e4663": {
    translation: "NRSV",
    notes:
      "St. John's Lutheran Church, Lynbrook NY - confirmed ELCA (merged with Lutheran Church of the Incarnation in 2018 to form St. John-Incarnation Lutheran Church, ELCA); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "de6cee87-d562-4dbc-be8d-25797fc6119c": {
    translation: "ESV",
    notes:
      "Christ Our Savior Lutheran Church, Angel Fire NM - confirmed LCMS congregation (locator.lcms.org, Rocky Mountain District mission); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "b5ba0819-b77b-4843-bdbf-697e90927570": {
    translation: "ESV",
    notes:
      "Grace Lutheran Church, Chester VA - confirmed LCMS congregation (locator.lcms.org, joined 1964); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "8cf53614-2f69-4116-976c-27440ce43521": {
    translation: "NRSV",
    notes:
      "Canoe Ridge Lutheran Church, Decorah IA - confirmed ELCA congregation; ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "3e86fc1e-296a-47a0-be0d-b080297882ca": {
    translation: "ESV",
    notes:
      "St. Paul Lutheran Church, Birmingham AL - confirmed LCMS congregation (locator.lcms.org, historically African-American congregation, joined Missouri Synod 1950s-60s from the former American Lutheran Church); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "6ba72657-01e0-431f-a2d7-d6ed50367edb": {
    translation: "NRSV",
    notes:
      "Waverly Lutheran Church, Trimont MN - confirmed ELCA congregation (merged into ELCA 1987, Southwestern Minnesota Synod); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "c02fbe19-8d97-47ca-8e57-d4e7af0b6e6e": {
    translation: "",
    notes: "All Saints Lutheran Church, Orland Park IL - could not confirm denominational affiliation (LCMS vs. ELCA vs. other); no translation info found",
  },
  "28c98227-921b-4c9b-9fba-36e69d497511": {
    translation: "NRSV",
    notes:
      "St Paul's Lutheran Church, Elma IA - confirmed ELCA congregation. Note: a differently-located 'St. Paul Lutheran Church' in Eldora IA is LCMS - do not confuse the two; ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "4ba410f3-7f0f-4e84-a422-ababd8e4befd": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church, Durango CO - confirmed PC(USA) congregation (pcusa.org directory, Western Colorado Presbytery, founded 1881); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "59abf17e-7c30-4542-bf3d-350654c97c56": {
    translation: "NRSV",
    notes:
      "East Liberty Presbyterian Church (ELPC), Pittsburgh PA - confirmed PC(USA) congregation (pcusa.org directory, known as the 'Cathedral of Hope,' founded 1819); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "726397b7-b444-4a73-b634-6e9e69388326": {
    translation: "NRSV",
    notes:
      "Linden Presbyterian Church, Linden MI - confirmed PC(USA) congregation (pcusa.org directory, founded 1860); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "8e28fc99-5854-445a-acb6-59d415742c73": {
    translation: "",
    notes:
      "United Presbyterian Church, Trenton NJ - could not confirm this specific congregation under this exact name (search only surfaced a differently-named First Presbyterian Church of Trenton, PCUSA); no translation info found for this specific entity",
  },
  "e3918513-0705-4f34-bb77-447c4200e97e": {
    translation: "NRSV",
    notes:
      "Wayne Presbyterian Church, Wayne NJ - confirmed PC(USA) congregation (pcusa.org directory, Presbytery of Northeast New Jersey, founded 1870). Note: a differently-located 'Wayne Presbyterian Church' in Wayne PA is a separate PCUSA congregation - do not confuse the two; PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum",
  },

  // --- Batch 10: more Lutheran/Presbyterian ---
  "beb1ff86-fba8-4e65-96e3-a5b0226e9ed9": {
    translation: "ESV",
    notes:
      "Our Saviour's Lutheran Church, Caruthers CA - confirmed LCMS congregation (locator.lcms.org, organized 1923); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "75616c31-2a8a-4532-8bab-cc9a40db88f9": {
    translation: "",
    notes:
      "Redeemer Lutheran Church, Ann Arbor MI - confirmed WELS congregation (campus ministry to University of Michigan); WELS has no official denominational translation",
  },
  "e515712b-0b28-40f8-840b-4e465e660478": {
    translation: "",
    notes: "First Lutheran Church, Dayton OH (NRHP-listed, founded 1839) - could not confirm current denominational affiliation (LCMS vs. ELCA vs. other); no translation info found",
  },
  "35f634f5-02e6-468e-9dc5-48716e6e34f7": {
    translation: "NRSV",
    notes:
      "Prince of Life Lutheran Church, Oregon City OR - confirmed ELCA congregation (Reconciling in Christ); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "f7315521-6e0a-4dd1-8339-0265417691e4": {
    translation: "NRSV",
    notes:
      "Christ Lutheran Church, El Campo TX - confirmed ELCA congregation (Gulf Coast Synod); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "91c46935-f039-43c7-a3e1-996b71e11564": {
    translation: "NRSV",
    notes:
      "Calvary Lutheran Church, Grand Forks ND - confirmed ELCA congregation (Eastern North Dakota Synod); ELCA officially recommends the NRSV - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "4125dd0c-68c5-4f84-8865-bf26ca5913e7": {
    translation: "ESV",
    notes:
      "St. Paul's Lutheran Church, Beecher IL - confirmed LCMS congregation (founded 1865, Northern Illinois District; building destroyed by fire in 2021, congregation still active); LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "ad4f2582-eefd-4861-b4e8-781f9f22f1e3": {
    translation: "ESV",
    notes:
      "Trinity Lutheran Church, Mansfield SD - confirmed LCMS congregation (locator.lcms.org, joined 1888). Note: a differently-located 'Trinity Lutheran Church ELCA' in Madison SD is a separate congregation - do not confuse the two; LCMS Commission on Worship adopted the ESV for all Lutheran Service Book materials including the lectionary",
  },
  "192128b4-c34a-4676-b580-aebc14674c72": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church, New Castle IN - confirmed PC(USA) congregation (pcusa.org directory, Presbytery of Whitewater Valley); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "2229785d-1ada-4829-a31b-65cb393aa7d7": {
    translation: "NRSV",
    notes:
      "Cherry Tree Presbyterian Church, Cherry Tree PA - confirmed PC(USA) congregation (pcusa.org directory, Presbytery of Kiskiminetas); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "e564ee9d-fde2-4256-b568-7eff9adb8b6f": {
    translation: "NRSV",
    notes:
      "First Presbyterian Church, Grand Bay AL - confirmed PC(USA) congregation (pcusa.org directory, Presbytery of South Alabama); PC(USA) overwhelmingly uses the NRSV in official worship resources, liturgy, and curriculum - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "690cd24e-1ff4-43a1-ab21-cc10eaf4de56": {
    translation: "",
    notes:
      "Trinity Presbyterian Church (OPC), Huntington WV - denomination already stated in the row's own name (OPC/Orthodox Presbyterian Church); OPC explicitly has no single official Bible translation, so no denominational default applies",
  },
  "b652fcdc-bb98-4626-8328-c448ebd2d9be": {
    translation: "",
    notes:
      "Covenant Presbyterian Church, NCM NJ - ambiguous: found two different 'Covenant Presbyterian Church' congregations in NJ with different affiliations (Short Hills = PCA, Ewing/formerly Trenton = PC(USA)), and this dataset row's odd 'NCM' locality value doesn't clearly match either - no denominational default applied given the ambiguity",
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
