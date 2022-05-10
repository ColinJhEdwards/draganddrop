// this is how we import the namespace, triple / is important
/// <reference path="drag-drop-interface.ts" />
/// <reference path="project-model.ts" />
/// <reference path="project-state.ts" />
/// <reference path="validation.ts" />
/// <reference path="autoBind.ts" />
/// <reference path="project-item.ts" />
/// <reference path="project-list.ts" />
/// <reference path="project-input.ts" />

namespace App {
  new ProjectInput();

  new ProjectList("active");
  new ProjectList("finished");
}
