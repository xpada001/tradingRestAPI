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

## React Front-end
Make sure that you have react-scripts installed (otherwise run "npm install react-script") then run 
```
npm start 
```
to start the front end, the page should automatically open at localhost:3000

## Dummy stock filler

Created by the tutor at https://bitbucket.org/fcallaly/dummy-trade-filler/src/master/. This is a siumulator for updating the status of our stock purchases (i.e. it will randomly fill or reject our request.)

You can start this filler by running the main function in IDE.

Note that the entities definition in model folder and the TradeMongoDao.java in dao folder have been updated accordingly for this project.

## MongoDB
Download the mongoDB compass, then for connection, select localhost as hostname and 27017 as port, this will connect your local mongoDB collections.
Note: in tradeRestAPI resource folder -> application.properties, you can see that "spring.data.mongodb.uri = mongodb://localhost/test", which indicate the data has been written to localhost/test database, in which you should find portfolio and trade collections.


## Trading RestAPI

run the main function in API folder in your IDE to start the back end. This is the back end where we have features such as:
- Buy and sell trade (input: buy/sell, stock ticker, stock quantity, requested price), request will either sent successfully or not based on if portfolio deposit is sufficient or not. Then, the dummy filler will either approve or reject the request
- Trading advice: based on bollinger band using data provided by Yahoo Finance for recent 30 days trend, it will provide buy/sell advice.
- Watch list: add stock tickers (with data provided by Yahoo Finance) for monitoring purposes. 
- Portfolio:
  - Calculate the portfolio summary (what are the holding stock tickers, stock quantity and total stock value), you can sort them in ascending or descending order.
  - More visualization (pie charge and bar plot) on your portfolio summary
  - Pending trades (shows recent trading requests that is still processing) and completed trades table (mostly either filled or rejected). Request status will be refreshed periodically and move automatically from pending trades table to complete trades table.

An example of the portfolio UI:

![alt text](https://github.com/xpada001/tradingRestAPI/blob/main/images/portfolio.png?raw=true)


Note: For now, a portfolio will be created beforeahead to run this application.
