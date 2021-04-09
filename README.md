# tradingRestAPI (construction in progresss)

To get started with a spring framework, go to https://start.spring.io/.

Four main components:

## Python script for visualization

First, make sure you have python installed by running 
```
python3 --version
```
If it is installed, then run 
```
pip install -r requirements.txt
```
where requirements.txt is in the tradeingAdvice folder. Once everything is installed, run
```
python3 bollinger.py
```

## Front end
Make sure that you have react-scripts installed (otherwise run "npm install react-script") then run 
```
npm start 
```
to start the front end, the page should automatically open at localhost:3000

## API

run the main function in API folder in your IDE to start the back end.

## dummy stock filler

Created by the tutor at https://bitbucket.org/fcallaly/dummy-trade-filler/src/master/. This is a siumulator for updating the status of our stock purchases (i.e. it will randomly fill or reject our request. 

You can start this filler by running the main function in IDE.

Note that the entities definition in model folder and the TradeMongoDao.java in dao folder have been updated to adhere with this project.

## MongoDB
Download the mongoDB compass, then for connection, select localhost as hostname and 27017 as port, this will connect your local mongoDB collections.
Note: in tradeRestAPI resource folder -> application.properties, you can see that "spring.data.mongodb.uri = mongodb://localhost/test", which indicate the data has been written to localhost/test database, in which you should find portfolio and trade collections.
