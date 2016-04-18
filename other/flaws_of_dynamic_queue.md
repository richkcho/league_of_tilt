## What is this?

After the introduction of Dynamic Queue for League of Legends, there has been some contention about the fairness of a system where it is possible for a group of five people to be matched up a group that is not a premade five. I did some analysis on high elo players to find out how dynamic queue works in high elo games. 

If you just want the tl;dr and numbers, skip to the bottom and read the **Results, TL;DR** section.

----------

## Data Collection:

I amassed 62112 matches which included at least one challenger or master player during the time interval Jan 14 2016 - Mar 30 2016. All of these matches are ranked dynamic queue 5x5. I attempted to obtain around 100 matches per player in challenger/master. (this varied depending on how many games a player has played, of course)

----------

## Finding the Premades:

The RiotAPI unfortunately doesn't give us information as to what the premade groups are. So I decided 
on a way of detecting what I would call "likely premades" by analyzing the graph of players and games. 

Each game consists of 10 people, 5 people per team. For a set of games, we can create an ally player graph where nodes are players and edges exist if players have played on the same team. Edges are weighted based on how many times players have played on the same team. We do the same process for players who were on opposing teams, creating an enemy player graph.

We then say that for some *n*, two players that have played on the same team for *n* or more games are premade. (in the graph, edges greater than or equal to *n*) We just have to chose *n* such that it is very unlikely for people not in a premade to have played *n* or more games together. I chose this cutoff based on the following reasoning: over a dataset this large, two non-premade players are just as likely to be enemies as they are to be allies. Given that players can't be "premade enemies," the enemy graph edge distribution is the distribution we expect if there were no premades. 99.97% of edges in the enemy graph have weight less than 10. With this I felt comfortable choosing 10 as my cutoff, since the matchmaking system shouldn't randomly put two people on the same team for more than 10 games given how many matches per player I aimed to obtain.

Premades then would be [cliques](https://en.wikipedia.org/wiki/Clique_(graph_theory)) in the ally graph with edge weights all 10 or greater. 

----------

## Results, TL;DR:

I then went back over my matches and processed them into premades. There were a total of 1478 games which had at least one 5 man premade. (this might be why Riot doesn't care, matches that include premade 5's statistically speaking are a small minority of matches) The team facing the 5 man premade had the following  distribution of premades:

- Number of 1,1,1,1,1: 339 (23%)
- Number of 2,1,1,1: 372 (25%)
- Number of 2,2,1: 75 (5%)
- Number of 3,1,1: 255 (17%)
- Number of 3,2: 50 (3%)
- Number of 4,1: 263 (18%)
- Number of 5: 124 (8%)

tl;dr Only 8% of games in high elo with a premade 5 are vs another premade 5. Nearly half of the games are premade 5 vs 3 or 5 solo players. This is unfortunate for the competitive scene in a game that tries to utilize a "Dynamic Queue" similar to what League of Legends is doing, since the high-elo part of the competitive scene suffers from these matchmaking imbalances. 