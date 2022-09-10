import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
        // Display the charts when the Dashboard is selected
        document.getElementById("bpm").style.display="";
        document.getElementById("tmp").style.display="";
        document.getElementById("rsp").style.display="";
        document.getElementById("oxy").style.display="";
    }

    async getHtml() {
        return `
            <h1>Driver State Monitoring Dashboard</h1>
            <p>
                All the data gathered are visible here. Along with them, some charts are plotted.
            </p>
            <p>
                <a href="/model" data-link>View information about the model.</a>.
            </p>
        `;
    }
}