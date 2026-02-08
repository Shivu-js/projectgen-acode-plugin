import projects from "./data/projects.js";

let panel;

export default {
  onload() {
    panel = acode.require("panel");
    this.showUI();
  },

  onunload() {
    if (panel) panel.destroy();
  },

  showUI() {
    panel.create({
      id: "projectgen-panel",
      title: "🚀 ProjectGen",
      position: "right",
      html: acode.require("fs").readFileSync(this.baseUrl + "ui.html", "utf8"),
      onShow: () => this.attachEvents()
    });
  },

  attachEvents() {
    document.getElementById("generateProject").onclick = () => {
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

  createFiles(p) {
    const fs = acode.require("fs");
    const root = acode.projectRoot;
    fs.writeFileSync(root + "/index.html", p.starter.html);
    fs.writeFileSync(root + "/style.css", p.starter.css);
    fs.writeFileSync(root + "/script.js", p.starter.js);
  }
};