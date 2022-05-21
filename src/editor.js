import UI from './UI' 
import PaletteCommand from './commands/paletteCommand' 
import Graphics from './Graphics';

export default class Editor {
    constructor(element, operations) {
      this.commands = [];
      this._operations = operations;
      this._ui = new UI();
      this._ui.init(element, this.getActions());

      this._graphics = new Graphics();
      /*this._graphics = new Graphics(this.ui ? this.ui.getEditorArea() : wrapper, {
        cssMaxWidth: options.cssMaxWidth,
        cssMaxHeight: options.cssMaxHeight,
      });*/
    }
  
    getActions(){
        return {
            "Palette": {
              updatePalette: function(palette){
                //this.operation(account1, 'ChangeColor', 'white');
                console.log('updatePalette ' + palette);
              }
            },

            "Zoom":{
                changeZoom: function(scale){
                    //this.operation(account1, 'ChangeColor', 'white');
                    //console.log('updatePalette ' + palette);

                } 
            }
        }
    }

   //TODO: change color to payload or args
    operation(graphics, operation, color) {
      //const operation = amount < 0 ? 'Withdraw' : 'Income';
      var { execute } = this._operations[operation];
      const command = new PaletteCommand(
        operation, graphics.name, color
      );
  
      this.commands.push(command);

      execute.call(this._operations[operation], command);
    }
  
    undo(count) {
      for (let i = 0; i < count; i++) {
        const command = this.commands.pop();
        const { operation } = command;
        const { undo } = operations[operation];
        undo(command);
      }
    }
  
    showOperations() {
      console.table(this.commands);
    }
  }