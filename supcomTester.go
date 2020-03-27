package main

import (
	"fmt"
	"time"

	"github.com/aiomonitors/supcomgo"
)

func main() {
	times := []float64{}
	totalIterations := 10
	for i := 1; i <= totalIterations; i++ {
		start := time.Now()
		link := supcomgo.GetLatestDroplistLink()
		items := supcomgo.ScrapeDroplist(link)
		elapsed := time.Since(start)
		times = append(times, elapsed.Seconds())
		fmt.Printf("Iteration: %v; Total items: %v; Execution time: %v\n", i, len(items), elapsed.Seconds()*1000)
	}
	total := float64(0)
	for _, time := range times {
		total += time * 1000
	}
	fmt.Printf("Average time over %v iterations: %vms\n", totalIterations, total/float64(len(times)))
}

//avg: 2298.5145860000002
//avg: 2389.3566401ms
