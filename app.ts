// autobind decorator
function autoBind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  // indicate property names and what their type will be, in this case a bunch of html elements
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    // the "!" tells typescript we are confident this element is available
    // and we are also saying it will be a HTML Template Element
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";
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
    this.attach();
  }
  //   private make it so the method can only be accessed from inside the class.

  private gatherUserInput(): [string, string, number] | void {
    const entertedTitle = this.titleInputElement.value;
    const entertedDescription = this.descriptionInputElement.value;
    const entertedPeople = this.peopleInputElement.value;
    if (
      entertedTitle.trim().length === 0 ||
      entertedDescription.trim().length === 0 ||
      entertedPeople.trim().length === 0
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [entertedTitle, entertedDescription, +entertedPeople];
    }
  }
  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
    }
  }
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
