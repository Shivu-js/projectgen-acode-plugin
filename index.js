import projects from "./data/projects.js";

let baseUrl;

export default {
  async init(url) {
    baseUrl = url;
    // UI दिखाने के लिए एक कमांड जोड़ें या onload का उपयोग करें
    this.showUI();
  },

  async showUI() {
    // ui.html को fetch करना बेहतर है
    const response = await fetch(baseUrl + "ui.html");
    const html = await response.text();

    acode.setPanel("projectgen-panel", {
      title: "🚀 ProjectGen",
      content: html,
      width: "300px",
      onhide: () => console.log("Panel hidden"),
    });

    this.attachEvents();
  },

  attachEvents() {
    const btn = document.getElementById("generateProject");
    if (!btn) return;

    btn.onclick = () => {
      const level = document.getElementById("level").value;
      const tech = document.getElementById("tech").value;

      const list = projects.filter(p => p.level === level && p.tech.includes(tech));
      if (!list.length) return alert("No project found");

      const project = list[Math.floor(Math.random() * list.length)];
      this.render(project);
      this.createFiles(project);
    };
  },

  render(p) {
    document.getElementById("result").innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <pre>${p.structure.join("\n")}</pre>
    `;
  },

  async createFiles(p) {
    const fs = acode.require("fsOperation");
    const root = acode.projectRoot;
    
    if (!root) return alert("Please open a folder first!");

    try {
      // फाइल बनाने के लिए Acode का fsOperation इस्तेमाल करें
      await fs(root + "/index.html").writeFile(p.starter.html);
      await fs(root + "/style.css").writeFile(p.starter.css);
      await fs(root + "/script.js").writeFile(p.starter.js);
      alert("Project files created!");
    } catch (err) {
      alert("Error creating files: " + err.message);
    }
  }
};
