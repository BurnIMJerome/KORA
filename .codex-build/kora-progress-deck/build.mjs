import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "C:\\Users\\My PC\\Documents\\KORA";
const buildDir = path.join(workspaceDir, ".codex-build", "kora-progress-deck");
const outputDir = path.join(workspaceDir, "outputs");
const skillDir = "C:\\Users\\My PC\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.1011.11113\\skills\\presentations";
const finalPath = path.join(outputDir, "KORA_Development_Progress_2026-10-12.refined.pptx");
const pythonExecutable = "C:\\Users\\My PC\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const font = "Aptos";

const C = {
  ink: "#11231F",
  green: "#006B63",
  green2: "#008C7E",
  pale: "#E8F3F0",
  amber: "#FFB21A",
  amberPale: "#FFF3D5",
  red: "#C23B32",
  redPale: "#FCE9E7",
  slate: "#53635F",
  light: "#EEF2F1",
  white: "#FFFFFF",
  line: "#CAD5D1",
  gray: "#F7F9F8",
};

async function readBytes(filePath) {
  const b = await fs.readFile(filePath);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

function addText(slide, text, left, top, width, height, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    typeface: font,
    fontSize: opts.size ?? 22,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    alignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "top",
    autoFit: opts.autoFit ?? "shrinkText",
  };
  return shape;
}

function addRect(slide, left, top, width, height, fill, line = fill, radius = "none") {
  return slide.shapes.add({
    geometry: radius === "none" ? "rect" : "roundRect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: line, width: 1 },
    ...(radius === "none" ? {} : { borderRadius: radius }),
  });
}

function addHeader(slide, title, subtitle, pageNo) {
  addText(slide, title, 64, 42, 940, 52, { size: 32, bold: true });
  if (subtitle) addText(slide, subtitle, 64, 98, 1040, 34, { size: 16, color: C.slate });
  addText(slide, String(pageNo).padStart(2, "0"), 1160, 48, 54, 26, { size: 13, bold: true, color: C.green, align: "right" });
  addRect(slide, 64, 132, 1150, 2, C.green, C.green);
}

function addFooter(slide, source) {
  addText(slide, source, 64, 684, 1150, 18, { size: 10, color: "#6D7B77" });
}

function styleTable(table, { headerFill = C.green, bodyFill = C.white, headerSize = 16, bodySize = 15, firstColBold = false } = {}) {
  table.borders.assign({ style: "solid", fill: C.line, width: 1 });
  table.cells.block({ row: 0, column: 0, rowCount: 1, columnCount: table.columns.length }).assign({
    fill: headerFill,
    textStyle: { typeface: font, fontSize: headerSize, bold: true, color: C.white },
    anchor: "middle",
    margins: { left: 10, right: 10, top: 6, bottom: 6 },
  });
  if (table.rows.length > 1) {
    table.cells.block({ row: 1, column: 0, rowCount: table.rows.length - 1, columnCount: table.columns.length }).assign({
      fill: bodyFill,
      textStyle: { typeface: font, fontSize: bodySize, color: C.ink },
      anchor: "middle",
      margins: { left: 10, right: 10, top: 5, bottom: 5 },
    });
  }
  if (firstColBold && table.rows.length > 1) {
    table.cells.block({ row: 1, column: 0, rowCount: table.rows.length - 1, columnCount: 1 }).textStyle.bold = true;
  }
}

function setNotes(slide, lines) {
  slide.speakerNotes.text = lines.join("\n");
  slide.speakerNotes.setVisible(true);
}

const pres = Presentation.create({ slideSize: { width: 1280, height: 720 } });

// 1. Cover
{
  const slide = pres.slides.add();
  slide.background.fill = C.ink;
  const logo = await readBytes(path.join(workspaceDir, "docs", "Logo", "ig_0d97a967f7ea9a88016a456413c7a08191ae238ad55f4ca567-swapped-transparent.png"));
  slide.images.add({
    blob: logo,
    contentType: "image/png",
    alt: "KORA workflow logo",
    fit: "contain",
    position: { left: 820, top: 92, width: 350, height: 350 },
  });
  addText(slide, "KORA", 72, 76, 440, 50, { size: 22, bold: true, color: C.amber });
  addText(slide, "Development\nprogress report", 72, 160, 680, 178, { size: 52, bold: true, color: C.white });
  addText(slide, "Milestone alignment, delivery status, risks and recovery plan", 72, 372, 680, 72, { size: 22, color: "#D9E7E3" });
  addRect(slide, 72, 486, 510, 2, C.amber, C.amber);
  addText(slide, "Reporting date  |  12 October 2026", 72, 510, 520, 34, { size: 17, color: C.white });
  addText(slide, "Prepared from the GitHub project and Kora_Likha Product.xlsx", 72, 648, 800, 24, { size: 12, color: "#9BB0A9" });
  setNotes(slide, [
    "Sources:",
    "https://github.com/users/BurnIMJerome/projects/2",
    "C:\\Users\\My PC\\Downloads\\Kora_Likha Product.xlsx",
  ]);
}

// 2. Executive status
{
  const slide = pres.slides.add();
  slide.background.fill = C.white;
  addHeader(slide, "Executive status", "The delivery pipeline does not match the planned phase gate", 2);
  addRect(slide, 64, 166, 270, 410, C.redPale, C.redPale, "rounded-xl");
  addText(slide, "RED", 92, 210, 220, 72, { size: 52, bold: true, color: C.red, align: "center" });
  addText(slide, "Behind the planned\nmilestone sequence", 92, 302, 220, 84, { size: 22, bold: true, color: C.ink, align: "center" });
  addText(slide, "Testing & Stabilization starts today, but no work is in Review or QA.", 92, 412, 220, 100, { size: 17, color: C.slate, align: "center" });

  const metrics = [
    ["22 / 369", "Full board Done", "6.0%"],
    ["6 / 91", "MVP1 Done", "6.6%"],
    ["18 days", "Until code freeze", "30 Oct"],
  ];
  metrics.forEach((m, i) => {
    const x = 390 + i * 270;
    addText(slide, m[0], x, 198, 230, 70, { size: 38, bold: true, color: i === 2 ? C.red : C.green });
    addText(slide, m[1], x, 278, 230, 30, { size: 16, bold: true, color: C.ink });
    addText(slide, m[2], x, 312, 230, 28, { size: 15, color: C.slate });
  });
  addText(slide, "Management decision", 390, 402, 760, 34, { size: 20, bold: true, color: C.green });
  addText(slide, "Reduce and freeze the MVP1 release scope now, or formally move the code-freeze and launch dates.", 390, 448, 760, 92, { size: 26, bold: true, color: C.ink });
  addFooter(slide, "Source: GitHub Project Dev View and Timeline worksheet, reviewed 12 Oct 2026");
  setNotes(slide, [
    "GitHub Project counts observed 12 Oct 2026.",
    "Timeline source: Kora_Likha Product.xlsx, Timeline!B3:R47.",
  ]);
}

// 3. Delivery dashboard
{
  const slide = pres.slides.add();
  slide.background.fill = C.white;
  addHeader(slide, "Delivery dashboard", "Status counts show limited movement into active delivery and test", 3);

  const chart = slide.charts.add("bar", {
    position: { left: 70, top: 172, width: 790, height: 330 },
    title: "Share of items by status",
    titleTextStyle: { fontSize: 18, fill: C.ink, bold: true },
    categories: ["Full board", "MVP1"],
    series: [
      { name: "Done", values: [22 / 369, 6 / 91], fill: C.green },
      { name: "Active / ready", values: [2 / 369, 1 / 91], fill: C.amber },
      { name: "Backlog", values: [345 / 369, 84 / 91], fill: "#D9E1DE" },
    ],
    barOptions: { direction: "bar", grouping: "percentStacked", gapWidth: 55 },
    hasLegend: true,
    legend: { position: "bottom", overlay: false, textStyle: { fontSize: 15, fill: C.slate } },
    xAxis: { visible: true, textStyle: { fontSize: 16, fill: C.ink, bold: true }, majorGridlines: null },
    yAxis: { visible: false, min: 0, max: 1, majorGridlines: null },
    chartFill: C.white,
    plotAreaFill: C.white,
  });

  addText(slide, "Board counts", 916, 174, 250, 32, { size: 20, bold: true, color: C.green });
  const values = [
    ["", "Full", "MVP1"],
    ["Done", "22", "6"],
    ["In Progress", "1", "0"],
    ["Ready", "1", "1"],
    ["Review", "0", "0"],
    ["QA", "0", "0"],
    ["Backlog", "345", "84"],
  ];
  const table = slide.tables.add({ rows: values.length, columns: 3, left: 880, top: 218, width: 320, height: 300, values, columnWidths: [145, 80, 95] });
  styleTable(table, { headerSize: 14, bodySize: 14, firstColBold: true });
  table.getCell(1, 0).fill = C.pale;
  table.getCell(6, 0).fill = C.redPale;
  addText(slide, "Completion is a card-count measure. Items have no visible effort estimates, so it does not represent weighted engineering effort.", 72, 552, 1080, 72, { size: 17, color: C.slate });
  addFooter(slide, "Source: GitHub Project Dev View; MVP1 filter returned 91 matching items");
  setNotes(slide, [
    "Full board: Backlog 345, Ready 1, In Progress 1, Review 0, QA 0, Done 22, Failed 0.",
    "MVP1: Backlog 84, Ready 1, In Progress 0, Review 0, QA 0, Done 6, Failed 0.",
    "Source: https://github.com/users/BurnIMJerome/projects/2",
  ]);
}

// 4. Timeline alignment
{
  const slide = pres.slides.add();
  slide.background.fill = C.white;
  addHeader(slide, "Progress against the planned timeline", "The plan has entered testing while most release work remains in backlog", 4);
  const values = [
    ["Milestone", "Planned date", "Current evidence", "Assessment"],
    ["Scope alignment", "17–25 Sep", "Backlog definition and prioritization still ongoing", "AMBER / RED"],
    ["Product development", "28 Sep–9 Oct", "22 Done overall; 6 Done in MVP1", "RED"],
    ["Testing & stabilization", "12–30 Oct", "0 in Review and 0 in QA", "RED"],
    ["Code freeze", "30 Oct", "18 days remain; gates not evidenced", "AT RISK"],
    ["Beta testing", "30 Oct–30 Nov", "Depends on a stable release candidate", "AT RISK"],
    ["Launch", "1 Dec", "Depends on recovery in October", "AT RISK"],
  ];
  const table = slide.tables.add({ rows: values.length, columns: 4, left: 64, top: 170, width: 1150, height: 420, values, columnWidths: [240, 165, 555, 190] });
  styleTable(table, { headerSize: 16, bodySize: 15, firstColBold: true });
  [1].forEach(r => table.getCell(r, 3).fill = C.amberPale);
  [2, 3].forEach(r => table.cells.block({ row: r, column: 3, rowCount: 1, columnCount: 1 }).assign({ fill: C.redPale, textStyle: { typeface: font, fontSize: 15, color: C.red, bold: true } }));
  [4, 5, 6].forEach(r => table.cells.block({ row: r, column: 3, rowCount: 1, columnCount: 1 }).assign({ fill: C.amberPale, textStyle: { typeface: font, fontSize: 15, color: "#7A5200", bold: true } }));
  addText(slide, "The workbook's development exit criteria require complete agreed development, peer review, merged PRs, no critical blockers and testable builds.", 64, 610, 1120, 52, { size: 17, color: C.slate });
  addFooter(slide, "Source: Kora_Likha Product.xlsx, Timeline worksheet");
  setNotes(slide, ["Source: Kora_Likha Product.xlsx, Timeline!B3:R47."]);
}

// 5. Delivered capabilities
{
  const slide = pres.slides.add();
  slide.background.fill = C.gray;
  addHeader(slide, "Delivered capabilities", "The Done column shows useful foundations across Flow, activities, application UI and agents", 5);
  const screen = await readBytes(path.join(workspaceDir, "docs", "images", "process-designer.png"));
  slide.images.add({
    blob: screen,
    contentType: "image/png",
    alt: "KORA Process Designer interface",
    fit: "cover",
    position: { left: 580, top: 178, width: 635, height: 350 },
    geometry: "roundRect",
    borderRadius: "rounded-xl",
  });
  addText(slide, "22 items are Done", 64, 176, 450, 48, { size: 30, bold: true, color: C.green });
  addText(slide, "Flow designer", 64, 248, 230, 30, { size: 19, bold: true, color: C.ink });
  addText(slide, "Precise card insertion, keyboard shortcuts, comment and uncomment, Intellisense and modular activity architecture", 64, 284, 450, 82, { size: 17, color: C.slate });
  addText(slide, "Programming and collections", 64, 388, 330, 30, { size: 19, bold: true, color: C.ink });
  addText(slide, "Create List, Update List Item, Read List Item, Matches, Output Data Table, Else If, Multiple Assign and related activities", 64, 424, 450, 82, { size: 17, color: C.slate });
  addText(slide, "Application and agent UI", 64, 528, 300, 30, { size: 19, bold: true, color: C.ink });
  addText(slide, "Global Variables, Agent Home, Variable Panel improvements and product rebranding", 64, 564, 450, 62, { size: 17, color: C.slate });
  addText(slide, "Product screenshot from the KORA documentation repository", 580, 544, 635, 22, { size: 11, color: C.slate, align: "right" });
  addFooter(slide, "Source: GitHub Project Done column; KORA documentation assets");
  setNotes(slide, ["Source: GitHub Project Done column reviewed 12 Oct 2026.", "Image: repository file docs/images/process-designer.png."]);
}

// 6. MVP1 pipeline
{
  const slide = pres.slides.add();
  slide.background.fill = C.white;
  addHeader(slide, "MVP1 delivery pipeline", "Most release-labelled work has not entered development", 6);
  const chart = slide.charts.add("bar", {
    position: { left: 64, top: 170, width: 680, height: 360 },
    title: "MVP1 items by board status",
    titleTextStyle: { fontSize: 18, fill: C.ink, bold: true },
    categories: ["Backlog", "Ready", "In Progress", "Review", "QA", "Done"],
    series: [{ name: "MVP1 items", values: [84, 1, 0, 0, 0, 6], fill: C.green, points: [{ idx: 0, fill: "#D9E1DE" }, { idx: 1, fill: C.amber }, { idx: 5, fill: C.green }] }],
    barOptions: { direction: "bar", grouping: "clustered", gapWidth: 45, varyColors: false },
    hasLegend: false,
    xAxis: { visible: true, min: 0, max: 90, majorUnit: 15, majorGridlines: { style: "solid", fill: C.light, width: 1 }, textStyle: { fontSize: 13, fill: C.slate } },
    yAxis: { visible: true, majorGridlines: null, textStyle: { fontSize: 15, fill: C.ink, bold: true } },
    dataLabels: { showValue: true, position: "outEnd", textStyle: { fontSize: 15, fill: C.ink, bold: true } },
    chartFill: C.white,
    plotAreaFill: C.white,
  });
  addText(slide, "Ready", 810, 192, 330, 30, { size: 18, bold: true, color: C.amber });
  addText(slide, "Agent Publish function  #352", 810, 228, 350, 36, { size: 21, bold: true, color: C.ink });
  addText(slide, "Assigned to BurnIMJerome. Maps to the Agent MVP1 publish, versioning and rollback requirement.", 810, 270, 360, 76, { size: 16, color: C.slate });
  addText(slide, "Pipeline gap", 810, 382, 330, 30, { size: 18, bold: true, color: C.red });
  addText(slide, "No MVP1 item is in development, review or QA.", 810, 422, 350, 80, { size: 25, bold: true, color: C.ink });
  addFooter(slide, "Source: GitHub Project Dev View filtered by label:MVP1");
  setNotes(slide, ["Source: https://github.com/users/BurnIMJerome/projects/2/views/1?filterQuery=label%3AMVP1"]);
}

// 7. Risks
{
  const slide = pres.slides.add();
  slide.background.fill = C.white;
  addHeader(slide, "Main delivery risks", "The schedule depends on immediate scope and workflow decisions", 7);
  const values = [
    ["Risk", "Severity", "Evidence and impact"],
    ["Schedule-phase mismatch", "CRITICAL", "Testing has started on the plan; nearly all MVP1 work remains in Backlog"],
    ["Code-freeze feasibility", "CRITICAL", "85 MVP1 items are not Done with 18 days remaining"],
    ["Unclosed release scope", "HIGH", "Backlog definition and prioritization remain ongoing"],
    ["No QA flow", "HIGH", "Review and QA both contain zero items"],
    ["Completion evidence gaps", "HIGH", "Several planned capabilities have no verified completion status"],
    ["Weak effort forecasting", "MEDIUM", "No visible estimates or target dates on board items"],
  ];
  const table = slide.tables.add({ rows: values.length, columns: 3, left: 64, top: 168, width: 1150, height: 430, values, columnWidths: [330, 160, 660] });
  styleTable(table, { headerSize: 16, bodySize: 15, firstColBold: true });
  [1, 2].forEach(r => table.cells.block({ row: r, column: 1, rowCount: 1, columnCount: 1 }).assign({ fill: C.redPale, textStyle: { typeface: font, fontSize: 15, color: C.red, bold: true } }));
  [3, 4, 5].forEach(r => table.cells.block({ row: r, column: 1, rowCount: 1, columnCount: 1 }).assign({ fill: C.amberPale, textStyle: { typeface: font, fontSize: 15, color: "#7A5200", bold: true } }));
  table.getCell(6, 1).fill = C.light;
  table.cells.block({ row: 6, column: 1, rowCount: 1, columnCount: 1 }).textStyle.bold = true;
  addText(slide, "Item-count completion is directional. The board does not provide enough sizing data for an effort-weighted forecast.", 64, 620, 1120, 46, { size: 17, color: C.slate });
  addFooter(slide, "Sources: GitHub Project status counts and Timeline exit criteria");
  setNotes(slide, ["Sources: GitHub Project reviewed 12 Oct 2026; Kora_Likha Product.xlsx, Timeline!B37:I47."]);
}

// 8. Recovery plan
{
  const slide = pres.slides.add();
  slide.background.fill = C.gray;
  addHeader(slide, "Recovery plan and decisions", "A viable October code freeze requires a smaller release baseline and daily movement into QA", 8);
  const values = [
    ["Window", "Recovery action", "Required outcome"],
    ["12–13 Oct", "Freeze the October release baseline; assign owners, criteria and dates", "A realistic MVP1 list"],
    ["14–23 Oct", "Move small testable batches through development, review and QA", "Daily completed work"],
    ["24–30 Oct", "Stop nonessential features; run regression, smoke and acceptance checks", "Evidence-based go / no-go"],
  ];
  const table = slide.tables.add({ rows: 4, columns: 3, left: 64, top: 166, width: 1150, height: 230, values, columnWidths: [170, 650, 330] });
  styleTable(table, { headerSize: 16, bodySize: 15, firstColBold: true });
  addText(slide, "Management decisions required", 64, 432, 500, 38, { size: 24, bold: true, color: C.green });
  const decisions = [
    ["1", "Scope", "Which MVP1 items are mandatory for the release candidate?"],
    ["2", "Schedule", "Keep October 30 and reduce scope, or move the milestone dates?"],
    ["3", "Capacity", "Who owns development, review and QA for each workstream?"],
    ["4", "Quality gate", "What test evidence and defect threshold permit beta entry?"],
  ];
  decisions.forEach((d, i) => {
    const x = 64 + (i % 2) * 575;
    const y = 490 + Math.floor(i / 2) * 82;
    addText(slide, d[0], x, y, 42, 42, { size: 25, bold: true, color: C.amber, align: "center" });
    addText(slide, d[1], x + 56, y, 130, 28, { size: 17, bold: true, color: C.ink });
    addText(slide, d[2], x + 190, y, 350, 58, { size: 15, color: C.slate });
  });
  addFooter(slide, "Recommendation: revalidate the 30 Oct code-freeze commitment by 13 Oct 2026");
  setNotes(slide, ["Recovery actions derived from the report's schedule, pipeline and exit-criteria analysis."]);
}

await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

for (let i = 0; i < pres.slides.items.length; i++) {
  const slide = pres.slides.items[i];
  const png = await pres.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(buildDir, `slide-${String(i + 1).padStart(2, "0")}.png`), new Uint8Array(await png.arrayBuffer()));
}
const montage = await pres.export({ format: "webp", montage: true });
await fs.writeFile(path.join(buildDir, "montage.webp"), new Uint8Array(await montage.arrayBuffer()));

const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, "container_tools", "artifact_tool_utils.mjs")).href);
const stagingDir = path.join(workspaceDir, ".codex-finalizer");
await fs.mkdir(stagingDir, { recursive: true });
const candidatePath = path.join(stagingDir, "KORA_Development_Progress_2026-10-12.candidate.pptx");
await (await PresentationFile.exportPptx(pres)).save(candidatePath);

const requirements = {
  explicitTotalSlideCount: 8,
  requiredNativeTableOwnerSlides: [3, 4, 7, 8],
  requiredNativeChartOwnerSlides: [3, 6],
  materializeLiteralChartWorkbooks: true,
  nativeChartTargetApplication: "powerpoint",
};
const result = await finalizePresentation({
  ...requirements,
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable,
  integrityValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
    "--require-native-table-slide", "3",
    "--require-native-table-slide", "4",
    "--require-native-table-slide", "7",
    "--require-native-table-slide", "8",
  ],
  requiredNativeTableOwnerSlides: requirements.requiredNativeTableOwnerSlides,
  requiredNativeChartOwnerSlides: requirements.requiredNativeChartOwnerSlides,
  materializeLiteralChartWorkbooks: true,
  nativeChartTargetApplication: "powerpoint",
  fontPolicy: { basis: "design", families: [font] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "KORA_Development_Progress_2026-10-12.validation.json"),
});

console.log(JSON.stringify({ finalPath, slideCount: pres.slides.items.length, result }, null, 2));
