const request = require('request-promise-native');
const cheerio = require('cheerio');


async function GetLatestLink() {
    let res = await request.get('https://www.supremecommunity.com/season/latest/droplists/', {
        resolveWithFullResponse: true,
        followAllRedirects: true,
        timeout: 3000,
        headers: {
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
        }
    })
    let body = await res.body;
    let $ = cheerio.load(body)
    let link = $('.block').attr('href');
    return link
}

async function ScrapeDroplist(link) {
    let res = await request.get(`https://www.supremecommunity.com${link}`, {
        resolveWithFullResponse: true,
        followAllRedirects: true,
        timeout: 3000,
        headers: {
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
        }
    })
    let body = await res.body
    let $ = cheerio.load(body)
    list = []
    $(".masonry__item").each(function(i, elem) {
		Item = {}

		Item.Name = $(elem).find("h2.name").text()
		if (Item.Name.length < 2) {
			return
		}
		Item.Name = Item.Name.replace('®', '')

		img = $(elem).find(".prefill-img").attr("src")
		if (img) {
			Item.Image = `https://www.supremecommunity.com${img}`
		}

		Item.Category = $(elem).find("p.category.hidden").text()
		if (Item.Category.length < 2) {
			Item.Category = "N/A"
		}

		desc = $(elem).find(".prefill-img").attr("alt")
		if (desc.length > 0) {
			if (desc.split('-').length > 1) {
				desc = desc.split('-')[1].trim()
			}
			Item.Description = desc.replace("®", "")
		}
        Item.Price = {}
		Item.Price.PoundsPrice = `£${$(elem).find("p.pricegbp.hidden").text()}`
		Item.Price.DollarPrice = `$${$(elem).find("p.priceusd.hidden").text()}`
        Item.Price.FullPrice = `${Item.Price.PoundsPrice} / ${Item.Price.DollarPrice}`
        
        Item.Votes = {}
		Item.Votes.Upvotes = $(elem).find("div.progress-bar.progress-bar-success").text()
		Item.Votes.Downvotes = $(elem).find("div.progress-bar.progress-bar-danger").text()
		Item.Link = link

		list.push(Item)
    })
    return list
}
(async() => {
    let times = []
    let i = 1 
    let iterations = 10;
    while (i <= 10) {
        try {
            start = new Date().getTime()
            let link = await GetLatestLink();
            let items = await ScrapeDroplist(link)
            end = new Date().getTime()
            times.push(end - start)
            console.log(`Iteration ${i}; Total Items: ${items.length}; Execution Time: ${end - start}ms`)
            i++
        } catch (err) {
            console.log('error, retrying')
        }
    }
    total = times.reduce((acc, curr) => acc + curr)
    console.log(`Average over ${times.length} iterations: ${total / times.length}ms`)
        
})();

//avg: 8465.454545454546
//avg: 8299.4