import Graphics from './Graphics'

var operations = {
    ChangeColor: {
      undoData : { color: ""},
      execute (command){
        const graphics = Graphics.find(command.graphics);
        //console.log(`color? ${this}`)
        this.undoData.color = graphics.color;
        graphics.color = command.color;
      },
      undo(command){
        const graphics = Graphics.find(command.graphics);
        //graphics.color = this.undoData.color;
      },
    },
    Income: {
      execute(command){
        const account = BankAccount.find(command.account);
        account.balance += command.amount;
      },
      undo(command){
        const account = BankAccount.find(command.account);
        account.balance -= command.amount;
      },
    },
    Upload: {
        execute(command){
          undoData = command.image;
          Graphics.loadImage(command.image);
        },
        undo(command){
          // Graphics.loadImage(image);
        },
      },
  };

  export { operations };