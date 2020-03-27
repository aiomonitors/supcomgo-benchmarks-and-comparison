# Supreme Community Scraping Benchmarks

I decided to performance test my [Supreme Community GoLang Package](https://github.com/aiomonitors/supcomgo)
because I was curious about how GoLang performed compared to the other langauges I know. All three programs
in this repo use the same design, and do not include delivering webhooks / other means of processing the data.

### Results
| Language       | Average Execution over 20 iterations | Dependencies                  | 
| -------------- | :----------------------------------: | ------------                  |
| **GoLang**     | 2343ms                               | `fmt`, `time`, `strings`, `net/http`, `github.com/aiomonitors/supcomgo/embeds`, `github.com/PuerkitoBio/goquery` |
| **Python 3.6** | 4905ms                               | `requests`, `time`, `bs4` |
| **Node.JS**    | 8382ms                               | `request-promise-native`, `cheerio` |

Not surprised.

[Twitter](https://twitter.com/aiomonitors)

[Personal Site](https://navrxo.com)

