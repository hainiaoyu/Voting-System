const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const polls = data.polls;
const bcrypt = require('bcryptjs');

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        return users
          .addUser("Spidey102", "Spider", "Man", "graffixnyc@gmail.com", "M", "Flushing", "NY", "25", bcrypt.hashSync("testingfornow"))
          .then(() => {
              return users.addUser("koby", "Yasuo", "Kobayashi", "koby@gmail.com", "M", "Elmhust", "NY", "28", bcrypt.hashSync("yasuo"));
          })
          .then(() => {
              return users.addUser("hali", "Haoyang", "Li", "hali@gmail.com", "F", "Jersey City", "NJ", "23", bcrypt.hashSync("haoyang"));
          })
          .then(() => {
              return users.addUser("Seito", "Seito", "Ryu", "seito@gmail.com", "M", "Hoboken", "NJ", "30", bcrypt.hashSync("seito"));
          })
          .then(() => {
              return users.addUser("jason", "jason", "sarwar", "jason@gmail.com", "M", "Hoboken", "NJ", "24", bcrypt.hashSync("jason"));
          })
          .then(() => {
              return users.addUser("mike", "Mike", "Torres", "mike@gmail.com", "M", "Manhattan", "NY", "29", bcrypt.hashSync("mike"));
          })
          .then(() => {
              return users.addUser("london", "London", "Hyde", "london@gmail.com", "M", "London", "UK", "23", bcrypt.hashSync("london"));
          })
          .then(() => {
              return users.addUser("paris", "Paris", "Miller", "paris@gmail.com", "F", "Paris", "FR", "33", bcrypt.hashSync("paris"));
          })
          .then(() => {
              return users.addUser("deli", "Deli", "Dan", "deli@gmail.com", "M", "Deli", "ID", "27", bcrypt.hashSync("deli"));
          })
          .then(() => {
              return users.addUser("sha", "Shanghai", "Lu", "sha@gmail.com", "M", "Shanghai", "CH", "29", bcrypt.hashSync("sha"));
          })
          .then(() => {
              return users.addUser("gaj", "Gamma", "Jo", "gaj@gmail.com", "M", "Miami", "FR", "27", bcrypt.hashSync("gaj"));
          })

    }).then((patrick) => {
        const id = patrick._id;

        return polls
            .addPoll("Technology", new Date("11/27/2016"), "What Phone Should I buy?", "iPhone 7", "Galaxy S7", "Google Pixel XL", "Other (leave in comments)", id)
            .then(() => {
                return polls.addPoll("Food", new Date("2016-11-27"), "What is the best food before taking an exam?", "Banana", "Pizza", "Chocolate", "Sushi", id);
            })
            .then(() => {
                return polls.addPoll("Entertainment", new Date("2016-12-10"), "What is a must see YouTube video today?", "PPAP", "TED Talks", "Maroon5", "Adele Carpool Karaoke", id);
            })
            .then(() => {
                return polls.addPoll("Education", new Date("2016-11-27"), "What Class Should I take next semester?", "CS 546", "CS 522", "CS 545", "CS 522", id);
            })
            .then(() => {
                return polls.addPoll("Automotive", new Date("2016-12-1"), "What types of car should I buy?", "SUVs", "Sedan", "Sports", "Truck", id);
            })
            .then(() => {
                return polls.addPoll("Sports", new Date("2016-12-2"), "What sports should I watch with my girlfriend?", "Football", "Baseball", "Basketball", "Tennis", id);
            })
            .then(() => {
                return polls.addPoll("Movies", new Date("2016-12-7"), "What is a must see movie?", "Inception", "GodFather", "Harry Poter", "Mission Impossible", id);
            })
            .then(() => {
                return polls.addPoll("Travel", new Date("2016-11-28"), "Which city should I visit this summer?", "Miami", "New Orleans", "San Francisco", "Hoboken", id);
            })
            .then(() => {
                return polls.addPoll("Politics", new Date("2016-11-22"), "Who should be the next president of the United States?", "Donald Trump", "Hilary Cliton", "Michael Jordan", "Lady Gaga", id);
            })
            .then(() => {
                return polls.addPoll("Arts", new Date("2016-11-22") , "Which museum do you like the most in NYC?", "Metropolitan", "MOMA", "Guggenheim", "Whitney", id);
            })
            .then(() => {
                return polls.addPoll("Health", new Date("2016-11-20"), "What health concerns do you have recently?", "Obesity", "Depression", "Diabetes", "Heart disease", id);
            })
            .then(() => {
                return polls.addPoll("Music", new Date("2016-11-22"), "What genres of music do you want to listen?", "Rock", "Pops", "Classic", "Jazz", id);
            })
        //.then(() => {
        //   return polls.addPoll(12, "11/27/2016","What is a better laptop?","MacBook Pro 13","Dell XPS 13","Lenovo Yoga","HP Envy", id);
        //});
    }).then(() => {
        console.log("Done seeding database");
        db.close();
    });
}, (error) => {
    console.error(error);
});
