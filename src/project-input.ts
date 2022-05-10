namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}
