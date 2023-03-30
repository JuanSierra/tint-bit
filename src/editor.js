import UI from './UI' 
import PaletteCommand from './commands/paletteCommand' 
import ZoomCommand from './commands/zoomCommand' 
import Graphics from './Graphics';

export default class Editor {
    constructor(element, graphics) {
      this.commands = [];
      //this._operations = operations;
      this._ui = new UI();
      this._ui.init(element, this.getActions(this));

      this._graphics = graphics;
      /*this._graphics = new Graphics(this.ui ? this.ui.getEditorArea() : wrapper, {
        cssMaxWidth: options.cssMaxWidth,
        cssMaxHeight: options.cssMaxHeight,
      });*/

      // TODO: move to an invoker class
      this.executeHistory = [];
    }
  
    get graphics(){
      return this._graphics;
    }

    getActions(editor){
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
                    console.log('change zoom');
                    console.log(editor.graphics)
                    editor.execute(ZoomCommand(scale, editor.graphics));
                } 
            },

            "Upload":{
                loadImage: function(image){
                    //this.operation(account1, 'ChangeColor', 'white');
                    //console.log('updatePalette ' + palette);
                    //commandManager.execute(new UploaCommand(image));
                    //this.operation(image, 'Upload');
                    console.log('conoce')
                    console.log(this.execute)
                    this.execute(UploadCommand(Graphics, image));
                } 
            }
        }
    }

    execute(command) {
        this.executeHistory.push(command);
        command.execute();
        //console.log(`Executed command ${command.serialize()}`);
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