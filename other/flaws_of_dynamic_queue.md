## What is this?

After the introduction of Dynamic Queue for League of Legends, there has been some contention about the fairness of a system where it is possible for a group of five people to be matched up a group that is not a premade five. I did some analysis on high elo players to find out how dynamic queue works in high elo games. 

If you just want the tl;dr and numbers, skip to the bottom and read the **Results, TL;DR** section.

----------

## Data Collection:

I amassed 61977 matches which included at least one challenger or master player. The data scraping attempted to obtain around 100 of the most recent ranked matches per player in challenger/master in this case starting from April 23rd. (This would vary based on players activity, inactive players would have older games in their past 100 games compared to a more active player)

----------

## Finding the Premades:

The RiotAPI unfortunately doesn't give us information as to what the premade groups are. So I decided 
on a way of detecting what I would call "likely premades" by analyzing the graph of players and games. 

Each game consists of 10 people, 5 people per team. For a set of games, we can create an ally player [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)) where [nodes](https://en.wikipedia.org/wiki/Vertex_(graph_theory)) are players and edges exist if players have played on the same team. Edges are weighted based on how many times players have played on the same team. We do the same process for players who were on opposing teams, creating an enemy player graph. 

We then say that for some *n*, two players that have played on the same team for *n* or more games are premade. (in the graph, edges with weight greater than or equal to *n*) We just have to chose *n* such that it is very unlikely for people not in a premade to have played *n* or more games together. I chose this cutoff based on the following reasoning: over a dataset this large, two non-premade players are just as likely to be enemies as they are to be allies. Given that players can't be "premade enemies," the enemy graph edge distribution is the distribution we expect if there were no premades. 99.96% of edges in the enemy graph have weight less than 10. With this I felt comfortable choosing 10 as my cutoff, since the matchmaking system shouldn't randomly put two people on the same team for more than 10 games given how many matches per player I aimed to obtain.

Premades then would be [cliques](https://en.wikipedia.org/wiki/Clique_(graph_theory)) in the ally graph with edge weights all 10 or greater. 

----------

## Results, TL;DR:

The matches were analyzed to find premades, premades being a group of players who have played at least 10 games together on the same team. There were a total of 1129 games which had at least one 5 man premade. (this might be why Riot doesn't care, matches that include premade 5's statistically speaking are a small minority of matches) The team facing the 5 man premade had the following  distribution of premades:

- 5 solo: 255 (23%)
- 1 duo, 3 solo: 313 (28%)
- 2 duo, 1 solo: 58 (4%)
- 1 trio, 2 solo: 220 (19%)
- 1 trio, 1 duo: 45 (4%)
- 1 quad, 1 solo: 168 (15%)
- another 5 man premade: 70 (6%)

I also ran win-rate analysis. The win rates of the 5 man premade vs the other team based on the premade breakdown of the other team is as follows:

- vs 5 solo: 70% (179/255)
- vs 1 duo, 3 solo: 58% (183/313)
- vs 2 duo, 1 solo: 60% (35/58)
- vs 1 trio, 2 solo: 63% (138/220)
- vs 1 trio, 1 duo: 53% (24/45)
- vs 1 quad, 1 solo: 54% (91/168)

tl;dr Only 6% of games in high elo with a premade 5 are vs another premade 5. Over half of the games are premade 5 vs 3 or 5 solo players. In all of the matchups, the premade 5 is favored to win, sometimes overwhelmingly so in the case of vs five solo payers. This is unfortunate for the competitive scene in a game that tries to utilize a "Dynamic Queue" similar to what League of Legends is doing, since the high-elo part of the competitive scene suffers from these matchmaking imbalances. 

----------

## Extra:

There are also some _interesting_ structures in the graph. After applying force layout on the graph to get a better image, I found [this](https://github.com/richkcho/league_of_tilt/blob/master/other/tyxwx.png). This shows many groups of four that never have been recorded playing at the master/challenger elo except for with one fifth player, who has played many games with other master or challenger players. I can't say with certainty what is going on, but it is definitely not a randomly generated structure. 

---------

# Results Part 2: Limiting to 3-man Premades

So Riot decided to limit the premade size to three as a band-aid approach to fix the problems elaborated above. The natural question is is this fair?

I ran the same analysis on the dataset but this time focusing on 3-man premades. There were 8170 games with at least one 3-man premade (excluding any games with 4 or 5 man premade). The breakdown of the premade distributions of teams playing against a team with a 3-man premade were:

* 5 solo: 4012 (49%)
* 1 duo, 3 solo: 2978 (36%)
* 2 duo, 1 solo: 548 (7%)
* a group with a 3-man premade: 632 (8%)

Win rates were as follows:

* vs 5 solo: 61% (2464/4012)
* 1 duo, 3 solo: 54% (1604/2978)
* 2 duo, 1 solo: 52% (386/548)

tl;dr 3 man premade vs 3 man premade happened only 8% of the time. Half of the games were vs 5 solo, with the dissapointing win-rate of 61% (or awesome, depends on what stance you take). 