// this is how we import the namespace, triple / is important
/// <reference path="drag-drop-interface.ts" />
/// <reference path="project-model.ts" />
/// <reference path="project-state.ts" />
/// <reference path="validation.ts" />
/// <reference path="autoBind.ts" />

namespace App {
  // component base Class
  // the abstract keyword ensures we cant instantiate the class (Component.attach), because we intend to only use this class as an extendor
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as T;
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }
      this.attach(insertAtStart);
    }
    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? "afterbegin" : "beforeend",
        this.element
      );
    }
    abstract configure(): void;
    abstract renderContent(): void;
  }

  // ProjectItem Class
  class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable
  {
    private project: Project;
    get persons() {
      return this.project.people === 1
        ? "1 person"
        : `${this.project.people} people`;
    }
    constructor(hostId: string, project: Project) {
      super("single-project", hostId, false, project.id);
      this.project = project;
      this.configure();
      this.renderContent();
    }
    @autoBind
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData("text/plain", this.project.id);
      event.dataTransfer!.effectAllowed = "move";
    }

    dragEndHandler(event: DragEvent): void {
      console.log("dragEnd");
    }
    configure() {
      this.element.addEventListener("dragstart", this.dragStartHandler);
    }
    renderContent() {
      this.element.querySelector("h2")!.textContent = this.project.title;
      this.element.querySelector(
        "h3"
      )!.textContent = `${this.persons} assigned`;
      this.element.querySelector("p")!.textContent =
        this.project.description.toString();
    }
  }

  // projectList Class
  class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[];
    constructor(private type: "active" | "finished") {
      super(`project-list`, `app`, false, `${type}-projects`);

      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      listEl.innerHTML = "";
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      }
    }
    @autoBind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }

    @autoBind
    dropHandler(event: DragEvent): void {
      const prjId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        prjId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autoBind
    dragLeaveHandler(event: DragEvent): void {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);
      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((prj) => {
          if (this.type === "active") {
            return prj.status === ProjectStatus.Active;
          }
          return prj.status === ProjectStatus.Finished;
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }
  }

  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    // indicate property names and what their type will be, in this case a bunch of html elements
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor() {
      super(`project-input`, `app`, true, "user-input");
      // the "!" tells typescript we are confident this element is available
      // and we are also saying it will be a HTML Template Element
      // grabbing elements within the form
      this.titleInputElement = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;

      this.configure();
    }
    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
    //   private make it so the method can only be accessed from inside the class.

    private gatherUserInput(): [string, string, number] | void {
      const entertedTitle = this.titleInputElement.value;
      const entertedDescription = this.descriptionInputElement.value;
      const entertedPeople = this.peopleInputElement.value;

      const titleValidatable: Validatable = {
        value: entertedTitle,
        required: true,
      };
      const descriptionValidatable: Validatable = {
        value: entertedDescription,
        required: true,
        minLength: 5,
      };
      const peopleValidatable: Validatable = {
        value: +entertedPeople,
        required: true,
        min: 1,
        max: 5,
      };
      if (
        !validate(titleValidatable) &&
        !validate(descriptionValidatable) &&
        !validate(peopleValidatable)
      ) {
        alert("Invalid input, please try again!");
        return;
      } else {
        return [entertedTitle, entertedDescription, +entertedPeople];
      }
    }

    private clearInputs() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }

    @autoBind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
        const [title, desc, people] = userInput;
        projectState.addProject(title, desc, people);
        this.clearInputs();
      }
    }
    renderContent() {}
  }

  new ProjectInput();

  new ProjectList("active");
  new ProjectList("finished");
}
