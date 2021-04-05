#Python script to generate a bunch of insert into statements from a CSV
import csv


#get the filename and name of the table
def getInfo():
    infoDict = {}

    infoDict["table"] = input("Enter the name of the table to put the data: ")
    infoDict["file"] = input("Enter the absolute path to the CSV file: ")
    print(infoDict["table"])
    print(infoDict["file"])
    return infoDict


def processFile(filename, tablename):

    prefix = "INSERT INTO " + tablename + " ("
    with open(filename, 'r', encoding="utf-8", newline='') as csvfile:
        csvreader = csv.reader(csvfile, delimiter = ',')
        headers = next(csvreader)
        columnNums = len(headers)

        for x in range(columnNums):
            if (x == columnNums -1):
                prefix += str(headers[x]) + ") "
            else:
                prefix += str(headers[x]) + ", "
        rowCount = 0
        for row in csvreader:
            if  (rowCount <= 11):
                suffix = " VALUES("
                for x in range(columnNums):
                    text = str(row[x]).encode('unicode-escape').decode('utf-8').replace('"', '')
                    if (x == columnNums -1):
                        suffix += '"' + text + '");'
                    else:
                        suffix += '"' + text + '", '

                print(prefix + suffix)
            rowCount += 1


values = getInfo()
processFile(values["file"],values["table"])
