# package imports
from bs4 import BeautifulSoup
import requests

import pandas as pd


def get_full_state_name(state_code):
    state_name_dict = {'AL': 'Alabama',
         'AK': 'Alaska',
         'AS': 'American Samoa',
         'AZ': 'Arizona',
         'AR': 'Arkansas',
         'CA': 'California',
         'CO': 'Colorado',
         'CT': 'Connecticut',
         'DE': 'Delaware',
         'DC': 'District of Columbia',
         'FL': 'Florida',
         'GA': 'Georgia',
         'GU': 'Guam',
         'HI': 'Hawaii',
         'ID': 'Idaho',
         'IL': 'Illinois',
         'IN': 'Indiana',
         'IA': 'Iowa',
         'KS': 'Kansas',
         'KY': 'Kentucky',
         'LA': 'Louisiana',
         'ME': 'Maine',
         'MD': 'Maryland',
         'MA': 'Massachusetts',
         'MI': 'Michigan',
         'MN': 'Minnesota',
         'MS': 'Mississippi',
         'MO': 'Missouri',
         'MT': 'Montana',
         'NE': 'Nebraska',
         'NV': 'Nevada',
         'NH': 'New Hampshire',
         'NJ': 'New Jersey',
         'NM': 'New Mexico',
         'NY': 'New York',
         'NC': 'North Carolina',
         'ND': 'North Dakota',
         'MP': 'Northern Mariana Islands',
         'OH': 'Ohio',
         'OK': 'Oklahoma',
         'OR': 'Oregon',
         'PA': 'Pennsylvania',
         'PR': 'Puerto Rico',
         'RI': 'Rhode Island',
         'SC': 'South Carolina',
         'SD': 'South Dakota',
         'TN': 'Tennessee',
         'TX': 'Texas',
         'UT': 'Utah',
         'VT': 'Vermont',
         'VI': 'Virgin Islands',
         'VA': 'Virginia',
         'WA': 'Washington',
         'WV': 'West Virginia',
         'WI': 'Wisconsin',
         'WY': 'Wyoming'}
    return state_name_dict[state_code]


def make_park_url(name, state):
    # get full name from park code
    state_name = get_full_state_name(state).lower() 
    # deal with spaces in state
    state_name = '-'.join(state_name.split(' '))
    
    # deal with apostrophe characters in park name
    park_name = name.replace("'", '').lower()
    # deal with spaces
    park_name = '-'.join(park_name.split(' '))
    
    # fix broken park name for Haleakala National Park
    if 'haleak' in park_name:
        park_name = 'haleakala-national-park'
        
    url = "http://www.alltrails.com/parks/us/%s/%s"%(state_name, park_name)
    return url


def get_page_soup(url):
    ## added based on: https://stackoverflow.com/questions/38489386/python-requests-403-forbidden
    # goto Chrome developer tab, execute > navigator.userAgent to get thisinfo
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36'}

    response = requests.get(url,headers=headers)
    page = response.text
    soup = BeautifulSoup(page, 'html.parser')
    return soup

def parse_top_ten_hikes(soup):
    rows = []
    # get info from each trail card on top 10 page

    for card in soup.select('div[class*="trailCard"]'):
        trailname = card.find('a').get_text()
        park = card.select('a[class*="xlate-none styles-module__location"]')[0].get_text()
        difficulty = card.select('span[class*="styles-module__diff"]')[0].get_text()
        try:
            description = card.select('div[class*="xlate-none styles-module__description"]')[0].get_text()
        except IndexError as e:
            description = ''
        other = None; distance= None; time = None;
        for val in card.select('span[class="xlate-none"]'):
            entry = val.get_text()
            if 'Length' in entry:
                distance = entry.split(': ')[-1]
            elif 'Est' in entry:
                time = entry.split('. ')[-1]
            else:
                other = entry

        rows.append([trailname,park,difficulty,distance,time,description,other])

    top_hikes = pd.DataFrame(rows, columns=['name','park','difficulty','distance','time','description','other'])
    return top_hikes


    
    

if __name__ == "__main__":
    all_hikes = []
    
    # parse top 10 hikes for each national park in this csv
    natparks = pd.read_csv('national_park_list.csv')
    for it,park in natparks.iterrows():
       
        # since some parks are in multple states, try all urls
        states = park['states'].split(',')
        
        for state in states:
            url = make_park_url(park['fullName'], state)
            soup = get_page_soup(url)
            all_hikes.append(parse_top_ten_hikes(soup))
            
    pd.concat(all_hikes).to_csv('top_hikes_by_park.csv',index=None)
    print('Wrote file:  top_hikes_by_park.csv ')