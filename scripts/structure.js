import Helper from "./helper.js";

const initializeStructure = () => {
  const initial = document.createElement('h1')
  initial.id = "initial";
  initial.innerText = "initial";
  
  Helper.addElements([initial], document.body);
}

export { initializeStructure };