import projects from "./data/projects.js";

let baseUrl;

export default {
  // Acode प्लगइन को लोड करते समय init फंक्शन का उपयोग करता है
  async init(url) {
    baseUrl = url;
    this.showUI();
  },

  async showUI() {
    try {
      // ui.html को fetch API के जरिए लोड करना
      const response = await fetch(baseUrl + "ui.html");
      const html = await response.text();

      // Acode में साइड पैनल सेट करने का सही तरीका
      acode.setPanel("projectgen-panel", {
        title: "🚀 ProjectGen",
        content: html,
        width: "300px",
      });

      this.attachEvents();
    } catch (err) {
      console.error("UI लोड करने में विफल:", err);
    }
  },

  attachEvents() {
    const generateBtn = document.getElementById("generateProject");
    if (!generateBtn) return;

    generateBtn.onclick = () => {
      const level = document.getElementById("level").value; //
      const tech = document.getElementById("tech").value; //

      // projects.js से प्रोजेक्ट डेटा फिल्टर करना
      const list = projects.filter(p => p.level === level && p.tech.includes(tech));
      
      if (!list.length) {
        window.alert("कोई प्रोजेक्ट नहीं मिला!");
        return;
      }

      const project = list[Math.floor(Math.random() * list.length)];
      this.render(project);
      this.createFiles(project);
    };
  },

  render(p) {
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
      resultDiv.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <small>Files: ${p.structure.join(", ")}</small>
      `; //
    }
  },

  async createFiles(p) {
    const fs = acode.require("fsOperation"); // सही फाइल सिस्टम मॉड्यूल
    const root = acode.projectRoot; // वर्तमान प्रोजेक्ट का रूट पाथ

    if (!root) {
      window.alert("कृपया पहले एक फोल्डर खोलें!");
      return;
    }

    try {
      // प्रोग्रेस दिखाने के लिए (वैकल्पिक)
      window.toast("प्रोजेक्ट फाइलें बनाई जा रही हैं...", 2000);

      // प्रोजेक्ट की starter फाइलें बनाना
      await fs(root + "/index.html").writeFile(p.starter.html);
      await fs(root + "/style.css").writeFile(p.starter.css);
      await fs(root + "/script.js").writeFile(p.starter.js);

      window.alert("✅ प्रोजेक्ट सफलतापूर्वक जेनरेट हो गया!");
    } catch (err) {
      window.alert("फाइल बनाने में त्रुटि: " + err.message);
    }
  },

  // प्लगइन अनलोड होने पर सफाई
  async onunload() {
    // यहाँ आप पैनल को क्लोज करने का लॉजिक जोड़ सकते हैं
  }
};
