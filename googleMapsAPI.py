#Python script to pull data from google maps API and put it into a CSV

#imports
import requests #requests makes API calls
from requests.exceptions import HTTPError
import json
import csv
import time

#function to load in the config file
def getConfig():
    with open("config.json") as config:
        print("loading config file")
        return json.loads(config.read())

#function to get locationIds from Google
def getLocationsFromGoogle(config):
    #first, read in the list of locations and locationIds into a dictionary
    print("Getting locations from Google")
    locationIds = {}
    try:
        #open the csv file for reading
        with open(config['locationsFile'], newline='') as csvfile:
            #make a reader object for the csv file using the .reader() method
            csvreader = csv.reader(csvfile, delimiter=',')
            next(csvreader) #skip header rows
            #for each row in the reader, get the location Id from the name from google then add objects to the location dictionary the first column is the global location id, the second is the english name
            for row in csvreader:
                response = requests.get(config['findPlaceUrlPrefix'] + row[1] + "&key=" + apiKey)
                try:
                    googleId = response.json().get('candidates')#['candidates'][0]['place_id']
                    googleId = googleId[0].get('place_id')
                    locationIds[row[0]] = googleId
                    print(str(row[0]) + " " + str(googleId))
                except Exception as err:
                    print("There was an issue getting the google id for location: " + row[0])
                time.sleep(.05)
               
    except Exception as err:
        print("There was an issue loading the location ids. Make sure the filepath is correct " + str(err))
    #print(locationIds)
    return locationIds

#function to get locationIds from File
def getLocationsFromFile(config):
    print("Getting locations from file")
    locationIds = {}
    try:
        #open the csv file for reading
        with open(config['locationIdsFile'], newline='') as csvfile:
            #make a reader object for the csv file using the .reader() method
            csvreader = csv.reader(csvfile, delimiter=',')
            #for each row in the reader, get the location Id from the file then add objects to the location dictionary the first column is the global location id, the second is the english name
            for row in csvreader:
                locationIds[row[0]] = row[1]
                
               
    except Exception as err:
        print("There was an issue loading the location ids. Make sure the filepath is correct " + str(err))
    
    return locationIds

#function to get location json info from google maps
def getGoogleInfo(config, locationIds):
    print("Fetching location data")
    #print(locationIds)
    for locationId in locationIds:
        try:
            #craft the URL and make a request and store the response as a json object in the jsonData dictionary
            url = config['placesUrlPrefix'] + locationIds[locationId] + "&key=" + apiKey
            #print('Fetching data from: ' + url)
            response = requests.get(url)
            jd = response.json()
            jsonData[locationId] = jd['result']
            time.sleep(.05)

        #catch the errors from making the post and translating the json
        except HTTPError as http_err:
            print(f'HTP error occured: {http_err}')

        except Exception as err:
            print('An error has occured when parsing locations: ' + str(err))

    return jsonData


#function to write basic location information to a file
def outputBasicLocationInfo(config, jsonData, openType):
    print("writing basic info")
    #we start with the file for the regular data. The w means it's open for writing and overwriting, a would be open for append.
    with open(config['parkFile'], openType,  encoding="utf-8", newline='') as csvfile:
        csvwriter = csv.writer(csvfile, delimiter = ',')
        #write out the headers
        #csvwriter.writerow(['locationId', 'formattedAddress', 'lat', 'lng', 'phoneNumber', 'iconUrl', 'name', 'googleId', 'rating', 'totalRatings', 'website'])

        for data in jsonData:
            try:
                js = jsonData[data]
                loc = js['geometry']
                row = [data, js.get('formatted_address', ''), loc.get('location', '').get('lat', ''), loc.get('location', '').get('lng', ''), js.get('formatted_phone_number', ''), js.get('icon', ''), js.get('name', ''), js.get('place_id', ''), js.get('rating', ''), js.get('user_ratings_total', ''), js.get('website', '')]
                csvwriter.writerow(row)
            except Exception as err:
                print("Issue writting a location " + str(err) + " the location is: " + str(data))


def outputReviewInfo(config, jsonData, openType):
    print("Writing reviews")
        #now open the review datafile
    with open(config['reviewFile'], openType,  encoding="utf-8", newline='') as csvfile:
        cw = csv.writer(csvfile, delimiter = ',')
        #cw.writerow(['locationId', 'reviewId', 'language', 'author', 'rating', 'text', 'time'])
        reviewId = 0

        for data in jsonData:
            try: 
                js = jsonData.get(data)
                js = js.get('reviews')
                for review in js:
                    row = [data, reviewId, review.get('language', ''), review.get('author_name', ''), review.get('rating', ''), review.get('text', ''), review.get('time','')]
                    cw.writerow(row)
                    reviewId += 1
            except Exception as err:
                print("Issue writting a review " + str(err))

#Main section

locationIds = {}
jsonData = {}
config = getConfig() #get the config file which includes URLs and apiKey
apiKey = config['apiKey']

#get locations
if config.get('locationIdsFile', "") != "":
    locationIds = getLocationsFromFile(config)

else:
    locationIds = getLocationsFromGoogle(config)

#if we could get locations, load info from google
if locationIds:
    jsonData = getGoogleInfo(config, locationIds)
else:
    print("There were no locations, try again")

#Now it's time to print out the google json data to the write files
if jsonData:
    outputBasicLocationInfo(config, jsonData, 'a')
    outputReviewInfo(config, jsonData, 'a')






           



    
