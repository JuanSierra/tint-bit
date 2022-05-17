Graphics.collection = new Map();

export class Graphics {
    constructor(name) {
      this.name = name;
      this.color = "default";
      
      Graphics.collection.set(name, this);
    }
  
    static find(name) {
      return Graphics.collection.get(name);
    }
  }