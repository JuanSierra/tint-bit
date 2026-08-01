import UI from './UI' 
import ChangePaletteCommand from './commands/changePaletteCommand' 
import ZoomCommand from './commands/zoomCommand' 
import TintCommand from './commands/tintCommand' 
import ChangeTintSizeCommand from './commands/changeTintSizeCommand'
import ChangeToleranceCommand from './commands/changeToleranceCommand'
import UploadCommand from './commands/uploadCommand'
import UndoCommand from './commands/undoCommand'
import Graphics from './Graphics';

export default class Editor {
    constructor(element, graphics) {
      this.commands = [];
      //this._operations = operations;
      this._ui = new UI();
      this._ui.init(element, this.getActions(this));

      this._graphics = graphics;
      this._window = element;
      this._window.addEventListener("keydown", this._handleKeyDown.bind(this));
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
                console.log('updatePalette ' + palette);
              },
              changeColor: function(color){
                console.log('change color: ' + color);
                editor.execute(ChangePaletteCommand(color, editor.graphics));
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
                    editor.execute(UploadCommand(editor.graphics, image));
                } 
            },

            "Tint":{
                tintRegion: function(mouseX, mouseY){
                    if (!editor._activeTintCmd) {
                        editor._activeTintCmd = TintCommand(editor.graphics);
                    }
                    editor._activeTintCmd.executeRegion(mouseX, mouseY);
                },
                endTint: function(){
                    if (editor._activeTintCmd) {
                        editor.executeHistory.push(editor._activeTintCmd);
                        editor._activeTintCmd = null;
                    }
                },
                changeSize: function(size){
                    if (editor._activeTintCmd) {
                        editor.executeHistory.push(editor._activeTintCmd);
                        editor._activeTintCmd = null;
                    }
                    editor.execute(ChangeTintSizeCommand(size, editor.graphics));
                },
                changeTolerance: function(value){
                    if (editor._activeTintCmd) {
                        editor.executeHistory.push(editor._activeTintCmd);
                        editor._activeTintCmd = null;
                    }
                    editor.execute(ChangeToleranceCommand(value, editor.graphics));
                },
                changeGap: function(value){
                    editor.graphics.gap = value;
                }
            },

            "Download": {
                download: function(withScaling) {
                    if (!editor.graphics._image) return;
                    
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    
                    if (withScaling) {
                        canvas.width = editor.graphics._canvas.width;
                        canvas.height = editor.graphics._canvas.height;
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(editor.graphics._canvas, 0, 0);
                    } else {
                        canvas.width = editor.graphics._sourceImage.width;
                        canvas.height = editor.graphics._sourceImage.height;
                        ctx.drawImage(editor.graphics._image, 0, 0);
                    }
                    
                    let link = document.createElement("a");
                    link.download = "tint-bit-image.png";
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                }
            },
        }
    }

    execute(command) {
        if (this._activeTintCmd) {
            this.executeHistory.push(this._activeTintCmd);
            this._activeTintCmd = null;
        }
        this.executeHistory.push(command);
        command.execute();
        //console.log(`Executed command ${command.serialize()}`);
    }

    _handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key && event.key.toLowerCase() === "z") {
        event.preventDefault();
        UndoCommand(this).execute();
      }
    }

    undo() {
      if (this._activeTintCmd) {
        this.executeHistory.push(this._activeTintCmd);
        this._activeTintCmd = null;
      }
      const command = this.executeHistory.pop();
      if (!command || typeof command.undo !== "function") {
        return;
      }

      command.undo();
    }

  }
