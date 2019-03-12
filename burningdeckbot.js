const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
require('dotenv').config();

client.on("ready", () => {
  console.log("I am ready!");
});

var menu = [];
var tabs = [];
const categories = ["Beer", "Wine", "Cider", "Vodka", "Gin", "Whiskey", "Rum",
  "Tequila", "Brandy", "Other"];

client.on("message", (message) => {
  // Exit and stop if it's not there
  if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "menu":
      if(args.length == 0) {
        if(menu.length != 0) {
          for (const category of categories) {
              message.channel.send("**" + category + "**");
              for(const menuItem of menu) {
                  if(menuItem.category == category) {
                        message.channel.send(menuItem.name + ", Service Price: " + menuItem.servingPrice + " Credits, Bottle Price : " + menuItem.bottlePrice + " Credits.");
                  }
              }
          }
        } else {
          message.channel.send(config.emptyMenuText);
        }

      } else {

        var nextCommand = args.shift().toLowerCase();
        switch (nextCommand) {
          case "add":
            if(args.length != 4) {
              message.channel.send("Invalid use of add command. Use \"!menu help\" to get a list of acceptable commands.");
              break;
            } else {
              var validCategory = "";
              for(const category of categories) {
                  if(args[3].toLowerCase() == category.toLowerCase()) {
                      validCategory = category;
                  }
              }
              if(validCategory == "") {
                message.channel.send("Invalid Catgeory. For list of valid categories please use the \"!categories\" command.");
                break;
              }
              var menuItem = {name: args[0], servingPrice: args[1], bottlePrice: args[2], category: validCategory};
              menu.push(menuItem);
              message.channel.send(menuItem.name + " added to the " + menuItem.category + " category for a serving price of " + menuItem.servingPrice + " Credits and a bottle price of " + menuItem.bottlePrice + " Credits.");
            }
            break;
          case "remove":
            if(menu.length == 0) {
              message.channel.send(config.emptyMenuText);
              return;
            }

            if(args.length == 0 || args.length > 1) {
              message.channel.send("Invalid use of the remove command. Please use the \"!menu help\" command for proper syntax of the command.");
            } else {
              var itemIndex = -1;
              for(i = 0; i < menu.length; i++) {
                  if(menu[i].name == args[0]) {
                          itemIndex = i;
                  }
              }

              if(itemIndex != -1) {
                menu.splice(itemIndex-1, 1);
                message.channel.send(args[0] + " has been removed from the menu.");
              } else {
                message.channel.send("Menu doesn't contain item.");
              }
            }
            break;
          case "clear":
            if(menu.length == 0) {
              message.channel.send(config.emptyMenuText);
              return;
            }
            menu.length = 0;
            message.channel.send("The menu has been cleared.");
            break;
          case "help":
            message.channel.send({embed: {
              color: 3447003,
              title: "Menu Command Help",
              description: "Lists the subcommands available for the !menu command.",
              fields: [
                {
                  name: "!menu",
                  value: "Lists the current menu by category."
                },
                {
                  name: "!menu add [Name containing no spaces] [Price Per Serving] [Price Per Bottle] [Category must be a valid category listed by the categories command]",
                  value: "Adds a new item to the menu."
                },
                {
                  name: "!menu remove [Name containing no spaces]",
                  value: "Removes the named item from the menu."
                },
                {
                  name: "!menu clear",
                  value: "Clears all the items from the menu."
                },
                {
                  name: "!menu help",
                  value: "Lists all the menu commands."
                }
              ]
            }});
            break;
          default:
            message.channel.send("Invalid menu command. Use \"!menu help\" to get a list of acceptable commands.");
            break;
        }
      }
      break;
    case "tab":
      if(args.length == 0) {
        if(tabs.length != 0) {
          for(const tab of tabs) {
              message.channel.send(tab.name + " owes " + tab.amount + " Credits.");
          }
        } else {
          message.channel.send(config.noTabsText);
        }

      } else {

      var nextCommand = args.shift().toLowerCase();
      switch (nextCommand) {
        case "add":
          if(args.length != 2) {
            message.channel.send("Invalid use of tab command. Use \"!tab help\" to get a list of acceptable commands.");
            break;
          } else {
            var tab = {name: args[0], amount: args[1]};
            tabs.push(tab);
            message.channel.send("Tab added for " + tab.name);
          }
          break;
        case "settle":
          if(tabs.length == 0) {
            message.channel.send(config.noTabsText);
            return;
          }

          if(args.length == 0 || args.length > 1) {
            message.channel.send("Invalid use of the settle command. Please use the \"!tab help\" command for proper syntax of the command.");
          } else {
            var tabIndex = -1;
            for(i = 0; i < tabs.length; i++) {
                if(tabs[i].name == args[0]) {
                        tabIndex = i;
                }
            }

            if(tabIndex != -1) {
              tabs.splice(tabIndex-1, 1);
              message.channel.send(args[0] + " has settled thier tab.");
            } else {
              message.channel.send("No tab exists for " + arg[0] + ".");
            }
          }
          break;
        case "clear":
          if(tabs.length == 0) {
            message.channel.send(config.noTabsText);
            return;
          }
          tabs.length = 0;
          message.channel.send("The tabs have all been cleared.");
          break;
        case "help":
          message.channel.send({embed: {
            color: 3447003,
            title: "Tab Command Help",
            description: "Lists the subcommands available for the !tab command.",
            fields: [
              {
                name: "!tab",
                value: "Lists the current tabs."
              },
              {
                name: "!tab add [Name containing no spaces] [Amount Owed]",
                value: "Adds a new item to the menu."
              },
              {
                name: "!tab settle [Name containing no spaces]",
                value: "Removes the named tab from the tab list."
              },
              {
                name: "!tab clear",
                value: "Clears all the current tabs."
              },
              {
                name: "!tab help",
                value: "Lists all the tab commands."
              }
            ]
          }});
          break;
        default:
          message.channel.send("Invalid tab command. Use \"!tab help\" to get a list of acceptable commands.");
          break;
        }
      }
      break;
    case "buy":
      if(args.length == 0 || (args.length == 1 && args[0].toLowerCase() == "help")) {
        message.channel.send({embed: {
          color: 3447003,
          title: "Buy Command Help",
          description: "Lists the subcommands available for the !buy command.",
          fields: [
            {
              name: "!buy & !buy help",
              value: "Lists all the help commands."
            },
            {
              name: "!buy [item name] [serving size] [tab name]",
              value: "Adds the specified item to the specified tab.\nServing sizes are Single and Bottle."
            }
          ]
        }});
      } else if(args.length != 3) {
        message.channel.send("Invalid use of the buy command. Please see \"!buy help\" for the proper syntax of the command.");
      } else {
        var item = {itemName: args[0], singleBottle: args[1], tabName: args[2]};
        var itemAmount = 0;
        for(const menuItem of menu) {
            if(menuItem.name.toLowerCase() == item.itemName.toLowerCase()) {
                switch (item.singleBottle.toLowerCase()) {
                  case "single":
                    itemAmount = menuItem.servingPrice;
                    break;
                  case "bottle":
                    itemAmount = menuItem.bottlePrice;
                    break;
                  default:
                    message.channel.send("Invalid serving. Please see \"!buy help\" for the supported serving sizes."+ item.singleBottle);
                    return;
                }
            }
        }
        if(itemAmount == 0) {
            message.channel.send("Invalid menu item. Please see the menu for a list of items." + item.itemName);
            break;
        }

        var tabIndex = -1;
        for(i = 0; i < tabs.length; i++) {
            if(tabs[i].name.toLowerCase() == item.tabName.toLowerCase()) {
                  tabIndex = i;
            }
        }

        if(tabIndex != -1) {
          tabs[tabIndex].amount = parseInt(tabs[tabIndex].amount, 10) + parseInt(itemAmount, 10);
        } else {
          var newTab = {name: item.tabName, amount: itemAmount}
          tabs.push(newTab);
        }
        message.channel.send(item.itemName + " added to " + item.tabName + "'s tab.");
      }
      break;
    case "categories":
      var allCategories = "";
      for (const category of categories) {
          allCategories = allCategories + "\n" + category
      }
      message.channel.send(allCategories);
      break;
    case "help":
      message.channel.send({embed: {
        color: 3447003,
        title: "Burning Deck Bot Help",
        description: "Lists the Commands available for the Burning Deck Bot. See the help for each command to know more on each.",
        fields: [
          {
            name: "!menu",
            value: "View and manipulate the menu."
          },
          {
            name: "!tab",
            value: "View and manipulate tabs."
          },
          {
            name: "!buy",
            value: "Add an item to a tab. If a tab exists, then it will add it to the tab. If one doesn't it will create a new one with the provided name."
          },
          {
            name: "!categories",
            value: "Lists all the Categories available for the menu."
          },
          {
            name: "!help",
            value: "Shows the Burning Deck Bot Help."
          }
        ]
      }});
      break;
    default:
      break;

  }
});

client.login(process.env.CLIENT_TOKEN);
