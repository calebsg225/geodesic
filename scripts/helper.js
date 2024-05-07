class Helper {
  addElements = (elements, destination) => {
    elements.forEach(element => {
      destination.append(element);
    });
  }
}


export default new Helper;