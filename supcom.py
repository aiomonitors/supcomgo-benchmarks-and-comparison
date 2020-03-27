import requests, time
from bs4 import BeautifulSoup

def GetDropListLink():
    s = requests.Session()
    resp = s.get("https://www.supremecommunity.com/season/latest/droplists/", headers={
        "authority":                 "www.supremecommunity.com",
        "cache-control":             "max-age=0",
        "upgrade-insecure-requests": "1",
        "user-agent":                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
        "sec-fetch-dest":            "document",
        "accept":                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "sec-fetch-site":            "none",
        "sec-fetch-mode":            "navigate",
        "sec-fetch-user":            "?1",
        "accept-language":           "en-US,en;q=0.9",
    }, timeout=3, allow_redirects=True)
    if resp != None:
        soup = BeautifulSoup(resp.text, 'lxml')
        link = soup.find("a", attrs={'class' : 'block'}).get('href')
        return link

def ScrapeDroplist(link):
    items = []
    s = requests.Session()
    resp = s.get(f"https://supremecommunity.com{link}", headers={
        "authority":                 "www.supremecommunity.com",
        "cache-control":             "max-age=0",
        "upgrade-insecure-requests": "1",
        "user-agent":                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
        "sec-fetch-dest":            "document",
        "accept":                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "sec-fetch-site":            "none",
        "sec-fetch-mode":            "navigate",
        "sec-fetch-user":            "?1",
        "accept-language":           "en-US,en;q=0.9",
    }, timeout=3, allow_redirects=True) 

    if resp.text != None:
        soup = BeautifulSoup(resp.text, 'lxml')
        for item in soup.find_all('div', attrs={'class' : 'masonry__item'}):
            dropItem = {}
            try:
                dropItem["Name"] = item.find('div', attrs={'class' : 'card-details'}).get('data-itemname')
                dropItem["Image"] = item.find('img', attrs={'class' : 'prefill-img'}).get('src')
                dropItem["Description"] = item.find('img', attrs={'class' : 'prefill-img'}).get('alt')
                dropItem["Category"] = item.find('p', attrs={'class' : 'category hidden'}).text.title()
                dropItem["Price"] = {}
                dropItem["Price"]["DollarPrice"] = f"${item.find('p', attrs={'class' : 'priceusd hidden'}).text}"
                dropItem["Price"]["PoundsPrice"] = f"£{item.find('p', attrs={'class' : 'pricegbp hidden'}).text}"
                dropItem["Price"]["FullPrice"] = f"{dropItem['Price']['DollarPrice']} / {dropItem['Price']['PoundsPrice']}"
                dropItem["Votes"] = {}
                dropItem["Votes"]["Upvotes"] = item.find('div', attrs={'class': 'progress-bar-success'}).text
                dropItem["Votes"]["Downvotes"] = item.find('div', attrs={'class': 'progress-bar-danger'}).text
                dropItem["Link"] = link

                items.append(dropItem)
            except:
                pass
    
    return items

def main():
    i = 1
    times = []
    while i < 11:
        try:
            t = time.time()
            link = GetDropListLink()
            items = ScrapeDroplist(link)
            execution = (time.time() - t) * 1000
            print(f"Iteration {i}; Total items: {len(items)}; Execution: {execution}ms")
            times.append(execution)
            i = i + 1
        except:
            pass
    total = 0
    for x in range(0, len(times)):
        total += times[x]
    print(f"Average over {len(times)} iterations: {total / len(times)}ms")
    
    
main()
#avg: 4908.882357857444
#avg: 4905.448746681213ms