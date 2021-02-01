#Python script to pull data from google maps API and put it into a CSV

#imports
import requests #requests makes API calls
from requests.exceptions import HTTPError
import json
import csv

#Variables

apiKey = "AIzaSyBJ2dwZkpz0ewcMB_qvbGyrZBEYIFf5D9E"
urlPrefix = "https://maps.googleapis.com/maps/api/place/details/json?place_id="
writeFile = 'C:/Users/Bryan Rogers/Dropbox/MCIT/CIS550/Project/Parks.csv'
reviewFile = 'C:/Users/Bryan Rogers/Dropbox/MCIT/CIS550/Project/Reviews.csv'
locationIdFile = "C:/Users/Bryan Rogers/Dropbox/MCIT/CIS550/Project/ParkTest.csv"
locationIds = {}
jsonData = {}

#first, read in the list of locations and locationIds into a dictionary
try:
    #open the csv file for reading
    with open(locationIdFile, newline='') as csvfile:
        #make a reader object for the csv file using the .reader() method
        csvreader = csv.reader(csvfile, delimiter=',')
        #for each row in the reader, add objects to the location dictionary the first column is the global location id, the second is the english name, third is googleId
        for row in csvreader:
            
            locationIds[row[0]] = row[2]
           
except Exception as err:
    print("There was an issue loading the location ids. Make sure the filepath is correct")

#Section to make a request for each location in the spreadsheet

for locationId in locationIds:
    try:
        #craft the URL and make a request and store the response as a json object in the jsonData dictionary
        url = urlPrefix + locationIds[locationId] + "&key=" + apiKey
        print('Fetching data from: ' + url)
        response = requests.get(url)
        jd = response.json()
        jsonData[locationId] = jd['result']
        #print(jsonData[locationId])

    #catch the errors from making the post and translating the json
    except HTTPError as http_err:
        print(f'HTP error occured: {http_err}')

    except Exception as err:
        print('An error has occured when parsing locations: ' + err)


#Now it's time to print out the google json data to the write files

#we start with the file for the regular data. The w means it's open for writing and overwriting, a would be open for append.
with open(writeFile, 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile, delimiter = ',')
    #write out the headers
    csvwriter.writerow(['locationId', 'formattedAddress', 'lat', 'lng', 'phoneNumber', 'iconUrl', 'name', 'googleId', 'rating', 'totalRatings', 'website'])

    for data in jsonData:
        js = jsonData[data]
        loc = js['geometry']
        row = [data, js['formatted_address'], loc['location']['lat'], loc['location']['lng'], js['formatted_phone_number'], js['icon'], js['name'], js['place_id'], js['rating'], js['user_ratings_total'], js['website']]
        csvwriter.writerow(row)

#now open the review datafile
with open(reviewFile, 'w', newline='') as csvfile:
    cw = csv.writer(csvfile, delimiter = ',')
    cw.writerow(['locationId', 'reviewId', 'language', 'author', 'rating', 'text', 'time'])
    reviewId = 0

    for data in jsonData:
        js = jsonData[data]
        js = js['reviews']
        for review in js:
            row = [data, reviewId, review['language'], review['author_name'], review['rating'], review['text'], review['time']]
            cw.writerow(row)
            reviewId += 1
        
        
    
