"use strict";
class ProjectInput {
    constructor() {
        // the "!" tells typescript we are confident this element is available
        // and we are also saying it will be a HTML Template Element
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const prjInput = new ProjectInput();
