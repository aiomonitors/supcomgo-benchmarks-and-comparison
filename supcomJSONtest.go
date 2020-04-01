package main

import (
	"github.com/aiomonitors/supcomgo"
)

func main() {
	link := supcomgo.GetLatestDroplistLink()
	droplist := supcomgo.ScrapeDroplist(link)
	supcomgo.SaveAsJSON(droplist, "test.json")
}

//avg: 2298.5145860000002
//avg: 2389.3566401ms

