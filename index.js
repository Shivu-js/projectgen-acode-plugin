const projects = require("./data/projects.js");

let panel;

export default {
  onload() {
    panel = acode.require("panel");
    this.showUI();
  },

  onunload() {
    if (panel && panel.destroy) panel.destroy();
  },

  showUI() {
    panel.create({
      id: "projectgen-panel",
      title: "🚀 ProjectGen",
      position: "right",
      html: acode.require("fs").readFileSync(
        this.baseUrl + "/ui.html",
        "utf8"
      ),
      onShow: () => this.attachEvents()
    });
  },

  attachEvents() {
    const btn = document.getElementById("generateProject");
    if (!btn) return;

    btn.onclick = () => {
      const level = document.getElementById("level").value;
      const tech = document.getElementById("tech").value;

      const list = projects.filter(
        p => p.level === level && p.tech.includes(tech)
      );

      if (!list.length) {
        alert("No project found");
        return;
      }

      const project = list[Math.floor(Math.random() * list.length)];
      this.render(project);
    };
  },

  render(p) {
    document.getElementById("result").innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <pre>${p.structure.join("\\n")}</pre>
    `;
  }
};
