from flask import Flask
from flask_restplus import Resource, Api
import joblib

import yfinance as yf
import sys, getopt
import json

from pandas_datareader import data as pdr
import matplotlib.pyplot as plt
from flask import send_file
from flask import Response
import datetime
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
api = Api(app)

# used by download bollinger graph button
@api.route('/check/<string:ticker_name>')
class TickerValidation(Resource):

    def get(self, ticker_name):
        try:
            ticker = yf.Ticker(ticker_name)
            if (ticker.info.get("symbol").upper() == ticker_name.upper()):
                return True
            else:
                return Response('{"content": "Ticker not exist in Yahoo Finance Database."}', status=404, mimetype='application/json')    
        except Exception:
            return Response('{"content": "Ticker not exist in Yahoo Finance Database"}', status=404, mimetype='application/json')


# used by download bollinger graph button
@api.route('/download/<string:ticker_name>/<string:start_date>')
class TickerBollingerDownload(Resource):
    
    def get(self, ticker_name, start_date):
        yf.pdr_override()

        try:
            validate(start_date)
        except Exception:
            return Response('{"content": "Please provided correct date format (yyyy-MM-dd)"}', status=400, mimetype='application/json')
        ticker_name = ticker_name.upper()
        enddate = "2022-12-31"

        # download dataframe
        try:
            data = downloadData(ticker_name, start_date, enddate)
        except Exception:
            return Response('{"content": "error"}', status=400, mimetype='application/json')
            
        if (data is None):
            return Response('{"content": "This ticker does not exist"}', status=404, mimetype='application/json')

        # get the its ticker obj for futher info
        ticker = yf.Ticker(ticker_name)

        # process the data
        df_Boll = createBollinger(data, ticker_name, ticker, start_date, True)

        try:

            return send_file("plot-"+ticker_name+"-"+start_date+".png", mimetype='image/png', as_attachment=True, attachment_filename="plot-"+ticker_name+"-"+start_date+".png")
        except Exception as e:
            return str(e)

# used by dashboard, for trade bollinger graph
@api.route('/plain/<string:ticker_name>/<string:start_date>')
class TickerBollingerPlain(Resource):
    
    def get(self, ticker_name, start_date):
        yf.pdr_override()

        try:
            validate(start_date)
        except Exception:
            # return "Please provided correct date format (yyyy-MM-dd)"
            return Response('{"content": "Please provided correct date format (yyyy-MM-dd)"}', status=400, mimetype='application/json')
        ticker_name = ticker_name.upper()
        enddate = "2022-12-31"

        # download dataframe
        try:
            data = downloadData(ticker_name, start_date, enddate)
        except Exception:
            # return "This ticker does not exist"
            return Response('{"content": "error"}', status=400, mimetype='application/json')
            
        if (data is None):
            return Response('{"content": "This ticker does not exist"}', status=404, mimetype='application/json')

        # get the its ticker obj for futher info
        ticker = yf.Ticker(ticker_name)

        # process the data
        df_Boll = createBollinger(data, ticker_name, ticker, start_date)

        try:
            result = df_Boll.to_json(orient ='split')
            parsed = json.loads(result)
            return parsed
        except Exception as e:
            return str(e)


# used by dashboard, for buy/trade advice
@api.route('/<string:ticker_name>')
class Advice(Resource):
    
    def get(self, ticker_name):

        yf.pdr_override() # <== that's all it takes :-)
        start_date = "2019-12-01"
        enddate = "2022-12-31"
        ticker_name = ticker_name.upper()

        try:
            validate(start_date)
        except Exception:
            # return "Please provided correct date format (yyyy-MM-dd)"
            return Response('{"content": "Please provided correct date format (yyyy-MM-dd)"}', status=400, mimetype='application/json')

        # download dataframe
        try:
            data = downloadData(ticker_name, start_date, enddate)
        except Exception:
            # return "This ticker does not exist"
            return Response('{"content": "error"}', status=400, mimetype='application/json')
            
        if (data is None):
            return Response('{"content": "This ticker does not exist"}', status=404, mimetype='application/json')
        
        # get the its ticker obj for futher info
        ticker = yf.Ticker(ticker_name)

        # process the data
        df_Boll = createBollinger(data, ticker_name, ticker, start_date)

        # analyse the data
        action = analyseData(df_Boll, 20)

        return action


###################### helper functions ############################
def downloadData(ticker_name, start_date, enddate):
    data = pdr.get_data_yahoo(ticker_name, start_date, enddate)
    if (data.empty):
        # trade ticker is not exist
        return None

    return data

def createBollinger(df, ticker_name, ticker, start_date, download=False):
    df['20d mavg'] = df['Close'].rolling(window=20).mean()
    df['20d std'] = df['Close'].rolling(window=20).std()

    df['Upper Band'] = df['20d mavg'] + (df['20d std'] * 2)
    df['Lower Band'] = df['20d mavg'] - (df['20d std'] * 2)


    # list of column names for Bolliger band graph
    cols = ['20d mavg','Upper Band','Lower Band', 'Close']        
    df_Boll = df[cols]

    # give style
    plt.style.use('fivethirtyeight')
    fig = plt.figure(figsize=(12,6))
    ax = fig.add_subplot(111)

    # Get index values for the X axis for the DataFrame
    x_axis = df_Boll.index.get_level_values(0)

    # Plot shaded Bollinger Band
    ax.fill_between(x_axis, 
                    df_Boll['Upper Band'], 
                    df_Boll['Lower Band'], 
                    color='grey', alpha=0.4)

    ax.plot(x_axis, df_Boll['Close'], color='blue', lw=2)
    ax.plot(x_axis, df_Boll['20d mavg'], color='black', lw=2)

    # Set title and axis label
    ax.set_title('20 Day Bollinger Band For ' + ticker_name)
    ax.set_xlabel('Date (Year/Month)')
    currency = 'USD'
    try:
        if (currency in ticker.info.keys()):
            currency = ticker.info["currency"]
    except Exception:
        pass
    ax.set_ylabel('Price(' + currency + ')')

    # save image
    if download == True:
        plt.savefig("plot-" + ticker_name + "-" + start_date + ".png")

    return df_Boll

def analyseData(df_Boll, time_range):
    cols = ['20d mavg','Upper Band','Lower Band', 'Close']
    
    # get a range of time
    df = df_Boll[cols][-time_range:]
    
    buy_count = sell_count = hold_count = 0
    for index, row in df.iterrows():
        if (row['Close'] > row['Upper Band']):
            sell_count += 1
        elif (row['Close'] < row['Lower Band']):
            buy_count += 1
        else:
            hold_count += 1

    # get percentage of each buy/sell count
    buy_percent = buy_count/time_range
    sell_percent = sell_count/time_range

    # buy example (CL=F)
    if ((buy_percent > 0.18) & (buy_percent >= sell_percent)):
        return "buy"
    # sell example (PTON)
    elif ((sell_percent > 0.18) & (sell_percent >= buy_percent)):
        return "sell"
    else:
        return "hold"

def validate(date_text):
    try:
        datetime.datetime.strptime(date_text, '%Y-%m-%d')
    except ValueError:
        raise ValueError("Incorrect data format, should be YYYY-MM-DD")



if __name__ == "__main__":
    app.run(debug=True)
    